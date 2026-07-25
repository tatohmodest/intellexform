import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary:
      'Set up Next.js, learn JSX/components/props inside the App Router, and build interactive UI with the right React hooks.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary:
      'Fetch data, use Server Actions, middleware, auth patterns, databases, and the React tools real Next.js apps need.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary:
      'Master RSC composition, performance, architecture, and ship portfolio-ready Next.js projects.',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const nextjsTutorial: TutorialCourse = {
  slug: 'nextjs',
  title: 'Next.js Tutorial',
  shortTitle: 'Next.js',
  description:
    'A complete Next.js App Router path from beginner to pro — with every React skill taught inside Next.js when you need it. No separate React course required.',
  tagline: 'Next.js first. React included.',
  audience: 'JavaScript learners ready to build real apps with Next.js',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'Full-stack',
  highlights: [
    'Skip a separate React course — learn React inside Next.js',
    'App Router, Server Components, and Server Actions',
    'Auth, database, and deployment patterns',
    'Four capstone mini-projects',
  ],
};

export function getAllNextLessons() {
  return allLessons;
}

export function getNextLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getNextLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
