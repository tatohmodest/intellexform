import { NextRequest, NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole } from 'agora-token';
import { getSessionUser } from '@/lib/auth/getUser';

export const dynamic = 'force-dynamic';

/**
 * POST /api/learn/agora-token  { channel: string }
 * Issues a short-lived Agora RTC token for the signed-in learner.
 */
export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const channel = String(body.channel ?? '').trim();
  if (!channel || !/^[\w-]{1,64}$/.test(channel)) {
    return NextResponse.json({ error: 'invalid_channel' }, { status: 400 });
  }

  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
  if (!appId) {
    return NextResponse.json(
      { error: 'agora_not_configured', message: 'NEXT_PUBLIC_AGORA_APP_ID is not set' },
      { status: 503 },
    );
  }

  // Deterministic numeric uid derived from the LB account id.
  let uid = 0;
  for (const ch of user.uid) uid = (uid * 31 + ch.charCodeAt(0)) >>> 0;
  uid = (uid % 1_000_000_000) + 1;

  // Projects without a certificate (App ID auth / testing mode) join tokenless.
  if (!appCertificate) {
    return NextResponse.json({ appId, channel, uid, token: null });
  }

  const expireSeconds = 2 * 60 * 60; // 2h — covers the longest session
  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channel,
    uid,
    RtcRole.PUBLISHER,
    expireSeconds,
    expireSeconds,
  );
  return NextResponse.json({ appId, channel, uid, token });
}
