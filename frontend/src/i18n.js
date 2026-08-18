import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import te from './locales/te.json';
import hi from './locales/hi.json';
import ta from './locales/ta.json';

const resources = {
  en: { translation: en },
  te: { translation: te },
  hi: { translation: hi },
  ta: { translation: ta }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    saveMissing: true,
    parseMissingKeyHandler: (key) => {
      console.warn(`[i18n Missing Key]: Key "${key}" not found in current translation resource.`);
      return key;
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
