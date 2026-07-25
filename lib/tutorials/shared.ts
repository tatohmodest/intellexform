import type { LessonLevel, TutorialLesson, TutorialSection } from './types';

export const LEVEL_META: Record<LessonLevel, { title: string; summary: string }> = {
  beginner: {
    title: 'Beginner',
    summary: 'Build a strong foundation with clear, practical lessons.',
  },
  intermediate: {
    title: 'Intermediate',
    summary: 'Level up with real app patterns used in production projects.',
  },
  advanced: {
    title: 'Advanced',
    summary: 'Go pro with architecture, performance, and capstone projects.',
  },
};

export function groupIntoSections(
  lessons: TutorialLesson[],
  levelMeta: Record<LessonLevel, { title: string; summary: string }> = LEVEL_META,
): TutorialSection[] {
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
      summary: levelMeta[level].summary,
      lessons: sectionLessons.sort((a, b) => a.order - b.order),
    };
  });
}

export function getLessonNav(lessons: TutorialLesson[], slug: string) {
  const index = lessons.findIndex((lesson) => lesson.slug === slug);
  if (index === -1) return null;
  return {
    lesson: lessons[index],
    prev: index > 0 ? lessons[index - 1] : null,
    next: index < lessons.length - 1 ? lessons[index + 1] : null,
    index,
  };
}
