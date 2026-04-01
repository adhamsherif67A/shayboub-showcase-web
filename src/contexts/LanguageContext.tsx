import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en, ar, Translations } from '../i18n';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Translations> = { en, ar };

// Safe localStorage access
const getStoredLanguage = (): Language | null => {
  try {
    const saved = localStorage.getItem('shayboub-lang');
    if (saved === 'ar' || saved === 'en') return saved;
  } catch {
    // localStorage not available
  }
  return null;
};

const getBrowserLanguage = (): Language => {
  try {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('ar')) return 'ar';
  } catch {
    // navigator not available
  }
  return 'en';
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return getStoredLanguage() || getBrowserLanguage();
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('shayboub-lang', lang);
    } catch {
      // localStorage not available
    }
  };

  // Update document direction and lang attribute
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    isRTL: language === 'ar',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
