import type { Ascension, HeroProgress } from '@/types'

export const CDN_BASE = 'https://cdn.jsdelivr.net/gh/afk-mine/cdn@main'

export const ASCENSION_CDN: Record<Ascension, string> = {
  common: 'c',
  rare: 'r',
  'rare+': 'rp',
  elite: 'e',
  'elite+': 'ep',
  legendary: 'l',
  'legendary+': 'lp',
  mythic: 'm',
  'mythic+': 'mp',
  ascended: 'a',
  ascended1: 'a1',
  ascended2: 'a2',
  ascended3: 'a3',
  ascended4: 'a4',
  ascended5: 'a5',
}

export function normalizeSignatureItem(value: number): 0 | 10 | 20 | 30 {
  if (value >= 30) return 30
  if (value >= 20) return 20
  if (value >= 10) return 10
  return 0
}

export function normalizeFurniture(value: number): 0 | 3 | 9 | 36 {
  if (value >= 36) return 36
  if (value >= 9) return 9
  if (value >= 3) return 3
  return 0
}

export function normalizeEngraving(value: number): 0 | 30 | 60 | 80 {
  if (value >= 80) return 80
  if (value >= 60) return 60
  if (value >= 30) return 30
  return 0
}

interface FramedIconInput {
  heroId: string
  ascension: Ascension
  signatureItem: number
  furniture: number
  engraving: number
}

export function framedHeroIconUrl({
  heroId,
  ascension,
  signatureItem,
  furniture,
  engraving,
}: FramedIconInput): string {
  const parts = [`${heroId}_${ASCENSION_CDN[ascension]}`]
  const si = normalizeSignatureItem(signatureItem)
  const furnitureLevel = normalizeFurniture(furniture)
  const engravingLevel = normalizeEngraving(engraving)

  if (si > 0) parts.push(`si${si}`)
  if (furnitureLevel > 0) parts.push(`f${furnitureLevel}`)
  if (engravingLevel > 0) parts.push(`e${engravingLevel}`)

  return `${CDN_BASE}/framed_unit_icon/${parts.join('_')}_2x.webp`
}

export function heroIconUrl(heroId: string): string {
  return `${CDN_BASE}/unit_icon_by_id/${heroId}.webp`
}

export function framedIconUrlForProgress(heroId: string, progress: HeroProgress): string {
  return framedHeroIconUrl({
    heroId,
    ascension: progress.ascension,
    signatureItem: progress.signatureItem,
    furniture: progress.furniture,
    engraving: progress.engraving,
  })
}
