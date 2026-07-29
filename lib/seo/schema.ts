import { CANONICAL_SITE_URL } from '@/lib/platformHosts';
import { BRAND_LOGO_MARK, BRAND_NAME } from '@/lib/brand';
import { LOOPING_BINARY } from '@/lib/ecosystem';
import { absoluteUrl, getSiteUrl } from '@/lib/seo/share';
import { FOUNDER, SITE_GEO } from '@/lib/seo/keywords';

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd {
  const site = getSiteUrl() || CANONICAL_SITE_URL;
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'EducationalOrganization'],
    '@id': `${site}/#organization`,
    name: BRAND_NAME,
    alternateName: ['Intellex', 'InTelleX by Looping Binary'],
    url: site,
    logo: {
      '@type': 'ImageObject',
      url: BRAND_LOGO_MARK,
      caption: 'InTelleX logo',
    },
    image: absoluteUrl('/way_selfpaced.webp'),
    description:
      'InTelleX is a learning operating system for self-paced courses, live mentorship, AI tutoring, and campus education - built in Cameroon by Looping Binary.',
    email: SITE_GEO.email,
    telephone: SITE_GEO.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE_GEO.city,
      addressRegion: SITE_GEO.region,
      addressCountry: SITE_GEO.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE_GEO.latitude,
      longitude: SITE_GEO.longitude,
    },
    areaServed: [
      { '@type': 'Country', name: 'Cameroon' },
      { '@type': 'City', name: 'Douala' },
      { '@type': 'City', name: 'Yaoundé' },
      { '@type': 'City', name: 'Bamenda' },
      { '@type': 'City', name: 'Buea' },
      { '@type': 'City', name: 'Bafoussam' },
      { '@type': 'AdministrativeArea', name: 'Northwest Region, Cameroon' },
      { '@type': 'AdministrativeArea', name: 'Southwest Region, Cameroon' },
      { '@type': 'AdministrativeArea', name: 'West Region, Cameroon' },
      { '@type': 'AdministrativeArea', name: 'Littoral Region, Cameroon' },
      { '@type': 'AdministrativeArea', name: 'Centre Region, Cameroon' },
    ],
    sameAs: [LOOPING_BINARY.home, LOOPING_BINARY.intern, LOOPING_BINARY.juniorDev, FOUNDER.profileUrl],
    parentOrganization: {
      '@type': 'Organization',
      name: FOUNDER.company,
      url: FOUNDER.companyUrl,
      founder: {
        '@type': 'Person',
        name: FOUNDER.name,
        jobTitle: FOUNDER.role,
        url: absoluteUrl('/about'),
      },
    },
    founder: {
      '@type': 'Person',
      '@id': `${site}/about#ceo`,
      name: FOUNDER.name,
      jobTitle: `${FOUNDER.role}, ${FOUNDER.company}`,
      url: absoluteUrl('/about#ceo'),
      worksFor: {
        '@type': 'Organization',
        name: FOUNDER.company,
        url: FOUNDER.companyUrl,
      },
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: SITE_GEO.email,
        telephone: SITE_GEO.phone,
        areaServed: 'CM',
        availableLanguage: ['English'],
      },
    ],
  };
}

export function websiteJsonLd(): JsonLd {
  const site = getSiteUrl() || CANONICAL_SITE_URL;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site}/#website`,
    name: BRAND_NAME,
    url: site,
    publisher: { '@id': `${site}/#organization` },
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${site}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function personCeoJsonLd(): JsonLd {
  const site = getSiteUrl() || CANONICAL_SITE_URL;
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${site}/about#ceo`,
    name: FOUNDER.name,
    jobTitle: FOUNDER.role,
    description: FOUNDER.shortBio,
    url: absoluteUrl('/about#ceo'),
    sameAs: [FOUNDER.profileUrl, FOUNDER.companyUrl],
    worksFor: {
      '@type': 'Organization',
      name: FOUNDER.company,
      url: FOUNDER.companyUrl,
    },
    nationality: {
      '@type': 'Country',
      name: 'Cameroon',
    },
    homeLocation: {
      '@type': 'Place',
      name: SITE_GEO.placename,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: SITE_GEO.latitude,
        longitude: SITE_GEO.longitude,
      },
    },
    knowsAbout: [
      'EdTech',
      'Software engineering',
      'Learning platforms',
      'Cameroon technology ecosystem',
      'InTelleX',
      'Looping Binary',
    ],
  };
}

export function courseJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  image?: string | null;
  instructorName?: string | null;
  priceXAF?: number | null;
}): JsonLd {
  const site = getSiteUrl() || CANONICAL_SITE_URL;
  const image = opts.image ? absoluteUrl(opts.image) : absoluteUrl('/way_selfpaced.webp');
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    image: {
      '@type': 'ImageObject',
      contentUrl: image,
      url: image,
      name: opts.name,
      description: `${opts.name} course cover on InTelleX`,
      contentLocation: {
        '@type': 'Place',
        name: SITE_GEO.placename,
        address: {
          '@type': 'PostalAddress',
          addressLocality: SITE_GEO.city,
          addressRegion: SITE_GEO.region,
          addressCountry: SITE_GEO.countryCode,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: SITE_GEO.latitude,
          longitude: SITE_GEO.longitude,
        },
      },
    },
    provider: { '@id': `${site}/#organization` },
    inLanguage: 'en',
    isAccessibleForFree: opts.priceXAF === 0,
    ...(opts.instructorName
      ? {
          instructor: {
            '@type': 'Person',
            name: opts.instructorName,
          },
        }
      : {}),
    ...(typeof opts.priceXAF === 'number'
      ? {
          offers: {
            '@type': 'Offer',
            price: opts.priceXAF,
            priceCurrency: 'XAF',
            availability: 'https://schema.org/InStock',
            url: opts.url,
          },
        }
      : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
