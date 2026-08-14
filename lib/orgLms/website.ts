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
  heroStyle: 'gradient' | 'cover';
  navLinks: { label: string; href: string }[];
  footerNote: string;
  published: boolean;
};

const DEFAULTS: OrgWebsiteConfig = {
  platformName: '',
  tagline: '',
  about: '',
  ctaLabel: 'Enter LMS',
  ctaHref: '',
  showCourses: true,
  showCapabilities: true,
  heroStyle: 'gradient',
  navLinks: [
    { label: 'About', href: '#about' },
    { label: 'Courses', href: '#courses' },
  ],
  footerNote: '',
  published: true,
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
      site.tagline || root.tagline || fallbacks.description || 'Learning powered by Intellex',
    ),
    about: String(site.about || fallbacks.description || ''),
    ctaLabel: String(site.ctaLabel || DEFAULTS.ctaLabel),
    ctaHref: String(site.ctaHref || ''),
    showCourses: site.showCourses !== undefined ? Boolean(site.showCourses) : true,
    showCapabilities:
      site.showCapabilities !== undefined ? Boolean(site.showCapabilities) : true,
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
      .slice(0, 8),
    footerNote: String(site.footerNote || ''),
    published: site.published !== undefined ? Boolean(site.published) : true,
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
      status: true,
      settings: true,
      capabilityPack: true,
      enabledModules: true,
      featuresEnabled: true,
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
            .slice(0, 8),
        }
      : {}),
    ...(patch.footerNote !== undefined
      ? { footerNote: String(patch.footerNote).slice(0, 280) }
      : {}),
    ...(patch.published !== undefined ? { published: Boolean(patch.published) } : {}),
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
