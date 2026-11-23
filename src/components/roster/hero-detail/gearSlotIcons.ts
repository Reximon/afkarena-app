import type { LucideIcon } from 'lucide-react'
import { Footprints, HardHat, Shield, Sword } from 'lucide-react'
import type { GearSlot as GearSlotId } from '@/types'

export const GEAR_SLOT_ICONS: Record<GearSlotId, LucideIcon> = {
  weapon: Sword,
  helmet: HardHat,
  chest: Shield,
  boots: Footprints,
}
