import { describe, expect, it } from 'vitest'
import { createDefaultPetProgress } from '@/features/persistence/defaults'
import {
  clampPetBuffs,
  getPetMaxLevel,
  getPetResonanceDeficit,
  getPetTotalLevel,
  getPetTrainingUnlock,
  hasTraining,
  pets,
} from './pets'

describe('pet catalog', () => {
  it('contains 30 pets with unique ids, names and images', () => {
    expect(pets).toHaveLength(30)
    expect(new Set(pets.map((pet) => pet.id)).size).toBe(30)
    expect(new Set(pets.map((pet) => pet.name)).size).toBe(30)
    expect(new Set(pets.map((pet) => pet.image)).size).toBe(30)
    expect(pets.every((pet) => pet.skill.length > 0)).toBe(true)
  })

  it('splits tiers into 3 rare, 23 elite and 4 fabled pets', () => {
    expect(pets.filter((pet) => pet.tier === 'rare')).toHaveLength(3)
    expect(pets.filter((pet) => pet.tier === 'elite')).toHaveLength(23)
    expect(pets.filter((pet) => pet.tier === 'fabled')).toHaveLength(4)
  })

  it('uses beast artwork paths', () => {
    expect(pets.every((pet) => pet.image === `/images/afk-arena/game/beast/${pet.id}.webp`)).toBe(
      true,
    )
  })

  it('derives the max beast level from the tier buff cap', () => {
    expect(getPetMaxLevel('rare')).toBe(18)
    expect(getPetMaxLevel('elite')).toBe(36)
    expect(getPetMaxLevel('fabled')).toBe(54)
  })

  it('sums the three attribute buffs into the beast level', () => {
    const pet = createDefaultPetProgress('6004', { strength: 4, intelligence: 5, agility: 6 })
    expect(getPetTotalLevel(pet)).toBe(15)
  })

  it('unlocks training at beast levels 0, 3, 9 and 15', () => {
    expect(getPetTrainingUnlock(0)).toBe(0)
    expect(getPetTrainingUnlock(1)).toBe(3)
    expect(getPetTrainingUnlock(2)).toBe(9)
    expect(getPetTrainingUnlock(3)).toBe(15)
  })

  it('knows only elite and fabled pets have training', () => {
    expect(hasTraining('rare')).toBe(false)
    expect(hasTraining('elite')).toBe(true)
    expect(hasTraining('fabled')).toBe(true)
  })

  it('clamps buffs to the tier cap without dropping training', () => {
    const rare = clampPetBuffs(
      '6001',
      createDefaultPetProgress('6001', { strength: 10, intelligence: 2, agility: 7 }),
    )
    expect(rare.strength).toBe(6)
    expect(rare.intelligence).toBe(2)
    expect(rare.agility).toBe(6)

    const fabled = clampPetBuffs(
      '6030',
      createDefaultPetProgress('6030', {
        strength: 20,
        intelligence: 18,
        agility: 1,
        training: 3,
      }),
    )
    expect(fabled.strength).toBe(18)
    expect(fabled.intelligence).toBe(18)
    expect(fabled.training).toBe(3)
  })

  it('measures the deficit to the resonance level', () => {
    const low = createDefaultPetProgress('6004', { strength: 2, intelligence: 2, agility: 1 })

    expect(getPetResonanceDeficit('elite', low, 0)).toBe(0)
    expect(getPetResonanceDeficit('elite', low, 5)).toBe(0)
    expect(getPetResonanceDeficit('elite', low, 7)).toBe(2)
    expect(getPetResonanceDeficit('elite', low, 54)).toBe(31)
    expect(getPetResonanceDeficit('elite', low, Number.NaN)).toBe(0)
  })

  it('never asks a pet past its tier cap', () => {
    const rare = createDefaultPetProgress('6001', { strength: 6, intelligence: 6, agility: 6 })
    const lowRare = createDefaultPetProgress('6001', { strength: 2, intelligence: 2, agility: 1 })

    expect(getPetResonanceDeficit('rare', rare, 20)).toBe(0)
    expect(getPetResonanceDeficit('rare', lowRare, 20)).toBe(13)
    expect(getPetResonanceDeficit('rare', lowRare, 54)).toBe(13)
  })
})
