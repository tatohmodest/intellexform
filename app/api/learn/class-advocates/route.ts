import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getMentorProfile } from '@/lib/learn/ecosystem';
import {
  StudentAccessError,
  setClassAdvocateByInstructor,
} from '@/lib/learn/studentAccess';

export const dynamic = 'force-dynamic';

/**
 * POST /api/learn/class-advocates
 * Instructors assign class advocates (class heads) for students in their courses.
 */
export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const profile = await getMentorProfile(session.uid);
  if (!profile) {
    return NextResponse.json(
      { error: 'Only instructors can assign class advocates.' },
      { status: 403 },
    );
  }

  const body = await req.json().catch(() => ({}));
  try {
    const result = await setClassAdvocateByInstructor({
      instructorId: session.uid,
      studentId: String(body.studentId || ''),
      classHead: Boolean(body.classHead),
    });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof StudentAccessError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('class advocates:', err);
    return NextResponse.json({ error: 'Could not update class advocate.' }, { status: 500 });
  }
}
