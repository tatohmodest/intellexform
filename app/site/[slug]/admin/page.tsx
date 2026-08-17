import { redirect, notFound } from 'next/navigation';
import { getCampusBrand } from '@/lib/campus/brand';
import { getSessionUser } from '@/lib/auth/getUser';
import { enterCampusContext } from '@/lib/campus/session';

export const dynamic = 'force-dynamic';

/**
 * Institution admin entry from the public campus host.
 * Uses shared InTelleX login; access is still scoped to this institution only.
 */
export default async function CampusAdminEntryPage({
  params,
}: {
  params: { slug: string };
}) {
  const brand = await getCampusBrand(params.slug);
  if (!brand) notFound();

  const session = getSessionUser();
  if (!session) {
    redirect(brand.adminLoginHref);
  }

  const entry = await enterCampusContext({
    userId: session.uid,
    userName: session.name || 'Admin',
    userEmail: session.email,
    slug: brand.slug,
    allowJoin: false,
  });

  if (entry?.isStaff) {
    redirect(brand.adminHref);
  }

  redirect(entry?.portalHref || brand.portalHref);
}
