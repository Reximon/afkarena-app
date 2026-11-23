import { useMemo, useState } from 'react'
import { Check, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FramedHeroIcon } from '@/components/heroes/FramedHeroIcon'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { getArtifact } from '@/features/artifacts/artifacts'
import { getCollection } from '@/features/collections/collections'
import {
  applyGearExclusiveChange,
  applyGearResonantChange,
  applyGearTierChange,
  normalizeGearPiece,
} from '@/features/gear/gear'
import {
  getFactionColor,
  getHeroCatalogEntry,
  getHeroClassKey,
  heroCatalog,
} from '@/features/heroes/heroCatalog'
import { createDefaultHeroProgress } from '@/features/persistence/defaults'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/useAppStore'
import {
  GEAR_SLOTS,
  type CollectionProgress,
  type GearPiece,
  type GearSlot,
  type GearTier,
  type HeroProgress,
} from '@/types'
import { ArtifactDrawer } from './hero-detail/ArtifactDrawer'
import { AscensionStars } from './hero-detail/AscensionStars'
import { CollectionDrawer } from './hero-detail/CollectionDrawer'
import { GearPickerDrawer } from './hero-detail/GearPickerDrawer'
import { GearSlot as GearSlotTile } from './hero-detail/GearSlot'
import { HeroPortraitStage } from './hero-detail/HeroPortraitStage'
import { InvestmentPanel } from './hero-detail/InvestmentPanel'
import { NotesField } from './hero-detail/NotesField'

type ScreenDrawer = 'artifact' | 'collection'

interface HeroDetailScreenProps {
  heroId: string | null
  onClose: () => void
}

