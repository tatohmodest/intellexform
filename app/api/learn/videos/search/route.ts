import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { searchVideoHall } from '@/lib/learn/videoHall';
import { detectLocale, LOCALE_COOKIE } from '@/lib/i18n/locale';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const url = new URL(req.url);
  const q = url.searchParams.get('q') || '';
  const pageToken = url.searchParams.get('pageToken') || '';
  if (!q.trim()) return NextResponse.json({ videos: [], source: 'local', nextPageToken: null });
  const locale = detectLocale({
    cookie: req.cookies.get(LOCALE_COOKIE)?.value,
    acceptLanguage: req.headers.get('accept-language'),
  });
  const result = await searchVideoHall(q, {
    pageToken: pageToken.trim() || undefined,
    locale,
  });
  return NextResponse.json(result);
}
