import { NextRequest, NextResponse } from 'next/server';
import { MembershipRole } from '@prisma/client';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  addOrgMember,
  assertOrgStaff,
  listOrgMembers,
  searchIntellexUsers,
  setOrgMemberStatus,
} from '@/lib/orgLms';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const auth = await assertOrgStaff({
    slug: params.slug,
    userId: session.uid,
    email: session.email,
  });
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'forbidden' ? 403 : 404 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  if (search) {
    const users = await searchIntellexUsers(search);
    return NextResponse.json({ users });
  }

  const roleFilter = (searchParams.get('role') as 'students' | 'instructors' | 'all') || 'all';
  const members = await listOrgMembers({
    slug: params.slug,
    roleFilter: roleFilter === 'all' ? 'all' : roleFilter,
    q: searchParams.get('q') || undefined,
  });
  return NextResponse.json({ members });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const auth = await assertOrgStaff({
    slug: params.slug,
    userId: session.uid,
    email: session.email,
  });
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'forbidden' ? 403 : 404 });
  }

  const body = await req.json().catch(() => ({}));
  const action = String(body.action || 'add');

  try {
    if (action === 'suspend' || action === 'restore') {
      if (!body.membershipId) {
        return NextResponse.json({ error: 'membershipId required' }, { status: 400 });
      }
      const membership = await setOrgMemberStatus({
        institutionId: auth.institutionId,
        membershipId: String(body.membershipId),
        suspend: action === 'suspend',
        reason: body.reason ? String(body.reason) : undefined,
      });
      return NextResponse.json({ ok: true, membership });
    }

    const roleRaw = String(body.role || 'STUDENT').toUpperCase();
    const role =
      roleRaw === 'INSTRUCTOR'
        ? MembershipRole.INSTRUCTOR
        : roleRaw === 'ORG_ADMIN'
          ? MembershipRole.ORG_ADMIN
          : MembershipRole.STUDENT;

    const member = await addOrgMember({
      institutionId: auth.institutionId,
      email: String(body.email || ''),
      role,
      title: body.title ? String(body.title) : undefined,
      name: body.name ? String(body.name) : undefined,
    });
    return NextResponse.json({ ok: true, member });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed' },
      { status: 400 },
    );
  }
}
