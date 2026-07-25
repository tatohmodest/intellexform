import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary:
      'Install Node.js, learn modules/npm, core APIs, then build your first Express servers, routes, and middleware.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary:
      'Level up with REST APIs, auth, validation, MongoDB/Postgres, uploads, testing, and clean Express structure.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary:
      'Go pro with architecture, performance, security, Docker deploy, and real Node/Express projects.',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const nodejsExpressTutorial: TutorialCourse = {
  slug: 'nodejs-express',
  title: 'Node.js & Express Tutorial',
  shortTitle: 'Node.js & Express',
  description:
    'A complete Node.js and Express path from beginner to pro — modules, APIs, auth, databases, testing, and real backend projects.',
  tagline: 'Backend JavaScript that ships',
  audience: 'JavaScript learners ready to build real backend APIs and services',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'Backend',
  highlights: [
    'Node.js fundamentals before Express',
    'REST APIs, middleware, auth, and validation',
    'MongoDB and PostgreSQL integration',
    'Capstone backend projects you can ship',
  ],
};

export function getAllNodejsExpressLessons() {
  return allLessons;
}

export function getNodejsExpressLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getNodejsExpressLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
