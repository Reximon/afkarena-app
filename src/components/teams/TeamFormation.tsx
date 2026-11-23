import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { FramedHeroIcon } from '@/components/heroes/FramedHeroIcon'
import { getHeroCatalogEntry } from '@/features/heroes/heroCatalog'
import { cn } from '@/lib/cn'
import type { HeroProgress, TeamSlot } from '@/types'

interface TeamFormationProps {
  slots: TeamSlot[]
  heroes: Record<string, HeroProgress>
  onSlotClick?: (slot: TeamSlot) => void
  className?: string
}

function SlotView({
  slot,
  hero,
  onSelect,
}: {
  slot: TeamSlot
  hero: HeroProgress | undefined
  onSelect?: () => void
}) {
  const { t } = useTranslation()
  const entry = hero ? getHeroCatalogEntry(hero.heroId) : undefined

  if (hero && entry) {
    return (
      <div className="rounded-xl border border-line bg-night/30 p-1.5">
        <FramedHeroIcon
          heroId={entry.id}
          ascension={hero.ascension}
          signatureItem={hero.signatureItem}
          furniture={hero.furniture}
          engraving={hero.engraving}
          alt={entry.displayName}
          className="w-full"
        />
        <p className="mt-1 truncate text-center text-[11px] font-semibold text-parch">
          {entry.displayName}
        </p>
      </div>
    )
  }

  const content = (
    <>
      <span className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
        {slot.position}
      </span>
      <span className="mt-1.5 grid size-6 place-items-center rounded-full border border-line text-muted">
        <Plus size={12} aria-hidden="true" />
      </span>
    </>
  )
  const emptyClassName =
    'flex min-h-20 flex-col items-center justify-center rounded-xl border border-dashed border-line bg-night/20 p-2 text-center transition-colors'

  if (!onSelect) {
    return <div className={emptyClassName}>{content}</div>
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={t('teams.addHeroSlot', { position: slot.position })}
      className={cn(
        emptyClassName,
        'hover:border-gild/40 hover:bg-night/30 hover:text-parch focus-visible:border-gild/40 focus-visible:outline-none',
      )}
    >
      {content}
    </button>
  )
}

export function TeamFormation({ slots, heroes, onSlotClick, className }: TeamFormationProps) {
  const { t } = useTranslation()
  const front = slots.filter((slot) => slot.row === 'front')
  const back = slots.filter((slot) => slot.row === 'back')

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <p className="mb-1.5 font-mono text-[9px] tracking-[0.18em] text-gild uppercase">
          {t('teams.front')}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {front.map((slot) => (
            <SlotView
              key={slot.position}
              slot={slot}
              hero={slot.heroId ? heroes[slot.heroId] : undefined}
              onSelect={onSlotClick ? () => onSlotClick(slot) : undefined}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 font-mono text-[9px] tracking-[0.18em] text-arcane uppercase">
          {t('teams.back')}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {back.map((slot) => (
            <SlotView
              key={slot.position}
              slot={slot}
              hero={slot.heroId ? heroes[slot.heroId] : undefined}
              onSelect={onSlotClick ? () => onSlotClick(slot) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
