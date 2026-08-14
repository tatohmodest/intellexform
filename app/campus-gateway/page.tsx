import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  isPlatformHost,
  resolveInstitutionByHost,
} from '@/lib/learn/institutionDomains';
import { CANONICAL_SITE_URL } from '@/lib/platformHosts';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * Entry for custom campus hostnames.
 * Guests → public org website. Signed-in users → campus dashboard.
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
    redirect(CANONICAL_SITE_URL);
  }

  const next = searchParams?.next;
  if (next && next.startsWith('/') && !next.startsWith('//')) {
    redirect(next);
  }

  const hasSession = Boolean(cookies().get('intellex_session')?.value);
  if (hasSession) {
    redirect(`/dashboard/institutions/${campus.slug}`);
  }

  // Public white-label landing for the organization.
  redirect(`/site/${campus.slug}`);
}
