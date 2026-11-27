import { useTranslation } from 'react-i18next'
import elderTreeBackground from '@/assets/elder-tree/elder-tree.webp'
import { ClassIcon } from '@/components/heroes/ClassIcon'
import {
  elderTreeVirtues,
  getBlessingState,
  getTrunkStats,
  getVirtueMaxLevel,
  TRUNK_MAX_LEVEL,
  type ElderTreeVirtue,
} from '@/features/elderTree/elderTree'
import { cn } from '@/lib/cn'
import type { HeroClass } from '@/types'

interface VirtueOverviewProps {
  levels: Record<HeroClass, number>
  trunkLevel: number
  onTrunkLevelChange: (level: number) => void
  onSelect: (heroClass: HeroClass) => void
}

function VirtueCard({
  virtue,
  level,
  centered = false,
  onSelect,
}: {
  virtue: ElderTreeVirtue
  level: number
  centered?: boolean
  onSelect: (heroClass: HeroClass) => void
}) {
  const { t } = useTranslation()
  const maxLevel = getVirtueMaxLevel(virtue)
  const clampedLevel = Math.min(level, maxLevel)
  const progress = Math.round((clampedLevel / maxLevel) * 100)

  return (
    <button
      type="button"
      aria-label={`${t(`heroClass.${virtue.class}`)} · ${virtue.name} · ${t('elderTree.levelShort', { level: clampedLevel })}`}
      onClick={() => onSelect(virtue.class)}
      className={cn(
        'codex-panel card-lift group flex min-w-0 flex-col gap-4 p-5 text-left transition-colors hover:border-gild/45',
        centered && 'sm:col-span-2 sm:w-[calc(50%-0.5rem)] sm:justify-self-center',
      )}
    >
      <div className="flex items-center gap-3">
        <div className="game-medallion size-11 shrink-0 text-gild">
          <ClassIcon heroClass={virtue.class} className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[9px] tracking-[0.18em] text-muted uppercase">
            {t('elderTree.virtueOf', { class: t(`heroClass.${virtue.class}`) })}
          </p>
          <span className="panel-title block truncate text-lg">{virtue.name}</span>
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-[9px] tracking-[0.2em] text-muted uppercase">
            {t('elderTree.branchLevel')}
          </span>
          <span className="stat-value text-2xl leading-none">
            {t('elderTree.levelShort', { level: clampedLevel })}
            <span className="ml-1 font-mono text-[10px] tracking-[0.12em] text-muted">
              / {maxLevel}
            </span>
          </span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-night/70">
          <div
            className="h-full rounded-full bg-gild/70"
            style={{ width: `${Math.max(progress, clampedLevel > 0 ? 2 : 0)}%` }}
          />
        </div>
      </div>

      <ul className="mt-auto space-y-1.5 border-t border-gild/10 pt-3">
        {virtue.blessings.map((blessing, index) => {
          const state = getBlessingState(virtue, index, clampedLevel)
          return (
            <li key={blessing.name} className="flex items-baseline justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2">
                <img
                  src={blessing.icon}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className={cn(
                    'size-5 shrink-0 rounded-full object-cover',
                    state.unlocked ? undefined : 'opacity-45 grayscale',
                  )}
                />
                <span
                  className={cn(
                    'truncate text-xs',
                    state.unlocked ? 'text-muted' : 'text-muted/50',
                  )}
                >
                  {blessing.name}
                </span>
              </span>
              <span
                className={cn(
                  'shrink-0 font-mono text-[9px] tracking-[0.08em] uppercase',
                  state.unlocked ? 'text-gild/85' : 'text-muted/50',
                )}
              >
                {state.unlocked
                  ? t('elderTree.levelShort', { level: state.activeLevel })
                  : t('elderTree.locked')}
              </span>
            </li>
          )
        })}
      </ul>
    </button>
  )
}

export function VirtueOverview({
  levels,
  trunkLevel,
  onTrunkLevelChange,
  onSelect,
}: VirtueOverviewProps) {
  const { t, i18n } = useTranslation()
  const trunkStats = getTrunkStats(trunkLevel)
  const numberFormat = new Intl.NumberFormat(i18n.language)
  const trunkRows = [
    { label: 'HP', value: trunkStats.hp },
    { label: 'ATK', value: trunkStats.atk },
    { label: 'DEF', value: trunkStats.def },
  ]

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)]">
      <aside className="min-w-0 lg:sticky lg:top-24">
        <div className="codex-panel overflow-hidden">
          <div className="relative h-96">
            <img
              src={elderTreeBackground}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="absolute inset-0 size-full object-cover object-top"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,4,3,0.62)_0%,rgba(8,4,3,0)_30%,rgba(8,4,3,0)_62%,rgba(30,17,11,0.92)_100%)]"
            />
            <p className="absolute top-5 left-5 font-mono text-[9px] tracking-[0.28em] text-gild-bright/85 uppercase">
              {t('elderTree.virtueBranch')}
            </p>
          </div>

          <div className="space-y-4 p-5">
            <h2 className="panel-title text-2xl">{t('elderTree.allTitle')}</h2>
            <p className="text-sm leading-relaxed text-muted">{t('elderTree.allHint')}</p>

            <div className="codex-panel-soft p-4">
              <p className="font-mono text-[9px] tracking-[0.2em] text-muted uppercase">
                {t('elderTree.trunkLevel')}
              </p>
              <p className="stat-value text-4xl leading-none">
                {t('elderTree.levelShort', { level: trunkLevel })}
                <span className="ml-1 font-mono text-xs tracking-[0.12em] text-muted">
                  / {TRUNK_MAX_LEVEL}
                </span>
              </p>
              <input
                type="range"
                min={1}
                max={TRUNK_MAX_LEVEL}
                value={trunkLevel}
                aria-label={t('elderTree.trunkLevel')}
                onChange={(event) => onTrunkLevelChange(Number(event.target.value))}
                className="mt-4 w-full accent-gild"
              />
              <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-gild/10 pt-3">
                {trunkRows.map((row) => (
                  <div key={row.label}>
                    <dt className="font-mono text-[9px] tracking-[0.18em] text-muted uppercase">
                      {row.label}
                    </dt>
                    <dd className="stat-value text-lg leading-none">
                      {numberFormat.format(row.value)}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-muted">{t('elderTree.trunkHint')}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        {elderTreeVirtues.map((virtue, index) => (
          <VirtueCard
            key={virtue.class}
            virtue={virtue}
            level={levels[virtue.class]}
            centered={index === elderTreeVirtues.length - 1}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}
