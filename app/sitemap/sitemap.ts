import type { MetadataRoute } from 'next';
import { buildSitemapEntries } from '@/lib/seo/buildSitemap';

export const revalidate = 3600;

/**
 * Alternate path Google Search Console often fetches more reliably than
 * root /sitemap.xml on Next.js App Router.
 * URL: https://intellex.loopingbinary.com/sitemap/sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries();
}
