export const LOCALE_COOKIE = 'intellex_locale';
export const LOCALES = ['en', 'fr'] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'fr';
}

/** French if the tag starts with `fr`; everything else stays English. */
export function localeFromTag(tag: string | null | undefined): Locale {
  const raw = String(tag || '')
    .trim()
    .toLowerCase()
    .replace('_', '-');
  if (!raw) return 'en';
  const primary = raw.split('-')[0];
  return primary === 'fr' ? 'fr' : 'en';
}

/**
 * Pick en/fr from an Accept-Language header (q-value ordered).
 * First matching French or English tag wins; default English.
 */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return 'en';
  const parts = header.split(',').map((chunk) => {
    const [tagPart, ...params] = chunk.trim().split(';');
    const qParam = params.find((p) => p.trim().startsWith('q='));
    const q = qParam ? Number.parseFloat(qParam.split('=')[1] || '1') : 1;
    return { tag: tagPart.trim(), q: Number.isFinite(q) ? q : 1 };
  });
  parts.sort((a, b) => b.q - a.q);
  for (const part of parts) {
    const loc = localeFromTag(part.tag);
    const primary = part.tag.toLowerCase().split(/[-_]/)[0];
    if (primary === 'fr' || primary === 'en') return loc;
  }
  return localeFromTag(parts[0]?.tag);
}

export function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en';
  const list =
    navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language];
  for (const tag of list) {
    const primary = String(tag || '')
      .toLowerCase()
      .split(/[-_]/)[0];
    if (primary === 'fr') return 'fr';
    if (primary === 'en') return 'en';
  }
  return localeFromTag(list[0]);
}

export function detectLocale(opts: {
  cookie?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  if (isLocale(opts.cookie)) return opts.cookie;
  return localeFromAcceptLanguage(opts.acceptLanguage);
}

export function persistLocaleCookie(locale: Locale) {
  if (typeof document === 'undefined') return;
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=34560000; SameSite=Lax`;
}
