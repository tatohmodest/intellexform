import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { completeLearnerOnboarding, getLearner } from '@/lib/learn/repo';
import {
  normalizeJoinPath,
  type JoinPath,
  type PrimaryIntent,
} from '@/lib/learn/identity';

export const dynamic = 'force-dynamic';

const INTENTS: PrimaryIntent[] = ['learn', 'teach'];
const PATHS: JoinPath[] = ['intellex', 'institution', 'both', 'exploring'];

/**
 * POST /api/learn/onboarding
 * Completes first-run identity onboarding (Learn/Teach + join path).
 * Institutions are never self-created from this flow.
 */
export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const primaryIntent = String(body.primaryIntent ?? '') as PrimaryIntent;
  const joinPathRaw = body.joinPath != null ? String(body.joinPath) : null;
  const joinPath = joinPathRaw && PATHS.includes(joinPathRaw as JoinPath)
    ? normalizeJoinPath(joinPathRaw as JoinPath)
    : null;

  if (!INTENTS.includes(primaryIntent)) {
    return NextResponse.json({ error: 'invalid_intent' }, { status: 400 });
  }
  if (!joinPath) {
    return NextResponse.json({ error: 'join_path_required' }, { status: 400 });
  }

  try {
    const learner = await completeLearnerOnboarding(user.uid, {
      primaryIntent,
      joinPath,
    });
    return NextResponse.json({
      ok: true,
      onboardingComplete: true,
      primaryIntent: learner?.primaryIntent,
      joinPath: learner?.joinPath,
      activeContext: learner?.activeContext,
      needsInstitutionSearch: joinPath === 'institution' || joinPath === 'both',
      needsMentorApply: primaryIntent === 'teach' && joinPath === 'intellex',
    });
  } catch (err) {
    console.error('onboarding failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}

/** GET — current onboarding / identity snapshot. */
export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const learner = await getLearner(user.uid);
  return NextResponse.json({
    onboardingComplete: learner?.onboardingComplete !== false,
    primaryIntent: learner?.primaryIntent ?? null,
    joinPath: learner?.joinPath ?? null,
    affiliations: learner?.affiliations ?? [],
    activeContext: learner?.activeContext ?? { kind: 'personal' },
  });
}
