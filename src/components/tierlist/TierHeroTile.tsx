import { useTranslation } from 'react-i18next'
import { FramedHeroIcon } from '@/components/heroes/FramedHeroIcon'
import {
  getHeroOptimization,
  type HeroOptimization,
  type OptimizationGrade,
} from '@/features/heroes/heroOptimization'
import { cn } from '@/lib/cn'
import { heroIconUrl } from '@/lib/framedIcon'
import type { HeroCatalogEntry, HeroProgress } from '@/types'

const GRADE_FILL: Record<OptimizationGrade, string> = {
  'S+': '#f7dfa4',
  S: '#e2b96d',
  A: '#78c8b5',
  B: '#cdb692',
  C: '#98866c',
  D: '#e26a43',
}

export function OptimizationBadge({ optimization }: { optimization?: HeroOptimization }) {
  const { t } = useTranslation()

  if (!optimization) {
    return (
      <span
        title={t('tierList.notOwned')}
        className="inline-flex min-w-[1.65rem] justify-center rounded-[4px] border border-line px-1 font-mono text-[9px] leading-4 font-bold text-muted"
      >
        —
      </span>
    )
  }

  return (
    <span
      title={t('tierList.gradeTitle', { score: optimization.score })}
      className="inline-flex min-w-[1.65rem] justify-center rounded-[4px] px-1 font-mono text-[9px] leading-4 font-bold text-[#241406]"
      style={{ backgroundColor: GRADE_FILL[optimization.grade] }}
    >
      {optimization.grade}
    </span>
  )
}

interface TierHeroTileProps {
  entry: HeroCatalogEntry
  hero?: HeroProgress
  size?: 'md' | 'sm'
  onOpen?: (heroId: string) => void
}

export function TierHeroTile({ entry, hero, size = 'md', onOpen }: TierHeroTileProps) {
  const { t } = useTranslation()
  const optimization = hero ? getHeroOptimization(hero) : undefined

  const content = (
    <>
      <span
        className={cn(
          'block rounded-xl border bg-night/45 p-[3px] transition-colors',
          hero ? 'border-gild/25' : 'border-line/60',
        )}
      >
        {hero ? (
          <FramedHeroIcon
            heroId={entry.id}
            ascension={hero.ascension}
            signatureItem={hero.signatureItem}
            furniture={hero.furniture}
            engraving={hero.engraving}
            alt={entry.displayName}
            className="w-full rounded-[0.45rem]"
          />
        ) : (
          <img
            src={heroIconUrl(entry.id)}
            alt={entry.displayName}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="aspect-square w-full rounded-[0.45rem] object-cover opacity-60 grayscale"
          />
        )}
      </span>
      <span
        className={cn(
          'mt-1 block truncate text-center',
          size === 'sm' ? 'text-[9px]' : 'text-[10px]',
          hero ? 'font-semibold text-parch' : 'text-muted',
        )}
        title={entry.displayName}
      >
        {entry.displayName}
      </span>
      <span className="mt-1 flex justify-center">
        <OptimizationBadge optimization={optimization} />
      </span>
    </>
  )

  const width = size === 'sm' ? 'w-[3.4rem]' : 'w-[4.4rem]'

  if (hero && onOpen) {
    return (
      <button
        type="button"
        onClick={() => onOpen(entry.id)}
        aria-label={t('roster.viewHero', { name: entry.displayName })}
        className={cn(
          width,
          'group block shrink-0 rounded-lg text-center focus-visible:ring-2 focus-visible:ring-gild/60 focus-visible:outline-none',
        )}
      >
        {content}
      </button>
    )
  }

  return (
    <div className={cn(width, 'block shrink-0 text-center')} title={t('tierList.notOwned')}>
      {content}
    </div>
  )
}
