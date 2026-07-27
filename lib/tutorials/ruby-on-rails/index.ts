import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary: "Ruby primer, rails new, MVC, CRUD, and validations.",
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary: "Associations, auth, Active Job/Mailer, and API mode.",
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary: "Testing, security, performance, and SaaS-style capstones.",
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const rubyOnRailsTutorial: TutorialCourse = {
  slug: "ruby-on-rails",
  title: "Ruby on Rails Tutorial",
  shortTitle: "Ruby on Rails",
  description: "A complete Ruby on Rails path covering MVC, Active Record, auth, Hotwire preview, APIs, testing, and production deployment.",
  tagline: "Ship web apps with convention and speed",
  audience: "Builders who want to launch full-stack web products quickly",
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: "Full-stack",
  highlights: ["Rails conventions that unlock speed","Active Record and forms done right","Authentication and authorization patterns","API and SaaS MVP capstones"],
};

export function getAllRubyOnRailsLessons() {
  return allLessons;
}

export function getRubyOnRailsLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getRubyOnRailsLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
