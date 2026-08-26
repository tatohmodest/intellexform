import { NextRequest, NextResponse } from 'next/server';
import { requestPasswordReset } from '@/lib/auth/credentials';
import { emailOrigin } from '@/lib/auth/origin';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/forgot-password
 * Body: { email }
 * Unknown emails still return ok (no account probing). SMTP failures return 503.
 */
export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  try {
    const result = await requestPasswordReset({
      email: String(body.email || ''),
      origin: emailOrigin(req),
    });
    if (result && 'error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('forgot-password failed:', err);
    return NextResponse.json(
      { error: 'Could not send the reset email. Please try again.' },
      { status: 500 },
    );
  }
}
