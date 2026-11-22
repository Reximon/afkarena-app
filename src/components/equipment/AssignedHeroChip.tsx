import { X } from 'lucide-react'
import { FramedHeroIcon } from '@/components/heroes/FramedHeroIcon'
import type { HeroCatalogEntry, HeroProgress } from '@/types'

interface AssignedHeroChipProps {
  hero: HeroProgress
  entry: HeroCatalogEntry
  onRemove: () => void
  removeLabel: string
}

export function AssignedHeroChip({ hero, entry, onRemove, removeLabel }: AssignedHeroChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-void/30 py-0.5 pr-1 pl-0.5 text-xs text-bone">
      <FramedHeroIcon
        heroId={entry.id}
        ascension={hero.ascension}
        signatureItem={hero.signatureItem}
        furniture={hero.furniture}
        engraving={hero.engraving}
        alt={entry.displayName}
        className="size-6 shrink-0"
      />
      <span className="max-w-32 truncate">{entry.displayName}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        className="rounded-full p-0.5 text-muted transition-colors hover:bg-rose/15 hover:text-rose"
      >
        <X size={12} aria-hidden="true" />
      </button>
    </span>
  )
}
