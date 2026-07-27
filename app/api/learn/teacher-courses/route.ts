import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  createTeacherCourse,
  listPublicTeacherCourses,
  listTeacherCoursesByAuthor,
  listTeacherCoursesForCampus,
} from '@/lib/learn/ecosystem';
import { getLearner } from '@/lib/learn/repo';
import type { ContentVisibility } from '@/lib/learn/identity';

export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const scope = searchParams.get('scope') || 'mine';
  const campus = searchParams.get('campus');

  if (scope === 'public') {
    const courses = await listPublicTeacherCourses();
    return NextResponse.json({ courses });
  }
  if (campus) {
    const courses = await listTeacherCoursesForCampus(campus, {
      includeUnpublishedForAuthorId: session.uid,
    });
    return NextResponse.json({ courses });
  }
  const courses = await listTeacherCoursesByAuthor(session.uid);
  return NextResponse.json({ courses });
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const title = String(body.title || '').trim();
  if (!title) return NextResponse.json({ error: 'title_required' }, { status: 400 });

  const learner = await getLearner(session.uid);
  const institutionSlug =
    body.institutionSlug === null || body.institutionSlug === ''
      ? null
      : String(body.institutionSlug || '').trim() || null;

  const visibility = (['private', 'network', 'public'].includes(body.visibility)
    ? body.visibility
    : 'private') as ContentVisibility;

  const id = await createTeacherCourse({
    authorId: session.uid,
    authorName: learner?.name || session.name || 'Instructor',
    title,
    institutionSlug,
    visibility,
  });

  return NextResponse.json({ id }, { status: 201 });
}
