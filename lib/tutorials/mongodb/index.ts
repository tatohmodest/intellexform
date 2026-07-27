import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary:
      'Install MongoDB, learn documents, collections, CRUD, queries, and indexes.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary:
      'Level up with aggregation, schema design, and connect MongoDB to Node, Express, Flask, Django, and Next.js.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary:
      'Go pro with performance, security, Atlas, transactions, and real MongoDB projects.',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const mongodbTutorial: TutorialCourse = {
  slug: 'mongodb',
  title: 'MongoDB Tutorial',
  shortTitle: 'MongoDB',
  description:
    'A complete MongoDB path from beginner to pro - documents, queries, aggregation, schema design, and connecting MongoDB to Node.js, Express, Flask, Django, and Next.js.',
  tagline: 'Documents + real app connections',
  audience: 'Beginners to developers building flexible data-backed apps',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'Database',
  highlights: [
    'Document model taught clearly and practically',
    'Connect MongoDB to Node, Express, Flask, Django, Next.js',
    'Aggregation, indexes, and schema design patterns',
    'Capstone projects you can ship',
  ],
};

export function getAllMongodbLessons() {
  return allLessons;
}

export function getMongodbLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getMongodbLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
