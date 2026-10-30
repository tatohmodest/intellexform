import { TUTORIALS, getTutorial, getTutorialLessons } from '@/lib/tutorials';
import type { TutorialCourse, TutorialLesson } from '@/lib/tutorials/types';
import { TRACK_LOGOS } from '@/lib/techLogos';
import { TRACK_META } from '@/lib/learn/trackColors';

/**
 * The dashboard "self-paced course" catalog is built from the platform's
 * full tutorial library (26 tracks, hundreds of real lessons), enriched with
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
