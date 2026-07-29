import { getAllCourses } from '@/lib/repo';
import { getCatalog } from '@/lib/learn/catalog';
import { getEnrollments, getProgress } from '@/lib/learn/repo';
import {
  listPublicTeacherCourses,
  listStudentCourseEnrollments,
  getTeacherCoursesByIds,
} from '@/lib/learn/ecosystem';
import { getLiveClassesForCourses } from '@/lib/learn/courseClassSessions';
import { courseDurationHours, type CourseDeliveryMode } from '@/lib/learn/courseTypes';
import type { Course } from '@/lib/types';

/**
 * Legacy Prisma sync helper - kept for admin / one-off use.
 * Do NOT call from the My Courses page hot path (it upserts every course
 * sequentially and makes the route feel stuck).
 */
export async function syncCoursesToSupabase(): Promise<{ synced: number }> {
  // Lazy import so the hot path does not pull Prisma unless explicitly synced.
  const { syncCoursesToSupabaseImpl } = await import('@/lib/learn/myCoursesSync');
  return syncCoursesToSupabaseImpl();
}

export type MyCourseCard = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  tag: string;
  color: string;
  thumbnailUrl: string | null;
  totalLessons: number;
  totalMinutes: number;
  priceXaf: number;
  pricingType: string;
  enrolled: boolean;
  doneCount: number;
  pct: number;
  href: string;
  continueHref: string;
  source: 'tutorial' | 'catalogue' | 'instructor';
  kind: 'free' | 'tutoring' | 'self-paced' | 'catalogue' | 'instructor';
  /** Instructor-authored course extras */
  instructorName?: string | null;
  deliveryMode?: CourseDeliveryMode | null;
  certificate?: boolean;
  level?: string | null;
  /** Live course class currently in progress (students can join). */
  liveSession?: {
    id: string;
    channel: string;
    startAt: string;
    instructorName: string;
  } | null;
};

export type MyCourseSection = {
  id: string;
  title: string;
  subtitle: string;
  live?: boolean;
  courses: MyCourseCard[];
};

function parseDurationMinutes(raw: string | undefined): number {
  const m = String(raw || '').match(/(\d+)/);
  if (!m) return 0;
  const n = Number(m[1]) || 0;
  return String(raw).includes('h') ? n * 60 : n;
}

function catalogueKind(c: Course): MyCourseCard['kind'] {
  if (c.featured && !c.selfPaced) return 'tutoring';
  if (c.selfPaced) return 'self-paced';
  if (!c.currentPrice || c.currentPrice <= 0) return 'free';
  return 'catalogue';
}

/**
 * Fast My Courses payload - Mongo + in-memory tutorial catalog only.
 * No per-request Prisma upsert storm.
 */
