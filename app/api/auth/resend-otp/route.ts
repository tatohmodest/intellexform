import { NextRequest, NextResponse } from 'next/server';
import { resendLoginOtp } from '@/lib/auth/credentials';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/resend-otp
 * Body: { email }
 * Resends the sign-in OTP after a successful password check.
 */
export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  try {
    const result = await resendLoginOtp({
      email: String(body.email || ''),
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

    return NextResponse.json({
      ok: true,
      email: result.email,
      expiresInSec: result.expiresInSec,
    });
  } catch (err) {
    console.error('resend-otp failed:', err);
    return NextResponse.json(
      { error: 'Could not resend the code. Please try again.' },
      { status: 500 },
    );
  }
}
