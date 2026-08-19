/**
 * Interactive AI book tutor.
 *
 * Parsing is local (zero tokens). The LLM — when configured — studies each
 * chapter once and writes a reusable curriculum (lessons, examples, questions,
 * rubrics) into Mongo. We never store a model. Each learner keeps their own
 * progress row for that curriculum path.
 */

import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { awardXp } from '@/lib/learn/repo';
import { XP } from '@/lib/learn/xp';
import { getBook, studentCanReadBook } from '@/lib/learn/ecosystem';
import { isLLMConfigured } from '@/lib/learn/tutor';
import { openaiJsonCompletion, parseJsonObject } from '@/lib/learn/openaiJson';
import { parseBookFile, splitIntoChapters, looksLikeHeadingCatalog, type ParsedChapter } from '@/lib/learn/bookParse';
import { generateChapterSteps, inferLanguage, lessonNeedsCheck, looksLikeCode, planBookCurriculum, stripTutorMetaSpeak, type CurriculumChapterPlan, type LessonUiType } from '@/lib/learn/bookTutorCurriculum';
import { BOOK_TUTOR_CLARIFY_SYSTEM, BOOK_TUTOR_GRADE_SYSTEM } from '@/lib/learn/bookTutorPrompt';

export type BookTutorPhase = 'teaching' | 'quiz' | 'passed' | 'complete';
export type BookTutorLessonKind = 'orient' | 'teach' | 'practice';
export type BookTutorStepType =
  | 'introduction'
  | 'explanation'
  | 'example'
  | 'guided_practice'
  | 'assessment'
  | 'transition';
export type BookTutorUiType = LessonUiType;

export type BookTutorCheck = {
  id: string;
  prompt: string;
  placement: 'mid' | 'end';
  expected: boolean;
  hint: string;
};

export type BookTutorLesson = {
  id: string;
  chapterId: string;
  chapterTitle: string;
  sortOrder: number;
  title: string;
  explanation: string;
  example: string;
  question: string;
  criteria: string;
  keywords: string[];
  kind?: BookTutorLessonKind;
  stepType?: BookTutorStepType;
  interactionRequired?: boolean;
  objective?: string;
  keypoints?: string[];
  practiceTask?: string;
  note?: string;
  watchOut?: string;
  analogy?: string;
  checks?: BookTutorCheck[];
  uiType?: BookTutorUiType;
  exampleType?: 'code_snippet' | 'mathematical_formula' | 'real_world_scenario';
  language?: string;
  choices?: string[];
  correctChoice?: number | null;
};

export type BookTutorChapterOutline = { id: string; title: string };

export type BookTutorPathDoc = {
  _id?: ObjectId;
  ownerUserId: string;
  ownerName: string;
  sourceBookId: string | null;
  title: string;
  authorName: string;
  sourceFilename: string | null;
  isPrivate: boolean;
  status: 'generating' | 'ready' | 'failed';
  error?: string;
  engine: 'llm' | 'heuristic' | 'mixed';
  /** Titles only. Full chapter markdown is never persisted. */
  chapterOutline: BookTutorChapterOutline[];
  /** Legacy field — ignored on write. Old rows may still have it. */
  chapters?: ParsedChapter[];
  lessons: BookTutorLesson[];
  curriculum?: CurriculumChapterPlan[];
  nextChapterIndex?: number;
  buildNote?: string;
  pageCount?: number;
  sourceChars?: number;
  sourceBytes?: number;
  createdAt: Date;
  updatedAt: Date;
};

export type BookTutorPathSummary = {
  id: string;
  title: string;
  authorName: string;
  ownerUserId: string;
  sourceBookId: string | null;
  isPrivate: boolean;
  status: BookTutorPathDoc['status'];
  engine: BookTutorPathDoc['engine'];
  lessonCount: number;
  chapterCount: number;
  sourceFilename: string | null;
  updatedAt: Date;
};

export type BookTutorProgressDoc = {
  userId: string;
  pathId: string;
  currentLessonIndex: number;
  phase: BookTutorPhase;
  completedLessonIds: string[];
  lastFeedback: string;
  lastCorrect: boolean | null;
  attemptsOnCurrent: number;
  checkpointPassed: number;
  furthestLessonIndex?: number;
  lessonAnswers?: Record<string, { answer: string; feedback: string; isCorrect: boolean }>;
  updatedAt: Date;
  createdAt: Date;
};

export type PublicLesson = {
  id: string;
  chapterId: string;
  chapterTitle: string;
  sortOrder: number;
  title: string;
  explanation: string;
  example: string;
  question: string;
  kind: BookTutorLessonKind;
  stepType: BookTutorStepType;
  interactionRequired: boolean;
  savedAnswer: string;
  savedFeedback: string;
  savedCorrect: boolean | null;
  canGoBack: boolean;
  reviewing: boolean;
  keypoints: string[];
  practiceTask: string;
  note: string;
  watchOut: string;
  analogy: string;
  checks: Array<{ id: string; prompt: string; placement: 'mid' | 'end' }>;
  uiType: BookTutorUiType;
  language: string;
  choices: string[];
  index: number;
  total: number;
};

export type CourseContentsItem = {
  id: string;
  title: string;
  startIndex: number;
  stepCount: number;
  completedCount: number;
  status: 'completed' | 'in_progress' | 'not_started';
  looksLikeContents: boolean;
};

export type BuildPhase = 'analyzing' | 'planning' | 'generating' | 'validating' | 'ready' | 'failed';

const STOP = new Set(
  'a an and are as at be but by for from has have how i in is it its of on or that the this to was what when where which who why will with you your me my can do does'.split(
    ' ',
  ),
);

let ensured = false;

export class BookTutorError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

async function ensureBookTutor() {
  if (ensured) return;
  const db = await getDb();
  await Promise.all([
    db.createCollection('book_tutor_paths').catch(() => {}),
    db.createCollection('book_tutor_progress').catch(() => {}),
    db.collection('book_tutor_paths').createIndex({ ownerUserId: 1, updatedAt: -1 }),
    db.collection('book_tutor_paths').createIndex({ sourceBookId: 1, isPrivate: 1, status: 1 }),
    db.collection('book_tutor_paths').createIndex(
      { sourceBookId: 1 },
      { unique: true, partialFilterExpression: { isPrivate: false, sourceBookId: { $type: 'string' } } },
    ),
    db.collection('book_tutor_progress').createIndex({ userId: 1, pathId: 1 }, { unique: true }),
  ]).catch(() => {});
  ensured = true;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
}

