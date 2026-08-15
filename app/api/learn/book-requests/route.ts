import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import { hasActiveCertSubscription } from '@/lib/learn/certSubscription';
import {
  createBookRequest,
  getBookRequestQuota,
  listBookRequestsByUser,
} from '@/lib/learn/bookRequests';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const isStudent = await hasActiveCertSubscription(session.uid);
  const [requests, quota] = await Promise.all([
    listBookRequestsByUser(session.uid),
    getBookRequestQuota(session.uid, isStudent),
  ]);
  return NextResponse.json({ requests, quota });
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const title = String(body.title || '').trim();
  if (title.length < 2) {
    return NextResponse.json({ error: 'title_required' }, { status: 400 });
  }

  const isStudent = await hasActiveCertSubscription(session.uid);
  const quota = await getBookRequestQuota(session.uid, isStudent);
  if (quota.remaining <= 0) {
    return NextResponse.json(
      {
        error: 'quota_exceeded',
        message: isStudent
          ? `You've used all ${quota.limit} book requests for ${quota.monthLabel}.`
          : `You've used both of your ${quota.limit} book requests for ${quota.monthLabel}. Become an InTelleX Student for up to 10 requests per month.`,
        quota,
      },
      { status: 429 },
    );
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

  const nextQuota = await getBookRequestQuota(session.uid, isStudent);
  return NextResponse.json({ ok: true, request, quota: nextQuota }, { status: 201 });
}
