export type AppLanguage = 'en' | 'fr';

export const LANGUAGE_STORAGE_KEY = 'intellex_lang';
export const DEFAULT_LANGUAGE: AppLanguage = 'en';

export function isAppLanguage(value: unknown): value is AppLanguage {
  return value === 'en' || value === 'fr';
}

export function readStoredLanguage(): AppLanguage {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  try {
    const raw = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isAppLanguage(raw)) return raw;
  } catch {
    /* ignore */
  }
  return DEFAULT_LANGUAGE;
}

export function persistLanguage(lang: AppLanguage) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
  // Mirror for Google Translate persistence across soft navigations / reloads.
  try {
    const host = window.location.hostname;
    if (lang === 'fr') {
      document.cookie = `googtrans=/en/fr;path=/`;
      document.cookie = `googtrans=/en/fr;path=/;domain=.${host}`;
    } else {
      document.cookie = 'googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${host}`;
    }
  } catch {
    /* ignore */
  }
}
