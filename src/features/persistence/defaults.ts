import type { AppData, HeroProgress, PetProgress, Team, TeamSlot } from '@/types'
import { createId } from '@/lib/id'

export function createTeamSlots(): TeamSlot[] {
  return [
    { position: 1, row: 'front' },
    { position: 2, row: 'front' },
    { position: 3, row: 'back' },
    { position: 4, row: 'back' },
    { position: 5, row: 'back' },
  ]
}

export function createEmptyTeam(overrides: Partial<Team> = {}): Team {
  const now = new Date().toISOString()

  return {
    id: createId('team'),
    name: 'New team',
    mode: 'campaign',
    slots: createTeamSlots(),
    notes: '',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

export function createDefaultHeroProgress(
  heroId: string,
  overrides: Partial<HeroProgress> = {},
): HeroProgress {
  return {
    heroId,
    ascension: 'elite',
    level: 1,
    inCrystal: false,
    priority: false,
    signatureItem: 0,
    furniture: 0,
    engraving: 0,
    gear: {},
    notes: '',
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

export function createDefaultPetProgress(
  petId: string,
  overrides: Partial<PetProgress> = {},
): PetProgress {
  return {
    petId,
    strength: 0,
    intelligence: 0,
    agility: 0,
    training: 0,
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

export function createEmptyAppData(): AppData {
  return {
    schemaVersion: 1,
    profile: {
      crystalLevel: 0,
      petResonanceLevel: 0,
    },
    heroes: {},
    pets: {},
    teams: [],
  }
}