function chapterCountOf(path: Pick<BookTutorPathDoc, 'chapterOutline' | 'chapters'>): number {
  return path.chapterOutline?.length || path.chapters?.length || 0;
}

function toSummary(doc: BookTutorPathDoc & { _id: ObjectId }): BookTutorPathSummary {
  return {
    id: doc._id.toString(),
    title: doc.title,
    authorName: doc.authorName,
    ownerUserId: doc.ownerUserId,
    sourceBookId: doc.sourceBookId,
    isPrivate: doc.isPrivate,
    status: doc.status,
    engine: doc.engine,
    lessonCount: doc.lessons?.length || 0,
    chapterCount: chapterCountOf(doc),
    sourceFilename: doc.sourceFilename,
    updatedAt: doc.updatedAt,
  };
}

function resolveUiType(lesson: BookTutorLesson): BookTutorUiType {
  if (lesson.uiType === 'code_editor' || lesson.uiType === 'multiple_choice' || lesson.uiType === 'text_input') {
    return lesson.uiType;
  }
  const blob = `${lesson.explanation}\n${lesson.example}\n${lesson.question}\n${lesson.practiceTask || ''}`;
  if (looksLikeCode(blob) || inferLanguage(blob)) return 'code_editor';
  return 'text_input';
}

function publicExample(lesson: BookTutorLesson): string {
  const raw = String(lesson.example || '').trim();
  if (!raw) return '';
  if (/```/.test(raw)) return raw;
  if (lesson.exampleType === 'code_snippet' || looksLikeCode(raw)) {
    const lang = lesson.language && lesson.language !== 'other' ? lesson.language : inferLanguage(raw);
    return `\`\`\`${lang && lang !== 'other' ? lang : ''}\n${raw}\n\`\`\``;
  }
  return raw;
}

function inventedCallout(text: string): boolean {
  return /maya’?s 40-second|labelled drawer|kitchen recipe|lock and a key|mash \*\*|go do the thing this stretch asked for|hold onto these/i.test(
    text,
  );
}

function publicLesson(lessons: BookTutorLesson[], index: number): PublicLesson | null {
  const lesson = lessons[index];
  if (!lesson) return null;
  const uiType = resolveUiType(lesson);
  const choices = uiType === 'multiple_choice' && Array.isArray(lesson.choices) ? lesson.choices.map(String).filter(Boolean).slice(0, 6) : [];
  const explanation = stripTutorMetaSpeak(lesson.explanation);
  const junk = looksLikeHeadingCatalog(explanation);
  const needsCheck = junk ? false : lessonNeedsCheck(lesson);
  const stepType: BookTutorStepType = junk
    ? 'explanation'
    : lesson.stepType ||
      (lesson.kind === 'practice'
        ? 'guided_practice'
        : lesson.kind === 'orient' || !needsCheck
          ? 'introduction'
          : 'assessment');
  const kind: BookTutorLessonKind =
    stepType === 'introduction' ? 'orient' : stepType === 'guided_practice' ? 'practice' : 'teach';
  const exampleRaw = stripTutorMetaSpeak(lesson.example || '');
  const keypoints = (Array.isArray(lesson.keypoints) ? lesson.keypoints.map(String) : []).filter(
    (k) => k.length > 24 && !looksLikeHeadingCatalog(k) && !inventedCallout(k) && !/\s-\s.*\s-\s/.test(k),
  );
  const note = inventedCallout(String(lesson.note || '')) ? '' : stripTutorMetaSpeak(String(lesson.note || ''));
  const watchOut = inventedCallout(String(lesson.watchOut || '')) ? '' : stripTutorMetaSpeak(String(lesson.watchOut || ''));
  const analogy = inventedCallout(String(lesson.analogy || '')) ? '' : stripTutorMetaSpeak(String(lesson.analogy || ''));
  return {
    id: lesson.id,
    chapterId: lesson.chapterId,
    chapterTitle: lesson.chapterTitle,
    sortOrder: lesson.sortOrder,
    title: stripTutorMetaSpeak(lesson.title) || lesson.title,
    explanation: looksLikeHeadingCatalog(explanation)
      ? 'This step was built from a table of contents, not from a real chapter. Delete this tutor and upload the book again.'
      : explanation,
    example: looksLikeHeadingCatalog(exampleRaw) || inventedCallout(exampleRaw) ? '' : publicExample({ ...lesson, example: exampleRaw }),
    question: needsCheck ? lesson.question : '',
    kind,
    stepType,
    interactionRequired: needsCheck,
    keypoints: needsCheck ? keypoints.slice(0, 6) : [],
    practiceTask: stepType === 'guided_practice' && !looksLikeHeadingCatalog(String(lesson.practiceTask || '')) ? String(lesson.practiceTask || '') : '',
    note: needsCheck ? note : '',
    watchOut: needsCheck ? watchOut : '',
    analogy: needsCheck ? analogy : '',
    checks: [],
    uiType: uiType === 'multiple_choice' && choices.length < 2 ? 'text_input' : uiType,
    language: String(lesson.language || inferLanguage(`${lesson.explanation}\n${lesson.example}`) || ''),
    choices,
    index,
    total: lessons.length,
    savedAnswer: '',
    savedFeedback: '',
    savedCorrect: null,
    canGoBack: index > 0,
    reviewing: false,
  };
}

function isContentsNavTitle(title: string): boolean {
  return /^(?:#{1,3}\s+)?(?:contents(?: in detail)?|table of contents|list of (?:figures|tables|illustrations)|index)\b/i.test(
    String(title || '').replace(/^#+\s*/, '').trim(),
  );
}

function courseContents(lessons: BookTutorLesson[], completedIds: string[]): CourseContentsItem[] {
  const completed = new Set(completedIds);
  const items: CourseContentsItem[] = [];
  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i];
    const last = items[items.length - 1];
    if (last && last.id === lesson.chapterId) {
      last.stepCount += 1;
      if (completed.has(lesson.id)) last.completedCount += 1;
      continue;
    }
    items.push({
      id: lesson.chapterId,
      title: lesson.chapterTitle,
      startIndex: i,
      stepCount: 1,
      completedCount: completed.has(lesson.id) ? 1 : 0,
      status: 'not_started',
      looksLikeContents: isContentsNavTitle(lesson.chapterTitle) || looksLikeHeadingCatalog(lesson.explanation || ''),
    });
  }
  for (const item of items) {
    if (item.stepCount > 0 && item.completedCount >= item.stepCount) item.status = 'completed';
    else if (item.completedCount > 0) item.status = 'in_progress';
    else item.status = 'not_started';
  }
  return items;
}

