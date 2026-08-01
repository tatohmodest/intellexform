import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import {
  createAssessment,
  listAssessmentsByAuthor,
  listAssessmentsForCampus,
  listPublishedForStudent,
  type AssessmentKind,
} from '@/lib/learn/assessments';

export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const scope = url.searchParams.get('scope');
  const page = Math.max(1, Number(url.searchParams.get('page') || '1'));
  const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get('pageSize') || '20')));

  if (scope === 'student') {
    const learner = await getLearner(session.uid);
    const institutionSlug =
      learner?.activeContext?.kind === 'institution'
        ? learner.activeContext.institutionSlug
        : null;
    const assessments = await listPublishedForStudent({
      studentId: session.uid,
      institutionSlug,
      page,
      pageSize,
    });
    return NextResponse.json({ assessments, page, pageSize });
  }

  const campus = url.searchParams.get('campus');
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
  const recipientMode =
    body.recipientMode === 'students'
      ? 'students'
      : body.recipientMode === 'course'
        ? 'course'
        : 'all';
  const recipientStudentIds = Array.isArray(body.recipientStudentIds)
    ? body.recipientStudentIds.map(String).map((id) => id.trim()).filter(Boolean)
    : [];
  if (recipientMode === 'students' && recipientStudentIds.length === 0) {
    return NextResponse.json({ error: 'recipient_students_required' }, { status: 400 });
  }
  const id = await createAssessment({
    kind,
    authorId: session.uid,
    authorName: learner?.name || session.name || 'Instructor',
    title,
    institutionSlug: body.institutionSlug || null,
    courseId: typeof body.courseId === 'string' && body.courseId.trim() ? body.courseId.trim() : null,
    recipientMode,
    recipientStudentIds,
  });
  return NextResponse.json({ id }, { status: 201 });
}
