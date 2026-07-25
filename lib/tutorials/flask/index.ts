import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary:
      'Install Flask, learn routing, Jinja templates, forms, sessions, and clean app structure.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary:
      'Level up with SQLAlchemy, auth, blueprints, APIs, uploads, and testing.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary:
      'Go pro with deployment, architecture, performance, and real Flask projects.',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const flaskTutorial: TutorialCourse = {
  slug: 'flask',
  title: 'Flask Tutorial',
  shortTitle: 'Flask',
  description:
    'A complete Flask path from beginner to pro — lightweight Python web apps with routes, Jinja, SQLAlchemy, auth, APIs, and deployment.',
  tagline: 'Lightweight Python web with Flask',
  audience: 'Python learners who want flexible, from-scratch web apps',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'Backend',
  highlights: [
    'Routing, Jinja, forms, and sessions made clear',
    'SQLAlchemy, auth, blueprints, and REST APIs',
    'Deployable architecture patterns',
    'Capstone projects you can ship',
  ],
};

export function getAllFlaskLessons() {
  return allLessons;
}

export function getFlaskLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getFlaskLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
