import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

/**
 * Proxy / fallback campus PWA icon.
 * GET /api/pwa/icon?slug=mpong-academy&size=192
 */
export async function GET(req: NextRequest) {
  const slug = String(req.nextUrl.searchParams.get('slug') || '')
    .trim()
    .toLowerCase()
    .slice(0, 64);
  const sizeRaw = Number(req.nextUrl.searchParams.get('size') || 192);
  const size = sizeRaw === 512 ? 512 : 192;

  if (!slug) {
    return NextResponse.redirect(new URL(`/pwa/icon-${size}.png`, req.url));
  }

  let logoUrl: string | null = null;
  let name = 'Campus';
  let color = '#00B369';

  try {
    const inst = await prisma.institution.findFirst({
      where: {
        OR: [{ slug }, { subdomain: slug }],
        status: { notIn: ['ARCHIVED', 'REJECTED'] },
      },
      select: { logoUrl: true, name: true, primaryColor: true },
    });
    if (inst) {
      logoUrl = inst.logoUrl;
      name = inst.name || name;
      color = inst.primaryColor || color;
    }
  } catch {
    /* use defaults */
  }

  if (logoUrl) {
    try {
      const upstream = await fetch(logoUrl, { next: { revalidate: 3600 } });
      if (upstream.ok) {
        const buf = await upstream.arrayBuffer();
        const contentType = upstream.headers.get('content-type') || 'image/png';
        return new NextResponse(buf, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
    } catch {
      /* fall through to letter mark */
    }
  }

  const letter = (name.trim().charAt(0) || 'C').toUpperCase();
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="100%" height="100%" fill="${color}"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
    font-family="Georgia, serif" font-size="${Math.round(size * 0.48)}" font-weight="700" fill="#ffffff">${letter}</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
