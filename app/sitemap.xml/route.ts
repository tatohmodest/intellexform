import { NextResponse } from 'next/server';
import { buildSitemapEntries, sitemapEntriesToXml } from '@/lib/seo/buildSitemap';

export const runtime = 'nodejs';
export const revalidate = 3600;
export const dynamic = 'force-dynamic';

/**
 * Explicit Route Handler for /sitemap.xml - stable Content-Type and no
 * metadata-file quirks that sometimes make GSC report "Couldn't fetch".
 */
export async function GET() {
  const entries = await buildSitemapEntries();
  const xml = sitemapEntriesToXml(entries);
  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
