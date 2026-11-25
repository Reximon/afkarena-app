import { describe, expect, it } from 'vitest'
import { elderTreeVirtues, getBlessingState, getVirtueLevels, getVirtueMaxLevel } from './elderTree'

describe('elderTreeVirtues', () => {
  it('covers the five classes with three blessings each', () => {
    expect(elderTreeVirtues).toHaveLength(5)
    expect(new Set(elderTreeVirtues.map((virtue) => virtue.class))).toEqual(
      new Set(['Warrior', 'Tank', 'Ranger', 'Mage', 'Support']),
    )
    for (const virtue of elderTreeVirtues) {
      expect(virtue.blessings).toHaveLength(3)
      expect(virtue.upgrades.length).toBeGreaterThan(0)
    }
  })

  it('keeps every branch upgrade in ascending level order', () => {
    for (const virtue of elderTreeVirtues) {
      for (const blessingIndex of [0, 1, 2]) {
        let previous = virtue.blessings[blessingIndex].unlockLevel
        for (const row of virtue.upgrades) {
          const level = row.levels[blessingIndex]
          expect(level).toBeGreaterThan(previous)
          previous = level
        }
      }
    }
  })

  it('lists the base unlocks plus every upgrade level', () => {
    const celerity = elderTreeVirtues[0]
    const levels = getVirtueLevels(celerity)
    expect(levels[0]).toBe(5)
    expect(levels).toContain(15)
    expect(levels).toContain(25)
    expect(levels.at(-1)).toBe(getVirtueMaxLevel(celerity))
  })
})

describe('getBlessingState', () => {
  const celerity = elderTreeVirtues[0]

  it('returns the base text before the first upgrade', () => {
    const state = getBlessingState(celerity, 0, 5)
    expect(state.activeLevel).toBe(5)
    expect(state.text).toContain('Dodge will be increased by 80 points')
    expect(state.nextLevel).toBe(10)
  })

  it('walks forward to the latest reached upgrade', () => {
    const state = getBlessingState(celerity, 2, 60)
    expect(state.activeLevel).toBe(60)
    expect(state.text).toBe('Health recovery increased to 6%.')
    expect(state.nextLevel).toBe(75)
  })

  it('marks a blessing as locked below its unlock level', () => {
    const state = getBlessingState(celerity, 1, 0)
    expect(state.unlocked).toBe(false)
    expect(state.text).toContain('140% damage')
    expect(state.nextLevel).toBe(20)
  })

  it('reports no next level once a branch has reached its last tier', () => {
    const state = getBlessingState(celerity, 0, 180)
    expect(state.activeLevel).toBe(170)
    expect(state.nextLevel).toBeNull()
  })
})
