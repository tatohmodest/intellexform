import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import { getInstitution } from '@/lib/learn/ecosystem';
import { isOnboardingComplete, type CampusBrand } from '@/lib/learn/identity';
import { resolveCampusModules, type ModuleId } from '@/lib/eduos/capabilities';
import DashboardShell from '@/components/dashboard/DashboardShell';

export const metadata: Metadata = {
  title: 'Learning Dashboard — Intellex',
  description:
    'Your Intellex learning dashboard — courses, mentorship, live sessions and AI tutoring.',
};

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard');

  const learner = await getLearner(session.uid);
  const pathname = headers().get('x-pathname') || '';
  const onOnboarding = pathname.startsWith('/dashboard/onboarding');

  if (!isOnboardingComplete(learner) && !onOnboarding) {
    redirect('/dashboard/onboarding');
  }

  const ctx = learner?.activeContext ?? { kind: 'personal' as const };
  let campusBrand: CampusBrand | null = null;
  if (ctx.kind === 'institution' && ctx.institutionSlug) {
    const inst = await getInstitution(ctx.institutionSlug);
    if (inst) {
      const modules = resolveCampusModules({
        capabilityPack: inst.capabilityPack,
        enabledModules: (inst.enabledModules ?? []) as ModuleId[],
      });
      campusBrand = {
        slug: inst.slug,
        name: inst.name,
        color: inst.color || '#00b369',
        logoUrl: inst.logoUrl ?? null,
        tagline: inst.tagline,
        capabilityPack: inst.capabilityPack ?? 'foundation',
        enabledModules: modules,
      };
    }
  }

  return (
    <DashboardShell
      user={{
        name: learner?.name ?? session.name,
        email: learner?.email ?? session.email,
        avatar: learner?.avatar ?? session.avatar ?? null,
        xp: learner?.xp ?? 0,
        streakCount: learner?.streakCount ?? 0,
        roles: learner?.roles ?? ['student'],
        primaryIntent: learner?.primaryIntent ?? null,
        affiliations: learner?.affiliations ?? [],
        activeContext: ctx,
        onboardingComplete: isOnboardingComplete(learner),
      }}
      campusBrand={campusBrand}
      minimal={onOnboarding}
    >
      {children}
    </DashboardShell>
  );
}
