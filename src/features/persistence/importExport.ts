import type { AppData, HeroProgress, PetProgress } from '@/types'
import {
  getHeroCatalogEntry,
  getHeroCatalogEntryByName,
  getHeroDisplayName,
} from '@/features/heroes/heroCatalog'
import { getPetName, petById, petByName } from '@/features/pets/pets'
import { exportDataSchema, legacyExportDataSchema, type ExportData } from './exportSchema'

export const APP_ID = 'afk-astral-codex'
export const GAME_ID = 'afk-arena-classic'

export function createExportData(data: AppData): ExportData {
  const heroes: ExportData['heroes'] = {}
  const pets: NonNullable<ExportData['pets']> = {}

  for (const hero of Object.values(data.heroes)) {
    const { heroId, linkedHeroId, ...rest } = hero
    heroes[getHeroDisplayName(heroId)] = linkedHeroId
      ? { ...rest, linkedHero: getHeroDisplayName(linkedHeroId) }
      : rest
  }

  for (const pet of Object.values(data.pets)) {
    const { petId, ...rest } = pet
    pets[getPetName(petId)] = rest
  }

  return {
    schemaVersion: data.schemaVersion,
    profile: data.profile,
    heroes,
    pets,
    teams: data.teams.map(({ petId, ...team }) => ({
      ...team,
      slots: team.slots.map(({ heroId, ...slot }) =>
        heroId ? { ...slot, hero: getHeroDisplayName(heroId) } : slot,
      ),
      ...(petId ? { pet: getPetName(petId) } : {}),
    })),
    app: APP_ID,
    game: GAME_ID,
    exportedAt: new Date().toISOString(),
  }
}

export function serializeExport(data: AppData): string {
  return JSON.stringify(createExportData(data), null, 2)
}

function resolveHeroId(name: string): string {
  const entry = getHeroCatalogEntryByName(name) ?? getHeroCatalogEntry(name)
  if (!entry) {
    throw new Error(`Unknown hero: ${name}`)
  }

  return entry.id
}

function resolvePetId(name: string): string {
  const entry = petByName.get(name) ?? petById.get(name)
  if (!entry) {
    throw new Error(`Unknown pet: ${name}`)
  }

  return entry.id
}

export function parseImport(raw: string): AppData {
  const json: unknown = JSON.parse(raw)
  const legacy = legacyExportDataSchema.safeParse(json)

  if (legacy.success) {
    return {
      schemaVersion: legacy.data.schemaVersion,
      profile: legacy.data.profile,
      heroes: legacy.data.heroes,
      pets: legacy.data.pets ?? {},
      teams: legacy.data.teams,
    }
  }

  const parsed = exportDataSchema.parse(json)
  const heroes: Record<string, HeroProgress> = {}
  const pets: Record<string, PetProgress> = {}

  for (const [name, hero] of Object.entries(parsed.heroes)) {
    const heroId = resolveHeroId(name)
    const { linkedHero, ...rest } = hero
    heroes[heroId] = {
      heroId,
      ...rest,
      ...(linkedHero ? { linkedHeroId: resolveHeroId(linkedHero) } : {}),
    }
  }

  for (const [name, pet] of Object.entries(parsed.pets ?? {})) {
    const petId = resolvePetId(name)
    pets[petId] = { petId, ...pet }
  }

  return {
    schemaVersion: parsed.schemaVersion,
    profile: parsed.profile,
    heroes,
    pets,
    teams: parsed.teams.map(({ pet, ...team }) => ({
      ...team,
      slots: team.slots.map(({ hero, ...slot }) =>
        hero ? { ...slot, heroId: resolveHeroId(hero) } : slot,
      ),
      ...(pet ? { petId: resolvePetId(pet) } : {}),
    })),
  }
}
