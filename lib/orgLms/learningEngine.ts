/**
 * Learning engine helpers — Prisma Course → Section → Lesson graph.
 * Preferred path for new org LMS content (Mongo teacher_courses remains during migration).
 */

import { getTenantPrisma } from '@/lib/eduos/tenantDb';
import { slugify } from '@/lib/learn/ecosystem';

export async function getCourseLearningTree(opts: {
  institutionId: string;
  courseIdOrSlug: string;
}) {
  const { client } = await getTenantPrisma(opts.institutionId);
  const course = await client.course.findFirst({
    where: {
      institutionId: opts.institutionId,
      OR: [{ id: opts.courseIdOrSlug }, { slug: opts.courseIdOrSlug }],
    },
    include: {
      sections: {
        orderBy: { sortOrder: 'asc' },
        include: {
          lessons: { orderBy: { sortOrder: 'asc' } },
        },
      },
      quizzes: { take: 20, orderBy: { createdAt: 'asc' } },
      assignments: { take: 20, orderBy: { createdAt: 'asc' } },
    },
  });
  return course;
}

export async function addCourseSection(opts: {
  institutionId: string;
  courseId: string;
  title: string;
  description?: string;
}) {
  const { client } = await getTenantPrisma(opts.institutionId);
  const course = await client.course.findFirst({
    where: { id: opts.courseId, institutionId: opts.institutionId },
    select: { id: true, sections: { select: { sortOrder: true }, orderBy: { sortOrder: 'desc' }, take: 1 } },
  });
  if (!course) throw new Error('Course not found');
  const sortOrder = (course.sections[0]?.sortOrder ?? -1) + 1;

  return client.section.create({
    data: {
      courseId: course.id,
      title: opts.title.trim().slice(0, 200),
      description: opts.description?.slice(0, 2000) || null,
      sortOrder,
    },
  });
}

export async function addLesson(opts: {
  institutionId: string;
  sectionId: string;
  title: string;
  contentType?: 'VIDEO' | 'MARKDOWN' | 'RICH_TEXT' | 'QUIZ' | 'ASSIGNMENT';
  contentMarkdown?: string;
  videoUrl?: string;
}) {
  const { client } = await getTenantPrisma(opts.institutionId);
  const section = await client.section.findFirst({
    where: {
      id: opts.sectionId,
      course: { institutionId: opts.institutionId },
    },
    include: {
      lessons: { select: { sortOrder: true }, orderBy: { sortOrder: 'desc' }, take: 1 },
    },
  });
  if (!section) throw new Error('Section not found');

  let slug = slugify(opts.title) || `lesson-${Date.now().toString(36)}`;
  const sortOrder = (section.lessons[0]?.sortOrder ?? -1) + 1;

  const lesson = await client.lesson.create({
    data: {
      sectionId: section.id,
      slug,
      title: opts.title.trim().slice(0, 200),
      contentType: opts.contentType || 'MARKDOWN',
      contentMarkdown: opts.contentMarkdown || null,
      videoUrl: opts.videoUrl || null,
      sortOrder,
    },
  });

  await client.course.update({
    where: { id: section.courseId },
    data: { lessonsCount: { increment: 1 } },
  });

  return lesson;
}

export async function markLessonProgress(opts: {
  userId: string;
  lessonId: string;
  completed?: boolean;
  watchedSeconds?: number;
  lastPositionSec?: number;
}) {
  // Progress lives on the platform identity DB (global user).
  const { prisma } = await import('@/lib/db/prisma');
  return prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: { userId: opts.userId, lessonId: opts.lessonId },
    },
    create: {
      userId: opts.userId,
      lessonId: opts.lessonId,
      completed: Boolean(opts.completed),
      watchedSeconds: opts.watchedSeconds ?? 0,
      lastPositionSec: opts.lastPositionSec ?? 0,
      completedAt: opts.completed ? new Date() : null,
    },
    update: {
      completed: opts.completed,
      watchedSeconds: opts.watchedSeconds,
      lastPositionSec: opts.lastPositionSec,
      completedAt: opts.completed ? new Date() : undefined,
    },
  });
}

export async function recomputeEnrollmentProgress(opts: {
  institutionId: string;
  userId: string;
  courseId: string;
}) {
  const { client } = await getTenantPrisma(opts.institutionId);
  const { prisma } = await import('@/lib/db/prisma');

  const lessons = await client.lesson.findMany({
    where: { section: { courseId: opts.courseId } },
    select: { id: true },
  });
  if (lessons.length === 0) return 0;

  const done = await prisma.lessonProgress.count({
    where: {
      userId: opts.userId,
      lessonId: { in: lessons.map((l) => l.id) },
      completed: true,
    },
  });
  const percent = Math.round((done / lessons.length) * 1000) / 10;

  await client.enrollment.updateMany({
    where: { userId: opts.userId, courseId: opts.courseId },
    data: {
      progressPercent: percent,
      lastAccessedAt: new Date(),
      ...(percent >= 100
        ? { status: 'COMPLETED' as const, completedAt: new Date() }
        : {}),
    },
  });

  return percent;
}
