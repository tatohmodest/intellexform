import { NextRequest, NextResponse } from 'next/server';
import { requestPasswordReset } from '@/lib/auth/credentials';
import { requestOrigin } from '@/lib/auth/origin';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/forgot-password
 * Body: { email }
 * Always returns ok so the form cannot be used to probe accounts.
 */
export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  try {
    await requestPasswordReset({
      email: String(body.email || ''),
      origin: requestOrigin(req),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('forgot-password failed:', err);
    return NextResponse.json({ ok: true });
  }
}
