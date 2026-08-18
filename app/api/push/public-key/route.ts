import { NextResponse } from 'next/server';
import { getVapidKeys } from '@/lib/push/webPush';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const keys = await getVapidKeys();
    return NextResponse.json({ publicKey: keys.publicKey });
  } catch (err) {
    console.error('[push] public-key', err);
    return NextResponse.json({ error: 'push unavailable' }, { status: 503 });
  }
}
