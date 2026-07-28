import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  listNotifications,
  markNotificationsRead,
  unreadNotificationCount,
} from '@/lib/learn/notifications';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const [notifications, unread] = await Promise.all([
    listNotifications(session.uid),
    unreadNotificationCount(session.uid),
  ]);
  return NextResponse.json({ notifications, unread });
}

export async function PATCH(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const ids = Array.isArray(body.ids) ? body.ids.map(String) : undefined;
  const markAll = Boolean(body.markAll);
  await markNotificationsRead(session.uid, markAll ? undefined : ids);
  const unread = await unreadNotificationCount(session.uid);
  return NextResponse.json({ ok: true, unread });
}
