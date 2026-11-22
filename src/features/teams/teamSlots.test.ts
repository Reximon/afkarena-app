import { describe, expect, it } from 'vitest'
import { createTeamSlots } from '@/features/persistence/defaults'
import { assignHeroToSlot, resolveDropTarget } from './teamSlots'

describe('team slots', () => {
  it('assigns a hero to an empty slot', () => {
    const slots = assignHeroToSlot(createTeamSlots(), 1, '9')

    expect(slots.find((slot) => slot.position === 1)?.heroId).toBe('9')
  })

  it('moves a hero instead of duplicating them', () => {
    const slots = assignHeroToSlot(createTeamSlots(), 1, '9')
    const moved = assignHeroToSlot(slots, 3, '9')

    expect(moved.find((slot) => slot.position === 1)?.heroId).toBeUndefined()
    expect(moved.find((slot) => slot.position === 3)?.heroId).toBe('9')
  })

  it('clears a slot when given an empty hero id', () => {
    const slots = assignHeroToSlot(createTeamSlots(), 2, '9')
    const cleared = assignHeroToSlot(slots, 2, '')

    expect(cleared.find((slot) => slot.position === 2)?.heroId).toBeUndefined()
  })

  it('resolves row drops to the first empty slot', () => {
    const slots = assignHeroToSlot(createTeamSlots(), 1, '9')

    expect(resolveDropTarget(slots, 'front')).toBe(2)
    expect(resolveDropTarget(slots, 'back')).toBe(3)
  })

  it('resolves slot drops and ignores invalid targets', () => {
    const slots = createTeamSlots()

    expect(resolveDropTarget(slots, 'slot-4')).toBe(4)
    expect(resolveDropTarget(slots, 'slot-9')).toBeUndefined()
    expect(resolveDropTarget(slots, 'unknown')).toBeUndefined()
  })
})
