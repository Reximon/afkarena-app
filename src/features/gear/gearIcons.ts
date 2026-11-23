import type { GearSlot, GearTier, HeroType } from '@/types'

const WEAPON_ICON_ID: Record<HeroType, Record<Exclude<GearTier, 'none'>, number>> = {
  Warrior: { mythic: 99, t1: 111, t2: 123, t3: 135, t4: 147, t5: 159 },
  Ranger: { mythic: 98, t1: 110, t2: 122, t3: 134, t4: 146, t5: 158 },
  Mage: { mythic: 97, t1: 109, t2: 121, t3: 133, t4: 145, t5: 157 },
}

const SLOT_OFFSET: Record<GearSlot, number> = { weapon: 0, helmet: 3, chest: 6, boots: 9 }

export function getGearIconSrc(
  tier: GearTier,
  slot: GearSlot,
  type: HeroType | undefined,
): string | undefined {
  if (tier === 'none' || !type) return undefined

  return `/images/afk-arena/game/gear/${WEAPON_ICON_ID[type][tier] + SLOT_OFFSET[slot]}.webp`
}
