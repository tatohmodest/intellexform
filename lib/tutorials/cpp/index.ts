import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary: "Syntax, control flow, functions, arrays/vectors, pointers/references, and first classes.",
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary: "OOP, STL, modern C++ (lambdas, smart pointers), files, CMake, and solid projects.",
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary: "RAII, concurrency, sanitizers, performance, and systems-style capstones.",
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const cppTutorial: TutorialCourse = {
  slug: "cpp",
  title: "C++ Tutorial",
  shortTitle: "C++",
  description: "A complete C++ path from syntax and memory to OOP, STL, smart pointers, concurrency, and systems capstones.",
  tagline: "Write fast, precise systems software",
  audience: "Developers learning systems programming, games, or performance-critical software",
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: "Systems",
  highlights: ["Modern C++ with practical memory ownership","STL containers and algorithms you will use daily","CMake, debugging, and sanitizers","Concurrency and systems capstone projects"],
};

export function getAllCppLessons() {
  return allLessons;
}

export function getCppLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getCppLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
