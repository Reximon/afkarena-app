import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/cn'
import { ASCENSIONS, type Ascension } from '@/types'
import { PickerDrawer } from './PickerDrawer'

interface AscensionDrawerProps {
  ascension: Ascension
  heroName: string
  onChange: (ascension: Ascension) => void
  onClose: () => void
}

export function AscensionDrawer({ ascension, heroName, onChange, onClose }: AscensionDrawerProps) {
  const { t } = useTranslation()

  return (
    <PickerDrawer kicker={heroName} title={t('hero.ascension')} onClose={onClose}>
      <div className="mt-4 grid grid-cols-2 gap-1.5">
        {ASCENSIONS.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={value === ascension}
            onClick={() => onChange(value)}
            className={cn(
              'rounded-lg border px-2 py-2 text-xs font-semibold transition-colors',
              value === ascension
                ? 'border-gild/50 bg-gild/10 text-gild'
                : 'border-line bg-night/40 text-muted hover:border-gild/30 hover:text-parch',
            )}
          >
            {t(`ascension.${value}`)}
          </button>
        ))}
      </div>
    </PickerDrawer>
  )
}
