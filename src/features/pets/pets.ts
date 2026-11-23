import type { PetProgress, PetTier, PetTrainingLevel } from '@/types'

export interface PetDefinition {
  id: string
  name: string
  tier: PetTier
  skill: string
  image: string
}

function petImage(id: string) {
  return `/images/afk-arena/game/beast/${id}.webp`
}

export const PET_TIER_MAX_BUFF: Record<PetTier, number> = {
  rare: 6,
  elite: 12,
  fabled: 18,
}

export const PET_MAX_RESONANCE = 54

export const PET_TRAINING_UNLOCK_LEVEL: Record<PetTrainingLevel, number> = {
  0: 0,
  1: 3,
  2: 9,
  3: 15,
}

export const pets: PetDefinition[] = [
  {
    id: '6001',
    name: 'Dreary Ball',
    tier: 'rare',
    skill: '280% ATK to all enemies',
    image: petImage('6001'),
  },
  {
    id: '6002',
    name: 'Tufty Ears',
    tier: 'rare',
    skill: 'Heals all allies 20% max HP, overheal becomes a 5-second shield',
    image: petImage('6002'),
  },
  {
    id: '6003',
    name: 'Grassy Orb',
    tier: 'rare',
    skill: 'All allies ATK +10% and Crit Rating +10 for 6 seconds',
    image: petImage('6003'),
  },
  {
    id: '6004',
    name: 'Polar Beast',
    tier: 'elite',
    skill: '300% ATK to all enemies',
    image: petImage('6004'),
  },
  {
    id: '6005',
    name: 'Fire Breather',
    tier: 'elite',
    skill: '320% ATK around your top damage dealer',
    image: petImage('6005'),
  },
  {
    id: '6006',
    name: 'Blade Ridge',
    tier: 'elite',
    skill: '380% ATK to the most damaged enemy hero',
    image: petImage('6006'),
  },
  {
    id: '6007',
    name: 'Winged Lion',
    tier: 'elite',
    skill: '300% ATK to all enemies',
    image: petImage('6007'),
  },
  {
    id: '6008',
    name: 'Rock Crown Lizard',
    tier: 'elite',
    skill: "7-second zone that absorbs 50% of allies' damage",
    image: petImage('6008'),
  },
  {
    id: '6009',
    name: 'Feline Vesperio',
    tier: 'elite',
    skill: 'Darkfire Ball hits the highest-energy enemies for 250% ATK each second',
    image: petImage('6009'),
  },
  {
    id: '6010',
    name: 'Bellbellow',
    tier: 'elite',
    skill: 'Heals all allies 240% ATK, Trail of Life gives Vitality +10',
    image: petImage('6010'),
  },
  {
    id: '6011',
    name: 'Flutterplume Owl',
    tier: 'elite',
    skill: '330% ATK zone that lengthens ally buffs 20% and shortens enemy buffs 20%',
    image: petImage('6011'),
  },
  {
    id: '6012',
    name: 'Talismane',
    tier: 'elite',
    skill:
      'Follows your front hero (Dodge +40, Magic Suppression +40), firecrackers 3 x 240% ATK and blind',
    image: petImage('6012'),
  },
  {
    id: '6013',
    name: 'Phantasmoth',
    tier: 'elite',
    skill: 'Bonds with your top damage dealer, whose normal attacks cut Tenacity',
    image: petImage('6013'),
  },
  {
    id: '6014',
    name: 'Savage Soufflé',
    tier: 'elite',
    skill: 'All allies +100 energy, 3 x 200% ATK to all enemies',
    image: petImage('6014'),
  },
  {
    id: '6015',
    name: 'Slumber Seal',
    tier: 'elite',
    skill: 'Spirits hit the lowest-HP enemy for 220% ATK every 1.5 seconds',
    image: petImage('6015'),
  },
  {
    id: '6016',
    name: 'Fox Fatale',
    tier: 'elite',
    skill: 'Top enemy damage dealer deals 40% less damage for 6 seconds',
    image: petImage('6016'),
  },
  {
    id: '6017',
    name: 'Shroom Spooder',
    tier: 'elite',
    skill: '8-second mist dealing 85% ATK per second',
    image: petImage('6017'),
  },
  {
    id: '6018',
    name: 'Radish Rotunda',
    tier: 'elite',
    skill: 'Heals the weakest ally 20% max HP, Sunny Sky raises healing 20%',
    image: petImage('6018'),
  },
  {
    id: '6019',
    name: 'Pandy Dumpty',
    tier: 'elite',
    skill: 'Smashes for 250% ATK, up to 3 rising strikes',
    image: petImage('6019'),
  },
  {
    id: '6020',
    name: 'Ice Crown',
    tier: 'elite',
    skill:
      '3 x 250% ATK to all enemies, Frost Shield dispels debuffs and blocks summon and beast damage',
    image: petImage('6020'),
  },
  {
    id: '6021',
    name: 'Aureus',
    tier: 'elite',
    skill: 'Follows your highest-ATK hero, normal attacks +40% damage plus joint attacks',
    image: petImage('6021'),
  },
  {
    id: '6022',
    name: 'Pearlcrest Ibis',
    tier: 'elite',
    skill: 'Heals all allies 3 x 250% ATK, Proficiency +35',
    image: petImage('6022'),
  },
  {
    id: '6023',
    name: 'Treatspector',
    tier: 'elite',
    skill: 'Candy gives allies ATK +40%, Lockdown drains 5% HP per second',
    image: petImage('6023'),
  },
  {
    id: '6024',
    name: 'Joyous Roamer',
    tier: 'elite',
    skill: 'Answers enemy energy drain with a 200% ATK fireball and 2-second stun',
    image: petImage('6024'),
  },
  {
    id: '6025',
    name: 'Trickery Chest',
    tier: 'elite',
    skill: "250% ATK to all enemies, Doomed Treasure wastes an enemy's next ultimate",
    image: petImage('6025'),
  },
  {
    id: '6026',
    name: 'Thistlekin',
    tier: 'elite',
    skill:
      'Damages nearby enemies for 3% of its max HP each second, curses the top enemy damage dealer',
    image: petImage('6026'),
  },
  {
    id: '6027',
    name: 'Nightfall Pegasus',
    tier: 'fabled',
    skill: 'Melancholy stacks cut enemy Damage Resist and damage dealt',
    image: petImage('6027'),
  },
  {
    id: '6028',
    name: 'Count Snickerfang',
    tier: 'fabled',
    skill: 'Carrot Pits every 5 seconds explode for 360% ATK',
    image: petImage('6028'),
  },
  {
    id: '6029',
    name: 'Twinlum Spirit',
    tier: 'fabled',
    skill: 'Nebulas heal and boost allies or damage and weaken enemies',
    image: petImage('6029'),
  },
  {
    id: '6030',
    name: 'Blazefang',
    tier: 'fabled',
    skill: 'Singe and Waxen Rot (enemies take 25% more damage), Melt Blast for 250% ATK',
    image: petImage('6030'),
  },
]

