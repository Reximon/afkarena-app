import { useCallback } from 'react'
import type { PointerEvent } from 'react'

export function usePointerFoil() {
  return useCallback((event: PointerEvent<HTMLElement>) => {
    const el = event.currentTarget
    const rect = el.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    el.style.setProperty(
      '--foil-x',
      `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`,
    )
    el.style.setProperty(
      '--foil-y',
      `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`,
    )
  }, [])
}
