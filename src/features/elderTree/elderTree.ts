import astralFocusIcon from '@/assets/elder-tree/blessings/astral-focus.webp'
import astralTideIcon from '@/assets/elder-tree/blessings/astral-tide.webp'
import bloodThirstIcon from '@/assets/elder-tree/blessings/blood-thirst.webp'
import clawbackIcon from '@/assets/elder-tree/blessings/clawback.webp'
import defianceIcon from '@/assets/elder-tree/blessings/defiance.webp'
import impendingDangerIcon from '@/assets/elder-tree/blessings/impending-danger.webp'
import lifeFlashIcon from '@/assets/elder-tree/blessings/life-flash.webp'
import lifeKindleIcon from '@/assets/elder-tree/blessings/life-kindle.webp'
import maimIcon from '@/assets/elder-tree/blessings/maim.webp'
import powerSurgeIcon from '@/assets/elder-tree/blessings/power-surge.webp'
import rapidSurgeIcon from '@/assets/elder-tree/blessings/rapid-surge.webp'
import saviorsGiftIcon from '@/assets/elder-tree/blessings/saviors-gift.webp'
import shatteringForceIcon from '@/assets/elder-tree/blessings/shattering-force.webp'
import shieldOfFortitudeIcon from '@/assets/elder-tree/blessings/shield-of-fortitude.webp'
import sunderingSlamIcon from '@/assets/elder-tree/blessings/sundering-slam.webp'
import type { HeroClass } from '@/types'

export interface ElderTreeBlessing {
  name: string
  icon: string
  unlockLevel: number
  text: string
}

export interface ElderTreeUpgrade {
  levels: readonly [number, number, number]
  boosts: readonly [string, string, string]
}

export interface ElderTreeVirtue {
  class: HeroClass
  name: string
  focus: readonly string[]
  blessings: readonly ElderTreeBlessing[]
  upgrades: readonly ElderTreeUpgrade[]
}

