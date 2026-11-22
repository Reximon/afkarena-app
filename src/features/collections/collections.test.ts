import { describe, expect, it } from 'vitest'
import {
  collectionById,
  collections,
  getCollection,
  getCollectionName,
  isCollectionEligible,
} from './collections'

describe('collection catalog', () => {
  it('has unique ids and names', () => {
    expect(new Set(collections.map((collection) => collection.id)).size).toBe(collections.length)
    expect(new Set(collections.map((collection) => collection.name)).size).toBe(collections.length)
    expect(collectionById.size).toBe(collections.length)
  })

  it('contains all 23 collections grouped by real class', () => {
    expect(collections).toHaveLength(23)
    expect(collections.filter((collection) => collection.class === 'Warrior')).toHaveLength(5)
    expect(collections.filter((collection) => collection.class === 'Tank')).toHaveLength(5)
    expect(collections.filter((collection) => collection.class === 'Ranger')).toHaveLength(4)
    expect(collections.filter((collection) => collection.class === 'Mage')).toHaveLength(4)
    expect(collections.filter((collection) => collection.class === 'Support')).toHaveLength(5)
  })

  it('resolves collections and restricts them by hero class', () => {
    const temporalCover = getCollection('temporal-cover')
    const captiveWings = getCollection('captive-wings')

    expect(getCollectionName('temporal-cover')).toBe('Temporal Cover')
    expect(getCollection('missing')).toBeUndefined()
    expect(temporalCover && isCollectionEligible('Warrior', temporalCover)).toBe(true)
    expect(temporalCover && isCollectionEligible('Mage', temporalCover)).toBe(false)
    expect(captiveWings && isCollectionEligible('Mage', captiveWings)).toBe(true)
    expect(captiveWings && isCollectionEligible(undefined, captiveWings)).toBe(false)
  })
})
