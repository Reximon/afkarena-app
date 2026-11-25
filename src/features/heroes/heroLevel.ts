import type { HeroProgress } from '@/types'

export function getHeroLevel(
  hero: Pick<HeroProgress, 'level' | 'inCrystal'>,
  crystalLevel: number,
): number {
  return hero.inCrystal && crystalLevel > 0 ? crystalLevel : hero.level
}
