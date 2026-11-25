import { describe, expect, it } from 'vitest'
import { getHeroLevel } from './heroLevel'

describe('getHeroLevel', () => {
  it('uses the stored level when the hero is not in the crystal', () => {
    expect(getHeroLevel({ level: 240, inCrystal: false }, 350)).toBe(240)
  })

  it('uses the profile crystal level for crystal heroes', () => {
    expect(getHeroLevel({ level: 240, inCrystal: true }, 350)).toBe(350)
  })

  it('falls back to the stored level while the crystal level is unset', () => {
    expect(getHeroLevel({ level: 240, inCrystal: true }, 0)).toBe(240)
  })
})
