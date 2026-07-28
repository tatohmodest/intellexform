import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo/share';

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl();
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
      {
        userAgent: 'GPTBot',
        allow: ['/', '/about', '/courses', '/tutorials', '/ecosystem', '/contact'],
        disallow: ['/dashboard/', '/admin/', '/api/'],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
