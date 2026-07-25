import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary:
      'Install NestJS, learn modules, controllers, providers, DI, DTOs, and your first REST APIs — with TypeScript taught as you need it.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary:
      'Level up with pipes, guards, interceptors, auth/JWT, config, TypeORM/Prisma, MongoDB, testing, and OpenAPI.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary:
      'Go pro with architecture, microservices, websockets, CQRS, Docker deploy, and real NestJS projects.',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const nestjsTutorial: TutorialCourse = {
  slug: 'nestjs',
  title: 'NestJS Tutorial',
  shortTitle: 'NestJS',
  description:
    'A complete NestJS path from beginner to pro — modules, DI, REST APIs, auth, databases, testing, and real backend projects. TypeScript included as you need it.',
  tagline: 'Structured Node backends with NestJS',
  audience: 'Node/JavaScript developers ready for scalable, production NestJS APIs',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'Backend',
  highlights: [
    'TypeScript taught inside NestJS — no separate TS course required',
    'Modules, DI, controllers, providers, and pipes',
    'Auth, databases, testing, and OpenAPI',
    'Capstone projects you can ship',
  ],
};

export function getAllNestjsLessons() {
  return allLessons;
}

export function getNestjsLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getNestjsLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
