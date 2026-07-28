import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'intellex_session';

function hostnameOf(req: NextRequest): string {
  const raw =
    req.headers.get('x-forwarded-host') ||
    req.headers.get('host') ||
    req.nextUrl.hostname ||
    '';
  return raw.split(':')[0].toLowerCase();
}

function isLikelyPlatformHost(host: string): boolean {
  if (!host || host === 'localhost' || host === '127.0.0.1') return true;
  if (host.endsWith('.vercel.app')) return true;
  const configured = [
    process.env.APP_PUBLIC_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_URL,
    ...(process.env.PLATFORM_HOSTS || '').split(','),
  ]
    .filter(Boolean)
    .map((h) =>
      String(h)
        .replace(/^https?:\/\//, '')
        .replace(/\/$/, '')
        .split(':')[0]
        .toLowerCase(),
    );
  return configured.includes(host);
}

/**
 * - Protects /dashboard when signed out
 * - On custom campus hosts, rewrite bare / (and unknown roots) to the gateway
 *   so InTelleX can map the domain → institution interface
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = hostnameOf(req);
  const customHost = Boolean(host) && !isLikelyPlatformHost(host);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', pathname);
  if (customHost) {
    requestHeaders.set('x-campus-host', host);
  }

  // Custom domain landing → campus gateway (resolves Host → institution).
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

  if (pathname.startsWith('/dashboard')) {
    const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);
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
