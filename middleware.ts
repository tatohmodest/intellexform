import { NextRequest, NextResponse } from 'next/server';
import { isPlatformHostname } from '@/lib/platformHosts';

const SESSION_COOKIE = 'intellex_session';

function hostnameOf(req: NextRequest): string {
  const raw =
    req.headers.get('x-forwarded-host') ||
    req.headers.get('host') ||
    req.nextUrl.hostname ||
    '';
  return raw.split(':')[0].toLowerCase();
}

/**
 * - Custom campus hosts rewrite landing paths to the campus gateway
 * - Signed-in visitors on the platform host hitting `/` go to the dashboard
 * - Signed-out visitors hitting `/dashboard` go to login
 * - Other public pages stay reachable while authenticated
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = hostnameOf(req);
  const customHost = Boolean(host) && !isPlatformHostname(host);
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', pathname);
  if (customHost) {
    requestHeaders.set('x-campus-host', host);
  }

  // Custom domain landing → campus gateway (resolves Host → institution).
  // Never run this for intellex.loopingbinary.com — that is the main app.
  if (
    customHost &&
    (pathname === '/' ||
      pathname === '/dashboard' ||
      pathname === '/dashboard/institutions')
  ) {
    const url = req.nextUrl.clone();
    url.pathname = '/campus-gateway';
    return NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });
  }

  // Platform marketing home is for guests only.
  if (pathname === '/' && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (pathname.startsWith('/dashboard')) {
    if (!hasSession) {
      const login = new URL('/login', req.url);
      login.searchParams.set('next', pathname);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/campus-gateway'],
};
