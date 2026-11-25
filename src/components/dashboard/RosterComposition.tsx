import { Plus, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FactionIcon } from '@/components/heroes/FactionIcon'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { buttonStyles } from '@/components/ui/buttonStyles'
import {
  ASCENSION_BUCKETS,
  getAscensionCounts,
  getFactionCounts,
  type AscensionBucket,
} from '@/features/dashboard/insights'
import { getFactionColor } from '@/features/heroes/heroCatalog'
import type { HeroProgress } from '@/types'

const BUCKET_COLORS: Record<AscensionBucket, string> = {
  fiveStar: '#f7dfa4',
  ascended: '#e2b96d',
  mythic: '#78c8b5',
  lower: '#7c6650',
}

const BUCKET_LABEL_KEYS = {
  fiveStar: 'dashboard.bucketFiveStar',
  ascended: 'dashboard.bucketAscended',
  mythic: 'dashboard.bucketMythic',
  lower: 'dashboard.bucketLower',
} as const

export function RosterComposition({ heroes }: { heroes: Record<string, HeroProgress> }) {
  const { t } = useTranslation()
  const owned = Object.keys(heroes).length

  if (owned === 0) {
    return (
      <EmptyState
        icon={Users}
        title={t('dashboard.emptyTitle')}
        body={t('dashboard.emptyBody')}
        action={
          <Link to="/roster" className={buttonStyles()}>
            <Plus size={16} aria-hidden="true" />
            {t('dashboard.addHero')}
          </Link>
        }
      />
    )
  }

  const factions = getFactionCounts(heroes)
  const maxFactionCount = Math.max(...factions.map((entry) => entry.count), 1)
  const ascensions = getAscensionCounts(heroes)

  return (
    <section className="codex-panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="panel-title text-2xl">{t('dashboard.compositionTitle')}</h2>
        <Badge variant="outline">{owned}</Badge>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="min-w-0">
          <h3 className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
            {t('dashboard.compositionFaction')}
          </h3>
          <div className="mt-3 grid gap-x-5 gap-y-2.5 sm:grid-cols-2">
            {factions.map(({ faction, count }) => {
              const label = t(`faction.${faction}`)
              return (
                <div key={faction} className="flex items-center gap-2.5">
                  <FactionIcon faction={faction} label={label} className="size-6 shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-xs text-parch">{label}</span>
                      <span className="font-mono text-[10px] text-muted">{count}</span>
                    </span>
                    <span className="mt-1 block h-1 overflow-hidden rounded-full bg-night/70">
                      <span
                        className="block h-full rounded-full transition-[width] duration-500"
                        style={{
                          width: `${(count / maxFactionCount) * 100}%`,
                          backgroundColor: getFactionColor(faction),
                        }}
                      />
                    </span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="min-w-0 border-t border-gild/10 pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
          <h3 className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
            {t('dashboard.compositionAscension')}
          </h3>

          <div
            className="mt-3 flex h-3 overflow-hidden rounded-full border border-gild/20 bg-night/50 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]"
            aria-hidden="true"
          >
            {ASCENSION_BUCKETS.map((bucket) => {
              const percent = (ascensions[bucket] / owned) * 100
              return percent > 0 ? (
                <span
                  key={bucket}
                  className="h-full"
                  style={{ width: `${percent}%`, backgroundColor: BUCKET_COLORS[bucket] }}
                />
              ) : null
            })}
          </div>

          <ul className="mt-4 space-y-2">
            {ASCENSION_BUCKETS.map((bucket) => (
              <li key={bucket} className="flex items-center gap-2.5 text-xs">
                <span
                  className="size-2 shrink-0 rotate-45 rounded-[1px]"
                  style={{ backgroundColor: BUCKET_COLORS[bucket] }}
                  aria-hidden="true"
                />
                <span className="flex-1 truncate text-parch">{t(BUCKET_LABEL_KEYS[bucket])}</span>
                <span className="font-mono text-[10px] text-muted">{ascensions[bucket]}</span>
                <span className="w-9 text-right font-mono text-[10px] text-muted">
                  {Math.round((ascensions[bucket] / owned) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
