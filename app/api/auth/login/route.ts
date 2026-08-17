import { NextRequest, NextResponse } from 'next/server';
import { startLogin } from '@/lib/auth/credentials';

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
 * Body: { email, password }
 * Verifies password and emails a login OTP.
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const result = await startLogin({
    email: String(body.email || ''),
    password: String(body.password || ''),
  });

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    ok: true,
    email: result.email,
    purpose: 'login',
    expiresInSec: result.expiresInSec,
  });
}
