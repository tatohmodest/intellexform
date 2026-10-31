import { NextRequest, NextResponse } from 'next/server';
import { startSignup } from '@/lib/auth/credentials';
import { emailOrigin } from '@/lib/auth/origin';
import { resolveAuthNext } from '@/lib/auth/resolveAuthNext';
import { writeSessionCookie } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/signup
 * Body: { name, email, password, next?, campus? }
 * Creates the learner account, sets the session cookie, and sends a best-effort verification email.
 */
export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; password?: string; next?: string; campus?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  try {
    const result = await startSignup({
      name: String(body.name || ''),
      email: String(body.email || ''),
      password: String(body.password || ''),
      origin: emailOrigin(req),
    });

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error, needsPassword: result.needsPassword === true },
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
      sessionCreated: true,
      email: result.email,
      next: nextPath,
      user: result.user,
    });
    writeSessionCookie(res, result.session);
    return res;
  } catch (err) {
    console.error('signup failed:', err);
    return NextResponse.json(
      { error: 'Could not start signup. Please try again.' },
      { status: 500 },
    );
  }
}
