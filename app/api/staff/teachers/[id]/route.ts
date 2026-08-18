import { NextRequest, NextResponse } from 'next/server';
import { staffFail } from '@/lib/staff/http';
import {
  assignCourseToTeacher,
  getTeacherDetail,
  grantTeachingAccess,
  requireStaff,
} from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const actor = await requireStaff('teachers.read');
    const teacher = await getTeacherDetail(params.id, actor);
    if (!teacher) return NextResponse.json({ error: 'Teacher not found.' }, { status: 404 });
    return NextResponse.json({ teacher });
  } catch (err) {
    return staffFail(err);
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const actor = await requireStaff('teachers.manage');
    const body = await req.json().catch(() => ({}));
    const action = String(body.action || 'grant');
    if (action === 'assign_course') {
      const teacher = await assignCourseToTeacher(actor, {
        courseId: String(body.courseId || ''),
        instructorId: params.id,
      });
      return NextResponse.json({ ok: true, teacher });
    }
    const teacher = await grantTeachingAccess(actor, params.id);
    return NextResponse.json({ ok: true, teacher });
  } catch (err) {
    return staffFail(err);
  }
}
