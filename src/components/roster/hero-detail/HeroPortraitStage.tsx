import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { FramedHeroIcon } from '@/components/heroes/FramedHeroIcon'
import { Badge } from '@/components/ui/Badge'
import { getFactionColor, getHeroClassKey } from '@/features/heroes/heroCatalog'
import { cn } from '@/lib/cn'
import { hasFoilEffect } from '@/lib/framedIcon'
import { usePointerFoil } from '@/lib/usePointerFoil'
import type { HeroCatalogEntry, HeroProgress } from '@/types'

interface HeroPortraitStageProps {
  entry: HeroCatalogEntry
  progress: HeroProgress
  leftSlots: ReactNode
  rightSlots: ReactNode
  ascensionControl: ReactNode
}

export function HeroPortraitStage({
  entry,
  progress,
  leftSlots,
  rightSlots,
  ascensionControl,
}: HeroPortraitStageProps) {
  const { t } = useTranslation()
  const onFoilPointerMove = usePointerFoil()

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-[8.5rem_minmax(0,1fr)_8.5rem] lg:items-center">
      <div className="order-2 flex flex-col gap-2 lg:order-1">{leftSlots}</div>

      <div className="order-1 col-span-2 space-y-3 lg:order-2 lg:col-span-1">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <span
            className="size-2.5 rotate-45 rounded-[2px] ring-2 ring-night/70"
            style={{ backgroundColor: getFactionColor(entry.faction) }}
            aria-hidden="true"
          />
          <span className="font-mono text-[10px] tracking-wide text-muted uppercase">
            {t(`faction.${entry.faction}`)} · {t(getHeroClassKey(entry))}
          </span>
          <Badge variant="outline">{t(`ascension.${entry.rarity}`)}</Badge>
        </div>

        <div
          onPointerMove={onFoilPointerMove}
          className={cn(
            'portrait-frame mx-auto w-full max-w-64 overflow-hidden rounded-2xl shadow-[0_18px_44px_rgba(4,2,1,0.6)]',
            hasFoilEffect(progress) && 'hero-foil',
          )}
        >
          <FramedHeroIcon
            heroId={entry.id}
            ascension={progress.ascension}
            signatureItem={progress.signatureItem}
            furniture={progress.furniture}
            engraving={progress.engraving}
            alt={entry.displayName}
            className="w-full"
          />
        </div>

        {ascensionControl}

        {entry.roles.length > 0 ? (
          <p className="text-center text-[11px] text-muted">{entry.roles.join(' · ')}</p>
        ) : null}
      </div>

      <div className="order-3 flex flex-col gap-2">{rightSlots}</div>
    </div>
  )
}
