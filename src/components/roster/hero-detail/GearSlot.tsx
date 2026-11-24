import type { ReactNode } from 'react'
import { Gem } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EquipmentImage } from '@/components/equipment/EquipmentImage'
import type { ArtifactDefinition } from '@/features/artifacts/artifacts'
import type { CollectionDefinition } from '@/features/collections/collections'
import { getGearFaction } from '@/features/gear/gear'
import { getGearIconSrc } from '@/features/gear/gearIcons'
import { getFactionColor } from '@/features/heroes/heroCatalog'
import { cn } from '@/lib/cn'
import type {
  CollectionProgress,
  Faction,
  GearPiece,
  GearSlot as GearSlotId,
  HeroType,
} from '@/types'
import { GEAR_SLOT_ICONS } from './gearSlotIcons'

export type GearSlotDescriptor =
  | { kind: 'gear'; slot: GearSlotId; piece?: GearPiece }
  | { kind: 'artifact'; artifact?: ArtifactDefinition }
  | { kind: 'collection'; collection?: CollectionDefinition; progress?: CollectionProgress }

interface GearSlotProps {
  descriptor: GearSlotDescriptor
  heroFaction?: Faction
  heroType?: HeroType
  onSelect?: () => void
  className?: string
}

export function GearSlot({
  descriptor,
  heroFaction,
  heroType,
  onSelect,
  className,
}: GearSlotProps) {
  const { t } = useTranslation()

  let label: string
  let title: string
  let chip: string | undefined
  let faction: Faction | undefined
  let visual: ReactNode

  if (descriptor.kind === 'gear') {
    const { slot, piece } = descriptor
    const Icon = GEAR_SLOT_ICONS[slot]
    label = t(`gearSlot.${slot}`)
    title = piece
      ? `${label} · ${t(`gearTier.${piece.tier}`)}`
      : `${label} · ${t('heroDialog.emptySlot')}`
    chip = piece ? t(`gearTier.${piece.tier}`) : undefined
    faction = getGearFaction(piece, heroFaction)
    visual = (
      <EquipmentImage
        src={piece ? getGearIconSrc(piece.tier, slot, heroType) : undefined}
        alt={title}
        icon={Icon}
        iconClassName={piece ? 'text-gild' : 'text-muted/35'}
        className="size-full object-contain p-0.5"
      />
    )
  } else if (descriptor.kind === 'artifact') {
    label = t('hero.artifact')
    title = descriptor.artifact
      ? `${label} · ${descriptor.artifact.name}`
      : `${label} · ${t('heroDialog.emptySlot')}`
    visual = (
      <EquipmentImage
        src={descriptor.artifact?.image}
        alt={descriptor.artifact?.name ?? ''}
        icon={Gem}
        iconClassName={descriptor.artifact ? 'text-gild' : 'text-muted/35'}
        className="size-full object-contain p-0.5"
      />
    )
  } else {
    label = t('hero.collection')
    title = descriptor.collection
      ? `${label} · ${descriptor.collection.name}`
      : `${label} · ${t('heroDialog.emptySlot')}`
    chip =
      descriptor.collection && descriptor.progress
        ? t('heroDialog.collectionLevel', { level: descriptor.progress.level })
        : undefined
    visual = (
      <EquipmentImage
        src={descriptor.collection?.image}
        alt={descriptor.collection?.name ?? ''}
        icon={Gem}
        iconClassName={descriptor.collection ? 'text-gild' : 'text-muted/35'}
        className="size-full object-contain p-0.5"
      />
    )
  }

  const filled =
    descriptor.kind === 'gear'
      ? Boolean(descriptor.piece)
      : descriptor.kind === 'artifact'
        ? Boolean(descriptor.artifact)
        : Boolean(descriptor.collection)
  const starCount = descriptor.kind === 'gear' ? (descriptor.piece?.stars ?? 0) : null

  const tileClassName = cn(
    'relative flex w-full flex-col items-center gap-1 rounded-xl p-1',
    filled
      ? 'border border-gild/35 bg-[linear-gradient(180deg,rgba(40,23,14,0.85),rgba(10,5,3,0.94))] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.55),0_8px_20px_rgba(0,0,0,0.4)]'
      : 'border border-dashed border-gild/20 bg-night/40',
    onSelect &&
      'transition-colors hover:border-gild/55 hover:shadow-[0_0_18px_rgba(226,185,109,0.12)]',
    className,
  )

  const content = (
    <>
      <div className="relative w-full">
        <span className="grid aspect-square w-full place-items-center overflow-hidden rounded-lg bg-abyss/60 p-1 shadow-[inset_0_0_12px_rgba(0,0,0,0.6)]">
          {visual}
        </span>
        {chip ? (
          <span className="absolute bottom-0 left-0 rounded-md border border-gild/40 bg-night/95 px-1 font-mono text-[9px] leading-4 text-gild">
            {chip}
          </span>
        ) : null}
        {faction ? (
          <span
            className="absolute top-1 right-1 size-2 rounded-full ring-2 ring-night/80"
            style={{ backgroundColor: getFactionColor(faction) }}
            aria-hidden="true"
          />
        ) : null}
      </div>
      <span className="w-full truncate px-0.5 text-center font-mono text-[7px] tracking-normal text-muted uppercase sm:text-[8px] sm:tracking-[0.12em]">
        {label}
      </span>
      {starCount !== null && filled ? (
        <span className="flex items-center gap-px" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <span
              key={index}
              className={cn('size-1 rounded-full', index < starCount ? 'bg-gild' : 'bg-muted/25')}
            />
          ))}
        </span>
      ) : null}
    </>
  )

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-label={title}
        title={title}
        className={tileClassName}
      >
        {content}
      </button>
    )
  }

  return (
    <div role="group" aria-label={title} title={title} className={tileClassName}>
      {content}
    </div>
  )
}
