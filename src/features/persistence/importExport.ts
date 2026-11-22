import type { AppData } from '@/types'
import { exportDataSchema, type ExportData } from './exportSchema'

export const APP_ID = 'afk-astral-codex'
export const GAME_ID = 'afk-arena-classic'

export function createExportData(data: AppData): ExportData {
  return {
    ...data,
    app: APP_ID,
    game: GAME_ID,
    exportedAt: new Date().toISOString(),
  }
}

export function serializeExport(data: AppData): string {
  return JSON.stringify(createExportData(data), null, 2)
}

export function parseImport(raw: string): AppData {
  const parsed = exportDataSchema.parse(JSON.parse(raw))

  return {
    schemaVersion: parsed.schemaVersion,
    profile: parsed.profile,
    heroes: parsed.heroes,
    teams: parsed.teams,
  }
}
