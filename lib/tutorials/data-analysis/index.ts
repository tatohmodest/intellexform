import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary:
      'Set up your analysis environment, learn NumPy/pandas, clean data, and run your first real explorations.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary:
      'Level up with visualization, EDA, joins, time series, SQL + pandas, APIs, and reproducible workflows.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary:
      'Go pro with statistics for analysts, performance, ethics, storytelling, and portfolio-ready projects.',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const dataAnalysisTutorial: TutorialCourse = {
  slug: 'data-analysis',
  title: 'Data Analysis Tutorial',
  shortTitle: 'Data Analysis',
  description:
    'A complete data analysis path from beginner to pro - Python, pandas, NumPy, visualization, SQL, and real projects. Learn the analyst toolkit section by section.',
  tagline: 'From messy data to clear insights',
  audience: 'Beginners to aspiring analysts and developers who want to work with real datasets',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'Data',
  highlights: [
    'pandas, NumPy, and clean analysis workflows',
    'Visualization, EDA, and SQL for analysts',
    'Reproducible projects and portfolio work',
    'One clear idea per lesson - no fluff',
  ],
};

export function getAllDataAnalysisLessons() {
  return allLessons;
}

export function getDataAnalysisLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getDataAnalysisLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
