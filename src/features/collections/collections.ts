import type { HeroClass } from '@/types'

export interface CollectionDefinition {
  id: string
  name: string
  skillName: string
  class: HeroClass
  unlockHero?: string
  effect?: string
}

export const collections: CollectionDefinition[] = [
  {
    id: 'temporal-cover',
    name: 'Temporal Cover',
    skillName: 'Temporal Deceit',
    class: 'Warrior',
  },
  {
    id: 'shadow-dancer',
    name: 'Shadow Dancer',
    skillName: 'Clashing Waves',
    class: 'Warrior',
  },
  {
    id: 'infused-mind-core',
    name: 'Infused Mind Core',
    skillName: 'Surging Infusion',
    class: 'Warrior',
  },
  {
    id: 'reapers-talon',
    name: "Reaper's Talon",
    skillName: 'Terror Chain',
    class: 'Warrior',
  },
  {
    id: 'wayfinders-mirror',
    name: "Wayfinder's Mirror",
    skillName: 'Maritime Rating',
    class: 'Warrior',
  },
  {
    id: 'timeline-watch',
    name: 'Timeline Watch',
    skillName: 'Time Control',
    class: 'Tank',
  },
  {
    id: 'spell-bondage',
    name: 'Spell Bondage',
    skillName: 'Soul Suction',
    class: 'Tank',
  },
  {
    id: 'horn-of-dominion',
    name: 'Horn of Dominion',
    skillName: 'Battlecry Resounds',
    class: 'Tank',
  },
  {
    id: 'sinners-rose',
    name: "Sinner's Rose",
    skillName: 'Thorny Mark',
    class: 'Tank',
  },
  {
    id: 'wild-spirit-pact',
    name: 'Wild Spirit Pact',
    skillName: 'Bestial Ward',
    class: 'Tank',
  },
  {
    id: 'judgment-armor',
    name: 'Judgment Armor',
    skillName: 'Divine Sanction',
    class: 'Ranger',
  },
  {
    id: 'sandstorm-fangs',
    name: 'Sandstorm Fangs',
    skillName: 'Boiling Berserker',
    class: 'Ranger',
  },
  {
    id: 'shadowflow-blade',
    name: 'Shadowflow Blade',
    skillName: 'Blade Waltz',
    class: 'Ranger',
  },
  {
    id: 'demon-sealer',
    name: 'Demon Sealer',
    skillName: 'Banishing Zone',
    class: 'Ranger',
  },
  {
    id: 'captive-wings',
    name: 'Captive Wings',
    skillName: 'Beguiling Whispers',
    class: 'Mage',
  },
  {
    id: 'oculus-diabolus',
    name: 'Oculus Diabolus',
    skillName: 'Dark Portal',
    class: 'Mage',
  },
  {
    id: 'stormwraths-lull',
    name: "Stormwrath's Lull",
    skillName: 'Stormy Retribution',
    class: 'Mage',
  },
  {
    id: 'crescent-wheel',
    name: 'Crescent Wheel',
    skillName: 'Lunar Guardian',
    class: 'Mage',
  },
  {
    id: 'traders-vault',
    name: "Trader's Vault",
    skillName: 'Strategic Supplies',
    class: 'Support',
  },
  {
    id: 'luminous-flight',
    name: 'Luminous Flight',
    skillName: 'Dream Hopper',
    class: 'Support',
  },
  {
    id: 'bounty-hunters-decree',
    name: "Bounty Hunter's Decree",
    skillName: 'Burning Target',
    class: 'Support',
  },
  {
    id: 'ashen-tide-relic',
    name: 'Ashen Tide Relic',
    skillName: 'Forsworn Tide',
    class: 'Support',
  },
  {
    id: 'cinder-obsidian',
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
