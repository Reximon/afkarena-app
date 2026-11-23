import { useMemo } from 'react'
import { Gem, Minus, Plus, Target } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Field, Input, Select } from '@/components/ui/Input'
import { getLinkableHeroGroups, heroCatalog } from '@/features/heroes/heroCatalog'
import { cn } from '@/lib/cn'
import type { HeroCatalogEntry, HeroProgress } from '@/types'
import { ProgressStepControl } from './ProgressStepControl'

const SIGNATURE_OPTIONS = [0, 10, 20, 30, 40] as const
const FURNITURE_OPTIONS = [0, 3, 9, 36] as const
const ENGRAVING_OPTIONS = [0, 30, 60, 80] as const

interface InvestmentPanelProps {
  entry: HeroCatalogEntry
  progress: HeroProgress
  heroes: Record<string, HeroProgress>
  commit: (patch: Partial<HeroProgress>) => void
}

export function InvestmentPanel({ entry, progress, heroes, commit }: InvestmentPanelProps) {
  const { t } = useTranslation()

  const linkedHeroGroups = useMemo(() => {
    if (entry.faction !== 'Dimensional') return []

    return getLinkableHeroGroups(new Set(Object.keys(heroes)))
  }, [entry.faction, heroes])

  const linkedHeroEntry = progress.linkedHeroId
    ? heroCatalog.find((hero) => hero.id === progress.linkedHeroId)
    : undefined
  const linkedHeroIsListed = linkedHeroGroups.some((group) =>
    group.heroes.some((hero) => hero.id === progress.linkedHeroId),
  )

  function stepLevel(delta: number) {
    commit({ level: Math.min(1000, Math.max(1, progress.level + delta)) })
  }

  return (
    <section className="space-y-3">
      <div className="rounded-xl border border-line bg-night/30 px-3 py-2.5">
        <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
          {t('hero.level')}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => stepLevel(-1)}
            disabled={progress.level <= 1}
            aria-label={`${t('common.decrease')} ${t('hero.level')}`}
            className="icon-action rounded-lg border border-line bg-night/40 p-1.5 text-muted hover:border-gild/40 hover:text-parch disabled:opacity-40"
          >
            <Minus size={14} aria-hidden="true" />
          </button>
          <Input
            type="number"
            min={1}
            max={1000}
            value={progress.level}
            onChange={(event) =>
              commit({ level: Math.min(1000, Math.max(1, Number(event.target.value) || 1)) })
            }
            aria-label={t('hero.level')}
            className="h-9 flex-1 text-center font-display text-lg"
          />
          <button
            type="button"
            onClick={() => stepLevel(1)}
            disabled={progress.level >= 1000}
            aria-label={`${t('common.increase')} ${t('hero.level')}`}
            className="icon-action rounded-lg border border-line bg-night/40 p-1.5 text-muted hover:border-gild/40 hover:text-parch disabled:opacity-40"
          >
            <Plus size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <ProgressStepControl
          label={t('hero.signatureItem')}
          value={progress.signatureItem}
          options={SIGNATURE_OPTIONS}
          onChange={(signatureItem) => commit({ signatureItem })}
        />
        <ProgressStepControl
          label={t('hero.furniture')}
          value={progress.furniture}
          options={FURNITURE_OPTIONS}
          onChange={(furniture) => commit({ furniture })}
        />
        <ProgressStepControl
          label={t('hero.engraving')}
          value={progress.engraving}
          options={ENGRAVING_OPTIONS}
          onChange={(engraving) => commit({ engraving })}
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          aria-pressed={progress.inCrystal}
          onClick={() => commit({ inCrystal: !progress.inCrystal })}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors',
            progress.inCrystal
              ? 'border-arcane/50 bg-arcane/15 text-arcane'
              : 'border-line bg-night/30 text-muted hover:border-arcane/40 hover:text-parch',
          )}
        >
          <Gem size={15} aria-hidden="true" />
          {t('hero.inCrystal')}
        </button>

        <button
          type="button"
          aria-pressed={Boolean(progress.priority)}
          title={t('hero.targetHint')}
          onClick={() => commit({ priority: !progress.priority })}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors',
            progress.priority
              ? 'border-gild/50 bg-gild/10 text-gild'
              : 'border-line bg-night/30 text-muted hover:border-gild/40 hover:text-parch',
          )}
        >
          <Target size={15} aria-hidden="true" />
          {t('hero.target')}
        </button>
      </div>

      {entry.faction === 'Dimensional' ? (
        <Field label={t('hero.linkedHero')} hint={t('hero.linkedHeroHint')}>
          <Select
            value={progress.linkedHeroId ?? ''}
            onChange={(event) => commit({ linkedHeroId: event.target.value || undefined })}
          >
            <option value="">{t('common.none')}</option>
            {linkedHeroEntry && !linkedHeroIsListed ? (
              <option value={linkedHeroEntry.id}>{linkedHeroEntry.displayName}</option>
            ) : null}
            {linkedHeroGroups.map((group) => (
              <optgroup key={group.faction} label={t(`faction.${group.faction}`)}>
                {group.heroes.map((hero) => (
                  <option key={hero.id} value={hero.id}>
                    {hero.displayName}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
        </Field>
      ) : null}
    </section>
  )
}
