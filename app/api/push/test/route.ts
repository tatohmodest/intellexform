import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { sendPushToUser } from '@/lib/push/webPush';

export const dynamic = 'force-dynamic';

export async function POST() {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const sent = await sendPushToUser(session.uid, {
    title: 'InTelleX alerts are on',
    body: 'You will get a pop-up for messages, assignments, classes, and campus activity.',
    url: '/dashboard/notifications',
    tag: `intellex-test-${session.uid}`,
    kind: 'system',
    category: 'system',
  });

  return NextResponse.json({ ok: true, sent });
}
