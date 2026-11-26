import tierListJson from '@/data/tierlist.json'
import { getHeroCatalogEntry } from '@/features/heroes/heroCatalog'
import type { HeroCatalogEntry, TierListFile, TierListMode, TierListTier } from '@/types'

export const tierListFile = tierListJson as TierListFile
export const tierListModes = tierListFile.lists
export const tierListUpdatedAt = tierListFile.updatedAt
export const tierListSource = tierListFile.source

export const DEFAULT_TIER_LIST_SLUG = 'afk-arena-overall'

const tierListBySlug = new Map(tierListModes.map((mode) => [mode.slug, mode]))

export function getTierListMode(slug: string): TierListMode | undefined {
  return tierListBySlug.get(slug)
}

export function getDefaultTierListMode(): TierListMode {
  const mode = getTierListMode(DEFAULT_TIER_LIST_SLUG) ?? tierListModes[0]
  if (!mode) throw new Error('The tier list catalog is empty')
  return mode
}

export function getTierLabel(tier: string): string {
  return tier.replace('_PLUS', '+')
}

export function getTierHeroes(tier: TierListTier): HeroCatalogEntry[] {
  return tier.heroIds.flatMap((heroId) => {
    const entry = getHeroCatalogEntry(heroId)
    return entry ? [entry] : []
  })
}

export function getTierListHeroCount(mode: TierListMode): number {
  return mode.tiers.reduce((total, tier) => total + tier.heroIds.length, 0)
}

export function getTopTier(mode: TierListMode): TierListTier | undefined {
  return mode.tiers.find((tier) => tier.heroIds.length > 0)
}
