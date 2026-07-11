import { Course } from '@/lib/types';

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80) || `course-${Date.now()}`;
}

/** The fields an admin may edit; used to build a safe update/insert payload. */
export function normalizeCoursePayload(body: Record<string, unknown>): Partial<Course> {
  const num = (v: unknown, def = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : def;
  };
  const bool = (v: unknown) => v === true || v === 'true' || v === 'on';
  const str = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));

  const learn = body.whatYouWillLearn;
  let whatYouWillLearn: string[] = [];
  if (Array.isArray(learn)) whatYouWillLearn = learn.map((x) => String(x)).filter(Boolean);
  else if (typeof learn === 'string') whatYouWillLearn = learn.split('\n').map((s) => s.trim()).filter(Boolean);

  const patch: Partial<Course> = {
    name: str(body.name),
    instructor: str(body.instructor),
    type: str(body.type),
    shortDescription: str(body.shortDescription),
    courseDetails: str(body.courseDetails),
    prerequisites: str(body.prerequisites),
    aboutInstructor: str(body.aboutInstructor),
    courseImage: str(body.courseImage),
    courseDuration: str(body.courseDuration),
    language: str(body.language) || 'English',
    articleType: str(body.articleType) || 'Video',
    courseOrigin: str(body.courseOrigin),
    currentPrice: num(body.currentPrice),
    originalPrice: num(body.originalPrice),
    courseRating: num(body.courseRating),
    courseNumberOfVotes: num(body.courseNumberOfVotes),
    bestSeller: bool(body.bestSeller),
    featured: bool(body.featured),
    certificateOfCompletion: bool(body.certificateOfCompletion),
    accessOnMobileAndTV: bool(body.accessOnMobileAndTV),
    downloadable: bool(body.downloadable),
    whatYouWillLearn,
    courseLink: body.courseLink ? str(body.courseLink) : null,
    updatedAt: new Date().toISOString(),
  };
  return patch;
}
