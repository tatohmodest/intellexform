import { TUTORIALS, getTutorial, getTutorialLessons } from '@/lib/tutorials';
import type { TutorialCourse, TutorialLesson } from '@/lib/tutorials/types';
import { TRACK_LOGOS } from '@/lib/techLogos';

/**
 * The dashboard "self-paced course" catalog is built from the platform's
 * full tutorial library (18 tracks, hundreds of real lessons), enriched with
 * display metadata for a course-card experience.
 */

export interface CatalogTrack {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  tag: string;
  totalLessons: number;
  totalMinutes: number;
  /** Accent used for the card artwork. */
  color: string;
  /** Path to brand logo under /public (never an emoji). */
  logo: string | null;
}

const TRACK_META: Record<string, { color: string }> = {
  'computer-architecture': { color: '#0f766e' },
  html: { color: '#e44d26' },
  css: { color: '#2965f1' },
  javascript: { color: '#f0db4f' },
  nextjs: { color: '#0C1116' },
  'nodejs-express': { color: '#68a063' },
  nestjs: { color: '#e0234e' },
  python: { color: '#3572A5' },
  django: { color: '#092e20' },
  flask: { color: '#37474f' },
  golang: { color: '#00ADD8' },
  postgresql: { color: '#336791' },
  mongodb: { color: '#13aa52' },
  docker: { color: '#2496ed' },
  flutter: { color: '#02569B' },
  'data-analysis': { color: '#7c3aed' },
  'digital-marketing': { color: '#f59e0b' },
  pygame: { color: '#0d7377' },
};

function toTrack(course: TutorialCourse): CatalogTrack {
  const lessons = getTutorialLessons(course.slug);
  const meta = TRACK_META[course.slug] ?? { color: '#00b369' };
  return {
    slug: course.slug,
    title: course.title,
    shortTitle: course.shortTitle,
    tagline: course.tagline,
    description: course.description,
    tag: course.tag ?? 'Course',
    totalLessons: lessons.length,
    totalMinutes: lessons.reduce((sum, l) => sum + (l.minutes || 0), 0),
    color: meta.color,
    logo: TRACK_LOGOS[course.slug] ?? null,
  };
}

export function getCatalog(): CatalogTrack[] {
  return TUTORIALS.map(toTrack);
}

export function getCatalogTrack(slug: string): CatalogTrack | null {
  const course = getTutorial(slug);
  return course ? toTrack(course) : null;
}

export function getTrackLessons(slug: string): TutorialLesson[] {
  return getTutorialLessons(slug);
}

/** Pick the next lesson a learner should take given the completed set. */
export function getNextLesson(
  slug: string,
  completedSlugs: Set<string>,
): TutorialLesson | null {
  const lessons = getTutorialLessons(slug);
  return lessons.find((l) => !completedSlugs.has(l.slug)) ?? null;
}