export const elderTreeVirtues: readonly ElderTreeVirtue[] = [
  {
    class: 'Ranger',
    name: "Dura's Celerity",
    focus: ['HP', 'ATK', 'DEF', 'ACC', 'Dodge'],
    blessings: [
      {
        name: 'Impending Danger',
        icon: impendingDangerIcon,
        unlockLevel: 5,
        text: 'When the health of the hero receiving this blessing falls below 50% for the first time, their Dodge will be increased by 80 points and their Haste will be increased by 10 points for 6 seconds.',
      },
      {
        name: 'Maim',
        icon: maimIcon,
        unlockLevel: 15,
        text: 'After dealing damage to an enemy with health lower than 50%, heroes receiving this blessing will deal an additional 140% damage to the enemy which cannot be dodged. Heroes receiving this blessing may only activate its effects once every 3 seconds.',
      },
      {
        name: 'Rapid Surge',
        icon: rapidSurgeIcon,
        unlockLevel: 25,
        text: 'If a hero receiving this blessing deals damage to an enemy 5 seconds prior to the enemy’s death, the blessed hero will instantly recover 4% of their max health and their Haste will be increased by 80 points for 4 seconds.',
      },
    ],
    upgrades: [
      {
        levels: [10, 20, 30],
        boosts: [
          'Dodge increased by 100% for 8 seconds.',
          'Damage increased to 160%.',
          'Haste increased to 110 for 5 seconds.',
        ],
      },
      {
        levels: [35, 40, 45],
        boosts: [
          'Dodge increased by 120% for 10 seconds.',
          'Damage increased to 180%.',
          'Haste increased to 140 for 6 seconds.',
        ],
      },
      {
        levels: [50, 55, 60],
        boosts: [
          'Haste increased by 15 points.',
          'Damage increased to 190%.',
          'Health recovery increased to 6%.',
        ],
      },
      {
        levels: [65, 70, 75],
        boosts: [
          'Haste increased by 20 points.',
          'Damage increased to 200%.',
          'Health recovery increased to 8%.',
        ],
      },
      {
        levels: [80, 85, 90],
        boosts: [
          'Haste increased by 25 points.',
          'Damage increased to 210%.',
          'Health recovery increased to 10%.',
        ],
      },
      {
        levels: [95, 100, 105],
        boosts: [
          'Haste increased by 30 points.',
          'Damage increased to 220%.',
          'Health recovery increased to 12%.',
        ],
      },
      {
        levels: [110, 115, 120],
        boosts: [
          'Haste increased by 35 points.',
          'Damage increased to 230%.',
          'Health recovery increased to 14%.',
        ],
      },
      {
        levels: [125, 130, 135],
        boosts: [
          'Haste increased by 40 points.',
          'Damage increased to 240%.',
          'Health recovery increased to 16%.',
        ],
      },
      {
        levels: [140, 145, 150],
        boosts: [
          'Haste increased by 45 points.',
          'Damage increased to 250%.',
          'Health recovery increased to 18%.',
        ],
      },
      {
        levels: [155, 160, 165],
        boosts: [
          'Haste increased by 50 points.',
          'Damage increased to 260%.',
          'Health recovery increased to 20%.',
        ],
      },
      {
        levels: [170, 175, 180],
        boosts: [
          'Dodge increased by 125 points for 10 seconds.',
          'Damage increased to 270%.',
          'Health recovery increased to 22%.',
        ],
      },
    ],
  },
  {
    class: 'Tank',
    name: "Dura's Fortitude",
    focus: ['HP', 'ATK', 'DEF', 'ACC', 'Haste'],
    blessings: [
      {
        name: 'Clawback',
        icon: clawbackIcon,
        unlockLevel: 5,
        text: 'When the health of the heroes receiving this blessing falls below 30% for the first time they will recover 2.5% of their max health every second for 10 seconds.',
      },
      {
        name: 'Sundering Slam',
        icon: sunderingSlamIcon,
        unlockLevel: 15,
        text: "Heroes that receive this blessing will unleash a small shockwave every time they lose 30% of their max health, dealing AoE damage equal to 3% of each respective enemies' max health. Enemies affected by the shockwave will also lose 30 Haste points for 3 seconds.",
      },
      {
        name: 'Life Flash',
        icon: lifeFlashIcon,
        unlockLevel: 25,
        text: 'Heroes receiving this blessing will recover additional health equal to 9% of their max health when an allied hero heals them. Heroes receiving this blessing may only activate its effects once every 11 seconds.',
      },
    ],
    upgrades: [
      {
        levels: [10, 20, 30],
        boosts: [
          'Health recovery increased to 3%.',
          "Enemies' haste reduction increased to 40 points for 4 seconds.",
          'Cooldown period reduced to 9 seconds.',
        ],
      },
      {
        levels: [35, 40, 45],
        boosts: [
          'Health recovery increased to 3.5%.',
          "Enemies' haste reduction increased to 50 points for 5 seconds.",
          'Cooldown period reduced to 7 seconds.',
        ],
      },
      {
        levels: [50, 55, 60],
        boosts: [
          'Health recovery increased to 11 seconds.',
          'AoE damage increased to 3.5%.',
          'Health recovery increased to 10%.',
        ],
      },
      {
        levels: [65, 70, 75],
        boosts: [
          'Health recovery increased to 12 seconds.',
          'AoE damage increased to 4%.',
          'Health recovery increased to 11%.',
        ],
      },
      {
        levels: [80, 85, 90],
        boosts: [
          'Health recovery increased to 13 seconds.',
          'AoE damage increased to 4.5%.',
          'Health recovery increased to 12%.',
        ],
      },
      {
        levels: [95, 100, 105],
        boosts: [
          'Health recovery increased to 14 seconds.',
          'AoE damage increased to 5%.',
          'Health recovery increased to 13%.',
        ],
      },
      {
        levels: [110, 115, 120],
        boosts: [
          'Health recovery increased to 15 seconds.',
          'AoE damage increased to 5.5%.',
          'Health recovery increased to 14%.',
        ],
      },
      {
        levels: [125, 130, 135],
        boosts: [
          'Health recovery increased to 16 seconds.',
          'AoE damage increased to 6%.',
          'Health recovery increased to 15%.',
        ],
      },
      {
        levels: [140, 145, 150],
        boosts: [
          'Health recovery increased to 17 seconds.',
          'AoE damage increased to 6.5%.',
          'Health recovery increased to 16%.',
        ],
      },
      {
        levels: [155, 160, 165],
        boosts: [
          'Health recovery increased to 18 seconds.',
          'AoE damage increased to 7%.',
          'Health recovery increased to 17%.',
        ],
      },
    ],
  },
  {
    class: 'Warrior',
    name: "Dura's Might",
    focus: ['HP', 'ATK', 'DEF', 'ACC', 'Leech Life'],
    blessings: [
      {
        name: 'Shattering Force',
        icon: shatteringForceIcon,
        unlockLevel: 5,
        text: "Heroes receiving this blessing will cause their enemies to lose 24% of their health recovery rate and receive 15% more damage for 3 seconds if the enemy is successfully struck. This ability's effects may not be stacked.",
      },
      {
        name: 'Shield of Fortitude',
        icon: shieldOfFortitudeIcon,
        unlockLevel: 15,
        text: 'Heroes receiving this blessing will receive a shield that can mitigate damage equal to 15% of their max health for 5 seconds when an enemy uses their ultimate ability. Heroes receiving this blessing may only activate its effects once every 16 seconds.',
      },
      {
        name: 'Blood Thirst',
        icon: bloodThirstIcon,
        unlockLevel: 25,
        text: 'Heroes that receive this blessing will have their Life Leech increased by 14 points for 5 seconds the first time they use their ultimate abilities in battle.',
      },
    ],
    upgrades: [
      {
        levels: [10, 20, 30],
        boosts: [
          'Enemy health reduction increased to 32%, damage received increased to 18%.',
          'Shield cooldown reduced to 14 seconds.',
          'Life Leech increased by 17 points.',
        ],
      },
      {
        levels: [35, 40, 45],
        boosts: [
          'Enemy health reduction increased to 40%, damage received increased to 21%.',
          'Shield cooldown reduced to 12 seconds.',
          'Life Leech increased by 20 points.',
        ],
      },
      {
        levels: [50, 55, 60],
        boosts: [
          'Enemy damage received increased to 22%.',
          'Shield mitigation increased to 17%.',
          'Life Leech increased by 21 points.',
        ],
      },
      {
        levels: [65, 70, 75],
        boosts: [
          'Enemy damage received increased to 23%.',
          'Shield mitigation increased to 19%.',
          'Life Leech increased by 22 points.',
        ],
      },
      {
        levels: [80, 85, 90],
        boosts: [
          'Enemy damage received increased to 24%.',
          'Shield mitigation increased to 21%.',
          'Life Leech increased by 23 points.',
        ],
      },
      {
        levels: [95, 100, 105],
        boosts: [
          'Enemy damage received increased to 25%.',
          'Shield mitigation increased to 23%.',
          'Life Leech increased by 24 points.',
        ],
      },
      {
        levels: [110, 115, 120],
        boosts: [
          'Enemy damage received increased to 26%.',
          'Shield mitigation increased to 25%.',
          'Life Leech increased by 25 points.',
        ],
      },
      {
        levels: [125, 130, 135],
        boosts: [
          'Enemy damage received increased to 27%.',
          'Shield mitigation increased to 27%.',
          'Life Leech increased by 26 points.',
        ],
      },
      {
        levels: [140, 145, 150],
        boosts: [
          'Enemy damage received increased to 28%.',
          'Shield mitigation increased to 29%.',
          'Life Leech increased by 27 points.',
        ],
      },
      {
        levels: [155, 160, 165],
        boosts: [
          'Enemy damage received increased to 29%.',
          'Shield mitigation increased to 31%.',
          'Life Leech increased by 28 points.',
        ],
      },
    ],
  },
  {
    class: 'Mage',
    name: "Dura's Sorcery",
    focus: ['HP', 'ATK', 'DEF', 'Crit', 'Dodge'],
    blessings: [
      {
        name: 'Astral Focus',
        icon: astralFocusIcon,
        unlockLevel: 5,
        text: 'Heroes receiving this blessing will receive an Attack Rating increase of 10% for 3 seconds each time they use their ultimate abilities.',
      },
      {
        name: 'Astral Tide',
        icon: astralTideIcon,
        unlockLevel: 15,
        text: 'When a hero receiving this blessing uses their ultimate ability, all of their allies will recover 30 energy points. If an ally receives this ability effect multiple times within 10 seconds, its efficacy will be reduced by 60%.',
      },
      {
        name: 'Power Surge',
        icon: powerSurgeIcon,
        unlockLevel: 25,
        text: 'Heroes receiving this blessing will recover 40 energy points the first time their health falls below 30% and will be immune to enemy control abilities for 1.5 seconds.',
      },
    ],
    upgrades: [
      {
        levels: [10, 20, 30],
        boosts: [
          'Attack Rating increased to 12%.',
          'Energy recovery increased to 45.',
          'Energy recovery increased to 60.',
        ],
      },
      {
        levels: [35, 40, 45],
        boosts: [
          'Attack Rating increased to 14%.',
          'Energy recovery increased to 60.',
          'Energy recovery increased to 80.',
        ],
      },
      {
        levels: [50, 55, 60],
        boosts: [
          'Attack Rating increased to 15%.',
          'Energy recovery increased to 70.',
          'Energy recovery increased to 90.',
        ],
      },
      {
        levels: [65, 70, 75],
        boosts: [
          'Attack Rating increased to 16%.',
          'Energy recovery increased to 80.',
          'Energy recovery increased to 100.',
        ],
      },
      {
        levels: [80, 85, 90],
        boosts: [
          'Attack Rating increased to 17%.',
          'Energy recovery increased to 90.',
          'Energy recovery increased to 110.',
        ],
      },
      {
        levels: [95, 100, 105],
        boosts: [
          'Attack Rating increased to 18%.',
          'Energy recovery increased to 100.',
          'Energy recovery increased to 120.',
        ],
      },
      {
        levels: [110, 115, 120],
        boosts: [
          'Attack Rating increased to 19%.',
          'Energy recovery increased to 110.',
          'Energy recovery increased to 130.',
        ],
      },
      {
        levels: [125, 130, 135],
        boosts: [
          'Attack Rating increased to 20%.',
          'Energy recovery increased to 120.',
          'Energy recovery increased to 140.',
        ],
      },
      {
        levels: [140, 145, 150],
        boosts: [
          'Attack Rating increased to 21%.',
          'Energy recovery increased to 130.',
          'Energy recovery increased to 150.',
        ],
      },
      {
        levels: [155, 160, 165],
        boosts: [
          'Attack Rating increased to 22%.',
          'Energy recovery increased to 140.',
          'Energy recovery increased to 160.',
        ],
      },
    ],
  },
  {
    class: 'Support',
    name: "Dura's Sustenance",
    focus: ['HP', 'ATK', 'DEF', 'Haste', 'Dodge'],
    blessings: [
      {
        name: "Savior's Gift",
        icon: saviorsGiftIcon,
        unlockLevel: 5,
        text: "Creates a protective shield around the most injured ally which is able to mitigate an amount of damage equal to 220% of the blessed hero's own Attack Rating for 7 seconds when the blessed hero uses their ultimate ability for the first time.",
      },
      {
        name: 'Life Kindle',
        icon: lifeKindleIcon,
        unlockLevel: 15,
        text: 'When the caster receiving this blessing heals an ally, they will also additionally heal the most injured allied hero for 100% worth of the caster’s own Attack Rating as health. Heroes receiving this blessing may only activate its effects once every 10 seconds.',
      },
      {
        name: 'Defiance',
        icon: defianceIcon,
        unlockLevel: 25,
        text: 'Heroes receiving this blessing will recover 60 energy points after 15 seconds of a battle have passed and will also be immune to enemy control abilities for 1.5 seconds.',
      },
    ],
    upgrades: [
      {
        levels: [10, 20, 30],
        boosts: [
          'Shield mitigation increased to 260%.',
          'Healing recovery increased to 120%.',
          'Energy recovery increased to 90 points.',
        ],
      },
      {
        levels: [35, 40, 45],
        boosts: [
          'Shield mitigation increased to 300%.',
          'Healing recovery increased to 140%.',
          'Energy recovery increased to 120 points.',
        ],
      },
      {
        levels: [50, 55, 60],
        boosts: [
          'Shield mitigation increased to 320%.',
          'Healing recovery increased to 150%.',
          'Energy recovery increased to 135 points.',
        ],
      },
      {
        levels: [65, 70, 75],
        boosts: [
          'Shield mitigation increased to 340%.',
          'Healing recovery increased to 160%.',
          'Energy recovery increased to 150 points.',
        ],
      },
      {
        levels: [80, 85, 90],
        boosts: [
          'Shield mitigation increased to 360%.',
          'Healing recovery increased to 170%.',
          'Energy recovery increased to 165 points.',
        ],
      },
      {
        levels: [95, 100, 105],
        boosts: [
          'Shield mitigation increased to 380%.',
          'Healing recovery increased to 180%.',
          'Energy recovery increased to 180 points.',
        ],
      },
      {
        levels: [110, 115, 120],
        boosts: [
          'Shield mitigation increased to 400%.',
          'Healing recovery increased to 190%.',
          'Energy recovery increased to 195 points.',
        ],
      },
      {
        levels: [125, 130, 135],
        boosts: [
          'Shield mitigation increased to 420%.',
          'Healing recovery increased to 200%.',
          'Energy recovery increased to 210 points.',
        ],
      },
      {
        levels: [140, 145, 150],
        boosts: [
          'Shield mitigation increased to 440%.',
          'Healing recovery increased to 210%.',
          'Energy recovery increased to 225 points.',
        ],
      },
      {
        levels: [155, 160, 165],
        boosts: [
          'Shield mitigation increased to 460%.',
          'Healing recovery increased to 220%.',
          'Energy recovery increased to 240 points.',
        ],
      },
    ],
  },
]

