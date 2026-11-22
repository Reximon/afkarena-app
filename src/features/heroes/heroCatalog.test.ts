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

  it('resolves the five real hero classes', () => {
    expect(heroCatalogById.get('9')?.class).toBe('Tank')
    expect(heroCatalogById.get('52')?.class).toBe('Support')
    expect(heroCatalogById.get('98')?.class).toBe('Mage')
    expect(heroCatalogById.get('182')?.class).toBe('Warrior')
    expect(heroCatalog.some((hero) => hero.class === 'Ranger')).toBe(true)
    expect(heroCatalog.every((hero) => Boolean(hero.class))).toBe(true)
  })

  it('keeps the raw type separate from the real class', () => {
    expect(heroCatalogById.get('9')?.type).toBe('Warrior')
    expect(heroCatalogById.get('52')?.type).toBe('Mage')
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
