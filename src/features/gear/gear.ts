import type { Faction, GearPiece, GearSlot, GearTier } from '@/types'

export function isExclusiveTier(tier: GearTier): boolean {
  return tier === 't3' || tier === 't4' || tier === 't5'
}

export function isResonantFactionTier(tier: GearTier): boolean {
  return tier === 't1' || tier === 't2'
}

export type GearFactionDisplay =
  | { kind: 'select'; faction?: Faction }
  | { kind: 'same'; faction: Faction }
  | { kind: 'none' }

function isExclusivePiece(piece: GearPiece): boolean {
  return piece.exclusive ?? isExclusiveTier(piece.tier)
}

function isResonantPiece(piece: GearPiece): boolean {
  return piece.resonant ?? false
}

export function getGearFactionDisplay(
  piece: GearPiece | undefined,
  heroFaction: Faction | undefined,
): GearFactionDisplay {
  if (!piece) return { kind: 'none' }
  if (isExclusivePiece(piece)) return { kind: 'none' }

  if (isResonantPiece(piece)) {
    if (isResonantFactionTier(piece.tier) && heroFaction) {
      return { kind: 'same', faction: heroFaction }
    }

    return { kind: 'none' }
  }

  return { kind: 'select', faction: piece.faction }
}

export function getGearFaction(
  piece: GearPiece | undefined,
  heroFaction: Faction | undefined,
): Faction | undefined {
  const display = getGearFactionDisplay(piece, heroFaction)

  return display.kind === 'select' || display.kind === 'same' ? display.faction : undefined
}

function resolveGearFaction(
  exclusive: boolean,
  resonant: boolean,
  tier: GearTier,
  heroFaction: Faction | undefined,
  fallbackFaction: Faction | undefined,
): Faction | undefined {
  if (exclusive) return undefined
  if (resonant) return isResonantFactionTier(tier) ? heroFaction : undefined

  return fallbackFaction
}

export function normalizeGearPiece(
  piece: GearPiece,
  heroFaction: Faction | undefined,
): GearPiece {
  const normalized: GearPiece = {
    ...piece,
    exclusive: isExclusivePiece(piece),
    resonant: isResonantPiece(piece),
  }

  return { ...normalized, faction: getGearFaction(normalized, heroFaction) }
}

export function applyGearTierChange(
  piece: GearPiece | undefined,
  slot: GearSlot,
  tier: GearTier,
  heroFaction: Faction | undefined,
): GearPiece | undefined {
  if (tier === 'none') return undefined

  const exclusive = isExclusiveTier(tier)
  const resonant = piece ? isResonantPiece(piece) : false
  const faction = resolveGearFaction(
    exclusive,
    resonant,
    tier,
    heroFaction,
    piece?.faction ?? heroFaction,
  )

  return {
    slot,
    tier,
    stars: piece?.stars ?? 0,
    faction,
    resonant,
    exclusive,
  }
}

export function applyGearExclusiveChange(
  piece: GearPiece,
  exclusive: boolean,
  heroFaction: Faction | undefined,
): GearPiece {
  const faction = resolveGearFaction(
    exclusive,
    isResonantPiece(piece),
    piece.tier,
    heroFaction,
    piece.faction ?? heroFaction,
  )

  return { ...piece, exclusive, faction }
}

export function applyGearResonantChange(
  piece: GearPiece,
  resonant: boolean,
  heroFaction: Faction | undefined,
): GearPiece {
  const faction = resolveGearFaction(
    isExclusivePiece(piece),
    resonant,
    piece.tier,
    heroFaction,
    piece.faction ?? heroFaction,
  )

  return { ...piece, resonant, faction }
}
