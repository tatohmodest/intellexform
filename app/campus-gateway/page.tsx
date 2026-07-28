import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import {
  isPlatformHost,
  resolveInstitutionByHost,
} from '@/lib/learn/institutionDomains';

export const dynamic = 'force-dynamic';

/**
 * Entry for custom campus hostnames.
 * Middleware rewrites unknown hosts here; we resolve Host → campus and redirect.
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
    redirect('/dashboard/institutions');
  }

  const campus = await resolveInstitutionByHost(host);
  if (!campus) notFound();

  const next = searchParams?.next;
  if (next && next.startsWith('/') && !next.startsWith('//')) {
    redirect(next);
  }
  redirect(`/dashboard/institutions/${campus.slug}`);
}
