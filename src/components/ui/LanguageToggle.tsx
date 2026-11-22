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
      className="flex items-center gap-1 rounded-full border border-line bg-ink/70 p-1"
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
              'rounded-full px-3 py-1 font-mono text-[11px] tracking-[0.18em] transition-colors',
              isActive ? 'bg-gold text-void' : 'text-muted hover:bg-violet/70 hover:text-bone',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
