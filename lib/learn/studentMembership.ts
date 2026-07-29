/**
 * InTelleX Student membership - 4,999 XAF / month.
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
  tagline: 'One plan. Learn, certify, and read the whole library.',
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
    desc: 'Ask for titles you need - admins review requests and publish to the library.',
  },
  {
    title: 'AI tutor & live learning',
    desc: 'Study with InTelleX AI, join live classes, and use mentorship tools in your dashboard.',
  },
  {
    title: 'Class notes & learning tools',
    desc: 'Access the student dashboard, progress tracking, achievements, and campus features.',
  },
  {
    title: 'Certificates you can show',
    desc: 'Finish coursework and claim certificates employers and campuses recognise.',
  },
];
