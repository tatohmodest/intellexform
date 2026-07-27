import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { completeLearnerOnboarding, getLearner } from '@/lib/learn/repo';
import type { JoinPath, PrimaryIntent } from '@/lib/learn/identity';

export const dynamic = 'force-dynamic';

const INTENTS: PrimaryIntent[] = ['learn', 'teach', 'institution'];
const PATHS: JoinPath[] = ['exploring', 'institution', 'both'];

/**
 * POST /api/learn/onboarding
 * Completes first-run identity onboarding (intent + optional join path).
 */
export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const primaryIntent = String(body.primaryIntent ?? '') as PrimaryIntent;
  const joinPathRaw = body.joinPath != null ? String(body.joinPath) : null;
  const joinPath = joinPathRaw && PATHS.includes(joinPathRaw as JoinPath)
    ? (joinPathRaw as JoinPath)
    : null;

  if (!INTENTS.includes(primaryIntent)) {
    return NextResponse.json({ error: 'invalid_intent' }, { status: 400 });
  }
  if (primaryIntent === 'learn' && !joinPath) {
    return NextResponse.json({ error: 'join_path_required' }, { status: 400 });
  }

  try {
    const learner = await completeLearnerOnboarding(user.uid, {
      primaryIntent,
      joinPath: primaryIntent === 'learn' ? joinPath : null,
    });
    return NextResponse.json({
      ok: true,
      onboardingComplete: true,
      primaryIntent: learner?.primaryIntent,
      joinPath: learner?.joinPath,
      activeContext: learner?.activeContext,
      needsInstitutionSearch:
        primaryIntent === 'learn' &&
        (joinPath === 'institution' || joinPath === 'both'),
      needsInstitutionApplication: primaryIntent === 'institution',
      needsMentorApply: primaryIntent === 'teach',
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
    onboardingComplete: Boolean(learner?.onboardingComplete),
    primaryIntent: learner?.primaryIntent ?? null,
    joinPath: learner?.joinPath ?? null,
    affiliations: learner?.affiliations ?? [],
    activeContext: learner?.activeContext ?? { kind: 'personal' },
  });
}