export const petCatalogCount = pets.length

export const petById = new Map(pets.map((pet) => [pet.id, pet]))
export const petByName = new Map(pets.map((pet) => [pet.name, pet]))

export function getPet(petId: string): PetDefinition | undefined {
  return petById.get(petId)
}

export function getPetName(petId: string): string {
  return petById.get(petId)?.name ?? petId
}

export function getPetTier(petId: string): PetTier | undefined {
  return petById.get(petId)?.tier
}

export function getPetMaxBuff(tier: PetTier): number {
  return PET_TIER_MAX_BUFF[tier]
}

export function getPetMaxLevel(tier: PetTier): number {
  return getPetMaxBuff(tier) * 3
}

export function getPetTotalLevel(
  pet: Pick<PetProgress, 'strength' | 'intelligence' | 'agility'>,
): number {
  return pet.strength + pet.intelligence + pet.agility
}

export function getPetResonanceDeficit(
  tier: PetTier,
  pet: Pick<PetProgress, 'strength' | 'intelligence' | 'agility'>,
  resonanceLevel: number,
): number {
  const level = Number.isFinite(resonanceLevel) ? Math.floor(resonanceLevel) : 0
  const target = Math.min(Math.max(0, level), getPetMaxLevel(tier))

  return Math.max(0, target - getPetTotalLevel(pet))
}

export function getPetTrainingUnlock(training: PetTrainingLevel): number {
  return PET_TRAINING_UNLOCK_LEVEL[training]
}

export function hasTraining(tier: PetTier): boolean {
  return tier !== 'rare'
}

export function clampPetBuffs(petId: string, pet: PetProgress): PetProgress {
  const definition = getPet(petId)
  if (!definition) return pet

  const max = getPetMaxBuff(definition.tier)

  return {
    ...pet,
    strength: Math.min(pet.strength, max),
    intelligence: Math.min(pet.intelligence, max),
    agility: Math.min(pet.agility, max),
  }
}
