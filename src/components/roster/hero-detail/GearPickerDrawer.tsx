import { useTranslation } from 'react-i18next'
import { EquipmentImage } from '@/components/equipment/EquipmentImage'
import { Select } from '@/components/ui/Input'
import { Stars } from '@/components/ui/Stars'
import { getGearFactionDisplay, isExclusiveTier } from '@/features/gear/gear'
import { getGearIconSrc } from '@/features/gear/gearIcons'
import { cn } from '@/lib/cn'
import {
  FACTIONS,
  GEAR_SLOTS,
  GEAR_TIERS,
  type Faction,
  type GearPiece,
  type GearSlot as GearSlotId,
  type GearTier,
  type HeroType,
} from '@/types'
import { GEAR_SLOT_ICONS } from './gearSlotIcons'
import { PickerDrawer } from './PickerDrawer'

const SIGNATURE_OPTIONS = [0, 10, 20, 30, 40] as const

interface GearPickerDrawerProps {
  slot: GearSlotId
  piece?: GearPiece
  heroFaction?: Faction
  heroType?: HeroType
  signatureItem: number
  onSelectSlot: (slot: GearSlotId) => void
  onClose: () => void
  onTierChange: (tier: GearTier) => void
  onStarsChange: (stars: GearPiece['stars']) => void
  onResonantChange: (resonant: boolean) => void
  onExclusiveChange: (exclusive: boolean) => void
  onFactionChange: (faction: Faction | undefined) => void
  onSignatureChange: (value: number) => void
}

export function GearPickerDrawer({
  slot,
  piece,
  heroFaction,
  heroType,
  signatureItem,
  onSelectSlot,
  onClose,
  onTierChange,
  onStarsChange,
  onResonantChange,
  onExclusiveChange,
  onFactionChange,
  onSignatureChange,
}: GearPickerDrawerProps) {
  const { t } = useTranslation()

  const display = getGearFactionDisplay(piece, heroFaction)
  const tier = piece?.tier ?? 'none'
  const exclusiveChecked = piece?.exclusive ?? (piece ? isExclusiveTier(piece.tier) : false)
  const resonantChecked = piece?.resonant ?? false
  const SlotIcon = GEAR_SLOT_ICONS[slot]

  return (
    <PickerDrawer kicker={t('hero.gear')} title={t(`gearSlot.${slot}`)} onClose={onClose}>
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {GEAR_SLOTS.map((gearSlot) => {
          const Icon = GEAR_SLOT_ICONS[gearSlot]
          const active = gearSlot === slot

          return (
            <button
              key={gearSlot}
              type="button"
              aria-pressed={active}
              onClick={() => onSelectSlot(gearSlot)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg border px-1 py-1.5 text-[9px] font-semibold uppercase transition-colors',
                active
                  ? 'border-gild/50 bg-gild/10 text-gild'
                  : 'border-line bg-night/40 text-muted hover:border-gild/30 hover:text-parch',
              )}
            >
              <Icon size={15} aria-hidden="true" />
              {t(`gearSlot.${gearSlot}`)}
            </button>
          )
        })}
      </div>

      <div className="mt-4">
        <p className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
          {t('roster.tier')}
        </p>
        <div className="mt-1.5 grid grid-cols-4 gap-1.5">
          {GEAR_TIERS.map((gearTier) => {
            const active = gearTier === tier

            return (
              <button
                key={gearTier}
                type="button"
                aria-pressed={active}
                onClick={() => onTierChange(gearTier)}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-lg border px-1 py-1.5 transition-colors',
                  active
                    ? 'border-gild/50 bg-gild/10 text-gild'
                    : 'border-line bg-night/40 text-muted hover:border-gild/30 hover:text-parch',
                )}
              >
                <span className="grid aspect-square w-full place-items-center overflow-hidden rounded-md bg-black/25 p-0.5">
                  <EquipmentImage
                    src={getGearIconSrc(gearTier, slot, heroType)}
                    alt=""
                    icon={SlotIcon}
                    iconClassName={active ? 'text-gild' : 'text-muted/50'}
                    className="size-full object-contain"
                  />
                </span>
                <span className="text-[10px] font-semibold">{t(`gearTier.${gearTier}`)}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
          {t('roster.stars')}
        </span>
        <Stars
          total={5}
          value={piece?.stars ?? 0}
          onChange={piece ? (stars) => onStarsChange(stars as GearPiece['stars']) : undefined}
          size={20}
          label={t('roster.stars')}
        />
      </div>

      <div className="mt-3 flex gap-1.5">
        <button
          type="button"
          disabled={!piece}
          aria-pressed={resonantChecked}
          title={t('hero.resonantHint')}
          onClick={() => onResonantChange(!resonantChecked)}
          className={cn(
            'flex-1 rounded-lg border px-2 py-1.5 text-[10px] font-semibold tracking-wide uppercase transition-colors disabled:opacity-40',
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
            'flex-1 rounded-lg border px-2 py-1.5 text-[10px] font-semibold tracking-wide uppercase transition-colors disabled:opacity-40',
            exclusiveChecked
              ? 'border-gild/50 bg-gild/15 text-gild'
              : 'border-line bg-night/40 text-muted hover:text-parch',
          )}
        >
          {t('hero.exclusive')}
        </button>
      </div>

      {display.kind === 'select' ? (
        <div className="mt-3">
          <p className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
            {t('hero.faction')}
          </p>
          <Select
            value={piece?.faction ?? ''}
            disabled={!piece}
            onChange={(event) =>
              onFactionChange((event.target.value || undefined) as Faction | undefined)
            }
            aria-label={`${t(`gearSlot.${slot}`)} ${t('hero.faction')}`}
            className="mt-1.5 h-9 text-sm"
          >
            <option value="">{t('common.none')}</option>
            {FACTIONS.map((faction) => (
              <option key={faction} value={faction}>
                {t(`faction.${faction}`)}
              </option>
            ))}
          </Select>
        </div>
      ) : display.kind === 'same' ? (
        <p className="mt-3 text-[11px] text-arcane">
          {t('hero.sameFaction')}: {t(`faction.${display.faction}`)}
        </p>
      ) : null}

      <div className="mt-4 border-t border-line pt-3">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
            {t('hero.signatureItem')}
          </p>
          <span className="font-display text-sm text-gild">+{signatureItem}</span>
        </div>
        <div className="mt-1.5 grid grid-cols-5 gap-1.5">
          {SIGNATURE_OPTIONS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={value === signatureItem}
              onClick={() => onSignatureChange(value)}
              className={cn(
                'rounded-lg border px-1 py-1.5 text-[10px] font-semibold transition-colors',
                value === signatureItem
                  ? 'border-gild/50 bg-gild/10 text-gild'
                  : 'border-line bg-night/40 text-muted hover:border-gild/30 hover:text-parch',
              )}
            >
              +{value}
            </button>
          ))}
        </div>
      </div>
    </PickerDrawer>
  )
}
