/**
 * Commercial plans for institution onboarding.
 * Packs in capabilities.ts are the technical module sets.
 * Plans here are what Platform Team sells / assigns on invite links.
 */

import {
  CAPABILITY_PACKS,
  CORE_CAPABILITIES,
  MODULE_CATALOG,
  type CapabilityPack,
  type ModuleId,
} from '@/lib/eduos/capabilities';

export type CommercialPlanId =
  | 'starter'
  | 'builder'
  | 'pro'
  | 'enterprise'
  | 'institution';

export type BillingCycle = 'monthly' | 'yearly';

/** Full inventory of what InTelleX / EduOS can do (product map). */
export const PLATFORM_FUNCTIONALITIES = [
  {
    group: 'Core campus',
    items: [
      'Branded digital campus portal',
      'Institution identity & branding (logo, cover, colors)',
      'Student & staff directory',
      'Departments & roles',
      'Announcements & campus news',
      'Events & calendar',
      'Notifications',
      'Basic analytics',
      'API access (scoped)',
    ],
  },
  {
    group: 'Digital learning',
    items: [
      'Course Studio (video lessons, Drive media)',
      'Lesson progress & enrollments',
      'Learning paths',
      'Certificates of completion',
    ],
  },
  {
    group: 'Assessment',
    items: [
      'Quizzes & locked exams (one-question, leave-tab terminate)',
      'Assignments with Drive submit + in-dashboard viewer',
      'Rubrics & grading',
      'Instructor AI assist for assessments',
    ],
  },
  {
    group: 'Live teaching',
    items: [
      'Live classes & attendance',
      'Whiteboard / screen share',
      'Session recordings',
    ],
  },
  {
    group: 'AI learning',
    items: [
      'Campus-scoped AI tutor',
      'Study assistant & summaries',
      'Question generator',
      'Institution knowledge boundaries',
    ],
  },
  {
    group: 'Library & media',
    items: [
      'Digital library (PDFs, notes, slides)',
      'Visibility controls (private / partner / public)',
      'Video Hall (curated digital skills)',
      'Books marketplace (tutor-uploaded)',
    ],
  },
  {
    group: 'People & career',
    items: [
      'Instructor / mentor profiles',
      '1-on-1 mentorship bookings',
      'Career center & portfolios',
      'Community & clubs',
    ],
  },
  {
    group: 'Commerce & ops',
    items: [
      'Orders & wallets',
      'Subscriptions (monthly / yearly)',
      'Instructor withdrawal requests (admin-validated)',
      'Coupons',
      'Marketplace storefront',
    ],
  },
  {
    group: 'Platform governance',
    items: [
      'Platform Admin control plane (Supabase)',
      'Institution provisioning & capability packs',
      'Onboarding invite links (email-bound)',
      'Personnel bans & campus suspensions',
      'Federation links & audit trail',
      'Cross-institution verification',
    ],
  },
] as const;

export const COMMERCIAL_PLANS: Record<
  CommercialPlanId,
  {
    name: string;
    summary: string;
    /** Maps to technical capability pack. */
    capabilityPack: CapabilityPack;
    /** Extra modules when pack is custom, or override list for invite form. */
    modules: ModuleId[];
    billing: BillingCycle[];
    priceLabel: string;
    highlights: string[];
    /** What the onboarder can request on the invite form. */
    selectableModules: ModuleId[];
  }
> = {
  starter: {
    name: 'Starter',
    summary: 'Core digital campus - identity, announcements, students, basic courses.',
    capabilityPack: 'foundation',
    modules: [],
    billing: ['monthly', 'yearly'],
    priceLabel: 'From 45,000 XAF / month',
    highlights: [
      'InTelleX Core',
      'Branded portal',
      'Students & teachers',
      'Announcements & calendar',
    ],
    selectableModules: [],
  },
  builder: {
    name: 'Builder',
    summary: 'Core plus digital learning and assessments for academies shipping programs.',
    capabilityPack: 'custom',
    modules: ['digital_learning', 'assessment', 'intellex_resources'],
    billing: ['monthly', 'yearly'],
    priceLabel: 'From 95,000 XAF / month',
    highlights: [
      'Everything in Starter',
      'Course Studio',
      'Assessment Studio',
      'InTelleX resources embed',
    ],
    selectableModules: ['digital_learning', 'assessment', 'intellex_resources', 'digital_library'],
  },
  pro: {
    name: 'Pro',
    summary: 'Professional campus - learning, AI, library, and InTelleX resources.',
    capabilityPack: 'professional',
    modules: [...CAPABILITY_PACKS.professional.modules],
    billing: ['monthly', 'yearly'],
    priceLabel: 'From 180,000 XAF / month',
    highlights: [
      'Everything in Builder',
      'AI Learning',
      'Digital library',
      'Priority Platform support',
    ],
    selectableModules: [...CAPABILITY_PACKS.professional.modules, 'live_teaching', 'community'],
  },
  enterprise: {
    name: 'Enterprise',
    summary: 'Full stack - live teaching, career, community, marketplace, research.',
    capabilityPack: 'enterprise',
    modules: [...CAPABILITY_PACKS.enterprise.modules],
    billing: ['yearly'],
    priceLabel: 'Custom · yearly',
    highlights: [
      'All capabilities',
      'Live teaching',
      'Marketplace',
      'Research & career',
      'Federation options',
    ],
    selectableModules: MODULE_CATALOG.map((m) => m.id),
  },
  institution: {
    name: 'Institution',
    summary: 'Universities & large schools - enterprise modules with governance workflows.',
    capabilityPack: 'enterprise',
    modules: [...CAPABILITY_PACKS.enterprise.modules],
    billing: ['yearly'],
    priceLabel: 'Custom · yearly',
    highlights: [
      'Everything in Enterprise',
      'Matricule / SSO-ready auth paths',
      'Ownership transfer & audit',
      'Dedicated onboarding specialist',
    ],
    selectableModules: MODULE_CATALOG.map((m) => m.id),
  },
};

export function planLabel(id: CommercialPlanId | string | null | undefined): string {
  if (!id || !(id in COMMERCIAL_PLANS)) return 'Custom';
  return COMMERCIAL_PLANS[id as CommercialPlanId].name;
}

export function modulesForPlan(id: CommercialPlanId): ModuleId[] {
  return [...COMMERCIAL_PLANS[id].modules];
}

export function coreCapabilityLabels(): string[] {
  return CORE_CAPABILITIES.map((c) => c.replace(/_/g, ' '));
}
