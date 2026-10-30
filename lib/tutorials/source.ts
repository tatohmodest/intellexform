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
import {
  reactTutorial,
  getAllReactLessons,
  getReactLessonNav,
} from './react';
import {
  computerArchitectureTutorial,
  getAllComputerArchitectureLessons,
  getComputerArchitectureLessonNav,
} from './computer-architecture';
import {
  cppTutorial,
  getAllCppLessons,
  getCppLessonNav,
} from './cpp';
import {
  javaTutorial,
  getAllJavaLessons,
  getJavaLessonNav,
} from './java';
import {
  arduinoTutorial,
  getAllArduinoLessons,
  getArduinoLessonNav,
} from './arduino';
import {
  kubernetesTutorial,
  getAllKubernetesLessons,
  getKubernetesLessonNav,
} from './kubernetes';
import {
  rustTutorial,
  getAllRustLessons,
  getRustLessonNav,
} from './rust';
import {
  rubyOnRailsTutorial,
  getAllRubyOnRailsLessons,
  getRubyOnRailsLessonNav,
} from './ruby-on-rails';
import {
  linuxAdministrationTutorial,
  getAllLinuxAdministrationLessons,
  getLinuxAdministrationLessonNav,
} from './linux-administration';
import {
  bashScriptingTutorial,
  getAllBashScriptingLessons,
  getBashScriptingLessonNav,
} from './bash-scripting';
import {
  microsoftSuiteTutorial,
  getAllMicrosoftSuiteLessons,
  getMicrosoftSuiteLessonNav,
} from './microsoft-suite';
import {
  networkingTutorial,
  getAllNetworkingLessons,
  getNetworkingLessonNav,
} from './networking';
import type { TutorialCourse, TutorialLesson } from './types';

export const TUTORIALS: TutorialCourse[] = [
  computerArchitectureTutorial,
  htmlTutorial,
  cssTutorial,
  javascriptTutorial,
  reactTutorial,
  nextjsTutorial,
  pythonTutorial,
  djangoTutorial,
  flaskTutorial,
  postgresqlTutorial,
  mongodbTutorial,
  flutterTutorial,
  dataAnalysisTutorial,
  digitalMarketingTutorial,
  microsoftSuiteTutorial,
  networkingTutorial,
  golangTutorial,
  dockerTutorial,
  nodejsExpressTutorial,
  nestjsTutorial,
  pygameTutorial,
  cppTutorial,
  javaTutorial,
  arduinoTutorial,
  kubernetesTutorial,
  rustTutorial,
  rubyOnRailsTutorial,
  linuxAdministrationTutorial,
  bashScriptingTutorial,
];

export function getTutorial(slug: string): TutorialCourse | undefined {
  return TUTORIALS.find((t) => t.slug === slug);
}

export function getTutorialLessons(courseSlug: string): TutorialLesson[] {
  if (courseSlug === 'javascript') return getAllJsLessons();
  if (courseSlug === 'react') return getAllReactLessons();
  if (courseSlug === 'nextjs') return getAllNextLessons();
  if (courseSlug === 'python') return getAllPythonLessons();
  if (courseSlug === 'django') return getAllDjangoLessons();
  if (courseSlug === 'flask') return getAllFlaskLessons();
  if (courseSlug === 'postgresql') return getAllPostgresqlLessons();
  if (courseSlug === 'mongodb') return getAllMongodbLessons();
  if (courseSlug === 'flutter') return getAllFlutterLessons();
  if (courseSlug === 'data-analysis') return getAllDataAnalysisLessons();
  if (courseSlug === 'digital-marketing') return getAllDigitalMarketingLessons();
  if (courseSlug === 'microsoft-suite') return getAllMicrosoftSuiteLessons();
  if (courseSlug === 'networking') return getAllNetworkingLessons();
  if (courseSlug === 'golang') return getAllGolangLessons();
  if (courseSlug === 'docker') return getAllDockerLessons();
  if (courseSlug === 'nodejs-express') return getAllNodejsExpressLessons();
  if (courseSlug === 'nestjs') return getAllNestjsLessons();
  if (courseSlug === 'pygame') return getAllPygameLessons();
  if (courseSlug === 'html') return getAllHtmlLessons();
  if (courseSlug === 'css') return getAllCssLessons();
  if (courseSlug === 'computer-architecture') return getAllComputerArchitectureLessons();
  if (courseSlug === 'cpp') return getAllCppLessons();
  if (courseSlug === 'java') return getAllJavaLessons();
  if (courseSlug === 'arduino') return getAllArduinoLessons();
  if (courseSlug === 'kubernetes') return getAllKubernetesLessons();
  if (courseSlug === 'rust') return getAllRustLessons();
  if (courseSlug === 'ruby-on-rails') return getAllRubyOnRailsLessons();
  if (courseSlug === 'linux-administration') return getAllLinuxAdministrationLessons();
  if (courseSlug === 'bash-scripting') return getAllBashScriptingLessons();
  return [];
}

