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
  resonant: z.boolean().optional(),
  exclusive: z.boolean().optional(),
})

export const collectionSchema = z.object({
  collectionId: z.string().min(1).optional(),
  level: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
    z.literal(7),
    z.literal(8),
    z.literal(9),
    z.literal(10),
  ]),
  skillLevel: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]).default(0),
  mythicStats: mythicStatsSchema,
})

export const heroProgressSchema = z.object({
  heroId: z.string().min(1),
  ascension: ascensionSchema,
  level: z.number().int().min(0).max(1000),
  inCrystal: z.boolean(),
  priority: z.boolean().optional(),
  signatureItem: z.number().int().min(0).max(40),
  furniture: z.union([z.literal(0), z.literal(3), z.literal(9), z.literal(36)]),
  engraving: z.union([z.literal(0), z.literal(30), z.literal(60), z.literal(80)]),
  gear: z.partialRecord(gearSlotSchema, gearPieceSchema).default({}),
  artifact: z.string().optional(),
  linkedHeroId: z.string().optional(),
  collection: collectionSchema.optional(),
  notes: z.string().optional(),
  updatedAt: z.string().min(1),
})

export const petProgressSchema = z.object({
  petId: z.string().min(1),
  strength: z.number().int().min(0).max(18),
  intelligence: z.number().int().min(0).max(18),
  agility: z.number().int().min(0).max(18),
  training: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]).default(0),
  updatedAt: z.string().min(1),
})

export const profileSchema = z.object({
  playerName: z.string().optional(),
  server: z.string().optional(),
  crystalLevel: z.number().int().min(0).max(1000),
  petResonanceLevel: z.number().int().min(0).max(54).optional(),
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
  petId: z.string().min(1).optional(),
  pinned: z.boolean().optional(),
  notes: z.string().optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
})

export const appDataSchema = z.object({
  schemaVersion: z.literal(1),
  profile: profileSchema,
  heroes: z.record(z.string(), heroProgressSchema),
  pets: z.record(z.string(), petProgressSchema).optional(),
  teams: z.array(teamSchema),
})

export const legacyExportDataSchema = appDataSchema.extend({
  app: z.literal('afk-astral-codex'),
  game: z.literal('afk-arena-classic'),
  exportedAt: z.string().min(1),
})

export const readableHeroProgressSchema = heroProgressSchema
  .omit({ heroId: true, linkedHeroId: true })
  .extend({ linkedHero: z.string().min(1).optional() })

export const readablePetProgressSchema = petProgressSchema.omit({ petId: true })

export const readableTeamSlotSchema = z.object({
  position: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  row: z.enum(['front', 'back']),
  hero: z.string().min(1).optional(),
})

export const readableTeamSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  mode: teamModeSchema,
  slots: z.array(readableTeamSlotSchema).length(5),
  pet: z.string().min(1).optional(),
  pinned: z.boolean().optional(),
  notes: z.string().optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
})

export const exportDataSchema = z.object({
  schemaVersion: z.literal(1),
  profile: profileSchema,
  heroes: z.record(z.string(), readableHeroProgressSchema),
  pets: z.record(z.string(), readablePetProgressSchema).optional(),
  teams: z.array(readableTeamSchema),
  app: z.literal('afk-astral-codex'),
  game: z.literal('afk-arena-classic'),
  exportedAt: z.string().min(1),
})

export type ExportData = z.infer<typeof exportDataSchema>
