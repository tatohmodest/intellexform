import { NextRequest, NextResponse } from 'next/server';
import { isPlatformHostname } from '@/lib/platformHosts';
import { isLocale, localeFromAcceptLanguage, LOCALE_COOKIE } from '@/lib/i18n/locale';
import {
  cookieValues,
  expireAuthCookies,
  SESSION_COOKIE,
  sessionCookieIsValid,
  stripAuthCookiesHeader,
} from '@/lib/auth/cookies';

/** First visit: pick en/fr from the browser. Never overwrite an existing (possibly manual) choice. */
function withLocale(req: NextRequest, res: NextResponse) {
  if (isLocale(req.cookies.get(LOCALE_COOKIE)?.value)) return res;
  const locale = localeFromAcceptLanguage(req.headers.get('accept-language'));
  res.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 400,
    sameSite: 'lax',
  });
  return res;
}

const SOCIAL_BOT =
  /WhatsApp|facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Discordbot|Pinterest|SkypeUriPreview|iMessage|Applebot|Googlebot|bingbot/i;

/** Find a valid session among (possibly duplicated) session cookies. */
async function resolveSession(req: NextRequest) {
  const tokens = cookieValues(req.headers.get('cookie'), SESSION_COOKIE);
  const canVerify = Boolean(process.env.SESSION_SECRET || process.env.LB_OAUTH_CLIENT_SECRET);
  if (!tokens.length) return { hasToken: false, valid: false, stale: false, validToken: null, duplicates: false };
  if (!canVerify) {
    // Edge runtime can't see the secret: let server pages (which can) decide.
    // Redirecting here would loop with /login's own "already signed in" redirect.
    return { hasToken: true, valid: true, stale: false, validToken: null, duplicates: false };
  }
  for (const token of tokens) {
    if (await sessionCookieIsValid(token)) {
      return { hasToken: true, valid: true, stale: false, validToken: token, duplicates: tokens.length > 1 };
    }
  }
  return { hasToken: true, valid: false, stale: true, validToken: null, duplicates: tokens.length > 1 };
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
  // Lesson bodies are private Worker assets (see lib/tutorials/content.ts).
  if (pathname.startsWith('/_tc/')) return new NextResponse(null, { status: 404 });
  const host = hostnameOf(req);
  const customHost = Boolean(host) && !isPlatformHostname(host);
  const session = await resolveSession(req);
  const { valid, stale } = session;

  // Forward only the valid token (or none, if every cookie is stale) so server code sees one clean session.
  const requestHeaders =
    stale || session.duplicates
      ? stripAuthCookiesHeader(req, session.validToken)
      : new Headers(req.headers);
  requestHeaders.set('x-pathname', pathname);
  if (customHost) {
    requestHeaders.set('x-campus-host', host);
  }

  const isApi = pathname.startsWith('/api/');
  const finish = (res: NextResponse) => {
    const out = withLocale(req, res);
    // Must run last: it appends raw Set-Cookie lines that a later cookies.set() would drop.
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

  // Link-preview crawlers can't sign in: serve them the public course page so shares show the course card.
  if (!valid && pathname.startsWith('/dashboard/courses/') && SOCIAL_BOT.test(req.headers.get('user-agent') || '')) {
    const rest = pathname.slice('/dashboard/courses/'.length).split('/').filter(Boolean);
    const publicPath =
      rest[0] === 'instructor' && rest[1]
        ? `/courses/instructor/${rest[1]}`
        : rest[0] && rest[0] !== 'browse'
          ? `/courses/${rest[0]}`
          : '';
    if (publicPath) {
      const url = req.nextUrl.clone();
      url.pathname = publicPath;
      return finish(NextResponse.rewrite(url, { request: { headers: requestHeaders } }));
    }
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
    '/((?!_next/static|_next/image|favicon.ico|pwa/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml|txt|json|woff2?|mp4|webm)$).*)',
  ],
};
