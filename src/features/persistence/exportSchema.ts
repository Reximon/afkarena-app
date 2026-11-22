import { z } from 'zod'
import { ASCENSIONS, FACTIONS, GEAR_SLOTS, GEAR_TIERS, TEAM_MODES } from '@/types'

const factionSchema = z.enum(FACTIONS)
const ascensionSchema = z.enum(ASCENSIONS)
const gearSlotSchema = z.enum(GEAR_SLOTS)
const gearTierSchema = z.enum(GEAR_TIERS)
const teamModeSchema = z.enum(TEAM_MODES)

const gearStarsSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
])

const mythicStatsSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
])

export const gearPieceSchema = z.object({
  slot: gearSlotSchema,
  tier: gearTierSchema,
  stars: gearStarsSchema,
  faction: factionSchema.optional(),
})

export const collectionSchema = z.object({
  level: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  mythicStats: mythicStatsSchema,
})

export const heroProgressSchema = z.object({
  heroId: z.string().min(1),
  ascension: ascensionSchema,
  level: z.number().int().min(0).max(1000),
  inCrystal: z.boolean(),
  signatureItem: z.number().int().min(0).max(40),
  furniture: z.union([z.literal(0), z.literal(3), z.literal(9), z.literal(36)]),
  engraving: z.union([z.literal(0), z.literal(30), z.literal(60), z.literal(80)]),
  gear: z.partialRecord(gearSlotSchema, gearPieceSchema).default({}),
  artifact: z.string().optional(),
  collection: collectionSchema.optional(),
  notes: z.string().optional(),
  updatedAt: z.string().min(1),
})

export const profileSchema = z.object({
  playerName: z.string().optional(),
  server: z.string().optional(),
  crystalLevel: z.number().int().min(0).max(1000),
})

export const teamSlotSchema = z.object({
  position: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  row: z.enum(['front', 'back']),
  heroId: z.string().optional(),
})

export const teamSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  mode: teamModeSchema,
  slots: z.array(teamSlotSchema).length(5),
  notes: z.string().optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
})

export const appDataSchema = z.object({
  schemaVersion: z.literal(1),
  profile: profileSchema,
  heroes: z.record(z.string(), heroProgressSchema),
  teams: z.array(teamSchema),
})

export const exportDataSchema = appDataSchema.extend({
  app: z.literal('afk-astral-codex'),
  game: z.literal('afk-arena-classic'),
  exportedAt: z.string().min(1),
})

export type ExportData = z.infer<typeof exportDataSchema>
