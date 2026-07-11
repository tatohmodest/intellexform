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
 * A contact / enrollment request created from the register form. Stored in the
 * `requests` collection and surfaced in the admin dashboard. The user is also
 * redirected to WhatsApp with a pre-written message of these choices.
 */
export interface ContactRequest {
  fullName: string;
  whatsapp: string;
  field: string;
  plan: string;
  message?: string;
  createdAt: Date;
}

/**
 * A course purchase order created from the checkout flow. Stored in the
 * `orders` collection and surfaced in the admin dashboard. Payment is handled
 * through PayUnit; `status` moves from `pending` to `paid` (or `failed`).
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
}
