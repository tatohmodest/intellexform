import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { listOngoingClassesForUser } from '@/lib/learn/courseClassSessions';

export const dynamic = 'force-dynamic';

/**
 * GET /api/learn/course-sessions/ongoing
 * Live classes for the signed-in user (as instructor or enrolled student).
 */
export async function GET() {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const sessions = await listOngoingClassesForUser(session.uid);
  return NextResponse.json({ sessions });
}
