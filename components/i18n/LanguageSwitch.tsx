'use client';

import { useLocale, useSetLocale } from '@/components/i18n/I18nRoot';
import type { Locale } from '@/lib/i18n/locale';

const OPTIONS: { value: Locale; label: string; name: string }[] = [
  { value: 'en', label: 'EN', name: 'English' },
  { value: 'fr', label: 'FR', name: 'Français' },
];

/** EN / FR toggle. Labels are excluded from the DOM translator so they never flip. */
export default function LanguageSwitch({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  const locale = useLocale();
  const setLocale = useSetLocale();

  return (
    <div
      data-no-i18n
      role="group"
      aria-label="Language / Langue"
      className={`inline-flex shrink-0 items-center rounded-full p-0.5 text-[12.5px] font-bold ${
        dark ? 'bg-white/10' : 'bg-[var(--paper-dim)]'
      } ${className}`}
    >
      {OPTIONS.map((o) => {
        const active = locale === o.value;
        return (
          <button
            key={o.value}
            type="button"
            title={o.name}
            aria-pressed={active}
            onClick={() => !active && setLocale(o.value)}
            className={`rounded-full px-2.5 py-1 transition-colors ${
              active
                ? dark
                  ? 'bg-white text-[var(--ink)]'
                  : 'bg-white text-[var(--navy)] shadow-[0_2px_6px_-2px_rgba(18,50,79,0.35)]'
                : dark
                  ? 'text-white/70 hover:text-white'
                  : 'text-[var(--ink-soft)] hover:text-[var(--navy)]'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
