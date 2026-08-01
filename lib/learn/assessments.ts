import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { ensureLearnCollections } from '@/lib/learn/ecosystem';
import { awardXp } from '@/lib/learn/repo';
import { XP } from '@/lib/learn/xp';

export type AssessmentKind = 'assignment' | 'exam';
export type QuestionType = 'mcq' | 'structural';
export type AudienceMode = 'all' | 'course' | 'students';
export type SubmissionStatus =
  | 'draft'
  | 'submitted'
  | 'graded'
  | 'terminated'
  | 'late';

export interface ExamQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  /** MCQ options */
  options?: string[];
  /** Index of correct option for auto-grade (instructor-only on create) */
  correctIndex?: number | null;
  points: number;
  hint?: string;
}

export interface AssessmentDoc {
  _id?: ObjectId;
  kind: AssessmentKind;
  authorId: string;
  authorName: string;
  institutionSlug?: string | null;
  courseId?: string | null;
  recipientMode: AudienceMode;
  recipientStudentIds?: string[];
  title: string;
  instructions: string;
  /** Assignment brief attachment uploaded by instructor (PDF/DOC/DOCX). */
  attachmentFileUrl?: string | null;
  attachmentFilePublicId?: string | null;
  attachmentFileResourceType?: string | null;
  attachmentFileFormat?: string | null;
  attachmentFileName?: string | null;
  attachmentFileBytes?: number | null;
  /** Tips shown to students (e.g. how to share a Drive link) */
  studentTips: string;
  questions: ExamQuestion[];
  /** Minutes; null = no timed limit */
  durationMinutes?: number | null;
  dueAt?: Date | null;
  /** Exam: leave tab / blur terminates attempt */
  terminateOnLeave: boolean;
  /** Exam: cannot navigate back */
  lockNavigation: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AssessmentView = Omit<AssessmentDoc, '_id'> & { id: string };

export interface AssessmentSubmissionDoc {
  _id?: ObjectId;
  assessmentId: string;
  studentId: string;
  studentName: string;
  /** @deprecated Prefer Cloudinary file* fields; kept for legacy Drive submissions */
  driveUrl?: string;
  driveEmbedUrl?: string;
  /** Assignment: Cloudinary-hosted file */
  fileUrl?: string;
  filePublicId?: string;
  fileResourceType?: string;
  fileFormat?: string;
  fileName?: string;
  fileBytes?: number;
  /** Exam answers keyed by question id */
  answers?: Record<string, string | number>;
  status: SubmissionStatus;
  score?: number | null;
  maxScore?: number | null;
  feedback?: string;
  terminatedReason?: string | null;
  startedAt?: Date | null;
  submittedAt?: Date | null;
  gradedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type SubmissionView = Omit<AssessmentSubmissionDoc, '_id'> & { id: string };

function toAssessment(d: Record<string, unknown>): AssessmentView {
  const { _id, ...rest } = d as unknown as AssessmentDoc & { _id: ObjectId };
  return { ...(rest as Omit<AssessmentDoc, '_id'>), id: _id.toString() };
}

function toSubmission(d: Record<string, unknown>): SubmissionView {
  const { _id, ...rest } = d as unknown as AssessmentSubmissionDoc & { _id: ObjectId };
  return { ...(rest as Omit<AssessmentSubmissionDoc, '_id'>), id: _id.toString() };
}

/** Convert Google Docs/Drive/PDF share URLs into embeddable preview URLs. */
export function toDriveEmbedUrl(raw: string): { url: string; embedUrl: string; kind: string } {
  const url = raw.trim();
  const doc = url.match(/docs\.google\.com\/document\/d\/([^/]+)/);
  if (doc) {
    return {
      url: `https://docs.google.com/document/d/${doc[1]}/edit`,
      embedUrl: `https://docs.google.com/document/d/${doc[1]}/preview`,
      kind: 'google_doc',
    };
  }
  const sheet = url.match(/docs\.google\.com\/spreadsheets\/d\/([^/]+)/);
  if (sheet) {
    return {
      url: `https://docs.google.com/spreadsheets/d/${sheet[1]}/edit`,
      embedUrl: `https://docs.google.com/spreadsheets/d/${sheet[1]}/preview`,
      kind: 'google_sheet',
    };
  }
  const slides = url.match(/docs\.google\.com\/presentation\/d\/([^/]+)/);
  if (slides) {
    return {
      url: `https://docs.google.com/presentation/d/${slides[1]}/edit`,
      embedUrl: `https://docs.google.com/presentation/d/${slides[1]}/preview`,
      kind: 'google_slides',
    };
  }
  const drive = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (drive) {
    return {
      url: `https://drive.google.com/file/d/${drive[1]}/view`,
      embedUrl: `https://drive.google.com/file/d/${drive[1]}/preview`,
      kind: 'drive_file',
    };
  }
  const open = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (open) {
    return {
      url: `https://drive.google.com/file/d/${open[1]}/view`,
      embedUrl: `https://drive.google.com/file/d/${open[1]}/preview`,
      kind: 'drive_file',
    };
  }
  return { url, embedUrl: url, kind: 'url' };
}

/** True when the URL is a Google Drive / Docs share link we can embed. */
export function isGoogleDriveShareUrl(raw: string): boolean {
  return toDriveEmbedUrl(raw).kind !== 'url';
}

export async function ensureAssessmentCollections() {
  await ensureLearnCollections();
  const db = await getDb();
  const names = new Set(
    (await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name),
  );
  if (!names.has('assessments')) await db.createCollection('assessments').catch(() => {});
  if (!names.has('assessment_submissions')) {
    await db.createCollection('assessment_submissions').catch(() => {});
  }
  await Promise.all([
    db.collection('assessments').createIndex({ authorId: 1, updatedAt: -1 }),
    db.collection('assessments').createIndex({ institutionSlug: 1, published: 1 }),
    db.collection('assessments').createIndex({ kind: 1, published: 1 }),
    db.collection('assessments').createIndex({ recipientMode: 1, published: 1 }),
    db.collection('assessments').createIndex({ recipientStudentIds: 1, published: 1 }),
    db
      .collection('assessment_submissions')
      .createIndex({ assessmentId: 1, studentId: 1 }, { unique: true }),
    db.collection('assessment_submissions').createIndex({ studentId: 1, updatedAt: -1 }),
  ]).catch(() => {});
}

export async function createAssessment(opts: {
  kind: AssessmentKind;
  authorId: string;
  authorName: string;
  title: string;
  institutionSlug?: string | null;
  courseId?: string | null;
  recipientMode?: AudienceMode;
  recipientStudentIds?: string[];
}): Promise<string> {
  await ensureAssessmentCollections();
  const db = await getDb();
  const now = new Date();
  const recipientMode: AudienceMode =
    opts.recipientMode || (opts.courseId ? 'course' : 'all');
  const recipientStudentIds = Array.from(
    new Set((opts.recipientStudentIds || []).map((id) => String(id || '').trim()).filter(Boolean)),
  );
  const doc: AssessmentDoc = {
    kind: opts.kind,
    authorId: opts.authorId,
    authorName: opts.authorName,
    institutionSlug: opts.institutionSlug || null,
    courseId: opts.courseId || null,
    recipientMode,
    recipientStudentIds,
    title: opts.title.slice(0, 160) || (opts.kind === 'exam' ? 'Untitled exam' : 'Untitled assignment'),
    instructions: '',
    attachmentFileUrl: null,
    attachmentFilePublicId: null,
    attachmentFileResourceType: null,
    attachmentFileFormat: null,
    attachmentFileName: null,
    attachmentFileBytes: null,
    studentTips:
      opts.kind === 'assignment'
        ? 'Upload a PDF (preferred for in-app preview), or DOC / DOCX, up to 10 MB. Your instructor opens and downloads it inside InTelleX.'
        : 'This exam is one question at a time. You cannot go back. Leaving this tab or window ends the exam.',
    questions: [],
    durationMinutes: opts.kind === 'exam' ? 60 : null,
    dueAt: null,
    terminateOnLeave: opts.kind === 'exam',
    lockNavigation: opts.kind === 'exam',
    published: false,
    createdAt: now,
    updatedAt: now,
  };
  const res = await db.collection('assessments').insertOne(doc as unknown as Record<string, unknown>);
  await awardXp(opts.authorId, XP.CREATE_ASSESSMENT).catch(() => {});
  return res.insertedId.toString();
}

export async function listAssessmentsByAuthor(authorId: string): Promise<AssessmentView[]> {
  await ensureAssessmentCollections();
  const db = await getDb();
  const docs = await db
    .collection('assessments')
    .find({ authorId })
    .sort({ updatedAt: -1 })
    .toArray();
  return docs.map((d) => toAssessment(d as Record<string, unknown>));
}

export async function listAssessmentsForCampus(
  institutionSlug: string,
  opts?: { includeDraftsForAuthorId?: string },
): Promise<AssessmentView[]> {
  await ensureAssessmentCollections();
  const db = await getDb();
  const query: Record<string, unknown> = { institutionSlug };
  if (opts?.includeDraftsForAuthorId) {
    query.$or = [{ published: true }, { authorId: opts.includeDraftsForAuthorId }];
  } else {
    query.published = true;
  }
  const docs = await db.collection('assessments').find(query).sort({ updatedAt: -1 }).toArray();
  return docs.map((d) => toAssessment(d as Record<string, unknown>));
}

export async function listPublishedForStudent(opts: {
  studentId: string;
  institutionSlug?: string | null;
  page?: number;
  pageSize?: number;
}): Promise<AssessmentView[]> {
  await ensureAssessmentCollections();
  const db = await getDb();
  const page = Math.max(1, Number(opts.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(opts.pageSize) || 20));
  const skip = (page - 1) * pageSize;

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
      // Legacy behavior before explicit audience targeting.
      { recipientMode: { $exists: false }, courseId: null },
      { recipientMode: { $exists: false }, courseId: { $exists: false } },
      { recipientMode: { $exists: false }, courseId: { $in: enrolledCourseIds as string[] } },
    ],
  };
  if (opts.institutionSlug) {
    query.$and = [
      {
        $or: [
          { institutionSlug: opts.institutionSlug },
          { institutionSlug: null },
          { institutionSlug: { $exists: false } },
        ],
      },
    ];
  }
  const docs = await db
    .collection('assessments')
    .find(query)
    .sort({ dueAt: 1, updatedAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .toArray();
  return docs.map((d) => toAssessment(d as Record<string, unknown>));
}

export async function getAssessment(id: string): Promise<AssessmentView | null> {
  try {
    await ensureAssessmentCollections();
    const db = await getDb();
    const doc = await db.collection('assessments').findOne({ _id: new ObjectId(id) });
    return doc ? toAssessment(doc as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Strip answer keys before sending an exam to a student. */
export function publicAssessment(a: AssessmentView): AssessmentView {
  return {
    ...a,
    questions: (a.questions || []).map((q) => ({
      ...q,
      correctIndex: undefined,
    })),
  };
}

export async function updateAssessment(
  id: string,
  authorId: string,
  patch: Partial<
    Pick<
      AssessmentDoc,
      | 'title'
      | 'instructions'
      | 'attachmentFileUrl'
      | 'attachmentFilePublicId'
      | 'attachmentFileResourceType'
      | 'attachmentFileFormat'
      | 'attachmentFileName'
      | 'attachmentFileBytes'
      | 'studentTips'
      | 'questions'
      | 'durationMinutes'
      | 'dueAt'
      | 'terminateOnLeave'
      | 'lockNavigation'
      | 'published'
      | 'courseId'
      | 'institutionSlug'
      | 'recipientMode'
      | 'recipientStudentIds'
    >
  >,
) {
  const db = await getDb();
  const oid = new ObjectId(id);
  const existing = await db.collection('assessments').findOne({ _id: oid, authorId });
  await db.collection('assessments').updateOne(
    { _id: oid, authorId },
    {
      $set: {
        ...patch,
        recipientStudentIds: Array.isArray(patch.recipientStudentIds)
          ? Array.from(
              new Set(
                patch.recipientStudentIds
                  .map((id) => String(id || '').trim())
                  .filter(Boolean),
              ),
            )
          : patch.recipientStudentIds,
        updatedAt: new Date(),
      },
    },
  );
  if (patch.published === true && existing && !existing.published) {
    await awardXp(authorId, XP.PUBLISH_ASSESSMENT).catch(() => {});
  }
}

export async function getSubmission(
  assessmentId: string,
  studentId: string,
): Promise<SubmissionView | null> {
  await ensureAssessmentCollections();
  const db = await getDb();
  const doc = await db.collection('assessment_submissions').findOne({ assessmentId, studentId });
  return doc ? toSubmission(doc as Record<string, unknown>) : null;
}

export async function listSubmissions(assessmentId: string): Promise<SubmissionView[]> {
  await ensureAssessmentCollections();
  const db = await getDb();
  const docs = await db
    .collection('assessment_submissions')
    .find({ assessmentId })
    .sort({ submittedAt: -1, updatedAt: -1 })
    .toArray();
  return docs.map((d) => toSubmission(d as Record<string, unknown>));
}

export async function upsertSubmission(opts: {
  assessmentId: string;
  studentId: string;
  studentName: string;
  patch: Partial<
    Pick<
      AssessmentSubmissionDoc,
      | 'driveUrl'
      | 'driveEmbedUrl'
      | 'fileUrl'
      | 'filePublicId'
      | 'fileResourceType'
      | 'fileFormat'
      | 'fileName'
      | 'fileBytes'
      | 'answers'
      | 'status'
      | 'score'
      | 'maxScore'
      | 'feedback'
      | 'terminatedReason'
      | 'startedAt'
      | 'submittedAt'
      | 'gradedAt'
    >
  >;
}): Promise<SubmissionView> {
  await ensureAssessmentCollections();
  const db = await getDb();
  const now = new Date();
  await db.collection('assessment_submissions').updateOne(
    { assessmentId: opts.assessmentId, studentId: opts.studentId },
    {
      $set: { ...opts.patch, updatedAt: now },
      $setOnInsert: {
        assessmentId: opts.assessmentId,
        studentId: opts.studentId,
        studentName: opts.studentName,
        createdAt: now,
      },
    },
    { upsert: true },
  );
  const doc = await db.collection('assessment_submissions').findOne({
    assessmentId: opts.assessmentId,
    studentId: opts.studentId,
  });
  return toSubmission(doc as Record<string, unknown>);
}

export function autoGradeExam(
  assessment: AssessmentView,
  answers: Record<string, string | number>,
): { score: number; maxScore: number } {
  let score = 0;
  let maxScore = 0;
  for (const q of assessment.questions || []) {
    maxScore += q.points || 0;
    if (q.type === 'mcq' && typeof q.correctIndex === 'number') {
      const ans = answers[q.id];
      if (Number(ans) === q.correctIndex) score += q.points || 0;
    }
  }
  return { score, maxScore };
}

export async function canStudentAccessAssessment(
  assessment: AssessmentView,
  studentId: string,
): Promise<boolean> {
  if (assessment.authorId === studentId) return true;
  if (!assessment.published) return false;

  if (assessment.recipientMode === 'students') {
    const ids = Array.isArray(assessment.recipientStudentIds)
      ? assessment.recipientStudentIds
      : [];
    return ids.includes(studentId);
  }

  if (assessment.recipientMode === 'course') {
    if (!assessment.courseId) return false;
    const db = await getDb();
    const enrolled = await db.collection('course_enrollments').findOne({
      courseId: assessment.courseId,
      studentId,
    });
    return Boolean(enrolled);
  }

  if (assessment.recipientMode === 'all') {
    return true;
  }

  // Legacy behavior for records created before recipientMode.
  if (assessment.courseId) {
    const db = await getDb();
    const enrolled = await db.collection('course_enrollments').findOne({
      courseId: assessment.courseId,
      studentId,
    });
    return Boolean(enrolled);
  }

  return true;
}
