import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  isPlatformHost,
  resolveInstitutionByHost,
} from '@/lib/learn/institutionDomains';
import { CANONICAL_SITE_URL } from '@/lib/platformHosts';

export const dynamic = 'force-dynamic';

/**
 * Entry for custom campus hostnames.
 * Middleware rewrites unknown hosts here; we resolve Host → campus and redirect.
 * Unknown / unmatched hosts fall back to the main InTelleX site (never a bare 404).
 */
export default async function CampusGatewayPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const host =
    headers().get('x-campus-host') ||
    headers().get('x-forwarded-host') ||
    headers().get('host');

  if (!host || isPlatformHost(host)) {
    redirect('/');
  }

  const campus = await resolveInstitutionByHost(host);
  if (!campus) {
    // Not a configured campus domain - send people to the real platform home.
    redirect(CANONICAL_SITE_URL);
  }

  const next = searchParams?.next;
  if (next && next.startsWith('/') && !next.startsWith('//')) {
    redirect(next);
  }
  redirect(`/dashboard/institutions/${campus.slug}`);
}
