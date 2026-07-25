import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary:
      'Install Go, learn syntax, types, functions, structs, interfaces, packages, and error handling.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary:
      'Level up with generics, concurrency, testing, JSON/files, HTTP servers, REST APIs, and databases.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary:
      'Go pro with concurrency patterns, performance, security, deployment, and real Go projects.',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const golangTutorial: TutorialCourse = {
  slug: 'golang',
  title: 'Go (Golang) Tutorial',
  shortTitle: 'Golang',
  description:
    'A complete Go programming path from beginner to pro — syntax, concurrency, APIs, databases, testing, and real projects. Clear, practical, section by section.',
  tagline: 'Simple, fast, production-ready Go',
  audience: 'Beginners to developers ready to build backend services and tools in Go',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'Programming',
  highlights: [
    'Core Go syntax taught clearly and practically',
    'Goroutines, channels, and real concurrency',
    'HTTP APIs, databases, testing, and modules',
    'Capstone projects you can ship',
  ],
};

export function getAllGolangLessons() {
  return allLessons;
}

export function getGolangLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getGolangLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
