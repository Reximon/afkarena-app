export const FACTIONS = [
  'Lightbearer',
  'Mauler',
  'Wilder',
  'Graveborn',
  'Celestial',
  'Hypogean',
  'Dimensional',
  'Draconis',
] as const

export type Faction = (typeof FACTIONS)[number]

export const HERO_TYPES = ['Warrior', 'Ranger', 'Mage'] as const

export type HeroType = (typeof HERO_TYPES)[number]

export const HERO_CLASSES = ['Warrior', 'Tank', 'Ranger', 'Mage', 'Support'] as const

export type HeroClass = (typeof HERO_CLASSES)[number]

export const HERO_ROLES = [
  'Tank',
  'Continuous Damage',
  'Heal',
  'Burst Damage',
  'Control',
  'Assassin',
  'Buff',
  'AoE',
  'Debuff',
] as const

export type HeroRole = (typeof HERO_ROLES)[number]

export const HERO_RARITIES = ['common', 'rare', 'elite', 'legendary'] as const

export type HeroRarity = (typeof HERO_RARITIES)[number]

export const ASCENSIONS = [
  'common',
  'rare',
  'rare+',
  'elite',
  'elite+',
  'legendary',
  'legendary+',
  'mythic',
  'mythic+',
  'ascended',
  'ascended1',
  'ascended2',
  'ascended3',
  'ascended4',
  'ascended5',
] as const

export type Ascension = (typeof ASCENSIONS)[number]

export const GEAR_SLOTS = ['weapon', 'helmet', 'chest', 'boots'] as const

export type GearSlot = (typeof GEAR_SLOTS)[number]

export const GEAR_TIERS = ['none', 'mythic', 't1', 't2', 't3', 't4', 't5'] as const

export type GearTier = (typeof GEAR_TIERS)[number]

export const TEAM_MODES = [
  'campaign',
  'arena',
  'dreamRealm',
  'guildHunt',
  'tower',
  'other',
] as const

export type TeamMode = (typeof TEAM_MODES)[number]

export const PET_TIERS = ['rare', 'elite', 'fabled'] as const

export type PetTier = (typeof PET_TIERS)[number]

export const PET_TRAINING_LEVELS = [0, 1, 2, 3] as const

export type PetTrainingLevel = (typeof PET_TRAINING_LEVELS)[number]

export interface PetProgress {
  petId: string
  strength: number
  intelligence: number
  agility: number
  training: PetTrainingLevel
  updatedAt: string
}

export interface HeroSkin {
  id: number
  name: string
}

export interface HeroCatalogSourceEntry {
  id: string
  name: string
  displayName: string
  faction: Faction
  class: HeroType
  rarity: HeroRarity
  isAwakened: boolean
  roles: HeroRole[]
  skins: HeroSkin[]
}

export interface HeroCatalogEntry extends Omit<HeroCatalogSourceEntry, 'class'> {
  type: HeroType
  class?: HeroClass
}

export interface HeroCatalogFile {
  game: 'afk-arena-classic'
  source: string
  count: number
  heroes: HeroCatalogSourceEntry[]
}

export interface HeroClassFile {
  game: 'afk-arena-classic'
  source: string
  fallbackSource: string
  count: number
  classes: Record<string, HeroClass>
  unmatched: Array<{
    id: string
    name: string
    faction: Faction
    type: HeroType
  }>
}

export interface TierListTier {
  tier: string
  heroIds: string[]
}

export interface TierListMode {
  slug: string
  name: string
  category: string
  tiers: TierListTier[]
}

export interface TierListFile {
  game: 'afk-arena-classic'
  source: string
  updatedAt: string | null
  count: number
  lists: TierListMode[]
}

export interface GearPiece {
  slot: GearSlot
  tier: GearTier
  stars: 0 | 1 | 2 | 3 | 4 | 5
  faction?: Faction
  resonant?: boolean
  exclusive?: boolean
}

export const COLLECTION_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

export type CollectionLevel = (typeof COLLECTION_LEVELS)[number]

export const COLLECTION_SKILL_LEVELS = [0, 1, 2, 3] as const

export type CollectionSkillLevel = (typeof COLLECTION_SKILL_LEVELS)[number]

export const COLLECTION_MYTHIC_STATS = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const

export type CollectionMythicStats = (typeof COLLECTION_MYTHIC_STATS)[number]

export interface CollectionProgress {
  collectionId?: string
  level: CollectionLevel
  skillLevel: CollectionSkillLevel
  mythicStats: CollectionMythicStats
}

export interface HeroProgress {
  heroId: string
  ascension: Ascension
  level: number
  inCrystal: boolean
  priority?: boolean
  signatureItem: number
  furniture: 0 | 3 | 9 | 36
  engraving: 0 | 30 | 60 | 80
  gear: Partial<Record<GearSlot, GearPiece>>
  artifact?: string
  linkedHeroId?: string
  collection?: CollectionProgress
  notes?: string
  updatedAt: string
}

export interface Profile {
  playerName?: string
  server?: string
  crystalLevel: number
  petResonanceLevel?: number
}

export interface TeamSlot {
  position: 1 | 2 | 3 | 4 | 5
  row: 'front' | 'back'
  heroId?: string
}

export interface Team {
  id: string
  name: string
  mode: TeamMode
  slots: TeamSlot[]
  petId?: string
  pinned?: boolean
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface AppData {
  schemaVersion: 1
  profile: Profile
  heroes: Record<string, HeroProgress>
  pets: Record<string, PetProgress>
  teams: Team[]
}
