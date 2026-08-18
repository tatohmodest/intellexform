import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  NAV_SEEN_HREFS,
  getNavCounts,
  markNavSeen,
  type NavSeenHref,
} from '@/lib/learn/navCounts';
import { dispatchCalendarReminders } from '@/lib/learn/calendarReminders';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  await dispatchCalendarReminders(session.uid).catch(() => 0);
  const counts = await getNavCounts(session.uid);
  return NextResponse.json({ counts });
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const href = String(body.href || '').trim();
  if (!NAV_SEEN_HREFS.includes(href as NavSeenHref)) {
    return NextResponse.json({ ok: true });
  }
  await markNavSeen(session.uid, href);
  const counts = await getNavCounts(session.uid);
  return NextResponse.json({ ok: true, counts });
}
