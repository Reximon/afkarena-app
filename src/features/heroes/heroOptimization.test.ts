import { describe, expect, it } from 'vitest'
import { createDefaultHeroProgress } from '@/features/persistence/defaults'
import { getHeroOptimization } from './heroOptimization'
import type { GearSlot } from '@/types'

const SLOTS: GearSlot[] = ['weapon', 'helmet', 'chest', 'boots']

function gearSet(tier: 't2' | 't5', stars: 0 | 5) {
  return Object.fromEntries(SLOTS.map((slot) => [slot, { slot, tier, stars }])) as ReturnType<
    typeof createDefaultHeroProgress
  >['gear']
}

describe('getHeroOptimization', () => {
  it('scores a fresh hero as D', () => {
    const hero = createDefaultHeroProgress('214')
    const optimization = getHeroOptimization(hero)

    expect(optimization.grade).toBe('D')
    expect(optimization.score).toBeLessThan(35)
  })

  it('scores an endgame hero as A', () => {
    const hero = createDefaultHeroProgress('214', {
      ascension: 'ascended5',
      signatureItem: 30,
      furniture: 9,
      engraving: 60,
      gear: gearSet('t2', 0),
    })

    expect(getHeroOptimization(hero)).toEqual({ score: 65, grade: 'A' })
  })

  it('scores a fully maxed hero as S+', () => {
    const hero = createDefaultHeroProgress('214', {
      ascension: 'ascended5',
      signatureItem: 40,
      furniture: 36,
      engraving: 80,
      gear: gearSet('t5', 5),
    })

    expect(getHeroOptimization(hero)).toEqual({ score: 100, grade: 'S+' })
  })

  it('rewards gear tier and stars', () => {
    const base = createDefaultHeroProgress('214', { ascension: 'ascended' })
    const geared = createDefaultHeroProgress('214', {
      ascension: 'ascended',
      gear: gearSet('t5', 5),
    })

    expect(getHeroOptimization(geared).score).toBeGreaterThan(getHeroOptimization(base).score)
  })
})
