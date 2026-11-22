import type { HeroClass } from '@/types'

export type ArtifactKind = 'dura' | 'class'

export interface ArtifactDefinition {
  id: string
  name: string
  effect: string
  source: string
  kind: ArtifactKind
  class?: HeroClass
}

export const artifacts: ArtifactDefinition[] = [
  {
    id: 'duras-grace',
    name: "Dura's Grace",
    effect: 'Divine shield when the wearer uses their ultimate.',
    source: "Peaks of Time · Ranhorn's Strife",
    kind: 'dura',
  },
  {
    id: 'duras-eye',
    name: "Dura's Eye",
    effect: 'Haste burst after a critical strike.',
    source: 'Peaks of Time · Secrets of the Forest',
    kind: 'dura',
  },
  {
    id: 'duras-call',
    name: "Dura's Call",
    effect: 'Restores energy every second and shares remaining energy when slain.',
    source: 'Peaks of Time · Rest in Peace',
    kind: 'dura',
  },
  {
    id: 'duras-drape',
    name: "Dura's Drape",
    effect: 'Improves health recovery, defense and magic resistance.',
    source: 'Peaks of Time · The Far Frontier',
    kind: 'dura',
  },
  {
    id: 'duras-blade',
    name: "Dura's Blade",
    effect: 'Attack rating and accuracy ramp up during battle.',
    source: "Peaks of Time · Viper's Marsh",
    kind: 'dura',
  },
  {
    id: 'duras-chalice',
    name: "Dura's Chalice of Vitality",
    effect: 'Restores health over the opening seconds of battle.',
    source: 'Peaks of Time · The Savage Wastes',
    kind: 'dura',
  },
  {
    id: 'duras-conviction',
    name: "Dura's Conviction",
    effect: 'Attack rating when isolated; knockback shockwave at five stars.',
    source: 'Peaks of Time · The Solar Plane',
    kind: 'dura',
  },
  {
    id: 'chaos-bringer',
    name: 'Chaos Bringer',
    effect: 'Hurls a fiery axe that damages and stuns nearby enemies.',
    source: 'Trials of God · Fields of Stone',
    kind: 'class',
    class: 'Warrior',
  },
  {
    id: 'carnage',
    name: 'Carnage',
    effect: 'Attacks carve through enemies and amplify the wearer’s damage.',
    source: "Trials of God · The Forest's Edge",
    kind: 'class',
    class: 'Warrior',
  },
  {
    id: 'pauldron-of-burning-fury',
    name: 'Pauldron of Burning Fury',
    effect: 'Builds fury when struck, then unleashes a retaliatory explosion.',
    source: 'Trials of God · The Hazy Timberland',
    kind: 'class',
    class: 'Warrior',
  },
  {
    id: 'the-barricade',
    name: 'The Barricade',
    effect: 'Raises a shield that protects the wearer and nearby allies.',
    source: 'Trials of God · The Depths of Time',
    kind: 'class',
    class: 'Tank',
  },
  {
    id: 'waistband-of-resilience',
    name: 'Waistband of Resilience',
    effect: 'Grants damage reduction and restores health when hit.',
    source: 'Trials of God · The Frosted Expanse',
    kind: 'class',
    class: 'Tank',
  },
  {
    id: 'lifes-limit',
    name: "Life's Limit",
    effect: 'Survives lethal damage once and gains a temporary shield.',
    source: 'Trials of God · Track of the Sands',
    kind: 'class',
    class: 'Tank',
  },
  {
    id: 'shroud-of-verdure',
    name: 'Shroud of Verdure',
    effect: 'Boosts evasion and attack speed while health remains high.',
    source: 'Trials of God · Fallen Souls',
    kind: 'class',
    class: 'Ranger',
  },
  {
    id: 'verdant-longbow',
    name: 'Verdant Longbow',
    effect: 'Ranged attacks pierce and apply a stacking bleed.',
    source: 'Trials of God · The Depths of Time II',
    kind: 'class',
    class: 'Ranger',
  },
  {
    id: 'dual-divinity',
    name: 'Dual Divinity',
    effect: 'Alternates between offensive and defensive bonuses during battle.',
    source: 'Trials of God · Black Woods',
    kind: 'class',
    class: 'Ranger',
  },
  {
    id: 'windbinder',
    name: 'Windbinder',
    effect: 'Increases energy regeneration and ability haste.',
    source: 'Trials of God · Highburn Stronghold',
    kind: 'class',
    class: 'Mage',
  },
  {
    id: 'warden-of-the-arcane',
    name: 'Warden of the Arcane',
    effect: 'Summons an arcane warden that attacks and disrupts enemies.',
    source: 'Trials of God · Frozen Ground',
    kind: 'class',
    class: 'Mage',
  },
  {
    id: 'winged-warden',
    name: 'Winged Warden',
    effect: 'Grants a flying guardian that shields the wearer and slows enemies.',
    source: 'Trials of God · The Echoing Valley',
    kind: 'class',
    class: 'Mage',
  },
  {
    id: 'tidebearer',
    name: 'Tidebearer',
    effect: 'Healing waves restore allies and cleanse debuffs.',
    source: 'Trials of God · The Howling Wastes',
    kind: 'class',
    class: 'Support',
  },
  {
    id: 'seraphic-tide',
    name: 'Seraphic Tide',
    effect: 'Periodically heals the most wounded ally and grants energy.',
    source: 'Trials of God · The Frozen Hinterland',
    kind: 'class',
    class: 'Support',
  },
  {
    id: 'the-oceanic-strings',
    name: 'The Oceanic Strings',
    effect: 'Plays a soothing melody that buffs allies and weakens enemies.',
    source: 'Trials of God · Windfall Gorge',
    kind: 'class',
    class: 'Support',
  },
]

export const artifactById = new Map<string, ArtifactDefinition>(
  artifacts.map((artifact) => [artifact.id, artifact]),
)

export function getArtifact(id: string | undefined): ArtifactDefinition | undefined {
  return id ? artifactById.get(id) : undefined
}

export function getArtifactName(id: string | undefined): string | undefined {
  return getArtifact(id)?.name
}

export function isArtifactEligible(
  heroClass: HeroClass | undefined,
  artifact: ArtifactDefinition,
): boolean {
  if (artifact.kind === 'dura') return true
  return Boolean(heroClass && artifact.class === heroClass)
}
