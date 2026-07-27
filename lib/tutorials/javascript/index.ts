import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary: 'Start from zero. Learn syntax, data, control flow, functions, and the DOM.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary: 'Level up with modern JS, async code, classes, modules, Fetch, and stronger DOM skills.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary: 'Go pro with the event loop, performance patterns, Web APIs, architecture, and projects.',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const javascriptTutorial: TutorialCourse = {
  slug: 'javascript',
  title: 'JavaScript Tutorial',
  shortTitle: 'JavaScript',
  description:
    'A complete frontend JavaScript path from absolute beginner to advanced - section by section, with clear explanations, examples, and practice prompts.',
  tagline: 'Frontend JavaScript, beginner to pro',
  audience: 'Complete beginners to intermediate developers ready to go advanced',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'Frontend',
  highlights: [
    'Clear explanations with real browser examples',
    'Practice prompts after every lesson',
    'Capstone mini-projects at the end',
    'No fluff - one idea per section',
  ],
};

export function getAllJsLessons() {
  return allLessons;
}

export function getJsLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getJsLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
