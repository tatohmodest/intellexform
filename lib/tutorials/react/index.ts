import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary:
      'React fundamentals: mental model, Vite setup, JSX, components, props, state, forms, styling, debugging, and two mini projects.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary:
      'Effects, data fetching, custom hooks, refs, reducer, context, routing, Suspense, validation, portals, and a notes app project.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary:
      'Performance, concurrent UI, error boundaries, a11y, testing, TypeScript, architecture, profiling, capstone player, deploy, and Next.js.',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const reactTutorial: TutorialCourse = {
  slug: 'react',
  title: 'React Tutorial',
  shortTitle: 'React',
  description:
    'A complete 49-lesson React path from JSX and components through hooks, routing, performance, testing, architecture, and an InTelleX-style lesson player capstone - the foundation before Next.js.',
  tagline: 'Components, hooks, and modern React UI',
  audience: 'JavaScript developers ready to build interactive UIs with React',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'Frontend',
  highlights: [
    '49 lessons from UI = f(state) through production-ready patterns',
    'Deep hooks coverage: useState, useEffect, useReducer, context, and custom hooks',
    'React Router, Suspense, performance, Vitest testing, and TypeScript',
    'Capstone lesson player with deploy checklist and a bridge to Next.js',
  ],
};

export function getAllReactLessons() {
  return allLessons;
}

export function getReactLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getReactLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
