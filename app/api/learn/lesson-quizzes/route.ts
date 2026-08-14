import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  defaultLessonQuiz,
  getLessonQuiz,
  submitLessonQuizAttempt,
  upsertLessonQuiz,
} from '@/lib/learn/lessonQuizzes';
import { getRoles } from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const url = new URL(req.url);
  const courseKey = url.searchParams.get('courseKey') || '';
  const lessonKey = url.searchParams.get('lessonKey') || '';
  const allowDefault = url.searchParams.get('default') === '1';
  const lessonTitle = url.searchParams.get('title') || 'Lesson';
  if (!courseKey || !lessonKey) {
    return NextResponse.json({ error: 'courseKey and lessonKey required' }, { status: 400 });
  }
  let quiz = await getLessonQuiz(courseKey, lessonKey, session.uid);
  if (!quiz && allowDefault) {
    quiz = defaultLessonQuiz(courseKey, lessonKey, lessonTitle);
  }
  const safe = quiz
    ? {
        ...quiz,
        questions: quiz.questions.map(({ id, prompt, choices }) => ({ id, prompt, choices })),
      }
    : null;
  return NextResponse.json({ quiz: safe });
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const action = String(body.action || 'submit');

  if (action === 'upsert') {
    const roles = await getRoles(session.uid).catch(() => [] as string[]);
    if (!roles.includes('mentor') && !roles.includes('admin')) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    const courseKey = String(body.courseKey || '');
    const lessonKey = String(body.lessonKey || '');
    if (!courseKey || !lessonKey || !Array.isArray(body.questions)) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }
    const quiz = await upsertLessonQuiz({
      courseKey,
      lessonKey,
      title: body.title ? String(body.title) : undefined,
      triggerAtSec: typeof body.triggerAtSec === 'number' ? body.triggerAtSec : null,
      questions: body.questions,
      authorId: session.uid,
    });
    return NextResponse.json({ quiz });
  }

  const courseKey = String(body.courseKey || '');
  const lessonKey = String(body.lessonKey || '');
  const answers = (body.answers || {}) as Record<string, number>;
  if (!courseKey || !lessonKey) {
    return NextResponse.json({ error: 'courseKey and lessonKey required' }, { status: 400 });
  }

  // Ensure a quiz doc exists for default checks so attempts can persist.
  let existing = await getLessonQuiz(courseKey, lessonKey, session.uid);
  if (!existing) {
    const demo = defaultLessonQuiz(courseKey, lessonKey, String(body.title || 'Lesson'));
    await upsertLessonQuiz({
      courseKey,
      lessonKey,
      title: demo.title,
      questions: demo.questions,
      authorId: 'system',
    });
    existing = await getLessonQuiz(courseKey, lessonKey, session.uid);
  }

  const result = await submitLessonQuizAttempt({
    courseKey,
    lessonKey,
    userId: session.uid,
    answers,
  });
  return NextResponse.json(result);
}
