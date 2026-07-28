/**
 * Client-safe course types and helpers.
 * Keep Mongo/Node imports out of this file so dashboard client components can
 * use course metadata without pulling the MongoDB driver into the browser bundle.
 */

import type { ContentVisibility } from '@/lib/learn/identity';

export type VideoProvider = 'drive' | 'youtube' | 'cloudinary' | 'url';

export interface TeacherLesson {
  id: string;
  title: string;
  videoUrl: string;
  videoProvider: VideoProvider;
  notes?: string;
  /** Minutes - powers the course duration estimate. */
  durationMinutes?: number | null;
  /** Free sample lesson visible before enrolling / paying. */
  preview?: boolean;
}

/** How the course is taught. */
export type CourseDeliveryMode = 'self_paced' | 'live' | 'hybrid';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'all';

/**
 * Who the course is for:
 * - `allocated`   free for students already assigned to this instructor / campus
 * - `open`        anyone on InTelleX can enrol (free when priceXAF is 0)
 * - `institution` restricted to members of the owning institution
 */
export type CourseAudience = 'allocated' | 'open' | 'institution';

export interface CourseLiveSchedule {
  startDate?: string | null;
  endDate?: string | null;
  sessionsPerWeek?: number | null;
  sessionTime?: string | null;
  timezone?: string | null;
  meetingUrl?: string | null;
}

/** Everything stored on a teacher course except the Mongo `_id`. */
export interface TeacherCourseBase {
  authorId: string;
  authorName: string;
  /** null / empty = InTelleX mentor catalogue (not campus-scoped) */
  institutionSlug?: string | null;
  title: string;
  description: string;
  visibility: ContentVisibility;
  lessons: TeacherLesson[];
  published: boolean;
  accent?: string;

  /** Card artwork */
  coverUrl?: string | null;
  coverPublicId?: string | null;

  /** Catalogue metadata */
  subtitle?: string;
  category?: string;
  level?: CourseLevel;
  language?: string;
  tags?: string[];

  /** Delivery & commercials */
  deliveryMode?: CourseDeliveryMode;
  durationHours?: number | null;
  priceXAF?: number;
  audience?: CourseAudience;
  seats?: number | null;
  certificate?: boolean;
  liveSchedule?: CourseLiveSchedule | null;

  /** Value proposition */
  outcomes?: string[];
  requirements?: string[];

  /**
   * Institution-run course delivered by an allocated instructor.
   * `authorId` stays the creator (campus admin); the instructor can also edit.
   */
  instructorId?: string | null;
  instructorName?: string | null;
  createdByInstitution?: boolean;

  createdAt: Date | string;
  updatedAt: Date | string;
}

export type TeacherCourseView = TeacherCourseBase & { id: string };

/** Hours of content: explicit duration, else summed lesson minutes. */
export function courseDurationHours(course: {
  durationHours?: number | null;
  lessons?: TeacherLesson[];
}): number {
  if (course.durationHours && course.durationHours > 0) return course.durationHours;
  const minutes = (course.lessons || []).reduce(
    (sum, l) => sum + (Number(l.durationMinutes) || 0),
    0,
  );
  return minutes > 0 ? Math.round((minutes / 60) * 10) / 10 : 0;
}

/** Short label for the delivery mode. */
export function deliveryModeLabel(mode?: CourseDeliveryMode | null): string {
  if (mode === 'live') return 'Live sessions';
  if (mode === 'hybrid') return 'Hybrid';
  return 'Self-paced';
}
