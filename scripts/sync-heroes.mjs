import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const SOURCE = 'https://raw.githubusercontent.com/afk-mine/cdn/main/unit.json'
const OUTPUT = fileURLToPath(new URL('../src/data/heroes.json', import.meta.url))

const FACTIONS = new Set([
  'Lightbearer',
  'Mauler',
  'Wilder',
  'Graveborn',
  'Celestial',
  'Hypogean',
  'Dimensional',
  'Draconis',
])

const CLASSES = new Set(['Warrior', 'Ranger', 'Mage'])
const RARITIES = new Set(['common', 'rare', 'elite', 'legendary'])

const response = await fetch(SOURCE)

if (!response.ok) {
  throw new Error(`Could not fetch the hero catalog: ${response.status} ${response.statusText}`)
}

const units = await response.json()

const heroes = Object.values(units)
  .filter((unit) => {
    return (
      Number(unit.id) < 1000 &&
      Boolean(unit.names?.en) &&
      FACTIONS.has(unit.faction) &&
      CLASSES.has(unit.class) &&
      RARITIES.has(unit.rarity)
    )
  })
  .map((unit) => ({
    id: String(unit.id),
    name: unit.names.en,
    faction: unit.faction,
    class: unit.class,
    rarity: unit.rarity,
    isAwakened: Boolean(unit.isAwakened),
    roles: [...new Set([unit.mainRole, unit.secondRole].filter(Boolean))],
    skins: (unit.skins ?? []).map((skin) => ({ id: skin.id, name: skin.name })),
  }))

const prepared = heroes.map((hero) => ({
  ...hero,
  displayName: hero.isAwakened ? `Awakened ${hero.name}` : hero.name,
}))

const displayNameCounts = prepared.reduce((counts, hero) => {
  counts.set(hero.displayName, (counts.get(hero.displayName) ?? 0) + 1)
  return counts
}, new Map())

const normalized = prepared
  .map((hero) => {
    const isDuplicateName = (displayNameCounts.get(hero.displayName) ?? 0) > 1

    return {
      ...hero,
      displayName: isDuplicateName ? `${hero.displayName} (${hero.faction})` : hero.displayName,
    }
  })
  .sort((a, b) => a.displayName.localeCompare(b.displayName))

const catalog = {
  game: 'afk-arena-classic',
  source: SOURCE,
  count: normalized.length,
  heroes: normalized,
}

await mkdir(dirname(OUTPUT), { recursive: true })
await writeFile(OUTPUT, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8')

console.log(`Wrote ${normalized.length} AFK Arena Classic heroes to ${OUTPUT}`)
