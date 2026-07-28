import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import {
  autoGradeExam,
  getAssessment,
  getSubmission,
  listSubmissions,
  toDriveEmbedUrl,
  upsertSubmission,
} from '@/lib/learn/assessments';
import { isCloudinaryUrl } from '@/lib/cloudinaryFormats';

function isCloudinaryHost(url: string): boolean {
  return isCloudinaryUrl(url);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const assessment = await getAssessment(params.id);
  if (!assessment) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  if (assessment.authorId === session.uid) {
    const submissions = await listSubmissions(params.id);
    return NextResponse.json({ submissions });
  }

  const submission = await getSubmission(params.id, session.uid);
  return NextResponse.json({ submission });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const assessment = await getAssessment(params.id);
  if (!assessment || !assessment.published) {
    return NextResponse.json({ error: 'not_available' }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const action = String(body.action || 'submit');
  const learner = await getLearner(session.uid);
  const studentName = learner?.name || session.name || 'Student';

  const existing = await getSubmission(params.id, session.uid);
  if (
    existing &&
    (existing.status === 'submitted' ||
      existing.status === 'graded' ||
      existing.status === 'terminated')
  ) {
    return NextResponse.json({ error: 'already_closed', submission: existing }, { status: 409 });
  }

  if (action === 'start' && assessment.kind === 'exam') {
    const submission = await upsertSubmission({
      assessmentId: params.id,
      studentId: session.uid,
      studentName,
      patch: {
        status: 'draft',
        answers: existing?.answers || {},
        startedAt: existing?.startedAt || new Date(),
      },
    });
    return NextResponse.json({ submission });
  }

  if (action === 'terminate' && assessment.kind === 'exam') {
    const submission = await upsertSubmission({
      assessmentId: params.id,
      studentId: session.uid,
      studentName,
      patch: {
        status: 'terminated',
        answers: body.answers || existing?.answers || {},
        terminatedReason: String(body.reason || 'left_tab'),
        submittedAt: new Date(),
      },
    });
    return NextResponse.json({ submission });
  }

  if (assessment.kind === 'assignment') {
    const dueAt = assessment.dueAt ? new Date(assessment.dueAt).getTime() : null;
    if (dueAt && Date.now() > dueAt) {
      return NextResponse.json(
        { error: 'deadline_passed', message: 'The deadline has passed. You can no longer submit.' },
        { status: 403 },
      );
    }

    const fileUrl = String(body.fileUrl || '').trim();
    const driveRaw = String(body.driveUrl || '').trim();

    // Preferred: Cloudinary upload (PDF / DOC / DOCX).
    if (fileUrl) {
      if (!isCloudinaryHost(fileUrl)) {
        return NextResponse.json({ error: 'invalid_file_url' }, { status: 400 });
      }
      const submission = await upsertSubmission({
        assessmentId: params.id,
        studentId: session.uid,
        studentName,
        patch: {
          fileUrl,
          filePublicId: String(body.filePublicId || '').trim() || undefined,
          fileResourceType: String(body.fileResourceType || '').trim() || undefined,
          fileFormat: String(body.fileFormat || '').trim() || undefined,
          fileName: String(body.fileName || '').trim().slice(0, 180) || undefined,
          fileBytes:
            typeof body.fileBytes === 'number' && Number.isFinite(body.fileBytes)
              ? body.fileBytes
              : undefined,
          driveUrl: undefined,
          driveEmbedUrl: undefined,
          status: 'submitted',
          submittedAt: new Date(),
        },
      });
      return NextResponse.json({ submission });
    }

    // Legacy Drive link (still accepted for older clients).
    if (driveRaw) {
      const norm = toDriveEmbedUrl(driveRaw);
      const submission = await upsertSubmission({
        assessmentId: params.id,
        studentId: session.uid,
        studentName,
        patch: {
          driveUrl: norm.url,
          driveEmbedUrl: norm.embedUrl,
          status: 'submitted',
          submittedAt: new Date(),
        },
      });
      return NextResponse.json({ submission });
    }

    return NextResponse.json({ error: 'file_required' }, { status: 400 });
  }

  // exam submit
  const answers = (body.answers || {}) as Record<string, string | number>;
  const { score, maxScore } = autoGradeExam(assessment, answers);
  const hasStructural = (assessment.questions || []).some((q) => q.type === 'structural');
  const submission = await upsertSubmission({
    assessmentId: params.id,
    studentId: session.uid,
    studentName,
    patch: {
      answers,
      status: hasStructural ? 'submitted' : 'graded',
      score,
      maxScore,
      submittedAt: new Date(),
      gradedAt: hasStructural ? null : new Date(),
    },
  });
  return NextResponse.json({ submission });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const assessment = await getAssessment(params.id);
  if (!assessment || assessment.authorId !== session.uid) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const studentId = String(body.studentId || '');
  if (!studentId) return NextResponse.json({ error: 'student_required' }, { status: 400 });

  const existing = await getSubmission(params.id, studentId);
  if (!existing) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const submission = await upsertSubmission({
    assessmentId: params.id,
    studentId,
    studentName: existing.studentName,
    patch: {
      score: typeof body.score === 'number' ? body.score : existing.score,
      maxScore: typeof body.maxScore === 'number' ? body.maxScore : existing.maxScore,
      feedback: typeof body.feedback === 'string' ? body.feedback.slice(0, 4000) : existing.feedback,
      status: 'graded',
      gradedAt: new Date(),
    },
  });
  return NextResponse.json({ submission });
}
