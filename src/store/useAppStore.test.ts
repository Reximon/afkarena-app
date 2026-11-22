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
})
