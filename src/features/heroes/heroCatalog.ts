import catalogJson from '@/data/heroes.json'
import heroClassesJson from '@/data/hero-classes.json'
import {
  FACTIONS,
  type Faction,
  type HeroCatalogEntry,
  type HeroCatalogFile,
  type HeroClass,
  type HeroClassFile,
} from '@/types'

const catalog = catalogJson as HeroCatalogFile
const heroClasses = heroClassesJson as HeroClassFile

export const heroCatalog: HeroCatalogEntry[] = catalog.heroes.map((hero) => ({
  ...hero,
  type: hero.class,
  class: heroClasses.classes[hero.id],
}))
export const heroCatalogCount = catalog.count
export const heroCatalogGame = catalog.game

export const heroCatalogById = new Map(heroCatalog.map((hero) => [hero.id, hero]))
export const heroCatalogByName = new Map(heroCatalog.map((hero) => [hero.displayName, hero]))

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

export function getHeroCatalogEntryByName(displayName: string): HeroCatalogEntry | undefined {
  return heroCatalogByName.get(displayName)
}

export function getFactionColor(faction: Faction): string {
  return FACTION_COLORS[faction]
}

export function getHeroClassKey(hero: HeroCatalogEntry): `heroClass.${HeroClass | 'Unknown'}` {
  return hero.class ? `heroClass.${hero.class}` : 'heroClass.Unknown'
}

export interface LinkableHeroGroup {
  faction: Faction
  heroes: HeroCatalogEntry[]
}

export function getLinkableHeroGroups(ownedHeroIds: ReadonlySet<string>): LinkableHeroGroup[] {
  return FACTIONS.filter((faction) => faction !== 'Dimensional')
    .map((faction) => ({
      faction,
      heroes: heroCatalog
        .filter((hero) => hero.faction === faction && ownedHeroIds.has(hero.id))
        .sort((a, b) => a.displayName.localeCompare(b.displayName)),
    }))
    .filter((group) => group.heroes.length > 0)
}
