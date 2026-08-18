import { FR_UI } from '@/lib/i18n/fr';
import type { Locale } from '@/lib/i18n/locale';

const FR_LOWER = new Map<string, string>();
for (const [en, fr] of Object.entries(FR_UI)) {
  FR_LOWER.set(en.toLowerCase(), fr);
}

const CODEISH =
  /[{}`]|=>|<\/?[a-zA-Z]|^(function|const|let|var|import|export|class|return|await)\s|https?:\/\/|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

export function looksLikeCode(text: string): boolean {
  const value = text.trim();
  if (!value) return false;
  if (value.length > 420) return true;
  return CODEISH.test(value);
}

function lookupFr(core: string): string | null {
  const exact = FR_UI[core];
  if (exact) return exact;
  const punct = core.match(/^(.*?)([:?!…]+)$/);
  if (punct) {
    const head = punct[1].trimEnd();
    if (head && FR_UI[head]) return FR_UI[head] + punct[2];
  }
  const lessons = core.match(/^(\d+)\s+lessons\s+·\s+beginner to pro$/i);
  if (lessons) return `${lessons[1]} leçons · du débutant au pro`;
  const minRead = core.match(/^(\d+)\s+min read$/i);
  if (minRead) return `${minRead[1]} min de lecture`;
  const sectionLessons = core.match(/^(\d+)\s+lessons\s+·\s+~(\d+)\s+min$/i);
  if (sectionLessons) return `${sectionLessons[1]} leçons · ~${sectionLessons[2]} min`;
  return FR_LOWER.get(core.toLowerCase()) ?? null;
}

/** Translate a single UI string. Never mutates code-like text. */
export function translateUiText(raw: string, locale: Locale): string {
  if (locale !== 'fr' || !raw) return raw;
  const match = raw.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!match) return raw;
  const lead = match[1];
  const core = match[2];
  const trail = match[3];
  if (!core) return raw;
  const collapsed = core.replace(/\s+/g, ' ').trim();
  if (!collapsed || looksLikeCode(collapsed)) return raw;
  const found = lookupFr(collapsed);
  if (!found) return raw;
  return lead + found + trail;
}

export function t(text: string, locale: Locale): string {
  return translateUiText(text, locale);
}

export const TRANSLATABLE_ATTRS = ['placeholder', 'title', 'aria-label', 'alt'] as const;
