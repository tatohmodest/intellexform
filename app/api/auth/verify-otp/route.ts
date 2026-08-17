import { NextRequest, NextResponse } from 'next/server';
import { verifyLoginOtp, verifySignupOtp, type AuthOtpPurpose } from '@/lib/auth/credentials';
import { SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/verify-otp
 * Body: { email, code, purpose: 'signup' | 'login', next?: string }
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; code?: string; purpose?: string; next?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const purpose = (body.purpose === 'signup' ? 'signup' : 'login') as AuthOtpPurpose;
  const email = String(body.email || '');
  const code = String(body.code || '');

  const result =
    purpose === 'signup'
      ? await verifySignupOtp({ email, code })
      : await verifyLoginOtp({ email, code });

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  let nextPath = result.nextPath;
  const requested = String(body.next || '').trim();
  if (requested.startsWith('/') && !requested.startsWith('//') && nextPath !== '/dashboard/onboarding') {
    nextPath = requested;
  } else if (
    requested.startsWith('/') &&
    !requested.startsWith('//') &&
    nextPath === '/dashboard/onboarding'
  ) {
    // Keep first-time onboarding; stash intended destination after.
    nextPath = `/dashboard/onboarding?next=${encodeURIComponent(requested)}`;
  }

  const res = NextResponse.json({
    ok: true,
    next: nextPath,
    user: result.user,
  });
  res.cookies.set(SESSION_COOKIE, result.session, sessionCookieOptions());
  return res;
}
