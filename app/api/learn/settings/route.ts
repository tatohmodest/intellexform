import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { updateLearnerSettings } from '@/lib/learn/repo';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const patch: { name?: string; weeklyGoalMinutes?: number } = {};
  if (typeof body.name === 'string' && body.name.trim()) {
    patch.name = body.name.trim().slice(0, 80);
  }
  if (typeof body.weeklyGoalMinutes === 'number' && body.weeklyGoalMinutes > 0) {
    patch.weeklyGoalMinutes = Math.min(Math.round(body.weeklyGoalMinutes), 7 * 24 * 60);
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'nothing_to_update' }, { status: 400 });
  }
  try {
    await updateLearnerSettings(user.uid, patch);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('settings update failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
