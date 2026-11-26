import { ASCENSIONS, GEAR_SLOTS, GEAR_TIERS, type GearPiece, type HeroProgress } from '@/types'

export type OptimizationGrade = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D'

export interface HeroOptimization {
  score: number
  grade: OptimizationGrade
}

export const OPTIMIZATION_WEIGHTS = {
  ascension: 25,
  signature: 20,
  furniture: 20,
  engraving: 20,
  gear: 15,
} as const

const MAX_SIGNATURE = 40
const MAX_FURNITURE = 36
const MAX_ENGRAVING = 80
const MAX_STARS = 5
const GEAR_TIER_SHARE = 0.7
const GEAR_STAR_SHARE = 0.3
const ASCENDED_INDEX = ASCENSIONS.indexOf('ascended5')
const MAX_GEAR_TIER = GEAR_TIERS.length - 1

type OptimizationInput = Pick<
  HeroProgress,
  'ascension' | 'signatureItem' | 'furniture' | 'engraving' | 'gear'
>

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

function gradeForScore(score: number): OptimizationGrade {
  if (score >= 90) return 'S+'
  if (score >= 80) return 'S'
  if (score >= 65) return 'A'
  if (score >= 50) return 'B'
  if (score >= 35) return 'C'
  return 'D'
}

export function getOptimizationGradeForScore(score: number): OptimizationGrade {
  return gradeForScore(score)
}

function gearPieceScore(piece: GearPiece | undefined): number {
  if (!piece) return 0

  const tier = clamp01(GEAR_TIERS.indexOf(piece.tier) / MAX_GEAR_TIER)
  const stars = clamp01(piece.stars / MAX_STARS)

  return clamp01(tier * GEAR_TIER_SHARE + stars * GEAR_STAR_SHARE)
}

export function getHeroOptimization(hero: OptimizationInput): HeroOptimization {
  const ascension = clamp01(ASCENSIONS.indexOf(hero.ascension) / ASCENDED_INDEX)
  const signature = clamp01(hero.signatureItem / MAX_SIGNATURE)
  const furniture = clamp01(hero.furniture / MAX_FURNITURE)
  const engraving = clamp01(hero.engraving / MAX_ENGRAVING)
  const gear =
    GEAR_SLOTS.reduce((total, slot) => total + gearPieceScore(hero.gear[slot]), 0) /
    GEAR_SLOTS.length

  const score = Math.round(
    ascension * OPTIMIZATION_WEIGHTS.ascension +
      signature * OPTIMIZATION_WEIGHTS.signature +
      furniture * OPTIMIZATION_WEIGHTS.furniture +
      engraving * OPTIMIZATION_WEIGHTS.engraving +
      gear * OPTIMIZATION_WEIGHTS.gear,
  )

  return { score, grade: gradeForScore(score) }
}
