import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary: "JDK setup, syntax, OOP foundations, collections, and a first console project.",
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary: "Generics, streams, Maven/Gradle, JDBC/HTTP, threads, and larger projects.",
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary: "JVM memory, performance, security, Docker, design, and API capstones.",
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const javaTutorial: TutorialCourse = {
  slug: "java",
  title: "Java Tutorial",
  shortTitle: "Java",
  description: "A complete Java path covering language basics, OOP, collections, modern Java features, testing, concurrency, and backend-ready capstones.",
  tagline: "Build reliable object-oriented software",
  audience: "Beginners and career switchers aiming at backend, Android foundations, or enterprise Java",
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: "Backend",
  highlights: ["Strong OOP and collections fluency","Modern Java: records, streams, Optional","Testing and build tools","Backend-oriented capstone projects"],
};

export function getAllJavaLessons() {
  return allLessons;
}

export function getJavaLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getJavaLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
