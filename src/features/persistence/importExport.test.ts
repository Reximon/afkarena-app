import { describe, expect, it } from 'vitest'
import type { AppData } from '@/types'
import {
  createDefaultHeroProgress,
  createDefaultPetProgress,
  createEmptyAppData,
  createEmptyTeam,
} from './defaults'
import { createExportData, parseImport, serializeExport } from './importExport'

function createSampleData(): AppData {
  const data = createEmptyAppData()

  return {
    ...data,
    profile: {
      playerName: 'Rex',
      server: 'S1',
      crystalLevel: 240,
      petResonanceLevel: 7,
    },
    heroes: {
      '9': createDefaultHeroProgress('9', {
        ascension: 'ascended5',
        level: 240,
        inCrystal: true,
        priority: true,
        signatureItem: 30,
        furniture: 9,
        engraving: 60,
        collection: {
          collectionId: 'temporal-cover',
          level: 7,
          skillLevel: 2,
          mythicStats: 4,
        },
      }),
      '98': createDefaultHeroProgress('98', {
        artifact: 'duras-call',
        linkedHeroId: '9',
      }),
    },
    pets: {
      '6004': createDefaultPetProgress('6004', {
        strength: 3,
        intelligence: 4,
        agility: 5,
        training: 2,
      }),
    },
    teams: [
      createEmptyTeam({
        name: 'Campaign',
        petId: '6004',
        pinned: true,
        slots: [
          { position: 1, row: 'front', heroId: '9' },
          { position: 2, row: 'front' },
          { position: 3, row: 'back' },
          { position: 4, row: 'back' },
          { position: 5, row: 'back' },
        ],
      }),
    ],
  }
}

describe('import/export', () => {
  it('round-trips a versioned backup', () => {
    const data = createSampleData()
    const parsed = parseImport(serializeExport(data))

    expect(parsed).toEqual(data)
  })

  it('round-trips T5 resonant and exclusive gear', () => {
    const data = createSampleData()
    data.heroes['9'].gear.weapon = {
      slot: 'weapon',
      tier: 't5',
      stars: 5,
      exclusive: true,
    }
    data.heroes['9'].gear.helmet = {
      slot: 'helmet',
      tier: 't2',
      stars: 2,
      faction: 'Wilder',
      resonant: true,
    }

    expect(parseImport(serializeExport(data))).toEqual(data)
  })

  it('adds game metadata to exports', () => {
    const exported = createExportData(createSampleData())

    expect(exported.app).toBe('afk-astral-codex')
    expect(exported.game).toBe('afk-arena-classic')
    expect(exported.exportedAt).toEqual(expect.any(String))
  })

  it('exports heroes by display name instead of id', () => {
    const exported = createExportData(createSampleData())

    expect(Object.keys(exported.heroes)).toEqual(['Brutus', 'Ainz Ooal Gown'])
    expect(exported.heroes.Brutus).not.toHaveProperty('heroId')
    expect(exported.heroes['Ainz Ooal Gown'].linkedHero).toBe('Brutus')
    expect(exported.teams[0].slots[0]).toEqual({
      position: 1,
      row: 'front',
      hero: 'Brutus',
    })
  })

  it('exports pets by name and links the team pet', () => {
    const exported = createExportData(createSampleData())
    const raw = serializeExport(createSampleData())

    expect(Object.keys(exported.pets ?? {})).toEqual(['Polar Beast'])
    expect(exported.pets?.['Polar Beast']).toEqual({
      strength: 3,
      intelligence: 4,
      agility: 5,
      training: 2,
      updatedAt: expect.any(String),
    })
    expect(exported.teams[0].pet).toBe('Polar Beast')
    expect(raw).not.toContain('"petId"')
  })

  it('imports legacy backups without pets', () => {
    const data = createSampleData()
    const legacy = {
      ...data,
      app: 'afk-astral-codex',
      game: 'afk-arena-classic',
      exportedAt: new Date().toISOString(),
    }
    delete (legacy as { pets?: unknown }).pets
    legacy.teams = legacy.teams.map((team) => ({ ...team, petId: undefined }))

    expect(parseImport(JSON.stringify(legacy)).pets).toEqual({})
  })

  it('accepts readable exports without pets', () => {
    const raw = JSON.parse(serializeExport(createSampleData()))
    delete raw.pets
    delete raw.teams[0].pet

    const parsed = parseImport(JSON.stringify(raw))

    expect(parsed.pets).toEqual({})
    expect(parsed.teams[0].petId).toBeUndefined()
  })

  it('accepts teams without the pin flag', () => {
    const raw = JSON.parse(serializeExport(createSampleData()))
    delete raw.teams[0].pinned

    expect(parseImport(JSON.stringify(raw)).teams[0].pinned).toBeUndefined()
  })

  it('rejects exports with unknown pet names', () => {
    const raw = JSON.parse(serializeExport(createSampleData()))
    raw.pets['Unknown Beast'] = raw.pets['Polar Beast']
    delete raw.pets['Polar Beast']

    expect(() => parseImport(JSON.stringify(raw))).toThrow(/Unknown pet: Unknown Beast/)
  })

  it('imports legacy backups keyed by hero id', () => {
    const data = createSampleData()
    const legacy = {
      ...data,
      app: 'afk-astral-codex',
      game: 'afk-arena-classic',
      exportedAt: new Date().toISOString(),
    }

    expect(parseImport(JSON.stringify(legacy))).toEqual(data)
  })

  it('accepts legacy backups without pet resonance', () => {
    const data = createSampleData()
    const legacy = {
      ...data,
      app: 'afk-astral-codex',
      game: 'afk-arena-classic',
      exportedAt: new Date().toISOString(),
    }
    delete (legacy.profile as { petResonanceLevel?: number }).petResonanceLevel

    expect(parseImport(JSON.stringify(legacy)).profile.petResonanceLevel).toBeUndefined()
  })

  it('rejects exports with unknown hero names', () => {
    const raw = JSON.parse(serializeExport(createSampleData()))
    raw.heroes['Unknown Hero'] = raw.heroes.Brutus
    delete raw.heroes.Brutus

    expect(() => parseImport(JSON.stringify(raw))).toThrow(/Unknown hero: Unknown Hero/)
  })

  it('accepts legacy collections without id or skill level', () => {
    const raw = JSON.parse(serializeExport(createSampleData()))
    raw.heroes.Brutus.collection = { level: 3, mythicStats: 2 }

    const parsed = parseImport(JSON.stringify(raw))

    expect(parsed.heroes['9'].collection).toEqual({
      level: 3,
      skillLevel: 0,
      mythicStats: 2,
    })
  })

  it('accepts legacy heroes without the target flag', () => {
    const raw = JSON.parse(serializeExport(createSampleData()))
    delete raw.heroes.Brutus.priority
    delete raw.heroes['Ainz Ooal Gown'].priority

    const parsed = parseImport(JSON.stringify(raw))

    expect(parsed.heroes['9'].priority).toBeUndefined()
    expect(parsed.heroes['98'].priority).toBeUndefined()
  })

  it('rejects backups from another game', () => {
    const exported = createExportData(createSampleData())

    expect(() =>
      parseImport(JSON.stringify({ ...exported, game: 'afk-arena-companions' })),
    ).toThrow()
  })

  it('rejects invalid gear star values', () => {
    const data = createSampleData()
    data.heroes['9'].gear.weapon = {
      slot: 'weapon',
      tier: 't4',
      stars: 9 as 0,
    }

    expect(() => parseImport(serializeExport(data))).toThrow()
  })
})
