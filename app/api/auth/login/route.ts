import { NextRequest, NextResponse } from 'next/server';
import { beginLogin } from '@/lib/auth/credentials';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/login — legacy OAuth entry. Redirect to the credentials form.
 */
export async function GET(req: NextRequest) {
  const intent = req.nextUrl.searchParams.get('intent') === 'signup' ? 'signup' : 'login';
  const nextPath = req.nextUrl.searchParams.get('next') || '/dashboard';
  const path = intent === 'signup' ? '/signup' : '/login';
  const url = new URL(path, req.url);
  if (nextPath && nextPath !== '/dashboard') url.searchParams.set('next', nextPath);
  return NextResponse.redirect(url);
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Verifies the password, then emails a 6-digit OTP. Session is set after verify-otp.
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  try {
    const result = await beginLogin({
      email: String(body.email || ''),
      password: String(body.password || ''),
    });

    if ('error' in result) {
      return NextResponse.json(
        {
          error: result.error,
          unverified: result.unverified === true,
          remainingAttempts: result.remainingAttempts,
          retryAfterSec: result.retryAfterSec,
        },
        { status: result.status },
      );
    }

    return NextResponse.json({
      ok: true,
      otpRequired: true,
      email: result.email,
      expiresInSec: result.expiresInSec,
    });
  } catch (err) {
    console.error('login failed:', err);
    return NextResponse.json(
      { error: 'Could not sign in. Please try again.' },
      { status: 500 },
    );
  }
}
