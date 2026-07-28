import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getMentorProfile, searchLearners } from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

/**
 * GET /api/learn/students/search?q=
 * Instructors only - find learners to add to a course.
 */
export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const profile = await getMentorProfile(session.uid);
  if (!profile) return NextResponse.json({ error: 'not_an_instructor' }, { status: 403 });

  const q = req.nextUrl.searchParams.get('q') || '';
  const students = (await searchLearners(q)).filter((s) => s.lbId !== session.uid);
  return NextResponse.json({ students });
}
