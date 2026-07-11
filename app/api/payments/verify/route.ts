import { NextRequest, NextResponse } from 'next/server';
import { getOrderByTransaction, updateOrderStatus } from '@/lib/repo';
import { getPaymentStatus, isPayunitConfigured } from '@/lib/payunit';
import { buildWhatsappLink, purchaseMessage } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const { transactionId } = await req.json();
    if (!transactionId) {
      return NextResponse.json({ error: 'Missing transactionId' }, { status: 400 });
    }

    const order = await getOrderByTransaction(transactionId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    let status = order.status;

    // If not already resolved and this is a live PayUnit order, ask the gateway.
    if (status === 'pending' && order.gateway === 'payunit' && isPayunitConfigured()) {
      const gwStatus = await getPaymentStatus(transactionId);
      if (gwStatus === 'SUCCESS') status = 'paid';
      else if (gwStatus === 'FAILED') status = 'failed';
      if (status !== order.status) await updateOrderStatus(transactionId, status);
    }

    const paid = status === 'paid';
    const whatsappUrl = paid
      ? buildWhatsappLink(
          purchaseMessage({
            fullName: order.fullName,
            courseName: order.courseName,
            amountXAF: order.amountXAF,
            paymentMethod: 'PayUnit (paid online)',
          }),
        )
      : null;

    return NextResponse.json({
      status,
      paid,
      courseName: order.courseName,
      amountXAF: order.amountXAF,
      fullName: order.fullName,
      whatsappUrl,
    });
  } catch (error) {
    console.error('Payment verify error:', error);
    return NextResponse.json({ error: 'Could not verify payment' }, { status: 500 });
  }
}
