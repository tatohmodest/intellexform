import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'intellex_session';

/**
 * - Signed-in visitors hitting `/` go to the dashboard (marketing home is for guests).
 * - Signed-out visitors hitting `/dashboard` go to login.
 * - Other public pages stay reachable while authenticated.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === '/' && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (pathname.startsWith('/dashboard')) {
    if (!hasSession) {
      const login = new URL('/login', req.url);
      login.searchParams.set('next', pathname);
      return NextResponse.redirect(login);
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-pathname', pathname);
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
