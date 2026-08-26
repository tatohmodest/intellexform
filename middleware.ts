import { NextRequest, NextResponse } from 'next/server';
import { isPlatformHostname } from '@/lib/platformHosts';
import { localeFromAcceptLanguage, LOCALE_COOKIE } from '@/lib/i18n/locale';
import {
  expireAuthCookies,
  SESSION_COOKIE,
  sessionCookieIsValid,
  stripAuthCookiesHeader,
} from '@/lib/auth/cookies';

function withLocale(req: NextRequest, res: NextResponse) {
  const locale = localeFromAcceptLanguage(req.headers.get('accept-language'));
  res.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 400,
    sameSite: 'lax',
  });
  return res;
}

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
 * - Valid signed-in visitors on the platform host hitting `/` go to the dashboard
 * - Guests (or stale cookies after a key rotation) keep public pages
 * - Signed-out visitors hitting `/dashboard` go to login
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = hostnameOf(req);
  const customHost = Boolean(host) && !isPlatformHostname(host);
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const canVerify = Boolean(process.env.SESSION_SECRET || process.env.LB_OAUTH_CLIENT_SECRET);
  const valid = token ? await sessionCookieIsValid(token) : false;
  const stale = Boolean(token) && canVerify && !valid;

  const requestHeaders = stale ? stripAuthCookiesHeader(req) : new Headers(req.headers);
  requestHeaders.set('x-pathname', pathname);
  if (customHost) {
    requestHeaders.set('x-campus-host', host);
  }

  const isApi = pathname.startsWith('/api/');
  const finish = (res: NextResponse) => {
    const out = withLocale(req, res);
    if (stale && !isApi) expireAuthCookies(out);
    return out;
  };

  // Custom domain public paths → campus gateway (resolves Host → institution site).
  if (
    customHost &&
    (pathname === '/' ||
      pathname === '/courses' ||
      pathname === '/about' ||
      pathname === '/dashboard' ||
      pathname === '/dashboard/institutions')
  ) {
    const url = req.nextUrl.clone();
    url.pathname = '/campus-gateway';
    return finish(
      NextResponse.rewrite(url, {
        request: { headers: requestHeaders },
      }),
    );
  }

  // Only a *valid* session may skip the marketing home.
  if (pathname === '/' && valid && !customHost) {
    return finish(NextResponse.redirect(new URL('/dashboard', req.url)));
  }

  if (pathname.startsWith('/dashboard') && !valid) {
    const login = new URL('/login', req.url);
    login.searchParams.set('next', pathname);
    if (stale) login.searchParams.set('expired', '1');
    return finish(NextResponse.redirect(login));
  }

  return finish(
    NextResponse.next({
      request: { headers: requestHeaders },
    }),
  );
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|pwa/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml|txt|json|woff2?)$).*)',
  ],
};