function buildPhaseOf(path: BookTutorPathDoc): BuildPhase {
  if (path.status === 'ready') return 'ready';
  if (path.status === 'failed') return 'failed';
  const note = String(path.buildNote || '').toLowerCase();
  if (note.includes('validat')) return 'validating';
  if ((path.nextChapterIndex || 0) > 0 || (path.lessons?.length || 0) > 0) return 'generating';
  if (path.curriculum?.length) return 'planning';
  return 'analyzing';
}

function pathIsPlayable(path: Pick<BookTutorPathDoc, 'status' | 'lessons'>): boolean {
  return path.status === 'ready' || (path.status === 'generating' && (path.lessons?.length || 0) > 0);
}

export async function canAccessPath(userId: string, path: BookTutorPathDoc & { id?: string }): Promise<boolean> {
  if (path.ownerUserId === userId) return true;
  if (path.isPrivate) return false;
  if (path.status === 'failed') return false;
  if (path.status !== 'ready' && path.status !== 'generating') return false;
  if (path.sourceBookId) {
    const book = await getBook(path.sourceBookId);
    if (!book) return false;
    return studentCanReadBook(userId, book);
  }
  return true;
}

export async function getPath(id: string): Promise<(BookTutorPathDoc & { id: string }) | null> {
  await ensureBookTutor();
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db.collection('book_tutor_paths').findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  return { ...(doc as unknown as BookTutorPathDoc), id: String(doc._id) };
}

export async function listPathsForUser(userId: string): Promise<{
  mine: BookTutorPathSummary[];
  library: BookTutorPathSummary[];
}> {
  await ensureBookTutor();
  const db = await getDb();
  const col = db.collection('book_tutor_paths');
  const [mineDocs, libDocs] = await Promise.all([
    col.find({ ownerUserId: userId }).sort({ updatedAt: -1 }).limit(40).toArray(),
    col
      .find({ isPrivate: false, status: 'ready', sourceBookId: { $ne: null } })
      .sort({ updatedAt: -1 })
      .limit(40)
      .toArray(),
  ]);
  const mine = mineDocs.map((d) => toSummary(d as unknown as BookTutorPathDoc & { _id: ObjectId }));
  const mineIds = new Set(mine.map((p) => p.id));
  const library = libDocs
    .map((d) => toSummary(d as unknown as BookTutorPathDoc & { _id: ObjectId }))
    .filter((p) => !mineIds.has(p.id));
  return { mine, library };
}

export async function deletePathForUser(userId: string, pathId: string) {
  const path = await getPath(pathId);
  if (!path) throw new BookTutorError('Book tutor not found.', 404);
  if (path.ownerUserId !== userId) throw new BookTutorError('You can only delete tutors you created.', 403);
  const db = await getDb();
  await db.collection('book_tutor_progress').deleteMany({ pathId });
  await db.collection('book_tutor_paths').deleteOne({ _id: new ObjectId(pathId) });
  await clearSources(pathId);
  return { ok: true };
}

export async function getProgress(userId: string, pathId: string): Promise<BookTutorProgressDoc> {
  await ensureBookTutor();
  const db = await getDb();
  const existing = await db.collection('book_tutor_progress').findOne({ userId, pathId });
  if (existing) return existing as unknown as BookTutorProgressDoc;
  const now = new Date();
  const doc: BookTutorProgressDoc = {
    userId,
    pathId,
    currentLessonIndex: 0,
    phase: 'teaching',
    completedLessonIds: [],
    lastFeedback: '',
    lastCorrect: null,
    attemptsOnCurrent: 0,
    checkpointPassed: 0,
    furthestLessonIndex: 0,
    lessonAnswers: {},
    createdAt: now,
    updatedAt: now,
  };
  await db.collection('book_tutor_progress').insertOne(doc as unknown as Record<string, unknown>);
  return doc;
}

export async function getLearnerSession(userId: string, pathId: string) {
  const path0 = await getPath(pathId);
  if (!path0) throw new BookTutorError('Book tutor not found.', 404);
  if (!(await canAccessPath(userId, path0))) {
    throw new BookTutorError('You do not have access to this book tutor.', 403);
  }
  if (path0.status === 'generating') {
    const staleMs = Date.now() - new Date(path0.updatedAt).getTime();
    if (staleMs > 45 * 60 * 1000 && !(path0.lessons?.length)) {
      path0.status = 'failed';
      path0.error = path0.error || 'This book took too long to study. Try an unlocked EPUB, or a PDF you can select text in.';
    } else {
      await continuePathBuild(pathId).catch((err) => console.error('book tutor resume failed:', err));
    }
  }
  const path = (await getPath(pathId)) || path0;
  const phase = buildPhaseOf(path);
  const playable = pathIsPlayable(path);
  if (!playable) {
    return {
      path: {
        id: path.id,
        title: path.title,
        authorName: path.authorName,
        status: path.status,
        error: path.error || null,
        engine: path.engine,
        lessonCount: path.lessons.length,
        chapterCount: path.curriculum?.length || chapterCountOf(path),
        isPrivate: path.isPrivate,
        sourceBookId: path.sourceBookId,
        canDelete: path.ownerUserId === userId,
        buildNote: path.buildNote || null,
        buildChapter: path.nextChapterIndex || 0,
        buildChapters: path.curriculum?.length || chapterCountOf(path),
        buildPhase: phase,
        stillBuilding: path.status === 'generating',
      },
      progress: null,
      lesson: null,
      contents: [] as CourseContentsItem[],
    };
  }
  const progress = await getProgress(userId, pathId);
  const idx = Math.min(progress.currentLessonIndex, Math.max(0, path.lessons.length - 1));
  const completedIds = progress.completedLessonIds || [];
  const stillBuilding = path.status === 'generating';
  const waitingOnBuild = stillBuilding && idx >= path.lessons.length - 1 && progress.phase !== 'complete';
  const lesson = progress.phase === 'complete' ? null : publicLesson(path.lessons, idx);
  const saved = lesson ? progress.lessonAnswers?.[lesson.id] : null;
  const alreadyDone = Boolean(lesson && completedIds.includes(lesson.id));
  if (lesson) {
    lesson.savedAnswer = saved?.answer || '';
    lesson.savedFeedback = saved?.feedback || '';
    lesson.savedCorrect = saved ? saved.isCorrect : alreadyDone ? true : null;
    lesson.canGoBack = idx > 0 || progress.phase === 'complete';
    lesson.reviewing = alreadyDone;
    lesson.total = path.lessons.length;
  }
  const contents = courseContents(path.lessons, completedIds);
  return {
    path: {
      id: path.id,
      title: path.title,
      authorName: path.authorName,
      status: path.status,
      error: null as string | null,
      engine: path.engine,
      lessonCount: path.lessons.length,
      chapterCount: contents.length || chapterCountOf(path),
      isPrivate: path.isPrivate,
      sourceBookId: path.sourceBookId,
      canDelete: path.ownerUserId === userId,
      buildNote: stillBuilding ? path.buildNote || null : null,
      buildChapter: path.nextChapterIndex || 0,
      buildChapters: path.curriculum?.length || contents.length,
      buildPhase: phase,
      stillBuilding,
    },
    progress: {
      currentLessonIndex: idx,
      phase: progress.phase,
      completedCount: completedIds.length,
      lastFeedback: saved?.feedback || progress.lastFeedback,
      lastCorrect: saved ? saved.isCorrect : alreadyDone ? true : progress.lastCorrect,
      attemptsOnCurrent: progress.attemptsOnCurrent,
      checkpointPassed: progress.checkpointPassed || 0,
      waitingOnBuild,
    },
    lesson,
    contents,
  };
}

