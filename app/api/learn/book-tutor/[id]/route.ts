import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { BookTutorError, deletePathForUser, getLearnerSession } from '@/lib/learn/bookTutor';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const session = await getLearnerSession(user.uid, params.id);
    return NextResponse.json(session);
  } catch (err) {
    const status = err instanceof BookTutorError ? err.status : 500;
    const message = err instanceof Error ? err.message : 'Could not load book tutor.';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    await deletePathForUser(user.uid, params.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const status = err instanceof BookTutorError ? err.status : 500;
    const message = err instanceof Error ? err.message : 'Could not delete that tutor.';
    return NextResponse.json({ error: message }, { status });
  }
}
