import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Legacy LoopingBinary OAuth callback — auth is now email/password + OTP.
 * Keep the route so old bookmarks do not 404; send people to the login form.
 */
export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/login', req.url));
}
