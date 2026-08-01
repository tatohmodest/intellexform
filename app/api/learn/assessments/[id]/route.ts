import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  canStudentAccessAssessment,
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
  if (!isAuthor) {
    const canAccess = await canStudentAccessAssessment(assessment, session.uid);
    if (!canAccess) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
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
  if (body.attachmentFileUrl === null) {
    patch.attachmentFileUrl = null;
    patch.attachmentFilePublicId = null;
    patch.attachmentFileResourceType = null;
    patch.attachmentFileFormat = null;
    patch.attachmentFileName = null;
    patch.attachmentFileBytes = null;
  } else if (typeof body.attachmentFileUrl === 'string') {
    patch.attachmentFileUrl = body.attachmentFileUrl;
    patch.attachmentFilePublicId =
      typeof body.attachmentFilePublicId === 'string' ? body.attachmentFilePublicId : null;
    patch.attachmentFileResourceType =
      typeof body.attachmentFileResourceType === 'string'
        ? body.attachmentFileResourceType
        : null;
    patch.attachmentFileFormat =
      typeof body.attachmentFileFormat === 'string' ? body.attachmentFileFormat : null;
    patch.attachmentFileName =
      typeof body.attachmentFileName === 'string' ? body.attachmentFileName.slice(0, 200) : null;
    patch.attachmentFileBytes =
      typeof body.attachmentFileBytes === 'number' ? body.attachmentFileBytes : null;
  }
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
  if (body.courseId === null || typeof body.courseId === 'string') {
    patch.courseId = body.courseId || null;
  }
  if (body.recipientMode === 'all' || body.recipientMode === 'course' || body.recipientMode === 'students') {
    patch.recipientMode = body.recipientMode;
  }
  if (Array.isArray(body.recipientStudentIds)) {
    patch.recipientStudentIds = body.recipientStudentIds
      .map(String)
      .map((id: string) => id.trim())
      .filter(Boolean);
  }
  const recipientStudentIds = Array.isArray(patch.recipientStudentIds)
    ? patch.recipientStudentIds
    : [];
  if (patch.recipientMode === 'students' && recipientStudentIds.length === 0) {
    return NextResponse.json({ error: 'recipient_students_required' }, { status: 400 });
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

  // Notify students when an assignment/exam is newly published.
  if (
    assessment &&
    patch.published === true &&
    !existing.published
  ) {
    try {
      const { createNotificationsForUsers, resolveAssignmentAudience } = await import(
        '@/lib/learn/notifications'
      );
      const audience = await resolveAssignmentAudience({
        authorId: session.uid,
        institutionSlug: assessment.institutionSlug,
        courseId: assessment.courseId,
        recipientMode: assessment.recipientMode,
        recipientStudentIds: assessment.recipientStudentIds || [],
      });
      const dueLabel = assessment.dueAt
        ? ` Deadline: ${new Date(assessment.dueAt).toLocaleString()}.`
        : '';
      await createNotificationsForUsers(audience, {
        title:
          assessment.kind === 'exam'
            ? `New exam: ${assessment.title}`
            : `New assignment: ${assessment.title}`,
        body: `${assessment.authorName} published ${
          assessment.kind === 'exam' ? 'an exam' : 'an assignment'
        }.${dueLabel} Open it in your dashboard.`,
        href:
          assessment.kind === 'exam'
            ? `/dashboard/exams/${assessment.id}`
            : `/dashboard/assignments/${assessment.id}`,
        kind: assessment.kind,
        data: {
          assessmentId: assessment.id,
          dueAt: assessment.dueAt ? new Date(assessment.dueAt).toISOString() : null,
        },
      });
    } catch (err) {
      console.error('assignment notify failed:', err);
    }
  }

  return NextResponse.json({ assessment });
}
