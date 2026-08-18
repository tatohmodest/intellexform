import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  listNotifications,
  markNotificationsRead,
  unreadNotificationCount,
  type NotificationCategory,
} from '@/lib/learn/notifications';
import { dispatchCalendarReminders } from '@/lib/learn/calendarReminders';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get('page') || '1'));
  const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get('pageSize') || '20')));
  const categoryParam = url.searchParams.get('category') || 'all';
  const category =
    categoryParam === 'all' ||
    categoryParam === 'academic' ||
    categoryParam === 'social' ||
    categoryParam === 'institution' ||
    categoryParam === 'system'
      ? (categoryParam as NotificationCategory | 'all')
      : 'all';

  await dispatchCalendarReminders(session.uid).catch(() => 0);

  const [notifications, unread] = await Promise.all([
    listNotifications(session.uid, pageSize, { page, category }),
    unreadNotificationCount(session.uid),
  ]);
  return NextResponse.json({ notifications, unread, page, pageSize, category });
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
