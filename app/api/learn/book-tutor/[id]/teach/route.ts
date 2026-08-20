import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { BookTutorError } from '@/lib/learn/bookTutor';
import { openLiveTutor } from '@/lib/learn/bookTutorLive';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const session = await openLiveTutor({ userId: user.uid, pathId: params.id });
    return NextResponse.json(session);
  } catch (err) {
    const status = err instanceof BookTutorError ? err.status : 500;
    const message = err instanceof Error ? err.message : 'Could not prepare this step.';
    return NextResponse.json({ error: message }, { status });
  }
}
