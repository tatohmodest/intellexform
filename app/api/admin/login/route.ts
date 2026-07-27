import { NextRequest, NextResponse } from 'next/server';
import {
  COOKIE_NAME,
  adminCookieOptions,
  createSessionToken,
  getAdminAccess,
  isAdminEmail,
  normalizeEmail,
} from '@/lib/adminAuth';
import { SESSION_COOKIE, verifySession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/login
 * Prefer OTP (/api/admin/otp/*). This endpoint elevates an already-logged-in
 * learner session when the email is on the admin allowlist.
 * Legacy password body is rejected with a clear message.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    if (body.password) {
      return NextResponse.json(
        {
          error:
            'Password login is disabled. Use the email OTP, or sign in with your Looping Binary account first.',
        },
        { status: 400 },
      );
    }

    const access = getAdminAccess(req);
    if (access.ok) {
      const res = NextResponse.json({ success: true, email: access.email, via: access.via });
      res.cookies.set(
        COOKIE_NAME,
        createSessionToken(access.email),
        adminCookieOptions(),
      );
      return res;
    }

    const learner = verifySession(req.cookies.get(SESSION_COOKIE)?.value);
    const email = normalizeEmail(String(body.email || learner?.email || ''));
    if (learner?.email && isAdminEmail(learner.email)) {
      const res = NextResponse.json({
        success: true,
        email: normalizeEmail(learner.email),
        via: 'learner_session',
      });
      res.cookies.set(
        COOKIE_NAME,
        createSessionToken(learner.email),
        adminCookieOptions(),
      );
      return res;
    }

    if (email && isAdminEmail(email)) {
      return NextResponse.json(
        { error: 'Request an OTP for this email, or sign in to InTelleX first.' },
        { status: 401 },
      );
    }

    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  } catch (err) {
    console.error('Admin login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
