import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { CANONICAL_SITE_URL } from '@/lib/platformHosts';

export const dynamic = 'force-dynamic';

/**
 * Institution-branded web app manifest.
 * GET /api/pwa/manifest?slug=mpong-academy
 */
export async function GET(req: NextRequest) {
  const slug = String(req.nextUrl.searchParams.get('slug') || '')
    .trim()
    .toLowerCase()
    .slice(0, 64);

  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 });
  }

  const origin = req.nextUrl.origin;
  let name = 'InTelleX';
  let shortName = 'InTelleX';
  let theme = '#FFFFFF';
  let description =
    'Learn at your pace - self-paced courses, live mentors, and an AI tutor.';
  let startUrl = `/site/${slug}`;
  let hasLogo = false;

  try {
    const inst = await prisma.institution.findFirst({
      where: {
        OR: [{ slug }, { subdomain: slug }],
        status: { notIn: ['ARCHIVED', 'REJECTED'] },
      },
      select: {
        name: true,
        slug: true,
        logoUrl: true,
        primaryColor: true,
        description: true,
      },
    });
    if (inst) {
      name = inst.name;
      shortName = inst.name.length > 12 ? inst.name.slice(0, 12) : inst.name;
      theme = inst.primaryColor || theme;
      description = inst.description || `${inst.name} learning campus on InTelleX.`;
      startUrl = `/site/${inst.slug}`;
      hasLogo = Boolean(inst.logoUrl);
    }
  } catch {
    /* fall through with defaults */
  }

  const iconBase = hasLogo
    ? `${origin}/api/pwa/icon?slug=${encodeURIComponent(slug)}`
    : `${origin}/pwa`;

  const icons = hasLogo
    ? [
        {
          src: `${iconBase}&size=192`,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: `${iconBase}&size=512`,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: `${iconBase}&size=192`,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: `${iconBase}&size=512`,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ]
    : [
        {
          src: `${iconBase}/icon-192.png`,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: `${iconBase}/icon-512.png`,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: `${iconBase}/icon-192-maskable.png`,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: `${iconBase}/icon-512-maskable.png`,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ];

  const manifest = {
    name,
    short_name: shortName,
    description,
    start_url: startUrl,
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#FFFFFF',
    theme_color: theme,
    lang: 'en',
    categories: ['education', 'productivity'],
    icons,
    id: `${CANONICAL_SITE_URL}/site/${slug}`,
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
