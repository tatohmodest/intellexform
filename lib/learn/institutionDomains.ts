/**
 * Institution custom domains & subdomains.
 *
 * Campuses can request a hostname change; InTelleX Platform Admin approves,
 * activates, changes, or revokes it. Active hosts resolve to the campus portal.
 */

import { getDb } from '@/lib/repo';
import { prisma } from '@/lib/db/prisma';

export type DomainStatus = 'none' | 'pending' | 'active' | 'rejected';

export type InstitutionDomainView = {
  slug: string;
  name: string;
  customDomain: string | null;
  subdomain: string | null;
  pendingCustomDomain: string | null;
  domainStatus: DomainStatus;
  domainVerifiedAt: string | null;
  domainNotes: string | null;
  /** Where the institution should point their CNAME. */
  cnameTarget: string;
};

const PLATFORM_HOSTS = new Set(
  [
    'localhost',
    '127.0.0.1',
    process.env.APP_PUBLIC_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_URL,
    ...(process.env.PLATFORM_HOSTS || '').split(','),
  ]
    .filter(Boolean)
    .map((h) =>
      String(h)
        .replace(/^https?:\/\//, '')
        .replace(/\/$/, '')
        .split(':')[0]
        .toLowerCase(),
    ),
);

export function platformCnameTarget(): string {
  const raw =
    process.env.CAMPUS_CNAME_TARGET ||
    process.env.APP_PUBLIC_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'cname.intellex.cm';
  return String(raw)
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .split('/')[0]
    .toLowerCase();
}

export function normalizeHostname(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const host = String(raw)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .split('/')[0]
    .split(':')[0]
    .replace(/\.$/, '');
  if (!host || host.length < 3) return null;
  if (!/^[a-z0-9.-]+$/.test(host)) return null;
  if (host.startsWith('.') || host.endsWith('.') || host.includes('..')) return null;
  return host;
}

export function isPlatformHost(host: string | null | undefined): boolean {
  const h = normalizeHostname(host);
  if (!h) return true;
  if (PLATFORM_HOSTS.has(h)) return true;
  // Vercel preview / default hosts stay on the main app.
  if (h.endsWith('.vercel.app')) return true;
  return false;
}

export function domainLabel(status: DomainStatus): string {
  if (status === 'active') return 'Active';
  if (status === 'pending') return 'Pending approval';
  if (status === 'rejected') return 'Rejected';
  return 'Not configured';
}

async function ensureDomainIndexes() {
  try {
    const db = await getDb();
    await Promise.all([
      db.collection('institutions').createIndex({ customDomain: 1 }, { unique: true, sparse: true }),
      db.collection('institutions').createIndex({ subdomain: 1 }, { unique: true, sparse: true }),
      db.collection('institutions').createIndex({ pendingCustomDomain: 1 }, { sparse: true }),
    ]).catch(() => {});
  } catch {
    /* ignore */
  }
}

function toView(doc: Record<string, unknown>): InstitutionDomainView {
  const status = (String(doc.domainStatus || 'none') as DomainStatus) || 'none';
  return {
    slug: String(doc.slug),
    name: String(doc.name || doc.slug),
    customDomain: doc.customDomain ? String(doc.customDomain) : null,
    subdomain: doc.subdomain ? String(doc.subdomain) : null,
    pendingCustomDomain: doc.pendingCustomDomain ? String(doc.pendingCustomDomain) : null,
    domainStatus: ['none', 'pending', 'active', 'rejected'].includes(status) ? status : 'none',
    domainVerifiedAt: doc.domainVerifiedAt
      ? new Date(doc.domainVerifiedAt as Date | string).toISOString()
      : null,
    domainNotes: doc.domainNotes ? String(doc.domainNotes) : null,
    cnameTarget: platformCnameTarget(),
  };
}

export async function getInstitutionDomain(slug: string): Promise<InstitutionDomainView | null> {
  try {
    await ensureDomainIndexes();
    const db = await getDb();
    const doc = await db.collection('institutions').findOne({ slug });
    if (!doc) return null;
    return toView(doc as Record<string, unknown>);
  } catch {
    return null;
  }
}

/**
 * Resolve an incoming Host header to a campus slug.
 * Checks active customDomain, then platform subdomain label.
 */
export async function resolveInstitutionByHost(
  hostRaw: string | null | undefined,
): Promise<{ slug: string; name: string; customDomain: string | null; subdomain: string | null } | null> {
  const host = normalizeHostname(hostRaw);
  if (!host || isPlatformHost(host)) return null;

  try {
    await ensureDomainIndexes();
    const db = await getDb();

    // Active custom host still resolves during a pending *change* request.
    const byCustom = await db.collection('institutions').findOne({
      customDomain: host,
      $or: [{ domainStatus: 'active' }, { domainStatus: 'pending' }],
    });
    if (byCustom && byCustom.customDomain) {
      return {
        slug: String(byCustom.slug),
        name: String(byCustom.name || byCustom.slug),
        customDomain: String(byCustom.customDomain),
        subdomain: byCustom.subdomain ? String(byCustom.subdomain) : null,
      };
    }

    // {subdomain}.{platform-apex} → campus
    const cnameTarget = platformCnameTarget();
    const parts = host.split('.');
    if (parts.length >= 2) {
      const label = parts[0];
      const parent = parts.slice(1).join('.');
      const parentIsPlatform =
        PLATFORM_HOSTS.has(parent) ||
        parent === cnameTarget ||
        host === `${label}.${cnameTarget}` ||
        (cnameTarget.includes('.') && parent === cnameTarget);

      if (parentIsPlatform && label) {
        const bySub = await db.collection('institutions').findOne({
          subdomain: label,
          $or: [{ domainStatus: 'active' }, { domainStatus: 'pending' }],
        });
        if (bySub) {
          return {
            slug: String(bySub.slug),
            name: String(bySub.name || bySub.slug),
            customDomain: bySub.customDomain ? String(bySub.customDomain) : null,
            subdomain: label,
          };
        }
      }
    }

    // Prisma fallback when Mongo is missing the row but Prisma was updated.
    try {
      const prismaHit = await prisma.institution.findFirst({
        where: {
          customDomain: host,
          domainStatus: { in: ['active', 'pending'] },
        },
        select: { slug: true, name: true, customDomain: true, subdomain: true },
      });
      if (prismaHit) {
        return {
          slug: prismaHit.slug,
          name: prismaHit.name,
          customDomain: prismaHit.customDomain,
          subdomain: prismaHit.subdomain,
        };
      }
    } catch {
      /* schema may not be pushed yet */
    }

    return null;
  } catch (err) {
    console.error('resolveInstitutionByHost failed:', err);
    return null;
  }
}

async function syncDomainToPrisma(slug: string, patch: {
  customDomain: string | null;
  subdomain: string | null;
  domainStatus: DomainStatus;
  pendingCustomDomain: string | null;
  domainVerifiedAt: Date | null;
  domainNotes: string | null;
}) {
  try {
    await prisma.institution.updateMany({
      where: { slug },
      data: {
        customDomain: patch.customDomain,
        subdomain: patch.subdomain,
        domainStatus: patch.domainStatus,
        pendingCustomDomain: patch.pendingCustomDomain,
        domainVerifiedAt: patch.domainVerifiedAt,
        domainNotes: patch.domainNotes,
      },
    });
  } catch (err) {
    console.error('syncDomainToPrisma failed:', err);
  }
}

async function assertDomainAvailable(
  host: string,
  exceptSlug?: string,
): Promise<{ ok: true } | { error: 'domain_taken' }> {
  const db = await getDb();
  const taken = await db.collection('institutions').findOne({
    $or: [{ customDomain: host }, { pendingCustomDomain: host }],
    ...(exceptSlug ? { slug: { $ne: exceptSlug } } : {}),
  });
  if (taken) return { error: 'domain_taken' };
  try {
    const prismaTaken = await prisma.institution.findFirst({
      where: {
        OR: [{ customDomain: host }, { pendingCustomDomain: host }],
        ...(exceptSlug ? { slug: { not: exceptSlug } } : {}),
      },
      select: { slug: true },
    });
    if (prismaTaken) return { error: 'domain_taken' };
  } catch {
    /* prisma may lack columns until push */
  }
  return { ok: true };
}

/** Campus owner requests a custom domain (or a change). */
export async function requestInstitutionDomain(opts: {
  slug: string;
  ownerId: string;
  domain: string;
  subdomain?: string | null;
}): Promise<{ ok: true; domain: InstitutionDomainView } | { error: string }> {
  const host = normalizeHostname(opts.domain);
  if (!host) return { error: 'invalid_domain' };
  if (isPlatformHost(host)) return { error: 'platform_host' };

  const sub = opts.subdomain
    ? String(opts.subdomain)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '')
        .slice(0, 48)
    : null;
  if (opts.subdomain && !sub) return { error: 'invalid_subdomain' };

  await ensureDomainIndexes();
  const db = await getDb();
  const inst = await db.collection('institutions').findOne({ slug: opts.slug });
  if (!inst) return { error: 'not_found' };
  if (String(inst.ownerId) !== opts.ownerId) return { error: 'forbidden' };

  const avail = await assertDomainAvailable(host, opts.slug);
  if ('error' in avail) return { error: avail.error };

  if (sub) {
    const subTaken = await db.collection('institutions').findOne({
      subdomain: sub,
      slug: { $ne: opts.slug },
    });
    if (subTaken) return { error: 'subdomain_taken' };
  }

  const hadActive = Boolean(inst.customDomain);
  // Keep the live host working while a change is pending approval.
  const nextStatus: DomainStatus = hadActive ? 'active' : 'pending';

  await db.collection('institutions').updateOne(
    { slug: opts.slug },
    {
      $set: {
        pendingCustomDomain: host,
        domainStatus: nextStatus,
        ...(sub ? { subdomain: sub } : {}),
        domainNotes: null,
        updatedAt: new Date(),
      },
    },
  );

  await syncDomainToPrisma(opts.slug, {
    customDomain: (inst.customDomain as string) || null,
    subdomain: sub || (inst.subdomain as string) || null,
    domainStatus: nextStatus,
    pendingCustomDomain: host,
    domainVerifiedAt: inst.domainVerifiedAt ? new Date(inst.domainVerifiedAt as Date) : null,
    domainNotes: null,
  });

  const view = await getInstitutionDomain(opts.slug);
  return view ? { ok: true, domain: view } : { error: 'not_found' };
}

