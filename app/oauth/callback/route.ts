import { NextRequest, NextResponse } from 'next/server';
import {
  exchangeCodeForToken,
  fetchUserInfo,
  OAUTH_STATE_COOKIE,
} from '@/lib/auth/oauth';
import {
  createSession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from '@/lib/auth/session';
import { upsertLearnerFromOAuth } from '@/lib/learn/repo';
import { isOnboardingComplete } from '@/lib/learn/identity';

export const dynamic = 'force-dynamic';

/**
 * GET /oauth/callback?code=...&state=...
 * LoopingBinary redirects here after the learner authorizes Intellex.
 * First-time identities continue to onboarding; returning users go home.
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const oauthError = url.searchParams.get('error');

  const fail = (reason: string) => {
    const res = NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(reason)}`, req.url),
    );
    res.cookies.delete(OAUTH_STATE_COOKIE);
    return res;
  };

  if (oauthError) return fail(oauthError);
  if (!code || !state) return fail('missing_code');

  const expectedState = req.cookies.get(OAUTH_STATE_COOKIE)?.value;
  if (!expectedState || expectedState !== state) return fail('state_mismatch');

  try {
    const token = await exchangeCodeForToken(code, url.origin);
    const profile = await fetchUserInfo(token.access_token);
    const learner = await upsertLearnerFromOAuth(profile);

    const session = createSession({
      uid: profile.sub,
      name: learner.name || profile.name || 'Learner',
      email: learner.email || profile.email || '',
      avatar: learner.avatar ?? profile.picture,
    });

    let nextPath = '/dashboard';
    const encoded = state.split('.')[1];
    if (encoded) {
      try {
        const decoded = Buffer.from(encoded, 'base64url').toString();
        if (decoded.startsWith('/')) nextPath = decoded;
      } catch {
        /* keep default */
      }
    }

    // Identity first: unfinished profiles finish onboarding (except platform admin).
    if (!isOnboardingComplete(learner) && !nextPath.startsWith('/admin')) {
      nextPath = '/dashboard/onboarding';
    }

    const res = NextResponse.redirect(new URL(nextPath, req.url));
    res.cookies.set(SESSION_COOKIE, session, sessionCookieOptions());
    res.cookies.delete(OAUTH_STATE_COOKIE);
    return res;
  } catch (err) {
    console.error('OAuth callback failed:', err);
    return fail('exchange_failed');
  }
}
