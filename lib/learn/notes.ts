import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { ensureLearnCollections } from '@/lib/learn/ecosystem';
import { isGoogleDriveShareUrl, toDriveEmbedUrl } from '@/lib/learn/assessments';

export type NoteSource = 'cloudinary' | 'drive' | 'link';
export type AudienceMode = 'all' | 'course' | 'students';

export interface InstructorNoteDoc {
  _id?: ObjectId;
  authorId: string;
  authorName: string;
  institutionSlug?: string | null;
  courseId?: string | null;
  title: string;
  body: string;
  /** Cloudinary file (manual upload) */
  fileUrl?: string | null;
  filePublicId?: string | null;
  fileResourceType?: string | null;
  fileFormat?: string | null;
  fileName?: string | null;
  fileBytes?: number | null;
  /** Google Drive share link */
  driveUrl?: string | null;
  driveEmbedUrl?: string | null;
  source: NoteSource;
  recipientMode: AudienceMode;
  recipientStudentIds?: string[];
  published: boolean;
  /** Also list in student Library for discovery / purchase */
  listInLibrary: boolean;
  priceXAF: number;
  sales: number;
  createdAt: Date;
  updatedAt: Date;
}

export type InstructorNoteView = Omit<InstructorNoteDoc, '_id'> & { id: string };

export interface NotePurchaseDoc {
  _id?: ObjectId;
  noteId: string;
  studentId: string;
  priceXAF: number;
  createdAt: Date;
}

type ListOptions = {
  page?: number;
  pageSize?: number;
};

function normalizePagination(opts?: ListOptions): { skip: number; limit: number } {
  const page = Math.max(1, Number(opts?.page) || 1);
  const defaultSize = opts ? 20 : 200;
  const pageSize = Math.min(100, Math.max(1, Number(opts?.pageSize) || defaultSize));
  return { skip: (page - 1) * pageSize, limit: pageSize };
}

function toNote(d: Record<string, unknown>): InstructorNoteView {
  const { _id, ...rest } = d as unknown as InstructorNoteDoc & { _id: ObjectId };
  return { ...(rest as Omit<InstructorNoteDoc, '_id'>), id: _id.toString() };
}

async function ensureNoteCollections() {
  await ensureLearnCollections();
  const db = await getDb();
  await Promise.all([
    db.collection('instructor_notes').createIndex({ authorId: 1, updatedAt: -1 }),
    db.collection('instructor_notes').createIndex({ published: 1, listInLibrary: 1, updatedAt: -1 }),
    db.collection('instructor_notes').createIndex({ courseId: 1, published: 1 }),
    db.collection('instructor_notes').createIndex({ recipientMode: 1, published: 1 }),
    db.collection('instructor_notes').createIndex({ recipientStudentIds: 1, published: 1 }),
    db.collection('note_purchases').createIndex({ noteId: 1, studentId: 1 }, { unique: true }),
    db.collection('note_purchases').createIndex({ studentId: 1, createdAt: -1 }),
  ]).catch(() => {});
}

export async function createInstructorNote(opts: {
  authorId: string;
  authorName: string;
  title: string;
  institutionSlug?: string | null;
  courseId?: string | null;
  recipientMode?: AudienceMode;
  recipientStudentIds?: string[];
}): Promise<string> {
  await ensureNoteCollections();
  const db = await getDb();
  const now = new Date();
  const recipientMode: AudienceMode =
    opts.recipientMode || (opts.courseId ? 'course' : 'all');
  const recipientStudentIds = Array.from(
    new Set((opts.recipientStudentIds || []).map((id) => String(id || '').trim()).filter(Boolean)),
  );
  const doc: InstructorNoteDoc = {
    authorId: opts.authorId,
    authorName: opts.authorName,
    institutionSlug: opts.institutionSlug || null,
    courseId: opts.courseId || null,
    title: opts.title.slice(0, 160) || 'Untitled note',
    body: '',
    fileUrl: null,
    filePublicId: null,
    fileResourceType: null,
    fileFormat: null,
    fileName: null,
    fileBytes: null,
    driveUrl: null,
    driveEmbedUrl: null,
    source: 'cloudinary',
    recipientMode,
    recipientStudentIds,
    published: false,
    listInLibrary: false,
    priceXAF: 0,
    sales: 0,
    createdAt: now,
    updatedAt: now,
  };
  const res = await db.collection('instructor_notes').insertOne(doc as unknown as Record<string, unknown>);
  return res.insertedId.toString();
}

