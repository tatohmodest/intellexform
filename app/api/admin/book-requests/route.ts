import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin } from '@/lib/adminAuth';
import { listAllBookRequests, updateBookRequestStatus } from '@/lib/learn/bookRequests';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const requests = await listAllBookRequests(150);
  return NextResponse.json({ requests });
}

export async function PATCH(req: NextRequest) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const id = String(body.id || '');
  const status = body.status;
  if (!id || !['pending', 'fulfilled', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  const ok = await updateBookRequestStatus(id, {
    status,
    adminNote: typeof body.adminNote === 'string' ? body.adminNote : '',
  });
  if (!ok) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
