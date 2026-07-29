import type { MetadataRoute } from 'next';
import { getAllCourses } from '@/lib/repo';
import { listPublicTeacherCourses } from '@/lib/learn/ecosystem';
import { TUTORIALS, getTutorialLessons } from '@/lib/tutorials';
import { CANONICAL_SITE_URL } from '@/lib/platformHosts';
import { getSiteUrl } from '@/lib/seo/share';

type Entry = MetadataRoute.Sitemap[number];

/** Prefer canonical production origin so GSC never sees a preview/vercel host. */
export function sitemapBaseUrl(): string {
  const site = getSiteUrl();
  if (!site || site.includes('vercel.app') || site.includes('localhost')) {
    return CANONICAL_SITE_URL;
  }
  return site;
}

function entry(
  path: string,
  opts: Partial<Entry> & { changeFrequency?: Entry['changeFrequency'] } = {},
): Entry {
  const base = sitemapBaseUrl();
  return {
    url: `${base}${path.startsWith('/') ? path : `/${path}`}`,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency ?? 'weekly',
    priority: opts.priority ?? 0.7,
  };
}

async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallback), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Build the full public sitemap. Mongo lookups are time-capped so Googlebot
 * never hits a hung edge function (common GSC "Couldn't fetch" cause).
 */
export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const staticPaths: {
    path: string;
    priority: number;
    changeFrequency: Entry['changeFrequency'];
  }[] = [
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

  const courses = await withTimeout(getAllCourses().catch(() => []), 2500, []);
  for (const c of courses) {
    if (!c?.slug) continue;
    out.push(
      entry(`/courses/${c.slug}`, {
        priority: 0.8,
        changeFrequency: 'weekly',
      }),
    );
  }

  const teacherCourses = await withTimeout(
    listPublicTeacherCourses(200).catch(() => []),
    2500,
    [],
  );
  for (const c of teacherCourses) {
    out.push(
      entry(`/courses/instructor/${c.id}`, {
        priority: 0.75,
        changeFrequency: 'weekly',
        lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
      }),
    );
  }

  return out;
}

/** Serialize MetadataRoute.Sitemap to XML Google accepts. */
export function sitemapEntriesToXml(entries: MetadataRoute.Sitemap): string {
  const body = entries
    .map((item) => {
      const lastmod =
        item.lastModified instanceof Date
          ? item.lastModified.toISOString()
          : item.lastModified
            ? new Date(item.lastModified).toISOString()
            : new Date().toISOString();
      const changefreq = item.changeFrequency
        ? `\n<changefreq>${item.changeFrequency}</changefreq>`
        : '';
      const priority =
        typeof item.priority === 'number' ? `\n<priority>${item.priority}</priority>` : '';
      return `<url>\n<loc>${escapeXml(item.url)}</loc>\n<lastmod>${lastmod}</lastmod>${changefreq}${priority}\n</url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
