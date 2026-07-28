import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  getMentorProfile,
  getTeacherCourse,
  listStudentIdsForCourse,
} from '@/lib/learn/ecosystem';
import {
  getLiveClassForCourse,
  listLiveClassesForInstructor,
  startCourseClass,
} from '@/lib/learn/courseClassSessions';
import { createNotificationsForUsers } from '@/lib/learn/notifications';

export const dynamic = 'force-dynamic';

/**
 * GET /api/learn/course-sessions
 * - ?courseId= → live session for that course (instructor or enrolled student)
 * - no query → live sessions for the signed-in instructor
 */
export async function GET(req: Request) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const courseId = url.searchParams.get('courseId');

  if (courseId) {
    const live = await getLiveClassForCourse(courseId);
    return NextResponse.json({ session: live });
  }

  const profile = await getMentorProfile(session.uid);
  if (!profile) return NextResponse.json({ error: 'mentor_required' }, { status: 403 });

  const sessions = await listLiveClassesForInstructor(session.uid);
  return NextResponse.json({ sessions });
}

/**
 * POST /api/learn/course-sessions — instructor starts a live class for a course.
 * Body: { courseId }
 */
export async function POST(req: Request) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const profile = await getMentorProfile(session.uid);
  if (!profile) return NextResponse.json({ error: 'mentor_required' }, { status: 403 });

  let body: { courseId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const courseId = typeof body.courseId === 'string' ? body.courseId.trim() : '';
  if (!courseId) return NextResponse.json({ error: 'courseId_required' }, { status: 400 });

  const course = await getTeacherCourse(courseId);
  if (!course) return NextResponse.json({ error: 'course_not_found' }, { status: 404 });

  const isOwner =
    course.authorId === session.uid || course.instructorId === session.uid;
  if (!isOwner) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const live = await startCourseClass({
    courseId: course.id,
    courseTitle: course.title,
    instructorId: session.uid,
    instructorName: profile.name || session.name || 'Instructor',
  });

  // Notify enrolled students that class is in progress.
  try {
    const studentIds = await listStudentIdsForCourse(course.id);
    await createNotificationsForUsers(
      studentIds.filter((id) => id !== session.uid),
      {
        title: `Class live: ${course.title}`,
        body: `${profile.name || 'Your instructor'} started class. Join now while the session is open.`,
        href: `/dashboard/sessions/${live.channel}`,
        kind: 'system',
        data: {
          courseId: course.id,
          sessionId: live.id,
          channel: live.channel,
        },
      },
    );
  } catch (err) {
    console.error('course class notify failed:', err);
  }

  return NextResponse.json({ session: live });
}
