import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary: 'JSX, components, props, lists, state, forms, and thinking in React.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary: 'Effects, custom hooks, context, refs, routing, and data-fetching patterns.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary: 'Performance, error boundaries, concurrent UI, testing, architecture, and a capstone player.',
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
    'A complete React path from JSX and components to hooks, data flow, performance, and a lesson-player capstone — the foundation before Next.js.',
  tagline: 'Components, hooks, and modern React UI',
  audience: 'JavaScript developers ready to build interactive UIs with React',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'Frontend',
  highlights: [
    'JSX, components, props, and state from first principles',
    'Hooks deep-dive: useState, useEffect, custom hooks, context',
    'Performance and concurrent patterns for real apps',
    'Capstone lesson player that mirrors InTelleX',
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
