import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getStudentMembership } from '@/lib/learn/studentAccess';
import { listFillableDatasetsForUser } from '@/lib/staff/dataWorkspace';

export const dynamic = 'force-dynamic';

/** GET /api/learn/forms — institution datasets this person can fill. */
export async function GET() {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const membership = await getStudentMembership(session.uid);
    const forms = await listFillableDatasetsForUser({
      userId: session.uid,
      isStudent: membership.isStudent,
    });
    return NextResponse.json({ forms });
  } catch (err) {
    console.error('learn forms:', err);
    return NextResponse.json({ forms: [] });
  }
}
