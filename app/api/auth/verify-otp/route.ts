import { NextRequest, NextResponse } from 'next/server';
import { finishLoginWithOtp } from '@/lib/auth/credentials';
import { resolveAuthNext } from '@/lib/auth/resolveAuthNext';
import { writeSessionCookie } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/verify-otp
 * Body: { email, code, next?, campus? }
 * Confirms the sign-in OTP emailed after a successful password check.
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; code?: string; next?: string; campus?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  try {
    const result = await finishLoginWithOtp({
      email: String(body.email || ''),
      code: String(body.code || ''),
    });

    if ('error' in result) {
      return NextResponse.json(
        {
          error: result.error,
          remainingAttempts: result.remainingAttempts,
          retryAfterSec: result.retryAfterSec,
        },
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
    writeSessionCookie(res, result.session);
    return res;
  } catch (err) {
    console.error('verify-otp failed:', err);
    return NextResponse.json(
      { error: 'Could not verify that code. Please try again.' },
      { status: 500 },
    );
  }
}
