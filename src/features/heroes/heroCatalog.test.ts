import { describe, expect, it } from 'vitest'
import { heroCatalog, heroCatalogById, heroCatalogCount, heroCatalogGame } from './heroCatalog'

describe('hero catalog', () => {
  it('loads the AFK Arena Classic catalog', () => {
    expect(heroCatalogGame).toBe('afk-arena-classic')
    expect(heroCatalogCount).toBe(255)
    expect(heroCatalog).toHaveLength(255)
  })

  it('contains known classic heroes', () => {
    expect(heroCatalogById.get('9')?.displayName).toBe('Brutus')
    expect(heroCatalogById.get('52')?.displayName).toBe('Rowan')
    expect(heroCatalogById.get('98')?.displayName).toBe('Ainz Ooal Gown')
  })

  it('keeps awakened heroes distinct from their base versions', () => {
    const brutes = heroCatalog.filter((hero) => hero.name === 'Brutus')

    expect(brutes).toHaveLength(2)
    expect(brutes.map((hero) => hero.displayName)).toContain('Awakened Brutus')
    expect(brutes.find((hero) => hero.displayName === 'Awakened Brutus')?.isAwakened).toBe(true)
  })

  it('does not include pets or bosses', () => {
    expect(heroCatalog.some((hero) => Number(hero.id) >= 1000)).toBe(false)
    expect(heroCatalog.some((hero) => hero.displayName.includes('Wrizz'))).toBe(false)
  })
})
