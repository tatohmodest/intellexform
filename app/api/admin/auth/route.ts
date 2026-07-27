import { NextRequest, NextResponse } from 'next/server';
import {
  COOKIE_NAME,
  adminCookieOptions,
  createSessionToken,
  getAdminAccess,
} from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/auth
 * Accepts an admin cookie OR a learner session with an allowlisted admin email.
 * When elevating from learner session, mints an admin cookie for API routes.
 */
export async function GET(req: NextRequest) {
  const access = getAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const res = NextResponse.json({
    authenticated: true,
    email: access.email,
    via: access.via,
  });

  if (access.via === 'learner_session') {
    const existing = req.cookies.get(COOKIE_NAME)?.value;
    if (!existing) {
      res.cookies.set(
        COOKIE_NAME,
        createSessionToken(access.email),
        adminCookieOptions(),
      );
    }
  }

  return res;
}
