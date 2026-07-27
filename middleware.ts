import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'intellex_session';

/**
 * Fast redirect for signed-out visitors hitting the learning dashboard.
 * Also forwards pathname so the dashboard layout can gate onboarding.
 */
export function middleware(req: NextRequest) {
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);
  if (!hasSession) {
    const login = new URL('/login', req.url);
    login.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', req.nextUrl.pathname);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
