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
import {
  dataAnalysisTutorial,
  getAllDataAnalysisLessons,
  getDataAnalysisLessonNav,
} from './data-analysis';
import {
  digitalMarketingTutorial,
  getAllDigitalMarketingLessons,
  getDigitalMarketingLessonNav,
} from './digital-marketing';
import {
  golangTutorial,
  getAllGolangLessons,
  getGolangLessonNav,
} from './golang';
import {
  dockerTutorial,
  getAllDockerLessons,
  getDockerLessonNav,
} from './docker';
import {
  nodejsExpressTutorial,
  getAllNodejsExpressLessons,
  getNodejsExpressLessonNav,
} from './nodejs-express';
import {
  nestjsTutorial,
  getAllNestjsLessons,
  getNestjsLessonNav,
} from './nestjs';
import {
  pygameTutorial,
  getAllPygameLessons,
  getPygameLessonNav,
} from './pygame';
import {
  htmlTutorial,
  getAllHtmlLessons,
  getHtmlLessonNav,
} from './html';
import {
  cssTutorial,
  getAllCssLessons,
  getCssLessonNav,
} from './css';
import type { TutorialCourse, TutorialLesson } from './types';

export const TUTORIALS: TutorialCourse[] = [
  htmlTutorial,
  cssTutorial,
  javascriptTutorial,
  nextjsTutorial,
  pythonTutorial,
  djangoTutorial,
  flaskTutorial,
  postgresqlTutorial,
  mongodbTutorial,
  flutterTutorial,
  dataAnalysisTutorial,
  digitalMarketingTutorial,
  golangTutorial,
  dockerTutorial,
  nodejsExpressTutorial,
  nestjsTutorial,
  pygameTutorial,
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
  if (courseSlug === 'data-analysis') return getAllDataAnalysisLessons();
  if (courseSlug === 'digital-marketing') return getAllDigitalMarketingLessons();
  if (courseSlug === 'golang') return getAllGolangLessons();
  if (courseSlug === 'docker') return getAllDockerLessons();
  if (courseSlug === 'nodejs-express') return getAllNodejsExpressLessons();
  if (courseSlug === 'nestjs') return getAllNestjsLessons();
  if (courseSlug === 'pygame') return getAllPygameLessons();
  if (courseSlug === 'html') return getAllHtmlLessons();
  if (courseSlug === 'css') return getAllCssLessons();
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
  if (courseSlug === 'data-analysis') return getDataAnalysisLessonNav(lessonSlug);
  if (courseSlug === 'digital-marketing') return getDigitalMarketingLessonNav(lessonSlug);
  if (courseSlug === 'golang') return getGolangLessonNav(lessonSlug);
  if (courseSlug === 'docker') return getDockerLessonNav(lessonSlug);
  if (courseSlug === 'nodejs-express') return getNodejsExpressLessonNav(lessonSlug);
  if (courseSlug === 'nestjs') return getNestjsLessonNav(lessonSlug);
  if (courseSlug === 'pygame') return getPygameLessonNav(lessonSlug);
  if (courseSlug === 'html') return getHtmlLessonNav(lessonSlug);
  if (courseSlug === 'css') return getCssLessonNav(lessonSlug);
  return null;
}

export function getFirstLessonSlug(course: TutorialCourse): string | undefined {
  return course.sections[0]?.lessons[0]?.slug;
}

export {
  htmlTutorial,
  cssTutorial,
  javascriptTutorial,
  nextjsTutorial,
  pythonTutorial,
  djangoTutorial,
  flaskTutorial,
  postgresqlTutorial,
  mongodbTutorial,
  flutterTutorial,
  dataAnalysisTutorial,
  digitalMarketingTutorial,
  golangTutorial,
  dockerTutorial,
  nodejsExpressTutorial,
  nestjsTutorial,
  pygameTutorial,
};
