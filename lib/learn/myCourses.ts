import {
  CoursePricingType,
  CourseStatus,
  Difficulty,
} from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { getAllCourses } from '@/lib/repo';
import { getCatalog } from '@/lib/learn/catalog';
import { getEnrollments, getProgress } from '@/lib/learn/repo';
import {
  listPublicTeacherCourses,
  listStudentCourseEnrollments,
  getTeacherCourse,
} from '@/lib/learn/ecosystem';
import { courseDurationHours, type CourseDeliveryMode } from '@/lib/learn/courseTypes';

const INTELLEX_SLUG = 'intellex';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function ensureIntellexInstitution() {
  return prisma.institution.upsert({
    where: { slug: INTELLEX_SLUG },
    update: { name: 'InTelleX', isPlatformHome: true, status: 'ACTIVE' },
    create: {
      slug: INTELLEX_SLUG,
      name: 'InTelleX',
      isPlatformHome: true,
      primaryColor: '#00B369',
      visibility: 'PUBLIC',
      status: 'ACTIVE',
      verified: true,
      verifiedAt: new Date(),
      enrollmentPolicy: 'PUBLIC_REQUEST',
      institutionType: 'ACADEMY',
      description: 'InTelleX learning catalogue',
    },
  });
}

async function ensureCategory(institutionId: string, name: string) {
  const slug = slugify(name) || 'general';
  return prisma.category.upsert({
    where: { institutionId_slug: { institutionId, slug } },
    update: { name },
    create: { institutionId, slug, name },
  });
}

/**
 * Upsert Mongo catalogue + free tutorial tracks into Supabase (Prisma)
 * so My Courses reads from one source.
 */
