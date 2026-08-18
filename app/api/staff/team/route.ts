import { NextRequest, NextResponse } from 'next/server';
import { staffFail } from '@/lib/staff/http';
import { isStaffDesk, isStaffPermission } from '@/lib/staff/permissions';
import { listStaffPosts, requireStaff, revokeStaffPost, upsertStaffPost } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const actor = await requireStaff('staff.manage');
    const posts = await listStaffPosts();
    const scoped = actor.post.campusSlugs.length
      ? posts.filter(
          (p) => p.campusSlugs.length && p.campusSlugs.every((c) => actor.post.campusSlugs.includes(c)),
        )
      : posts;
    return NextResponse.json({
      posts: scoped,
      actor: {
        permissions: actor.permissions,
        campusSlugs: actor.post.campusSlugs,
      },
    });
  } catch (err) {
    return staffFail(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const actor = await requireStaff('staff.manage');
    const body = await req.json().catch(() => ({}));
    const result = await upsertStaffPost({
      email: String(body.email || ''),
      desks: Array.isArray(body.desks) ? body.desks.filter(isStaffDesk) : [],
      extraPermissions: Array.isArray(body.extraPermissions)
        ? body.extraPermissions.filter(isStaffPermission)
        : [],
      campusSlugs: Array.isArray(body.campusSlugs) ? body.campusSlugs.map(String) : [],
      active: body.active !== false,
      grantedBy: actor.email,
      grantedByUserId: actor.userId,
      grantedByKind: 'director',
      actorPermissions: actor.permissions,
      actorCampusSlugs: actor.post.campusSlugs,
    });
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ ok: true, post: result });
  } catch (err) {
    return staffFail(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const actor = await requireStaff('staff.manage');
    const body = await req.json().catch(() => ({}));
    const userId = String(body.userId || '');
    if (!userId) return NextResponse.json({ error: 'Missing person.' }, { status: 400 });
    if (userId === actor.userId) {
      return NextResponse.json({ error: 'You cannot revoke your own post.' }, { status: 400 });
    }
    await revokeStaffPost(userId, actor.email, {
      actorId: actor.userId,
      actorCampusSlugs: actor.post.campusSlugs,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return staffFail(err);
  }
}
