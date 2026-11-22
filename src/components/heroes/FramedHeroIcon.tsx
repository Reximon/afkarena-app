import { useState } from 'react'
import { cn } from '@/lib/cn'
import { framedHeroIconUrl, heroIconUrl } from '@/lib/framedIcon'
import type { Ascension } from '@/types'

interface FramedHeroIconProps {
  heroId: string
  ascension: Ascension
  signatureItem: number
  furniture: number
  engraving: number
  alt: string
  className?: string
}

export function FramedHeroIcon({
  heroId,
  ascension,
  signatureItem,
  furniture,
  engraving,
  alt,
  className,
}: FramedHeroIconProps) {
  const framedUrl = framedHeroIconUrl({
    heroId,
    ascension,
    signatureItem,
    furniture,
    engraving,
  })
  const fallbackUrl = heroIconUrl(heroId)
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const src = failedUrl === framedUrl ? fallbackUrl : framedUrl

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailedUrl(framedUrl)}
      className={cn('aspect-square object-contain', className)}
    />
  )
}
