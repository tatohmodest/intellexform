import crypto from 'crypto';
import type { Order } from '@/lib/types';
import { getOrderByTransaction, updateOrderStatus } from '@/lib/repo';
import { createBooking, getLearner } from '@/lib/learn/repo';
import {
  enrollStudentInCourse,
  getTeacherCourse,
  isEnrolledInCourse,
} from '@/lib/learn/ecosystem';

/**
 * After PayUnit marks an order paid, grant access:
 * - teacher_course → enrol the student (commission already on the order)
 * - session_booking → create the mentorship booking
 * - catalogue → no auto-enrol (legacy WhatsApp handoff)
 */
export async function fulfillPaidOrder(transactionId: string): Promise<Order | null> {
  const order = await getOrderByTransaction(transactionId);
  if (!order || order.status !== 'paid') return order;

  if (order.fulfilled) return order;

  const kind = order.kind || 'catalogue';

  try {
    if ((kind === 'catalogue' || !order.kind) && order.userId && order.courseSlug) {
      const { recordContentPurchase } = await import('@/lib/contentAccess');
      await recordContentPurchase({
        userId: order.userId,
        kind: 'course',
        slug: String(order.courseSlug),
        scope: 'full',
        priceXAF: order.amountXAF,
      });
      await recordContentPurchase({
        userId: order.userId,
        kind: 'tutorial',
        slug: String(order.courseSlug),
        scope: 'full',
        priceXAF: order.amountXAF,
      });
      const { getDb } = await import('@/lib/repo');
      const db = await getDb();
      await db.collection('enrollments').updateOne(
        { userId: order.userId, courseSlug: String(order.courseSlug) },
        {
          $set: {
            userId: order.userId,
            courseSlug: String(order.courseSlug),
            courseName: order.courseName,
            enrolledAt: new Date(),
            source: 'purchase',
          },
        },
        { upsert: true },
      );
    }

    if (kind === 'teacher_course' && order.userId && order.productId) {
      const course = await getTeacherCourse(order.productId);
      if (course && !(await isEnrolledInCourse(course.id, order.userId))) {
        const learner = await getLearner(order.userId);
        await enrollStudentInCourse({
          course,
          studentId: order.userId,
          studentName: learner?.name || order.fullName || 'Student',
          studentEmail: learner?.email || order.email || null,
          source: 'purchase',
          priceXAF: order.amountXAF,
          platformXAF: order.platformXAF ?? order.amountXAF,
          instructorXAF: order.instructorXAF ?? 0,
          commissionRate: order.commissionRate ?? 1,
          isTrial: Boolean(order.isTrial),
        });

        const instructorId = course.instructorId || course.authorId;
        try {
          const { createNotification } = await import('@/lib/learn/notifications');
          await createNotification({
            userId: instructorId,
            title: `New paid enrolment · “${course.title}”`,
            body: `${learner?.name || order.fullName || 'A student'} paid ${order.amountXAF.toLocaleString()} XAF.${
              order.isTrial
                ? ' Trial with a new student - InTelleX keeps 100%.'
                : order.instructorXAF
                  ? ` You earn ${order.instructorXAF.toLocaleString()} XAF.`
                  : ''
            }`,
            href: '/dashboard/mentor/income',
            kind: 'system',
            data: { courseId: course.id, transactionId },
          });
        } catch (err) {
          console.error('fulfill teacher_course notify failed:', err);
        }
      }
    }

    if (kind === 'session_booking' && order.userId && order.productId && order.booking) {
      const scheduledAt = new Date(order.booking.scheduledAt);
      if (!Number.isNaN(scheduledAt.getTime())) {
        const channel = `mx-${order.productId}-${crypto.randomBytes(4).toString('hex')}`;
        await createBooking({
          userId: order.userId,
          mentorId: order.productId,
          mentorName: order.courseName.replace(/^Session with\s+/i, '') || 'Instructor',
          topic: order.booking.topic,
          scheduledAt,
          durationMinutes: order.booking.durationMinutes,
          channel,
          priceXAF: order.amountXAF,
          paid: true,
          platformXAF: order.platformXAF ?? order.amountXAF,
          instructorXAF: order.instructorXAF ?? 0,
          commissionRate: order.commissionRate ?? 1,
          isTrial: Boolean(order.isTrial),
          transactionId,
        });

        try {
          const { createNotification } = await import('@/lib/learn/notifications');
          await createNotification({
            userId: order.productId,
            title: 'New paid session booked',
            body: `${order.fullName} booked ${scheduledAt.toLocaleString('en-GB')}.${
              order.isTrial
                ? ' First lesson with this student - InTelleX keeps the trial fee.'
                : order.instructorXAF
                  ? ` You earn ${order.instructorXAF.toLocaleString()} XAF.`
                  : ''
            }`,
            href: '/dashboard/mentor',
            kind: 'system',
            data: { transactionId },
          });
        } catch (err) {
          console.error('fulfill session_booking notify failed:', err);
        }
      }
    }

    if (kind === 'cert_subscription' && order.userId) {
      const { activateCertSubscription } = await import('@/lib/learn/certSubscription');
      const plan = order.certPlan === 'yearly' ? 'yearly' : 'monthly';
      await activateCertSubscription({
        userId: order.userId,
        plan,
        priceXAF: order.amountXAF,
        transactionId,
      });
    }
  } catch (err) {
    console.error('fulfillPaidOrder failed:', err);
    // Leave fulfilled=false so notify/verify can retry.
    return order;
  }

  const { getDb } = await import('@/lib/repo');
  const db = await getDb();
  await db.collection('orders').updateOne(
    { transactionId },
    { $set: { fulfilled: true } },
  );

  return { ...order, fulfilled: true };
}

/** Mark paid (if needed) then fulfill access. */
export async function markPaidAndFulfill(
  transactionId: string,
  status: 'paid' | 'failed',
): Promise<Order | null> {
  const order = await getOrderByTransaction(transactionId);
  if (!order) return null;
  if (order.status === 'pending') {
    await updateOrderStatus(transactionId, status);
  }
  if (status === 'paid') {
    return fulfillPaidOrder(transactionId);
  }
  return getOrderByTransaction(transactionId);
}
