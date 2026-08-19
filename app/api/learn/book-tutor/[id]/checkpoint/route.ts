import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { BookTutorError, submitCheckpoint } from '@/lib/learn/bookTutor';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  try {
    const result = await submitCheckpoint({
      userId: user.uid,
      pathId: params.id,
      checkId: String(body.checkId || ''),
      yes: body.yes === true,
    });
    return NextResponse.json(result);
  } catch (err) {
    const status = err instanceof BookTutorError ? err.status : 500;
    const message = err instanceof Error ? err.message : 'Could not record that check.';
    return NextResponse.json({ error: message }, { status });
  }
}
