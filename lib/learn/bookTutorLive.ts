/**
 * Runtime AI tutor that delivers already-generated curriculum steps.
 * Does not plan, generate, or rewrite stored lessons.
 */

import { getDb } from '@/lib/repo';
import { awardXp } from '@/lib/learn/repo';
import { XP } from '@/lib/learn/xp';
import { isLLMConfigured } from '@/lib/learn/tutor';
import { openaiJsonCompletion, parseJsonObject } from '@/lib/learn/openaiJson';
import { lessonNeedsCheck } from '@/lib/learn/bookTutorCurriculum';
import { BOOK_TUTOR_AGENT_RESPOND_SYSTEM, BOOK_TUTOR_AGENT_TEACH_SYSTEM } from '@/lib/learn/bookTutorPrompt';
import {
  BookTutorError,
  canAccessPath,
  getLearnerSession,
  getPath,
  getProgress,
  pathIsPlayable,
  type BookTutorLesson,
  type BookTutorLiveState,
  type BookTutorLiveTurn,
  type BookTutorPathDoc,
  type BookTutorProgressDoc,
  type BookTutorSignal,
} from '@/lib/learn/bookTutor';

const teachingLocks = new Set<string>();

type TeachJson = {
  speech?: string;
  example?: string;
  ask?: boolean;
  prompt?: string;
  kind?: string;
  concept?: string;
};

type RespondJson = {
  correct?: boolean;
  partial?: boolean;
  feedback?: string;
  hint?: string;
  example?: string;
  follow_up?: string;
  followUp?: string;
  understanding?: string;
  remediate?: boolean;
};

const GENERIC_PROMPT =
  /what did you learn|do you understand|are you ready|can you explain this|what have you learned|does this make sense|ready to (move|continue)|in your own words,? what (is|was) this/i;

function clip(text: string, n: number) {
  const t = String(text || '').trim();
  return t.length <= n ? t : `${t.slice(0, n)}…`;
}

function isGenericPrompt(prompt: string) {
  const p = String(prompt || '').trim();
  if (p.length < 8) return true;
  return GENERIC_PROMPT.test(p);
}

function liveKind(raw: unknown, ask: boolean): BookTutorLiveState['kind'] {
  const k = String(raw || '').trim();
  const allowed: BookTutorLiveState['kind'][] = [
    'none',
    'recall',
    'understanding',
    'prediction',
    'application',
    'debug',
    'explanation',
    'guided',
  ];
  if (!ask) return 'none';
  return allowed.includes(k as BookTutorLiveState['kind']) ? (k as BookTutorLiveState['kind']) : 'application';
}

function shouldAsk(lesson: BookTutorLesson, parsed: TeachJson | null): boolean {
  const step = lesson.stepType || '';
  if (step === 'introduction' || step === 'transition') return false;
  if (lessonNeedsCheck(lesson) || step === 'guided_practice' || step === 'assessment' || lesson.interactionRequired) {
    return true;
  }
  const prompt = String(parsed?.prompt || '').trim();
  if (!parsed?.ask || !prompt || isGenericPrompt(prompt)) return false;
  return true;
}

function fallbackLive(lesson: BookTutorLesson, alreadyDone: boolean): BookTutorLiveState {
  const ask = alreadyDone ? false : lessonNeedsCheck(lesson);
  const prompt = ask ? String(lesson.practiceTask || lesson.question || '').trim() : '';
  const turns: BookTutorLiveTurn[] = [
    {
      role: 'tutor',
      text: lesson.explanation || lesson.title,
      example: lesson.example || undefined,
    },
  ];
  return {
    turns,
    ask,
    prompt,
    kind: ask ? (lesson.stepType === 'guided_practice' ? 'guided' : 'application') : 'none',
    concept: lesson.title,
    passed: !ask || alreadyDone,
    attempts: 0,
    hints: 0,
  };
}

