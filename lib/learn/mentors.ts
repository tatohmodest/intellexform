/**
 * Mentor / instructor directory types.
 * Live profiles come from Mongo `mentor_profiles` - no mock seed list.
 */

export interface MentorSlot {
  /** Day offset from "today" (0 = today, 1 = tomorrow …). */
  dayOffset: number;
  /** 24h time, e.g. "18:30". */
  time: string;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  bio: string;
  rating: number;
  sessionsCompleted: number;
  languages: string[];
  priceXAF: number;
  /** Session length in minutes. */
  sessionMinutes: number;
  accent: string;
  initials: string;
  slots: MentorSlot[];
  avatarUrl?: string | null;
  /** Short self-introduction recorded during onboarding. */
  introVideoUrl?: string | null;
  /** Awarded on approval, e.g. "InTelleX Instructor". */
  instructorBadge?: string | null;
}

/** @deprecated Empty - mentors are created via Mentor Studio / applications. */
export const MENTORS: Mentor[] = [];
