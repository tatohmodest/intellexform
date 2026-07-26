import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary:
      'Learn HTML documents, text, links, images, semantic structure, forms, tables, and build a first profile page.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary:
      'Level up with media, accessibility, advanced forms, SEO meta tags, and structured article/landing pages.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary:
      'Go pro with modern elements, validation, progressive enhancement, and portfolio-ready markup capstones.',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const htmlTutorial: TutorialCourse = {
  slug: 'html',
  title: 'HTML Tutorial',
  shortTitle: 'HTML',
  description:
    'A complete HTML path from beginner to pro - documents, semantic layout, forms, media, accessibility, SEO basics, and real page projects.',
  tagline: 'Structure the web with confidence',
  audience: 'Beginners and builders who want clean, accessible page markup',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'Frontend',
  highlights: [
    'Semantic HTML and document structure',
    'Forms, media, tables, and links',
    'Accessibility and SEO-friendly markup',
    'Projects: profile, blog, portfolio, checkout',
  ],
};

export function getAllHtmlLessons() {
  return allLessons;
}

export function getHtmlLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getHtmlLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
