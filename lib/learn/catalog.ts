import { TUTORIALS, getTutorial, getTutorialLessons } from '@/lib/tutorials';
import type { TutorialCourse, TutorialLesson } from '@/lib/tutorials/types';

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
  icon: string;
}

const TRACK_META: Record<string, { color: string; icon: string }> = {
  'computer-architecture': { color: '#0f766e', icon: '🖥️' },
  html: { color: '#e44d26', icon: '🧱' },
  css: { color: '#2965f1', icon: '🎨' },
  javascript: { color: '#f0db4f', icon: '⚡' },
  nextjs: { color: '#0C1116', icon: '▲' },
  'nodejs-express': { color: '#68a063', icon: '🟢' },
  nestjs: { color: '#e0234e', icon: '🐈' },
  python: { color: '#3572A5', icon: '🐍' },
  django: { color: '#092e20', icon: '🎸' },
  flask: { color: '#37474f', icon: '🧪' },
  golang: { color: '#00ADD8', icon: '🐹' },
  postgresql: { color: '#336791', icon: '🐘' },
  mongodb: { color: '#13aa52', icon: '🍃' },
  docker: { color: '#2496ed', icon: '🐳' },
  flutter: { color: '#02569B', icon: '🦋' },
  'data-analysis': { color: '#7c3aed', icon: '📊' },
  'digital-marketing': { color: '#f59e0b', icon: '📣' },
  pygame: { color: '#0d7377', icon: '🎮' },
};

function toTrack(course: TutorialCourse): CatalogTrack {
  const lessons = getTutorialLessons(course.slug);
  const meta = TRACK_META[course.slug] ?? { color: '#00b369', icon: '📘' };
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
    icon: meta.icon,
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
