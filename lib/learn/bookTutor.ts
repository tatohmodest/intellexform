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
import { parseBookFile, splitIntoChapters, type ParsedChapter } from '@/lib/learn/bookParse';

export type BookTutorPhase = 'teaching' | 'quiz' | 'passed' | 'complete';

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
};

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
  chapters: ParsedChapter[];
  lessons: BookTutorLesson[];
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
  updatedAt: Date;
  createdAt: Date;
};

export type PublicLesson = {
  id: string;
  chapterTitle: string;
  sortOrder: number;
  title: string;
  explanation: string;
  example: string;
  question: string;
  index: number;
  total: number;
};

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

function keywordsFrom(text: string, limit = 8): string[] {
  const counts = new Map<string, number>();
  for (const t of tokenize(text)) counts.set(t, (counts.get(t) || 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
}

function firstSentence(text: string): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  const m = clean.match(/^.{12,160}?[.!?]/);
  return (m?.[0] || clean.slice(0, 120)).trim();
}

function chunkMarkdown(markdown: string, size = 1100): string[] {
  const paras = markdown.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const out: string[] = [];
  let buf = '';
  for (const p of paras) {
    if ((buf + '\n\n' + p).length > size && buf.length > 280) {
      out.push(buf.trim());
      buf = p;
    } else {
      buf = buf ? `${buf}\n\n${p}` : p;
    }
  }
  if (buf.trim().length > 80) out.push(buf.trim());
  return out.slice(0, 6);
}

function heuristicLessons(chapter: ParsedChapter, startOrder: number): BookTutorLesson[] {
  const parts = chunkMarkdown(chapter.markdown);
  return parts.map((part, i) => {
    const kws = keywordsFrom(part);
    return {
      id: `${chapter.id}_${i + 1}`,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      sortOrder: startOrder + i,
      title: firstSentence(part.replace(/^#+\s*/gm, '')).slice(0, 90) || `${chapter.title} · ${i + 1}`,
      explanation: part.slice(0, 1600),
      example: kws.length
        ? `Hold onto these ideas from the passage: **${kws.slice(0, 4).join(', ')}**. Try restating them with a situation from your own work or studies.`
        : 'Find one sentence in this section that you could teach to a classmate in 20 seconds.',
      question: `In your own words, what is the main idea of “${chapter.title}”${parts.length > 1 ? ` (part ${i + 1})` : ''}?`,
      criteria: `A good answer names the core idea and uses at least two of: ${kws.slice(0, 6).join(', ') || 'the key terms from the passage'}.`,
      keywords: kws,
    };
  });
}

type LlmLesson = {
  title?: string;
  explanation?: string;
  example?: string;
  question?: string;
  criteria?: string;
  keywords?: string[];
};

async function llmLessonsForChapter(chapter: ParsedChapter, startOrder: number): Promise<BookTutorLesson[] | null> {
  const raw = await openaiJsonCompletion({
    temperature: 0.35,
    system:
      'You turn a book chapter into a step-by-step tutor. Return JSON only. Teach in the tutor’s own words; do not dump the chapter. Keep explanations short. Questions must be answerable from this chapter alone.',
    user: `Create 2 to 5 micro-lessons from this chapter.
Each lesson object keys: title, explanation, example, question, criteria, keywords (3-8 strings).
explanation: 80-180 words, conversational tutor voice.
example: one concrete illustration.
question: one short check-for-understanding (not multiple choice).
criteria: what a correct free-text answer must include.

CHAPTER TITLE: ${chapter.title}
CHAPTER TEXT:
${chapter.markdown.slice(0, 8000)}`,
  });
  const parsed = parseJsonObject<{ lessons?: LlmLesson[] }>(raw);
  const items = Array.isArray(parsed?.lessons) ? parsed!.lessons : [];
  const lessons = items
    .map((item, i) => {
      const explanation = String(item.explanation || '').trim();
      const question = String(item.question || '').trim();
      if (explanation.length < 40 || question.length < 8) return null;
      const keywords = Array.isArray(item.keywords)
        ? item.keywords.map(String).filter(Boolean).slice(0, 10)
        : keywordsFrom(`${explanation} ${question}`);
      return {
        id: `${chapter.id}_${i + 1}`,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        sortOrder: startOrder + i,
        title: String(item.title || `${chapter.title} · ${i + 1}`).slice(0, 120),
        explanation: explanation.slice(0, 2200),
        example: String(item.example || '').slice(0, 1200),
        question: question.slice(0, 400),
        criteria: String(item.criteria || '').slice(0, 600),
        keywords,
      } satisfies BookTutorLesson;
    })
    .filter((x): x is BookTutorLesson => Boolean(x));
  return lessons.length ? lessons : null;
}

async function buildCurriculum(chapters: ParsedChapter[]): Promise<{
  lessons: BookTutorLesson[];
  engine: BookTutorPathDoc['engine'];
}> {
  const lessons: BookTutorLesson[] = [];
  let llmCount = 0;
  let heuristicCount = 0;
  const llmBudget = isLLMConfigured() ? 8 : 0;

  for (const chapter of chapters.slice(0, 40)) {
    if (lessons.length >= 48) break;
    let made: BookTutorLesson[] | null = null;
    if (llmCount < llmBudget) {
      try {
        made = await llmLessonsForChapter(chapter, lessons.length);
        if (made) llmCount += 1;
      } catch (err) {
        console.error('book tutor LLM chapter failed:', err);
      }
    }
    if (!made) {
      made = heuristicLessons(chapter, lessons.length);
      heuristicCount += 1;
    }
    lessons.push(...made);
  }

  const engine = llmCount && heuristicCount ? 'mixed' : llmCount ? 'llm' : 'heuristic';
  return { lessons: lessons.slice(0, 48), engine };
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
    chapterCount: doc.chapters?.length || 0,
    sourceFilename: doc.sourceFilename,
    updatedAt: doc.updatedAt,
  };
}

function publicLesson(lessons: BookTutorLesson[], index: number): PublicLesson | null {
  const lesson = lessons[index];
  if (!lesson) return null;
  return {
    id: lesson.id,
    chapterTitle: lesson.chapterTitle,
    sortOrder: lesson.sortOrder,
    title: lesson.title,
    explanation: lesson.explanation,
    example: lesson.example,
    question: lesson.question,
    index,
    total: lessons.length,
  };
}

export async function canAccessPath(userId: string, path: BookTutorPathDoc & { id?: string }): Promise<boolean> {
  if (path.ownerUserId === userId) return true;
  if (path.isPrivate) return false;
  if (path.status !== 'ready') return false;
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
    createdAt: now,
    updatedAt: now,
  };
  await db.collection('book_tutor_progress').insertOne(doc as unknown as Record<string, unknown>);
  return doc;
}

export async function getLearnerSession(userId: string, pathId: string) {
  const path = await getPath(pathId);
  if (!path) throw new BookTutorError('Book tutor not found.', 404);
  if (!(await canAccessPath(userId, path))) {
    throw new BookTutorError('You do not have access to this book tutor.', 403);
  }
  if (path.status !== 'ready') {
    return {
      path: {
        id: path.id,
        title: path.title,
        authorName: path.authorName,
        status: path.status,
        error: path.error || null,
        engine: path.engine,
        lessonCount: path.lessons.length,
        chapterCount: path.chapters.length,
        isPrivate: path.isPrivate,
        sourceBookId: path.sourceBookId,
      },
      progress: null,
      lesson: null,
    };
  }
  const progress = await getProgress(userId, pathId);
  const idx = Math.min(progress.currentLessonIndex, Math.max(0, path.lessons.length - 1));
  return {
    path: {
      id: path.id,
      title: path.title,
      authorName: path.authorName,
      status: path.status,
      error: null as string | null,
      engine: path.engine,
      lessonCount: path.lessons.length,
      chapterCount: path.chapters.length,
      isPrivate: path.isPrivate,
      sourceBookId: path.sourceBookId,
    },
    progress: {
      currentLessonIndex: idx,
      phase: progress.phase,
      completedCount: progress.completedLessonIds.length,
      lastFeedback: progress.lastFeedback,
      lastCorrect: progress.lastCorrect,
      attemptsOnCurrent: progress.attemptsOnCurrent,
    },
    lesson: progress.phase === 'complete' ? null : publicLesson(path.lessons, idx),
  };
}

async function savePath(doc: Omit<BookTutorPathDoc, '_id'>): Promise<string> {
  await ensureBookTutor();
  const db = await getDb();
  const res = await db.collection('book_tutor_paths').insertOne(doc as unknown as Record<string, unknown>);
  return res.insertedId.toString();
}

export async function createPathFromUpload(opts: {
  userId: string;
  userName: string;
  buffer: Buffer;
  filename: string;
  mime?: string;
  title?: string;
}): Promise<string> {
  const parsed = await parseBookFile({
    buffer: opts.buffer,
    filename: opts.filename,
    mime: opts.mime,
    titleHint: opts.title,
  });
  const { lessons, engine } = await buildCurriculum(parsed.chapters);
  if (!lessons.length) throw new BookTutorError('Could not turn that book into lessons.');
  return savePath({
    ownerUserId: opts.userId,
    ownerName: opts.userName,
    sourceBookId: null,
    title: (opts.title || parsed.title).slice(0, 160),
    authorName: opts.userName,
    sourceFilename: opts.filename.slice(0, 180),
    isPrivate: true,
    status: 'ready',
    engine,
    chapters: parsed.chapters,
    lessons,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
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
    status: 'ready',
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

  const chapters = readable.length > 40 ? readable.slice(0, 40) : splitIntoChapters(
    readable.map((c) => `# ${c.title}\n\n${c.markdown}`).join('\n\n'),
    book.title,
  );
  const { lessons, engine } = await buildCurriculum(chapters.length ? chapters : readable);
  if (!lessons.length) throw new BookTutorError('Could not turn this book into lessons.');
  try {
    return await savePath({
      ownerUserId: book.authorId,
      ownerName: book.authorName,
      sourceBookId: book.id,
      title: book.title,
      authorName: book.authorName,
      sourceFilename: null,
      isPrivate: false,
      status: 'ready',
      engine,
      chapters: chapters.length ? chapters : readable,
      lessons,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
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
  const words = tokenize(answer);
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
    const raw = await openaiJsonCompletion({
      temperature: 0.2,
      system:
        'You grade a short free-text check question for a book tutor. Be fair to paraphrases. JSON only: {"is_correct": boolean, "feedback": string}. Feedback is 1-3 sentences, encouraging, specific. Do not reveal a full model answer if they failed; hint the missing idea.',
      user: `LESSON: ${lesson.title}
EXPLANATION: ${lesson.explanation.slice(0, 1400)}
QUESTION: ${lesson.question}
RUBRIC: ${lesson.criteria}
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

export async function submitAnswer(opts: { userId: string; pathId: string; answer: string }) {
  const path = await getPath(opts.pathId);
  if (!path) throw new BookTutorError('Book tutor not found.', 404);
  if (!(await canAccessPath(opts.userId, path))) throw new BookTutorError('You do not have access to this book tutor.', 403);
  if (path.status !== 'ready') throw new BookTutorError('This tutor is not ready yet.', 409);
  const progress = await getProgress(opts.userId, path.id);
  if (progress.phase === 'complete') throw new BookTutorError('You already finished this book.', 400);
  const lesson = path.lessons[progress.currentLessonIndex];
  if (!lesson) throw new BookTutorError('No lesson to grade.', 400);
  const answer = opts.answer.trim();
  if (answer.length < 4) throw new BookTutorError('Type an answer before submitting.', 400);

  let result = isLLMConfigured() ? await llmGrade(lesson, answer) : null;
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
  const path = await getPath(opts.pathId);
  if (!path) throw new BookTutorError('Book tutor not found.', 404);
  if (!(await canAccessPath(opts.userId, path))) throw new BookTutorError('You do not have access to this book tutor.', 403);
  const progress = await getProgress(opts.userId, path.id);
  if (progress.phase !== 'passed') {
    throw new BookTutorError('Answer the check question correctly before going to the next step.', 400);
  }
  const nextIndex = progress.currentLessonIndex + 1;
  const complete = nextIndex >= path.lessons.length;
  const db = await getDb();
  await db.collection('book_tutor_progress').updateOne(
    { userId: opts.userId, pathId: path.id },
    {
      $set: {
        currentLessonIndex: complete ? progress.currentLessonIndex : nextIndex,
        phase: complete ? 'complete' : 'teaching',
        lastFeedback: complete ? 'You finished this book tutor.' : '',
        lastCorrect: complete ? true : null,
        attemptsOnCurrent: 0,
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
      const idx = Number(r.currentLessonIndex || 0);
      return {
        id: String(r.pathId),
        title: String(p.title || 'Book tutor'),
        authorName: String(p.authorName || ''),
        pct: total ? Math.round((Math.min(idx, total) / total) * 100) : 0,
        href: `/dashboard/library/learn/${r.pathId}`,
      };
    })
    .filter(Boolean);
}
