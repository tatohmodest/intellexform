'use client';

import { useLanguage } from '@/components/i18n/LanguageProvider';

type Props = {
  /** Compact for tight headers */
  size?: 'sm' | 'md';
  className?: string;
  /** Dark footer surfaces */
  variant?: 'light' | 'dark';
};

/**
 * EN | FR control. Marks itself notranslate so Google Translate
 * does not rewrite the labels while switching.
 */
export default function LanguageToggle({
  size = 'md',
  className = '',
  variant = 'light',
}: Props) {
  const { language, setLanguage } = useLanguage();
  const pad = size === 'sm' ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-[12px]';
  const isDark = variant === 'dark';

  return (
    <div
      className={`notranslate inline-flex items-center rounded-full border p-0.5 ${className}`}
      style={{
        borderColor: isDark ? 'rgba(251,248,240,0.22)' : 'var(--line)',
        background: isDark ? 'rgba(251,248,240,0.06)' : 'var(--paper)',
      }}
      translate="no"
      role="group"
      aria-label="Language"
    >
      {(['en', 'fr'] as const).map((code) => {
        const active = language === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLanguage(code)}
            className={`${pad} rounded-full font-semibold uppercase tracking-[0.06em] transition-colors`}
            style={
              active
                ? {
                    background: isDark ? 'rgba(251,248,240,0.92)' : 'var(--ink)',
                    color: isDark ? 'var(--ink)' : '#fff',
                  }
                : {
                    background: 'transparent',
                    color: isDark ? 'rgba(251,248,240,0.65)' : 'var(--ink-soft)',
                  }
            }
            aria-pressed={active}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
