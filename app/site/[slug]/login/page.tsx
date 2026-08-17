import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import { isOnboardingComplete } from '@/lib/learn/identity';
import { getCampusBrand } from '@/lib/campus/brand';
import { enterCampusContext } from '@/lib/campus/session';
import AuthScreen from '@/components/auth/AuthScreen';
import CampusPwaBrand from '@/components/CampusPwaBrand';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const brand = await getCampusBrand(params.slug);
  if (!brand) return { title: 'Sign in' };
  return {
    title: `Sign in · ${brand.platformName}`,
    description: `Sign in to ${brand.platformName}`,
    applicationName: brand.platformName,
  };
}

export default async function CampusLoginPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { next?: string };
}) {
  const brand = await getCampusBrand(params.slug);
  if (!brand || !brand.config.published) notFound();

  const session = getSessionUser();
  if (session) {
    const learner = await getLearner(session.uid);
    const entry = await enterCampusContext({
      userId: session.uid,
      userName: session.name || learner?.name || 'Learner',
      userEmail: session.email,
      slug: brand.slug,
      allowJoin: brand.enrollmentOpen,
    });
    const dest =
      searchParams?.next?.startsWith(`/dashboard/institutions/${brand.slug}`)
        ? searchParams.next
        : entry?.portalHref || brand.portalHref;
    redirect(isOnboardingComplete(learner) ? dest : `/dashboard/onboarding?next=${encodeURIComponent(dest)}`);
  }

  return (
    <>
      <CampusPwaBrand
        brand={{
          slug: brand.slug,
          name: brand.platformName,
          accent: brand.accent,
          logoUrl: brand.logoUrl,
        }}
      />
      <Suspense>
        <AuthScreen
          mode="login"
          campus={{
            slug: brand.slug,
            name: brand.platformName,
            accent: brand.accent,
            logoUrl: brand.logoUrl,
            homeHref: brand.homeHref,
            loginHref: brand.loginHref,
            signupHref: brand.signupHref,
            portalHref: brand.portalHref,
            tagline: brand.tagline,
          }}
        />
      </Suspense>
    </>
  );
}
