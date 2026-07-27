import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary:
      'Install PostgreSQL, learn SQL fundamentals, tables, joins, constraints, and clean schema basics.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary:
      'Level up with CTEs, JSONB, transactions, indexes, and connect Postgres to Node, Express, Flask, Django, and Next.js.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary:
      'Go pro with performance, security, production patterns, and real database-backed projects.',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const postgresqlTutorial: TutorialCourse = {
  slug: 'postgresql',
  title: 'PostgreSQL Tutorial',
  shortTitle: 'PostgreSQL',
  description:
    'A complete PostgreSQL path from beginner to pro - SQL, schema design, performance, and connecting Postgres to Node.js, Express, Flask, Django, and Next.js.',
  tagline: 'SQL + real app connections',
  audience: 'Beginners to developers shipping apps with a real database',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'Database',
  highlights: [
    'SQL foundations taught clearly and practically',
    'Connect Postgres to Node, Express, Flask, Django, Next.js',
    'Indexes, JSONB, transactions, and performance',
    'Capstone projects with real schemas',
  ],
};

export function getAllPostgresqlLessons() {
  return allLessons;
}

export function getPostgresqlLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getPostgresqlLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
