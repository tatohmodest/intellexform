/**
 * Organization public website builder — branding + copy stored on Institution.settings.website.
 */

import { prisma } from '@/lib/db/prisma';
import { getTenantPrisma } from '@/lib/eduos/tenantDb';

export type OrgWebsiteConfig = {
  platformName: string;
  tagline: string;
  about: string;
  ctaLabel: string;
  ctaHref: string;
  showCourses: boolean;
  showCapabilities: boolean;
  showPrograms: boolean;
  showContact: boolean;
  showJoin: boolean;
  heroStyle: 'gradient' | 'cover';
  navLinks: { label: string; href: string }[];
  footerNote: string;
  published: boolean;
  contactBlurb: string;
  admissionsNote: string;
};

const DEFAULTS: OrgWebsiteConfig = {
  platformName: '',
  tagline: '',
  about: '',
  ctaLabel: 'Enter LMS',
  ctaHref: '',
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
  footerNote: '',
  published: true,
  contactBlurb: '',
  admissionsNote: '',
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseWebsiteConfig(
  settings: unknown,
  fallbacks: { name: string; description?: string | null },
): OrgWebsiteConfig {
  const root = asRecord(settings);
  const site = asRecord(root.website);
  const navRaw = Array.isArray(site.navLinks) ? site.navLinks : DEFAULTS.navLinks;

  return {
    platformName: String(site.platformName || root.platformName || fallbacks.name),
    tagline: String(
      site.tagline || root.tagline || fallbacks.description || 'Learning powered by InTelleX',
    ),
    about: String(site.about || fallbacks.description || ''),
    ctaLabel: String(site.ctaLabel || DEFAULTS.ctaLabel),
    ctaHref: String(site.ctaHref || ''),
    showCourses: site.showCourses !== undefined ? Boolean(site.showCourses) : true,
    showCapabilities:
      site.showCapabilities !== undefined ? Boolean(site.showCapabilities) : true,
    showPrograms: site.showPrograms !== undefined ? Boolean(site.showPrograms) : true,
    showContact: site.showContact !== undefined ? Boolean(site.showContact) : true,
    showJoin: site.showJoin !== undefined ? Boolean(site.showJoin) : true,
    heroStyle: site.heroStyle === 'cover' ? 'cover' : 'gradient',
    navLinks: navRaw
      .map((item) => {
        const row = asRecord(item);
        return {
          label: String(row.label || '').slice(0, 40),
          href: String(row.href || '').slice(0, 200),
        };
      })
      .filter((l) => l.label && l.href)
      .slice(0, 10),
    footerNote: String(site.footerNote || ''),
    published: site.published !== undefined ? Boolean(site.published) : true,
    contactBlurb: String(site.contactBlurb || ''),
    admissionsNote: String(site.admissionsNote || ''),
  };
}

export async function getOrgWebsite(slug: string) {
  const inst = await prisma.institution.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      logoUrl: true,
      coverUrl: true,
      primaryColor: true,
      secondaryColor: true,
      website: true,
      email: true,
      country: true,
      city: true,
      address: true,
      status: true,
      settings: true,
      capabilityPack: true,
      enabledModules: true,
      featuresEnabled: true,
      enrollmentPolicy: true,
      visibility: true,
      institutionType: true,
    },
  });
  if (!inst) return null;

  const config = parseWebsiteConfig(inst.settings, {
    name: inst.name,
    description: inst.description,
  });

  return { institution: inst, config };
}

export async function updateOrgWebsite(
  institutionId: string,
  patch: Partial<OrgWebsiteConfig> & {
    primaryColor?: string;
    secondaryColor?: string;
    logoUrl?: string | null;
    coverUrl?: string | null;
  },
) {
  const { client } = await getTenantPrisma(institutionId);
  const inst = await client.institution.findUnique({
    where: { id: institutionId },
    select: { settings: true, name: true, description: true },
  });
  if (!inst) throw new Error('Institution not found');

  const current = parseWebsiteConfig(inst.settings, {
    name: inst.name,
    description: inst.description,
  });
  const next: OrgWebsiteConfig = {
    ...current,
    ...(patch.platformName !== undefined
      ? { platformName: String(patch.platformName).slice(0, 120) }
      : {}),
    ...(patch.tagline !== undefined ? { tagline: String(patch.tagline).slice(0, 280) } : {}),
    ...(patch.about !== undefined ? { about: String(patch.about).slice(0, 4000) } : {}),
    ...(patch.ctaLabel !== undefined ? { ctaLabel: String(patch.ctaLabel).slice(0, 60) } : {}),
    ...(patch.ctaHref !== undefined ? { ctaHref: String(patch.ctaHref).slice(0, 300) } : {}),
    ...(patch.showCourses !== undefined ? { showCourses: Boolean(patch.showCourses) } : {}),
    ...(patch.showCapabilities !== undefined
      ? { showCapabilities: Boolean(patch.showCapabilities) }
      : {}),
    ...(patch.showPrograms !== undefined ? { showPrograms: Boolean(patch.showPrograms) } : {}),
    ...(patch.showContact !== undefined ? { showContact: Boolean(patch.showContact) } : {}),
    ...(patch.showJoin !== undefined ? { showJoin: Boolean(patch.showJoin) } : {}),
    ...(patch.heroStyle !== undefined
      ? { heroStyle: patch.heroStyle === 'cover' ? 'cover' : 'gradient' }
      : {}),
    ...(patch.navLinks !== undefined
      ? {
          navLinks: patch.navLinks
            .map((l) => ({
              label: String(l.label || '').slice(0, 40),
              href: String(l.href || '').slice(0, 200),
            }))
            .filter((l) => l.label && l.href)
            .slice(0, 10),
        }
      : {}),
    ...(patch.footerNote !== undefined
      ? { footerNote: String(patch.footerNote).slice(0, 280) }
      : {}),
    ...(patch.published !== undefined ? { published: Boolean(patch.published) } : {}),
    ...(patch.contactBlurb !== undefined
      ? { contactBlurb: String(patch.contactBlurb).slice(0, 800) }
      : {}),
    ...(patch.admissionsNote !== undefined
      ? { admissionsNote: String(patch.admissionsNote).slice(0, 800) }
      : {}),
  };

  const root = asRecord(inst.settings);
  const settings = {
    ...root,
    platformName: next.platformName,
    tagline: next.tagline,
    website: next,
  };

  return client.institution.update({
    where: { id: institutionId },
    data: {
      settings,
      ...(patch.primaryColor !== undefined
        ? { primaryColor: String(patch.primaryColor).slice(0, 32) }
        : {}),
      ...(patch.secondaryColor !== undefined
        ? { secondaryColor: String(patch.secondaryColor).slice(0, 32) }
        : {}),
      ...(patch.logoUrl !== undefined ? { logoUrl: patch.logoUrl || null } : {}),
      ...(patch.coverUrl !== undefined ? { coverUrl: patch.coverUrl || null } : {}),
    },
    select: {
      id: true,
      slug: true,
      name: true,
      primaryColor: true,
      secondaryColor: true,
      logoUrl: true,
      coverUrl: true,
      settings: true,
    },
  });
}
