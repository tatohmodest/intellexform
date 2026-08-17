import { redirect, notFound } from 'next/navigation';
import { getCampusBrand } from '@/lib/campus/brand';

export const dynamic = 'force-dynamic';

/**
 * Legacy campus login URL → shared InTelleX login with campus next/context.
 * Enrollment policy (invite / admin / public / code) is decided at onboarding.
 */
export default async function CampusLoginRedirect({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { next?: string };
}) {
  const brand = await getCampusBrand(params.slug);
  if (!brand) notFound();

  const next =
    searchParams?.next?.startsWith('/') && !searchParams.next.startsWith('//')
      ? searchParams.next
      : brand.portalHref;

  redirect(
    `/login?next=${encodeURIComponent(next)}&campus=${encodeURIComponent(brand.slug)}`,
  );
}
