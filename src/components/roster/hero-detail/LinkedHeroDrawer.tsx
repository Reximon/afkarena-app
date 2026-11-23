import { useMemo } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  getFactionColor,
  getHeroCatalogEntry,
  getLinkableHeroGroups,
} from '@/features/heroes/heroCatalog'
import { cn } from '@/lib/cn'
import type { HeroProgress } from '@/types'
import { PickerDrawer } from './PickerDrawer'

interface LinkedHeroDrawerProps {
  heroName: string
  linkedHeroId?: string
  heroes: Record<string, HeroProgress>
  onChange: (linkedHeroId: string | undefined) => void
  onClose: () => void
}

export function LinkedHeroDrawer({
  heroName,
  linkedHeroId,
  heroes,
  onChange,
  onClose,
}: LinkedHeroDrawerProps) {
  const { t } = useTranslation()

  const groups = useMemo(() => getLinkableHeroGroups(new Set(Object.keys(heroes))), [heroes])

  const linkedEntry = linkedHeroId ? getHeroCatalogEntry(linkedHeroId) : undefined
  const isListed = groups.some((group) => group.heroes.some((hero) => hero.id === linkedHeroId))

  return (
    <PickerDrawer kicker={heroName} title={t('hero.linkedHero')} onClose={onClose}>
      <p className="mt-1 text-[11px] text-muted">{t('hero.linkedHeroHint')}</p>

      <div className="mt-4 space-y-1.5">
        <button
          type="button"
          aria-pressed={!linkedHeroId}
          onClick={() => onChange(undefined)}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-semibold transition-colors',
            !linkedHeroId
              ? 'border-gild/50 bg-gild/10 text-gild'
              : 'border-line bg-night/40 text-muted hover:border-gild/30 hover:text-parch',
          )}
        >
          <X size={12} aria-hidden="true" />
          {t('common.none')}
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {linkedEntry && !isListed ? (
          <div className="space-y-1.5">
            <p className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
              {t(`faction.${linkedEntry.faction}`)}
            </p>
            <HeroOption
              name={linkedEntry.displayName}
              color={getFactionColor(linkedEntry.faction)}
              selected
              onSelect={() => onChange(linkedEntry.id)}
            />
          </div>
        ) : null}

        {groups.length === 0 ? (
          linkedEntry ? null : (
            <p className="rounded-lg border border-line bg-night/30 px-3 py-3 text-xs text-muted">
              {t('hero.noLinkableHeroes')}
            </p>
          )
        ) : (
          groups.map((group) => (
            <div key={group.faction} className="space-y-1.5">
              <p className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
                {t(`faction.${group.faction}`)}
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {group.heroes.map((hero) => (
                  <HeroOption
                    key={hero.id}
                    name={hero.displayName}
                    color={getFactionColor(hero.faction)}
                    selected={hero.id === linkedHeroId}
                    onSelect={() => onChange(hero.id)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </PickerDrawer>
  )
}

interface HeroOptionProps {
  name: string
  color: string
  selected: boolean
  onSelect: () => void
}

function HeroOption({ name, color, selected, onSelect }: HeroOptionProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs font-semibold transition-colors',
        selected
          ? 'border-gild/50 bg-gild/10 text-gild'
          : 'border-line bg-night/40 text-muted hover:border-gild/30 hover:text-parch',
      )}
    >
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="truncate">{name}</span>
    </button>
  )
}
