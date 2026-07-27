import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  getAssessment,
  publicAssessment,
  updateAssessment,
  type ExamQuestion,
} from '@/lib/learn/assessments';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const assessment = await getAssessment(params.id);
  if (!assessment) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const isAuthor = assessment.authorId === session.uid;
  if (!isAuthor && !assessment.published) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const forStudent = new URL(req.url).searchParams.get('view') === 'student';
  return NextResponse.json({
    assessment: isAuthor && !forStudent ? assessment : publicAssessment(assessment),
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const existing = await getAssessment(params.id);
  if (!existing) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (existing.authorId !== session.uid) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};
  if (typeof body.title === 'string') patch.title = body.title.slice(0, 160);
  if (typeof body.instructions === 'string') patch.instructions = body.instructions.slice(0, 8000);
  if (typeof body.studentTips === 'string') patch.studentTips = body.studentTips.slice(0, 4000);
  if (typeof body.published === 'boolean') patch.published = body.published;
  if (typeof body.terminateOnLeave === 'boolean') patch.terminateOnLeave = body.terminateOnLeave;
  if (typeof body.lockNavigation === 'boolean') patch.lockNavigation = body.lockNavigation;
  if (body.durationMinutes === null || typeof body.durationMinutes === 'number') {
    patch.durationMinutes = body.durationMinutes;
  }
  if (body.dueAt === null || typeof body.dueAt === 'string') {
    patch.dueAt = body.dueAt ? new Date(body.dueAt) : null;
  }
  if (body.institutionSlug === null || typeof body.institutionSlug === 'string') {
    patch.institutionSlug = body.institutionSlug || null;
  }
  if (Array.isArray(body.questions)) {
    patch.questions = body.questions.map((q: Record<string, unknown>, i: number) => {
      const type = q.type === 'structural' ? 'structural' : 'mcq';
      const options = Array.isArray(q.options)
        ? q.options.map((o) => String(o).slice(0, 400)).filter(Boolean)
        : [];
      return {
        id: String(q.id || `q_${i}_${Date.now()}`),
        type,
        prompt: String(q.prompt || '').slice(0, 2000),
        options: type === 'mcq' ? options : undefined,
        correctIndex:
          type === 'mcq' && typeof q.correctIndex === 'number' ? q.correctIndex : null,
        points: typeof q.points === 'number' ? q.points : 1,
        hint: String(q.hint || '').slice(0, 500),
      } satisfies ExamQuestion;
    });
  }

  await updateAssessment(params.id, session.uid, patch);
  const assessment = await getAssessment(params.id);
  return NextResponse.json({ assessment });
}
