import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import { isOnboardingComplete } from '@/lib/learn/identity';
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
        activeContext: learner?.activeContext ?? { kind: 'personal' },
        onboardingComplete: isOnboardingComplete(learner),
      }}
      minimal={onOnboarding}
    >
      {children}
    </DashboardShell>
  );
}