export async function syncCoursesToSupabase(): Promise<{ synced: number }> {
  const institution = await ensureIntellexInstitution();
  let synced = 0;

  const freeCat = await ensureCategory(institution.id, 'Free courses');
  const tutoringCat = await ensureCategory(institution.id, 'Tutoring');
  const selfPacedCat = await ensureCategory(institution.id, 'Self-paced');

  // Free tutorial tracks (dashboard learning paths)
  for (const track of getCatalog()) {
    await prisma.course.upsert({
      where: {
        institutionId_slug: { institutionId: institution.id, slug: track.slug },
      },
      create: {
        institutionId: institution.id,
        categoryId: freeCat.id,
        slug: track.slug,
        title: track.title,
        subtitle: track.shortTitle,
        shortDescription: track.tagline,
        description: track.description,
        thumbnailUrl: track.logo,
        status: CourseStatus.PUBLISHED,
        pricingType: CoursePricingType.FREE,
        priceXaf: 0,
        durationMinutes: track.totalMinutes,
        lessonsCount: track.totalLessons,
        certificateEnabled: true,
        skills: ['source:tutorial', `tag:${track.tag}`, `color:${track.color}`],
        publishedAt: new Date(),
      },
      update: {
        categoryId: freeCat.id,
        title: track.title,
        subtitle: track.shortTitle,
        shortDescription: track.tagline,
        description: track.description,
        thumbnailUrl: track.logo,
        status: CourseStatus.PUBLISHED,
        pricingType: CoursePricingType.FREE,
        priceXaf: 0,
        durationMinutes: track.totalMinutes,
        lessonsCount: track.totalLessons,
        skills: ['source:tutorial', `tag:${track.tag}`, `color:${track.color}`],
        publishedAt: new Date(),
      },
    });
    synced += 1;
  }

  // Mongo marketing / catalogue courses
  const mongoCourses = await getAllCourses();
  for (const c of mongoCourses) {
    const slug = String(c.slug || '').trim();
    if (!slug) continue;

    const isTutoring = Boolean(c.featured && !c.selfPaced);
    const isFree = !c.currentPrice || c.currentPrice <= 0;
    const typeName = (c.type || 'General').trim() || 'General';
    const typeCat = await ensureCategory(institution.id, typeName);

    let categoryId = typeCat.id;
    if (isTutoring) categoryId = tutoringCat.id;
    else if (isFree) categoryId = freeCat.id;
    else if (c.selfPaced) categoryId = selfPacedCat.id;

    const pricingType = isFree
      ? CoursePricingType.FREE
      : CoursePricingType.ONE_TIME;

    const minutes = (() => {
      const m = String(c.courseDuration || '').match(/(\d+)/);
      return m ? Number(m[1]) * (String(c.courseDuration).includes('h') ? 60 : 1) : 0;
    })();

    await prisma.course.upsert({
      where: {
        institutionId_slug: { institutionId: institution.id, slug },
      },
      create: {
        institutionId: institution.id,
        categoryId,
        slug,
        title: c.name,
        subtitle: c.instructor || undefined,
        shortDescription: c.shortDescription || c.courseDetails?.slice(0, 220),
        description: c.courseDetails || c.shortDescription,
        thumbnailUrl: c.courseImage || undefined,
        status: CourseStatus.PUBLISHED,
        pricingType,
        priceXaf: Math.max(0, Number(c.currentPrice) || 0),
        originalPriceXaf: c.originalPrice || undefined,
        durationMinutes: minutes,
        lessonsCount: 0,
        isFeatured: Boolean(c.featured),
        isBestseller: Boolean(c.bestSeller),
        certificateEnabled: Boolean(c.certificateOfCompletion),
        difficulty: Difficulty.BEGINNER,
        skills: [
          'source:catalogue',
          isTutoring ? 'kind:tutoring' : c.selfPaced ? 'kind:self-paced' : 'kind:catalogue',
          `origin:${c.courseOrigin || 'Intellex'}`,
        ],
        learningOutcomes: Array.isArray(c.whatYouWillLearn) ? c.whatYouWillLearn.slice(0, 12) : [],
        publishedAt: new Date(),
      },
      update: {
        categoryId,
        title: c.name,
        subtitle: c.instructor || undefined,
        shortDescription: c.shortDescription || c.courseDetails?.slice(0, 220),
        description: c.courseDetails || c.shortDescription,
        thumbnailUrl: c.courseImage || undefined,
        status: CourseStatus.PUBLISHED,
        pricingType,
        priceXaf: Math.max(0, Number(c.currentPrice) || 0),
        originalPriceXaf: c.originalPrice || undefined,
        durationMinutes: minutes,
        isFeatured: Boolean(c.featured),
        isBestseller: Boolean(c.bestSeller),
        certificateEnabled: Boolean(c.certificateOfCompletion),
        skills: [
          'source:catalogue',
          isTutoring ? 'kind:tutoring' : c.selfPaced ? 'kind:self-paced' : 'kind:catalogue',
          `origin:${c.courseOrigin || 'Intellex'}`,
        ],
        learningOutcomes: Array.isArray(c.whatYouWillLearn) ? c.whatYouWillLearn.slice(0, 12) : [],
        publishedAt: new Date(),
      },
    });
    synced += 1;
  }

  return { synced };
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
};

export type MyCourseSection = {
  id: string;
  title: string;
  subtitle: string;
  live?: boolean;
  courses: MyCourseCard[];
};

