import { getHeroCatalogEntry } from '@/features/heroes/heroCatalog'
import { FACTIONS, type Faction } from '@/types'

const REGULAR_FACTIONS = ['Lightbearer', 'Mauler', 'Wilder', 'Graveborn'] as const

type RegularFaction = (typeof REGULAR_FACTIONS)[number]

export type FactionBonusTier = 'three' | 'threeTwo' | 'four' | 'five'

export interface FactionCount {
  faction: Faction
  count: number
}

export interface FactionBonusSummary {
  filledCount: number
  counts: FactionCount[]
  regularBonus?: {
    tier: FactionBonusTier
    attack: number
    hp: number
  }
  celestialCount: number
  hypogeanCount: number
  draconisCount: number
}

export const FACTION_BONUS_VALUES: Record<FactionBonusTier, { attack: number; hp: number }> = {
  three: { attack: 10, hp: 10 },
  threeTwo: { attack: 15, hp: 15 },
  four: { attack: 15, hp: 20 },
  five: { attack: 25, hp: 25 },
}

const TIER_RANK: Record<FactionBonusTier, number> = { five: 4, four: 3, threeTwo: 2, three: 1 }

function resolveTier(effectiveCounts: number[]): FactionBonusTier | undefined {
  const [first, second] = [...effectiveCounts].sort((a, b) => b - a)
  if (first >= 5) return 'five'
  if (first === 4) return 'four'
  if (first === 3 && second === 2) return 'threeTwo'
  if (first === 3) return 'three'
  return undefined
}

function bestRegularTier(
  base: Record<RegularFaction, number>,
  celestials: number,
): FactionBonusTier | undefined {
  let best: FactionBonusTier | undefined

  for (let light = 0; light <= celestials; light += 1) {
    for (let mauler = 0; mauler <= celestials - light; mauler += 1) {
      for (let wilder = 0; wilder <= celestials - light - mauler; wilder += 1) {
        const graveborn = celestials - light - mauler - wilder
        const tier = resolveTier([
          base.Lightbearer + light,
          base.Mauler + mauler,
          base.Wilder + wilder,
          base.Graveborn + graveborn,
        ])
        if (tier && (!best || TIER_RANK[tier] > TIER_RANK[best])) best = tier
      }
    }
  }

  return best
}

export function computeFactionBonus(heroIds: Array<string | undefined>): FactionBonusSummary {
  const tally = new Map<Faction, number>()
  let filledCount = 0

  for (const heroId of heroIds) {
    if (!heroId) continue
    const entry = getHeroCatalogEntry(heroId)
    if (!entry) continue
    filledCount += 1
    tally.set(entry.faction, (tally.get(entry.faction) ?? 0) + 1)
  }

  const counts = FACTIONS.filter((faction) => tally.has(faction))
    .map((faction) => ({ faction, count: tally.get(faction) ?? 0 }))
    .sort((a, b) => b.count - a.count || FACTIONS.indexOf(a.faction) - FACTIONS.indexOf(b.faction))

  const base: Record<RegularFaction, number> = {
    Lightbearer: tally.get('Lightbearer') ?? 0,
    Mauler: tally.get('Mauler') ?? 0,
    Wilder: tally.get('Wilder') ?? 0,
    Graveborn: tally.get('Graveborn') ?? 0,
  }
  const celestialCount = tally.get('Celestial') ?? 0
  const tier = bestRegularTier(base, celestialCount)

  return {
    filledCount,
    counts,
    regularBonus: tier ? { tier, ...FACTION_BONUS_VALUES[tier] } : undefined,
    celestialCount,
    hypogeanCount: tally.get('Hypogean') ?? 0,
    draconisCount: tally.get('Draconis') ?? 0,
  }
}
