import { describe, expect, it } from 'vitest'
import { getHeroCatalogEntry } from '@/features/heroes/heroCatalog'
import {
  DEFAULT_TIER_LIST_SLUG,
  getDefaultTierListMode,
  getTierHeroes,
  getTierLabel,
  getTierListAgeDays,
  getTierListHeroCount,
  getTopTier,
  isTierListStale,
  tierListModes,
} from './tierlist'

describe('tier list catalog', () => {
  it('maps every tier hero to the local catalog', () => {
    const unknown = tierListModes.flatMap((mode) =>
      mode.tiers.flatMap((tier) => tier.heroIds.filter((heroId) => !getHeroCatalogEntry(heroId))),
    )

    expect(unknown).toEqual([])
  })

  it('keeps the default overall list and derives its top tier', () => {
    const mode = getDefaultTierListMode()

    expect(mode.slug).toBe(DEFAULT_TIER_LIST_SLUG)
    expect(mode.tiers[0]?.tier).toBe('S_PLUS')
    expect(getTopTier(mode)).toBe(mode.tiers[0])
    expect(getTierHeroes(mode.tiers[0]).length).toBe(mode.tiers[0].heroIds.length)
  })

  it('counts every unique hero of a mode', () => {
    for (const mode of tierListModes) {
      expect(getTierListHeroCount(mode)).toBeGreaterThan(0)
    }
  })

  it('labels plus tiers compactly', () => {
    expect(getTierLabel('S_PLUS')).toBe('S+')
    expect(getTierLabel('A_PLUS')).toBe('A+')
    expect(getTierLabel('SS')).toBe('SS')
  })

  it('measures how old the ranking data is', () => {
    expect(getTierListAgeDays('2026-10-03', new Date('2026-10-03T23:00:00Z'))).toBe(0)
    expect(getTierListAgeDays('2026-10-03', new Date('2026-11-02T08:00:00Z'))).toBe(30)
    expect(getTierListAgeDays(null)).toBeNull()
  })

  it('flags the ranking as stale only after 30 days', () => {
    expect(isTierListStale('2026-10-03', new Date('2026-10-30T00:00:00Z'))).toBe(false)
    expect(isTierListStale('2026-10-03', new Date('2026-11-02T00:00:00Z'))).toBe(false)
    expect(isTierListStale('2026-10-03', new Date('2026-11-03T00:00:00Z'))).toBe(true)
    expect(isTierListStale(null)).toBe(false)
  })
})
