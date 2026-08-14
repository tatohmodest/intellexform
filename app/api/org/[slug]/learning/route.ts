import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { assertOrgStaff, resolveInstitutionId } from '@/lib/orgLms';
import {
  addCourseSection,
  addLesson,
  getCourseLearningTree,
  markLessonProgress,
  recomputeEnrollmentProgress,
} from '@/lib/orgLms/learningEngine';
import {
  assertOrgLearnerAccess,
  resolvePrismaUserId,
} from '@/lib/orgLms/learnerPlane';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

async function authorizeLearningRead(opts: {
  slug: string;
  courseId: string;
  uid?: string;
  email?: string | null;
}) {
  const staff = await assertOrgStaff({
    slug: opts.slug,
    userId: opts.uid,
    email: opts.email,
  });
  if (!('error' in staff)) {
    return { institutionId: staff.institutionId, prismaUserId: null as string | null, staff: true };
  }

  const institutionId = await resolveInstitutionId(opts.slug);
  if (!institutionId) return { error: 'not_found' as const };

  const prismaUserId = await resolvePrismaUserId({
    userId: opts.uid,
    email: opts.email,
  });
  if (!prismaUserId) return { error: 'unauthorized' as const };

  const access = await assertOrgLearnerAccess({
    institutionId,
    courseIdOrSlug: opts.courseId,
    prismaUserId,
  });
  if ('error' in access) return { error: access.error };

  return { institutionId, prismaUserId, staff: false, courseId: access.courseId };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const courseId = new URL(req.url).searchParams.get('courseId');
  if (!courseId) return NextResponse.json({ error: 'courseId required' }, { status: 400 });

  const auth = await authorizeLearningRead({
    slug: params.slug,
    courseId,
    uid: session.uid,
    email: session.email,
  });
  if ('error' in auth) {
    const status = auth.error === 'unauthorized' ? 401 : auth.error === 'not_found' ? 404 : 403;
    return NextResponse.json({ error: auth.error }, { status });
  }

  const tree = await getCourseLearningTree({
    institutionId: auth.institutionId,
    courseIdOrSlug: courseId,
  });
  if (!tree) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  let progress: { lessonId: string; completed: boolean }[] = [];
  let progressPercent = 0;

  const prismaUserId =
    auth.prismaUserId ||
    (await resolvePrismaUserId({ userId: session.uid, email: session.email }));

  if (prismaUserId) {
    const lessonIds = tree.sections.flatMap((s) => s.lessons.map((l) => l.id));
    if (lessonIds.length) {
      const rows = await prisma.lessonProgress.findMany({
        where: { userId: prismaUserId, lessonId: { in: lessonIds } },
        select: { lessonId: true, completed: true },
      });
      progress = rows.map((r) => ({ lessonId: r.lessonId, completed: r.completed }));
      const done = rows.filter((r) => r.completed).length;
      progressPercent = Math.round((done / lessonIds.length) * 1000) / 10;
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: prismaUserId, courseId: tree.id } },
      select: { progressPercent: true },
    });
    if (enrollment) progressPercent = enrollment.progressPercent;
  }

  return NextResponse.json({ course: tree, progress, progressPercent });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const action = String(body.action || '');

  try {
    if (action === 'mark_progress') {
      const courseId = String(body.courseId || '');
      const lessonId = String(body.lessonId || '');
      if (!courseId || !lessonId) {
        return NextResponse.json({ error: 'courseId and lessonId required' }, { status: 400 });
      }

      const auth = await authorizeLearningRead({
        slug: params.slug,
        courseId,
        uid: session.uid,
        email: session.email,
      });
      if ('error' in auth) {
        const status = auth.error === 'unauthorized' ? 401 : auth.error === 'not_found' ? 404 : 403;
        return NextResponse.json({ error: auth.error }, { status });
      }

      const prismaUserId =
        auth.prismaUserId ||
        (await resolvePrismaUserId({ userId: session.uid, email: session.email }));
      if (!prismaUserId) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
      }

      await markLessonProgress({
        userId: prismaUserId,
        lessonId,
        completed: body.completed !== false,
        watchedSeconds: typeof body.watchedSeconds === 'number' ? body.watchedSeconds : undefined,
        lastPositionSec:
          typeof body.lastPositionSec === 'number' ? body.lastPositionSec : undefined,
      });

      const progressPercent = await recomputeEnrollmentProgress({
        institutionId: auth.institutionId,
        userId: prismaUserId,
        courseId: ('courseId' in auth && auth.courseId) || courseId,
      });

      return NextResponse.json({ ok: true, progressPercent });
    }

    // Curriculum mutations require staff.
    const staff = await assertOrgStaff({
      slug: params.slug,
      userId: session.uid,
      email: session.email,
    });
    if ('error' in staff) {
      return NextResponse.json({ error: staff.error }, { status: 403 });
    }

    if (action === 'add_section') {
      const section = await addCourseSection({
        institutionId: staff.institutionId,
        courseId: String(body.courseId || ''),
        title: String(body.title || ''),
        description: body.description ? String(body.description) : undefined,
      });
      return NextResponse.json({ ok: true, section });
    }
    if (action === 'add_lesson') {
      const lesson = await addLesson({
        institutionId: staff.institutionId,
        sectionId: String(body.sectionId || ''),
        title: String(body.title || ''),
        contentType: body.contentType,
        contentMarkdown: body.contentMarkdown ? String(body.contentMarkdown) : undefined,
        videoUrl: body.videoUrl ? String(body.videoUrl) : undefined,
      });
      return NextResponse.json({ ok: true, lesson });
    }
    if (action === 'publish_course') {
      const { getTenantPrisma } = await import('@/lib/eduos/tenantDb');
      const { client } = await getTenantPrisma(staff.institutionId);
      const course = await client.course.updateMany({
        where: { id: String(body.courseId || ''), institutionId: staff.institutionId },
        data: { status: 'PUBLISHED', publishedAt: new Date() },
      });
      return NextResponse.json({ ok: true, updated: course.count });
    }

    return NextResponse.json({ error: 'unknown_action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed' },
      { status: 400 },
    );
  }
}
