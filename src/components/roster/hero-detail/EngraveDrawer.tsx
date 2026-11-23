import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/cn'
import { PickerDrawer } from './PickerDrawer'

const ENGRAVING_OPTIONS = [0, 30, 60, 80] as const

interface EngraveDrawerProps {
  engraving: number
  onChange: (value: 0 | 30 | 60 | 80) => void
  onClose: () => void
}

export function EngraveDrawer({ engraving, onChange, onClose }: EngraveDrawerProps) {
  const { t } = useTranslation()

  return (
    <PickerDrawer kicker={t('heroDialog.engrave')} title={t('hero.engraving')} onClose={onClose}>
      <div className="mt-4 grid grid-cols-4 gap-1.5">
        {ENGRAVING_OPTIONS.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={value === engraving}
            onClick={() => onChange(value)}
            className={cn(
              'rounded-lg border px-1 py-2 font-display text-sm transition-colors',
              value === engraving
                ? 'border-gild/50 bg-gild/10 text-gild'
                : 'border-line bg-night/40 text-muted hover:border-gild/30 hover:text-parch',
            )}
          >
            {value === 0 ? t('common.none') : `E${value}`}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg border border-line bg-night/30 px-3 py-2">
        <span className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
          {t('hero.engraving')}
        </span>
        <span className="font-display text-sm text-gild">
          {engraving === 0 ? t('common.none') : `E${engraving}`}
        </span>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-muted">{t('heroDialog.engraveHint')}</p>
    </PickerDrawer>
  )
}
