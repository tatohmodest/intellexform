import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLessonNote, upsertLessonNote } from '@/lib/learn/lessonNotes';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const courseKey = searchParams.get('courseKey') || '';
  const lessonKey = searchParams.get('lessonKey') || '';
  if (!courseKey || !lessonKey) {
    return NextResponse.json({ error: 'courseKey and lessonKey required' }, { status: 400 });
  }
  const note = await getLessonNote({
    userId: session.uid,
    courseKey,
    lessonKey,
  });
  return NextResponse.json({ note });
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  try {
    const note = await upsertLessonNote({
      userId: session.uid,
      courseKey: String(body.courseKey || ''),
      lessonKey: String(body.lessonKey || ''),
      body: String(body.body || ''),
      timestampSec: typeof body.timestampSec === 'number' ? body.timestampSec : null,
    });
    return NextResponse.json({ ok: true, note });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed' },
      { status: 400 },
    );
  }
}
