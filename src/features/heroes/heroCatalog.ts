import catalogJson from '@/data/heroes.json'
import type { Faction, HeroCatalogEntry, HeroCatalogFile } from '@/types'

const catalog = catalogJson as HeroCatalogFile

export const heroCatalog = catalog.heroes
export const heroCatalogCount = catalog.count
export const heroCatalogGame = catalog.game

export const heroCatalogById = new Map(heroCatalog.map((hero) => [hero.id, hero]))

export const FACTION_COLORS: Record<Faction, string> = {
  Lightbearer: '#7FB2F0',
  Mauler: '#E0603C',
  Wilder: '#6FBF73',
  Graveborn: '#9B7BD4',
  Celestial: '#E7C873',
  Hypogean: '#C05A8A',
  Dimensional: '#67E8F9',
  Draconis: '#B7E36B',
}

export function getHeroCatalogEntry(heroId: string): HeroCatalogEntry | undefined {
  return heroCatalogById.get(heroId)
}

export function getHeroDisplayName(heroId: string): string {
  return heroCatalogById.get(heroId)?.displayName ?? heroId
}

export function getFactionColor(faction: Faction): string {
  return FACTION_COLORS[faction]
}
