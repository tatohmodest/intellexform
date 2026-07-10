import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/repo';
import { getPaymentStatus, isPayunitConfigured } from '@/lib/payunit';

/**
 * PayUnit server-to-server notification (notify_url). PayUnit posts the
 * transaction reference here; we re-verify with the gateway and persist status.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const transactionId =
      body?.transaction_id || body?.transactionId || req.nextUrl.searchParams.get('transaction_id');

    if (transactionId && isPayunitConfigured()) {
      const gwStatus = await getPaymentStatus(transactionId);
      if (gwStatus === 'SUCCESS') await updateOrderStatus(transactionId, 'paid');
      else if (gwStatus === 'FAILED') await updateOrderStatus(transactionId, 'failed');
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Payment notify error:', error);
    return NextResponse.json({ received: false }, { status: 200 });
  }
}
