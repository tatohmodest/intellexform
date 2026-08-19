import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { advanceLesson, BookTutorError } from '@/lib/learn/bookTutor';

export const dynamic = 'force-dynamic';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const session = await advanceLesson({ userId: user.uid, pathId: params.id });
    return NextResponse.json(session);
  } catch (err) {
    const status = err instanceof BookTutorError ? err.status : 500;
    const message = err instanceof Error ? err.message : 'Could not open the next step.';
    return NextResponse.json({ error: message }, { status });
  }
}
