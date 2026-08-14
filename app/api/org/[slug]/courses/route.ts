import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  assertOrgStaff,
  createOrgCourse,
  enrollUserInCourse,
  listCourseEnrollments,
  listOrgCourses,
} from '@/lib/orgLms';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { searchParams } = new URL(req.url);
  const publishedOnly = searchParams.get('published') === '1';

  // Public catalogue peek for published courses (org website).
  if (publishedOnly) {
    const courses = await listOrgCourses({
      slug: params.slug,
      publishedOnly: true,
    });
    return NextResponse.json({
      courses: courses.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        subtitle: c.subtitle,
        description: c.shortDescription || c.description,
        thumbnailUrl: c.thumbnailUrl,
        priceXaf: c.priceXaf,
        lessonsCount: c.lessonsCount,
        enrollments: c._count.enrollments,
      })),
    });
  }

  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const auth = await assertOrgStaff({
    slug: params.slug,
    userId: session.uid,
    email: session.email,
  });
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'forbidden' ? 403 : 404 });
  }

  const courses = await listOrgCourses({ slug: params.slug });
  return NextResponse.json({ courses });
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
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'forbidden' ? 403 : 404 });
  }

  const body = await req.json().catch(() => ({}));
  const action = String(body.action || 'create');

  try {
    if (action === 'enroll') {
      const enrollment = await enrollUserInCourse({
        institutionId: auth.institutionId,
        courseId: String(body.courseId || ''),
        userEmail: String(body.email || ''),
        userName: body.name ? String(body.name) : undefined,
      });
      return NextResponse.json({ ok: true, enrollment });
    }

    if (action === 'list_enrollments') {
      const enrollments = await listCourseEnrollments({
        institutionId: auth.institutionId,
        courseId: String(body.courseId || ''),
      });
      return NextResponse.json({ enrollments });
    }

    const course = await createOrgCourse({
      institutionId: auth.institutionId,
      title: String(body.title || ''),
      description: body.description ? String(body.description) : undefined,
      instructorUserId: body.instructorUserId ? String(body.instructorUserId) : null,
      priceXaf: typeof body.priceXaf === 'number' ? body.priceXaf : 0,
      status: body.publish ? 'PUBLISHED' : 'DRAFT',
    });
    return NextResponse.json({ ok: true, course });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed' },
      { status: 400 },
    );
  }
}
