import type { MetadataRoute } from 'next';
import { getAllCourses } from '@/lib/repo';
import { listPublicTeacherCourses } from '@/lib/learn/ecosystem';
import { TUTORIALS, getTutorialLessons } from '@/lib/tutorials';
import { getSiteUrl } from '@/lib/seo/share';

type Entry = MetadataRoute.Sitemap[number];

function entry(
  path: string,
  opts: Partial<Entry> & { changeFrequency?: Entry['changeFrequency'] } = {},
): Entry {
  const base = getSiteUrl();
  return {
    url: `${base}${path.startsWith('/') ? path : `/${path}`}`,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency ?? 'weekly',
    priority: opts.priority ?? 0.7,
  };
}

/** Public marketing + catalogue sitemap for https://intellex.loopingbinary.com */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths: { path: string; priority: number; changeFrequency: Entry['changeFrequency'] }[] =
    [
      { path: '/', priority: 1, changeFrequency: 'daily' },
      { path: '/about', priority: 0.95, changeFrequency: 'monthly' },
      { path: '/courses', priority: 0.95, changeFrequency: 'daily' },
      { path: '/tutorials', priority: 0.9, changeFrequency: 'weekly' },
      { path: '/ecosystem', priority: 0.85, changeFrequency: 'monthly' },
      { path: '/enterprise', priority: 0.85, changeFrequency: 'monthly' },
      { path: '/certifications', priority: 0.8, changeFrequency: 'monthly' },
      { path: '/internships', priority: 0.75, changeFrequency: 'monthly' },
      { path: '/junior-dev', priority: 0.75, changeFrequency: 'monthly' },
      { path: '/books', priority: 0.7, changeFrequency: 'weekly' },
      { path: '/resources', priority: 0.7, changeFrequency: 'monthly' },
      { path: '/learning', priority: 0.7, changeFrequency: 'monthly' },
      { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
      { path: '/network', priority: 0.6, changeFrequency: 'monthly' },
      { path: '/search', priority: 0.5, changeFrequency: 'weekly' },
      { path: '/login', priority: 0.4, changeFrequency: 'yearly' },
      { path: '/signup', priority: 0.75, changeFrequency: 'monthly' },
      { path: '/register', priority: 0.5, changeFrequency: 'yearly' },
    ];

  const out: MetadataRoute.Sitemap = staticPaths.map((p) =>
    entry(p.path, { priority: p.priority, changeFrequency: p.changeFrequency }),
  );

  // Free interactive tutorials + every lesson page
  for (const course of TUTORIALS) {
    out.push(
      entry(`/tutorials/${course.slug}`, {
        priority: 0.85,
        changeFrequency: 'weekly',
      }),
    );
    for (const lesson of getTutorialLessons(course.slug)) {
      out.push(
        entry(`/tutorials/${course.slug}/${lesson.slug}`, {
          priority: 0.7,
          changeFrequency: 'monthly',
        }),
      );
    }
  }

  // Mongo catalogue courses
  try {
    const courses = await getAllCourses();
    for (const c of courses) {
      if (!c?.slug) continue;
      out.push(
        entry(`/courses/${c.slug}`, {
          priority: 0.8,
          changeFrequency: 'weekly',
        }),
      );
    }
  } catch {
    /* catalogue optional at build time */
  }

  // Public instructor-published courses
  try {
    const teacherCourses = await listPublicTeacherCourses(200);
    for (const c of teacherCourses) {
      out.push(
        entry(`/courses/instructor/${c.id}`, {
          priority: 0.75,
          changeFrequency: 'weekly',
          lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
        }),
      );
    }
  } catch {
    /* optional */
  }

  return out;
}
