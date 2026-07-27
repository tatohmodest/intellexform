import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ user: null }, { status: 401 });
  const learner = await getLearner(session.uid);
  return NextResponse.json({
    user: {
      uid: session.uid,
      name: learner?.name ?? session.name,
      email: learner?.email ?? session.email,
      avatar: learner?.avatar ?? session.avatar,
      xp: learner?.xp ?? 0,
      streakCount: learner?.streakCount ?? 0,
      roles: learner?.roles ?? ['student'],
      onboardingComplete: learner?.onboardingComplete !== false,
      primaryIntent: learner?.primaryIntent ?? null,
      affiliations: learner?.affiliations ?? [],
      activeContext: learner?.activeContext ?? { kind: 'personal' },
    },
  });
}
