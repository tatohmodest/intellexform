import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { assertAdmin } from '@/lib/adminAuth';
import {
  approveMentorApplication,
  rejectMentorApplication,
  requestMentorDocuments,
  type MentorDocRequestItem,
} from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/applications/[id]
 * body: {
 *   type: 'mentor',
 *   action: 'approve' | 'reject' | 'request_documents',
 *   note?: string,
 *   items?: MentorDocRequestItem[]
 * }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!assertAdmin(req)) {
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
    if (action === 'request_documents') {
      const items = Array.isArray(body.items) ? (body.items as MentorDocRequestItem[]) : [];
      const result = await requestMentorDocuments(id, items, note);
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ ok: true, status: 'under_review', items: result.items });
    }
    return NextResponse.json({ error: 'invalid_action' }, { status: 400 });
  } catch (err) {
    console.error('admin application patch failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