export async function listNotesByAuthor(
  authorId: string,
  opts?: ListOptions,
): Promise<InstructorNoteView[]> {
  await ensureNoteCollections();
  const db = await getDb();
  const { skip, limit } = normalizePagination(opts);
  const docs = await db
    .collection('instructor_notes')
    .find({ authorId })
    .sort({ createdAt: -1, updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  return docs.map((d) => toNote(d as Record<string, unknown>));
}

export async function listPublishedNotesForStudent(opts: {
  studentId: string;
  institutionSlug?: string | null;
  page?: number;
  pageSize?: number;
}): Promise<InstructorNoteView[]> {
  await ensureNoteCollections();
  const db = await getDb();
  const { skip, limit } = normalizePagination(opts);
  const enrolledCourseIds = await db
    .collection('course_enrollments')
    .distinct('courseId', { studentId: opts.studentId })
    .catch(() => [] as string[]);

  const query: Record<string, unknown> = {
    published: true,
    $or: [
      { recipientMode: 'all' },
      {
        recipientMode: 'course',
        courseId: { $in: enrolledCourseIds as string[] },
      },
      {
        recipientMode: 'students',
        recipientStudentIds: opts.studentId,
      },
      // Legacy notes created before explicit audience targeting.
      { recipientMode: { $exists: false }, courseId: null },
      { recipientMode: { $exists: false }, courseId: { $exists: false } },
      { recipientMode: { $exists: false }, courseId: { $in: enrolledCourseIds as string[] } },
      { listInLibrary: true },
    ],
  };
  if (opts.institutionSlug) {
    query.$and = [
      {
        $or: [
          { institutionSlug: opts.institutionSlug },
          { institutionSlug: null },
          { institutionSlug: { $exists: false } },
          { listInLibrary: true },
        ],
      },
    ];
  }
  const docs = await db
    .collection('instructor_notes')
    .find(query)
    .sort({ createdAt: -1, updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  return docs.map((d) => toNote(d as Record<string, unknown>));
}

export async function listLibraryNotes(opts?: ListOptions): Promise<InstructorNoteView[]> {
  await ensureNoteCollections();
  const db = await getDb();
  const { skip, limit } = normalizePagination(opts);
  const docs = await db
    .collection('instructor_notes')
    .find({ published: true, listInLibrary: true })
    .sort({ createdAt: -1, updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  return docs.map((d) => toNote(d as Record<string, unknown>));
}

export async function getInstructorNote(id: string): Promise<InstructorNoteView | null> {
  await ensureNoteCollections();
  try {
    const db = await getDb();
    const doc = await db.collection('instructor_notes').findOne({ _id: new ObjectId(id) });
    return doc ? toNote(doc as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export type InstructorNotePatch = Partial<
  Pick<
    InstructorNoteDoc,
    | 'title'
    | 'body'
    | 'courseId'
    | 'institutionSlug'
    | 'fileUrl'
    | 'filePublicId'
    | 'fileResourceType'
    | 'fileFormat'
    | 'fileName'
    | 'fileBytes'
    | 'driveUrl'
    | 'driveEmbedUrl'
    | 'source'
    | 'recipientMode'
    | 'recipientStudentIds'
    | 'published'
    | 'listInLibrary'
    | 'priceXAF'
  >
>;

export async function updateInstructorNote(
  id: string,
  authorId: string,
  patch: InstructorNotePatch,
) {
  await ensureNoteCollections();
  const db = await getDb();
  const next: Record<string, unknown> = { ...patch, updatedAt: new Date() };

  if (typeof patch.driveUrl === 'string' && patch.driveUrl.trim()) {
    if (!isGoogleDriveShareUrl(patch.driveUrl)) {
      throw new Error('invalid_drive_url');
    }
    const emb = toDriveEmbedUrl(patch.driveUrl);
    next.driveUrl = emb.url;
    next.driveEmbedUrl = emb.embedUrl;
    next.source = 'drive';
  } else if (patch.driveUrl === null || patch.driveUrl === '') {
    next.driveUrl = null;
    next.driveEmbedUrl = null;
  }

  if (patch.fileUrl) {
    next.source = 'cloudinary';
  }

  if (patch.recipientMode) {
    next.recipientMode = patch.recipientMode;
    if (patch.recipientMode !== 'students') {
      next.recipientStudentIds = [];
    }
  }

  if (Array.isArray(patch.recipientStudentIds)) {
    next.recipientStudentIds = Array.from(
      new Set(patch.recipientStudentIds.map((id) => String(id || '').trim()).filter(Boolean)),
    );
  }

  if (typeof patch.priceXAF === 'number') {
    next.priceXAF = Math.max(0, Math.min(Math.round(patch.priceXAF), 5_000_000));
  }

  await db.collection('instructor_notes').updateOne(
    { _id: new ObjectId(id), authorId },
    { $set: next },
  );
}

export async function deleteInstructorNote(id: string, authorId: string) {
  await ensureNoteCollections();
  const db = await getDb();
  await db.collection('instructor_notes').deleteOne({ _id: new ObjectId(id), authorId });
}

export async function studentOwnsNote(
  note: InstructorNoteView,
  studentId: string,
): Promise<boolean> {
  if (note.authorId === studentId) return true;
  if (!note.published) return false;

  const db = await getDb();

  const inTargetAudience = await (async () => {
    if (note.recipientMode === 'students') {
      const ids = Array.isArray(note.recipientStudentIds) ? note.recipientStudentIds : [];
      return ids.includes(studentId);
    }
    if (note.recipientMode === 'course') {
      if (!note.courseId) return false;
      const enrolled = await db.collection('course_enrollments').findOne({
        courseId: note.courseId,
        studentId,
      });
      return Boolean(enrolled);
    }
    if (note.recipientMode === 'all') {
      return true;
    }

    // Legacy notes: course-linked or globally published.
    if (note.courseId) {
      const enrolled = await db.collection('course_enrollments').findOne({
        courseId: note.courseId,
        studentId,
      });
      return Boolean(enrolled);
    }
    return true;
  })();

  if (!inTargetAudience && !note.listInLibrary) {
    return false;
  }

  const buy = await db.collection('note_purchases').findOne({ noteId: note.id, studentId });
  if (buy) return true;

  // Students enrolled in the linked course always get class notes for free.
  if (note.courseId) {
    const enrolled = await db.collection('course_enrollments').findOne({
      courseId: note.courseId,
      studentId,
    });
    if (enrolled) return true;
  }

  // Free library / free published notes.
  if (note.priceXAF === 0) return true;
  return false;
}

export async function purchaseNote(opts: {
  note: InstructorNoteView;
  studentId: string;
}): Promise<{ created: boolean }> {
  await ensureNoteCollections();
  const db = await getDb();
  const res = await db.collection('note_purchases').updateOne(
    { noteId: opts.note.id, studentId: opts.studentId },
    {
      $setOnInsert: {
        noteId: opts.note.id,
        studentId: opts.studentId,
        priceXAF: opts.note.priceXAF,
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );
  if (res.upsertedCount > 0 && opts.note.priceXAF > 0) {
    await db
      .collection('instructor_notes')
      .updateOne({ _id: new ObjectId(opts.note.id) }, { $inc: { sales: 1 } });
  }
  return { created: res.upsertedCount > 0 };
}

export async function getPurchasedNoteIds(studentId: string): Promise<Set<string>> {
  try {
    await ensureNoteCollections();
    const db = await getDb();
    const ids = await db.collection('note_purchases').distinct('noteId', { studentId });
    return new Set(ids.map(String));
  } catch {
    return new Set();
  }
}
