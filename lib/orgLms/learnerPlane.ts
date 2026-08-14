/**
 * Prisma-first learner data plane for org LMS enrollments & progress.
 * Merged into dashboard reads so Mongo is no longer the only source of truth.
 */

import { prisma } from '@/lib/db/prisma';
import type { EnrollmentDoc, ProgressDoc } from '@/lib/learn/repo';

/** Resolve platform User id from LoopingBinary session uid and/or email. */
export async function resolvePrismaUserId(opts: {
  userId?: string | null;
  email?: string | null;
}): Promise<string | null> {
  if (opts.email) {
    const byEmail = await prisma.user.findUnique({
      where: { email: opts.email.trim().toLowerCase() },
      select: { id: true },
    });
    if (byEmail) return byEmail.id;
  }
  if (opts.userId) {
    const byLb = await prisma.user.findFirst({
      where: {
        OR: [{ id: opts.userId }, { loopingBinaryId: opts.userId }],
      },
      select: { id: true },
    });
    if (byLb) return byLb.id;
  }
  return null;
}

/**
 * Org LMS enrollments as EnrollmentDoc-compatible rows.
 * courseSlug uses `org:{institutionSlug}/{courseSlug}` so catalogue tracks stay distinct.
 */
export async function listPrismaEnrollmentsForUser(
  prismaUserId: string,
): Promise<EnrollmentDoc[]> {
  const rows = await prisma.enrollment.findMany({
    where: { userId: prismaUserId, status: { in: ['ACTIVE', 'COMPLETED'] } },
    orderBy: [{ lastAccessedAt: 'desc' }, { enrolledAt: 'desc' }],
    include: {
      course: {
        select: {
          slug: true,
          institution: { select: { slug: true } },
        },
      },
    },
    take: 200,
  });

  return rows.map((e) => ({
    userId: prismaUserId,
    courseSlug: `org:${e.course.institution.slug}/${e.course.slug}`,
    enrolledAt: e.enrolledAt,
    lastTouchedAt: e.lastAccessedAt || e.enrolledAt,
    completedAt: e.completedAt,
  }));
}

export async function listPrismaProgressForUser(
  prismaUserId: string,
  courseSlugFilter?: string,
): Promise<ProgressDoc[]> {
  const progress = await prisma.lessonProgress.findMany({
    where: {
      userId: prismaUserId,
      completed: true,
    },
    include: {
      lesson: {
        select: {
          slug: true,
          durationSeconds: true,
          section: {
            select: {
              course: {
                select: {
                  slug: true,
                  institution: { select: { slug: true } },
                },
              },
            },
          },
        },
      },
    },
    take: 2000,
  });

  const docs: ProgressDoc[] = [];
  for (const p of progress) {
    const course = p.lesson.section.course;
    const slug = `org:${course.institution.slug}/${course.slug}`;
    if (courseSlugFilter && slug !== courseSlugFilter && course.slug !== courseSlugFilter) {
      continue;
    }
    docs.push({
      userId: prismaUserId,
      courseSlug: slug,
      lessonSlug: p.lesson.slug,
      completedAt: p.completedAt || p.updatedAt,
      minutes: Math.max(1, Math.round((p.watchedSeconds || p.lesson.durationSeconds || 0) / 60)),
    });
  }
  return docs;
}

/** Assert learner is enrolled (or staff) for a course in an org. */
export async function assertOrgLearnerAccess(opts: {
  institutionId: string;
  courseIdOrSlug: string;
  prismaUserId: string;
}): Promise<{ courseId: string; enrolled: boolean } | { error: string }> {
  const course = await prisma.course.findFirst({
    where: {
      institutionId: opts.institutionId,
      OR: [{ id: opts.courseIdOrSlug }, { slug: opts.courseIdOrSlug }],
    },
    select: { id: true },
  });
  if (!course) return { error: 'not_found' };

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId: opts.prismaUserId, courseId: course.id },
    },
    select: { status: true },
  });

  const membership = await prisma.institutionMembership.findUnique({
    where: {
      institutionId_userId: {
        institutionId: opts.institutionId,
        userId: opts.prismaUserId,
      },
    },
    select: { role: true, isActive: true, suspendedAt: true },
  });

  const staffRoles = new Set([
    'INSTITUTION_OWNER',
    'ORG_ADMIN',
    'DEPARTMENT_ADMIN',
    'INSTRUCTOR',
    'MENTOR',
    'STAFF',
    'TEACHING_ASSISTANT',
  ]);

  const isStaff =
    membership &&
    membership.isActive &&
    !membership.suspendedAt &&
    staffRoles.has(membership.role);

  const enrolled = Boolean(
    enrollment && enrollment.status !== 'CANCELLED' && enrollment.status !== 'EXPIRED',
  );
  if (!enrolled && !isStaff) return { error: 'forbidden' };

  return { courseId: course.id, enrolled: enrolled || Boolean(isStaff) };
}
