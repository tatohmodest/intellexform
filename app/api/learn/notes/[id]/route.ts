import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  createInstructorNote,
  deleteInstructorNote,
  getInstructorNote,
  studentOwnsNote,
  updateInstructorNote,
  type InstructorNotePatch,
} from '@/lib/learn/notes';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const note = await getInstructorNote(params.id);
  if (!note) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const isAuthor = note.authorId === session.uid;
  if (!isAuthor) {
    if (!note.published) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    const owns = await studentOwnsNote(note, session.uid);
    if (!owns && note.priceXAF > 0) {
      // Allow preview metadata without file URLs for paid library notes.
      return NextResponse.json({
        note: {
          ...note,
          fileUrl: null,
          filePublicId: null,
          driveUrl: null,
          driveEmbedUrl: null,
          locked: true,
        },
      });
    }
  }

  return NextResponse.json({ note, locked: false });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const existing = await getInstructorNote(params.id);
  if (!existing) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (existing.authorId !== session.uid) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const patch: InstructorNotePatch = {};
  if (typeof body.title === 'string') patch.title = body.title.slice(0, 160);
  if (typeof body.body === 'string') patch.body = body.body.slice(0, 20000);
  if (body.courseId === null || typeof body.courseId === 'string') {
    patch.courseId = body.courseId || null;
  }
  if (body.recipientMode === 'all' || body.recipientMode === 'course' || body.recipientMode === 'students') {
    patch.recipientMode = body.recipientMode;
  }
  if (Array.isArray(body.recipientStudentIds)) {
    patch.recipientStudentIds = body.recipientStudentIds
      .map(String)
      .map((id) => id.trim())
      .filter(Boolean);
  }
  if (patch.recipientMode === 'students' && (!patch.recipientStudentIds || patch.recipientStudentIds.length === 0)) {
    return NextResponse.json({ error: 'recipient_students_required' }, { status: 400 });
  }
  if (body.institutionSlug === null || typeof body.institutionSlug === 'string') {
    patch.institutionSlug = body.institutionSlug || null;
  }
  if (typeof body.published === 'boolean') patch.published = body.published;
  if (typeof body.listInLibrary === 'boolean') patch.listInLibrary = body.listInLibrary;
  if (typeof body.priceXAF === 'number') patch.priceXAF = body.priceXAF;

  if (body.fileUrl === null) {
    patch.fileUrl = null;
    patch.filePublicId = null;
    patch.fileResourceType = null;
    patch.fileFormat = null;
    patch.fileName = null;
    patch.fileBytes = null;
  } else if (typeof body.fileUrl === 'string') {
    patch.fileUrl = body.fileUrl;
    patch.filePublicId = typeof body.filePublicId === 'string' ? body.filePublicId : null;
    patch.fileResourceType =
      typeof body.fileResourceType === 'string' ? body.fileResourceType : null;
    patch.fileFormat = typeof body.fileFormat === 'string' ? body.fileFormat : null;
    patch.fileName = typeof body.fileName === 'string' ? body.fileName.slice(0, 200) : null;
    patch.fileBytes = typeof body.fileBytes === 'number' ? body.fileBytes : null;
    patch.source = 'cloudinary';
  }

  if (body.driveUrl === null || body.driveUrl === '') {
    patch.driveUrl = null;
    patch.driveEmbedUrl = null;
  } else if (typeof body.driveUrl === 'string') {
    patch.driveUrl = body.driveUrl.trim();
  }

  const shouldPublishAsNew = patch.published === true && existing.published;

  let noteId = params.id;

  try {
    if (shouldPublishAsNew) {
      const nextTitle =
        typeof patch.title === 'string' && patch.title.trim()
          ? patch.title
          : existing.title;
      noteId = await createInstructorNote({
        authorId: session.uid,
        authorName: existing.authorName,
        title: nextTitle,
        institutionSlug:
          typeof patch.institutionSlug === 'string' || patch.institutionSlug === null
            ? patch.institutionSlug
            : existing.institutionSlug,
        courseId:
          typeof patch.courseId === 'string' || patch.courseId === null
            ? patch.courseId
            : existing.courseId,
        recipientMode: patch.recipientMode || existing.recipientMode,
        recipientStudentIds:
          patch.recipientStudentIds || existing.recipientStudentIds || [],
      });
      await updateInstructorNote(noteId, session.uid, {
        title: typeof patch.title === 'string' ? patch.title : existing.title,
        body: typeof patch.body === 'string' ? patch.body : existing.body,
        courseId:
          typeof patch.courseId === 'string' || patch.courseId === null
            ? patch.courseId
            : existing.courseId,
        institutionSlug:
          typeof patch.institutionSlug === 'string' || patch.institutionSlug === null
            ? patch.institutionSlug
            : existing.institutionSlug,
        fileUrl: patch.fileUrl !== undefined ? patch.fileUrl : existing.fileUrl,
        filePublicId:
          patch.filePublicId !== undefined ? patch.filePublicId : existing.filePublicId,
        fileResourceType:
          patch.fileResourceType !== undefined
            ? patch.fileResourceType
            : existing.fileResourceType,
        fileFormat: patch.fileFormat !== undefined ? patch.fileFormat : existing.fileFormat,
        fileName: patch.fileName !== undefined ? patch.fileName : existing.fileName,
        fileBytes: patch.fileBytes !== undefined ? patch.fileBytes : existing.fileBytes,
        driveUrl: patch.driveUrl !== undefined ? patch.driveUrl : existing.driveUrl,
        source: patch.source !== undefined ? patch.source : existing.source,
        recipientMode: patch.recipientMode || existing.recipientMode,
        recipientStudentIds:
          patch.recipientStudentIds || existing.recipientStudentIds || [],
        published: true,
        listInLibrary:
          patch.listInLibrary !== undefined ? patch.listInLibrary : existing.listInLibrary,
        priceXAF: patch.priceXAF !== undefined ? patch.priceXAF : existing.priceXAF,
      });
    } else {
      await updateInstructorNote(params.id, session.uid, patch);
    }
  } catch (err) {
    if (err instanceof Error && err.message === 'invalid_drive_url') {
      return NextResponse.json({ error: 'invalid_drive_url' }, { status: 400 });
    }
    throw err;
  }

  const note = await getInstructorNote(noteId);

  // Notify students when newly published.
  if (note && patch.published === true && !existing.published) {
    try {
      const { createNotificationsForUsers, resolveAssignmentAudience } = await import(
        '@/lib/learn/notifications'
      );
      const audience = await resolveAssignmentAudience({
        authorId: session.uid,
        institutionSlug: note.institutionSlug,
        courseId: note.courseId,
        recipientMode: note.recipientMode,
        recipientStudentIds: note.recipientStudentIds || [],
      });
      await createNotificationsForUsers(audience, {
        title: `New notes: ${note.title}`,
        body: `${note.authorName} shared class notes with you. Open or download them in your dashboard.`,
        href: `/dashboard/notes/${note.id}`,
        kind: 'note',
        data: { noteId: note.id },
      });
    } catch {
      /* non-fatal */
    }
  }

  if (note && patch.published === true && existing.published) {
    try {
      const { createNotificationsForUsers, resolveAssignmentAudience } = await import(
        '@/lib/learn/notifications'
      );
      const audience = await resolveAssignmentAudience({
        authorId: session.uid,
        institutionSlug: note.institutionSlug,
        courseId: note.courseId,
        recipientMode: note.recipientMode,
        recipientStudentIds: note.recipientStudentIds || [],
      });
      await createNotificationsForUsers(audience, {
        title: `New notes: ${note.title}`,
        body: `${note.authorName} shared another set of class notes with you.`,
        href: `/dashboard/notes/${note.id}`,
        kind: 'note',
        data: { noteId: note.id },
      });
    } catch {
      /* non-fatal */
    }
  }

  return NextResponse.json({ note });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  await deleteInstructorNote(params.id, session.uid);
  return NextResponse.json({ ok: true });
}
