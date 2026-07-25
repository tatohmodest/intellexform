import { javascriptTutorial, getAllJsLessons, getJsLessonNav } from './javascript';
import { nextjsTutorial, getAllNextLessons, getNextLessonNav } from './nextjs';
import type { TutorialCourse, TutorialLesson } from './types';

export const TUTORIALS: TutorialCourse[] = [javascriptTutorial, nextjsTutorial];

export function getTutorial(slug: string): TutorialCourse | undefined {
  return TUTORIALS.find((t) => t.slug === slug);
}

export function getTutorialLessons(courseSlug: string): TutorialLesson[] {
  if (courseSlug === 'javascript') return getAllJsLessons();
  if (courseSlug === 'nextjs') return getAllNextLessons();
  return [];
}

export function getTutorialLessonNav(courseSlug: string, lessonSlug: string) {
  if (courseSlug === 'javascript') return getJsLessonNav(lessonSlug);
  if (courseSlug === 'nextjs') return getNextLessonNav(lessonSlug);
  return null;
}

export function getFirstLessonSlug(course: TutorialCourse): string | undefined {
  return course.sections[0]?.lessons[0]?.slug;
}

export { javascriptTutorial, nextjsTutorial };
