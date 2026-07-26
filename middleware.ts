import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'intellex_session';

/**
 * Fast redirect for signed-out visitors hitting the learning dashboard.
 * (Cryptographic verification of the session happens server-side in the
 * dashboard layout and API routes — this is just the front gate.)
 */
export function middleware(req: NextRequest) {
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);
  if (!hasSession) {
    const login = new URL('/login', req.url);
    login.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
