import { NextResponse } from 'next/server';
import { staffFail } from '@/lib/staff/http';
import { requireStaff, staffHomeStats } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const actor = await requireStaff('staff.access');
    const stats = await staffHomeStats();
    return NextResponse.json({
      desks: actor.post.desks,
      permissions: actor.permissions,
      stats,
    });
  } catch (err) {
    return staffFail(err);
  }
}