function publicLive(live: BookTutorLiveState): BookTutorLiveState {
  return {
    turns: (live.turns || []).slice(-16).map((t) => ({
      role: t.role === 'student' ? 'student' : 'tutor',
      text: String(t.text || '').slice(0, 4000),
      example: t.example ? String(t.example).slice(0, 2500) : undefined,
    })),
    ask: Boolean(live.ask),
    prompt: String(live.prompt || ''),
    kind: liveKind(live.kind, Boolean(live.ask)),
    concept: String(live.concept || ''),
    passed: Boolean(live.passed),
    attempts: Number(live.attempts || 0),
    hints: Number(live.hints || 0),
  };
}

function previousTitles(path: BookTutorPathDoc, index: number) {
  return path.lessons
    .slice(Math.max(0, index - 3), index)
    .map((l) => l.title)
    .filter(Boolean);
}

function upsertSignal(
  signals: BookTutorSignal[] | undefined,
  next: BookTutorSignal,
): BookTutorSignal[] {
  const list = Array.isArray(signals) ? signals.filter((s) => s.concept !== next.concept) : [];
  list.push(next);
  return list.slice(-20);
}

async function waitForLive(userId: string, pathId: string, lessonId: string, lockKey: string) {
  for (let i = 0; i < 50; i += 1) {
    if (!teachingLocks.has(lockKey)) break;
    await new Promise((r) => setTimeout(r, 400));
    const progress = await getProgress(userId, pathId);
    if (progress.tutorTurns?.[lessonId]?.turns?.length) return progress.tutorTurns[lessonId];
  }
  return null;
}

async function generateTeach(
  path: BookTutorPathDoc & { id: string },
  progress: BookTutorProgressDoc,
  lesson: BookTutorLesson,
  index: number,
): Promise<BookTutorLiveState> {
  const alreadyDone = Boolean(progress.completedLessonIds?.includes(lesson.id));
  if (!isLLMConfigured()) return fallbackLive(lesson, alreadyDone);

  const payload = {
    course: path.title,
    chapter: lesson.chapterTitle,
    stepType: lesson.stepType || lesson.kind || 'explanation',
    interactionRequired: Boolean(lesson.interactionRequired || lessonNeedsCheck(lesson)),
    title: lesson.title,
    objective: lesson.objective || '',
    explanation: clip(lesson.explanation, 1800),
    example: clip(lesson.example || '', 900),
    question: clip(lesson.question || '', 400),
    practiceTask: clip(lesson.practiceTask || '', 400),
    criteria: clip(lesson.criteria || '', 400),
    keypoints: (lesson.keypoints || []).slice(0, 6),
    watchOut: clip(lesson.watchOut || '', 240),
    previousLessons: previousTitles(path, index),
    learnerSignals: (progress.signals || []).slice(-12),
  };

  try {
    const raw = await openaiJsonCompletion({
      temperature: 0.45,
      timeoutMs: 25_000,
      system: BOOK_TUTOR_AGENT_TEACH_SYSTEM,
      user: JSON.stringify(payload),
    });
    const parsed = parseJsonObject<TeachJson>(raw);
    const speech = String(parsed?.speech || '').trim();
    if (speech.length < 24) return fallbackLive(lesson, alreadyDone);
    const ask = alreadyDone ? false : shouldAsk(lesson, parsed);
    let prompt = ask ? String(parsed?.prompt || lesson.practiceTask || lesson.question || '').trim() : '';
    if (ask && isGenericPrompt(prompt)) {
      prompt = String(lesson.practiceTask || lesson.question || '').trim();
    }
    if (ask && isGenericPrompt(prompt)) {
      return {
        ...fallbackLive(lesson, alreadyDone),
        turns: [{ role: 'tutor', text: speech, example: String(parsed?.example || lesson.example || '') || undefined }],
      };
    }
    return {
      turns: [
        {
          role: 'tutor',
          text: speech.slice(0, 3500),
          example: String(parsed?.example || lesson.example || '').slice(0, 2500) || undefined,
        },
      ],
      ask,
      prompt,
      kind: liveKind(parsed?.kind, ask),
      concept: String(parsed?.concept || lesson.title).slice(0, 120),
      passed: !ask || alreadyDone,
      attempts: 0,
      hints: 0,
    };
  } catch (err) {
    console.error('book tutor live teach failed:', err);
    return fallbackLive(lesson, alreadyDone);
  }
}

