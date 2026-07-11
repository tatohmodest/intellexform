import { NextRequest, NextResponse } from 'next/server';
import { getOrderByTransaction, updateOrderStatus } from '@/lib/repo';
import { extractTransactionId, getPaymentStatus, isPayunitConfigured } from '@/lib/payunit';

/**
 * PayUnit server-to-server notification (notify_url). PayUnit posts the
 * transaction reference here; we re-verify with the gateway and persist status.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const transactionId =
      extractTransactionId(body) || req.nextUrl.searchParams.get('transaction_id');

    if (transactionId && isPayunitConfigured()) {
      const order = await getOrderByTransaction(transactionId);
      if (order && order.status === 'pending') {
        const gwStatus = await getPaymentStatus(transactionId);
        if (gwStatus === 'SUCCESS') await updateOrderStatus(transactionId, 'paid');
        else if (gwStatus === 'FAILED') await updateOrderStatus(transactionId, 'failed');
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Payment notify error:', error);
    return NextResponse.json({ received: false }, { status: 200 });
  }
}
