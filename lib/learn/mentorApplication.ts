/**
 * Client-safe mentor application types & constants.
 * Keep Mongo / Node-only code out of this module so dashboard client
 * components can import labels and types without pulling in `mongodb`.
 */

import type { MentorSlot } from '@/lib/learn/mentors';

export type MentorApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected';

/** Documents an admin can ask the applicant to send again (any subset). */
export type MentorDocRequestItem = 'resume' | 'id_front' | 'id_back' | 'intro_video';

export const MENTOR_DOC_REQUEST_ITEMS: {
  id: MentorDocRequestItem;
  label: string;
  hint: string;
}[] = [
  { id: 'resume', label: 'CV / resume', hint: 'Public Google Drive link' },
  { id: 'id_front', label: 'ID front', hint: 'Photo of ID front' },
  { id: 'id_back', label: 'ID back', hint: 'Photo of ID back' },
  { id: 'intro_video', label: 'Intro video', hint: '30–60 second recording' },
];

export interface MentorDocumentRequest {
  items: MentorDocRequestItem[];
  note?: string | null;
  requestedAt: Date | string;
  status: 'open' | 'fulfilled';
  fulfilledAt?: Date | string | null;
}

export interface MentorApplicationDoc {
  id: string;
  lbId: string;
  name: string;
  email?: string | null;
  title: string;
  expertise: string[];
  bio: string;
  priceXAF: number;
  sessionMinutes: number;
  slots: MentorSlot[];
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  resumeUrl: string;
  resumeSource?: 'google_drive' | 'cloudinary' | null;
  idFrontUrl: string;
  idBackUrl: string;
  introVideoUrl: string;
  introVideoBytes?: number | null;
  institutionSlug?: string | null;
  institutionName?: string | null;
  status: MentorApplicationStatus;
  reviewNote?: string | null;
  reviewedAt?: Date | string | null;
  /** Open admin request for specific documents to be re-sent. */
  documentRequest?: MentorDocumentRequest | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
