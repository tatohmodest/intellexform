'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_LANGUAGE,
  persistLanguage,
  readStoredLanguage,
  type AppLanguage,
} from '@/lib/i18n/config';

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const stored = readStoredLanguage();
    setLanguageState(stored);
    document.documentElement.lang = stored;
    document.documentElement.setAttribute('data-lang', stored);
  }, []);

  const setLanguage = useCallback((lang: AppLanguage) => {
    setLanguageState(lang);
    persistLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  }, [language, setLanguage]);

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage }),
    [language, setLanguage, toggleLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      language: DEFAULT_LANGUAGE,
      setLanguage: () => {},
      toggleLanguage: () => {},
    };
  }
  return ctx;
}
