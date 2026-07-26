import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary:
      'Add CSS, master selectors, the box model, typography, Flexbox basics, and ship a styled card layout.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary:
      'Build responsive layouts with media queries, Grid, variables, motion, and component styling patterns.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary:
      'Go pro with modern CSS, architecture, design tokens, accessibility, and polished layout capstones.',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const cssTutorial: TutorialCourse = {
  slug: 'css',
  title: 'CSS Tutorial',
  shortTitle: 'CSS',
  description:
    'A complete CSS path from beginner to pro - selectors, box model, Flexbox, Grid, responsive design, motion, architecture, and real UI projects.',
  tagline: 'Style interfaces that feel intentional',
  audience: 'Learners ready to turn HTML structure into polished, responsive layouts',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'Frontend',
  highlights: [
    'Box model, typography, and Flexbox foundations',
    'Responsive design with Grid and media queries',
    'Variables, transitions, and component patterns',
    'Capstones: design system, marketing page, app shell',
  ],
};

export function getAllCssLessons() {
  return allLessons;
}

export function getCssLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getCssLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
