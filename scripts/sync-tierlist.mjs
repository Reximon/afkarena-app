import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const SOURCE = 'https://www.afk.global/afk-arena/tier-list'
const OUTPUT = fileURLToPath(new URL('../src/data/tierlist.json', import.meta.url))
const CATALOG = fileURLToPath(new URL('../src/data/heroes.json', import.meta.url))

const response = await fetch(SOURCE, { headers: { 'user-agent': 'Mozilla/5.0' } })

if (!response.ok) {
  throw new Error(`Could not fetch the tier list: ${response.status} ${response.statusText}`)
}

const html = await response.text()

function decodeFlightPayload(source) {
  const marker = 'self.__next_f.push([1,'
  const chunks = []
  let index = 0

  while (true) {
    const start = source.indexOf(marker, index)
    if (start === -1) break

    const literalStart = start + marker.length
    let cursor = literalStart + 1

    while (cursor < source.length) {
      if (source[cursor] === '\\') {
        cursor += 2
        continue
      }
      if (source[cursor] === '"') break
      cursor += 1
    }

    chunks.push(JSON.parse(source.slice(literalStart, cursor + 1)))
    index = cursor + 1
  }

  if (chunks.length === 0) {
    throw new Error('Could not find the Next.js flight payload in the tier list page')
  }

  return chunks.join('')
}

function readJsonValue(source, start) {
  const open = source[start]
  const close = open === '{' ? '}' : ']'
  let depth = 0
  let cursor = start

  while (cursor < source.length) {
    const char = source[cursor]

    if (char === '"') {
      cursor += 1
      while (cursor < source.length) {
        if (source[cursor] === '\\') {
          cursor += 2
          continue
        }
        if (source[cursor] === '"') break
        cursor += 1
      }
    } else if (char === open) {
      depth += 1
    } else if (char === close) {
      depth -= 1
      if (depth === 0) return JSON.parse(source.slice(start, cursor + 1))
    }

    cursor += 1
  }

  throw new Error(`Unterminated JSON value at offset ${start}`)
}

function readEmbeddedObject(payload, key, openChar) {
  const keyAt = payload.indexOf(`"${key}":`)
  if (keyAt === -1) throw new Error(`Could not find "${key}" in the tier list payload`)
  const start = payload.indexOf(openChar, keyAt)
  return readJsonValue(payload, start)
}

const payload = decodeFlightPayload(html)
const characters = readEmbeddedObject(payload, 'heroes', '{')
const tierLists = readEmbeddedObject(payload, 'tierLists', '[')

const catalog = JSON.parse(await readFile(CATALOG, 'utf8'))
const catalogByName = new Map()
const catalogByDisplayName = new Map(catalog.heroes.map((hero) => [hero.displayName, hero]))

for (const hero of catalog.heroes) {
  const entries = catalogByName.get(hero.name) ?? []
  entries.push(hero)
  catalogByName.set(hero.name, entries)
}

function resolveCatalogHero(character) {
  const exact = catalogByDisplayName.get(character.name)
  if (exact) return exact

  const name = character.name.replace(/^Awakened /, '')
  const candidates = catalogByName.get(name) ?? []
  const awakened = candidates.filter((hero) => hero.isAwakened)
  const regular = candidates.filter((hero) => !hero.isAwakened)

  if (character.name.startsWith('Awakened ') && awakened.length === 1) return awakened[0]
  if (regular.length === 1) return regular[0]

  if (character.faction) {
    const faction = character.faction[0] + character.faction.slice(1).toLowerCase()
    const byFaction = regular.find((hero) => hero.faction === faction)
    if (byFaction) return byFaction
  }

  if (awakened.length === 1) return awakened[0]
  return undefined
}

function groupTiers(list) {
  const tiers = []

  for (const entry of list.entries) {
    const character = characters[entry.characterId]
    if (!character) continue

    const hero = resolveCatalogHero(character)
    if (!hero) {
      unresolved.add(character.name)
      continue
    }

    let tier = tiers.find((item) => item.tier === entry.tier)
    if (!tier) {
      tier = { tier: entry.tier, heroIds: [] }
      tiers.push(tier)
    }
    tier.heroIds.push(hero.id)
  }

  return tiers
}

const unresolved = new Set()

const updatedMatch = html.match(/<time dateTime="(\d{4}-\d{2}-\d{2})/)
const updatedAt = updatedMatch ? updatedMatch[1] : null

const lists = tierLists.map((list) => ({
  slug: list.slug,
  name: list.name.replace(/^AFK Arena /, '').replace(/ Tier List$/, ''),
  category: list.category,
  tiers: groupTiers(list),
}))

const overall = lists.find((list) => list.slug === 'afk-arena-overall')
const count = new Set(overall?.tiers.flatMap((tier) => tier.heroIds)).size

const tierList = {
  game: 'afk-arena-classic',
  source: SOURCE,
  updatedAt,
  count,
  lists,
}

await mkdir(dirname(OUTPUT), { recursive: true })
await writeFile(OUTPUT, `${JSON.stringify(tierList, null, 2)}\n`, 'utf8')

console.log(
  `Wrote ${lists.length} tier lists (${count} heroes, updated ${updatedAt ?? 'unknown'}) to ${OUTPUT}`,
)

if (unresolved.size > 0) {
  console.warn(`Heroes without a catalog match (skipped): ${[...unresolved].join(', ')}`)
}
