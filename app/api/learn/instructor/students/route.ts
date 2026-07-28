import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  getMentorProfile,
  listInstructorStudentGroups,
} from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

/** GET /api/learn/instructor/students - courses with enrolled students for this instructor. */
export async function GET() {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const profile = await getMentorProfile(session.uid);
  if (!profile) return NextResponse.json({ error: 'mentor_required' }, { status: 403 });

  const groups = await listInstructorStudentGroups(session.uid);
  const totalStudents = new Set(groups.flatMap((g) => g.students.map((s) => s.studentId))).size;

  return NextResponse.json({
    groups,
    totalStudents,
    totalCourses: groups.length,
  });
}
