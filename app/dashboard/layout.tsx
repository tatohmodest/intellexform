import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import { getInstitution } from '@/lib/learn/ecosystem';
import { isOnboardingComplete, type CampusBrand } from '@/lib/learn/identity';
import { type ModuleId } from '@/lib/eduos/capabilities';
import { getCampusTierInfo } from '@/lib/campus/tier';
import { getStaffPost, permissionsOf } from '@/lib/staff/store';
import { getStudentMembership } from '@/lib/learn/studentAccess';
import DashboardShell from '@/components/dashboard/DashboardShell';

export const metadata: Metadata = {
  title: 'Learning Dashboard - Intellex',
  description:
    'Your Intellex learning dashboard - courses, mentorship, live sessions and AI tutoring.',
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
      const tier = await getCampusTierInfo(ctx.institutionSlug, {
        capabilityPack: inst.capabilityPack,
        enabledModules: inst.enabledModules,
      });
      campusBrand = {
        slug: inst.slug,
        name: inst.name,
        color: inst.color || '#00b369',
        logoUrl: inst.logoUrl ?? null,
        tagline: inst.tagline,
        capabilityPack: tier.capabilityPack,
        enabledModules: tier.enabledModules as ModuleId[],
      };
    }
  }

  // Strip Date fields so Client Components never receive non-serializable props.
  const affiliations = (learner?.affiliations ?? []).map((a) => ({
    ...a,
    joinedAt: a.joinedAt ? new Date(a.joinedAt).toISOString() : new Date().toISOString(),
    verifiedAt: a.verifiedAt ? new Date(a.verifiedAt).toISOString() : null,
  }));

  const staffPost = await getStaffPost(session.uid).catch(() => null);
  const membership = await getStudentMembership(session.uid).catch(() => null);
  const staff =
    staffPost && staffPost.active
      ? {
          desks: staffPost.desks,
          permissions: permissionsOf(staffPost),
        }
      : null;

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
        affiliations,
        activeContext: ctx,
        onboardingComplete: isOnboardingComplete(learner),
        isStudent: Boolean(membership?.isStudent),
        matricule: membership?.matricule ?? null,
      }}
      campusBrand={campusBrand}
      staff={staff}
      minimal={onOnboarding}
    >
      {children}
    </DashboardShell>
  );
}
