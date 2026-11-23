import { Footprints, HardHat, Shield, Sword, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Stars } from '@/components/ui/Stars'
import { Select } from '@/components/ui/Input'
import { getGearFactionDisplay, isExclusiveTier } from '@/features/gear/gear'
import { cn } from '@/lib/cn'
import {
  FACTIONS,
  GEAR_TIERS,
  type Faction,
  type GearPiece,
  type GearSlot,
  type GearTier,
} from '@/types'

const SLOT_ICONS: Record<GearSlot, LucideIcon> = {
  weapon: Sword,
  helmet: HardHat,
  chest: Shield,
  boots: Footprints,
}

interface GearSlotControlProps {
  slot: GearSlot
  piece?: GearPiece
  heroFaction?: Faction
  onTierChange: (tier: GearTier) => void
  onStarsChange: (stars: GearPiece['stars']) => void
  onExclusiveChange: (exclusive: boolean) => void
  onResonantChange: (resonant: boolean) => void
  onFactionChange: (faction: Faction | undefined) => void
}

export function GearSlotControl({
  slot,
  piece,
  heroFaction,
  onTierChange,
  onStarsChange,
  onExclusiveChange,
  onResonantChange,
  onFactionChange,
}: GearSlotControlProps) {
  const { t } = useTranslation()
  const Icon = SLOT_ICONS[slot]
  const tier = piece?.tier ?? 'none'
  const tierIndex = GEAR_TIERS.indexOf(tier)
  const nextTier = GEAR_TIERS[(tierIndex + 1) % GEAR_TIERS.length]
  const display = getGearFactionDisplay(piece, heroFaction)
  const exclusiveChecked = piece?.exclusive ?? (piece ? isExclusiveTier(piece.tier) : false)
  const resonantChecked = piece?.resonant ?? false

  return (
    <div className="space-y-2 rounded-xl border border-line bg-night/30 p-2.5">
      <div className="flex items-center gap-1.5">
        <Icon size={14} className="shrink-0 text-gild" aria-hidden="true" />
        <span className="truncate font-mono text-[9px] tracking-[0.14em] text-muted uppercase">
          {t(`gearSlot.${slot}`)}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onTierChange(nextTier)}
        title={t('heroScreen.tapToCycleTier')}
        aria-label={`${t(`gearSlot.${slot}`)} ${t('roster.tier')}: ${t(`gearTier.${tier}`)}`}
        className={cn(
          'icon-action flex h-8 w-full items-center justify-center rounded-lg border text-xs font-semibold transition-colors',
          piece
            ? 'border-gild/40 bg-gild/10 text-gild hover:border-gild/70'
            : 'border-dashed border-line bg-night/40 text-muted hover:border-gild/40 hover:text-parch',
        )}
      >
        {t(`gearTier.${tier}`)}
      </button>

      <Stars
        total={5}
        value={piece?.stars ?? 0}
        onChange={piece ? (stars) => onStarsChange(stars as GearPiece['stars']) : undefined}
        size={12}
        label={`${t(`gearSlot.${slot}`)} ${t('roster.stars')}`}
      />

      <div className="flex gap-1">
        <button
          type="button"
          disabled={!piece}
          aria-pressed={resonantChecked}
          title={t('hero.resonantHint')}
          onClick={() => onResonantChange(!resonantChecked)}
          className={cn(
            'flex-1 rounded-md border px-1 py-1 text-[9px] font-semibold tracking-wide uppercase transition-colors disabled:opacity-40',
            resonantChecked
              ? 'border-arcane/50 bg-arcane/15 text-arcane'
              : 'border-line bg-night/40 text-muted hover:text-parch',
          )}
        >
          {t('hero.resonant')}
        </button>
        <button
          type="button"
          disabled={!piece}
          aria-pressed={exclusiveChecked}
          title={t('hero.exclusiveHint')}
          onClick={() => onExclusiveChange(!exclusiveChecked)}
          className={cn(
            'flex-1 rounded-md border px-1 py-1 text-[9px] font-semibold tracking-wide uppercase transition-colors disabled:opacity-40',
            exclusiveChecked
              ? 'border-gild/50 bg-gild/15 text-gild'
              : 'border-line bg-night/40 text-muted hover:text-parch',
          )}
        >
          {t('hero.exclusive')}
        </button>
      </div>

      {display.kind === 'select' ? (
        <Select
          value={piece?.faction ?? ''}
          disabled={!piece}
          onChange={(event) => onFactionChange((event.target.value || undefined) as Faction | undefined)}
          aria-label={`${t(`gearSlot.${slot}`)} ${t('hero.faction')}`}
          className="h-8 px-2 text-xs"
        >
          <option value="">{t('common.none')}</option>
          {FACTIONS.map((faction) => (
            <option key={faction} value={faction}>
              {t(`faction.${faction}`)}
            </option>
          ))}
        </Select>
      ) : display.kind === 'same' ? (
        <p className="truncate text-[10px] text-arcane">
          {t('hero.sameFaction')}: {t(`faction.${display.faction}`)}
        </p>
      ) : null}
    </div>
  )
}
