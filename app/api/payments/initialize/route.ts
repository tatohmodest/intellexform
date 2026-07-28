import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getCourseBySlug } from '@/lib/repo';
import { initializeCheckout, isPayunitConfigured, resolveCallbackBase } from '@/lib/payunit';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import {
  countPaidPurchases,
  findMentor,
  getInstitution,
  getTeacherCourse,
  isEnrolledInCourse,
  listUserInstitutions,
} from '@/lib/learn/ecosystem';
import { computeCommission } from '@/lib/learn/commission';
import type { OrderKind } from '@/lib/types';

function newTransactionId() {
  return `${Math.floor(Math.random() * 1_000_000_000)}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const kind = (body.kind as OrderKind | undefined) || 'catalogue';
    const origin = req.nextUrl.origin;
    const callbackBase = resolveCallbackBase(origin);
    const useLive = isPayunitConfigured() && Boolean(callbackBase);
    const gateway = useLive ? 'payunit' : 'mock';
    const transactionId = newTransactionId();

    // ── Catalogue course (legacy public checkout) ───────────────────────────
    if (kind === 'catalogue' || (!body.kind && body.courseSlug)) {
      const { courseSlug, fullName, whatsapp, email, phone } = body;
      if (!courseSlug || !fullName || !whatsapp) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const course = await getCourseBySlug(courseSlug);
      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }

      await createOrder({
        fullName,
        whatsapp,
        email: email || '',
        phone: phone || '',
        courseId: course.id,
        courseSlug: course.slug,
        courseName: course.name,
        amountXAF: course.currentPrice,
        paymentMethod: 'PayUnit',
        gateway,
        transactionId,
        status: 'pending',
        createdAt: new Date(),
        paidAt: null,
        kind: 'catalogue',
      });

      const transactionUrl = await buildCheckoutUrl({
        useLive,
        callbackBase,
        origin,
        transactionId,
        amount: course.currentPrice,
        productName: course.name,
        productImage: course.courseImage || undefined,
        about: course.shortDescription || `Intellex - ${course.name}`,
        meta: { courseSlug: course.slug, fullName, whatsapp, kind: 'catalogue' },
      });

      return NextResponse.json({ success: true, transactionId, transactionUrl }, { status: 201 });
    }

    // Teacher courses and session bookings require a signed-in student.
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    const learner = await getLearner(session.uid);
    const fullName = learner?.name || session.name || body.fullName || 'Student';
    const email = learner?.email || session.email || body.email || '';
    const whatsapp = String(body.whatsapp || '').trim() || '000000000';
    const phone = String(body.phone || '').trim();

    // ── Teacher course purchase ─────────────────────────────────────────────
    if (kind === 'teacher_course') {
      const teacherCourseId = String(body.teacherCourseId || body.productId || '');
      const course = await getTeacherCourse(teacherCourseId);
      if (!course || !course.published) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }
      if (course.audience === 'allocated') {
        return NextResponse.json({ error: 'instructor_managed' }, { status: 403 });
      }

      // Campus courses stay free unless the institution allows instructor sales.
      if (course.institutionSlug) {
        const inst = await getInstitution(course.institutionSlug);
        if (!inst?.allowInstructorSales || !(course.priceXAF ?? 0)) {
          return NextResponse.json(
            { error: 'Campus courses are free on InTelleX. Ask your instructor to add you.' },
            { status: 403 },
          );
        }
      }

      const price = Math.max(0, course.priceXAF ?? 0);
      if (price <= 0) {
        return NextResponse.json({ error: 'free_course' }, { status: 400 });
      }
      if (await isEnrolledInCourse(course.id, session.uid)) {
        return NextResponse.json({ error: 'already_enrolled' }, { status: 409 });
      }

      const instructorId = course.instructorId || course.authorId;
      const prior = await countPaidPurchases(instructorId, session.uid);
      const breakdown = computeCommission(price, prior);

      await createOrder({
        fullName,
        whatsapp,
        email,
        phone,
        courseId: course.id,
        courseSlug: course.id,
        courseName: course.title,
        amountXAF: breakdown.priceXAF,
        paymentMethod: 'PayUnit',
        gateway,
        transactionId,
        status: 'pending',
        createdAt: new Date(),
        paidAt: null,
        kind: 'teacher_course',
        userId: session.uid,
        productId: course.id,
        instructorId,
        platformXAF: breakdown.platformXAF,
        instructorXAF: breakdown.instructorXAF,
        commissionRate: breakdown.rate,
        isTrial: breakdown.isTrial,
        fulfilled: false,
      });

      const transactionUrl = await buildCheckoutUrl({
        useLive,
        callbackBase,
        origin,
        transactionId,
        amount: breakdown.priceXAF,
        productName: course.title,
        productImage: course.coverUrl || undefined,
        about: course.subtitle || course.description || course.title,
        meta: {
          kind: 'teacher_course',
          teacherCourseId: course.id,
          userId: session.uid,
          isTrial: breakdown.isTrial,
        },
      });

      return NextResponse.json(
        { success: true, transactionId, transactionUrl, breakdown },
        { status: 201 },
      );
    }

    // ── Mentorship session booking ──────────────────────────────────────────
    if (kind === 'session_booking') {
      const mentorId = String(body.mentorId || body.productId || '');
      const mentor = await findMentor(mentorId);
      if (!mentor) {
        return NextResponse.json({ error: 'unknown_mentor' }, { status: 400 });
      }

      // Institution instructors teaching campus students are not paid on-platform.
      const campuses = await listUserInstitutions(mentor.id);
      const studentCampuses = await listUserInstitutions(session.uid);
      const sharedCampus = campuses.find((c) =>
        studentCampuses.some((s) => s.slug === c.slug),
      );
      if (sharedCampus && ['instructor', 'owner', 'admin'].includes(sharedCampus.role)) {
        return NextResponse.json(
          {
            error:
              'Campus teaching is not billed on InTelleX. Your institution schedules and pays instructors off-platform.',
          },
          { status: 403 },
        );
      }

      const scheduledAt = new Date(String(body.scheduledAt ?? ''));
      if (Number.isNaN(scheduledAt.getTime()) || scheduledAt.getTime() < Date.now()) {
        return NextResponse.json({ error: 'invalid_time' }, { status: 400 });
      }
      const topic =
        String(body.topic ?? '').trim().slice(0, 140) || `Mentorship with ${mentor.name}`;
      const price = Math.max(0, mentor.priceXAF || 0);
      if (price <= 0) {
        return NextResponse.json({ error: 'free_session' }, { status: 400 });
      }

      const prior = await countPaidPurchases(mentor.id, session.uid);
      const breakdown = computeCommission(price, prior);

      await createOrder({
        fullName,
        whatsapp,
        email,
        phone,
        courseId: mentor.id,
        courseSlug: `session-${mentor.id}`,
        courseName: `Session with ${mentor.name}`,
        amountXAF: breakdown.priceXAF,
        paymentMethod: 'PayUnit',
        gateway,
        transactionId,
        status: 'pending',
        createdAt: new Date(),
        paidAt: null,
        kind: 'session_booking',
        userId: session.uid,
        productId: mentor.id,
        instructorId: mentor.id,
        platformXAF: breakdown.platformXAF,
        instructorXAF: breakdown.instructorXAF,
        commissionRate: breakdown.rate,
        isTrial: breakdown.isTrial,
        fulfilled: false,
        booking: {
          scheduledAt: scheduledAt.toISOString(),
          topic,
          durationMinutes: mentor.sessionMinutes,
        },
      });

      const transactionUrl = await buildCheckoutUrl({
        useLive,
        callbackBase,
        origin,
        transactionId,
        amount: breakdown.priceXAF,
        productName: `Session with ${mentor.name}`,
        about: topic,
        meta: {
          kind: 'session_booking',
          mentorId: mentor.id,
          userId: session.uid,
          scheduledAt: scheduledAt.toISOString(),
          isTrial: breakdown.isTrial,
        },
      });

      return NextResponse.json(
        { success: true, transactionId, transactionUrl, breakdown },
        { status: 201 },
      );
    }

    return NextResponse.json({ error: 'Unknown payment kind' }, { status: 400 });
  } catch (error) {
    console.error('Payment initialize error:', error);
    return NextResponse.json({ error: 'Could not start payment' }, { status: 500 });
  }
}

async function buildCheckoutUrl(opts: {
  useLive: boolean;
  callbackBase: string | null;
  origin: string;
  transactionId: string;
  amount: number;
  productName: string;
  productImage?: string;
  about?: string;
  meta?: Record<string, unknown>;
}): Promise<string> {
  if (opts.useLive && opts.callbackBase) {
    const successUrl = `${opts.callbackBase}/checkout/return?transaction_id=${opts.transactionId}&outcome=success`;
    const cancelUrl = `${opts.callbackBase}/checkout/return?transaction_id=${opts.transactionId}&outcome=cancel`;
    const notifyUrl = `${opts.callbackBase}/api/payments/notify`;
    const { redirectUrl } = await initializeCheckout({
      amount: opts.amount,
      currency: 'XAF',
      transactionId: opts.transactionId,
      successUrl,
      cancelUrl,
      notifyUrl,
      productName: opts.productName,
      productImage: opts.productImage,
      about: opts.about,
      meta: opts.meta,
    });
    return redirectUrl;
  }

  const params = new URLSearchParams({
    transaction_id: opts.transactionId,
    course: opts.productName,
    amount: String(opts.amount),
  });
  return `${opts.origin}/checkout/mock?${params.toString()}`;
}