/** Platform Admin activates, rejects, changes, or clears a campus domain. */
export async function manageInstitutionDomain(opts: {
  slug: string;
  action: 'approve' | 'reject' | 'activate' | 'revoke' | 'set' | 'cancel_pending';
  domain?: string | null;
  subdomain?: string | null;
  notes?: string | null;
  actorEmail?: string;
}): Promise<{ ok: true; domain: InstitutionDomainView } | { error: string }> {
  await ensureDomainIndexes();
  const db = await getDb();
  const inst = await db.collection('institutions').findOne({ slug: opts.slug });
  if (!inst) return { error: 'not_found' };

  const $set: Record<string, unknown> = { updatedAt: new Date() };

  if (opts.action === 'approve' || opts.action === 'activate') {
    const host =
      normalizeHostname(opts.domain) ||
      normalizeHostname(inst.pendingCustomDomain as string) ||
      normalizeHostname(inst.customDomain as string);
    if (!host) return { error: 'no_domain' };
    const avail = await assertDomainAvailable(host, opts.slug);
    if ('error' in avail) return { error: avail.error };
    $set.customDomain = host;
    $set.pendingCustomDomain = null;
    $set.domainStatus = 'active';
    $set.domainVerifiedAt = new Date();
    $set.domainNotes =
      opts.notes?.trim() ||
      `Domain approved by ${opts.actorEmail || 'Platform Admin'}.`;
  } else if (opts.action === 'reject') {
    $set.pendingCustomDomain = null;
    $set.domainStatus = inst.customDomain ? 'active' : 'rejected';
    $set.domainNotes = opts.notes?.trim() || 'Domain request rejected by Platform Admin.';
  } else if (opts.action === 'cancel_pending') {
    if (!inst.pendingCustomDomain) return { error: 'nothing_pending' };
    $set.pendingCustomDomain = null;
    $set.domainStatus = inst.customDomain ? 'active' : 'none';
    $set.domainNotes = opts.notes?.trim() || 'Pending domain request cancelled.';
  } else if (opts.action === 'revoke') {
    $set.customDomain = null;
    $set.pendingCustomDomain = null;
    $set.domainStatus = 'none';
    $set.domainVerifiedAt = null;
    $set.domainNotes = opts.notes?.trim() || 'Domain revoked by Platform Admin.';
  } else if (opts.action === 'set') {
    // Direct set/change by Platform (handles domain change without owner round-trip).
    const host = normalizeHostname(opts.domain);
    if (!host) return { error: 'invalid_domain' };
    if (isPlatformHost(host)) return { error: 'platform_host' };
    const avail = await assertDomainAvailable(host, opts.slug);
    if ('error' in avail) return { error: avail.error };
    $set.customDomain = host;
    $set.pendingCustomDomain = null;
    $set.domainStatus = 'active';
    $set.domainVerifiedAt = new Date();
    $set.domainNotes = opts.notes?.trim() || `Domain set by ${opts.actorEmail || 'Platform Admin'}.`;
  } else {
    return { error: 'unknown_action' };
  }

  if (opts.subdomain !== undefined) {
    const sub = opts.subdomain
      ? String(opts.subdomain)
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '')
          .slice(0, 48)
      : null;
    if (opts.subdomain && !sub) return { error: 'invalid_subdomain' };
    if (sub) {
      const subTaken = await db.collection('institutions').findOne({
        subdomain: sub,
        slug: { $ne: opts.slug },
      });
      if (subTaken) return { error: 'subdomain_taken' };
    }
    $set.subdomain = sub;
  }

  await db.collection('institutions').updateOne({ slug: opts.slug }, { $set });

  const next = await db.collection('institutions').findOne({ slug: opts.slug });
  await syncDomainToPrisma(opts.slug, {
    customDomain: (next?.customDomain as string) || null,
    subdomain: (next?.subdomain as string) || null,
    domainStatus: (String(next?.domainStatus || 'none') as DomainStatus) || 'none',
    pendingCustomDomain: (next?.pendingCustomDomain as string) || null,
    domainVerifiedAt: next?.domainVerifiedAt ? new Date(next.domainVerifiedAt as Date) : null,
    domainNotes: (next?.domainNotes as string) || null,
  });

  const view = await getInstitutionDomain(opts.slug);
  return view ? { ok: true, domain: view } : { error: 'not_found' };
}
