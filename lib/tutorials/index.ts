import { javascriptTutorial, getAllJsLessons, getJsLessonNav } from './javascript';
import { nextjsTutorial, getAllNextLessons, getNextLessonNav } from './nextjs';
import { pythonTutorial, getAllPythonLessons, getPythonLessonNav } from './python';
import { djangoTutorial, getAllDjangoLessons, getDjangoLessonNav } from './django';
import { flaskTutorial, getAllFlaskLessons, getFlaskLessonNav } from './flask';
import {
  postgresqlTutorial,
  getAllPostgresqlLessons,
  getPostgresqlLessonNav,
} from './postgresql';
import {
  mongodbTutorial,
  getAllMongodbLessons,
  getMongodbLessonNav,
} from './mongodb';
import {
  flutterTutorial,
  getAllFlutterLessons,
  getFlutterLessonNav,
} from './flutter';
import type { TutorialCourse, TutorialLesson } from './types';

export const TUTORIALS: TutorialCourse[] = [
  javascriptTutorial,
  nextjsTutorial,
  pythonTutorial,
  djangoTutorial,
  flaskTutorial,
  postgresqlTutorial,
  mongodbTutorial,
  flutterTutorial,
];

export function getTutorial(slug: string): TutorialCourse | undefined {
  return TUTORIALS.find((t) => t.slug === slug);
}

export function getTutorialLessons(courseSlug: string): TutorialLesson[] {
  if (courseSlug === 'javascript') return getAllJsLessons();
  if (courseSlug === 'nextjs') return getAllNextLessons();
  if (courseSlug === 'python') return getAllPythonLessons();
  if (courseSlug === 'django') return getAllDjangoLessons();
  if (courseSlug === 'flask') return getAllFlaskLessons();
  if (courseSlug === 'postgresql') return getAllPostgresqlLessons();
  if (courseSlug === 'mongodb') return getAllMongodbLessons();
  if (courseSlug === 'flutter') return getAllFlutterLessons();
  return [];
}

export function getTutorialLessonNav(courseSlug: string, lessonSlug: string) {
  if (courseSlug === 'javascript') return getJsLessonNav(lessonSlug);
  if (courseSlug === 'nextjs') return getNextLessonNav(lessonSlug);
  if (courseSlug === 'python') return getPythonLessonNav(lessonSlug);
  if (courseSlug === 'django') return getDjangoLessonNav(lessonSlug);
  if (courseSlug === 'flask') return getFlaskLessonNav(lessonSlug);
  if (courseSlug === 'postgresql') return getPostgresqlLessonNav(lessonSlug);
  if (courseSlug === 'mongodb') return getMongodbLessonNav(lessonSlug);
  if (courseSlug === 'flutter') return getFlutterLessonNav(lessonSlug);
  return null;
}

export function getFirstLessonSlug(course: TutorialCourse): string | undefined {
  return course.sections[0]?.lessons[0]?.slug;
}

export {
  javascriptTutorial,
  nextjsTutorial,
  pythonTutorial,
  djangoTutorial,
  flaskTutorial,
  postgresqlTutorial,
  mongodbTutorial,
  flutterTutorial,
};
