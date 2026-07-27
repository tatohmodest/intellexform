import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { cancelBooking } from '@/lib/learn/repo';

export const dynamic = 'force-dynamic';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    await cancelBooking(user.uid, params.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('cancelBooking failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
