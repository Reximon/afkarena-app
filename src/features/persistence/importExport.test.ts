import { describe, expect, it } from 'vitest'
import type { AppData } from '@/types'
import { createDefaultHeroProgress, createEmptyAppData, createEmptyTeam } from './defaults'
import { createExportData, parseImport, serializeExport } from './importExport'

function createSampleData(): AppData {
  const data = createEmptyAppData()

  return {
    ...data,
    profile: {
      playerName: 'Rex',
      server: 'S1',
      crystalLevel: 240,
    },
    heroes: {
      '9': createDefaultHeroProgress('9', {
        ascension: 'ascended5',
        level: 240,
        inCrystal: true,
        signatureItem: 30,
        furniture: 9,
        engraving: 60,
      }),
    },
    teams: [
      createEmptyTeam({
        name: 'Campaign',
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

  it('adds game metadata to exports', () => {
    const exported = createExportData(createSampleData())

    expect(exported.app).toBe('afk-astral-codex')
    expect(exported.game).toBe('afk-arena-classic')
    expect(exported.exportedAt).toEqual(expect.any(String))
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
