import type { Metadata } from 'next';

const DEFAULT_SITE = 'https://intellex.cm';
const DEFAULT_SHARE_IMAGE = '/way_selfpaced.webp';

/** Public site origin for absolute Open Graph / share URLs. */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_PUBLIC_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    DEFAULT_SITE;
  const trimmed = String(raw).trim().replace(/\/$/, '');
  if (!trimmed) return DEFAULT_SITE;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
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
    if (/^https?:\/\//i.test(v)) return v;
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
