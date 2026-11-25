import aoeIcon from '@/assets/roles/aoe.webp'
import assassinIcon from '@/assets/roles/assassin.webp'
import buffIcon from '@/assets/roles/buff.webp'
import burstDamageIcon from '@/assets/roles/burst-damage.webp'
import continuousDamageIcon from '@/assets/roles/continuous-damage.webp'
import controlIcon from '@/assets/roles/control.webp'
import debuffIcon from '@/assets/roles/debuff.webp'
import healIcon from '@/assets/roles/heal.webp'
import tankIcon from '@/assets/roles/tank.webp'
import { cn } from '@/lib/cn'
import type { HeroRole } from '@/types'

const ROLE_ICONS: Record<HeroRole, string> = {
  Tank: tankIcon,
  'Continuous Damage': continuousDamageIcon,
  Heal: healIcon,
  'Burst Damage': burstDamageIcon,
  Control: controlIcon,
  Assassin: assassinIcon,
  Buff: buffIcon,
  AoE: aoeIcon,
  Debuff: debuffIcon,
}

interface RoleIconProps {
  role: HeroRole
  className?: string
}

export function RoleIcon({ role, className }: RoleIconProps) {
  return (
    <img
      src={ROLE_ICONS[role]}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={cn('size-6 object-contain', className)}
    />
  )
}
