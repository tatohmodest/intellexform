import { redirect, notFound } from 'next/navigation';
import { getCampusBrand } from '@/lib/campus/brand';

export const dynamic = 'force-dynamic';

/**
 * Legacy campus signup URL → shared InTelleX auth.
 * Public campuses may sign up; invite/code/admin campuses go to sign-in.
 */
export default async function CampusSignupRedirect({
  params,
}: {
  params: { slug: string };
}) {
  const brand = await getCampusBrand(params.slug);
  if (!brand) notFound();

  if (brand.studentRegistration === 'public') {
    redirect(brand.signupHref);
  }

  // Invite / admin / code: no open self-signup — use platform sign-in.
  redirect(brand.loginHref);
}
