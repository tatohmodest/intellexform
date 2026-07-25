import { javascriptTutorial, getAllJsLessons, getJsLessonNav } from './javascript';
import { nextjsTutorial, getAllNextLessons, getNextLessonNav } from './nextjs';
import { pythonTutorial, getAllPythonLessons, getPythonLessonNav } from './python';
import { djangoTutorial, getAllDjangoLessons, getDjangoLessonNav } from './django';
import type { TutorialCourse, TutorialLesson } from './types';

export const TUTORIALS: TutorialCourse[] = [
  javascriptTutorial,
  nextjsTutorial,
  pythonTutorial,
  djangoTutorial,
];

export function getTutorial(slug: string): TutorialCourse | undefined {
  return TUTORIALS.find((t) => t.slug === slug);
}

export function getTutorialLessons(courseSlug: string): TutorialLesson[] {
  if (courseSlug === 'javascript') return getAllJsLessons();
  if (courseSlug === 'nextjs') return getAllNextLessons();
  if (courseSlug === 'python') return getAllPythonLessons();
  if (courseSlug === 'django') return getAllDjangoLessons();
  return [];
}

export function getTutorialLessonNav(courseSlug: string, lessonSlug: string) {
  if (courseSlug === 'javascript') return getJsLessonNav(lessonSlug);
  if (courseSlug === 'nextjs') return getNextLessonNav(lessonSlug);
  if (courseSlug === 'python') return getPythonLessonNav(lessonSlug);
  if (courseSlug === 'django') return getDjangoLessonNav(lessonSlug);
  return null;
}

export function getFirstLessonSlug(course: TutorialCourse): string | undefined {
  return course.sections[0]?.lessons[0]?.slug;
}

export { javascriptTutorial, nextjsTutorial, pythonTutorial, djangoTutorial };
