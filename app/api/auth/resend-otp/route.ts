import { NextRequest, NextResponse } from 'next/server';
import { resendAuthOtp, type AuthOtpPurpose } from '@/lib/auth/credentials';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/resend-otp
 * Body: { email, purpose: 'signup' | 'login' }
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; purpose?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const purpose = (body.purpose === 'signup' ? 'signup' : 'login') as AuthOtpPurpose;
  try {
    const result = await resendAuthOtp({
      email: String(body.email || ''),
      purpose,
    });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      ok: true,
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