export async function openLiveTutor(opts: { userId: string; pathId: string }) {
  const path = await getPath(opts.pathId);
  if (!path) throw new BookTutorError('Book tutor not found.', 404);
  if (!(await canAccessPath(opts.userId, path))) {
    throw new BookTutorError('You do not have access to this book tutor.', 403);
  }
  if (!pathIsPlayable(path)) throw new BookTutorError('This tutor is not ready yet.', 409);
  const progress = await getProgress(opts.userId, path.id);
  if (progress.phase === 'complete') return getLearnerSession(opts.userId, path.id);
  const idx = Math.min(progress.currentLessonIndex, Math.max(0, path.lessons.length - 1));
  const lesson = path.lessons[idx];
  if (!lesson) throw new BookTutorError('No lesson to teach.', 400);

  const cached = progress.tutorTurns?.[lesson.id];
  if (cached?.turns?.length) return getLearnerSession(opts.userId, path.id);

  const lockKey = `${opts.userId}:${path.id}:${lesson.id}`;
  if (teachingLocks.has(lockKey)) {
    await waitForLive(opts.userId, path.id, lesson.id, lockKey);
    return getLearnerSession(opts.userId, path.id);
  }

  teachingLocks.add(lockKey);
  try {
    const again = await getProgress(opts.userId, path.id);
    if (again.tutorTurns?.[lesson.id]?.turns?.length) return getLearnerSession(opts.userId, path.id);
    const live = publicLive(await generateTeach(path, again, lesson, idx));
    const db = await getDb();
    await db.collection('book_tutor_progress').updateOne(
      { userId: opts.userId, pathId: path.id },
      {
        $set: {
          [`tutorTurns.${lesson.id}`]: live,
          updatedAt: new Date(),
        },
      },
    );
  } finally {
    teachingLocks.delete(lockKey);
  }
  return getLearnerSession(opts.userId, path.id);
}

async function gradeWithTutor(
  lesson: BookTutorLesson,
  live: BookTutorLiveState,
  message: string,
  signals: BookTutorSignal[] | undefined,
): Promise<RespondJson> {
  if (!isLLMConfigured()) {
    return {
      correct: false,
      partial: false,
      feedback: 'Try again using the example on this step. Name the idea this prompt is actually asking for.',
      hint: live.prompt ? `Look back at: ${clip(live.prompt, 160)}` : '',
      understanding: 'weak',
    };
  }
  const raw = await openaiJsonCompletion({
    temperature: 0.35,
    timeoutMs: 20_000,
    system: BOOK_TUTOR_AGENT_RESPOND_SYSTEM,
    user: JSON.stringify({
      title: lesson.title,
      stepType: lesson.stepType || lesson.kind,
      objective: lesson.objective || '',
      explanation: clip(lesson.explanation, 1400),
      example: clip(lesson.example || '', 700),
      criteria: clip(lesson.criteria || '', 400),
      prompt: live.prompt,
      kind: live.kind,
      attempts: live.attempts,
      conversation: live.turns.slice(-8).map((t) => ({ role: t.role, text: clip(t.text, 800) })),
      learnerAnswer: clip(message, 2000),
      learnerSignals: (signals || []).slice(-12),
    }),
  });
  const parsed = parseJsonObject<RespondJson>(raw);
  if (!parsed) {
    return {
      correct: false,
      feedback: 'I could not check that just now. Try a more complete answer using the example on this step.',
      hint: '',
      understanding: 'ok',
    };
  }
  return parsed;
}

