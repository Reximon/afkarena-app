import type { CSSProperties } from 'react'
import celestialArt from '@/assets/factions/celestial.webp'
import dimensionalArt from '@/assets/factions/dimensional.webp'
import draconisArt from '@/assets/factions/draconis.webp'
import gravebornArt from '@/assets/factions/graveborn.webp'
import hypogeanArt from '@/assets/factions/hypogean.webp'
import lightbearerArt from '@/assets/factions/lightbearer.webp'
import maulerArt from '@/assets/factions/mauler.webp'
import wilderArt from '@/assets/factions/wilder.webp'
import { cn } from '@/lib/cn'
import type { Faction } from '@/types'

const FACTION_ART: Record<Faction, string> = {
  Lightbearer: lightbearerArt,
  Mauler: maulerArt,
  Wilder: wilderArt,
  Graveborn: gravebornArt,
  Celestial: celestialArt,
  Hypogean: hypogeanArt,
  Dimensional: dimensionalArt,
  Draconis: draconisArt,
}

interface FactionSceneProps {
  faction: Faction
  className?: string
}

export function FactionScene({ faction, className }: FactionSceneProps) {
  const style = { '--faction-art': `url("${FACTION_ART[faction]}")` } as CSSProperties

  return (
    <div
      aria-hidden="true"
      data-faction={faction}
      style={style}
      className={cn('faction-scene pointer-events-none absolute inset-0', className)}
    />
  )
}
