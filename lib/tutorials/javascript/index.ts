import type { TutorialCourse, TutorialLesson, TutorialSection, LessonLevel } from '../types';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_META: Record<
  LessonLevel,
  { title: string; summary: string }
> = {
  beginner: {
    title: 'Beginner',
    summary: 'Start from zero. Learn syntax, data, control flow, functions, and the DOM.',
  },
  intermediate: {
    title: 'Intermediate',
    summary: 'Level up with modern JS, async code, classes, modules, Fetch, and stronger DOM skills.',
  },
  advanced: {
    title: 'Advanced',
    summary: 'Go pro with the event loop, performance patterns, Web APIs, architecture, and projects.',
  },
};

function groupIntoSections(lessons: TutorialLesson[]): TutorialSection[] {
  const map = new Map<string, TutorialLesson[]>();

  for (const lesson of lessons) {
    const key = `${lesson.level}::${lesson.section}`;
    const list = map.get(key) ?? [];
    list.push(lesson);
    map.set(key, list);
  }

  return Array.from(map.entries()).map(([key, sectionLessons]) => {
    const [level, title] = key.split('::') as [LessonLevel, string];
    return {
      id: key.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title,
      level,
      summary: LEVEL_META[level].summary,
      lessons: sectionLessons.sort((a, b) => a.order - b.order),
    };
  });
}

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const javascriptTutorial: TutorialCourse = {
  slug: 'javascript',
  title: 'JavaScript Tutorial',
  shortTitle: 'JavaScript',
  description:
    'A complete frontend JavaScript path from absolute beginner to advanced — section by section, with clear explanations, examples, and practice prompts.',
  tagline: 'Frontend JavaScript, beginner to pro',
  audience: 'Complete beginners to intermediate developers ready to go advanced',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons),
};

export function getAllJsLessons(): TutorialLesson[] {
  return allLessons;
}

export function getJsLesson(slug: string): TutorialLesson | undefined {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getJsLessonNav(slug: string): {
  lesson: TutorialLesson;
  prev: TutorialLesson | null;
  next: TutorialLesson | null;
  index: number;
} | null {
  const index = allLessons.findIndex((lesson) => lesson.slug === slug);
  if (index === -1) return null;
  return {
    lesson: allLessons[index],
    prev: index > 0 ? allLessons[index - 1] : null,
    next: index < allLessons.length - 1 ? allLessons[index + 1] : null,
    index,
  };
}

export const TUTORIALS = [javascriptTutorial];

export function getTutorial(slug: string) {
  return TUTORIALS.find((t) => t.slug === slug);
}
