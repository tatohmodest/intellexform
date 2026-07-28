import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import {
  countPaidPurchases,
  enrollStudentInCourse,
  getInstitution,
  getTeacherCourse,
  isEnrolledInCourse,
} from '@/lib/learn/ecosystem';
import { computeCommission } from '@/lib/learn/commission';

export const dynamic = 'force-dynamic';

/**
 * GET - price + commission preview for the signed-in student.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const course = await getTeacherCourse(params.id);
  if (!course || !course.published) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const instructorId = course.instructorId || course.authorId;
  const [enrolled, prior] = await Promise.all([
    isEnrolledInCourse(params.id, session.uid),
    countPaidPurchases(instructorId, session.uid),
  ]);
  const breakdown = computeCommission(course.priceXAF ?? 0, prior);

  return NextResponse.json({
    enrolled,
    priceXAF: course.priceXAF ?? 0,
    isTrial: breakdown.isTrial,
    commissionRate: breakdown.rate,
  });
}

/**
 * POST - enrol in a free teacher course.
 * Paid courses must go through `POST /api/payments/initialize` (kind=teacher_course).
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const course = await getTeacherCourse(params.id);
  if (!course || !course.published) {
    return NextResponse.json({ error: 'not_available' }, { status: 404 });
  }
  if (course.audience === 'allocated') {
    return NextResponse.json({ error: 'instructor_managed' }, { status: 403 });
  }

  if (await isEnrolledInCourse(params.id, session.uid)) {
    return NextResponse.json({ ok: true, alreadyEnrolled: true });
  }

  // Campus courses: free unless the institution explicitly allows paid extras.
  if (course.institutionSlug) {
    const inst = await getInstitution(course.institutionSlug);
    if (!inst?.allowInstructorSales) {
      // Still allow free enrol for open/institution audience campus courses.
      if ((course.priceXAF ?? 0) > 0) {
        return NextResponse.json(
          { error: 'Campus courses cannot be sold unless your institution enables instructor sales.' },
          { status: 403 },
        );
      }
    }
  }

  const price = Math.max(0, course.priceXAF ?? 0);
  if (price > 0) {
    return NextResponse.json(
      {
        error: 'payment_required',
        message: 'Pay for this course with PayUnit to enrol.',
      },
      { status: 402 },
    );
  }

  const instructorId = course.instructorId || course.authorId;
  const learner = await getLearner(session.uid);
  const prior = await countPaidPurchases(instructorId, session.uid);
  const breakdown = computeCommission(0, prior);

  await enrollStudentInCourse({
    course,
    studentId: session.uid,
    studentName: learner?.name || session.name || 'Student',
    studentEmail: learner?.email || session.email || null,
    source: 'free',
    priceXAF: 0,
    platformXAF: 0,
    instructorXAF: 0,
    commissionRate: 0,
    isTrial: false,
  });

  try {
    const { createNotification } = await import('@/lib/learn/notifications');
    await createNotification({
      userId: instructorId,
      title: `New student in “${course.title}”`,
      body: `${learner?.name || 'A student'} enrolled for free.`,
      href: `/dashboard/teach/courses`,
      kind: 'system',
      data: { courseId: course.id },
    });
  } catch (err) {
    console.error('purchase notify failed:', err);
  }

  return NextResponse.json({ ok: true, breakdown });
}
