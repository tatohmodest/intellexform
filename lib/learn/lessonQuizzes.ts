/**
 * In-lesson quiz checkpoints (Mongo) — gate lesson complete until passed.
 */

import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { ensureLearnCollections } from '@/lib/learn/ecosystem';

export type LessonQuizQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  /** 0-based correct choice index */
  correctIndex: number;
};

export type LessonQuizView = {
  id: string;
  courseKey: string;
  lessonKey: string;
  title: string;
  triggerAtSec: number | null;
  questions: LessonQuizQuestion[];
  passed: boolean;
};

async function ensure() {
  await ensureLearnCollections();
  const db = await getDb();
  const names = new Set(
    (await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name),
  );
  if (!names.has('lesson_quizzes')) await db.createCollection('lesson_quizzes').catch(() => {});
  if (!names.has('lesson_quiz_attempts')) {
    await db.createCollection('lesson_quiz_attempts').catch(() => {});
  }
  await Promise.all([
    db.collection('lesson_quizzes').createIndex({ courseKey: 1, lessonKey: 1 }, { unique: true }),
    db.collection('lesson_quiz_attempts').createIndex({ userId: 1, quizId: 1 }),
  ]).catch(() => {});
  return db;
}

function toQuiz(
  d: Record<string, unknown>,
  passed: boolean,
): LessonQuizView {
  return {
    id: String((d._id as ObjectId).toString()),
    courseKey: String(d.courseKey),
    lessonKey: String(d.lessonKey),
    title: String(d.title || 'Lesson check'),
    triggerAtSec: typeof d.triggerAtSec === 'number' ? d.triggerAtSec : null,
    questions: Array.isArray(d.questions)
      ? (d.questions as LessonQuizQuestion[]).map((q, i) => ({
          id: String(q.id || `q${i}`),
          prompt: String(q.prompt || ''),
          choices: Array.isArray(q.choices) ? q.choices.map(String) : [],
          correctIndex: Number(q.correctIndex) || 0,
        }))
      : [],
    passed,
  };
}

export async function getLessonQuiz(
  courseKey: string,
  lessonKey: string,
  userId?: string,
): Promise<LessonQuizView | null> {
  const db = await ensure();
  const doc = await db.collection('lesson_quizzes').findOne({ courseKey, lessonKey });
  if (!doc) return null;
  let passed = false;
  if (userId) {
    const attempt = await db.collection('lesson_quiz_attempts').findOne({
      userId,
      quizId: String(doc._id),
      passed: true,
    });
    passed = Boolean(attempt);
  }
  return toQuiz(doc as Record<string, unknown>, passed);
}

export async function upsertLessonQuiz(opts: {
  courseKey: string;
  lessonKey: string;
  title?: string;
  triggerAtSec?: number | null;
  questions: LessonQuizQuestion[];
  authorId: string;
}): Promise<LessonQuizView> {
  const db = await ensure();
  const questions = opts.questions
    .filter((q) => q.prompt.trim() && q.choices.length >= 2)
    .slice(0, 12)
    .map((q, i) => ({
      id: q.id || `q${i}`,
      prompt: q.prompt.trim().slice(0, 400),
      choices: q.choices.map((c) => String(c).slice(0, 200)).slice(0, 6),
      correctIndex: Math.max(0, Math.min(q.correctIndex, q.choices.length - 1)),
    }));
  const $set = {
    courseKey: opts.courseKey.slice(0, 200),
    lessonKey: opts.lessonKey.slice(0, 200),
    title: (opts.title || 'Lesson check').slice(0, 120),
    triggerAtSec: typeof opts.triggerAtSec === 'number' ? opts.triggerAtSec : null,
    questions,
    authorId: opts.authorId,
    updatedAt: new Date(),
  };
  await db.collection('lesson_quizzes').updateOne(
    { courseKey: opts.courseKey, lessonKey: opts.lessonKey },
    { $set, $setOnInsert: { createdAt: new Date() } },
    { upsert: true },
  );
  const doc = await db.collection('lesson_quizzes').findOne({
    courseKey: opts.courseKey,
    lessonKey: opts.lessonKey,
  });
  return toQuiz(doc as Record<string, unknown>, false);
}

/** Returns whether the attempt passed (≥70% or all if ≤2 questions). */
export async function submitLessonQuizAttempt(opts: {
  courseKey: string;
  lessonKey: string;
  userId: string;
  answers: Record<string, number>;
}): Promise<{ passed: boolean; score: number; total: number }> {
  const db = await ensure();
  const quiz = await db.collection('lesson_quizzes').findOne({
    courseKey: opts.courseKey,
    lessonKey: opts.lessonKey,
  });
  if (!quiz) return { passed: true, score: 0, total: 0 };
  const questions = (quiz.questions as LessonQuizQuestion[]) || [];
  let score = 0;
  for (const q of questions) {
    if (opts.answers[q.id] === q.correctIndex) score += 1;
  }
  const total = questions.length;
  const need = total <= 2 ? total : Math.ceil(total * 0.7);
  const passed = total === 0 || score >= need;
  await db.collection('lesson_quiz_attempts').updateOne(
    { userId: opts.userId, quizId: String(quiz._id) },
    {
      $set: {
        userId: opts.userId,
        quizId: String(quiz._id),
        courseKey: opts.courseKey,
        lessonKey: opts.lessonKey,
        answers: opts.answers,
        score,
        total,
        passed,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );
  return { passed, score, total };
}

/**
 * Default demo quiz when none authored — keeps player excellence demoable.
 * Only used when explicitly requested by the player with `allowDefault`.
 */
export function defaultLessonQuiz(
  courseKey: string,
  lessonKey: string,
  lessonTitle: string,
): LessonQuizView {
  return {
    id: `default-${courseKey}-${lessonKey}`,
    courseKey,
    lessonKey,
    title: `Quick check · ${lessonTitle}`,
    triggerAtSec: null,
    questions: [
      {
        id: 'q0',
        prompt: `Did you finish reviewing “${lessonTitle.slice(0, 80)}”?`,
        choices: ['Yes — I am ready to continue', 'Not yet — I need to rewatch'],
        correctIndex: 0,
      },
      {
        id: 'q1',
        prompt: 'What should you do if a concept is unclear?',
        choices: [
          'Skip and hope for the best',
          'Ask in discussion or use in-course AI',
          'Never revisit the lesson',
        ],
        correctIndex: 1,
      },
    ],
    passed: false,
  };
}
