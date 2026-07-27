import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { setActiveContext, getLearner } from '@/lib/learn/repo';
import type { ActiveContext, ContextKind } from '@/lib/learn/identity';

export const dynamic = 'force-dynamic';

const KINDS: ContextKind[] = [
  'personal',
  'intellex',
  'institution',
  'teaching',
  'mentorship',
];

/**
 * POST /api/learn/context - switch workspace context (same identity).
 * body: { kind, institutionSlug? }
 */
export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const kind = String(body.kind ?? '') as ContextKind;
  if (!KINDS.includes(kind)) {
    return NextResponse.json({ error: 'invalid_context' }, { status: 400 });
  }

  const institutionSlug =
    kind === 'institution'
      ? String(body.institutionSlug ?? '').trim() || null
      : null;

  if (kind === 'institution') {
    if (!institutionSlug) {
      return NextResponse.json({ error: 'institution_required' }, { status: 400 });
    }
    const learner = await getLearner(user.uid);
    const affiliated = (learner?.affiliations ?? []).some(
      (a) => a.institutionSlug === institutionSlug,
    );
    if (!affiliated && institutionSlug !== 'intellex') {
      return NextResponse.json({ error: 'not_affiliated' }, { status: 403 });
    }
  }

  const context: ActiveContext = { kind, institutionSlug };
  try {
    const learner = await setActiveContext(user.uid, context);
    return NextResponse.json({
      ok: true,
      activeContext: learner?.activeContext ?? context,
    });
  } catch (err) {
    console.error('set context failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
