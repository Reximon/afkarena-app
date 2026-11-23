import { useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  Gem,
  Link2,
  Pencil,
  ShieldPlus,
  Sparkles,
  StickyNote,
  Target,
  Trash2,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FramedHeroIcon } from '@/components/heroes/FramedHeroIcon'
import { Badge } from '@/components/ui/Badge'
import { Stars } from '@/components/ui/Stars'
import { getArtifact } from '@/features/artifacts/artifacts'
import { getCollection } from '@/features/collections/collections'
import {
  applyGearExclusiveChange,
  applyGearResonantChange,
  applyGearTierChange,
} from '@/features/gear/gear'
import {
  getFactionColor,
  getHeroCatalogEntry,
  getHeroClassKey,
} from '@/features/heroes/heroCatalog'
import { hasFoilEffect } from '@/lib/framedIcon'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/useAppStore'
import {
  ASCENSIONS,
  GEAR_SLOTS,
  type Ascension,
  type CollectionProgress,
  type GearPiece,
  type GearSlot as GearSlotId,
  type GearTier,
} from '@/types'
import { ArtifactDrawer } from './hero-detail/ArtifactDrawer'
import { AscensionDrawer } from './hero-detail/AscensionDrawer'
import { CollectionDrawer } from './hero-detail/CollectionDrawer'
import { EngraveDrawer } from './hero-detail/EngraveDrawer'
import { FurnitureDrawer } from './hero-detail/FurnitureDrawer'
import { GearPickerDrawer } from './hero-detail/GearPickerDrawer'
import { GearSlot } from './hero-detail/GearSlot'
import { LinkedHeroDrawer } from './hero-detail/LinkedHeroDrawer'

const ASCENDED_INDEX = ASCENSIONS.indexOf('ascended')

type DialogDrawer = 'ascension' | 'artifact' | 'collection' | 'engrave' | 'furniture' | 'linked'

interface HeroDetailDialogProps {
  heroId: string
  onClose: () => void
}

