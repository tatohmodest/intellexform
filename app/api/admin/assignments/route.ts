import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin } from '@/lib/adminAuth';
import {
  enrollStudentInCourse,
  getTeacherCourse,
  listCourseEnrollments,
  removeCourseEnrollment,
  searchLearners,
} from '@/lib/learn/ecosystem';
import { listTeachers } from '@/lib/staff/store';
import { createNotification } from '@/lib/learn/notifications';

export const dynamic = 'force-dynamic';

/**
 * GET                  -> teachers with their courses
 * GET ?courseId=       -> roster of one course
 * GET ?students=<q>    -> learner search
 */
export async function GET(req: NextRequest) {
  if (!assertAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sp = req.nextUrl.searchParams;
  try {
    const courseId = sp.get('courseId');
    if (courseId) {
      const enrollments = await listCourseEnrollments(courseId);
      return NextResponse.json({ enrollments });
    }
    const q = sp.get('students');
    if (q !== null) {
      const students = q.trim().length >= 2 ? await searchLearners(q.trim(), 8) : [];
      return NextResponse.json({ students });
    }
    const { teachers } = await listTeachers();
    return NextResponse.json({ teachers: teachers.filter((t) => t.canTeach || t.courseCount > 0) });
  } catch (err) {
    console.error('admin assignments:', err);
    return NextResponse.json({ error: 'Could not load assignments.' }, { status: 503 });
  }
}

/** POST { courseId, studentId } - assign a student to a teacher's course. */
export async function POST(req: NextRequest) {
  if (!assertAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const courseId = String(body.courseId || '');
  const studentId = String(body.studentId || '').trim();
  if (!courseId || !studentId) {
    return NextResponse.json({ error: 'Choose a course and a student.' }, { status: 400 });
  }
  const course = await getTeacherCourse(courseId);
  if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 });

  const matches = await searchLearners(studentId, 5);
  const student = matches.find((m) => m.lbId === studentId);
  if (!student) return NextResponse.json({ error: 'Student not found.' }, { status: 404 });

  const result = await enrollStudentInCourse({
    course,
    studentId,
    studentName: student.name,
    studentEmail: student.email || null,
    source: 'instructor',
    priceXAF: 0,
    platformXAF: 0,
    instructorXAF: 0,
    commissionRate: 0,
    isTrial: false,
  });
  if (result.created) {
    await createNotification({
      userId: studentId,
      title: `You were assigned to ${course.instructorName || course.authorName}`,
      body: `You now have access to “${course.title}”. Open My Courses to start.`,
      href: `/dashboard/courses/instructor/${course.id}`,
      kind: 'system',
      data: { courseId: course.id },
    }).catch(() => {});
  }
  const enrollments = await listCourseEnrollments(courseId);
  return NextResponse.json({ ok: true, created: result.created, enrollments });
}

/** DELETE ?courseId=&studentId= */
export async function DELETE(req: NextRequest) {
  if (!assertAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const courseId = req.nextUrl.searchParams.get('courseId') || '';
  const studentId = req.nextUrl.searchParams.get('studentId') || '';
  if (!courseId || !studentId) return NextResponse.json({ error: 'Missing ids.' }, { status: 400 });
  await removeCourseEnrollment(courseId, studentId);
  const enrollments = await listCourseEnrollments(courseId);
  return NextResponse.json({ ok: true, enrollments });
}
