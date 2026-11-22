import { describe, expect, it } from 'vitest'
import { en } from './en'
import { es } from './es'

function collectKeys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix]

  return Object.entries(value).flatMap(([key, child]) =>
    collectKeys(child, prefix ? `${prefix}.${key}` : key),
  )
}

describe('translations', () => {
  it('keeps English and Spanish keys in sync', () => {
    expect(collectKeys(es).sort()).toEqual(collectKeys(en).sort())
  })

  it('does not contain empty strings', () => {
    const emptyKeys = collectKeys(en).filter((key) => {
      const value = key.split('.').reduce<unknown>((current, part) => {
        if (typeof current !== 'object' || current === null) return undefined
        return (current as Record<string, unknown>)[part]
      }, en)

      return typeof value === 'string' && value.trim().length === 0
    })

    expect(emptyKeys).toEqual([])
  })
})
