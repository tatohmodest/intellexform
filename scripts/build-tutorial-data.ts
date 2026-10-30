/**
 * Splits the authored tutorials (lib/tutorials/source.ts) into:
 *  - lib/tutorials/generated/catalog.json: every course and lesson without lesson bodies,
 *    small enough to bundle into the server and client.
 *  - .tutorial-content/<course>: lesson bodies keyed by lesson slug, read at request
 *    time by lib/tutorials/content.ts so they stay out of the Cloudflare Worker bundle.
 */
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import path from 'path';
import { TUTORIALS, getTutorialLessons } from '../lib/tutorials/source';
import type { ContentBlock, TutorialCourse } from '../lib/tutorials/types';

const root = path.resolve(__dirname, '..');
const catalogDir = path.join(root, 'lib/tutorials/generated');
const contentDir = path.join(root, '.tutorial-content');

rmSync(contentDir, { recursive: true, force: true });
mkdirSync(contentDir, { recursive: true });
mkdirSync(catalogDir, { recursive: true });

const courses: TutorialCourse[] = [];
const lessonOrder: Record<string, string[]> = {};

for (const course of TUTORIALS) {
  const bodies: Record<string, ContentBlock[]> = {};
  for (const section of course.sections) {
    for (const lesson of section.lessons) bodies[lesson.slug] = lesson.content;
  }
  writeFileSync(path.join(contentDir, course.slug), JSON.stringify(bodies));

  courses.push({
    ...course,
    sections: course.sections.map((section) => ({
      ...section,
      lessons: section.lessons.map((lesson) => ({ ...lesson, content: [] })),
    })),
  });
  lessonOrder[course.slug] = getTutorialLessons(course.slug).map((lesson) => lesson.slug);
}

writeFileSync(path.join(catalogDir, 'catalog.json'), JSON.stringify({ courses, lessonOrder }));
console.log(`tutorials: ${courses.length} courses exported`);
