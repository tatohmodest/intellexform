import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { changePassword } from '@/lib/auth/credentials';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session?.email) {
    return NextResponse.json({ error: 'Sign in to change your password.' }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const currentPassword = String(body.currentPassword || '');
  const newPassword = String(body.newPassword || '');
  const confirmPassword = String(body.confirmPassword || '');
  if (newPassword !== confirmPassword) {
    return NextResponse.json({ error: 'New password and confirmation do not match.' }, { status: 400 });
  }
  const result = await changePassword({
    email: session.email,
    currentPassword,
    newPassword,
  });
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ ok: true });
}
