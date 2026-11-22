import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { FramedHeroIcon } from '@/components/heroes/FramedHeroIcon'
import { getHeroCatalogEntry } from '@/features/heroes/heroCatalog'
import { cn } from '@/lib/cn'
import type { HeroProgress, TeamSlot } from '@/types'

interface TeamFormationProps {
  slots: TeamSlot[]
  heroes: Record<string, HeroProgress>
  className?: string
}

function SlotView({ slot, hero }: { slot: TeamSlot; hero: HeroProgress | undefined }) {
  const entry = hero ? getHeroCatalogEntry(hero.heroId) : undefined

  if (hero && entry) {
    return (
      <div className="rounded-xl border border-line bg-void/30 p-1.5">
        <FramedHeroIcon
          heroId={entry.id}
          ascension={hero.ascension}
          signatureItem={hero.signatureItem}
          furniture={hero.furniture}
          engraving={hero.engraving}
          alt={entry.displayName}
          className="w-full"
        />
        <p className="mt-1 truncate text-center text-[11px] font-semibold text-bone">
          {entry.displayName}
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-20 flex-col items-center justify-center rounded-xl border border-dashed border-line bg-void/20 p-2 text-center">
      <span className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
        {slot.position}
      </span>
      <span className="mt-1.5 grid size-6 place-items-center rounded-full border border-line text-muted">
        <Plus size={12} aria-hidden="true" />
      </span>
    </div>
  )
}

export function TeamFormation({ slots, heroes, className }: TeamFormationProps) {
  const { t } = useTranslation()
  const front = slots.filter((slot) => slot.row === 'front')
  const back = slots.filter((slot) => slot.row === 'back')

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <p className="mb-1.5 font-mono text-[9px] tracking-[0.18em] text-gold uppercase">
          {t('teams.front')}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {front.map((slot) => (
            <SlotView
              key={slot.position}
              slot={slot}
              hero={slot.heroId ? heroes[slot.heroId] : undefined}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 font-mono text-[9px] tracking-[0.18em] text-cyan uppercase">
          {t('teams.back')}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {back.map((slot) => (
            <SlotView
              key={slot.position}
              slot={slot}
              hero={slot.heroId ? heroes[slot.heroId] : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
