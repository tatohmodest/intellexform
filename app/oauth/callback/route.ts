import { NextRequest, NextResponse } from 'next/server';
import { expireAuthCookies } from '@/lib/auth/cookies';

export const dynamic = 'force-dynamic';

/**
 * Legacy LoopingBinary OAuth callback — auth is now email/password.
 * Keep the route so old bookmarks do not 404; send people to the login form.
 */
export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/login', req.url));
  return expireAuthCookies(res);
}
