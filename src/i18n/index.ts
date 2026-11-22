import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './locales/en'
import { es } from './locales/es'

export const LANGUAGE_STORAGE_KEY = 'afk-astral-codex:lang'

export const resources = {
  en: { translation: en },
  es: { translation: es },
} as const

export type Language = keyof typeof resources

const getInitialLanguage = (): Language => {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (stored === 'en' || stored === 'es') return stored
  } catch {
    // localStorage can be unavailable in private contexts.
  }

  return 'en'
}

export const initialLanguage = getInitialLanguage()

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'en',
  supportedLngs: ['en', 'es'],
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
})

if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLanguage
}

export default i18n
