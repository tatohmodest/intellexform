import { NextRequest, NextResponse } from 'next/server';
import { getOrderByTransaction, updateOrderStatus } from '@/lib/repo';
import { isPayunitConfigured } from '@/lib/payunit';

/**
 * Mock payment completion — only active when PayUnit is NOT configured. Lets the
 * local mock checkout mark an order as paid/failed so the flow can be tested.
 */
export async function POST(req: NextRequest) {
  if (isPayunitConfigured()) {
    return NextResponse.json({ error: 'Mock disabled when PayUnit is configured' }, { status: 400 });
  }
  try {
    const { transactionId, outcome } = await req.json();
    if (!transactionId) {
      return NextResponse.json({ error: 'Missing transactionId' }, { status: 400 });
    }
    const order = await getOrderByTransaction(transactionId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    await updateOrderStatus(transactionId, outcome === 'success' ? 'paid' : 'failed');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mock complete error:', error);
    return NextResponse.json({ error: 'Could not complete mock payment' }, { status: 500 });
  }
}
