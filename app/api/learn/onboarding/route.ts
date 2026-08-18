import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { completeLearnerOnboarding, getLearner } from '@/lib/learn/repo';
import { sanitizeInterests } from '@/lib/learn/interests';
import { type PrimaryIntent } from '@/lib/learn/identity';

export const dynamic = 'force-dynamic';

const INTENTS: PrimaryIntent[] = ['learn', 'teach'];

/**
 * POST /api/learn/onboarding
 * Completes first-run personalization (interests). Student registration is a
 * separate application — never "join an institution" here.
 */
export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const intentRaw = String(body.primaryIntent ?? 'learn');
  const primaryIntent = INTENTS.includes(intentRaw as PrimaryIntent)
    ? (intentRaw as PrimaryIntent)
    : 'learn';
  const interests = sanitizeInterests(body.interests);
  if (!interests.length) {
    return NextResponse.json({ error: 'interests_required' }, { status: 400 });
  }

  try {
    const learner = await completeLearnerOnboarding(user.uid, {
      primaryIntent,
      joinPath: 'intellex',
      interests,
    });
    return NextResponse.json({
      ok: true,
      onboardingComplete: true,
      primaryIntent: learner?.primaryIntent,
      interests: learner?.preferences?.interests ?? interests,
    });
  } catch (err) {
    console.error('onboarding failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}

/** GET - current onboarding / identity snapshot. */
export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const learner = await getLearner(user.uid);
  return NextResponse.json({
    onboardingComplete: learner?.onboardingComplete !== false,
    primaryIntent: learner?.primaryIntent ?? null,
    interests: learner?.preferences?.interests ?? [],
    studentStatus: learner?.studentStatus ?? null,
    matricule: learner?.matricule ?? null,
  });
}
