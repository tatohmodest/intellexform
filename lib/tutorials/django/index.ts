import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary:
      'Install Django, learn MTV, models, views, templates, URLs, forms, and the admin.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary:
      'Level up with auth, class-based views, querysets, static/media, messages, and APIs.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary:
      'Go pro with deployment, security, testing, performance, and real Django projects.',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const djangoTutorial: TutorialCourse = {
  slug: 'django',
  title: 'Django Tutorial',
  shortTitle: 'Django',
  description:
    'A complete Django web framework path from beginner to pro — build real apps with models, views, templates, auth, and deployment. Python web development, taught step by step.',
  tagline: 'Python web apps with Django',
  audience: 'Python learners ready to build full web applications',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'Backend',
  highlights: [
    'MTV architecture explained simply',
    'Models, views, templates, forms, and admin',
    'Auth, APIs, testing, and deployment',
    'Capstone projects you can ship',
  ],
};

export function getAllDjangoLessons() {
  return allLessons;
}

export function getDjangoLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getDjangoLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
