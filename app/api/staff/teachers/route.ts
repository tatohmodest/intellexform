import { NextRequest, NextResponse } from 'next/server';
import { staffFail } from '@/lib/staff/http';
import { grantTeachingAccess, listTeachers, requireStaff } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const actor = await requireStaff('teachers.read');
    const url = new URL(req.url);
    const data = await listTeachers({
      q: url.searchParams.get('q') || undefined,
      campusSlugs: actor.post.campusSlugs.length ? actor.post.campusSlugs : undefined,
    });
    return NextResponse.json(data);
  } catch (err) {
    return staffFail(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const actor = await requireStaff('teachers.manage');
    const body = await req.json().catch(() => ({}));
    const teacher = await grantTeachingAccess(actor, String(body.userId || body.email || ''));
    return NextResponse.json({ ok: true, teacher });
  } catch (err) {
    return staffFail(err);
  }
}
