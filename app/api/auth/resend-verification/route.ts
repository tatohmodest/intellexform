import { NextRequest, NextResponse } from 'next/server';
import { resendVerification } from '@/lib/auth/credentials';
import { requestOrigin } from '@/lib/auth/origin';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/resend-verification
 * Body: { email }
 */
export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  try {
    const result = await resendVerification({
      email: String(body.email || ''),
      origin: requestOrigin(req),
    });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ ok: true, email: result.email });
  } catch (err) {
    console.error('resend-verification failed:', err);
    return NextResponse.json(
      { error: 'Could not resend the email. Please try again.' },
      { status: 500 },
    );
  }
}
