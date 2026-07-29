import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import { createBookRequest, listBookRequestsByUser } from '@/lib/learn/bookRequests';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const requests = await listBookRequestsByUser(session.uid);
  return NextResponse.json({ requests });
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const title = String(body.title || '').trim();
  if (title.length < 2) {
    return NextResponse.json({ error: 'title_required' }, { status: 400 });
  }

  const learner = await getLearner(session.uid);
  const request = await createBookRequest({
    userId: session.uid,
    userName: learner?.name || 'Student',
    userEmail: learner?.email || '',
    title,
    authorHint: String(body.authorHint || ''),
    reason: String(body.reason || ''),
  });

  return NextResponse.json({ ok: true, request }, { status: 201 });
}
