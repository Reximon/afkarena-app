import type { Ascension, HeroProgress } from '@/types'

type HeroRecord = Record<string, HeroProgress>

export function resolveLinkedAscension(
  heroes: HeroRecord,
  hero: HeroProgress,
): Ascension | undefined {
  if (!hero.linkedHeroId || hero.linkedHeroId === hero.heroId) return undefined
  return heroes[hero.linkedHeroId]?.ascension
}

export function withLinkedAscension(hero: HeroProgress, heroes: HeroRecord): HeroProgress {
  const ascension = resolveLinkedAscension(heroes, hero)
  return ascension && ascension !== hero.ascension ? { ...hero, ascension } : hero
}

export function propagateAscension(
  heroes: HeroRecord,
  heroId: string,
  ascension: Ascension,
  updatedAt: string,
): HeroRecord {
  let changed = false
  const next: HeroRecord = { ...heroes }

  for (const [id, hero] of Object.entries(heroes)) {
    if (id === heroId || hero.linkedHeroId !== heroId || hero.ascension === ascension) continue
    next[id] = { ...hero, ascension, updatedAt }
    changed = true
  }

  return changed ? next : heroes
}

export function normalizeLinkedAscensions(heroes: HeroRecord): HeroRecord {
  let changed = false
  const next: HeroRecord = {}

  for (const [id, hero] of Object.entries(heroes)) {
    const ascension = resolveLinkedAscension(heroes, hero)

    if (ascension && ascension !== hero.ascension) {
      next[id] = { ...hero, ascension }
      changed = true
    } else {
      next[id] = hero
    }
  }

  return changed ? next : heroes
}
