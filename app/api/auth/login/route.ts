import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  buildAuthorizeUrl,
  isOAuthConfigured,
  OAUTH_STATE_COOKIE,
} from '@/lib/auth/oauth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/login?intent=signup&next=/dashboard
 * Starts the "Sign in with LoopingBinary" OAuth flow.
 */
export async function GET(req: NextRequest) {
  if (!isOAuthConfigured()) {
    return NextResponse.redirect(
      new URL('/login?error=oauth_not_configured', req.url),
    );
  }

  const intent = req.nextUrl.searchParams.get('intent') === 'signup' ? 'signup' : 'login';
  const nextPath = req.nextUrl.searchParams.get('next') || '/dashboard';
  // Bind the returned `state` to this browser and remember where to land after.
  const state = `${crypto.randomBytes(16).toString('hex')}.${Buffer.from(nextPath).toString('base64url')}`;

  const res = NextResponse.redirect(
    buildAuthorizeUrl({ state, requestOrigin: req.nextUrl.origin, intent }),
  );
  res.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 10 * 60,
  });
  return res;
}
