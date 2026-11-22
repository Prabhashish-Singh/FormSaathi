import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import hi from './locales/hi.json'
import pa from './locales/pa.json'

export const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
]

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, hi: { translation: hi }, pa: { translation: pa } },
    supportedLngs: ['en', 'hi', 'pa'],
    fallbackLng: 'en',
    lng: localStorage.getItem('formsaathi-language') || 'en',
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: 'formsaathi-language',
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  })

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language
  localStorage.setItem('formsaathi-language', language)
})
document.documentElement.lang = i18n.resolvedLanguage || 'en'

export default i18n
