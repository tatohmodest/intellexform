import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary:
      'Install Python, learn syntax, data types, control flow, functions, and the core collections.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary:
      'Level up with files, OOP, packages, virtual environments, typing, APIs, and practical tooling.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary:
      'Go pro with async, architecture, packaging, performance, and real Python projects.',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const pythonTutorial: TutorialCourse = {
  slug: 'python',
  title: 'Python Tutorial',
  shortTitle: 'Python',
  description:
    'A complete Python path from absolute beginner to advanced - clear explanations, practical examples, and projects you can actually build.',
  tagline: 'Python from zero to real projects',
  audience: 'Complete beginners to developers ready for professional Python',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'Programming',
  highlights: [
    'Friendly beginner start with real examples',
    'Core Python, OOP, files, APIs, and tooling',
    'Capstone projects you can put in a portfolio',
    'One clear idea per lesson - no fluff',
  ],
};

export function getAllPythonLessons() {
  return allLessons;
}

export function getPythonLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getPythonLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
