import type { Metadata } from 'next';

import { CANONICAL_SITE_URL } from '@/lib/platformHosts';

/** Public production origin — always used for share / Open Graph links. */
export { CANONICAL_SITE_URL };

const DEFAULT_SHARE_IMAGE = '/way_selfpaced.webp';

function normalizeOrigin(raw: string): string {
  const trimmed = String(raw || '')
    .trim()
    .replace(/\/$/, '');
  if (!trimmed) return '';
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(withProtocol);
    const host = u.hostname.toLowerCase();
    // Never expose Vercel deployment hosts in shared / OG links.
    if (host.endsWith('.vercel.app') || host === 'localhost' || host === '127.0.0.1') {
      return '';
    }
    return `${u.protocol}//${u.host}`;
  } catch {
    return '';
  }
}

/** Public site origin for absolute Open Graph / share URLs. */
export function getSiteUrl(): string {
  const fromEnv =
    normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL || '') ||
    normalizeOrigin(process.env.APP_PUBLIC_URL || '');
  return fromEnv || CANONICAL_SITE_URL;
}

/** Resolve a path or URL to an absolute HTTPS URL for link previews. */
export function absoluteUrl(
  pathOrUrl: string | null | undefined,
  fallback: string = DEFAULT_SHARE_IMAGE,
): string {
  const site = getSiteUrl();
  const pick = (value: string) => {
    const v = value.trim();
    if (!v) return `${site}${fallback.startsWith('/') ? fallback : `/${fallback}`}`;
    if (/^https?:\/\//i.test(v)) {
      // Rewrite accidental Vercel hosts to the canonical domain.
      try {
        const u = new URL(v);
        if (u.hostname.toLowerCase().endsWith('.vercel.app')) {
          return `${site}${u.pathname}${u.search}${u.hash}`;
        }
      } catch {
        /* keep as-is below */
      }
      return v;
    }
    if (v.startsWith('//')) return `https:${v}`;
    return `${site}${v.startsWith('/') ? v : `/${v}`}`;
  };

  const abs = pick(pathOrUrl || '');
  // WhatsApp / many crawlers ignore SVG for link previews.
  if (/\.svg(\?|#|$)/i.test(abs)) return pick(fallback);
  return abs;
}

export type ShareCardInput = {
  title: string;
  description?: string | null;
  path: string;
  image?: string | null;
  imageAlt?: string;
};

/** Open Graph + large Twitter card so WhatsApp / iMessage show the image. */
export function buildShareMetadata(input: ShareCardInput): Metadata {
  const title = input.title.trim() || 'InTelleX';
  const description = (input.description || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
  const url = absoluteUrl(input.path);
  const image = absoluteUrl(input.image);
  const alt = input.imageAlt || title;

  return {
    title,
    description: description || undefined,
    metadataBase: new URL(getSiteUrl()),
    alternates: { canonical: url },
    openGraph: {
      title,
      description: description || undefined,
      url,
      siteName: 'InTelleX',
      type: 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || undefined,
      images: [image],
    },
  };
}
