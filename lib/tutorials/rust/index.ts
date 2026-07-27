import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary: "Cargo, ownership, borrowing, structs/enums, and Result/Option.",
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary: "Modules, traits, iterators, testing, and practical CLI projects.",
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary: "Concurrency, unsafe boundaries, async preview, and capstone tools.",
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const rustTutorial: TutorialCourse = {
  slug: "rust",
  title: "Rust Tutorial",
  shortTitle: "Rust",
  description: "A complete Rust path focused on ownership, borrowing, types, Cargo, concurrency, and idiomatic systems tooling.",
  tagline: "Fearless systems programming",
  audience: "Developers moving into systems, CLI tools, WebAssembly, or safe concurrency",
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: "Systems",
  highlights: ["Ownership and borrowing made practical","Cargo, testing, and Clippy workflows","Safe concurrency patterns","CLI and systems capstones"],
};

export function getAllRustLessons() {
  return allLessons;
}

export function getRustLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getRustLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