export async function getMyCourseSections(userId: string): Promise<{
  sections: MyCourseSection[];
  total: number;
  inProgress: number;
}> {
  const [enrollments, progress, instructorCourses, myEnrollments, mongoCourses] =
    await Promise.all([
      getEnrollments(userId).catch(() => []),
      getProgress(userId).catch(() => []),
      listPublicTeacherCourses(100).catch(() => []),
      listStudentCourseEnrollments(userId).catch(() => []),
      getAllCourses().catch(() => [] as Course[]),
    ]);

  const enrolledSlugs = new Set(enrollments.map((e) => e.courseSlug));
  const completedByCourse = new Map<string, Set<string>>();
  for (const p of progress) {
    if (!completedByCourse.has(p.courseSlug)) completedByCourse.set(p.courseSlug, new Set());
    completedByCourse.get(p.courseSlug)!.add(p.lessonSlug);
  }

  // Free tutorial tracks (in-memory - instant).
  const freeTrackCards: MyCourseCard[] = getCatalog().map((track) => {
    const enrolled = enrolledSlugs.has(track.slug);
    const done = completedByCourse.get(track.slug) ?? new Set<string>();
    const totalLessons = track.totalLessons || done.size || 0;
    const pct = totalLessons ? Math.round((done.size / totalLessons) * 100) : enrolled ? 5 : 0;
    return {
      id: `tutorial:${track.slug}`,
      slug: track.slug,
      title: track.title,
      subtitle: track.shortTitle,
      tagline: track.tagline,
      tag: track.tag || 'Free',
      color: track.color || '#00b369',
      thumbnailUrl: track.logo,
      totalLessons,
      totalMinutes: track.totalMinutes,
      priceXaf: 0,
      pricingType: 'FREE',
      enrolled,
      doneCount: done.size,
      pct,
      href: `/dashboard/courses/${track.slug}`,
      continueHref: `/dashboard/courses/${track.slug}`,
      source: 'tutorial',
      kind: 'free',
    };
  });

  // Marketing / paid catalogue from Mongo (one query).
  const catalogueCards: MyCourseCard[] = mongoCourses
    .map((c): MyCourseCard | null => {
      const slug = String(c.slug || '').trim();
      if (!slug) return null;
      const kind = catalogueKind(c);
      const enrolled = enrolledSlugs.has(slug);
      const done = completedByCourse.get(slug) ?? new Set<string>();
      const price = Math.max(0, Number(c.currentPrice) || 0);
      return {
        id: String(c.id || slug),
        slug,
        title: c.name,
        subtitle: c.instructor || '',
        tagline: c.shortDescription || '',
        tag: c.type || (kind === 'tutoring' ? 'Tutoring' : 'Course'),
        color: '#00b369',
        thumbnailUrl: c.courseImage || null,
        totalLessons: 0,
        totalMinutes: parseDurationMinutes(c.courseDuration),
        priceXaf: price,
        pricingType: price > 0 ? 'ONE_TIME' : 'FREE',
        enrolled,
        doneCount: done.size,
        pct: enrolled ? 5 : 0,
        href: `/courses/${slug}`,
        continueHref: `/courses/${slug}`,
        source: 'catalogue',
        kind,
      };
    })
    .filter((c): c is MyCourseCard => c != null);

  // Avoid duplicating free tracks that also appear in Mongo as free catalogue rows.
  const freeSlugs = new Set(freeTrackCards.map((c) => c.slug));
  const mongoNotInTutorials = catalogueCards.filter((c) => !freeSlugs.has(c.slug));

  const cards: MyCourseCard[] = [...freeTrackCards, ...mongoNotInTutorials];

  // Enrolled instructor courses - one batched Mongo query instead of N finds.
  let enrolledTeacherCards: MyCourseCard[] = [];
  let instructorCards: MyCourseCard[] = [];

  try {
    const enrolledTeacherIds = Array.from(
      new Set(myEnrollments.map((e) => String(e.courseId || '')).filter(Boolean)),
    );
    const teacherById = new Map(
      (await getTeacherCoursesByIds(enrolledTeacherIds)).map((c) => [c.id, c]),
    );
    const enrolledTeacherIdSet = new Set(enrolledTeacherIds);
    const liveByCourse = await getLiveClassesForCourses(enrolledTeacherIds);

    enrolledTeacherCards = myEnrollments
      .map((e): MyCourseCard | null => {
        const courseId = String(e.courseId || '');
        if (!courseId) return null;
        const c = teacherById.get(courseId);
        const price = Number(e.priceXAF) || 0;
        const live = liveByCourse.get(courseId) || null;
        const liveSession = live
          ? {
              id: live.id,
              channel: live.channel,
              startAt: live.startAt,
              instructorName: live.instructorName,
            }
          : null;
        if (!c) {
          return {
            id: courseId,
            slug: courseId,
            title: String(e.courseTitle || 'Course'),
            subtitle: '',
            tagline: e.source === 'instructor' ? 'Added by your instructor' : 'Enrolled',
            tag: 'Enrolled',
            color: '#00b369',
            thumbnailUrl: null,
            totalLessons: 0,
            totalMinutes: 0,
            priceXaf: price,
            pricingType: price > 0 ? 'PAID' : 'FREE',
            enrolled: true,
            doneCount: 0,
            pct: 5,
            href: `/dashboard/courses/instructor/${courseId}`,
            continueHref: `/dashboard/courses/instructor/${courseId}`,
            source: 'instructor',
            kind: 'instructor',
            liveSession,
          };
        }
        const hours = courseDurationHours(c);
        const lessons = Array.isArray(c.lessons) ? c.lessons : [];
        return {
          id: c.id,
          slug: c.id,
          title: String(c.title || e.courseTitle || 'Course'),
          subtitle: String(c.subtitle || ''),
          tagline:
            e.source === 'instructor'
              ? 'Added by your instructor'
              : price > 0
                ? 'Purchased'
                : 'Enrolled',
          tag: String(c.category || 'Enrolled'),
          color: String(c.accent || '#00b369'),
          thumbnailUrl: c.coverUrl ? String(c.coverUrl) : null,
          totalLessons: lessons.length,
          totalMinutes: Math.round(hours * 60) || 0,
          priceXaf: Number(c.priceXAF) || 0,
          pricingType: (Number(c.priceXAF) || 0) > 0 ? 'PAID' : 'FREE',
          enrolled: true,
          doneCount: 0,
          pct: 5,
          href: `/dashboard/courses/instructor/${c.id}`,
          continueHref: `/dashboard/courses/instructor/${c.id}`,
          source: 'instructor',
          kind: 'instructor',
          instructorName: c.instructorName || c.authorName || null,
          deliveryMode: c.deliveryMode ?? 'self_paced',
          certificate: Boolean(c.certificate),
          level: c.level && c.level !== 'all' ? c.level : null,
          liveSession,
        };
      })
      .filter((c): c is MyCourseCard => c != null);

    instructorCards = instructorCourses
      .filter((c) => c?.id && !enrolledTeacherIdSet.has(c.id))
      .map((c): MyCourseCard => {
        const hours = courseDurationHours(c);
        const lessons = Array.isArray(c.lessons) ? c.lessons : [];
        return {
          id: c.id,
          slug: c.id,
          title: String(c.title || 'Course'),
          subtitle: String(c.subtitle || ''),
          tagline: String(c.subtitle || c.description || ''),
          tag: String(c.category || 'Instructor'),
          color: String(c.accent || '#00b369'),
          thumbnailUrl: c.coverUrl ? String(c.coverUrl) : null,
          totalLessons: lessons.length,
          totalMinutes: Math.round(hours * 60) || 0,
          priceXaf: Number(c.priceXAF) || 0,
          pricingType: (Number(c.priceXAF) || 0) > 0 ? 'PAID' : 'FREE',
          enrolled: false,
          doneCount: 0,
          pct: 0,
          href: `/courses/instructor/${c.id}`,
          continueHref: `/courses/instructor/${c.id}`,
          source: 'instructor',
          kind: 'instructor',
          instructorName: c.instructorName || c.authorName || null,
          deliveryMode: c.deliveryMode ?? 'self_paced',
          certificate: Boolean(c.certificate),
          level: c.level && c.level !== 'all' ? c.level : null,
        };
      });
  } catch (err) {
    console.error('instructor course sections failed:', err);
  }

  const inProgress = [
    ...cards.filter((c) => c.enrolled),
    ...enrolledTeacherCards,
  ];
  const free = cards.filter((c) => c.kind === 'free' && !c.enrolled);
  const tutoring = cards.filter((c) => c.kind === 'tutoring' && !c.enrolled);
  const selfPaced = cards.filter((c) => c.kind === 'self-paced' && !c.enrolled);
  const paidCatalogue = cards.filter(
    (c) => c.kind === 'catalogue' && c.pricingType !== 'FREE' && !c.enrolled,
  );

  const sections: MyCourseSection[] = [
    {
      id: 'enrolled',
      title: 'Your courses',
      subtitle: 'Courses you are enrolled in right now',
      live: inProgress.some((c) => Boolean(c.liveSession)),
      courses: inProgress,
    },
    {
      id: 'instructors',
      title: 'From instructors',
      subtitle: 'Courses created by InTelleX instructors',
      courses: instructorCards,
    },
    {
      id: 'suggested-free',
      title: 'Suggested free tracks',
      subtitle: 'Beginner is free · Intermediate to Pro need a certification plan',
      courses: free,
    },
    {
      id: 'suggested-tutoring',
      title: 'Suggested tutoring',
      subtitle: 'Instructor-led programmes you can join next',
      live: true,
      courses: tutoring,
    },
    {
      id: 'suggested-self-paced',
      title: 'Suggested self-paced',
      subtitle: 'Guided programmes at your speed',
      courses: selfPaced,
    },
    {
      id: 'suggested-catalogue',
      title: 'More to explore',
      subtitle: 'Catalogue courses you have not started yet',
      courses: paidCatalogue,
    },
  ].filter((s) => s.courses.length > 0);

  const payload = {
    sections,
    total: cards.length + instructorCards.length + enrolledTeacherCards.length,
    inProgress: inProgress.length,
  };
  return JSON.parse(JSON.stringify(payload)) as typeof payload;
}