export async function respondToTutor(opts: { userId: string; pathId: string; message: string }) {
  const path = await getPath(opts.pathId);
  if (!path) throw new BookTutorError('Book tutor not found.', 404);
  if (!(await canAccessPath(opts.userId, path))) {
    throw new BookTutorError('You do not have access to this book tutor.', 403);
  }
  if (!pathIsPlayable(path)) throw new BookTutorError('This tutor is not ready yet.', 409);
  const progress = await getProgress(opts.userId, path.id);
  if (progress.phase === 'complete') throw new BookTutorError('You already finished this book.', 400);
  const lesson = path.lessons[progress.currentLessonIndex];
  if (!lesson) throw new BookTutorError('No lesson to grade.', 400);
  let live = progress.tutorTurns?.[lesson.id] ? publicLive(progress.tutorTurns[lesson.id]) : null;
  if (!live?.turns?.length) {
    const session = await openLiveTutor({ userId: opts.userId, pathId: path.id });
    live = session.tutor ? publicLive(session.tutor) : null;
  }
  if (!live) throw new BookTutorError('The tutor is not ready on this step yet.', 409);
  if (!live.ask) throw new BookTutorError('This step does not need an answer. Continue when you are ready.', 400);
  if (live.passed) return getLearnerSession(opts.userId, path.id);

  const message = opts.message.trim();
  if (!message) throw new BookTutorError('Type an answer before submitting.', 400);

  live.turns.push({ role: 'student', text: message.slice(0, 4000) });
  live.attempts += 1;

  let parsed: RespondJson;
  try {
    parsed = await gradeWithTutor(lesson, live, message, progress.signals);
  } catch (err) {
    console.error('book tutor live respond failed:', err);
    parsed = {
      correct: false,
      feedback: 'I could not check that just now. Try again in a moment.',
      hint: '',
      understanding: 'ok',
    };
  }

  const correct = Boolean(parsed.correct);
  const partial = !correct && Boolean(parsed.partial);
  const hint = correct ? '' : String(parsed.hint || '').trim();
  const follow = correct ? String(parsed.follow_up || parsed.followUp || '').trim() : '';
  const extraExample = String(parsed.example || '').trim();
  let feedback = String(parsed.feedback || '').trim();
  if (!feedback) {
    feedback = correct
      ? 'That works. You used the idea this step was teaching.'
      : 'Not quite. Look at the example on this step and try once more.';
  }
  if (hint && !correct) {
    feedback = `${feedback}\n\n${hint}`;
    live.hints += 1;
  }
  live.turns.push({
    role: 'tutor',
    text: feedback.slice(0, 2500),
    example: extraExample ? extraExample.slice(0, 2000) : undefined,
  });
  if (follow) {
    live.turns.push({ role: 'tutor', text: follow.slice(0, 1500) });
  }
  live.passed = correct;

  const understanding =
    parsed.understanding === 'strong' || parsed.understanding === 'weak' || parsed.understanding === 'ok'
      ? parsed.understanding
      : correct
        ? 'strong'
        : partial
          ? 'ok'
          : 'weak';
  const signals = upsertSignal(progress.signals, {
    concept: live.concept || lesson.title,
    understanding,
    attempts: live.attempts,
    last_result: correct ? 'correct' : partial ? 'partial' : 'incorrect',
    mastery: understanding === 'strong' ? 0.85 : understanding === 'ok' ? 0.55 : 0.25,
  });

  const completed = new Set(progress.completedLessonIds || []);
  if (correct) completed.add(lesson.id);
  const db = await getDb();
  await db.collection('book_tutor_progress').updateOne(
    { userId: opts.userId, pathId: path.id },
    {
      $set: {
        [`tutorTurns.${lesson.id}`]: live,
        signals,
        phase: correct ? 'passed' : 'quiz',
        lastFeedback: feedback.slice(0, 600),
        lastCorrect: correct,
        attemptsOnCurrent: live.attempts,
        completedLessonIds: Array.from(completed),
        lessonAnswers: {
          ...(progress.lessonAnswers || {}),
          [lesson.id]: { answer: message.slice(0, 4000), feedback: feedback.slice(0, 600), isCorrect: correct },
        },
        updatedAt: new Date(),
      },
    },
  );
  if (correct && !progress.completedLessonIds?.includes(lesson.id)) {
    await awardXp(opts.userId, XP.COMPLETE_BOOK_LESSON).catch(() => {});
  }
  return getLearnerSession(opts.userId, path.id);
}
