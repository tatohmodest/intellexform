/**
 * Lesson bodies, kept out of the server bundle. On Cloudflare they are private Worker
 * assets under /_tc (wrangler.jsonc routes public requests for them to the app, where
 * middleware.ts 404s them); everywhere else they are read from .tutorial-content on disk.
 */
import type { ContentBlock } from './types';
import { TUTORIALS } from './index';

type CourseContent = Record<string, ContentBlock[]>;

const loaded = new Map<string, CourseContent>();
const pending = new Map<string, Promise<CourseContent>>();

async function readCourseFile(courseSlug: string): Promise<CourseContent> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    const assets = (env as { ASSETS?: { fetch: typeof fetch } }).ASSETS;
    if (assets) {
      const res = await assets.fetch(`https://assets.local/_tc/${courseSlug}`);
      return res.ok ? ((await res.json()) as CourseContent) : {};
    }
  } catch {
    // Not running on Cloudflare: fall through to the local file.
  }
  const { readFile } = await import('fs/promises');
  const path = await import('path');
  try {
    const raw = await readFile(path.join(process.cwd(), '.tutorial-content', courseSlug), 'utf8');
    return JSON.parse(raw) as CourseContent;
  } catch {
    return {};
  }
}

export async function loadCourseContent(courseSlug: string): Promise<CourseContent> {
  const hit = loaded.get(courseSlug);
  if (hit) return hit;
  let p = pending.get(courseSlug);
  if (!p) {
    p = readCourseFile(courseSlug).then((content) => {
      loaded.set(courseSlug, content);
      pending.delete(courseSlug);
      return content;
    });
    pending.set(courseSlug, p);
  }
  return p;
}

export async function getLessonContent(courseSlug: string, lessonSlug: string): Promise<ContentBlock[]> {
  return (await loadCourseContent(courseSlug))[lessonSlug] ?? [];
}

/** Load every course's lessons so lessonContentSync() works for all of them. */
export async function loadAllTutorialContent(): Promise<void> {
  await Promise.all(TUTORIALS.map((course) => loadCourseContent(course.slug)));
}

/** Lesson body for code that runs after loadAllTutorialContent() / loadCourseContent(). */
export function lessonContentSync(courseSlug: string, lessonSlug: string): ContentBlock[] {
  return loaded.get(courseSlug)?.[lessonSlug] ?? [];
}
