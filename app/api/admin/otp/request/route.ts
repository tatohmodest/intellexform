import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import {
  ADMIN_OTP,
  generateOtpCode,
  hashOtp,
  isAdminEmail,
  normalizeEmail,
} from '@/lib/adminAuth';
import { sendAdminOtpEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/otp/request  { email }
 * Sends a 6-digit OTP to an allowlisted admin email.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = normalizeEmail(String(body.email ?? ''));
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }
    if (!isAdminEmail(email)) {
      // Same message — don't reveal allowlist.
      return NextResponse.json(
        { error: 'This email is not authorized for admin access.' },
        { status: 403 },
      );
    }

    const client = await clientPromise;
    const db = client.db('intellex');
    const otps = db.collection('admin_otps');

    const existing = await otps.findOne({ email });
    if (
      existing?.createdAt &&
      Date.now() - new Date(existing.createdAt).getTime() < ADMIN_OTP.resendMs
    ) {
      return NextResponse.json(
        { error: 'Please wait a minute before requesting another code.' },
        { status: 429 },
      );
    }

    const code = generateOtpCode();
    const codeHash = await hashOtp(code);
    const now = new Date();
    await otps.updateOne(
      { email },
      {
        $set: {
          email,
          codeHash,
          attempts: 0,
          expiresAt: new Date(now.getTime() + ADMIN_OTP.ttlMs),
          createdAt: now,
        },
      },
      { upsert: true },
    );

    await sendAdminOtpEmail({ to: email, code });

    return NextResponse.json({
      ok: true,
      email,
      message: 'Code sent. Check your inbox.',
      expiresInSec: Math.floor(ADMIN_OTP.ttlMs / 1000),
    });
  } catch (err) {
    console.error('admin otp request failed:', err);
    const msg = err instanceof Error && err.message === 'smtp_not_configured'
      ? 'Email delivery is not configured.'
      : 'Could not send code. Please try again.';
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}
