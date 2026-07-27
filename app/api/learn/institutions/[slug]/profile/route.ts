import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { completeCampusProfile, getLearner } from '@/lib/learn/repo';

export const dynamic = 'force-dynamic';

/**
 * POST /api/learn/institutions/[slug]/profile
 * First verified campus visit — complete institution-facing profile fields.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const program = String(body.program ?? '').trim();
  if (!program) {
    return NextResponse.json({ error: 'program_required' }, { status: 400 });
  }

  try {
    const learner = await getLearner(user.uid);
    const has = (learner?.affiliations ?? []).some((a) => a.institutionSlug === params.slug);
    if (!has) return NextResponse.json({ error: 'not_affiliated' }, { status: 403 });

    const updated = await completeCampusProfile(user.uid, params.slug, {
      program,
      year: String(body.year ?? '').trim() || undefined,
      emergencyContact: String(body.emergencyContact ?? '').trim() || undefined,
      photoUrl: String(body.photoUrl ?? '').trim() || undefined,
      department: String(body.department ?? '').trim() || undefined,
    });

    return NextResponse.json({
      ok: true,
      affiliation: (updated?.affiliations ?? []).find((a) => a.institutionSlug === params.slug),
    });
  } catch (err) {
    console.error('campus profile failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