async function savePath(doc: Omit<BookTutorPathDoc, '_id'>): Promise<string> {
  await ensureBookTutor();
  const db = await getDb();
  const res = await db.collection('book_tutor_paths').insertOne(doc as unknown as Record<string, unknown>);
  return res.insertedId.toString();
}

function outlineOf(chapters: Array<{ id: string; title: string }>): BookTutorChapterOutline[] {
  return chapters.map((c) => ({ id: c.id, title: c.title }));
}

const building = new Set<string>();

async function sourcesCollection() {
  const db = await getDb();
  await db.collection('book_tutor_sources').createIndex({ pathId: 1 }, { unique: true }).catch(() => {});
  return db.collection('book_tutor_sources');
}

async function saveSources(pathId: string, chapters: ParsedChapter[]) {
  const col = await sourcesCollection();
  await col.updateOne({ pathId }, { $set: { pathId, chapters, updatedAt: new Date() } }, { upsert: true });
}

async function loadSources(pathId: string): Promise<ParsedChapter[] | null> {
  const col = await sourcesCollection();
  const doc = (await col.findOne({ pathId })) as { chapters?: ParsedChapter[] } | null;
  const chapters = Array.isArray(doc?.chapters) ? doc.chapters : [];
  return chapters.length ? chapters : null;
}

async function clearSources(pathId: string) {
  const col = await sourcesCollection();
  await col.deleteOne({ pathId });
}

export async function continuePathBuild(pathId: string) {
  if (building.has(pathId)) return;
  building.add(pathId);
  try {
    await runPathBuild(pathId);
  } finally {
    building.delete(pathId);
  }
}

async function runPathBuild(pathId: string) {
  const db = await getDb();
  if (!ObjectId.isValid(pathId)) return;
  const oid = new ObjectId(pathId);
  const path = await getPath(pathId);
  if (!path || path.status !== 'generating') return;
  const sources = await loadSources(pathId);
  if (!sources?.length) {
    const stillExtracting = !path.curriculum?.length && !(path.lessons?.length);
    if (stillExtracting) return;
    const done = (path.nextChapterIndex || 0) >= (path.curriculum?.length || 0) && path.lessons.length;
    if (done) {
      await db.collection('book_tutor_paths').updateOne(
        { _id: oid },
        { $set: { status: 'ready', error: '', buildNote: `Complete · ${path.lessons.length} steps`, updatedAt: new Date() } },
      );
      return;
    }
    if (path.lessons.length) {
      await db.collection('book_tutor_paths').updateOne(
        { _id: oid },
        {
          $set: {
            status: 'ready',
            error: '',
            buildNote: `Generated ${path.lessons.length} steps through chapter ${path.nextChapterIndex || 0} of ${path.curriculum?.length || 0}. Re-upload to continue the rest.`,
            updatedAt: new Date(),
          },
        },
      );
      return;
    }
    await db.collection('book_tutor_paths').updateOne(
      { _id: oid },
      {
        $set: {
          status: 'failed',
          error: 'Generation was interrupted and the book text is no longer in memory. Upload the book again.',
          updatedAt: new Date(),
        },
      },
    );
    return;
  }
  let plan = path.curriculum || [];
  let teach = sources;
  if (!plan.length) {
    const planned = await planBookCurriculum(sources);
    teach = planned.chapters;
    plan = planned.plan;
    await saveSources(pathId, teach);
    await db.collection('book_tutor_paths').updateOne(
      { _id: oid },
      {
        $set: {
          curriculum: plan,
          nextChapterIndex: 0,
          chapterOutline: outlineOf(teach),
          buildNote: `Planning ${plan.length} chapters`,
          updatedAt: new Date(),
        },
      },
    );
  }
  let next = path.nextChapterIndex || 0;
  let lessons = [...(path.lessons || [])];
  let llm = 0;
  let heuristic = 0;
  while (next < plan.length) {
    const chapter = teach.find((c) => c.id === plan[next].id) || teach[next];
    if (!chapter) {
      next += 1;
      continue;
    }
    const { lessons: made, plan: updated, engine } = await generateChapterSteps({
      chapter,
      plan: plan[next],
      startIndex: lessons.length,
      deadlineMs: Date.now() + 35_000,
    });
    lessons = lessons.concat(made);
    plan[next] = { ...updated, status: made.length ? 'complete' : updated.status };
    next += 1;
    if (engine === 'llm') llm += 1;
    else if (engine === 'mixed') {
      llm += 1;
      heuristic += 1;
    } else heuristic += 1;
    const engineLabel = llm && heuristic ? 'mixed' : llm ? 'llm' : 'heuristic';
    await db.collection('book_tutor_paths').updateOne(
      { _id: oid },
      {
        $set: {
          lessons,
          curriculum: plan,
          nextChapterIndex: next,
          engine: engineLabel,
          chapterOutline: outlineOf(teach),
          buildNote: `Chapter ${next} of ${plan.length} · ${lessons.length} steps`,
          updatedAt: new Date(),
        },
      },
    );
    if (next < plan.length) return;
  }
  if (!lessons.length) {
    await db.collection('book_tutor_paths').updateOne(
      { _id: oid },
      { $set: { status: 'failed', error: 'Could not find real chapters to teach — the file looked like a table of contents or title pages.', updatedAt: new Date() } },
    );
    await clearSources(pathId);
    return;
  }
  await db.collection('book_tutor_paths').updateOne(
    { _id: oid },
    { $set: { buildNote: 'Validating course…', updatedAt: new Date() } },
  );
  await db.collection('book_tutor_paths').updateOne(
    { _id: oid },
    {
      $set: {
        status: 'ready',
        lessons,
        curriculum: plan,
        nextChapterIndex: plan.length,
        engine: llm && heuristic ? 'mixed' : llm ? 'llm' : 'heuristic',
        buildNote: `Ready · ${lessons.length} steps across ${plan.length} chapters`,
        error: '',
        updatedAt: new Date(),
      },
    },
  );
  await clearSources(pathId);
}

