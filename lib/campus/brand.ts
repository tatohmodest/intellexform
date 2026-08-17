/**
 * Campus brand helpers for white-label public site.
 * Auth uses the shared InTelleX /login and /signup — enrollment policy
 * from onboarding decides who may join (invite / admin / public / code).
 */

import { getOrgWebsite, type OrgWebsiteConfig } from '@/lib/orgLms/website';

export type StudentRegistrationMode =
  | 'invite_only'
  | 'admin_only'
  | 'public'
  | 'code';

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
  /** Platform login with next → campus portal */
  loginHref: string;
  /** Platform signup with next → campus portal (only meaningful for public) */
  signupHref: string;
  adminHref: string;
  adminLoginHref: string;
  portalHref: string;
  email: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
  description: string | null;
  config: OrgWebsiteConfig;
  settings: Record<string, unknown>;
  learningStructure: string[];
  studentRegistration: StudentRegistrationMode;
  /** True only when students may self-register (public). */
  enrollmentOpen: boolean;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeRegistration(raw: string): StudentRegistrationMode {
  if (raw === 'public' || raw === 'code' || raw === 'admin_only' || raw === 'invite_only') {
    return raw;
  }
  return 'invite_only';
}

export function campusAuthUrls(slug: string) {
  const portal = `/dashboard/institutions/${slug}`;
  const admin = `${portal}/admin`;
  const nextPortal = encodeURIComponent(portal);
  const nextAdmin = encodeURIComponent(admin);
  const campus = encodeURIComponent(slug);
  return {
    portalHref: portal,
    adminHref: admin,
    loginHref: `/login?next=${nextPortal}&campus=${campus}`,
    signupHref: `/signup?next=${nextPortal}&campus=${campus}`,
    adminLoginHref: `/login?next=${nextAdmin}&campus=${campus}`,
  };
}

export function admissionsCopy(mode: StudentRegistrationMode, campusName: string): string {
  switch (mode) {
    case 'public':
      return `Create an InTelleX account to join ${campusName}, then you will land in your campus dashboard.`;
    case 'code':
      return `Sign in with your InTelleX account, then enter the enrollment code from ${campusName} on the campus portal.`;
    case 'admin_only':
      return `${campusName} admins create student accounts. Sign in with the email they registered for you.`;
    case 'invite_only':
    default:
      return `This campus is invitation only. Use the invite from ${campusName}, then sign in with your InTelleX account.`;
  }
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
  const studentRegistration = normalizeRegistration(
    String(settings.studentRegistration || 'invite_only'),
  );
  const enrollmentOpen = studentRegistration === 'public';

  const platformName = config.platformName || inst.name;
  const homeHref = `/site/${inst.slug}`;
  const auth = campusAuthUrls(inst.slug);

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
    loginHref: auth.loginHref,
    signupHref: auth.signupHref,
    adminHref: auth.adminHref,
    adminLoginHref: auth.adminLoginHref,
    portalHref: auth.portalHref,
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
  const mode = normalizeRegistration(String(opts.studentRegistration || 'invite_only'));
  const auth = campusAuthUrls(opts.slug);
  const isPublic = mode === 'public';

  return {
    platformName: opts.platformName,
    tagline: opts.tagline || 'Learn with us',
    about: opts.about || '',
    ctaLabel: isPublic ? 'Create account & join' : 'Sign in to campus',
    ctaHref: isPublic ? auth.signupHref : auth.loginHref,
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
    admissionsNote: admissionsCopy(mode, opts.platformName),
  };
}
