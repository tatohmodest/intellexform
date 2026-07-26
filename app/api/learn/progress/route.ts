import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { setLessonComplete } from '@/lib/learn/repo';
import { getTrackLessons } from '@/lib/learn/catalog';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const courseSlug = String(body.courseSlug ?? '');
  const lessonSlug = String(body.lessonSlug ?? '');
  const done = Boolean(body.done);

  const lesson = getTrackLessons(courseSlug).find((l) => l.slug === lessonSlug);
  if (!lesson) return NextResponse.json({ error: 'unknown_lesson' }, { status: 400 });

  try {
    await setLessonComplete({
      userId: user.uid,
      courseSlug,
      lessonSlug,
      minutes: lesson.minutes || 5,
      done,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('progress update failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
