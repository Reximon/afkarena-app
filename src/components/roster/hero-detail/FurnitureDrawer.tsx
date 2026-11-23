import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/cn'
import { PickerDrawer } from './PickerDrawer'

const FURNITURE_OPTIONS = [0, 3, 9, 36] as const

type FurnitureValue = (typeof FURNITURE_OPTIONS)[number]

interface FurnitureDrawerProps {
  furniture: number
  onChange: (value: FurnitureValue) => void
  onClose: () => void
}

export function FurnitureDrawer({ furniture, onChange, onClose }: FurnitureDrawerProps) {
  const { t } = useTranslation()

  return (
    <PickerDrawer kicker={t('common.edit')} title={t('hero.furniture')} onClose={onClose}>
      <div className="mt-4 grid grid-cols-4 gap-1.5">
        {FURNITURE_OPTIONS.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={value === furniture}
            onClick={() => onChange(value)}
            className={cn(
              'rounded-lg border px-1 py-2 font-display text-sm transition-colors',
              value === furniture
                ? 'border-gild/50 bg-gild/10 text-gild'
                : 'border-line bg-night/40 text-muted hover:border-gild/30 hover:text-parch',
            )}
          >
            {value === 0 ? t('common.none') : `F${value}`}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg border border-line bg-night/30 px-3 py-2">
        <span className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
          {t('hero.furniture')}
        </span>
        <span className="font-display text-sm text-gild">
          {furniture === 0 ? t('common.none') : `F${furniture}`}
        </span>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-muted">{t('heroDialog.furnitureHint')}</p>
    </PickerDrawer>
  )
}
