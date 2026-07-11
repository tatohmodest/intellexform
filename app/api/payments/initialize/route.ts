import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getCourseBySlug } from '@/lib/repo';
import { initializeCheckout, isPayunitConfigured, resolveCallbackBase } from '@/lib/payunit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseSlug, fullName, whatsapp, email, phone } = body;

    if (!courseSlug || !fullName || !whatsapp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const course = await getCourseBySlug(courseSlug);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const transactionId = `${Math.floor(Math.random() * 1_000_000_000)}`;
    const origin = req.nextUrl.origin;

    // PayUnit needs public HTTPS callbacks; falls back to sandbox on localhost.
    const callbackBase = resolveCallbackBase(origin);
    const useLive = isPayunitConfigured() && Boolean(callbackBase);
    const gateway = useLive ? 'payunit' : 'mock';

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
    });

    let transactionUrl: string;
    if (useLive && callbackBase) {
      const successUrl = `${callbackBase}/checkout/return?transaction_id=${transactionId}&outcome=success`;
      const cancelUrl = `${callbackBase}/checkout/return?transaction_id=${transactionId}&outcome=cancel`;
      const notifyUrl = `${callbackBase}/api/payments/notify`;

      const { redirectUrl } = await initializeCheckout({
        amount: course.currentPrice,
        currency: 'XAF',
        transactionId,
        successUrl,
        cancelUrl,
        notifyUrl,
        productName: course.name,
        productImage: course.courseImage || undefined,
        about: course.shortDescription || `Intellex — ${course.name}`,
        meta: { courseSlug: course.slug, fullName, whatsapp },
      });
      transactionUrl = redirectUrl;
    } else {
      // Local sandbox checkout (no live keys / no public HTTPS callback URL).
      const params = new URLSearchParams({
        transaction_id: transactionId,
        course: course.name,
        amount: String(course.currentPrice),
      });
      transactionUrl = `${origin}/checkout/mock?${params.toString()}`;
    }

    return NextResponse.json({ success: true, transactionId, transactionUrl }, { status: 201 });
  } catch (error) {
    console.error('Payment initialize error:', error);
    return NextResponse.json({ error: 'Could not start payment' }, { status: 500 });
  }
}
