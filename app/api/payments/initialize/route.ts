import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getCourseBySlug } from '@/lib/repo';
import { initializePayment, isPayunitConfigured } from '@/lib/payunit';

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

    const transactionId = `intx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const configured = isPayunitConfigured();

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
      gateway: configured ? 'payunit' : 'mock',
      transactionId,
      status: 'pending',
      createdAt: new Date(),
      paidAt: null,
    });

    const origin = req.nextUrl.origin;
    const returnUrl = `${origin}/checkout/return?transaction_id=${transactionId}`;
    const notifyUrl = `${origin}/api/payments/notify`;

    let transactionUrl: string;
    if (configured) {
      const init = await initializePayment({
        amount: course.currentPrice,
        currency: 'XAF',
        transactionId,
        returnUrl,
        notifyUrl,
        name: fullName,
        description: `Intellex — ${course.name}`,
      });
      transactionUrl = init.transactionUrl;
    } else {
      // Fallback: local mock checkout so the flow works without PayUnit keys.
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
