import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin, getAdminAccess } from '@/lib/adminAuth';
import {
  isStaffDesk,
  isStaffPermission,
  type StaffDesk,
  type StaffPermission,
} from '@/lib/staff/permissions';
import { listStaffAudit, listStaffPosts, revokeStaffPost, upsertStaffPost } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const [posts, audit] = await Promise.all([listStaffPosts(), listStaffAudit(40)]);
    return NextResponse.json({ posts, audit });
  } catch (err) {
    console.error('admin staff list:', err);
    return NextResponse.json({ error: 'Could not load staff posts.' }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  const access = getAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const desks = (Array.isArray(body.desks) ? body.desks : []).filter(isStaffDesk) as StaffDesk[];
  const extraPermissions = (Array.isArray(body.extraPermissions) ? body.extraPermissions : []).filter(
    isStaffPermission,
  ) as StaffPermission[];
  const result = await upsertStaffPost({
    email: String(body.email || ''),
    desks,
    extraPermissions,
    active: body.active !== false,
    grantedBy: access.email,
  });
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ ok: true, post: result });
}

export async function DELETE(req: NextRequest) {
  const access = getAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const userId = String(body.userId || '');
  if (!userId) return NextResponse.json({ error: 'Missing user.' }, { status: 400 });
  await revokeStaffPost(userId, access.email);
  return NextResponse.json({ ok: true });
}
