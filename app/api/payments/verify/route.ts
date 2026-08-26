import { NextRequest, NextResponse } from 'next/server';
import { getOrderByTransaction, updateOrderStatus } from '@/lib/repo';
import { getPaymentStatus, isPayunitConfigured } from '@/lib/payunit';
import { buildWhatsappLink, purchaseMessage } from '@/lib/whatsapp';
import { fulfillPaidOrder } from '@/lib/payments/fulfill';

/**
 * Confirms an in-app direct payment (or a sandbox mock).
 *
 * Live PayUnit orders are settled only when the gateway reports SUCCESS
 * (webhook or paymentstatus poll). The client cannot mark a live order paid.
 * Mock orders require `outcome=success` via /api/payments/mock-complete.
 */
export async function POST(req: NextRequest) {
  try {
    const { transactionId, outcome } = await req.json();
    if (!transactionId) {
      return NextResponse.json({ error: 'Missing transactionId' }, { status: 400 });
    }

    const order = await getOrderByTransaction(transactionId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    let status = order.status;

    if (status === 'pending') {
      if (outcome === 'cancel') {
        status = 'failed';
      } else if (order.gateway === 'payunit') {
        let gw: 'SUCCESS' | 'FAILED' | 'PENDING' = 'PENDING';
        if (isPayunitConfigured()) {
          try {
            gw = await getPaymentStatus(transactionId);
          } catch {
            gw = 'PENDING';
          }
        }
        if (gw === 'SUCCESS') status = 'paid';
        else if (gw === 'FAILED') status = 'failed';
      } else if (order.gateway === 'mock' && outcome === 'success') {
        status = 'paid';
      }
      if (status !== order.status) await updateOrderStatus(transactionId, status);
    }

    const paid = status === 'paid';
    if (paid) {
      await fulfillPaidOrder(transactionId);
    }

    const kind = order.kind || 'catalogue';
    const whatsappUrl =
      paid && kind === 'catalogue'
        ? buildWhatsappLink(
            purchaseMessage({
              fullName: order.fullName,
              courseName: order.courseName,
              amountXAF: order.amountXAF,
              paymentMethod: 'PayUnit (paid online)',
            }),
          )
        : null;

    const continueHref =
      kind === 'teacher_course' && order.productId
        ? `/dashboard/courses/instructor/${order.productId}`
        : kind === 'session_booking'
          ? '/dashboard/mentorship'
          : kind === 'cert_subscription'
            ? '/dashboard/courses'
            : '/courses';

    return NextResponse.json({
      status,
      paid,
      courseName: order.courseName,
      amountXAF: order.amountXAF,
      fullName: order.fullName,
      whatsappUrl,
      kind,
      continueHref,
      isTrial: Boolean(order.isTrial),
    });
  } catch (error) {
    console.error('Payment verify error:', error);
    return NextResponse.json({ error: 'Could not verify payment' }, { status: 500 });
  }
}
