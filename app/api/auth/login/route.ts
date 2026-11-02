import { NextRequest, NextResponse } from 'next/server';
import { beginLogin } from '@/lib/auth/credentials';
import { resolveAuthNext } from '@/lib/auth/resolveAuthNext';
import { writeSessionCookie } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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
 * Body: { email, password, next?, campus? }
 * Verifies the password and signs the learner in immediately.
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string; next?: string; campus?: string };
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
          needsPassword: result.needsPassword === true,
        },
        { status: result.status },
      );
    }

    const nextPath = await resolveAuthNext({
      userId: result.user.uid,
      userName: result.user.name,
      userEmail: result.user.email || result.email,
      defaultNext: result.nextPath,
      requestedNext: body.next,
      campusSlug: body.campus,
    });

    const res = NextResponse.json({
      ok: true,
      otpRequired: false,
      email: result.email,
      next: nextPath,
      user: result.user,
      expiresInSec: result.expiresInSec,
    });
    writeSessionCookie(res, result.session);
    return res;
  } catch (err) {
    console.error('login failed:', err);
    return NextResponse.json(
      { error: 'Could not sign in. Please try again.' },
      { status: 500 },
    );
  }
}
