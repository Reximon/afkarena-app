import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ExternalLink, Filter, Users } from 'lucide-react'
import { HeroDetailDialog } from '@/components/roster/HeroDetailDialog'
import { TierHeroTile } from '@/components/tierlist/TierHeroTile'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { buttonStyles } from '@/components/ui/buttonStyles'
import {
  getHeroOptimization,
  getOptimizationGradeForScore,
} from '@/features/heroes/heroOptimization'
import {
  DEFAULT_TIER_LIST_SLUG,
  getDefaultTierListMode,
  getTierHeroes,
  getTierLabel,
  getTierListHeroCount,
  getTierListMode,
  tierListModes,
  tierListSource,
  tierListUpdatedAt,
} from '@/features/tierlist/tierlist'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/useAppStore'

const TIER_COLORS: Record<string, string> = {
  SS: '#f7dfa4',
  S_PLUS: '#f7dfa4',
  S: '#e2b96d',
  A_PLUS: '#78c8b5',
  A: '#78c8b5',
  B_PLUS: '#cdb692',
  B: '#b29a78',
  C: '#98866c',
  D: '#e26a43',
  F: '#e26a43',
}

const DEFAULT_TIER_COLOR = '#b29a78'

export function TierListPage() {
  const { t, i18n } = useTranslation()
  const heroes = useAppStore((state) => state.heroes)
  const [slug, setSlug] = useState(DEFAULT_TIER_LIST_SLUG)
  const [ownedOnly, setOwnedOnly] = useState(false)
  const [detailHeroId, setDetailHeroId] = useState<string | null>(null)

  const mode = getTierListMode(slug) ?? getDefaultTierListMode()
  const rosterCount = Object.keys(heroes).length

  const stats = useMemo(() => {
    const heroIds = mode.tiers.flatMap((tier) => tier.heroIds)
    const ownedIds = heroIds.filter((heroId) => heroes[heroId])
    const scores = ownedIds.map((heroId) => getHeroOptimization(heroes[heroId]).score)

    return {
      total: heroIds.length,
      owned: ownedIds.length,
      average:
        scores.length > 0
          ? getOptimizationGradeForScore(
              Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
            )
          : null,
    }
  }, [mode, heroes])

  const tiers = useMemo(
    () =>
      mode.tiers
        .map((tier) => ({
          tier,
          entries: getTierHeroes(tier).filter((entry) => !ownedOnly || Boolean(heroes[entry.id])),
        }))
        .filter((row) => row.entries.length > 0),
    [mode, ownedOnly, heroes],
  )

  const updatedLabel = tierListUpdatedAt
    ? new Date(`${tierListUpdatedAt}T00:00:00Z`).toLocaleDateString(i18n.language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t('tierList.eyebrow')}
        title={t('tierList.title')}
        subtitle={t('tierList.subtitle')}
        className="sm:flex-col sm:items-start sm:justify-start"
        actions={
          <>
            {updatedLabel ? (
              <Badge variant="outline">{t('tierList.updated', { date: updatedLabel })}</Badge>
            ) : null}
            <a
              href={tierListSource}
              target="_blank"
              rel="noreferrer"
              className={buttonStyles({ variant: 'secondary', size: 'sm' })}
            >
              <ExternalLink size={14} aria-hidden="true" />
              {t('tierList.source')}
            </a>
          </>
        }
      />

      <div
        role="tablist"
        aria-label={t('tierList.title')}
        className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-2xl border border-gild/25 bg-abyss/50 p-1 shadow-[inset_0_2px_10px_rgba(0,0,0,0.45)]"
      >
        {tierListModes.map((item) => {
          const active = item.slug === mode.slug

          return (
            <button
              key={item.slug}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSlug(item.slug)}
              className={cn(
                'game-tab inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm transition-[color,background-color,border-color,transform] duration-150 active:scale-[0.97]',
              )}
            >
              <span className="font-medium">{item.name}</span>
              <Badge variant={active ? 'gold' : 'muted'}>{getTierListHeroCount(item)}</Badge>
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={stats.owned > 0 ? 'gold' : 'muted'}>
          {t('tierList.ownedCount', { owned: stats.owned, total: stats.total })}
        </Badge>
        {stats.average ? (
          <Badge variant="cyan">{t('tierList.averageGrade', { grade: stats.average })}</Badge>
        ) : null}
        <Button
          variant={ownedOnly ? 'secondary' : 'ghost'}
          size="sm"
          aria-pressed={ownedOnly}
          onClick={() => setOwnedOnly((current) => !current)}
        >
          <Filter size={14} aria-hidden="true" />
          {t('tierList.ownedOnly')}
        </Button>
      </div>

      {rosterCount === 0 ? (
        <div className="codex-panel-soft flex flex-wrap items-center gap-3 p-4">
          <span className="game-medallion size-9 shrink-0 text-gild">
            <Users size={16} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <p className="min-w-0 flex-1 text-sm text-muted">{t('tierList.emptyRoster')}</p>
          <Link to="/roster" className={buttonStyles({ variant: 'secondary', size: 'sm' })}>
            {t('tierList.emptyRosterAction')}
          </Link>
        </div>
      ) : null}

      {tiers.length === 0 ? (
        <EmptyState
          icon={Filter}
          title={t('tierList.emptyOwnedTitle')}
          body={t('tierList.emptyOwnedBody')}
        />
      ) : (
        <section role="tabpanel" aria-label={mode.name} className="codex-panel overflow-hidden">
          {tiers.map(({ tier, entries }, index) => (
            <div
              key={tier.tier}
              className={cn(
                'grid gap-4 p-4 sm:grid-cols-[84px_1fr] sm:p-5',
                index > 0 && 'border-t border-gild/10',
              )}
            >
              <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-start sm:justify-start sm:gap-1">
                <span
                  className="display-title text-3xl leading-none"
                  style={{ color: TIER_COLORS[tier.tier] ?? DEFAULT_TIER_COLOR }}
                >
                  {getTierLabel(tier.tier)}
                </span>
                <span className="font-mono text-[10px] tracking-[0.14em] text-muted">
                  {entries.length}
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {entries.map((entry) => (
                  <TierHeroTile
                    key={entry.id}
                    entry={entry}
                    hero={heroes[entry.id]}
                    onOpen={setDetailHeroId}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {detailHeroId ? (
        <HeroDetailDialog heroId={detailHeroId} onClose={() => setDetailHeroId(null)} />
      ) : null}
    </div>
  )
}
