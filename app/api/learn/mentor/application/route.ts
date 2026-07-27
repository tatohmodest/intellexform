import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getPendingMentorApplication } from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

/** GET /api/learn/mentor/apply — current user's pending mentor application. */
export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const app = await getPendingMentorApplication(user.uid);
    return NextResponse.json({ application: app });
  } catch (err) {
    console.error('get mentor application failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
