import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import {
  createInstructorNote,
  listLibraryNotes,
  listNotesByAuthor,
  listPublishedNotesForStudent,
} from '@/lib/learn/notes';
import { getRoles } from '@/lib/learn/ecosystem';

export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get('page') || '1'));
  const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get('pageSize') || '20')));

  const scope = url.searchParams.get('scope');
  if (scope === 'library') {
    const notes = await listLibraryNotes({ page, pageSize });
    return NextResponse.json({ notes, page, pageSize });
  }
  if (scope === 'student') {
    const learner = await getLearner(session.uid);
    const slug =
      learner?.activeContext?.kind === 'institution'
        ? learner.activeContext.institutionSlug
        : null;
    const notes = await listPublishedNotesForStudent({
      studentId: session.uid,
      institutionSlug: slug,
      page,
      pageSize,
    });
    return NextResponse.json({ notes, page, pageSize });
  }

  const notes = await listNotesByAuthor(session.uid, { page, pageSize });
  return NextResponse.json({ notes, page, pageSize });
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const roles = await getRoles(session.uid);
  if (!roles.includes('mentor') && !roles.includes('admin')) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
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
  const id = await createInstructorNote({
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
