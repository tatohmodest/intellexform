import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { ensureLearnCollections } from '@/lib/learn/ecosystem';

export type AssessmentKind = 'assignment' | 'exam';
export type QuestionType = 'mcq' | 'structural';
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
  title: string;
  instructions: string;
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
  /** Assignment: Drive / Docs / PDF share link */
  driveUrl?: string;
  driveEmbedUrl?: string;
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
}): Promise<string> {
  await ensureAssessmentCollections();
  const db = await getDb();
  const now = new Date();
  const doc: AssessmentDoc = {
    kind: opts.kind,
    authorId: opts.authorId,
    authorName: opts.authorName,
    institutionSlug: opts.institutionSlug || null,
    courseId: null,
    title: opts.title.slice(0, 160) || (opts.kind === 'exam' ? 'Untitled exam' : 'Untitled assignment'),
    instructions: '',
    studentTips:
      opts.kind === 'assignment'
        ? 'Upload your work to Google Drive or Google Docs → Share → Anyone with the link (viewer) → paste the link here. Your instructor opens it inside InTelleX - you do not need to email files.'
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
}): Promise<AssessmentView[]> {
  await ensureAssessmentCollections();
  const db = await getDb();
  const query: Record<string, unknown> = { published: true };
  if (opts.institutionSlug) {
    query.$or = [
      { institutionSlug: opts.institutionSlug },
      { institutionSlug: null },
    ];
  }
  const docs = await db.collection('assessments').find(query).sort({ dueAt: 1, updatedAt: -1 }).toArray();
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
      | 'studentTips'
      | 'questions'
      | 'durationMinutes'
      | 'dueAt'
      | 'terminateOnLeave'
      | 'lockNavigation'
      | 'published'
      | 'courseId'
      | 'institutionSlug'
    >
  >,
) {
  const db = await getDb();
  await db.collection('assessments').updateOne(
    { _id: new ObjectId(id), authorId },
    { $set: { ...patch, updatedAt: new Date() } },
  );
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