function skillValue(skills: string[], prefix: string): string | null {
  const hit = skills.find((s) => s.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : null;
}

/**
 * Sync Mongo → Supabase, then return categorized My Courses sections.
 */
export async function getMyCourseSections(userId: string): Promise<{
  sections: MyCourseSection[];
  total: number;
  inProgress: number;
}> {
  try {
    await syncCoursesToSupabase();
  } catch (err) {
    console.error('syncCoursesToSupabase failed:', err);
  }

  const institution = await prisma.institution.findUnique({
    where: { slug: INTELLEX_SLUG },
    select: { id: true },
  });

  const [courses, enrollments, progress, instructorCourses, myEnrollments] = await Promise.all([
    institution
      ? prisma.course.findMany({
          where: { institutionId: institution.id, status: CourseStatus.PUBLISHED },
          include: { category: { select: { slug: true, name: true } } },
          orderBy: [{ isFeatured: 'desc' }, { title: 'asc' }],
        }).catch((err) => {
          console.error('prisma courses failed:', err);
          return [];
        })
      : Promise.resolve([]),
    getEnrollments(userId).catch(() => []),
    getProgress(userId).catch(() => []),
    listPublicTeacherCourses(24).catch(() => []),
    listStudentCourseEnrollments(userId).catch(() => []),
  ]);

  const enrolledSlugs = new Set(enrollments.map((e) => e.courseSlug));
  const completedByCourse = new Map<string, Set<string>>();
  for (const p of progress) {
    if (!completedByCourse.has(p.courseSlug)) completedByCourse.set(p.courseSlug, new Set());
    completedByCourse.get(p.courseSlug)!.add(p.lessonSlug);
  }

  const cards: MyCourseCard[] = courses.map((c) => {
    const skills = c.skills ?? [];
    const source = skillValue(skills, 'source:') === 'catalogue' ? 'catalogue' : 'tutorial';
    const kindRaw = skillValue(skills, 'kind:');
    const kind: MyCourseCard['kind'] =
      kindRaw === 'tutoring'
        ? 'tutoring'
        : kindRaw === 'self-paced'
          ? 'self-paced'
          : c.pricingType === CoursePricingType.FREE
            ? 'free'
            : 'catalogue';
    const color = skillValue(skills, 'color:') || '#00b369';
    const tag =
      skillValue(skills, 'tag:') ||
      c.category?.name ||
      (kind === 'tutoring' ? 'Tutoring' : kind === 'free' ? 'Free' : 'Course');
    const enrolled = enrolledSlugs.has(c.slug);
    const done = completedByCourse.get(c.slug) ?? new Set<string>();
    const totalLessons = c.lessonsCount || done.size || 0;
    const pct = totalLessons ? Math.round((done.size / totalLessons) * 100) : enrolled ? 5 : 0;
    const href =
      source === 'tutorial' ? `/dashboard/courses/${c.slug}` : `/courses/${c.slug}`;
    const continueHref =
      source === 'tutorial' && enrolled
        ? `/dashboard/courses/${c.slug}`
        : href;

    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      subtitle: c.subtitle || '',
      tagline: c.shortDescription || c.subtitle || '',
      tag,
      color,
      thumbnailUrl: c.thumbnailUrl,
      totalLessons,
      totalMinutes: c.durationMinutes,
      priceXaf: c.priceXaf,
      pricingType: c.pricingType,
      enrolled,
      doneCount: done.size,
      pct,
      href,
      continueHref,
      source,
      kind,
    };
  });

  // Courses published by InTelleX instructors (Course Studio).
  let enrolledTeacherCards: MyCourseCard[] = [];
  let instructorCards: MyCourseCard[] = [];

  try {
    const enrolledTeacherIds = new Set(
      myEnrollments.map((e) => String(e.courseId || '')).filter(Boolean),
    );

    const enrolledRaw = await Promise.all(
      myEnrollments.map(async (e): Promise<MyCourseCard | null> => {
        try {
          const courseId = String(e.courseId || '');
          if (!courseId) return null;
          const c = await getTeacherCourse(courseId);
          const price = Number(e.priceXAF) || 0;
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
          };
        } catch (err) {
          console.error('enrolled teacher card failed:', err);
          return null;
        }
      }),
    );
    enrolledTeacherCards = enrolledRaw.filter((c): c is MyCourseCard => c != null);

    instructorCards = instructorCourses
      .filter((c) => c?.id && !enrolledTeacherIds.has(c.id))
      .map((c): MyCourseCard | null => {
        try {
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
        } catch (err) {
          console.error('instructor card failed:', err);
          return null;
        }
      })
      .filter((c): c is MyCourseCard => c != null);
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

  // Enrolled courses first; everything else is a suggestion below.
  const sections: MyCourseSection[] = [
    {
      id: 'enrolled',
      title: 'Your courses',
      subtitle: 'Courses you are enrolled in right now',
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

  // Strip any non-plain values before handing to the client CoursesBrowser.
  const payload = {
    sections,
    total: cards.length + instructorCards.length + enrolledTeacherCards.length,
    inProgress: inProgress.length,
  };
  return JSON.parse(JSON.stringify(payload)) as typeof payload;
}
