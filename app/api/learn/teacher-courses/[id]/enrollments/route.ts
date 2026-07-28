import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  enrollStudentInCourse,
  getTeacherCourse,
  listCourseEnrollments,
  removeCourseEnrollment,
  searchLearners,
} from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

function canManage(
  course: { authorId: string; instructorId?: string | null },
  uid: string,
): boolean {
  return course.authorId === uid || course.instructorId === uid;
}

/** GET - roster for the instructor. */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const course = await getTeacherCourse(params.id);
  if (!course) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (!canManage(course, session.uid)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const enrollments = await listCourseEnrollments(params.id);
  return NextResponse.json({ enrollments });
}

/**
 * POST - instructor adds a student directly (no payment).
 * body: { studentId }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const course = await getTeacherCourse(params.id);
  if (!course) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (!canManage(course, session.uid)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const studentId = String(body.studentId || '').trim();
  if (!studentId) return NextResponse.json({ error: 'student_required' }, { status: 400 });

  // Resolve the learner so the roster shows a real name.
  const matches = await searchLearners(studentId, 1);
  let student = matches.find((m) => m.lbId === studentId) || null;
  if (!student) {
    const byName = String(body.studentName || '').trim();
    student = {
      lbId: studentId,
      name: byName || 'Student',
      email: String(body.studentEmail || ''),
      avatar: null,
    };
  }

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
    try {
      const { createNotification } = await import('@/lib/learn/notifications');
      await createNotification({
        userId: studentId,
        title: `You were added to “${course.title}”`,
        body: `${course.instructorName || course.authorName} added you to this course. Open My Courses to start.`,
        href: `/dashboard/courses/instructor/${course.id}`,
        kind: 'system',
        data: { courseId: course.id },
      });
    } catch (err) {
      console.error('enrollment notify failed:', err);
    }
  }

  const enrollments = await listCourseEnrollments(params.id);
  return NextResponse.json({ ok: true, created: result.created, enrollments });
}

/** DELETE ?studentId= - remove a student from the course. */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const course = await getTeacherCourse(params.id);
  if (!course) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (!canManage(course, session.uid)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const studentId = req.nextUrl.searchParams.get('studentId') || '';
  if (!studentId) return NextResponse.json({ error: 'student_required' }, { status: 400 });

  await removeCourseEnrollment(params.id, studentId);
  const enrollments = await listCourseEnrollments(params.id);
  return NextResponse.json({ ok: true, enrollments });
}
