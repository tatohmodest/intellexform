import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  deletePushSubscription,
  savePushSubscription,
  userHasPushSubscription,
} from '@/lib/push/webPush';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const subscribed = await userHasPushSubscription(session.uid);
  return NextResponse.json({ subscribed });
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const endpoint = String(body.endpoint || '').trim();
  const p256dh = String(body.keys?.p256dh || '').trim();
  const auth = String(body.keys?.auth || '').trim();
  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ error: 'invalid subscription' }, { status: 400 });
  }
  if (!endpoint.startsWith('https://')) {
    return NextResponse.json({ error: 'invalid endpoint' }, { status: 400 });
  }

  await savePushSubscription({
    userId: session.uid,
    endpoint,
    keys: { p256dh, auth },
    userAgent: req.headers.get('user-agent') || undefined,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const endpoint = String(body.endpoint || '').trim();
  if (!endpoint) {
    return NextResponse.json({ error: 'endpoint required' }, { status: 400 });
  }
  await deletePushSubscription(endpoint, session.uid);
  return NextResponse.json({ ok: true });
}
