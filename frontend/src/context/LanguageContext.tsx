'use client';

import React, { createContext, useContext, useEffect, useCallback, useMemo, useSyncExternalStore } from 'react';
import { masterTranslations, Language, TranslationMap } from '@/i18n';

export type { Language };
export const translations: TranslationMap = masterTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key
});

const LANG_STORE_EVENT = 'syncbridge_lang_update';

function subscribeToLang(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener(LANG_STORE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(LANG_STORE_EVENT, callback);
  };
}

function getStoredLangSnapshot(): Language {
  try {
    const saved = localStorage.getItem('syncbridge_lang') as Language;
    if (saved && (saved === 'en' || saved === 'hi' || saved === 'kn' || saved === 'ta')) {
      return saved;
    }
  } catch {
    // ignore storage error
  }
  return 'en';
}

function getServerLangSnapshot(): Language {
  return 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore<Language>(subscribeToLang, getStoredLangSnapshot, getServerLangSnapshot);

  // Synchronize HTML lang attribute for accessibility, SEO and native font rendering
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    try {
      localStorage.setItem('syncbridge_lang', lang);
      window.dispatchEvent(new Event(LANG_STORE_EVENT));
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const item = translations[key];
    let result = item ? (item[language] || item.en || key) : key;

    if (params) {
      for (const [pKey, pVal] of Object.entries(params)) {
        result = result.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
      }
    }

    return result;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
