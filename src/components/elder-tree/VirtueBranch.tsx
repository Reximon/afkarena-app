import { useTranslation } from 'react-i18next'
import elderTreeBackground from '@/assets/elder-tree/elder-tree.webp'
import { ClassIcon } from '@/components/heroes/ClassIcon'
import { Badge } from '@/components/ui/Badge'
import {
  getBlessingState,
  getVirtueMaxLevel,
  type ElderTreeVirtue,
} from '@/features/elderTree/elderTree'
import { cn } from '@/lib/cn'

interface VirtueBranchProps {
  virtue: ElderTreeVirtue
  level: number
  onLevelChange: (level: number) => void
}

const minLevel = 0

export function VirtueBranch({ virtue, level, onLevelChange }: VirtueBranchProps) {
  const { t } = useTranslation()
  const maxLevel = getVirtueMaxLevel(virtue)
  const quickLevels = [minLevel, virtue.blessings[1].unlockLevel, 60, maxLevel]

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)]">
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
            <div className="flex items-center gap-3">
              <div className="game-medallion size-12 shrink-0 text-gild">
                <ClassIcon heroClass={virtue.class} className="size-7" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
                  {t('elderTree.virtueOf', { class: t(`heroClass.${virtue.class}`) })}
                </p>
                <h2 className="panel-title text-2xl">{virtue.name}</h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {virtue.focus.map((stat) => (
                  <Badge key={stat} variant="outline">
                    {stat}
                  </Badge>
                ))}
              </div>
              <Badge variant="outline">{t('elderTree.valuesAt', { level })}</Badge>
            </div>

            <div className="codex-panel-soft p-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="font-mono text-[9px] tracking-[0.2em] text-muted uppercase">
                    {t('elderTree.levelLabel')}
                  </p>
                  <p className="stat-value text-4xl leading-none">
                    Lv {level}
                    <span className="ml-1 font-mono text-xs tracking-[0.12em] text-muted">
                      / {maxLevel}
                    </span>
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {quickLevels.map((quickLevel) => (
                    <button
                      key={quickLevel}
                      type="button"
                      aria-label={t('elderTree.jumpTo', { level: quickLevel })}
                      onClick={() => onLevelChange(quickLevel)}
                      className={cn(
                        'rounded-md border px-1.5 py-1 font-mono text-[9px] tracking-[0.08em] transition-colors',
                        level === quickLevel
                          ? 'border-gild/55 bg-gild/15 text-gild-bright'
                          : 'border-line bg-night/50 text-muted hover:border-gild/40 hover:text-parch',
                      )}
                    >
                      {quickLevel}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="range"
                min={minLevel}
                max={maxLevel}
                step={5}
                value={level}
                aria-label={t('elderTree.levelLabel')}
                onChange={(event) => onLevelChange(Number(event.target.value))}
                className="mt-4 w-full accent-gild"
              />
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0 space-y-6">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="panel-title text-2xl">{t('elderTree.blessings')}</h2>
            <Badge variant="outline">{t('elderTree.valuesAt', { level })}</Badge>
          </div>

          <div className="codex-panel divide-y divide-gild/10 overflow-hidden">
            {virtue.blessings.map((blessing, index) => {
              const state = getBlessingState(virtue, index, level)
              return (
                <article
                  key={blessing.name}
                  className="grid gap-3 p-5 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-5"
                >
                  <div>
                    <h3 className="panel-title text-lg leading-tight">{blessing.name}</h3>
                    <div className="mt-2">
                      <Badge
                        variant={
                          !state.unlocked
                            ? 'muted'
                            : state.activeLevel > blessing.unlockLevel
                              ? 'gold'
                              : 'outline'
                        }
                      >
                        {state.unlocked
                          ? t('elderTree.levelShort', { level: state.activeLevel })
                          : t('elderTree.locked')}
                      </Badge>
                    </div>
                    <p className="mt-2 font-mono text-[9px] tracking-[0.12em] text-muted uppercase">
                      {t('elderTree.unlockAt', { level: blessing.unlockLevel })}
                    </p>
                    <p className="mt-1 font-mono text-[9px] tracking-[0.12em] text-gild/80 uppercase">
                      {state.nextLevel
                        ? t('elderTree.nextAt', { level: state.nextLevel })
                        : t('elderTree.maxed')}
                    </p>
                  </div>
                  <p
                    className={cn(
                      'text-sm leading-relaxed',
                      state.unlocked ? 'text-muted' : 'text-muted/60',
                    )}
                  >
                    {state.text}
                  </p>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
