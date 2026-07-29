import {
  CoursePricingType,
  CourseStatus,
  Difficulty,
} from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { getAllCourses } from '@/lib/repo';
import { getCatalog } from '@/lib/learn/catalog';

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
 * Upsert Mongo catalogue + free tutorial tracks into Supabase (Prisma).
 * Heavy - only call from admin / maintenance, never from page renders.
 */
export async function syncCoursesToSupabaseImpl(): Promise<{ synced: number }> {
  const institution = await ensureIntellexInstitution();
  let synced = 0;

  const freeCat = await ensureCategory(institution.id, 'Free courses');
  const tutoringCat = await ensureCategory(institution.id, 'Tutoring');
  const selfPacedCat = await ensureCategory(institution.id, 'Self-paced');

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

    const pricingType = isFree ? CoursePricingType.FREE : CoursePricingType.ONE_TIME;

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
