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
    <div className="flex items-center" role="group" aria-label={t('common.language')}>
      {languages.map((option, index) => {
        const isActive = language === option.value

        return (
          <div key={option.value} className="flex items-center">
            {index > 0 ? (
              <span className="mx-0.5 h-3.5 w-px bg-gild/20" aria-hidden="true" />
            ) : null}
            <button
              type="button"
              aria-pressed={isActive}
              onClick={() => setLanguage(option.value)}
              className={cn(
                'rounded-[3px] px-2.5 py-2 font-mono text-[11px] tracking-[0.2em] transition-colors duration-150 active:scale-95',
                isActive
                  ? 'bg-gild/10 text-gild-bright'
                  : 'text-muted hover:bg-gild/5 hover:text-parch',
              )}
            >
              {option.label}
            </button>
          </div>
        )
      })}
    </div>
  )
}
