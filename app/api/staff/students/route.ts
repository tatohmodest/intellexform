import { NextRequest, NextResponse } from 'next/server';
import { staffFail } from '@/lib/staff/http';
import { listStudents, requireStaff } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireStaff('students.read');
    const url = new URL(req.url);
    const data = await listStudents({
      q: url.searchParams.get('q') || undefined,
      status: url.searchParams.get('status') || undefined,
      page: Number(url.searchParams.get('page') || '1'),
    });
    return NextResponse.json(data);
  } catch (err) {
    return staffFail(err);
  }
}
