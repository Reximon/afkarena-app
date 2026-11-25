import mageIcon from '@/assets/classes/mage.webp'
import rangerIcon from '@/assets/classes/ranger.webp'
import supportIcon from '@/assets/classes/support.webp'
import tankIcon from '@/assets/classes/tank.webp'
import warriorIcon from '@/assets/classes/warrior.webp'
import { cn } from '@/lib/cn'
import type { HeroClass } from '@/types'

const CLASS_ICONS: Record<HeroClass, string> = {
  Warrior: warriorIcon,
  Tank: tankIcon,
  Ranger: rangerIcon,
  Mage: mageIcon,
  Support: supportIcon,
}

interface ClassIconProps {
  heroClass: HeroClass
  className?: string
}

export function ClassIcon({ heroClass, className }: ClassIconProps) {
  return (
    <img
      src={CLASS_ICONS[heroClass]}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={cn('size-6 object-contain', className)}
    />
  )
}
