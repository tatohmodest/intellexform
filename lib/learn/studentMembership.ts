/**
 * InTelleX Student membership - 1,999 XAF / month.
 * Backed by the existing cert_subscription PayUnit checkout.
 */
import {
  CERT_MONTHLY_XAF,
  CERT_YEARLY_XAF,
  priceForCertPlan,
  type CertPlan,
} from '@/lib/learn/certPricing';

export {
  CERT_MONTHLY_XAF as STUDENT_MONTHLY_XAF,
  CERT_YEARLY_XAF as STUDENT_YEARLY_XAF,
  priceForCertPlan,
  type CertPlan,
};

export const STUDENT_MEMBERSHIP = {
  name: 'InTelleX Student',
  monthlyXAF: CERT_MONTHLY_XAF,
  yearlyXAF: CERT_YEARLY_XAF,
  currency: 'XAF',
  tagline: 'Learn on your own: the whole library, tutorials, books and the AI tutor in one plan.',
} as const;

export type StudentBenefit = {
  title: string;
  desc: string;
};

/** Benefits shown on /membership and library banners. */
export const STUDENT_BENEFITS: StudentBenefit[] = [
  {
    title: '1,000+ InTelleX courses with certifications',
    desc: 'Full catalogue access - finish paths and earn certificates of completion.',
  },
  {
    title: 'Free courses unlocked Intermediate → Pro',
    desc: 'Beginner stays open to everyone. Student members unlock the full free tracks.',
  },
  {
    title: 'Complete certification paths',
    desc: 'Subscribe to get certified - Intermediate through Pro on eligible courses.',
  },
  {
    title: 'Digital library books included',
    desc: 'Every priced library book is free while your membership is active.',
  },
  {
    title: 'Request books from InTelleX',
    desc: 'Ask for titles you need — students get up to 10 requests per month (guests get 2). Admins review and publish to the library.',
  },
  {
    title: 'AI tutor, any hour',
    desc: 'Ask InTelleX AI about any lesson, any time. It explains and quizzes you; it does not replace an instructor.',
  },
  {
    title: 'Class notes & learning tools',
    desc: 'Your dashboard, progress tracking and achievements, so you can see how far you have come.',
  },
  {
    title: 'Certificates you can show',
    desc: 'Finish a course and claim its certificate of completion.',
  },
];

/** Membership is self-paced. Live teaching belongs to programmes - see docs/REPOSITIONING.md. */
export const STUDENT_NOT_INCLUDED: StudentBenefit[] = [
  { title: 'Live classes', desc: 'Scheduled classes with an instructor and a cohort come with programmes.' },
  { title: 'Mentorship and reviews', desc: 'An instructor checking your projects and telling you what to fix is part of a programme.' },
];
