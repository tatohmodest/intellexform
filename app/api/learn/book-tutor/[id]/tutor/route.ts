import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { BookTutorError } from '@/lib/learn/bookTutor';
import { respondToTutor } from '@/lib/learn/bookTutorLive';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  try {
    const session = await respondToTutor({
      userId: user.uid,
      pathId: params.id,
      message: String(body.message || body.answer || ''),
    });
    return NextResponse.json(session);
  } catch (err) {
    const status = err instanceof BookTutorError ? err.status : 500;
    const message = err instanceof Error ? err.message : 'Could not check that answer.';
    return NextResponse.json({ error: message }, { status });
  }
}
