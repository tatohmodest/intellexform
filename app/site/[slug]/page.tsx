import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { listOrgCourses } from '@/lib/orgLms';
import { resolveInstitutionFeatures } from '@/lib/eduos/featureFlags';
import { getCampusBrand } from '@/lib/campus/brand';
import { getOrgWebsite } from '@/lib/orgLms/website';
import CampusSiteShell from '@/components/campus/CampusSiteShell';
import CampusLanding from '@/components/campus/CampusLanding';

export const dynamic = 'force-dynamic';

/**
 * Public white-label organization website (guest-accessible).
 * Feels like the institution's own LMS storefront — logo home stays on campus.
 */
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const site = await getOrgWebsite(params.slug);
  if (!site) return { title: 'Campus' };
  const name = site.config.platformName || site.institution.name;
  const slug = site.institution.slug;
  const logo = site.institution.logoUrl;
  return {
    title: name,
    description: site.config.tagline || site.institution.description || `${name} learning campus`,
    applicationName: name,
    appleWebApp: { capable: true, title: name, statusBarStyle: 'default' },
    manifest: `/api/pwa/manifest?slug=${encodeURIComponent(slug)}`,
    icons: logo
      ? {
          icon: [{ url: `/api/pwa/icon?slug=${encodeURIComponent(slug)}&size=192` }],
          apple: [{ url: `/api/pwa/icon?slug=${encodeURIComponent(slug)}&size=192` }],
        }
      : undefined,
  };
}

export default async function OrgPublicSitePage({
  params,
}: {
  params: { slug: string };
}) {
  const brand = await getCampusBrand(params.slug);
  if (!brand) notFound();
  if (!brand.config.published) notFound();

  const site = await getOrgWebsite(params.slug);
  if (!site) notFound();
  const { institution: inst } = site;

  const courses = brand.config.showCourses
    ? await listOrgCourses({ slug: inst.slug, publishedOnly: true })
    : [];

  const features = brand.config.showCapabilities
    ? resolveInstitutionFeatures({
        capabilityPack: inst.capabilityPack,
        enabledModules: inst.enabledModules,
        featuresEnabled: inst.featuresEnabled,
      })
    : [];

  return (
    <CampusSiteShell
      brand={{
        slug: brand.slug,
        platformName: brand.platformName,
        accent: brand.accent,
        logoUrl: brand.logoUrl,
        navLinks: brand.config.navLinks,
        homeHref: brand.homeHref,
        loginHref: brand.loginHref,
        signupHref: brand.signupHref,
        enrollmentOpen: brand.enrollmentOpen,
        footerNote: brand.config.footerNote,
        email: brand.email,
        website: brand.website,
      }}
    >
      <CampusLanding brand={brand} courses={courses} features={features} />
    </CampusSiteShell>
  );
}
