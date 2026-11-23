import type { HeroClass } from '@/types'

export interface CollectionDefinition {
  id: string
  name: string
  image: string
  skillName: string
  class: HeroClass
  unlockHero?: string
  effect?: string
}

export const collections: CollectionDefinition[] = [
  {
    id: 'temporal-cover',
    image: '/images/afk-arena/game/collection/mitama_dt.webp',
    name: 'Temporal Cover',
    skillName: 'Temporal Deceit',
    class: 'Warrior',
  },
  {
    id: 'shadow-dancer',
    image: '/images/afk-arena/game/collection/mitama_lizard.webp',
    name: 'Shadow Dancer',
    skillName: 'Clashing Waves',
    class: 'Warrior',
  },
  {
    id: 'infused-mind-core',
    image: '/images/afk-arena/game/collection/mitama_scimonster.webp',
    name: 'Infused Mind Core',
    skillName: 'Surging Infusion',
    class: 'Warrior',
  },
  {
    id: 'reapers-talon',
    image: '/images/afk-arena/game/collection/mitama_pudge.webp',
    name: "Reaper's Talon",
    skillName: 'Terror Chain',
    class: 'Warrior',
  },
  {
    id: 'wayfinders-mirror',
    image: '/images/afk-arena/game/collection/mitama_admiral.webp',
    name: "Wayfinder's Mirror",
    skillName: 'Maritime Rating',
    class: 'Warrior',
  },
  {
    id: 'timeline-watch',
    image: '/images/afk-arena/game/collection/mitama_timeg.webp',
    name: 'Timeline Watch',
    skillName: 'Time Control',
    class: 'Tank',
  },
  {
    id: 'spell-bondage',
    image: '/images/afk-arena/game/collection/mitama_dkid.webp',
    name: 'Spell Bondage',
    skillName: 'Soul Suction',
    class: 'Tank',
  },
  {
    id: 'horn-of-dominion',
    image: '/images/afk-arena/game/collection/mitama_orcleader.webp',
    name: 'Horn of Dominion',
    skillName: 'Battlecry Resounds',
    class: 'Tank',
  },
  {
    id: 'sinners-rose',
    image: '/images/afk-arena/game/collection/mitama_sonia.webp',
    name: "Sinner's Rose",
    skillName: 'Thorny Mark',
    class: 'Tank',
  },
  {
    id: 'wild-spirit-pact',
    image: '/images/afk-arena/game/collection/mitama_bdruid.webp',
    name: 'Wild Spirit Pact',
    skillName: 'Bestial Ward',
    class: 'Tank',
  },
  {
    id: 'judgment-armor',
    image: '/images/afk-arena/game/collection/mitama_goda.webp',
    name: 'Judgment Armor',
    skillName: 'Divine Sanction',
    class: 'Ranger',
  },
  {
    id: 'sandstorm-fangs',
    image: '/images/afk-arena/game/collection/mitama_wolf.webp',
    name: 'Sandstorm Fangs',
    skillName: 'Boiling Berserker',
    class: 'Ranger',
  },
  {
    id: 'shadowflow-blade',
    image: '/images/afk-arena/game/collection/mitama_swordmaster.webp',
    name: 'Shadowflow Blade',
    skillName: 'Blade Waltz',
    class: 'Ranger',
  },
  {
    id: 'demon-sealer',
    image: '/images/afk-arena/game/collection/mitama_nunassassin.webp',
    name: 'Demon Sealer',
    skillName: 'Banishing Zone',
    class: 'Ranger',
  },
  {
    id: 'captive-wings',
    image: '/images/afk-arena/game/collection/mitama_lust.webp',
    name: 'Captive Wings',
    skillName: 'Beguiling Whispers',
    class: 'Mage',
  },
  {
    id: 'oculus-diabolus',
    image: '/images/afk-arena/game/collection/mitama_mystic.webp',
    name: 'Oculus Diabolus',
    skillName: 'Dark Portal',
    class: 'Mage',
  },
  {
    id: 'stormwraths-lull',
    image: '/images/afk-arena/game/collection/mitama_thor.webp',
    name: "Stormwrath's Lull",
    skillName: 'Stormy Retribution',
    class: 'Mage',
  },
  {
    id: 'crescent-wheel',
    image: '/images/afk-arena/game/collection/mitama_selene.webp',
    name: 'Crescent Wheel',
    skillName: 'Lunar Guardian',
    class: 'Mage',
  },
  {
    id: 'traders-vault',
    image: '/images/afk-arena/game/collection/mitama_merchant.webp',
    name: "Trader's Vault",
    skillName: 'Strategic Supplies',
    class: 'Support',
  },
  {
    id: 'luminous-flight',
    image: '/images/afk-arena/game/collection/mitama_puck.webp',
    name: 'Luminous Flight',
    skillName: 'Dream Hopper',
    class: 'Support',
  },
  {
    id: 'bounty-hunters-decree',
    image: '/images/afk-arena/game/collection/mitama_nbh.webp',
    name: "Bounty Hunter's Decree",
    skillName: 'Burning Target',
    class: 'Support',
  },
  {
    id: 'ashen-tide-relic',
    image: '/images/afk-arena/game/collection/mitama_siren.webp',
    name: 'Ashen Tide Relic',
    skillName: 'Forsworn Tide',
    class: 'Support',
  },
  {
    id: 'cinder-obsidian',
    image: '/images/afk-arena/game/collection/mitama_cursecarrier.webp',
    name: 'Cinder Obsidian',
    skillName: 'Scorched Ward',
    class: 'Support',
  },
]

export const collectionById = new Map<string, CollectionDefinition>(
  collections.map((collection) => [collection.id, collection]),
)

export function getCollection(id: string | undefined): CollectionDefinition | undefined {
  return id ? collectionById.get(id) : undefined
}

export function getCollectionName(id: string | undefined): string | undefined {
  return getCollection(id)?.name
}

export function isCollectionEligible(
  heroClass: HeroClass | undefined,
  collection: CollectionDefinition,
): boolean {
  return Boolean(heroClass && collection.class === heroClass)
}

export function getEligibleCollections(heroClass: HeroClass | undefined): CollectionDefinition[] {
  if (!heroClass) return collections
  return collections.filter((collection) => isCollectionEligible(heroClass, collection))
}