export function HeroDetailScreen({ heroId, onClose }: HeroDetailScreenProps) {
  const { t } = useTranslation()
  const heroes = useAppStore((state) => state.heroes)
  const addHero = useAppStore((state) => state.addHero)
  const updateHero = useAppStore((state) => state.updateHero)

  const [createdId, setCreatedId] = useState<string | null>(null)
  const [draft, setDraft] = useState<HeroProgress | null>(null)
  const [search, setSearch] = useState('')
  const [pickerSlot, setPickerSlot] = useState<GearSlot | null>(null)
  const [drawer, setDrawer] = useState<ScreenDrawer | null>(null)

  const activeId = heroId ?? createdId
  const liveHero = activeId ? heroes[activeId] : undefined
  const progress = liveHero ?? draft
  const entry = progress ? getHeroCatalogEntry(progress.heroId) : undefined

  const filteredHeroes = useMemo(() => {
    const term = search.trim().toLowerCase()

    return heroCatalog
      .filter((hero) => {
        if (!term) return true
        return (
          hero.displayName.toLowerCase().includes(term) || hero.name.toLowerCase().includes(term)
        )
      })
      .slice(0, 80)
  }, [search])

  function commit(patch: Partial<HeroProgress>) {
    if (liveHero && activeId) {
      updateHero(activeId, patch)
    } else {
      setDraft((current) => (current ? { ...current, ...patch } : current))
    }
  }

  function updateGear(slot: GearSlot, patch: Partial<GearPiece>) {
    if (!progress) return
    const piece = progress.gear[slot] ?? { slot, tier: 'none' as GearTier, stars: 0 as const }
    commit({ gear: { ...progress.gear, [slot]: { ...piece, ...patch, slot } } })
  }

  function setGearTier(slot: GearSlot, tier: GearTier) {
    if (!progress) return
    const gear = { ...progress.gear }
    const next = applyGearTierChange(gear[slot], slot, tier, entry?.faction)

    if (next) {
      gear[slot] = next
    } else {
      delete gear[slot]
    }

    commit({ gear })
  }

  function setGearResonant(slot: GearSlot, resonant: boolean) {
    const piece = progress?.gear[slot]
    if (!piece) return
    commit({
      gear: {
        ...progress?.gear,
        [slot]: applyGearResonantChange(piece, resonant, entry?.faction),
      },
    })
  }

  function setGearExclusive(slot: GearSlot, exclusive: boolean) {
    const piece = progress?.gear[slot]
    if (!piece) return
    commit({
      gear: {
        ...progress?.gear,
        [slot]: applyGearExclusiveChange(piece, exclusive, entry?.faction),
      },
    })
  }

  function renderSlot(slot: GearSlot) {
    return (
      <GearSlotTile
        descriptor={{ kind: 'gear', slot, piece: progress?.gear[slot] }}
        heroFaction={entry?.faction}
        heroType={entry?.type}
        onSelect={() => openGearPicker(slot)}
      />
    )
  }

  function openGearPicker(slot: GearSlot) {
    setDrawer(null)
    setPickerSlot(slot)
  }

  function openDrawer(next: ScreenDrawer) {
    setPickerSlot(null)
    setDrawer(next)
  }

  function closeDrawer() {
    setDrawer(null)
    setPickerSlot(null)
  }

  function setArtifact(artifactId: string) {
    if (!progress) return
    commit({
      artifact: artifactId || undefined,
      collection:
        artifactId && progress.collection
          ? { ...progress.collection, collectionId: undefined }
          : progress.collection,
    })
  }

  function setCollection(collectionId: string) {
    if (!collectionId) {
      commit({ collection: undefined })
      return
    }

    commit({
      artifact: undefined,
      collection: {
        collectionId,
        level: progress?.collection?.level ?? 0,
        skillLevel: progress?.collection?.skillLevel ?? 0,
        mythicStats: progress?.collection?.mythicStats ?? 0,
      },
    })
  }

  function updateCollection(patch: Partial<CollectionProgress>) {
    if (!progress?.collection) return
    commit({ collection: { ...progress.collection, ...patch } })
  }

  function handleAdd() {
    if (!draft || !entry) return

    const gear = { ...draft.gear }
    for (const slot of GEAR_SLOTS) {
      const piece = gear[slot]
      if (piece) gear[slot] = normalizeGearPiece(piece, entry.faction)
    }

    const collection =
      draft.collection && draft.artifact
        ? { ...draft.collection, collectionId: undefined }
        : draft.collection

    addHero({
      ...draft,
      gear,
      collection,
      heroId: draft.heroId,
      linkedHeroId: entry.faction === 'Dimensional' ? draft.linkedHeroId || undefined : undefined,
      updatedAt: new Date().toISOString(),
    })
    setCreatedId(draft.heroId)
    setDraft(null)
  }

  const artifactDef = getArtifact(progress?.artifact)
  const collectionDef = getCollection(progress?.collection?.collectionId)

  const overlay =
    pickerSlot && progress && entry ? (
      <GearPickerDrawer
        slot={pickerSlot}
        piece={progress.gear[pickerSlot]}
        heroFaction={entry.faction}
        heroType={entry.type}
        signatureItem={progress.signatureItem}
        onSelectSlot={setPickerSlot}
        onClose={closeDrawer}
        onTierChange={(tier) => setGearTier(pickerSlot, tier)}
        onStarsChange={(stars) => updateGear(pickerSlot, { stars })}
        onResonantChange={(resonant) => setGearResonant(pickerSlot, resonant)}
        onExclusiveChange={(exclusive) => setGearExclusive(pickerSlot, exclusive)}
        onFactionChange={(faction) => updateGear(pickerSlot, { faction })}
        onSignatureChange={(signatureItem) => commit({ signatureItem })}
      />
    ) : drawer === 'artifact' && progress && entry ? (
      <ArtifactDrawer
        artifactId={progress.artifact}
        heroName={entry.displayName}
        heroClass={entry.class}
        onChange={setArtifact}
        onClose={closeDrawer}
      />
    ) : drawer === 'collection' && progress && entry ? (
      <CollectionDrawer
        collection={progress.collection}
        heroName={entry.displayName}
        heroClass={entry.class}
        onSelect={setCollection}
        onChange={updateCollection}
        onClose={closeDrawer}
      />
    ) : null

  const footer = liveHero ? (
    <>
      <span className="mr-auto flex items-center gap-1.5 text-xs text-muted">
        <Check size={14} className="text-gild" aria-hidden="true" />
        {t('heroScreen.autoSaved')}
      </span>
      <Button variant="ghost" onClick={onClose}>
        {t('common.close')}
      </Button>
    </>
  ) : draft ? (
    <>
      <Button variant="ghost" className="mr-auto" onClick={() => setDraft(null)}>
        {t('heroScreen.backToCatalog')}
      </Button>
      <Button variant="ghost" onClick={onClose}>
        {t('common.cancel')}
      </Button>
      <Button onClick={handleAdd}>{t('common.save')}</Button>
    </>
  ) : (
    <Button variant="ghost" onClick={onClose}>
      {t('common.cancel')}
    </Button>
  )

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      title={entry?.displayName ?? t('roster.addHeroTitle')}
      description={
        entry
          ? `${t(`faction.${entry.faction}`)} · ${t(getHeroClassKey(entry))}`
          : t('roster.addHeroBody')
      }
      className="h-dvh max-h-none w-full max-w-5xl rounded-none border-0 sm:h-[min(92dvh,56rem)] sm:w-[calc(100vw-2rem)] sm:rounded-2xl sm:border"
      footer={footer}
      overlay={overlay}
    >
      {progress && entry ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <HeroPortraitStage
            entry={entry}
            progress={progress}
            leftSlots={
              <>
                {renderSlot('weapon')}
                {renderSlot('helmet')}
                <GearSlotTile
                  descriptor={{ kind: 'artifact', artifact: artifactDef }}
                  onSelect={() => openDrawer('artifact')}
                />
              </>
            }
            rightSlots={
              <>
                {renderSlot('chest')}
                {renderSlot('boots')}
                <GearSlotTile
                  descriptor={{
                    kind: 'collection',
                    collection: collectionDef,
                    progress: progress.collection,
                  }}
                  onSelect={() => openDrawer('collection')}
                />
              </>
            }
            ascensionControl={
              <AscensionStars
                value={progress.ascension}
                onChange={(ascension) => commit({ ascension })}
              />
            }
          />

          <div className="space-y-5">
            <InvestmentPanel entry={entry} progress={progress} commit={commit} />
            <NotesField value={progress.notes ?? ''} onChange={(notes) => commit({ notes })} />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('roster.searchCatalog')}
              className="pl-9"
              autoFocus
            />
          </div>

          <div className="grid max-h-[60vh] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3 md:grid-cols-4">
            {filteredHeroes.map((hero) => {
              const owned = Boolean(heroes[hero.id])

              return (
                <button
                  key={hero.id}
                  type="button"
                  disabled={owned}
                  onClick={() => setDraft(createDefaultHeroProgress(hero.id))}
                  className={cn(
                    'relative overflow-hidden rounded-xl border border-line bg-night/30 p-2 text-left transition-[color,background-color,border-color,transform] duration-150 enabled:hover:border-gild/30 enabled:hover:bg-dusk/40 enabled:active:scale-[0.97]',
                    owned && 'cursor-not-allowed opacity-45',
                  )}
                >
                  <FramedHeroIcon
                    heroId={hero.id}
                    ascension={hero.isAwakened ? 'ascended' : 'elite'}
                    signatureItem={0}
                    furniture={0}
                    engraving={0}
                    alt={hero.displayName}
                    className="w-full"
                  />
                  <p className="mt-1.5 truncate text-xs font-semibold text-parch">
                    {hero.displayName}
                  </p>
                  <p className="truncate font-mono text-[9px] tracking-wide text-muted">
                    {t(`faction.${hero.faction}`)}
                  </p>
                  <span
                    className="absolute top-3 left-3 size-2 rounded-full ring-2 ring-night/70"
                    style={{ backgroundColor: getFactionColor(hero.faction) }}
                    aria-hidden="true"
                  />
                  {owned ? (
                    <Badge variant="muted" className="absolute top-2 right-2">
                      {t('roster.owned')}
                    </Badge>
                  ) : null}
                </button>
              )
            })}
          </div>

          {filteredHeroes.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">{t('roster.noResults')}</p>
          ) : null}
        </div>
      )}
    </Dialog>
  )
}
