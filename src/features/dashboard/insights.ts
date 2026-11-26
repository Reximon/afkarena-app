import { getHeroCatalogEntry } from '@/features/heroes/heroCatalog'
import {
  getPet,
  getPetResonanceDeficit,
  getPetTotalLevel,
  PET_MAX_RESONANCE,
  type PetDefinition,
} from '@/features/pets/pets'
import {
  ASCENSIONS,
  FACTIONS,
  type Ascension,
  type Faction,
  type HeroProgress,
  type PetProgress,
} from '@/types'

const ASCENDED_INDEX = ASCENSIONS.indexOf('ascended')
const MYTHIC_INDEX = ASCENSIONS.indexOf('mythic')

export interface RosterMilestones {
  owned: number
  inCrystal: number
  fiveStar: number
  signature30: number
  furniture9: number
  engraving60: number
}

export function getRosterMilestones(heroes: Record<string, HeroProgress>): RosterMilestones {
  const milestones: RosterMilestones = {
    owned: 0,
    inCrystal: 0,
    fiveStar: 0,
    signature30: 0,
    furniture9: 0,
    engraving60: 0,
  }

  for (const hero of Object.values(heroes)) {
    milestones.owned += 1
    if (hero.inCrystal) milestones.inCrystal += 1
    if (hero.ascension === 'ascended5') milestones.fiveStar += 1
    if (hero.signatureItem >= 30) milestones.signature30 += 1
    if (hero.furniture >= 9) milestones.furniture9 += 1
    if (hero.engraving >= 60) milestones.engraving60 += 1
  }

  return milestones
}

export type AscensionBucket = 'fiveStar' | 'ascended' | 'mythic' | 'lower'

export const ASCENSION_BUCKETS: AscensionBucket[] = ['fiveStar', 'ascended', 'mythic', 'lower']

export function getAscensionBucket(ascension: Ascension): AscensionBucket {
  if (ascension === 'ascended5') return 'fiveStar'
  const index = ASCENSIONS.indexOf(ascension)
  if (index >= ASCENDED_INDEX) return 'ascended'
  if (index >= MYTHIC_INDEX) return 'mythic'
  return 'lower'
}

export type AscensionCounts = Record<AscensionBucket, number>

export function getAscensionCounts(heroes: Record<string, HeroProgress>): AscensionCounts {
  const counts: AscensionCounts = { fiveStar: 0, ascended: 0, mythic: 0, lower: 0 }

  for (const hero of Object.values(heroes)) {
    counts[getAscensionBucket(hero.ascension)] += 1
  }

  return counts
}

export interface FactionTally {
  faction: Faction
  count: number
}

export function getFactionCounts(heroes: Record<string, HeroProgress>): FactionTally[] {
  const tally = new Map<Faction, number>()

  for (const hero of Object.values(heroes)) {
    const entry = getHeroCatalogEntry(hero.heroId)
    if (!entry) continue
    tally.set(entry.faction, (tally.get(entry.faction) ?? 0) + 1)
  }

  return FACTIONS.map((faction) => ({ faction, count: tally.get(faction) ?? 0 }))
}

export interface PetSnapshot {
  definition: PetDefinition
  progress: PetProgress
  level: number
  deficit: number
}

export interface PetOverview {
  owned: number
  resonanceLevel: number
  belowResonance: number
  topPets: PetSnapshot[]
}

export function getPetOverview(
  pets: Record<string, PetProgress>,
  resonanceLevel: number,
): PetOverview {
  const level = Math.min(
    PET_MAX_RESONANCE,
    Math.max(0, Math.floor(Number.isFinite(resonanceLevel) ? resonanceLevel : 0)),
  )
  const snapshots = Object.values(pets).flatMap<PetSnapshot>((progress) => {
    const definition = getPet(progress.petId)
    if (!definition) return []

    return [
      {
        definition,
        progress,
        level: getPetTotalLevel(progress),
        deficit: getPetResonanceDeficit(definition.tier, progress, level),
      },
    ]
  })

  const topPets = [...snapshots]
    .sort((a, b) => b.level - a.level || a.definition.name.localeCompare(b.definition.name))
    .slice(0, 3)

  return {
    owned: snapshots.length,
    resonanceLevel: level,
    belowResonance: snapshots.filter((snapshot) => snapshot.deficit > 0).length,
    topPets,
  }
}