export function getVirtue(heroClass: HeroClass): ElderTreeVirtue {
  const virtue = elderTreeVirtues.find((entry) => entry.class === heroClass)
  if (!virtue) throw new Error(`No Elder Tree virtue for ${heroClass}`)
  return virtue
}

export function getVirtueMaxLevel(virtue: ElderTreeVirtue): number {
  const lastRow = virtue.upgrades[virtue.upgrades.length - 1]
  return Math.max(...lastRow.levels)
}

export function getVirtueLevels(virtue: ElderTreeVirtue): number[] {
  const levels = new Set<number>(virtue.blessings.map((blessing) => blessing.unlockLevel))
  for (const row of virtue.upgrades) {
    for (const level of row.levels) levels.add(level)
  }
  return [...levels].sort((a, b) => a - b)
}

export interface BlessingState {
  text: string
  activeLevel: number
  nextLevel: number | null
  unlocked: boolean
}

export function getBlessingState(
  virtue: ElderTreeVirtue,
  blessingIndex: number,
  level: number,
): BlessingState {
  const blessing = virtue.blessings[blessingIndex]
  let activeLevel = blessing.unlockLevel
  let text = blessing.text
  let nextLevel: number | null = null

  for (const row of virtue.upgrades) {
    const upgradeLevel = row.levels[blessingIndex]
    if (upgradeLevel > level) {
      nextLevel = upgradeLevel
      break
    }
    activeLevel = upgradeLevel
    text = row.boosts[blessingIndex]
  }

  return { text, activeLevel, nextLevel, unlocked: level >= blessing.unlockLevel }
}
