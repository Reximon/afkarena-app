import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Stars } from '@/components/ui/Stars'
import { ASCENSIONS, type Ascension } from '@/types'

interface AscensionStarsProps {
  value: Ascension
  onChange: (value: Ascension) => void
}

const ASCENDED_INDEX = ASCENSIONS.indexOf('ascended')

export function AscensionStars({ value, onChange }: AscensionStarsProps) {
  const { t } = useTranslation()
  const index = ASCENSIONS.indexOf(value)
  const starCount = index > ASCENDED_INDEX ? index - ASCENDED_INDEX : 0

  function step(delta: number) {
    const next = Math.min(ASCENSIONS.length - 1, Math.max(0, index + delta))
    onChange(ASCENSIONS[next])
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={index === 0}
          aria-label={`${t('common.decrease')} ${t('hero.ascension')}`}
          className="icon-action rounded-lg border border-line bg-night/40 p-1.5 text-muted hover:border-gild/40 hover:text-parch disabled:opacity-40"
        >
          <ChevronLeft size={15} aria-hidden="true" />
        </button>
        <span className="min-w-28 text-center font-display text-sm text-gild">
          {t(`ascension.${value}`)}
        </span>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={index === ASCENSIONS.length - 1}
          aria-label={`${t('common.increase')} ${t('hero.ascension')}`}
          className="icon-action rounded-lg border border-line bg-night/40 p-1.5 text-muted hover:border-gild/40 hover:text-parch disabled:opacity-40"
        >
          <ChevronRight size={15} aria-hidden="true" />
        </button>
      </div>
      <Stars
        total={5}
        value={starCount}
        onChange={(stars) => onChange(ASCENSIONS[ASCENDED_INDEX + stars])}
        size={18}
        label={t('hero.ascension')}
        className="justify-center"
      />
      <p className="text-center text-[10px] leading-relaxed text-muted">
        {t('heroScreen.ascensionHint')}
      </p>
    </div>
  )
}
