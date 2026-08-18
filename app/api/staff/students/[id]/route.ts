import { NextRequest, NextResponse } from 'next/server';
import { STUDENT_STATUSES } from '@/lib/staff/permissions';
import { getStudentDetail, requireStaff, updateStudentRecord } from '@/lib/staff/store';
import { staffFail } from '@/lib/staff/http';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireStaff('students.read');
    const student = await getStudentDetail(params.id);
    if (!student) return NextResponse.json({ error: 'Student not found.' }, { status: 404 });
    return NextResponse.json({ student });
  } catch (err) {
    return staffFail(err);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const actor = await requireStaff('students.write');
    const body = await req.json().catch(() => ({}));
    const status = (STUDENT_STATUSES as readonly string[]).includes(String(body.status || ''))
      ? (body.status as (typeof STUDENT_STATUSES)[number])
      : undefined;
    const student = await updateStudentRecord(actor, params.id, {
      status,
      program: typeof body.program === 'string' ? body.program : undefined,
      department: typeof body.department === 'string' ? body.department : undefined,
      faculty: typeof body.faculty === 'string' ? body.faculty : undefined,
      year: typeof body.year === 'string' ? body.year : undefined,
      phone: typeof body.phone === 'string' ? body.phone : undefined,
      notes: typeof body.notes === 'string' ? body.notes : undefined,
    });
    return NextResponse.json({ student });
  } catch (err) {
    return staffFail(err);
  }
}
