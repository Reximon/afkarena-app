import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { HeroDetailDialog } from '@/components/roster/HeroDetailDialog'
import { TierHeroTile } from '@/components/tierlist/TierHeroTile'
import { Badge } from '@/components/ui/Badge'
import { buttonStyles } from '@/components/ui/buttonStyles'
import {
  getHeroOptimization,
  getOptimizationGradeForScore,
} from '@/features/heroes/heroOptimization'
import {
  getDefaultTierListMode,
  getTierHeroes,
  getTierLabel,
  getTopTier,
} from '@/features/tierlist/tierlist'
import { useAppStore } from '@/store/useAppStore'

export function TopTierPanel() {
  const { t } = useTranslation()
  const heroes = useAppStore((state) => state.heroes)
  const [detailHeroId, setDetailHeroId] = useState<string | null>(null)
  const mode = getDefaultTierListMode()
  const topTier = getTopTier(mode)

  const topHeroes = useMemo(() => (topTier ? getTierHeroes(topTier) : []), [topTier])

  const stats = useMemo(() => {
    const ownedHeroes = topHeroes.flatMap((entry) => (heroes[entry.id] ? [heroes[entry.id]] : []))
    if (ownedHeroes.length === 0) return { owned: 0, average: null }

    const scores = ownedHeroes.map((hero) => getHeroOptimization(hero).score)

    return {
      owned: ownedHeroes.length,
      average: getOptimizationGradeForScore(
        Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
      ),
    }
  }, [topHeroes, heroes])

  if (!topTier || topHeroes.length === 0) return null

  return (
    <section className="codex-panel p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="panel-title text-2xl">{t('dashboard.topTierTitle')}</h2>
          <p className="mt-1 text-sm text-muted">{t('dashboard.topTierBody')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="gold">
            {mode.name} · {getTierLabel(topTier.tier)}
          </Badge>
          <Link to="/tier-list" className={buttonStyles({ variant: 'secondary', size: 'sm' })}>
            {t('dashboard.topTierViewAll')}
            <ChevronRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant="outline">
          {t('dashboard.topTierOwned', { owned: stats.owned, total: topHeroes.length })}
        </Badge>
        {stats.average ? (
          <Badge variant="cyan">{t('dashboard.topTierAverage', { grade: stats.average })}</Badge>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        {topHeroes.map((entry) => (
          <TierHeroTile
            key={entry.id}
            entry={entry}
            hero={heroes[entry.id]}
            size="sm"
            onOpen={setDetailHeroId}
          />
        ))}
      </div>

      {detailHeroId ? (
        <HeroDetailDialog heroId={detailHeroId} onClose={() => setDetailHeroId(null)} />
      ) : null}
    </section>
  )
}