export function HeroDetailDialog({ heroId, onClose }: HeroDetailDialogProps) {
  const { t } = useTranslation()
  const progress = useAppStore((state) => state.heroes[heroId])
  const heroes = useAppStore((state) => state.heroes)
  const updateHero = useAppStore((state) => state.updateHero)
  const assignArtifact = useAppStore((state) => state.assignArtifact)
  const unassignArtifact = useAppStore((state) => state.unassignArtifact)
  const assignCollection = useAppStore((state) => state.assignCollection)
  const unassignCollection = useAppStore((state) => state.unassignCollection)
  const [showNotes, setShowNotes] = useState(false)
  const [pickerSlot, setPickerSlot] = useState<GearSlotId | null>(null)
  const [drawer, setDrawer] = useState<DialogDrawer | null>(null)
  const [confirmingRemove, setConfirmingRemove] = useState(false)

  const entry = getHeroCatalogEntry(heroId)

  if (!progress || !entry) return null

  const heroEntry = entry
  const linkedEntry =
    entry.faction === 'Dimensional' && progress.linkedHeroId
      ? getHeroCatalogEntry(progress.linkedHeroId)
      : undefined
  const starCount = Math.max(0, ASCENSIONS.indexOf(progress.ascension) - ASCENDED_INDEX)
  const artifact = getArtifact(progress.artifact)
  const collection = getCollection(progress.collection?.collectionId)
  const hasGear = GEAR_SLOTS.some((slot) => Boolean(progress.gear[slot]))

  function updateGear(slot: GearSlotId, patch: Partial<GearPiece>) {
    const piece: GearPiece = progress.gear[slot] ?? { slot, tier: 'none', stars: 0 }
    updateHero(heroId, { gear: { ...progress.gear, [slot]: { ...piece, ...patch, slot } } })
  }

  function changeGearTier(slot: GearSlotId, tier: GearTier) {
    const gear = { ...progress.gear }
    const next = applyGearTierChange(gear[slot], slot, tier, heroEntry.faction)

    if (next) {
      gear[slot] = next
    } else {
      delete gear[slot]
    }

    updateHero(heroId, { gear })
  }

  function changeGearResonant(slot: GearSlotId, resonant: boolean) {
    const piece = progress.gear[slot]
    if (!piece) return
    updateHero(heroId, {
      gear: {
        ...progress.gear,
        [slot]: applyGearResonantChange(piece, resonant, heroEntry.faction),
      },
    })
  }

  function changeGearExclusive(slot: GearSlotId, exclusive: boolean) {
    const piece = progress.gear[slot]
    if (!piece) return
    updateHero(heroId, {
      gear: {
        ...progress.gear,
        [slot]: applyGearExclusiveChange(piece, exclusive, heroEntry.faction),
      },
    })
  }

  function removeAllGear() {
    updateHero(heroId, { gear: {} })
    setConfirmingRemove(false)
  }

  function openGearPicker(slot?: GearSlotId) {
    const firstEmpty = GEAR_SLOTS.find((gearSlot) => !progress.gear[gearSlot])
    setConfirmingRemove(false)
    setDrawer(null)
    setPickerSlot(slot ?? firstEmpty ?? 'weapon')
  }

  function openDrawer(next: DialogDrawer) {
    setConfirmingRemove(false)
    setPickerSlot(null)
    setDrawer(next)
  }

  function closeDrawer() {
    setDrawer(null)
  }

  function setArtifact(artifactId: string) {
    if (artifactId) {
      assignArtifact(heroId, artifactId)
    } else {
      unassignArtifact(heroId)
    }
  }

  function setCollection(collectionId: string) {
    if (!collectionId) {
      unassignCollection(heroId)
      return
    }

    assignCollection(heroId, {
      collectionId,
      level: progress.collection?.level ?? 0,
      skillLevel: progress.collection?.skillLevel ?? 0,
      mythicStats: progress.collection?.mythicStats ?? 0,
    })
  }

  function updateCollection(patch: Partial<CollectionProgress>) {
    if (!progress.collection) return
    updateHero(heroId, { collection: { ...progress.collection, ...patch } })
  }

  function setAscension(ascension: Ascension) {
    updateHero(heroId, { ascension })
  }

  function renderGearSlot(slot: GearSlotId) {
    return (
      <GearSlot
        descriptor={{ kind: 'gear', slot, piece: progress.gear[slot] }}
        heroFaction={heroEntry.faction}
        heroType={heroEntry.type}
        onSelect={() => openGearPicker(slot)}
      />
    )
  }

  return (
    <DialogPrimitive.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="dialog-overlay fixed inset-0 z-50 bg-night/85 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={cn(
            'hero-detail-dialog fixed inset-0 z-50 flex h-dvh w-full flex-col overflow-hidden border-0 bg-night text-parch',
            'sm:inset-auto sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[92dvh] sm:w-[calc(100vw-2rem)] sm:max-w-3xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:border sm:border-line sm:shadow-[0_24px_80px_rgba(0,0,0,0.55)]',
          )}
        >
          <DialogPrimitive.Close className="icon-action absolute top-3 right-3 z-20 grid size-9 place-items-center rounded-full border border-line bg-night/80 text-muted hover:border-gild/40 hover:text-parch">
            <X size={17} aria-hidden="true" />
            <span className="sr-only">{t('common.close')}</span>
          </DialogPrimitive.Close>

          <div className="relative min-h-0 flex-1 overflow-y-auto">
            <div
              aria-hidden="true"
              className="star-chart pointer-events-none absolute inset-0 opacity-50"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(224,185,94,0.14),transparent_62%),radial-gradient(80%_60%_at_50%_100%,rgba(111,168,255,0.1),transparent_70%)]"
            />

            <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center px-3 pt-7 pb-5 sm:px-6 sm:pt-9">
              <div className="flex flex-col items-center gap-1 text-center">
                <button
                  type="button"
                  onClick={() => openDrawer('ascension')}
                  aria-label={`${t('hero.ascension')} · ${t(`ascension.${progress.ascension}`)}`}
                  className="flex flex-col items-center gap-1 rounded-2xl px-4 py-1.5 transition-colors hover:bg-gild/5 focus-visible:bg-gild/5 focus-visible:outline-none"
                >
                  <p className="font-display text-base text-gild sm:text-lg">
                    {t(`ascension.${starCount > 0 ? 'ascended' : progress.ascension}`)}
                  </p>
                  <Stars
                    total={5}
                    value={starCount}
                    size={16}
                    label={t('hero.ascension')}
                    className="justify-center"
                  />
                  <div className="flex items-center gap-1" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Gem
                        key={index}
                        size={11}
                        className={
                          index < starCount
                            ? 'fill-ember/70 text-ember'
                            : 'fill-transparent text-muted/30'
                        }
                      />
                    ))}
                  </div>
                </button>
                <DialogPrimitive.Description className="mt-1 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
                  {t(`faction.${entry.faction}`)} · {t(getHeroClassKey(entry))}
                </DialogPrimitive.Description>
                {entry.faction === 'Dimensional' ? (
                  <button
                    type="button"
                    onClick={() => openDrawer('linked')}
                    aria-label={`${t('common.edit')} ${t('hero.linkedHero')}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-[11px] text-arcane transition-colors hover:border-gild/40 hover:text-gild focus-visible:border-gild/40 focus-visible:text-gild focus-visible:outline-none"
                  >
                    <Link2 size={11} aria-hidden="true" />
                    {linkedEntry
                      ? t('hero.linkedTo', { name: linkedEntry.displayName })
                      : t('hero.linkHero')}
                    <Pencil size={9} aria-hidden="true" />
                  </button>
                ) : null}
                <DialogPrimitive.Title className="font-display text-2xl leading-tight text-parch sm:text-3xl">
                  {entry.displayName}
                </DialogPrimitive.Title>
                <button
                  type="button"
                  aria-pressed={Boolean(progress.priority)}
                  title={t('hero.targetHint')}
                  onClick={() => updateHero(heroId, { priority: !progress.priority })}
                  className={cn(
                    'mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-gild/50 focus-visible:outline-none',
                    progress.priority
                      ? 'border-gild/50 bg-gild/10 text-gild'
                      : 'border-line bg-night/30 text-muted hover:border-gild/40 hover:text-parch',
                  )}
                >
                  <Target size={13} aria-hidden="true" />
                  {t('hero.target')}
                </button>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                  <Badge variant="outline">
                    {t('hero.level')} {progress.level}
                  </Badge>
                  <Badge variant="cyan">
                    {t('hero.signatureItem')} {progress.signatureItem}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => openDrawer('furniture')}
                    aria-label={`${t('common.edit')} ${t('hero.furniture')}`}
                    title={`${t('common.edit')} ${t('hero.furniture')}`}
                    className="rounded-full focus-visible:ring-2 focus-visible:ring-gild/50 focus-visible:outline-none"
                  >
                    <Badge variant="rose" className="transition-colors hover:border-gild/50">
                      {t('hero.furniture')} {progress.furniture}
                      <Pencil size={9} aria-hidden="true" />
                    </Badge>
                  </button>
                  <Badge variant="muted">
                    {t('hero.engraving')} {progress.engraving}
                  </Badge>
                </div>
              </div>

              <div className="mt-5 grid w-full grid-cols-[minmax(0,3.75rem)_minmax(0,1fr)_minmax(0,3.75rem)] items-center gap-2 sm:mt-7 sm:grid-cols-[6.5rem_minmax(0,1fr)_6.5rem] sm:gap-5">
                <div className="flex flex-col gap-2 sm:gap-3">
                  {renderGearSlot('weapon')}
                  {renderGearSlot('helmet')}
                  <GearSlot
                    descriptor={{ kind: 'artifact', artifact }}
                    onSelect={() => openDrawer('artifact')}
                  />
                </div>

                <div className="relative flex items-center justify-center">
                  <div
                    aria-hidden="true"
                    className="absolute bottom-0 left-1/2 size-40 -translate-x-1/2 translate-y-2 rounded-full opacity-25 blur-3xl sm:size-56"
                    style={{ backgroundColor: getFactionColor(entry.faction) }}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute bottom-2 left-1/2 size-32 -translate-x-1/2 rounded-full border border-gild/15 sm:size-44"
                  />
                  <div
                    className={cn(
                      'relative w-full max-w-[12rem] sm:max-w-[15rem]',
                      hasFoilEffect(progress) && 'hero-foil rounded-2xl',
                    )}
                  >
                    <FramedHeroIcon
                      heroId={entry.id}
                      ascension={progress.ascension}
                      signatureItem={progress.signatureItem}
                      furniture={progress.furniture}
                      engraving={progress.engraving}
                      alt={entry.displayName}
                      className="w-full drop-shadow-[0_18px_40px_rgba(4,7,20,0.7)]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:gap-3">
                  {renderGearSlot('chest')}
                  {renderGearSlot('boots')}
                  <GearSlot
                    descriptor={{ kind: 'collection', collection, progress: progress.collection }}
                    onSelect={() => openDrawer('collection')}
                  />
                </div>
              </div>

              {showNotes ? (
                <div className="mt-4 w-full rounded-xl border border-line bg-panel/70 p-3 text-left sm:mt-5">
                  <p className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
                    {t('hero.notes')}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap text-parch/90">
                    {progress.notes?.trim() || t('hero.noNotes')}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <footer className="relative z-10 border-t border-line bg-night/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-4 sm:pt-3">
            <div className="mx-auto grid max-w-2xl grid-cols-5 gap-1.5 sm:gap-2">
              <DetailAction
                icon={Trash2}
                label={
                  confirmingRemove ? t('heroDialog.confirmRemove') : t('heroDialog.removeGear')
                }
                title={confirmingRemove ? t('heroDialog.removeAllHint') : undefined}
                disabledHint={t('heroDialog.noGear')}
                danger={confirmingRemove}
                disabled={!hasGear}
                onClick={() => (confirmingRemove ? removeAllGear() : setConfirmingRemove(true))}
              />
              <DetailAction
                icon={ShieldPlus}
                label={t('heroDialog.equipGear')}
                onClick={() => openGearPicker()}
              />
              <DetailAction
                icon={Gem}
                label={t('heroDialog.engrave')}
                onClick={() => openDrawer('engrave')}
              />
              <DetailAction icon={Sparkles} label={t('heroDialog.skills')} disabled />
              <DetailAction
                icon={StickyNote}
                label={t('hero.notes')}
                pressed={showNotes}
                onClick={() => {
                  setConfirmingRemove(false)
                  setShowNotes((visible) => !visible)
                }}
              />
            </div>
          </footer>

          {pickerSlot ? (
            <GearPickerDrawer
              slot={pickerSlot}
              piece={progress.gear[pickerSlot]}
              heroFaction={heroEntry.faction}
              heroType={heroEntry.type}
              signatureItem={progress.signatureItem}
              onSelectSlot={setPickerSlot}
              onClose={() => setPickerSlot(null)}
              onTierChange={(tier) => changeGearTier(pickerSlot, tier)}
              onStarsChange={(stars) => updateGear(pickerSlot, { stars })}
              onResonantChange={(resonant) => changeGearResonant(pickerSlot, resonant)}
              onExclusiveChange={(exclusive) => changeGearExclusive(pickerSlot, exclusive)}
              onFactionChange={(faction) => updateGear(pickerSlot, { faction })}
              onSignatureChange={(signatureItem) => updateHero(heroId, { signatureItem })}
            />
          ) : null}

          {drawer === 'engrave' ? (
            <EngraveDrawer
              engraving={progress.engraving}
              onChange={(engraving) => updateHero(heroId, { engraving })}
              onClose={closeDrawer}
            />
          ) : null}

          {drawer === 'furniture' ? (
            <FurnitureDrawer
              furniture={progress.furniture}
              onChange={(furniture) => updateHero(heroId, { furniture })}
              onClose={closeDrawer}
            />
          ) : null}

          {drawer === 'artifact' ? (
            <ArtifactDrawer
              artifactId={progress.artifact}
              heroName={heroEntry.displayName}
              heroClass={heroEntry.class}
              onChange={setArtifact}
              onClose={closeDrawer}
            />
          ) : null}

          {drawer === 'collection' ? (
            <CollectionDrawer
              collection={progress.collection}
              heroName={heroEntry.displayName}
              heroClass={heroEntry.class}
              onSelect={setCollection}
              onChange={updateCollection}
              onClose={closeDrawer}
            />
          ) : null}

          {drawer === 'linked' ? (
            <LinkedHeroDrawer
              heroName={heroEntry.displayName}
              linkedHeroId={progress.linkedHeroId}
              heroes={heroes}
              onChange={(linkedHeroId) => updateHero(heroId, { linkedHeroId })}
              onClose={closeDrawer}
            />
          ) : null}

          {drawer === 'ascension' ? (
            <AscensionDrawer
              ascension={progress.ascension}
              heroName={heroEntry.displayName}
              onChange={setAscension}
              onClose={closeDrawer}
            />
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

interface DetailActionProps {
  icon: LucideIcon
  label: string
  onClick?: () => void
  pressed?: boolean
  disabled?: boolean
  danger?: boolean
  title?: string
  disabledHint?: string
}

function DetailAction({
  icon: Icon,
  label,
  onClick,
  pressed,
  disabled,
  danger,
  title,
  disabledHint,
}: DetailActionProps) {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      title={disabled ? (disabledHint ?? t('heroDialog.readOnly')) : title}
      className={cn(
        'flex flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 text-[10px] leading-tight font-semibold transition-colors sm:flex-row sm:gap-2 sm:py-2.5 sm:text-xs',
        danger
          ? 'border-ember/50 bg-ember/10 text-ember'
          : pressed
            ? 'border-gild/50 bg-gild/10 text-gild'
            : 'border-line bg-panel/60 text-muted',
        disabled ? 'cursor-not-allowed opacity-45' : 'hover:border-gild/40 hover:text-parch',
      )}
    >
      <Icon size={16} aria-hidden="true" className="shrink-0" />
      <span>{label}</span>
    </button>
  )
}
