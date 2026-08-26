import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getCourseBySlug, updateOrderStatus } from '@/lib/repo';
import {
  cleanCameroonPhone,
  generatePayUnitTransactionId,
  isPayunitConfigured,
  isValidCameroonMomo,
  makeDirectPayment,
  parsePayOperator,
  resolveCallbackBase,
  type PayOperator,
} from '@/lib/payunit';
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

function parseCheckoutContact(body: Record<string, unknown>): {
  operator: PayOperator;
  phone: string;
} | { error: string; status: number } {
  const operator = parsePayOperator(body.operator || body.paymentOperator);
  if (!operator) {
    return { error: 'Choose MTN MoMo or Orange Money.', status: 400 };
  }
  const phone = cleanCameroonPhone(String(body.phone || body.whatsapp || ''));
  if (!isValidCameroonMomo(phone)) {
    return { error: 'Enter a valid Cameroon mobile number (9 digits, starting with 6).', status: 400 };
  }
  return { operator, phone };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const kind = (body.kind as OrderKind | undefined) || 'catalogue';
    const origin = req.nextUrl.origin;
    const callbackBase = resolveCallbackBase(origin);
    const useLive = isPayunitConfigured() && Boolean(callbackBase);
    const gateway = useLive ? 'payunit' : 'mock';
    const contact = parseCheckoutContact(body);
    if ('error' in contact) {
      return NextResponse.json({ error: contact.error }, { status: contact.status });
    }
    const { operator, phone } = contact;
    const transactionId = generatePayUnitTransactionId('INTX', operator);

    // ── Catalogue course (individual course checkout) ───────────────────────
    if (kind === 'catalogue' || (!body.kind && body.courseSlug)) {
      const session = getSessionUser();
      const { courseSlug, whatsapp: inputWhatsapp, fullName: inputName, email: inputEmail } = body;
      const userId = session?.uid || body.userId || null;

      if (!courseSlug) {
        return NextResponse.json({ error: 'Missing course slug' }, { status: 400 });
      }

      const course = await getCourseBySlug(courseSlug);
      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }

      const fullName = session?.name || inputName || 'Learner';
      const email = session?.email || inputEmail || '';
      const whatsapp = inputWhatsapp || contact.phone;

      await createOrder({
        fullName,
        whatsapp,
        email,
        phone: contact.phone,
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
        userId: userId || undefined,
        fulfilled: false,
      });

      const pay = await startDirectPay({
        useLive,
        callbackBase,
        origin,
        transactionId,
        amount: course.currentPrice,
        description: course.name,
        phone: contact.phone,
        operator,
      });
      if (!pay.ok) {
        await updateOrderStatus(transactionId, 'failed').catch(() => {});
        return NextResponse.json({ error: pay.error }, { status: 502 });
      }

      return NextResponse.json(
        { success: true, transactionId, direct: true, mock: pay.mock, message: pay.message },
        { status: 201 },
      );
    }

    // Teacher courses and session bookings require a signed-in student.
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    const learner = await getLearner(session.uid);
    const fullName = learner?.name || session.name || body.fullName || 'Student';
    const email = learner?.email || session.email || body.email || '';
    const whatsapp = String(body.whatsapp || '').trim() || contact.phone;

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
        phone: contact.phone,
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

      const pay = await startDirectPay({
        useLive,
        callbackBase,
        origin,
        transactionId,
        amount: breakdown.priceXAF,
        description: course.title,
        phone: contact.phone,
        operator,
      });
      if (!pay.ok) {
        await updateOrderStatus(transactionId, 'failed').catch(() => {});
        return NextResponse.json({ error: pay.error }, { status: 502 });
      }

      return NextResponse.json(
        { success: true, transactionId, direct: true, mock: pay.mock, message: pay.message, breakdown },
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
        phone: contact.phone,
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

      const pay = await startDirectPay({
        useLive,
        callbackBase,
        origin,
        transactionId,
        amount: breakdown.priceXAF,
        description: `Session with ${mentor.name}`,
        phone: contact.phone,
        operator,
      });
      if (!pay.ok) {
        await updateOrderStatus(transactionId, 'failed').catch(() => {});
        return NextResponse.json({ error: pay.error }, { status: 502 });
      }

      return NextResponse.json(
        { success: true, transactionId, direct: true, mock: pay.mock, message: pay.message, breakdown },
        { status: 201 },
      );
    }

    // ── Certification subscription (Intermediate → Pro on free tracks) ──────
    if (kind === 'cert_subscription') {
      const { priceForCertPlan } = await import('@/lib/learn/certSubscription');
      const planRaw = String(body.plan || 'monthly').toLowerCase();
      const plan = planRaw === 'yearly' ? 'yearly' as const : 'monthly' as const;
      const amount = priceForCertPlan(plan);
      const productName =
        plan === 'yearly'
          ? 'InTelleX Student membership · yearly (10% off)'
          : 'InTelleX Student membership · monthly';

      await createOrder({
        fullName,
        whatsapp,
        email,
        phone: contact.phone,
        courseId: `cert-${plan}`,
        courseSlug: `cert-subscription-${plan}`,
        courseName: productName,
        amountXAF: amount,
        paymentMethod: 'PayUnit',
        gateway,
        transactionId,
        status: 'pending',
        createdAt: new Date(),
        paidAt: null,
        kind: 'cert_subscription',
        userId: session.uid,
        productId: plan,
        certPlan: plan,
        fulfilled: false,
      });

      const pay = await startDirectPay({
        useLive,
        callbackBase,
        origin,
        transactionId,
        amount,
        description: productName,
        phone: contact.phone,
        operator,
      });
      if (!pay.ok) {
        await updateOrderStatus(transactionId, 'failed').catch(() => {});
        return NextResponse.json({ error: pay.error }, { status: 502 });
      }

      return NextResponse.json(
        {
          success: true,
          transactionId,
          direct: true,
          mock: pay.mock,
          message: pay.message,
          plan,
          amountXAF: amount,
        },
        { status: 201 },
      );
    }

    return NextResponse.json({ error: 'Unknown payment kind' }, { status: 400 });
  } catch (error) {
    console.error('Payment initialize error:', error);
    return NextResponse.json({ error: 'Could not start payment' }, { status: 500 });
  }
}

async function startDirectPay(opts: {
  useLive: boolean;
  callbackBase: string | null;
  origin: string;
  transactionId: string;
  amount: number;
  description: string;
  phone: string;
  operator: PayOperator;
}): Promise<{ ok: true; mock?: boolean; message: string } | { ok: false; error: string }> {
  if (opts.useLive && opts.callbackBase) {
    try {
      const result = await makeDirectPayment({
        amount: opts.amount,
        transactionId: opts.transactionId,
        phoneNumber: opts.phone,
        paymentOperator: opts.operator,
        returnUrl: `${opts.callbackBase}/checkout/return?transaction_id=${opts.transactionId}&outcome=pending`,
        notifyUrl: `${opts.callbackBase}/api/payments/notify`,
        description: opts.description,
      });
      if (!result.success) {
        return { ok: false, error: result.message || 'Could not send the payment prompt.' };
      }
      return { ok: true, message: result.message };
    } catch (err) {
      console.error('PayUnit direct pay error:', err);
      return { ok: false, error: 'Could not reach PayUnit. Try again in a moment.' };
    }
  }

  return {
    ok: true,
    mock: true,
    message: 'Sandbox checkout — confirm the payment on this page.',
  };
}
