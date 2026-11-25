import { describe, expect, it } from 'vitest'
import {
  createDefaultHeroProgress,
  createDefaultPetProgress,
} from '@/features/persistence/defaults'
import { getHeroCatalogEntry } from '@/features/heroes/heroCatalog'
import { FACTIONS, GEAR_SLOTS, type GearPiece, type HeroProgress } from '@/types'
import {
  getAscensionBucket,
  getAscensionCounts,
  getFactionCounts,
  getPetOverview,
  getRosterMilestones,
} from './insights'

function t2Gear(): Record<string, GearPiece> {
  return Object.fromEntries(
    GEAR_SLOTS.map((slot) => [slot, { slot, tier: 't2', stars: 5 } satisfies GearPiece]),
  )
}

describe('getRosterMilestones', () => {
  it('counts endgame investment milestones', () => {
    const heroes: Record<string, HeroProgress> = {
      a: createDefaultHeroProgress('a', {
        ascension: 'ascended5',
        inCrystal: true,
        signatureItem: 30,
        furniture: 9,
        engraving: 60,
        gear: t2Gear(),
      }),
      b: createDefaultHeroProgress('b', {
        ascension: 'mythic',
        signatureItem: 20,
        furniture: 3,
        engraving: 30,
        gear: { weapon: { slot: 'weapon', tier: 't2', stars: 0 } },
      }),
    }

    expect(getRosterMilestones(heroes)).toEqual({
      owned: 2,
      inCrystal: 1,
      fiveStar: 1,
      signature30: 1,
      furniture9: 1,
      engraving60: 1,
      gearT2: 1,
    })
  })

  it('requires all four slots above T1 for the gear milestone', () => {
    const heroes: Record<string, HeroProgress> = {
      a: createDefaultHeroProgress('a', {
        gear: Object.fromEntries(
          GEAR_SLOTS.map((slot) => [
            slot,
            { slot, tier: slot === 'boots' ? 't1' : 't3', stars: 0 } satisfies GearPiece,
          ]),
        ),
      }),
    }

    expect(getRosterMilestones(heroes).gearT2).toBe(0)
  })
})

describe('ascension buckets', () => {
  it('maps ascensions into four buckets', () => {
    expect(getAscensionBucket('ascended5')).toBe('fiveStar')
    expect(getAscensionBucket('ascended2')).toBe('ascended')
    expect(getAscensionBucket('mythic+')).toBe('mythic')
    expect(getAscensionBucket('legendary+')).toBe('lower')
  })

  it('tallies the roster', () => {
    const heroes: Record<string, HeroProgress> = {
      a: createDefaultHeroProgress('a', { ascension: 'ascended5' }),
      b: createDefaultHeroProgress('b', { ascension: 'ascended' }),
      c: createDefaultHeroProgress('c', { ascension: 'mythic' }),
      d: createDefaultHeroProgress('d', { ascension: 'legendary' }),
    }

    expect(getAscensionCounts(heroes)).toEqual({ fiveStar: 1, ascended: 1, mythic: 1, lower: 1 })
  })
})

describe('getFactionCounts', () => {
  it('keeps every faction in catalog order and counts owned heroes', () => {
    const ids = ['182', '98']
    const heroes = Object.fromEntries(ids.map((id) => [id, createDefaultHeroProgress(id)]))
    const counts = getFactionCounts(heroes)

    expect(counts.map((entry) => entry.faction)).toEqual([...FACTIONS])
    expect(counts.reduce((total, entry) => total + entry.count, 0)).toBe(ids.length)

    for (const id of ids) {
      const faction = getHeroCatalogEntry(id)?.faction
      expect(counts.find((entry) => entry.faction === faction)?.count).toBeGreaterThan(0)
    }
  })
})

describe('pet overview', () => {
  it('measures the resonance deficit per tier and surfaces the top pets', () => {
    const overview = getPetOverview(
      {
        '6001': createDefaultPetProgress('6001', { strength: 6, intelligence: 6, agility: 0 }),
        '6004': createDefaultPetProgress('6004', {
          strength: 12,
          intelligence: 12,
          agility: 12,
        }),
      },
      18,
    )

    expect(overview.owned).toBe(2)
    expect(overview.belowResonance).toBe(1)
    expect(overview.topPets.map((pet) => pet.progress.petId)).toEqual(['6004', '6001'])
    expect(overview.topPets[1].deficit).toBe(6)
  })

  it('caps the resonance target at the maximum', () => {
    expect(getPetOverview({}, 99).resonanceLevel).toBe(54)
  })
})
