import { NextRequest, NextResponse } from 'next/server';
import { completeLogin } from '@/lib/auth/credentials';
import { resolveAuthNext } from '@/lib/auth/resolveAuthNext';
import { SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth/session';

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
 * Body: { email, password, next?, campus? }
 * Signs in a verified account with email + password.
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string; next?: string; campus?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  try {
    const result = await completeLogin({
      email: String(body.email || ''),
      password: String(body.password || ''),
    });

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error, unverified: result.unverified === true },
        { status: result.status },
      );
    }

    const nextPath = await resolveAuthNext({
      userId: result.user.uid,
      userName: result.user.name,
      userEmail: result.user.email || String(body.email || ''),
      defaultNext: result.nextPath,
      requestedNext: body.next,
      campusSlug: body.campus,
    });

    const res = NextResponse.json({
      ok: true,
      next: nextPath,
      user: result.user,
    });
    res.cookies.set(SESSION_COOKIE, result.session, sessionCookieOptions());
    return res;
  } catch (err) {
    console.error('login failed:', err);
    return NextResponse.json(
      { error: 'Could not sign in. Please try again.' },
      { status: 500 },
    );
  }
}
