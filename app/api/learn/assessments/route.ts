import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import {
  createAssessment,
  listAssessmentsByAuthor,
  listAssessmentsForCampus,
  type AssessmentKind,
} from '@/lib/learn/assessments';

export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const campus = new URL(req.url).searchParams.get('campus');
  if (campus) {
    const assessments = await listAssessmentsForCampus(campus, {
      includeDraftsForAuthorId: session.uid,
    });
    return NextResponse.json({ assessments });
  }
  const assessments = await listAssessmentsByAuthor(session.uid);
  return NextResponse.json({ assessments });
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const kind = (body.kind === 'exam' ? 'exam' : 'assignment') as AssessmentKind;
  const title = String(body.title || '').trim();
  if (!title) return NextResponse.json({ error: 'title_required' }, { status: 400 });

  const learner = await getLearner(session.uid);
  const id = await createAssessment({
    kind,
    authorId: session.uid,
    authorName: learner?.name || session.name || 'Instructor',
    title,
    institutionSlug: body.institutionSlug || null,
  });
  return NextResponse.json({ id }, { status: 201 });
}
