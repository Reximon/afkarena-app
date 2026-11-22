import type { TeamSlot } from '@/types'

export function assignHeroToSlot(
  slots: TeamSlot[],
  position: TeamSlot['position'],
  heroId: string,
): TeamSlot[] {
  return slots.map((slot) => {
    if (slot.position === position) {
      return { ...slot, heroId: heroId || undefined }
    }
    if (heroId && slot.heroId === heroId) {
      return { ...slot, heroId: undefined }
    }
    return slot
  })
}

export function resolveDropTarget(
  slots: TeamSlot[],
  overId: string,
): TeamSlot['position'] | undefined {
  if (overId === 'front' || overId === 'back') {
    return slots.find((slot) => slot.row === overId && !slot.heroId)?.position
  }

  if (!overId.startsWith('slot-')) return undefined

  const position = Number(overId.slice(5))
  if (!Number.isInteger(position) || position < 1 || position > 5) return undefined

  return position as TeamSlot['position']
}
