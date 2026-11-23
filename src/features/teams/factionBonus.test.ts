import { describe, expect, it } from 'vitest'
import { computeFactionBonus } from './factionBonus'

const LIGHTBEARER = ['182', '220', '3', '153', '248']
const MAULER = ['131', '137', '11', '87', '47']
const WILDER = ['7', '126', '179', '201', '170']
const GRAVEBORN = ['148', '232', '173', '258', '205']
const CELESTIAL = ['102', '55', '132', '202', '161']
const HYPOGEAN = ['214', '178', '130', '244', '157']
const DRACONIS = ['231', '260', '189']
const DIMENSIONAL = ['98', '97', '78']

describe('faction bonuses', () => {
  it('grants no bonus with fewer than three heroes of one faction', () => {
    const summary = computeFactionBonus([LIGHTBEARER[0], LIGHTBEARER[1], MAULER[0]])

    expect(summary.regularBonus).toBeUndefined()
    expect(summary.counts).toEqual([
      { faction: 'Lightbearer', count: 2 },
      { faction: 'Mauler', count: 1 },
    ])
  })

  it('grants the 3 bonus for three heroes of the same faction', () => {
    const summary = computeFactionBonus(LIGHTBEARER.slice(0, 3))

    expect(summary.regularBonus).toEqual({ tier: 'three', attack: 10, hp: 10 })
  })

  it('grants the 4 bonus for four heroes of the same faction', () => {
    const summary = computeFactionBonus(LIGHTBEARER.slice(0, 4))

    expect(summary.regularBonus).toEqual({ tier: 'four', attack: 15, hp: 20 })
  })

  it('grants the 5 bonus for five heroes of the same faction', () => {
    const summary = computeFactionBonus(LIGHTBEARER)

    expect(summary.regularBonus).toEqual({ tier: 'five', attack: 25, hp: 25 })
  })

  it('grants the 3+2 bonus for three and two heroes of different factions', () => {
    const summary = computeFactionBonus([...LIGHTBEARER.slice(0, 3), ...WILDER.slice(0, 2)])

    expect(summary.regularBonus).toEqual({ tier: 'threeTwo', attack: 15, hp: 15 })
  })

  it('lets one Celestial complete the 3 bonus', () => {
    const summary = computeFactionBonus([...LIGHTBEARER.slice(0, 2), CELESTIAL[0]])

    expect(summary.regularBonus).toEqual({ tier: 'three', attack: 10, hp: 10 })
    expect(summary.celestialCount).toBe(1)
  })

  it('lets one Celestial complete the 4 bonus', () => {
    const summary = computeFactionBonus([...LIGHTBEARER.slice(0, 3), CELESTIAL[0]])

    expect(summary.regularBonus).toEqual({ tier: 'four', attack: 15, hp: 20 })
  })

  it('lets one Celestial complete the 3+2 bonus', () => {
    const summary = computeFactionBonus([
      ...LIGHTBEARER.slice(0, 2),
      ...MAULER.slice(0, 2),
      CELESTIAL[0],
    ])

    expect(summary.regularBonus).toEqual({ tier: 'threeTwo', attack: 15, hp: 15 })
  })

  it('lets two Celestials complete the 5 bonus', () => {
    const summary = computeFactionBonus([...GRAVEBORN.slice(0, 3), ...CELESTIAL.slice(0, 2)])

    expect(summary.regularBonus).toEqual({ tier: 'five', attack: 25, hp: 25 })
  })

  it('treats three Celestials as three heroes of any faction', () => {
    const summary = computeFactionBonus(CELESTIAL.slice(0, 3))

    expect(summary.regularBonus).toEqual({ tier: 'three', attack: 10, hp: 10 })
  })

  it('counts Hypogeans on their own ladder without a regular bonus', () => {
    const summary = computeFactionBonus([
      LIGHTBEARER[0],
      MAULER[0],
      ...HYPOGEAN.slice(0, 2),
      undefined,
    ])

    expect(summary.regularBonus).toBeUndefined()
    expect(summary.hypogeanCount).toBe(2)
  })

  it('does not add Celestials to the Hypogean ladder', () => {
    const summary = computeFactionBonus([...HYPOGEAN.slice(0, 2), ...CELESTIAL.slice(0, 3)])

    expect(summary.hypogeanCount).toBe(2)
    expect(summary.celestialCount).toBe(3)
    expect(summary.regularBonus).toEqual({ tier: 'three', attack: 10, hp: 10 })
  })

  it('counts Draconis heroes separately from the regular ladder', () => {
    const summary = computeFactionBonus([...DRACONIS.slice(0, 2), LIGHTBEARER[0]])

    expect(summary.draconisCount).toBe(2)
    expect(summary.regularBonus).toBeUndefined()
  })

  it('ignores Dimensional heroes for faction bonuses', () => {
    const summary = computeFactionBonus([
      LIGHTBEARER[0],
      LIGHTBEARER[1],
      MAULER[0],
      MAULER[1],
      DIMENSIONAL[0],
    ])

    expect(summary.regularBonus).toBeUndefined()
    expect(summary.counts).toContainEqual({ faction: 'Dimensional', count: 1 })
  })

  it('ignores empty slots and unknown hero ids', () => {
    const summary = computeFactionBonus([undefined, '', 'unknown-id', ...WILDER.slice(0, 3)])

    expect(summary.filledCount).toBe(3)
    expect(summary.regularBonus).toEqual({ tier: 'three', attack: 10, hp: 10 })
  })
})
