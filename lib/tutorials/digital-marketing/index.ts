import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary:
      'Learn digital marketing foundations: funnels, branding, content, SEO, social, email, and landing pages.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary:
      'Level up with paid ads, analytics, CRO, automation, lead gen, and campaign reporting.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary:
      'Go pro with strategy, growth systems, privacy-aware marketing, and portfolio-ready campaign projects.',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const digitalMarketingTutorial: TutorialCourse = {
  slug: 'digital-marketing',
  title: 'Digital Marketing Tutorial',
  shortTitle: 'Digital Marketing',
  description:
    'A complete digital marketing path from beginner to pro — strategy, SEO, content, social, email, ads, analytics, and real campaign projects.',
  tagline: 'Attract, convert, and grow',
  audience: 'Beginners, creators, and founders ready to market products and services online',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'Marketing',
  highlights: [
    'Clear strategy before tactics',
    'SEO, content, social, email, and paid ads',
    'Analytics and conversion optimization',
    'Campaign projects you can put in a portfolio',
  ],
};

export function getAllDigitalMarketingLessons() {
  return allLessons;
}

export function getDigitalMarketingLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getDigitalMarketingLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