export function getTutorialLessonNav(courseSlug: string, lessonSlug: string) {
  if (courseSlug === 'javascript') return getJsLessonNav(lessonSlug);
  if (courseSlug === 'react') return getReactLessonNav(lessonSlug);
  if (courseSlug === 'nextjs') return getNextLessonNav(lessonSlug);
  if (courseSlug === 'python') return getPythonLessonNav(lessonSlug);
  if (courseSlug === 'django') return getDjangoLessonNav(lessonSlug);
  if (courseSlug === 'flask') return getFlaskLessonNav(lessonSlug);
  if (courseSlug === 'postgresql') return getPostgresqlLessonNav(lessonSlug);
  if (courseSlug === 'mongodb') return getMongodbLessonNav(lessonSlug);
  if (courseSlug === 'flutter') return getFlutterLessonNav(lessonSlug);
  if (courseSlug === 'data-analysis') return getDataAnalysisLessonNav(lessonSlug);
  if (courseSlug === 'digital-marketing') return getDigitalMarketingLessonNav(lessonSlug);
  if (courseSlug === 'microsoft-suite') return getMicrosoftSuiteLessonNav(lessonSlug);
  if (courseSlug === 'networking') return getNetworkingLessonNav(lessonSlug);
  if (courseSlug === 'golang') return getGolangLessonNav(lessonSlug);
  if (courseSlug === 'docker') return getDockerLessonNav(lessonSlug);
  if (courseSlug === 'nodejs-express') return getNodejsExpressLessonNav(lessonSlug);
  if (courseSlug === 'nestjs') return getNestjsLessonNav(lessonSlug);
  if (courseSlug === 'pygame') return getPygameLessonNav(lessonSlug);
  if (courseSlug === 'html') return getHtmlLessonNav(lessonSlug);
  if (courseSlug === 'css') return getCssLessonNav(lessonSlug);
  if (courseSlug === 'computer-architecture') return getComputerArchitectureLessonNav(lessonSlug);
  if (courseSlug === 'cpp') return getCppLessonNav(lessonSlug);
  if (courseSlug === 'java') return getJavaLessonNav(lessonSlug);
  if (courseSlug === 'arduino') return getArduinoLessonNav(lessonSlug);
  if (courseSlug === 'kubernetes') return getKubernetesLessonNav(lessonSlug);
  if (courseSlug === 'rust') return getRustLessonNav(lessonSlug);
  if (courseSlug === 'ruby-on-rails') return getRubyOnRailsLessonNav(lessonSlug);
  if (courseSlug === 'linux-administration') return getLinuxAdministrationLessonNav(lessonSlug);
  if (courseSlug === 'bash-scripting') return getBashScriptingLessonNav(lessonSlug);
  return null;
}

export function getFirstLessonSlug(course: TutorialCourse): string | undefined {
  return course.sections[0]?.lessons[0]?.slug;
}

export {
  computerArchitectureTutorial,
  htmlTutorial,
  cssTutorial,
  javascriptTutorial,
  reactTutorial,
  nextjsTutorial,
  pythonTutorial,
  djangoTutorial,
  flaskTutorial,
  postgresqlTutorial,
  mongodbTutorial,
  flutterTutorial,
  dataAnalysisTutorial,
  digitalMarketingTutorial,
  networkingTutorial,
  golangTutorial,
  dockerTutorial,
  nodejsExpressTutorial,
  nestjsTutorial,
  pygameTutorial,
  cppTutorial,
  javaTutorial,
  arduinoTutorial,
  kubernetesTutorial,
  rustTutorial,
  rubyOnRailsTutorial,
  linuxAdministrationTutorial,
  bashScriptingTutorial,
  microsoftSuiteTutorial,
};
