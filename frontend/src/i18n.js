// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend) // Enables HTTP loading of translation files
  .use(LanguageDetector) // Automatically detects the user's language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    fallbackLng: 'en',
    debug: false,
    detection: {
      // The order in which to detect the user's language
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      // Cache the user language in these places
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    backend: {
      // The translation files are served from the public folder
      loadPath: '/locales/{{lng}}/translation.json',
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
