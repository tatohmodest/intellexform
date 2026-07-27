import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
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

  return (
    <DashboardShell
      user={{
        name: learner?.name ?? session.name,
        email: learner?.email ?? session.email,
        avatar: learner?.avatar ?? session.avatar ?? null,
        xp: learner?.xp ?? 0,
        streakCount: learner?.streakCount ?? 0,
        roles: learner?.roles ?? ['student'],
      }}
    >
      {children}
    </DashboardShell>
  );
}
