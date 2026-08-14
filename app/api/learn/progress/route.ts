import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { setLessonComplete, getProgress } from '@/lib/learn/repo';
import { getTrackLessons } from '@/lib/learn/catalog';

export const dynamic = 'force-dynamic';

/** Flexible progress for tutorial tracks and drive/instructor courses. */
export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const courseSlug = String(body.courseSlug ?? '');
  const lessonSlug = String(body.lessonSlug ?? body.lessonId ?? '');
  const done = body.done !== false;
  if (!courseSlug || !lessonSlug) {
    return NextResponse.json({ error: 'courseSlug and lessonSlug required' }, { status: 400 });
  }

  const lesson = getTrackLessons(courseSlug).find((l) => l.slug === lessonSlug);
  const minutes =
    typeof body.minutes === 'number'
      ? body.minutes
      : lesson?.minutes || 10;

  try {
    await setLessonComplete({
      userId: user.uid,
      courseSlug,
      lessonSlug,
      minutes,
      done,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('progress update failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}

export async function GET(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const courseSlug = new URL(req.url).searchParams.get('courseSlug') || undefined;
  const progress = await getProgress(user.uid, courseSlug);
  return NextResponse.json({ progress });
}
