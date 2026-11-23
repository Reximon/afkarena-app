import { beforeEach, describe, expect, it } from 'vitest'
import { createDefaultHeroProgress, createEmptyAppData } from '@/features/persistence/defaults'
import { useAppStore } from './useAppStore'

beforeEach(() => {
  localStorage.clear()
  useAppStore.setState(createEmptyAppData())
})

describe('useAppStore', () => {
  it('adds, updates and removes a hero', () => {
    useAppStore.getState().addHero(createDefaultHeroProgress('9'))
    expect(useAppStore.getState().heroes['9']?.level).toBe(1)

    useAppStore.getState().updateHero('9', { level: 240, inCrystal: true })
    expect(useAppStore.getState().heroes['9']?.level).toBe(240)
    expect(useAppStore.getState().heroes['9']?.inCrystal).toBe(true)

    useAppStore.getState().removeHero('9')
    expect(useAppStore.getState().heroes['9']).toBeUndefined()
  })

  it('clears a removed hero from team slots', () => {
    const teamId = useAppStore.getState().createTeam({ name: 'Campaign' })
    const slots = useAppStore.getState().teams[0].slots

    useAppStore.getState().updateTeam(teamId, {
      slots: slots.map((slot, index) => (index === 0 ? { ...slot, heroId: '9' } : slot)),
    })
    useAppStore.getState().addHero(createDefaultHeroProgress('9'))
    useAppStore.getState().removeHero('9')

    const updatedSlots = useAppStore.getState().teams[0].slots
    expect(updatedSlots[0].heroId).toBeUndefined()
  })

  it('creates teams with a 2-front, 3-back formation', () => {
    const teamId = useAppStore.getState().createTeam({ name: 'Arena' })
    const team = useAppStore.getState().teams.find((item) => item.id === teamId)

    expect(team?.slots).toHaveLength(5)
    expect(team?.slots.filter((slot) => slot.row === 'front')).toHaveLength(2)
    expect(team?.slots.filter((slot) => slot.row === 'back')).toHaveLength(3)
  })

  it('duplicates a team without sharing slot references', () => {
    const teamId = useAppStore.getState().createTeam({ name: 'Campaign' })
    const copyId = useAppStore.getState().duplicateTeam(teamId)
    const teams = useAppStore.getState().teams

    expect(copyId).not.toBeNull()
    expect(teams).toHaveLength(2)
    expect(teams[1].name).toBe('Campaign copy')
    expect(teams[1].slots).not.toBe(teams[0].slots)
  })

  it('keeps artifacts and collections mutually exclusive', () => {
    useAppStore.getState().addHero(
      createDefaultHeroProgress('9', {
        collection: {
          collectionId: 'timeline-watch',
          level: 6,
          skillLevel: 2,
          mythicStats: 4,
        },
      }),
    )

    useAppStore.getState().assignArtifact('9', 'duras-call')
    let hero = useAppStore.getState().heroes['9']

    expect(hero.artifact).toBe('duras-call')
    expect(hero.collection?.collectionId).toBeUndefined()
    expect(hero.collection?.level).toBe(6)

    useAppStore.getState().assignCollection('9', {
      collectionId: 'temporal-cover',
      level: 8,
      skillLevel: 1,
      mythicStats: 2,
    })
    hero = useAppStore.getState().heroes['9']

    expect(hero.artifact).toBeUndefined()
    expect(hero.collection).toEqual({
      collectionId: 'temporal-cover',
      level: 8,
      skillLevel: 1,
      mythicStats: 2,
    })
  })

  it('toggles the target flag without touching other progress', () => {
    useAppStore.getState().addHero(createDefaultHeroProgress('9', { level: 240 }))
    expect(useAppStore.getState().heroes['9'].priority).toBe(false)

    useAppStore.getState().updateHero('9', { priority: true })
    let hero = useAppStore.getState().heroes['9']
    expect(hero.priority).toBe(true)
    expect(hero.level).toBe(240)

    useAppStore.getState().updateHero('9', { priority: false })
    hero = useAppStore.getState().heroes['9']
    expect(hero.priority).toBe(false)
  })

  it('adds, updates and clamps a pet', () => {
    useAppStore.getState().addPet('6030')
    expect(useAppStore.getState().pets['6030']).toMatchObject({
      petId: '6030',
      strength: 0,
      intelligence: 0,
      agility: 0,
      training: 0,
    })

    useAppStore.getState().updatePet('6030', { strength: 20, training: 2 })
    const pet = useAppStore.getState().pets['6030']

    expect(pet.strength).toBe(18)
    expect(pet.training).toBe(2)
  })

  it('stores the beast resonance without touching pet buffs', () => {
    useAppStore.getState().addPet('6004', { strength: 2, intelligence: 2, agility: 1 })

    useAppStore.getState().setPetResonance(7)
    expect(useAppStore.getState().profile.petResonanceLevel).toBe(7)
    expect(useAppStore.getState().pets['6004']).toMatchObject({
      strength: 2,
      intelligence: 2,
      agility: 1,
    })

    useAppStore.getState().setPetResonance(200)
    expect(useAppStore.getState().profile.petResonanceLevel).toBe(54)

    useAppStore.getState().setPetResonance(-4)
    expect(useAppStore.getState().profile.petResonanceLevel).toBe(0)
    expect(useAppStore.getState().pets['6004'].strength).toBe(2)
  })

  it('removes a pet and clears only the teams using it', () => {
    useAppStore.getState().addPet('6004')
    useAppStore.getState().addPet('6005')
    const withPolar = useAppStore.getState().createTeam({ name: 'Campaign', petId: '6004' })
    const withOther = useAppStore.getState().createTeam({ name: 'Arena', petId: '6005' })

    useAppStore.getState().removePet('6004')

    const teams = useAppStore.getState().teams
    expect(useAppStore.getState().pets['6004']).toBeUndefined()
    expect(teams.find((team) => team.id === withPolar)?.petId).toBeUndefined()
    expect(teams.find((team) => team.id === withOther)?.petId).toBe('6005')
  })

  it('duplicates a team with its assigned pet', () => {
    const teamId = useAppStore.getState().createTeam({ name: 'Campaign', petId: '6004' })
    const copyId = useAppStore.getState().duplicateTeam(teamId)
    const copy = useAppStore.getState().teams.find((team) => team.id === copyId)

    expect(copy?.petId).toBe('6004')
  })

  it('unassigns a collection without losing its progress', () => {
    useAppStore.getState().addHero(
      createDefaultHeroProgress('9', {
        collection: {
          collectionId: 'timeline-watch',
          level: 5,
          skillLevel: 3,
          mythicStats: 7,
        },
      }),
    )

    useAppStore.getState().unassignCollection('9')
    const hero = useAppStore.getState().heroes['9']

    expect(hero.collection?.collectionId).toBeUndefined()
    expect(hero.collection?.level).toBe(5)
    expect(hero.collection?.skillLevel).toBe(3)
    expect(hero.collection?.mythicStats).toBe(7)
  })
})
