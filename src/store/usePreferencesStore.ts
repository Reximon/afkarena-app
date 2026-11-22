import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n, { initialLanguage, LANGUAGE_STORAGE_KEY, type Language } from '@/i18n'

interface PreferencesState {
  language: Language
  setLanguage: (language: Language) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      language: initialLanguage,
      setLanguage: (language) => {
        set({ language })
        void i18n.changeLanguage(language)
        document.documentElement.lang = language

        try {
          localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
        } catch {
          // Persisting the preference is best-effort.
        }
      },
    }),
    {
      name: 'afk-astral-codex:preferences',
      partialize: (state) => ({ language: state.language }),
      onRehydrateStorage: () => (state) => {
        if (!state) return

        void i18n.changeLanguage(state.language)
        document.documentElement.lang = state.language
      },
    },
  ),
)
