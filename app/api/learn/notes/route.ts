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

  const scope = new URL(req.url).searchParams.get('scope');
  if (scope === 'library') {
    const notes = await listLibraryNotes();
    return NextResponse.json({ notes });
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
    });
    return NextResponse.json({ notes });
  }

  const notes = await listNotesByAuthor(session.uid);
  return NextResponse.json({ notes });
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
  const id = await createInstructorNote({
    authorId: session.uid,
    authorName: learner?.name || session.name || 'Instructor',
    title,
    institutionSlug: body.institutionSlug || null,
    courseId: typeof body.courseId === 'string' && body.courseId.trim() ? body.courseId.trim() : null,
  });
  return NextResponse.json({ id }, { status: 201 });
}
