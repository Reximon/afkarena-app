import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/cn'
import { usePreferencesStore } from '@/store/usePreferencesStore'
import type { Language } from '@/i18n'

const languages: { value: Language; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'es', label: 'ES' },
]

export function LanguageToggle() {
  const { t } = useTranslation()
  const language = usePreferencesStore((state) => state.language)
  const setLanguage = usePreferencesStore((state) => state.setLanguage)

  return (
    <div
      className="flex h-9 items-center rounded-md border border-gild/20 bg-abyss/60 p-0.5"
      role="group"
      aria-label={t('common.language')}
    >
      {languages.map((option) => {
        const isActive = language === option.value

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => setLanguage(option.value)}
            className={cn(
              'flex h-full items-center rounded-[4px] px-2.5 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors duration-150',
              isActive
                ? 'bg-gild/10 text-gild-bright'
                : 'text-muted hover:bg-gild/5 hover:text-parch',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
