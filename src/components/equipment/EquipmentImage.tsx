import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

const AFK_GLOBAL_ASSET_BASE = 'https://www.afk.global'

interface EquipmentImageProps {
  src?: string
  alt?: string
  icon: LucideIcon
  className?: string
  iconClassName?: string
}

function resolveSrc(src: string) {
  return src.startsWith('http') ? src : `${AFK_GLOBAL_ASSET_BASE}${src}`
}

export function EquipmentImage({
  src,
  alt = '',
  icon: Icon,
  className,
  iconClassName,
}: EquipmentImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const failed = Boolean(src && failedSrc === src)

  if (!src || failed) {
    return (
      <Icon
        size={20}
        strokeWidth={1.6}
        aria-hidden="true"
        className={cn('text-gold', iconClassName)}
      />
    )
  }

  return (
    <img
      src={resolveSrc(src)}
      alt={alt}
      loading="lazy"
      className={cn('size-full object-contain', className)}
      onError={() => setFailedSrc(src)}
    />
  )
}
