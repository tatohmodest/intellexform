import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary:
      'Microsoft 365 foundations, OneDrive, Word reports, Excel formulas and charts, PowerPoint basics, and a mini capstone.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary:
      'Excel lookups, pivots, and cleaning; Outlook and Teams workflows; OneNote, Forms, secure sharing, and a schedule project.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary:
      'SharePoint, co-authoring, automation awareness, mail merge, security, dashboards, job-pack capstone, and certification paths.',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const microsoftSuiteTutorial: TutorialCourse = {
  slug: 'microsoft-suite',
  title: 'Microsoft Suite Tutorial',
  shortTitle: 'Microsoft 365',
  description:
    'A complete Microsoft 365 training path for learners in Cameroon and across Africa: Word, Excel, PowerPoint, Outlook, Teams, OneDrive, and collaboration skills from first sign-in to job-ready capstone projects.',
  tagline: 'Work smarter with Word, Excel, Teams, and more',
  audience:
    'Students, job seekers, NGO staff, and professionals who need practical Microsoft 365 skills for school, office, and remote work',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'Productivity',
  highlights: [
    'Built for African learners: offline sync, mobile data, and real school/work scenarios',
    'Step-by-step Word, Excel, and PowerPoint with formulas, charts, and mail merge',
    'Outlook, Teams, OneDrive, SharePoint, and secure collaboration',
    'Capstone projects and certification guidance (MOS / Microsoft 365 fundamentals)',
  ],
};

export function getAllMicrosoftSuiteLessons() {
  return allLessons;
}

export function getMicrosoftSuiteLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getMicrosoftSuiteLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
