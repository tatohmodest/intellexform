import { NextRequest, NextResponse } from 'next/server';
import { getOrderByTransaction, updateOrderStatus } from '@/lib/repo';
import { fulfillPaidOrder } from '@/lib/payments/fulfill';

/**
 * Mock payment completion - only valid for orders created against the sandbox
 * checkout (gateway === 'mock'). Live PayUnit orders are settled via the gateway.
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
    if (order.gateway !== 'mock') {
      return NextResponse.json({ error: 'Mock not allowed for live PayUnit orders' }, { status: 400 });
    }
    const status = outcome === 'success' ? 'paid' : 'failed';
    await updateOrderStatus(transactionId, status);
    if (status === 'paid') {
      await fulfillPaidOrder(transactionId);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mock complete error:', error);
    return NextResponse.json({ error: 'Could not complete mock payment' }, { status: 500 });
  }
}
