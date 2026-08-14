/**
 * Multi-tenant request context.
 *
 * Every authenticated tenant operation should establish:
 *   currentUser, currentOrganization, currentRole, currentPermissions
 *
 * Tenant identity comes from verified domain/subdomain + membership —
 * never from a client-supplied organization_id alone.
 */

import { prisma } from '@/lib/db/prisma';
import type { MembershipRole } from '@prisma/client';
import { resolveInstitutionByHost } from '@/lib/learn/institutionDomains';
import { permissionsFor, type Permission } from './permissions';
import { getTenantDatabaseConfig, type TenantDbHealth } from './tenantDb';
import { databaseModeFromDeployment, type TenantDatabaseMode } from './databaseModes';

export type TenantOrganization = {
  id: string;
  slug: string;
  name: string;
  primaryColor: string;
  logoUrl: string | null;
  customDomain: string | null;
  subdomain: string | null;
  domainStatus: string;
  status: string;
  capabilityPack: string;
  enabledModules: string[];
  featuresEnabled: string[];
  isPlatformHome: boolean;
  databaseMode: TenantDatabaseMode;
};

export type TenantContext = {
  currentUser: {
    id: string;
    email: string | null;
    name: string | null;
    globalRole: string;
  } | null;
  currentOrganization: TenantOrganization | null;
  currentRole: MembershipRole | null;
  currentPermissions: Permission[];
  membershipActive: boolean;
  database: TenantDbHealth | null;
  resolvedFrom: 'host' | 'slug' | 'id' | 'none';
};

async function loadOrganization(where: {
  id?: string;
  slug?: string;
}): Promise<TenantOrganization | null> {
  try {
    const inst = await prisma.institution.findFirst({
      where: where.id ? { id: where.id } : { slug: where.slug },
      select: {
        id: true,
        slug: true,
        name: true,
        primaryColor: true,
        logoUrl: true,
        customDomain: true,
        subdomain: true,
        domainStatus: true,
        status: true,
        capabilityPack: true,
        enabledModules: true,
        featuresEnabled: true,
        isPlatformHome: true,
        deploymentModel: true,
        federationLink: { select: { databaseMode: true } },
      },
    });
    if (!inst) return null;

    const databaseMode = (inst.federationLink?.databaseMode ||
      databaseModeFromDeployment(inst.deploymentModel)) as TenantDatabaseMode;

    return {
      id: inst.id,
      slug: inst.slug,
      name: inst.name,
      primaryColor: inst.primaryColor,
      logoUrl: inst.logoUrl,
      customDomain: inst.customDomain,
      subdomain: inst.subdomain,
      domainStatus: inst.domainStatus,
      status: inst.status,
      capabilityPack: inst.capabilityPack,
      enabledModules: inst.enabledModules,
      featuresEnabled: inst.featuresEnabled,
      isPlatformHome: inst.isPlatformHome,
      databaseMode,
    };
  } catch (err) {
    const { isMissingPrismaColumn } = await import('./prismaErrors');
    if (!isMissingPrismaColumn(err)) throw err;
    const inst = await prisma.institution.findFirst({
      where: where.id ? { id: where.id } : { slug: where.slug },
      select: {
        id: true,
        slug: true,
        name: true,
        primaryColor: true,
        logoUrl: true,
        customDomain: true,
        subdomain: true,
        domainStatus: true,
        status: true,
        capabilityPack: true,
        enabledModules: true,
        featuresEnabled: true,
        isPlatformHome: true,
        deploymentModel: true,
      },
    });
    if (!inst) return null;
    return {
      id: inst.id,
      slug: inst.slug,
      name: inst.name,
      primaryColor: inst.primaryColor,
      logoUrl: inst.logoUrl,
      customDomain: inst.customDomain,
      subdomain: inst.subdomain,
      domainStatus: inst.domainStatus,
      status: inst.status,
      capabilityPack: inst.capabilityPack,
      enabledModules: inst.enabledModules,
      featuresEnabled: inst.featuresEnabled,
      isPlatformHome: inst.isPlatformHome,
      databaseMode: databaseModeFromDeployment(inst.deploymentModel) as TenantDatabaseMode,
    };
  }
}

/**
 * Resolve tenant from an incoming Host header (custom domain or subdomain).
 */
export async function resolveTenantFromHost(
  host: string | null | undefined,
): Promise<TenantOrganization | null> {
  const hit = await resolveInstitutionByHost(host);
  if (!hit) return null;
  return loadOrganization({ slug: hit.slug });
}

/**
 * Build full tenant context for a request.
 * Prefer host resolution; fall back to explicit slug only when host is the platform.
 */
export async function buildTenantContext(opts: {
  host?: string | null;
  slug?: string | null;
  institutionId?: string | null;
  userId?: string | null;
}): Promise<TenantContext> {
  let org: TenantOrganization | null = null;
  let resolvedFrom: TenantContext['resolvedFrom'] = 'none';

  if (opts.host) {
    org = await resolveTenantFromHost(opts.host);
    if (org) resolvedFrom = 'host';
  }
  if (!org && opts.institutionId) {
    org = await loadOrganization({ id: opts.institutionId });
    if (org) resolvedFrom = 'id';
  }
  if (!org && opts.slug) {
    org = await loadOrganization({ slug: opts.slug });
    if (org) resolvedFrom = 'slug';
  }

  let currentUser: TenantContext['currentUser'] = null;
  let currentRole: MembershipRole | null = null;
  let membershipActive = false;
  let currentPermissions: Permission[] = [];

  if (opts.userId) {
    const user = await prisma.user.findUnique({
      where: { id: opts.userId },
      select: { id: true, email: true, name: true, globalRole: true },
    });
    if (user) {
      currentUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        globalRole: user.globalRole,
      };
    }

    if (user && org) {
      const membership = await prisma.institutionMembership.findUnique({
        where: {
          institutionId_userId: { institutionId: org.id, userId: user.id },
        },
        select: { role: true, isActive: true, suspendedAt: true },
      });
      if (membership && membership.isActive && !membership.suspendedAt) {
        currentRole = membership.role;
        membershipActive = true;
        currentPermissions = permissionsFor(membership.role);
      }
    }
  }

  const database = org ? await getTenantDatabaseConfig(org.id) : null;

  return {
    currentUser,
    currentOrganization: org,
    currentRole,
    currentPermissions,
    membershipActive,
    database,
    resolvedFrom,
  };
}

/** Assert the caller may operate inside an organization. */
export function assertTenantAccess(
  ctx: TenantContext,
  required?: Permission | Permission[],
): { ok: true } | { ok: false; error: string } {
  if (!ctx.currentOrganization) return { ok: false, error: 'organization_required' };
  if (!ctx.currentUser) return { ok: false, error: 'authentication_required' };
  if (!ctx.membershipActive && ctx.currentUser.globalRole === 'USER') {
    return { ok: false, error: 'membership_required' };
  }
  // Platform admins may inspect any tenant when authorized.
  if (
    ctx.currentUser.globalRole === 'PLATFORM_ADMIN' ||
    ctx.currentUser.globalRole === 'PLATFORM_OWNER'
  ) {
    return { ok: true };
  }
  if (!required) return { ok: true };
  const needed = Array.isArray(required) ? required : [required];
  for (const p of needed) {
    if (!ctx.currentPermissions.includes(p)) {
      return { ok: false, error: `missing_permission:${p}` };
    }
  }
  return { ok: true };
}
