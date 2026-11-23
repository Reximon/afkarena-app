import { describe, expect, it } from 'vitest'
import { getGearIconSrc } from './gearIcons'

describe('getGearIconSrc', () => {
  it('maps the official icons per hero type, tier and slot', () => {
    expect(getGearIconSrc('t5', 'helmet', 'Warrior')).toBe('/images/afk-arena/game/gear/162.webp')
    expect(getGearIconSrc('mythic', 'weapon', 'Ranger')).toBe('/images/afk-arena/game/gear/98.webp')
    expect(getGearIconSrc('t3', 'boots', 'Mage')).toBe('/images/afk-arena/game/gear/142.webp')
  })

  it('returns undefined without gear or hero type', () => {
    expect(getGearIconSrc('none', 'weapon', 'Warrior')).toBeUndefined()
    expect(getGearIconSrc('t1', 'weapon', undefined)).toBeUndefined()
  })
})
