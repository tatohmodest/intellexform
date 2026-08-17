import { NextRequest, NextResponse } from 'next/server';
import { resetPassword } from '@/lib/auth/credentials';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/reset-password
 * Body: { token, password }
 */
export async function POST(req: NextRequest) {
  let body: { token?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  try {
    const result = await resetPassword({
      token: String(body.token || ''),
      password: String(body.password || ''),
    });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('reset-password failed:', err);
    return NextResponse.json(
      { error: 'Could not reset that password. Please try again.' },
      { status: 500 },
    );
  }
}
