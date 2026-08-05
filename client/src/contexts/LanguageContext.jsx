import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import en from '../i18n/en.json';
import bn from '../i18n/bn.json';

const translations = { en, bn };
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const stored = localStorage.getItem('nikah-lang');
    if (stored === 'en' || stored === 'bn') return stored;
    if (typeof navigator !== 'undefined' && navigator.language?.startsWith('bn')) return 'bn';
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('nikah-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l) => {
    if (l === 'en' || l === 'bn') setLangState(l);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState(prev => prev === 'en' ? 'bn' : 'en');
  }, []);

  const t = useCallback((key, fallback) => {
    const keys = key.split('.');
    let val = translations[lang];
    for (const k of keys) {
      if (val && typeof val === 'object') val = val[k];
      else return fallback ?? key;
    }
    return val ?? fallback ?? key;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, toggleLang, t }), [lang, setLang, toggleLang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
