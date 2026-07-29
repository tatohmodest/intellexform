import type { MetadataRoute } from 'next';
import { sitemapBaseUrl } from '@/lib/seo/buildSitemap';

/**
 * Robots for https://intellex.loopingbinary.com
 * Point Google at both sitemap URLs; omit Host (deprecated / can confuse parsers).
 */
export default function robots(): MetadataRoute.Robots {
  const site = sitemapBaseUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/admin/',
          '/api/',
          '/checkout/',
          '/onboard/',
          '/campus-gateway/',
        ],
      },
    ],
    sitemap: [`${site}/sitemap.xml`, `${site}/sitemap/sitemap.xml`],
  };
}