export async function createPathFromUpload(opts: {
  userId: string;
  userName: string;
  buffer: Buffer;
  filename: string;
  mime?: string;
  title?: string;
}): Promise<string> {
  const sourceBytes = opts.buffer.length;
  const title = (opts.title || opts.filename.replace(/\.[^.]+$/, '') || 'Untitled book').slice(0, 160);
  const id = await savePath({
    ownerUserId: opts.userId,
    ownerName: opts.userName,
    sourceBookId: null,
    title,
    authorName: opts.userName,
    sourceFilename: opts.filename.slice(0, 180),
    isPrivate: true,
    status: 'generating',
    engine: 'heuristic',
    chapterOutline: [],
    lessons: [],
    sourceBytes,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const work = finishPathFromUpload(id, {
    buffer: opts.buffer,
    filename: opts.filename,
    mime: opts.mime,
    title: opts.title,
  });
  work.catch((err) => console.error('book tutor background build failed:', err));
  await work;
  return id;
}

async function finishPathFromUpload(
  pathId: string,
  opts: { buffer: Buffer; filename: string; mime?: string; title?: string },
) {
  const db = await getDb();
  const oid = new ObjectId(pathId);
  try {
    await db.collection('book_tutor_paths').updateOne(
      { _id: oid },
      { $set: { buildNote: 'Extracting book text…', error: '', updatedAt: new Date() } },
    );
    let parsed;
    try {
      parsed = await parseBookFile({
        buffer: opts.buffer,
        filename: opts.filename,
        mime: opts.mime,
        titleHint: opts.title,
      });
    } finally {
      opts.buffer.fill(0);
    }
    await saveSources(
      pathId,
      parsed.chapters.filter((c) => String(c.markdown || '').trim().length >= 80),
    );
    await db.collection('book_tutor_paths').updateOne(
      { _id: oid },
      { $set: { buildNote: 'Building curriculum…', sourceChars: parsed.charCount, pageCount: parsed.pageHint, updatedAt: new Date() } },
    );
    const { chapters: teach, plan } = await planBookCurriculum(parsed.chapters);
    if (!teach.length || !plan.length) throw new BookTutorError('Could not find real chapters to teach — the file looked like a table of contents or title pages.');
    await saveSources(pathId, teach);
    await db.collection('book_tutor_paths').updateOne(
      { _id: oid },
      {
        $set: {
          title: (opts.title || parsed.title).slice(0, 160),
          status: 'generating',
          curriculum: plan,
          nextChapterIndex: 0,
          chapterOutline: outlineOf(teach),
          lessons: [],
          pageCount: parsed.pageHint,
          sourceChars: parsed.charCount,
          buildNote: `Starting ${plan.length} chapters`,
          error: '',
          updatedAt: new Date(),
        },
      },
    );
    for (const ch of parsed.chapters) ch.markdown = '';
    await continuePathBuild(pathId);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Could not build a tutor from that file.';
    console.error('book tutor finish failed:', err);
    await db.collection('book_tutor_paths').updateOne(
      { _id: oid },
      { $set: { status: 'failed', error: message.slice(0, 400), updatedAt: new Date() } },
    );
  }
}

export async function createOrGetPathFromLibraryBook(opts: {
  userId: string;
  bookId: string;
}): Promise<string> {
  const book = await getBook(opts.bookId);
  if (!book) throw new BookTutorError('Book not found.', 404);
  if (!(await studentCanReadBook(opts.userId, book))) {
    throw new BookTutorError('Unlock this book before learning it with AI.', 403);
  }
  await ensureBookTutor();
  const db = await getDb();
  const existing = await db.collection('book_tutor_paths').findOne({
    sourceBookId: book.id,
    isPrivate: false,
    status: { $in: ['ready', 'generating'] },
  });
  if (existing) return String(existing._id);

  const readable = (book.chapters || [])
    .map((c, i) => ({
      id: `ch_${i + 1}`,
      title: String(c.title || `Chapter ${i + 1}`),
      markdown: String(c.content || '').trim(),
    }))
    .filter((c) => c.markdown.length > 40);

  if (!readable.length) {
    throw new BookTutorError(
      'This library title has no in-app chapters. Upload your PDF or EPUB on Book tutor to learn it privately.',
      400,
    );
  }

  const chapters =
    readable.length > 8
      ? readable
      : splitIntoChapters(
          readable.map((c) => `# ${c.title}\n\n${c.markdown}`).join('\n\n'),
          book.title,
        );
  const teach = chapters.length ? chapters : readable;
  try {
    const id = await savePath({
      ownerUserId: book.authorId,
      ownerName: book.authorName,
      sourceBookId: book.id,
      title: book.title,
      authorName: book.authorName,
      sourceFilename: null,
      isPrivate: false,
      status: 'generating',
      engine: 'heuristic',
      chapterOutline: outlineOf(teach),
      lessons: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await saveSources(id, teach);
    await continuePathBuild(id);
    return id;
  } catch {
    const raced = await db.collection('book_tutor_paths').findOne({
      sourceBookId: book.id,
      isPrivate: false,
    });
    if (raced) return String(raced._id);
    throw new BookTutorError('Could not save the tutor path.');
  }
}

function heuristicGrade(lesson: BookTutorLesson, answer: string): { isCorrect: boolean; feedback: string } {
  const ui = resolveUiType(lesson);
  if (ui === 'multiple_choice' && Array.isArray(lesson.choices) && typeof lesson.correctChoice === 'number') {
    const correct = String(lesson.choices[lesson.correctChoice] || '').trim();
    const ok = answer.trim().toLowerCase() === correct.toLowerCase();
    return {
      isCorrect: ok,
      feedback: ok ? 'That’s the one. Hold that distinction — the next step uses it.' : 'Not that option. Look back at the last stretch and pick again.',
    };
  }
  const words = tokenize(answer);
  if (lesson.kind === 'practice' || lesson.stepType === 'guided_practice') {
    if (words.length < 8) {
      return {
        isCorrect: false,
        feedback: 'Go do the task, then paste what you actually got — output, a short description of the result, or what changed.',
      };
    }
    return {
      isCorrect: true,
      feedback: 'Good — that looks like a real attempt. Hold onto whatever surprised you; the next step will use it.',
    };
  }
  if (words.length < 6) {
    return {
      isCorrect: false,
      feedback: 'Say a little more — a short paragraph in your own words is enough.',
    };
  }
  const needed = (lesson.keywords.length ? lesson.keywords : tokenize(lesson.criteria || lesson.explanation)).slice(0, 8);
  const hits = needed.filter((k) => words.includes(k) || answer.toLowerCase().includes(k));
  const ratio = needed.length ? hits.length / Math.min(4, needed.length) : 0;
  if (hits.length >= 2 || ratio >= 0.5) {
    return {
      isCorrect: true,
      feedback: `That tracks. You caught ${hits.slice(0, 3).join(', ') || 'the core idea'}.`,
    };
  }
  return {
    isCorrect: false,
    feedback: `Not quite. Look back at the explanation and name the idea in your own words — include what this section is actually about.`,
  };
}

async function llmGrade(lesson: BookTutorLesson, answer: string): Promise<{ isCorrect: boolean; feedback: string } | null> {
  try {
    const practiceNote =
      lesson.kind === 'practice' || lesson.stepType === 'guided_practice'
        ? 'This is a hands-on step. Pass if they clearly attempted the task and reported a concrete result (output, error, screen, number, or working-enough code). Fail empty slogans or a restated chapter title.'
        : 'Be fair to paraphrases, invented examples, and mostly-right code. Fail if they only restate the title, repeat "the main idea", talk about acknowledgments, or dodge the question.';
    const raw = await openaiJsonCompletion({
      temperature: 0.2,
      system: BOOK_TUTOR_GRADE_SYSTEM,
      user: `${practiceNote}

LESSON: ${lesson.title}
KIND: ${lesson.stepType || lesson.kind || 'teach'}
UI: ${resolveUiType(lesson)}
LANGUAGE: ${lesson.language || ''}
EXPLANATION: ${lesson.explanation.slice(0, 1400)}
EXAMPLE: ${(lesson.example || '').slice(0, 600)}
QUESTION: ${lesson.question}
RUBRIC: ${lesson.criteria}
CHOICES: ${(lesson.choices || []).join(' | ')}
CORRECT_CHOICE_INDEX: ${lesson.correctChoice ?? ''}
STUDENT ANSWER: ${answer.slice(0, 2000)}`,
    });
    const parsed = parseJsonObject<{ is_correct?: boolean; isCorrect?: boolean; feedback?: string }>(raw);
    if (!parsed) return null;
    const isCorrect = Boolean(parsed.is_correct ?? parsed.isCorrect);
    const feedback = String(parsed.feedback || '').trim();
    if (!feedback) return null;
    return { isCorrect, feedback: feedback.slice(0, 600) };
  } catch (err) {
    console.error('book tutor grade failed:', err);
    return null;
  }
}

function checksOf(lesson: BookTutorLesson): BookTutorCheck[] {
  return Array.isArray(lesson.checks) ? lesson.checks.filter((c) => c && c.prompt).slice(0, 2) : [];
}

export async function submitCheckpoint(opts: {
  userId: string;
  pathId: string;
  checkId: string;
  yes: boolean;
}) {
  const path = await getPath(opts.pathId);
  if (!path) throw new BookTutorError('Book tutor not found.', 404);
  if (!(await canAccessPath(opts.userId, path))) throw new BookTutorError('You do not have access to this book tutor.', 403);
  if (!pathIsPlayable(path)) throw new BookTutorError('This tutor is not ready yet.', 409);
  const progress = await getProgress(opts.userId, path.id);
  if (progress.phase === 'complete' || progress.phase === 'passed') {
    throw new BookTutorError('This step is already open for the written check.', 400);
  }
  const lesson = path.lessons[progress.currentLessonIndex];
  if (!lesson) throw new BookTutorError('No lesson to check.', 400);
  const checks = checksOf(lesson);
  const passed = progress.checkpointPassed || 0;
  if (passed >= checks.length) {
    return { isCorrect: true, feedback: 'On to the written check.', checkpointPassed: passed, checksTotal: checks.length };
  }
  const current = checks[passed];
  if (!current || current.id !== opts.checkId) {
    throw new BookTutorError('That is not the current yes/no yet.', 400);
  }
  // Yes always means “I get it — continue.” Stored `expected` is ignored
  // (older paths used trick true/false). No is handled in the UI (clarify bubble).
  if (opts.yes !== true) {
    return {
      isCorrect: false,
      needsClarify: true,
      feedback: 'Tell me what you do not get — then tap Yes when it clicks.',
      checkpointPassed: passed,
      checksTotal: checks.length,
      checkPrompt: current.prompt,
    };
  }
  const db = await getDb();
  const nextPassed = passed + 1;
  await db.collection('book_tutor_progress').updateOne(
    { userId: opts.userId, pathId: path.id },
    {
      $set: {
        checkpointPassed: nextPassed,
        lastFeedback: nextPassed >= checks.length ? '' : 'Good — keep going.',
        updatedAt: new Date(),
      },
    },
  );
  return {
    isCorrect: true,
    needsClarify: false,
    feedback: 'Good — keep going.',
    checkpointPassed: nextPassed,
    checksTotal: checks.length,
    checkPrompt: current.prompt,
  };
}

export async function clarifyCheckpoint(opts: {
  userId: string;
  pathId: string;
  checkId: string;
  confusion: string;
}) {
  const path = await getPath(opts.pathId);
  if (!path) throw new BookTutorError('Book tutor not found.', 404);
  if (!(await canAccessPath(opts.userId, path))) throw new BookTutorError('You do not have access to this book tutor.', 403);
  if (!pathIsPlayable(path)) throw new BookTutorError('This tutor is not ready yet.', 409);
  const progress = await getProgress(opts.userId, path.id);
  if (progress.phase === 'complete' || progress.phase === 'passed') {
    throw new BookTutorError('This step is already open for the written check.', 400);
  }
  const lesson = path.lessons[progress.currentLessonIndex];
  if (!lesson) throw new BookTutorError('No lesson to clarify.', 400);
  const checks = checksOf(lesson);
  const current = checks[progress.checkpointPassed || 0];
  if (!current || current.id !== opts.checkId) {
    throw new BookTutorError('That is not the current yes/no yet.', 400);
  }
  const confusion = opts.confusion.trim();
  if (confusion.length < 4) throw new BookTutorError('Say what you do not get — a short sentence is enough.', 400);

  let explanation = isLLMConfigured() ? await llmClarify(lesson, current, confusion) : null;
  if (!explanation) explanation = heuristicClarify(lesson, current, confusion);

  return {
    explanation,
    prompt: current.prompt,
  };
}

function heuristicClarify(lesson: BookTutorLesson, check: BookTutorCheck, confusion: string): string {
  const topic = (lesson.keywords || [])[0] || 'this idea';
  const clip = confusion.replace(/\s+/g, ' ').slice(0, 90);
  return [
    `You are stuck on “${clip}”.`,
    check.hint,
    lesson.watchOut || `Hold **${topic}** as a thing you *use*, not a label.`,
    'Read that once more, then try the Yes / No again.',
  ]
    .filter(Boolean)
    .join(' ');
}

async function llmClarify(
  lesson: BookTutorLesson,
  check: BookTutorCheck,
  confusion: string,
): Promise<string | null> {
  try {
    const raw = await openaiJsonCompletion({
      temperature: 0.45,
      system: BOOK_TUTOR_CLARIFY_SYSTEM,
      user: `LESSON TITLE: ${lesson.title}
TEACH: ${lesson.explanation.slice(0, 900)}
ANALOGY: ${(lesson.analogy || '').slice(0, 400)}
WATCH OUT: ${(lesson.watchOut || '').slice(0, 240)}
YES/NO PROMPT: ${check.prompt}
HINT (do not quote as "the answer"): ${check.hint}
STUDENT DOES NOT GET: ${confusion.slice(0, 600)}`,
    });
    const parsed = parseJsonObject<{ explanation?: string }>(raw);
    const text = String(parsed?.explanation || '').trim();
    return text.length >= 24 ? text.slice(0, 700) : null;
  } catch (err) {
    console.error('book tutor clarify failed:', err);
    return null;
  }
}

export async function submitAnswer(opts: { userId: string; pathId: string; answer: string }) {
  const path = await getPath(opts.pathId);
  if (!path) throw new BookTutorError('Book tutor not found.', 404);
  if (!(await canAccessPath(opts.userId, path))) throw new BookTutorError('You do not have access to this book tutor.', 403);
  if (!pathIsPlayable(path)) throw new BookTutorError('This tutor is not ready yet.', 409);
  const progress = await getProgress(opts.userId, path.id);
  if (progress.phase === 'complete') throw new BookTutorError('You already finished this book.', 400);
  const lesson = path.lessons[progress.currentLessonIndex];
  if (!lesson) throw new BookTutorError('No lesson to grade.', 400);
  const needed = checksOf(lesson).length;
  if ((progress.checkpointPassed || 0) < needed) {
    throw new BookTutorError('Click the yes/no checks first — then the written question unlocks.', 400);
  }
  const answer = opts.answer.trim();
  const ui = resolveUiType(lesson);
  const minLen = ui === 'multiple_choice' ? 1 : ui === 'code_editor' ? 2 : 4;
  if (answer.length < minLen) throw new BookTutorError('Type an answer before submitting.', 400);

  let result =
    ui === 'multiple_choice' && typeof lesson.correctChoice === 'number'
      ? heuristicGrade(lesson, answer)
      : isLLMConfigured()
        ? await llmGrade(lesson, answer)
        : null;
  if (!result) result = heuristicGrade(lesson, answer);

  const db = await getDb();
  const nextPhase: BookTutorPhase = result.isCorrect ? 'passed' : 'quiz';
  const completed = new Set(progress.completedLessonIds);
  if (result.isCorrect) completed.add(lesson.id);
  await db.collection('book_tutor_progress').updateOne(
    { userId: opts.userId, pathId: path.id },
    {
      $set: {
        phase: nextPhase,
        lastFeedback: result.feedback,
        lastCorrect: result.isCorrect,
        attemptsOnCurrent: (progress.attemptsOnCurrent || 0) + 1,
        completedLessonIds: Array.from(completed),
        lessonAnswers: {
          ...(progress.lessonAnswers || {}),
          [lesson.id]: { answer, feedback: result.feedback, isCorrect: result.isCorrect },
        },
        updatedAt: new Date(),
      },
    },
  );
  if (result.isCorrect && !progress.completedLessonIds.includes(lesson.id)) {
    await awardXp(opts.userId, XP.COMPLETE_BOOK_LESSON).catch(() => {});
  }
  return {
    isCorrect: result.isCorrect,
    feedback: result.feedback,
    phase: nextPhase,
    canAdvance: result.isCorrect,
  };
}

export async function advanceLesson(opts: { userId: string; pathId: string }) {
  let path = await getPath(opts.pathId);
  if (!path) throw new BookTutorError('Book tutor not found.', 404);
  if (!(await canAccessPath(opts.userId, path))) throw new BookTutorError('You do not have access to this book tutor.', 403);
  if (!pathIsPlayable(path)) throw new BookTutorError('This tutor is still being prepared. Wait a moment.', 409);
  const progress = await getProgress(opts.userId, path.id);
  const lesson = path.lessons[progress.currentLessonIndex];
  const skipCheck = lesson && !lessonNeedsCheck(lesson);
  const alreadyDone = Boolean(lesson && progress.completedLessonIds?.includes(lesson.id));
  if (!alreadyDone && progress.phase !== 'passed' && !skipCheck) {
    throw new BookTutorError('Answer the check question correctly before going to the next step.', 400);
  }
  let nextIndex = progress.currentLessonIndex + 1;
  if (nextIndex >= path.lessons.length && path.status === 'generating') {
    await continuePathBuild(path.id).catch((err) => console.error('book tutor advance build failed:', err));
    path = (await getPath(opts.pathId)) || path;
  }
  if (nextIndex >= path.lessons.length && path.status === 'generating') {
    throw new BookTutorError('The next chapter is still being written. Stay on this page or tap Next again in a moment.', 409);
  }
  const complete = nextIndex >= path.lessons.length;
  const completed = new Set(progress.completedLessonIds || []);
  if (lesson?.id && (skipCheck || alreadyDone || progress.phase === 'passed')) completed.add(lesson.id);
  const db = await getDb();
  const nextSaved = complete ? null : path.lessons[nextIndex] ? progress.lessonAnswers?.[path.lessons[nextIndex].id] : null;
  const nextDone = Boolean(!complete && path.lessons[nextIndex] && completed.has(path.lessons[nextIndex].id));
  let nextPhase: BookTutorPhase = 'teaching';
  if (complete) nextPhase = 'complete';
  else if (nextSaved?.isCorrect || nextDone || (path.lessons[nextIndex] && !lessonNeedsCheck(path.lessons[nextIndex]))) nextPhase = 'passed';
  await db.collection('book_tutor_progress').updateOne(
    { userId: opts.userId, pathId: path.id },
    {
      $set: {
        currentLessonIndex: complete ? progress.currentLessonIndex : nextIndex,
        phase: nextPhase,
        lastFeedback: complete ? 'You reached the end of this book tutor.' : nextSaved?.feedback || '',
        lastCorrect: complete ? true : nextSaved ? nextSaved.isCorrect : nextDone ? true : null,
        attemptsOnCurrent: 0,
        checkpointPassed: 0,
        completedLessonIds: Array.from(completed),
        updatedAt: new Date(),
      },
    },
  );
  return getLearnerSession(opts.userId, path.id);
}

export async function retreatLesson(opts: { userId: string; pathId: string }) {
  const path = await getPath(opts.pathId);
  if (!path) throw new BookTutorError('Book tutor not found.', 404);
  if (!(await canAccessPath(opts.userId, path))) throw new BookTutorError('You do not have access to this book tutor.', 403);
  if (!pathIsPlayable(path)) throw new BookTutorError('This tutor is still being prepared. Wait a moment.', 409);
  const progress = await getProgress(opts.userId, path.id);
  let nextIndex = progress.currentLessonIndex - 1;
  if (progress.phase === 'complete') nextIndex = Math.max(0, path.lessons.length - 1);
  if (nextIndex < 0) throw new BookTutorError('This is the first step.', 400);
  const lesson = path.lessons[nextIndex];
  const saved = lesson ? progress.lessonAnswers?.[lesson.id] : null;
  const done = Boolean(lesson && progress.completedLessonIds?.includes(lesson.id));
  const db = await getDb();
  await db.collection('book_tutor_progress').updateOne(
    { userId: opts.userId, pathId: path.id },
    {
      $set: {
        currentLessonIndex: nextIndex,
        phase: saved?.isCorrect || done || (lesson && !lessonNeedsCheck(lesson)) ? 'passed' : 'teaching',
        lastFeedback: saved?.feedback || '',
        lastCorrect: saved ? saved.isCorrect : done ? true : null,
        attemptsOnCurrent: 0,
        checkpointPassed: 0,
        updatedAt: new Date(),
      },
    },
  );
  return getLearnerSession(opts.userId, path.id);
}

export async function openStoredLesson(opts: { userId: string; pathId: string; chapterId?: string; lessonIndex?: number }) {
  const path = await getPath(opts.pathId);
  if (!path) throw new BookTutorError('Book tutor not found.', 404);
  if (!(await canAccessPath(opts.userId, path))) throw new BookTutorError('You do not have access to this book tutor.', 403);
  if (!pathIsPlayable(path)) throw new BookTutorError('This tutor is still being prepared. Wait a moment.', 409);
  let nextIndex = -1;
  if (typeof opts.lessonIndex === 'number' && Number.isFinite(opts.lessonIndex)) {
    nextIndex = Math.floor(opts.lessonIndex);
  } else if (opts.chapterId) {
    nextIndex = path.lessons.findIndex((l) => l.chapterId === opts.chapterId);
  }
  if (nextIndex < 0 || nextIndex >= path.lessons.length) throw new BookTutorError('That chapter is not in this course.', 400);
  const progress = await getProgress(opts.userId, path.id);
  const lesson = path.lessons[nextIndex];
  const saved = lesson ? progress.lessonAnswers?.[lesson.id] : null;
  const done = Boolean(lesson && progress.completedLessonIds?.includes(lesson.id));
  const db = await getDb();
  await db.collection('book_tutor_progress').updateOne(
    { userId: opts.userId, pathId: path.id },
    {
      $set: {
        currentLessonIndex: nextIndex,
        phase: saved?.isCorrect || done || (lesson && !lessonNeedsCheck(lesson)) ? 'passed' : 'teaching',
        lastFeedback: saved?.feedback || '',
        lastCorrect: saved ? saved.isCorrect : done ? true : null,
        attemptsOnCurrent: 0,
        checkpointPassed: 0,
        updatedAt: new Date(),
      },
    },
  );
  return getLearnerSession(opts.userId, path.id);
}

export async function listInProgressForUser(userId: string) {
  await ensureBookTutor();
  const db = await getDb();
  const rows = await db
    .collection('book_tutor_progress')
    .find({ userId, phase: { $ne: 'complete' } })
    .sort({ updatedAt: -1 })
    .limit(8)
    .toArray();
  const ids = rows.map((r) => r.pathId).filter((id) => ObjectId.isValid(String(id)));
  if (!ids.length) return [];
  const paths = await db
    .collection('book_tutor_paths')
    .find({ _id: { $in: ids.map((id) => new ObjectId(String(id))) }, status: 'ready' })
    .project({ title: 1, lessons: 1, authorName: 1 })
    .toArray();
  const byId = new Map(paths.map((p) => [String(p._id), p]));
  return rows
    .map((r) => {
      const p = byId.get(String(r.pathId));
      if (!p) return null;
      const total = Array.isArray(p.lessons) ? p.lessons.length : 0;
      const done = Array.isArray(r.completedLessonIds) ? r.completedLessonIds.length : 0;
      return {
        id: String(r.pathId),
        title: String(p.title || 'Book tutor'),
        authorName: String(p.authorName || ''),
        pct: total ? Math.round((Math.min(done, total) / total) * 100) : 0,
        href: `/dashboard/library/learn/${r.pathId}`,
      };
    })
    .filter(Boolean);
}
