import { describe, expect, it } from 'vitest'
import type { GearPiece } from '@/types'
import {
  applyGearExclusiveChange,
  applyGearResonantChange,
  applyGearTierChange,
  getGearFactionDisplay,
  isExclusiveTier,
  normalizeGearPiece,
} from './gear'

describe('gear rules', () => {
  it('detects exclusive tiers', () => {
    expect(isExclusiveTier('t3')).toBe(true)
    expect(isExclusiveTier('t4')).toBe(true)
    expect(isExclusiveTier('t5')).toBe(true)
    expect(isExclusiveTier('t1')).toBe(false)
    expect(isExclusiveTier('t2')).toBe(false)
    expect(isExclusiveTier('none')).toBe(false)
  })

  it('defaults normal gear to the hero faction and preserves an override', () => {
    const created = applyGearTierChange(undefined, 'weapon', 't1', 'Wilder')

    expect(created).toMatchObject({
      slot: 'weapon',
      tier: 't1',
      faction: 'Wilder',
      exclusive: false,
      resonant: false,
    })

    const overridden = { ...created!, faction: 'Mauler' as const }
    expect(applyGearTierChange(overridden, 'weapon', 't2', 'Wilder')?.faction).toBe('Mauler')
  })

  it('clears faction on exclusive tiers and restores it when unchecked', () => {
    const exclusive = applyGearTierChange(undefined, 'weapon', 't3', 'Wilder')

    expect(exclusive).toMatchObject({ tier: 't3', exclusive: true, faction: undefined })

    const normal = applyGearExclusiveChange(exclusive!, false, 'Wilder')
    expect(normal).toMatchObject({ exclusive: false, faction: 'Wilder' })
  })

  it('locks resonant faction at T1/T2 and drops it from T3', () => {
    const t2 = applyGearTierChange(undefined, 'weapon', 't2', 'Wilder')
    const resonant = applyGearResonantChange(t2!, true, 'Wilder')

    expect(getGearFactionDisplay(resonant, 'Wilder')).toEqual({
      kind: 'same',
      faction: 'Wilder',
    })

    const t3 = applyGearTierChange(resonant, 'weapon', 't3', 'Wilder')
    expect(t3).toMatchObject({ tier: 't3', resonant: true, exclusive: true, faction: undefined })
    expect(getGearFactionDisplay(t3, 'Wilder')).toEqual({ kind: 'none' })
  })

  it('normalizes legacy pieces on save', () => {
    const legacy = { slot: 'weapon', tier: 't4', stars: 2, faction: 'Wilder' } as GearPiece

    expect(normalizeGearPiece(legacy, 'Wilder')).toMatchObject({
      tier: 't4',
      stars: 2,
      faction: undefined,
      exclusive: true,
      resonant: false,
    })
  })
})
