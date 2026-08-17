/**
 * Campus brand helpers for white-label public site + auth screens.
 */

import { getOrgWebsite, type OrgWebsiteConfig } from '@/lib/orgLms/website';

export type CampusBrand = {
  slug: string;
  name: string;
  platformName: string;
  tagline: string;
  accent: string;
  secondaryColor: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  homeHref: string;
  loginHref: string;
  signupHref: string;
  adminHref: string;
  portalHref: string;
  email: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
  description: string | null;
  config: OrgWebsiteConfig;
  settings: Record<string, unknown>;
  learningStructure: string[];
  studentRegistration: string;
  enrollmentOpen: boolean;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export async function getCampusBrand(slug: string): Promise<CampusBrand | null> {
  const site = await getOrgWebsite(slug);
  if (!site) return null;
  const { institution: inst, config } = site;
  if (inst.status === 'SUSPENDED' || inst.status === 'ARCHIVED') return null;

  const settings = asRecord(inst.settings);
  const learningStructure = Array.isArray(settings.learningStructure)
    ? settings.learningStructure.map((x) => String(x)).filter(Boolean)
    : [];
  const studentRegistration = String(settings.studentRegistration || 'invite_only');
  const enrollmentOpen =
    studentRegistration === 'public' || studentRegistration === 'code';

  const platformName = config.platformName || inst.name;
  const homeHref = `/site/${inst.slug}`;

  return {
    slug: inst.slug,
    name: inst.name,
    platformName,
    tagline: config.tagline,
    accent: inst.primaryColor || '#00B369',
    secondaryColor: inst.secondaryColor,
    logoUrl: inst.logoUrl,
    coverUrl: inst.coverUrl,
    homeHref,
    loginHref: `/site/${inst.slug}/login`,
    signupHref: `/site/${inst.slug}/signup`,
    adminHref: `/dashboard/institutions/${inst.slug}/admin`,
    portalHref: `/dashboard/institutions/${inst.slug}`,
    email: inst.email,
    city: inst.city,
    country: inst.country,
    website: inst.website,
    description: inst.description,
    config,
    settings,
    learningStructure,
    studentRegistration,
    enrollmentOpen,
  };
}

/** Default public website config seeded when an academy finishes onboarding. */
export function buildSeedWebsiteConfig(opts: {
  platformName: string;
  tagline?: string | null;
  about?: string | null;
  slug: string;
  learningStructure?: string[];
  studentRegistration?: string;
  footerNote?: string;
}): OrgWebsiteConfig {
  const open = opts.studentRegistration === 'public' || opts.studentRegistration === 'code';
  return {
    platformName: opts.platformName,
    tagline: opts.tagline || 'Learn with us',
    about: opts.about || '',
    ctaLabel: open ? 'Join campus' : 'Sign in to campus',
    ctaHref: open ? `/site/${opts.slug}/signup` : `/site/${opts.slug}/login`,
    showCourses: true,
    showCapabilities: true,
    showPrograms: true,
    showContact: true,
    showJoin: true,
    heroStyle: 'gradient',
    navLinks: [
      { label: 'About', href: '#about' },
      { label: 'Programs', href: '#programs' },
      { label: 'Courses', href: '#courses' },
      { label: 'Join', href: '#join' },
      { label: 'Contact', href: '#contact' },
    ],
    footerNote:
      opts.footerNote || `${opts.platformName} · Learning campus powered by InTelleX`,
    published: true,
    contactBlurb: 'Questions about enrollment, programs, or partnerships? Reach us directly.',
    admissionsNote: open
      ? 'Create an account to join this campus and start learning.'
      : 'This campus is invite-only. Use the link from your school admin, or sign in if you already have access.',
  };
}
