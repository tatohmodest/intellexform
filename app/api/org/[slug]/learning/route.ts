import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { assertOrgStaff } from '@/lib/orgLms';
import {
  addCourseSection,
  addLesson,
  getCourseLearningTree,
} from '@/lib/orgLms/learningEngine';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const auth = await assertOrgStaff({
    slug: params.slug,
    userId: session.uid,
    email: session.email,
  });
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  const courseId = new URL(req.url).searchParams.get('courseId');
  if (!courseId) return NextResponse.json({ error: 'courseId required' }, { status: 400 });

  const tree = await getCourseLearningTree({
    institutionId: auth.institutionId,
    courseIdOrSlug: courseId,
  });
  return NextResponse.json({ course: tree });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const auth = await assertOrgStaff({
    slug: params.slug,
    userId: session.uid,
    email: session.email,
  });
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const action = String(body.action || '');

  try {
    if (action === 'add_section') {
      const section = await addCourseSection({
        institutionId: auth.institutionId,
        courseId: String(body.courseId || ''),
        title: String(body.title || ''),
        description: body.description ? String(body.description) : undefined,
      });
      return NextResponse.json({ ok: true, section });
    }
    if (action === 'add_lesson') {
      const lesson = await addLesson({
        institutionId: auth.institutionId,
        sectionId: String(body.sectionId || ''),
        title: String(body.title || ''),
        contentType: body.contentType,
        contentMarkdown: body.contentMarkdown ? String(body.contentMarkdown) : undefined,
        videoUrl: body.videoUrl ? String(body.videoUrl) : undefined,
      });
      return NextResponse.json({ ok: true, lesson });
    }
    return NextResponse.json({ error: 'unknown_action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed' },
      { status: 400 },
    );
  }
}
