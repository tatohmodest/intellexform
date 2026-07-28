import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { listClassroomForUser } from '@/lib/learn/courseClassSessions';

export const dynamic = 'force-dynamic';

/** GET /api/learn/classroom - live + past class history for the signed-in user. */
export async function GET() {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const data = await listClassroomForUser(session.uid);
  return NextResponse.json(data);
}
