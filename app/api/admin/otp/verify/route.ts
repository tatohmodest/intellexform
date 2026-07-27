import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import {
  ADMIN_OTP,
  COOKIE_NAME,
  adminCookieOptions,
  createSessionToken,
  isAdminEmail,
  normalizeEmail,
  verifyOtpCode,
} from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/otp/verify  { email, code }
 * Verifies OTP and sets the admin session cookie.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = normalizeEmail(String(body.email ?? ''));
    const code = String(body.code ?? '').replace(/\s+/g, '');

    if (!email || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: 'Email and 6-digit code required' }, { status: 400 });
    }
    if (!isAdminEmail(email)) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db('intellex');
    const otps = db.collection('admin_otps');
    const doc = await otps.findOne({ email });

    if (!doc?.codeHash || !doc.expiresAt) {
      return NextResponse.json({ error: 'No code pending — request a new one.' }, { status: 400 });
    }
    if (new Date(doc.expiresAt).getTime() < Date.now()) {
      await otps.deleteOne({ email });
      return NextResponse.json({ error: 'Code expired — request a new one.' }, { status: 400 });
    }
    if ((doc.attempts ?? 0) >= ADMIN_OTP.maxAttempts) {
      await otps.deleteOne({ email });
      return NextResponse.json({ error: 'Too many attempts — request a new code.' }, { status: 429 });
    }

    const valid = await verifyOtpCode(code, String(doc.codeHash));
    if (!valid) {
      await otps.updateOne({ email }, { $inc: { attempts: 1 } });
      return NextResponse.json({ error: 'Incorrect code' }, { status: 401 });
    }

    await otps.deleteOne({ email });

    const token = createSessionToken(email);
    const res = NextResponse.json({ success: true, email });
    res.cookies.set(COOKIE_NAME, token, adminCookieOptions());
    return res;
  } catch (err) {
    console.error('admin otp verify failed:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
