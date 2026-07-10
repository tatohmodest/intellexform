import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getCourseBySlug } from '@/lib/repo';
import { buildWhatsappLink, purchaseMessage } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, whatsapp, email, courseSlug, paymentMethod } = body;

    if (!fullName || !whatsapp || !courseSlug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const course = await getCourseBySlug(courseSlug);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const method = paymentMethod || 'MTN MoMo';

    await createOrder({
      fullName,
      whatsapp,
      email: email || '',
      courseId: course.id,
      courseName: course.name,
      amountXAF: course.currentPrice,
      paymentMethod: method,
      status: 'pending',
      createdAt: new Date(),
    });

    const text = purchaseMessage({
      fullName,
      courseName: course.name,
      amountXAF: course.currentPrice,
      paymentMethod: method,
    });
    const whatsappUrl = buildWhatsappLink(text);

    return NextResponse.json({ success: true, whatsappUrl }, { status: 201 });
  } catch (error) {
    console.error('Order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
