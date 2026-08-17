'use client';

import { useEffect } from 'react';

const STORAGE_KEY = 'intellex_campus_pwa_brand';

export type CampusPwaBrandInfo = {
  slug: string;
  name: string;
  accent?: string;
  logoUrl?: string | null;
};

/** Swap the document manifest / icons so install feels like the campus app. */
export default function CampusPwaBrand({ brand }: { brand: CampusPwaBrandInfo }) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const manifestHref = `/api/pwa/manifest?slug=${encodeURIComponent(brand.slug)}`;
    const iconHref = brand.logoUrl
      ? `/api/pwa/icon?slug=${encodeURIComponent(brand.slug)}&size=192`
      : `/api/pwa/icon?slug=${encodeURIComponent(brand.slug)}&size=192`;

    let link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'manifest';
      document.head.appendChild(link);
    }
    link.href = manifestHref;

    const ensureIcon = (rel: string, sizes?: string) => {
      let el = document.querySelector(
        `link[rel="${rel}"]${sizes ? `[sizes="${sizes}"]` : ''}`,
      ) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.rel = rel;
        if (sizes) el.sizes = sizes;
        document.head.appendChild(el);
      }
      el.href = iconHref;
    };
    ensureIcon('apple-touch-icon', '180x180');
    ensureIcon('icon', '192x192');

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(brand));
    } catch {
      /* ignore */
    }

    return () => {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    };
  }, [brand]);

  return null;
}

export function readCampusPwaBrand(): CampusPwaBrandInfo | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CampusPwaBrandInfo;
  } catch {
    return null;
  }
}
