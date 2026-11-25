import celestialIcon from '@/assets/factions/icons/celestial.webp'
import dimensionalIcon from '@/assets/factions/icons/dimensional.webp'
import draconisIcon from '@/assets/factions/icons/draconis.webp'
import gravebornIcon from '@/assets/factions/icons/graveborn.webp'
import hypogeanIcon from '@/assets/factions/icons/hypogean.webp'
import lightbearerIcon from '@/assets/factions/icons/lightbearer.webp'
import maulerIcon from '@/assets/factions/icons/mauler.webp'
import wilderIcon from '@/assets/factions/icons/wilder.webp'
import { cn } from '@/lib/cn'
import type { Faction } from '@/types'

const FACTION_ICONS: Record<Faction, string> = {
  Lightbearer: lightbearerIcon,
  Mauler: maulerIcon,
  Wilder: wilderIcon,
  Graveborn: gravebornIcon,
  Celestial: celestialIcon,
  Hypogean: hypogeanIcon,
  Dimensional: dimensionalIcon,
  Draconis: draconisIcon,
}

interface FactionIconProps {
  faction: Faction
  label?: string
  className?: string
}

export function FactionIcon({ faction, label, className }: FactionIconProps) {
  return (
    <img
      src={FACTION_ICONS[faction]}
      alt={label ?? ''}
      aria-hidden={label ? undefined : true}
      draggable={false}
      className={cn('size-6 object-contain', className)}
    />
  )
}
