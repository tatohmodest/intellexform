import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary:
      'Install Flutter, learn Dart essentials inside Flutter, and build UIs with widgets, layouts, forms, and navigation.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary:
      'Level up with state management, async/HTTP, local storage, navigation patterns, animations, and Firebase basics.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary:
      'Go pro with architecture, performance, publishing, and real Flutter projects for mobile (and beyond).',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const flutterTutorial: TutorialCourse = {
  slug: 'flutter',
  title: 'Flutter Tutorial',
  shortTitle: 'Flutter',
  description:
    'A complete Flutter path from beginner to pro - with every essential Dart skill taught inside Flutter when you need it. No separate Dart course required.',
  tagline: 'Flutter first. Dart included.',
  audience: 'Beginners to developers ready to ship cross-platform apps',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'Mobile',
  highlights: [
    'Skip a separate Dart course - learn Dart inside Flutter',
    'Widgets, layouts, navigation, and forms done right',
    'State, APIs, storage, animations, and Firebase basics',
    'Capstone apps you can put in a portfolio',
  ],
};

export function getAllFlutterLessons() {
  return allLessons;
}

export function getFlutterLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getFlutterLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
