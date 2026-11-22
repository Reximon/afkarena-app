import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const SOURCE = 'https://www.afk.global/afk-arena/characters'
const FALLBACK_SOURCE = 'https://gacha-data.com/afk-arena/characters/'
const HEROES_INPUT = fileURLToPath(new URL('../src/data/heroes.json', import.meta.url))
const OUTPUT = fileURLToPath(new URL('../src/data/hero-classes.json', import.meta.url))

const CLASS_NAMES = {
  WARRIOR: 'Warrior',
  TANK: 'Tank',
  RANGER: 'Ranger',
  MAGE: 'Mage',
  SUPPORT: 'Support',
}

const FACTION_NAMES = {
  LIGHTBEARER: 'Lightbearer',
  MAULER: 'Mauler',
  WILDER: 'Wilder',
  GRAVEBORN: 'Graveborn',
  CELESTIAL: 'Celestial',
  HYPOGEAN: 'Hypogean',
  DIMENSIONAL: 'Dimensional',
  DRACONIS: 'Draconis',
}

function normalize(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .trim()
}

const response = await fetch(SOURCE)

if (!response.ok) {
  throw new Error(`Could not fetch the hero classes: ${response.status} ${response.statusText}`)
}

const html = await response.text()
const unescaped = html
  .replace(/\\"/g, '"')
  .replace(/\\u0026/g, '&')
  .replace(/\\u0027/g, "'")

const matches =
  unescaped.match(
    /\{"id":"[^"]+","name":"[^"]*","title":"[^"]*","slug":"[^"]+","faction":"[^"]+","class":"[^"]+","rarity":"[^"]+","mainRole":"[^"]*","roles":\[[^\]]*\]/g,
  ) ?? []

const remoteHeroes = matches
  .map((match) => JSON.parse(`${match}}`))
  .filter((hero) => CLASS_NAMES[hero.class])

const remoteByName = new Map()

for (const hero of remoteHeroes) {
  const normalizedName = normalize(hero.name)
  const faction = FACTION_NAMES[hero.faction] ?? hero.faction
  const key = `${normalizedName}:${faction}`
  remoteByName.set(key, hero)
}

const fallbackResponse = await fetch(FALLBACK_SOURCE)

if (!fallbackResponse.ok) {
  throw new Error(
    `Could not fetch the fallback hero classes: ${fallbackResponse.status} ${fallbackResponse.statusText}`,
  )
}

const fallbackHtml = await fallbackResponse.text()
const fallbackById = new Map()
const fallbackPattern =
  /<a class="ccard[^"]*" href="\/afk-arena\/characters\/(\d+)\/"[^>]*data-fi1="([^"]+)"/g

for (const match of fallbackHtml.matchAll(fallbackPattern)) {
  fallbackById.set(match[1], match[2])
}

const catalog = JSON.parse(await readFile(HEROES_INPUT, 'utf8'))
const classes = {}
const unmatched = []

for (const hero of catalog.heroes) {
  const candidates = [hero.displayName, hero.name]

  for (const candidate of candidates) {
    const key = `${normalize(candidate)}:${hero.faction}`
    const remote = remoteByName.get(key)

    if (remote) {
      classes[hero.id] = CLASS_NAMES[remote.class]
      break
    }
  }

  if (!classes[hero.id]) {
    const fallback = fallbackById.get(hero.id)
    if (fallback) classes[hero.id] = fallback
  }

  if (!classes[hero.id]) {
    unmatched.push({
      id: hero.id,
      name: hero.displayName,
      faction: hero.faction,
      type: hero.class,
    })
  }
}

const output = {
  game: 'afk-arena-classic',
  source: SOURCE,
  fallbackSource: FALLBACK_SOURCE,
  count: Object.keys(classes).length,
  classes,
  unmatched,
}

await mkdir(dirname(OUTPUT), { recursive: true })
await writeFile(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8')

console.log(
  `Mapped ${output.count}/${catalog.heroes.length} heroes to real classes (${unmatched.length} unmatched).`,
)

if (unmatched.length > 0) {
  console.log(JSON.stringify(unmatched, null, 2))
}
