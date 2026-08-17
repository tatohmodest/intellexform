import { NextRequest, NextResponse } from 'next/server';
import { startSignup } from '@/lib/auth/credentials';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/signup
 * Body: { name, email, password }
 * Starts credentials signup and emails a verification OTP.
 */
export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const result = await startSignup({
    name: String(body.name || ''),
    email: String(body.email || ''),
    password: String(body.password || ''),
  });

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    ok: true,
    email: result.email,
    purpose: 'signup',
    expiresInSec: result.expiresInSec,
  });
}
