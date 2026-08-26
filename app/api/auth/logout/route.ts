import { NextRequest, NextResponse } from 'next/server';
import { expireAuthCookies } from '@/lib/auth/cookies';

export const dynamic = 'force-dynamic';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  return expireAuthCookies(res);
}

/** GET variant so a plain link can log out too. */
export async function GET(req: NextRequest) {
  const next = req.nextUrl.searchParams.get('next') || '/';
  const dest = next.startsWith('/') && !next.startsWith('//') ? next : '/';
  const res = NextResponse.redirect(new URL(dest, req.url));
  return expireAuthCookies(res);
}
