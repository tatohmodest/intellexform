import { redirect, notFound } from 'next/navigation';
import { getCampusBrand } from '@/lib/campus/brand';
import { getSessionUser } from '@/lib/auth/getUser';
import { enterCampusContext } from '@/lib/campus/session';

export const dynamic = 'force-dynamic';

/**
 * Institution admin entry from the public campus host.
 * Sends owners to their campus admin; others authenticate first.
 */
export default async function CampusAdminEntryPage({
  params,
}: {
  params: { slug: string };
}) {
  const brand = await getCampusBrand(params.slug);
  if (!brand) notFound();

  const adminPath = brand.adminHref;
  const session = getSessionUser();
  if (!session) {
    redirect(
      `${brand.loginHref}?next=${encodeURIComponent(adminPath)}`,
    );
  }

  const entry = await enterCampusContext({
    userId: session.uid,
    userName: session.name || 'Admin',
    userEmail: session.email,
    slug: brand.slug,
    allowJoin: false,
  });

  if (entry?.isStaff) {
    redirect(adminPath);
  }

  // Signed in but not staff for this campus — send to student campus dashboard.
  redirect(entry?.portalHref || brand.portalHref);
}
