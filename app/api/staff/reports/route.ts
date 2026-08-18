import { NextResponse } from 'next/server';
import { staffFail } from '@/lib/staff/http';
import { listStaffAudit, requireStaff, staffHomeStats } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireStaff('reports.read');
    const [stats, audit] = await Promise.all([staffHomeStats(), listStaffAudit(80)]);
    return NextResponse.json({ stats, audit });
  } catch (err) {
    return staffFail(err);
  }
}
