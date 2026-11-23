import { describe, expect, it } from 'vitest'
import { createDefaultHeroProgress } from '@/features/persistence/defaults'
import {
  normalizeLinkedAscensions,
  propagateAscension,
  resolveLinkedAscension,
  withLinkedAscension,
} from './linkedAscension'

const source = createDefaultHeroProgress('182', { ascension: 'ascended' })
const linked = createDefaultHeroProgress('98', { ascension: 'elite', linkedHeroId: '182' })

describe('linkedAscension', () => {
  it('resolves the ascension of the linked hero', () => {
    const heroes = { '182': source, '98': linked }

    expect(resolveLinkedAscension(heroes, linked)).toBe('ascended')
    expect(resolveLinkedAscension(heroes, source)).toBeUndefined()
    expect(resolveLinkedAscension(heroes, { ...linked, linkedHeroId: 'missing' })).toBeUndefined()
    expect(resolveLinkedAscension(heroes, { ...linked, linkedHeroId: '98' })).toBeUndefined()
  })

  it('copies the linked ascension only when it differs', () => {
    const heroes = { '182': source, '98': linked }
    const synced = { ...linked, ascension: 'ascended' as const }

    expect(withLinkedAscension(linked, heroes).ascension).toBe('ascended')
    expect(withLinkedAscension(synced, heroes)).toBe(synced)
  })

  it('propagates a new ascension to every linked hero', () => {
    const heroes = {
      '182': source,
      '98': linked,
      '99': createDefaultHeroProgress('99', { linkedHeroId: '182' }),
    }
    const next = propagateAscension(heroes, '182', 'legendary', 'now')

    expect(next['182']).toBe(source)
    expect(next['98']).toMatchObject({ ascension: 'legendary', updatedAt: 'now' })
    expect(next['99']).toMatchObject({ ascension: 'legendary', updatedAt: 'now' })

    const synced = {
      '182': source,
      '98': createDefaultHeroProgress('98', { linkedHeroId: '182', ascension: 'ascended' }),
    }
    expect(propagateAscension(synced, '182', 'ascended', 'now')).toBe(synced)
  })

  it('normalizes divergent linked ascensions', () => {
    const heroes = { '182': source, '98': linked }
    const normalized = normalizeLinkedAscensions(heroes)

    expect(normalized['98'].ascension).toBe('ascended')
    expect(normalized['98'].updatedAt).toBe(linked.updatedAt)
    expect(normalizeLinkedAscensions(normalized)).toBe(normalized)
  })
})
