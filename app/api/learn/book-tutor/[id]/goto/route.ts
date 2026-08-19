import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { BookTutorError, openStoredLesson } from '@/lib/learn/bookTutor';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { chapterId?: string; lessonIndex?: number };
  try {
    const session = await openStoredLesson({
      userId: user.uid,
      pathId: params.id,
      chapterId: typeof body.chapterId === 'string' ? body.chapterId : undefined,
      lessonIndex: typeof body.lessonIndex === 'number' ? body.lessonIndex : undefined,
    });
    return NextResponse.json(session);
  } catch (err) {
    const status = err instanceof BookTutorError ? err.status : 500;
    const message = err instanceof Error ? err.message : 'Could not open that chapter.';
    return NextResponse.json({ error: message }, { status });
  }
}
