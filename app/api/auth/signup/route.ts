import { NextRequest, NextResponse } from 'next/server';
import { startSignup } from '@/lib/auth/credentials';
import { emailOrigin } from '@/lib/auth/origin';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/signup
 * Body: { name, email, password }
 * Stores the pending account and emails a verification link.
 */
export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  try {
    const result = await startSignup({
      name: String(body.name || ''),
      email: String(body.email || ''),
      password: String(body.password || ''),
      origin: emailOrigin(req),
    });

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error, needsPassword: result.needsPassword === true },
        { status: result.status },
      );
    }

    return NextResponse.json({
      ok: true,
      email: result.email,
    });
  } catch (err) {
    console.error('signup failed:', err);
    return NextResponse.json(
      { error: 'Could not start signup. Please try again.' },
      { status: 500 },
    );
  }
}
