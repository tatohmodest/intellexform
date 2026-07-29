'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/components/i18n/LanguageProvider';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: Record<string, unknown>,
          elementId: string,
        ) => void;
      };
    };
  }
}

const SCRIPT_ID = 'intellex-google-translate';

function markCodeUntranslatable(root: ParentNode = document) {
  root.querySelectorAll('pre, code, .tutorial-code, .tok-keyword, .tok-string, .hljs, .mono').forEach((el) => {
    el.classList.add('notranslate');
    el.setAttribute('translate', 'no');
  });
}

function selectGoogleLanguage(lang: 'en' | 'fr') {
  const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (!combo) return false;
  const value = lang === 'fr' ? 'fr' : 'en';
  if (combo.value === value) return true;
  combo.value = value;
  combo.dispatchEvent(new Event('change'));
  return true;
}

/**
 * Loads Google Website Translator (hidden UI) and switches EN↔FR.
 * Code / syntax stays English via translate="no" + .notranslate.
 */
export default function SiteTranslator() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const booted = useRef(false);

  // Boot Google Translate once.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      // eslint-disable-next-line no-new
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,fr',
          autoDisplay: false,
          layout: 0,
        },
        'google_translate_element',
      );
      booted.current = true;
      // Apply preferred language shortly after widget mounts.
      window.setTimeout(() => {
        selectGoogleLanguage(language);
        markCodeUntranslatable();
      }, 400);
    };

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate?.TranslateElement && !booted.current) {
      window.googleTranslateElementInit();
    }

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) markCodeUntranslatable(node);
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    markCodeUntranslatable();

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- boot once; language applied in next effect
  }, []);

  // Apply language when toggle changes or route changes (App Router soft nav).
  useEffect(() => {
    markCodeUntranslatable();
    let tries = 0;
    const tick = window.setInterval(() => {
      tries += 1;
      const ok = selectGoogleLanguage(language);
      if (ok || tries > 20) window.clearInterval(tick);
    }, 250);
    return () => window.clearInterval(tick);
  }, [language, pathname]);

  return (
    <div
      id="google_translate_element"
      className="pointer-events-none fixed left-0 top-0 h-0 w-0 overflow-hidden opacity-0"
      aria-hidden
    />
  );
}
