import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getMentorProfile, listStudentIdsForCourse } from '@/lib/learn/ecosystem';
import {
  endCourseClass,
  getClassSessionById,
} from '@/lib/learn/courseClassSessions';
import { createNotificationsForUsers } from '@/lib/learn/notifications';

export const dynamic = 'force-dynamic';

/**
 * POST /api/learn/course-sessions/[id]/end - instructor ends a live class.
 * Records endAt so platform admins can verify the class was held.
 */
export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const profile = await getMentorProfile(session.uid);
  if (!profile) return NextResponse.json({ error: 'mentor_required' }, { status: 403 });

  const existing = await getClassSessionById(params.id);
  if (!existing) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (existing.instructorId !== session.uid) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const ended = await endCourseClass(params.id, session.uid);
  if (!ended) return NextResponse.json({ error: 'end_failed' }, { status: 500 });

  // Optional quiet notice - class ended (skip if already ended before).
  if (existing.status === 'live') {
    try {
      const studentIds = await listStudentIdsForCourse(ended.courseId);
      await createNotificationsForUsers(
        studentIds.filter((id) => id !== session.uid),
        {
          title: `Class ended: ${ended.courseTitle}`,
          body: `${profile.name || 'Your instructor'} ended today's class (${ended.durationMinutes} min).`,
          href: `/dashboard/courses/instructor/${ended.courseId}`,
          kind: 'system',
          data: {
            courseId: ended.courseId,
            sessionId: ended.id,
          },
        },
      );
    } catch (err) {
      console.error('course class end notify failed:', err);
    }
  }

  return NextResponse.json({ session: ended });
}
