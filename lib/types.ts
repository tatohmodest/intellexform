export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  ageRange: string;
  program: string;
  learningMode: string;
  startDate: string;
  experienceLevel: string;
  occupation: string;
  motivation: string;
  referralSource: string;
}

export interface Program {
  id: string;
  title: string;
  shortTitle: string;
  type: 'full' | 'partial';
  emoji: string;
  duration: string;
  level: string;
  priceXAF: number;
  monthlyXAF?: number;
  registrationFee: number;
  description: string;
  technologies: string[];
  highlights: string[];
  accentColor: string;
  logoUrl: string;
  badge?: string;
}

export type LearningMode = {
  id: string;
  label: string;
  description: string;
  icon: string;
};

/**
 * A course in the Intellex catalogue. Featured Intellex programs and imported
 * external courses share this shape; `featured` + `courseOrigin: 'Intellex'`
 * marks the platform's own highlighted programs.
 */
export interface Course {
  id: number | string;
  slug: string;
  name: string;
  instructor: string;
  courseDetails: string;
  prerequisites: string;
  whatYouWillLearn: string[];
  type: string;
  originalPrice: number;
  currentPrice: number;
  aboutInstructor: string;
  courseRating: number;
  courseNumberOfVotes: number;
  courseOrigin: string;
  courseDuration: string;
  language: string;
  bestSeller: boolean;
  shortDescription: string;
  courseImage: string;
  certificateOfCompletion: boolean;
  accessOnMobileAndTV: boolean;
  downloadable: boolean;
  articleType: string;
  instructorRating: number | null;
  courseLink: string | null;
  featured?: boolean;
  /** Curated "special self-paced" track: hand-picked, progress-monitored, guided. */
  selfPaced?: boolean;
  /** Google Drive folder link for course videos/files */
  googleDriveFolderUrl?: string | null;
  /** Direct Google Drive video preview URL */
  googleDriveUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  testimonial: string;
  fieldOfInterest: string;
  rating: number;
  photo: string;
  video: string;
}

/**
 * A contact / inquiry created from the Contact form. Stored in the
 * `requests` collection and surfaced in the admin dashboard. The user can
 * continue on WhatsApp with a pre-written message of these choices.
 */
export type ContactType = 'learner' | 'institution' | 'mentorship' | 'other';

export interface ContactRequest {
  contactType?: ContactType;
  fullName: string;
  whatsapp: string;
  email?: string;
  field: string;
  plan: string;
  message?: string;
  institutionName?: string;
  roleTitle?: string;
  country?: string;
  estimatedStudents?: string;
  createdAt: Date;
}

/** What the student is buying through PayUnit. */
export type OrderKind = 'catalogue' | 'teacher_course' | 'session_booking' | 'cert_subscription';

/**
 * A purchase order created from a checkout flow. Stored in the `orders`
 * collection. Payment is handled through PayUnit; `status` moves from
 * `pending` to `paid` (or `failed`). Catalogue courses keep the original
 * shape; teacher courses and session bookings add `kind` + fulfillment meta.
 */
export interface Order {
  fullName: string;
  whatsapp: string;
  email?: string;
  phone?: string;
  courseId: string | number;
  courseSlug: string;
  courseName: string;
  amountXAF: number;
  paymentMethod: string;
  gateway: string;
  transactionId: string;
  status: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  paidAt?: Date | null;
  /** Defaults to catalogue when omitted (legacy orders). */
  kind?: OrderKind;
  /** Signed-in learner who started checkout (teacher course / session). */
  userId?: string;
  /** Teacher-course id or mentor id depending on kind. */
  productId?: string;
  instructorId?: string;
  platformXAF?: number;
  instructorXAF?: number;
  commissionRate?: number;
  isTrial?: boolean;
  /** Set once enrolment / booking has been created after payment. */
  fulfilled?: boolean;
  /** Session booking details (kind === session_booking). */
  booking?: {
    scheduledAt: string;
    topic: string;
    durationMinutes: number;
  };
  /** Cert subscription plan (kind === cert_subscription). */
  certPlan?: 'monthly' | 'yearly';
}
