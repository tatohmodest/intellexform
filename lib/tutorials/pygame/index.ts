import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary:
      'Install Pygame, open a window, learn the game loop, draw shapes, handle input, and ship a small catch game.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary:
      'Level up with sprites, animation, cameras, tile maps, platformer physics, enemies, HUD, and game states.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary:
      'Go pro with architecture patterns, particles, performance, packaging, and three polished capstone games.',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const pygameTutorial: TutorialCourse = {
  slug: 'pygame',
  title: 'Pygame Tutorial',
  shortTitle: 'Pygame',
  description:
    'A complete Pygame path from beginner to pro - windows, game loops, sprites, animation, platformers, polish, packaging, and real game projects.',
  tagline: 'Make games with Python',
  audience: 'Python learners ready to build 2D games, from first window to polished projects',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'Game Dev',
  highlights: [
    'Game loop, drawing, input, and collision made clear',
    'Sprites, animation, cameras, and tile maps',
    'Platformer physics, enemies, HUD, and game states',
    'Capstones: shooter, runner, and puzzle game',
  ],
};

export function getAllPygameLessons() {
  return allLessons;
}

export function getPygameLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getPygameLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
