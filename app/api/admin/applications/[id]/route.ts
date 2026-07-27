import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { verifySessionToken, COOKIE_NAME } from '@/lib/adminAuth';
import {
  approveMentorApplication,
  rejectMentorApplication,
} from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/applications/[id]
 * body: { type: 'mentor', action: 'approve' | 'reject', note?: string }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = params.id;
  try {
    new ObjectId(id);
  } catch {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const type = String(body.type ?? 'mentor');
  const action = String(body.action ?? '');
  const note = String(body.note ?? '').trim();

  if (type !== 'mentor') {
    return NextResponse.json({ error: 'unsupported_type' }, { status: 400 });
  }

  try {
    if (action === 'approve') {
      const result = await approveMentorApplication(id);
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ ok: true, status: 'approved' });
    }
    if (action === 'reject') {
      const result = await rejectMentorApplication(id, note);
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ ok: true, status: 'rejected' });
    }
    return NextResponse.json({ error: 'invalid_action' }, { status: 400 });
  } catch (err) {
    console.error('admin application patch failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
