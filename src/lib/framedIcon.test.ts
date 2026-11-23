import { describe, expect, it } from 'vitest'
import {
  framedHeroIconUrl,
  hasFoilEffect,
  heroIconUrl,
  normalizeEngraving,
  normalizeFurniture,
  normalizeSignatureItem,
} from './framedIcon'

describe('framedHeroIconUrl', () => {
  it('builds a fully invested framed icon', () => {
    expect(
      framedHeroIconUrl({
        heroId: '9',
        ascension: 'ascended5',
        signatureItem: 30,
        furniture: 9,
        engraving: 60,
      }),
    ).toBe(
      'https://cdn.jsdelivr.net/gh/afk-mine/cdn@main/framed_unit_icon/9_a5_si30_f9_e60_2x.webp',
    )
  })

  it('omits empty investments', () => {
    expect(
      framedHeroIconUrl({
        heroId: '9',
        ascension: 'elite',
        signatureItem: 0,
        furniture: 0,
        engraving: 0,
      }),
    ).toBe('https://cdn.jsdelivr.net/gh/afk-mine/cdn@main/framed_unit_icon/9_e_2x.webp')
  })

  it('maps the supported investment breakpoints', () => {
    expect(
      framedHeroIconUrl({
        heroId: '178',
        ascension: 'ascended2',
        signatureItem: 40,
        furniture: 36,
        engraving: 80,
      }),
    ).toBe(
      'https://cdn.jsdelivr.net/gh/afk-mine/cdn@main/framed_unit_icon/178_a2_si30_f36_e80_2x.webp',
    )
  })
})

describe('investment normalization', () => {
  it('normalizes signature items to the CDN breakpoints', () => {
    expect(normalizeSignatureItem(0)).toBe(0)
    expect(normalizeSignatureItem(10)).toBe(10)
    expect(normalizeSignatureItem(20)).toBe(20)
    expect(normalizeSignatureItem(30)).toBe(30)
    expect(normalizeSignatureItem(40)).toBe(30)
  })

  it('normalizes furniture and engraving', () => {
    expect(normalizeFurniture(0)).toBe(0)
    expect(normalizeFurniture(3)).toBe(3)
    expect(normalizeFurniture(9)).toBe(9)
    expect(normalizeFurniture(36)).toBe(36)
    expect(normalizeEngraving(0)).toBe(0)
    expect(normalizeEngraving(30)).toBe(30)
    expect(normalizeEngraving(60)).toBe(60)
    expect(normalizeEngraving(80)).toBe(80)
  })
})

describe('heroIconUrl', () => {
  it('builds the unframed fallback URL', () => {
    expect(heroIconUrl('9')).toBe(
      'https://cdn.jsdelivr.net/gh/afk-mine/cdn@main/unit_icon_by_id/9.webp',
    )
  })
})

describe('hasFoilEffect', () => {
  it('unlocks at 60 engraving and 9 furniture', () => {
    expect(hasFoilEffect({ engraving: 60, furniture: 9 })).toBe(true)
    expect(hasFoilEffect({ engraving: 80, furniture: 36 })).toBe(true)
    expect(hasFoilEffect({ engraving: 60, furniture: 3 })).toBe(false)
    expect(hasFoilEffect({ engraving: 30, furniture: 9 })).toBe(false)
  })
})
