import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import { FramedHeroIcon } from '@/components/heroes/FramedHeroIcon'
import { artifacts, getArtifact } from '@/features/artifacts/artifacts'
import {
  applyGearExclusiveChange,
  applyGearResonantChange,
  applyGearTierChange,
  getGearFactionDisplay,
  isExclusiveTier,
  normalizeGearPiece,
} from '@/features/gear/gear'
import { getFactionColor, getHeroCatalogEntry, heroCatalog } from '@/features/heroes/heroCatalog'
import { createDefaultHeroProgress } from '@/features/persistence/defaults'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/useAppStore'
import {
  ASCENSIONS,
  FACTIONS,
  GEAR_SLOTS,
  GEAR_TIERS,
  type Ascension,
  type Faction,
  type GearPiece,
  type GearSlot,
  type GearTier,
  type HeroProgress,
} from '@/types'

interface HeroFormDialogProps {
  heroId: string | null
  onClose: () => void
}

export function HeroFormDialog({ heroId, onClose }: HeroFormDialogProps) {
  const { t } = useTranslation()
  const heroes = useAppStore((state) => state.heroes)
  const addHero = useAppStore((state) => state.addHero)
  const updateHero = useAppStore((state) => state.updateHero)
  const editingHero = heroId ? heroes[heroId] : undefined
  const [selectedId, setSelectedId] = useState(heroId ?? '')
  const [draft, setDraft] = useState<HeroProgress>(
    () => editingHero ?? createDefaultHeroProgress(''),
  )
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)

  const selectedEntry = selectedId ? getHeroCatalogEntry(selectedId) : undefined
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

  const linkedHeroGroups = useMemo(() => {
    if (selectedEntry?.faction !== 'Dimensional') return []

    return FACTIONS.filter((faction) => faction !== 'Dimensional')
      .map((faction) => ({
        faction,
        heroes: heroCatalog
          .filter((hero) => hero.faction === faction)
          .sort((a, b) => a.displayName.localeCompare(b.displayName)),
      }))
      .filter((group) => group.heroes.length > 0)
  }, [selectedEntry])

  const linkedHeroEntry = draft.linkedHeroId ? getHeroCatalogEntry(draft.linkedHeroId) : undefined
  const linkedHeroIsListed = linkedHeroGroups.some((group) =>
    group.heroes.some((hero) => hero.id === draft.linkedHeroId),
  )

  function selectHero(id: string) {
    const existing = heroes[id]
    setSelectedId(id)
    setDraft(existing ? { ...existing, gear: { ...existing.gear } } : createDefaultHeroProgress(id))
    setError(null)
  }

  function patchDraft(patch: Partial<HeroProgress>) {
    setDraft((current) => ({ ...current, ...patch }))
  }

  function updateGear(slot: GearSlot, patch: Partial<GearPiece>) {
    setDraft((current) => {
      const piece = current.gear[slot] ?? { slot, tier: 'none' as GearTier, stars: 0 as const }

      return {
        ...current,
        gear: {
          ...current.gear,
          [slot]: { ...piece, ...patch, slot },
        },
      }
    })
  }

  function setGearTier(slot: GearSlot, tier: GearTier) {
    setDraft((current) => {
      const gear = { ...current.gear }
      const next = applyGearTierChange(gear[slot], slot, tier, selectedEntry?.faction)

      if (next) {
        gear[slot] = next
      } else {
        delete gear[slot]
      }

      return { ...current, gear }
    })
  }

  function setGearResonant(slot: GearSlot, resonant: boolean) {
    setDraft((current) => {
      const piece = current.gear[slot]
      if (!piece) return current

      return {
        ...current,
        gear: {
          ...current.gear,
          [slot]: applyGearResonantChange(piece, resonant, selectedEntry?.faction),
        },
      }
    })
  }

  function setGearExclusive(slot: GearSlot, exclusive: boolean) {
    setDraft((current) => {
      const piece = current.gear[slot]
      if (!piece) return current

      return {
        ...current,
        gear: {
          ...current.gear,
          [slot]: applyGearExclusiveChange(piece, exclusive, selectedEntry?.faction),
        },
      }
    })
  }

  function handleSave() {
    if (!selectedId || !getHeroCatalogEntry(selectedId)) {
      setError(t('roster.selectHero'))
      return
    }

    const gear = { ...draft.gear }
    if (selectedEntry) {
      for (const slot of GEAR_SLOTS) {
        const piece = gear[slot]
        if (piece) gear[slot] = normalizeGearPiece(piece, selectedEntry.faction)
      }
    }

    const payload: HeroProgress = {
      ...draft,
      gear,
      heroId: selectedId,
      linkedHeroId:
        selectedEntry?.faction === 'Dimensional' ? draft.linkedHeroId || undefined : undefined,
      updatedAt: new Date().toISOString(),
    }

    if (heroes[selectedId]) {
      updateHero(selectedId, payload)
    } else {
      addHero(payload)
    }

    onClose()
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      title={heroId ? t('roster.editHeroTitle') : t('roster.addHeroTitle')}
      description={heroId ? t('roster.editHeroBody') : t('roster.addHeroBody')}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={!selectedId}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      {!heroId ? (
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

          <div className="grid max-h-[42vh] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
            {filteredHeroes.map((hero) => {
              const owned = Boolean(heroes[hero.id])
              const selected = selectedId === hero.id

              return (
                <button
                  key={hero.id}
                  type="button"
                  disabled={owned}
                  onClick={() => selectHero(hero.id)}
                  className={cn(
                    'relative overflow-hidden rounded-xl border p-2 text-left transition-colors',
                    selected
                      ? 'border-gold/60 bg-gold/10'
                      : 'border-line bg-void/30 hover:border-gold/30 hover:bg-violet/40',
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
                  <p className="mt-1.5 truncate text-xs font-semibold text-bone">
                    {hero.displayName}
                  </p>
                  <p className="truncate font-mono text-[9px] tracking-wide text-muted">
                    {t(`faction.${hero.faction}`)}
                  </p>
                  <span
                    className="absolute top-3 left-3 size-2 rounded-full ring-2 ring-void/70"
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

          {selectedId && !heroId ? (
            <div className="flex items-center gap-2 rounded-xl border border-gold/25 bg-gold/5 px-3 py-2 text-sm text-bone">
              <Sparkles size={15} className="text-gold" aria-hidden="true" />
              {selectedEntry?.displayName}
            </div>
          ) : null}
        </div>
      ) : null}

      {selectedId ? (
        <div className={cn('space-y-5', !heroId && 'mt-5 border-t border-line pt-5')}>
          {selectedEntry ? (
            <div className="flex items-center gap-4 rounded-xl border border-line bg-void/30 p-3">
              <FramedHeroIcon
                heroId={selectedEntry.id}
                ascension={draft.ascension}
                signatureItem={draft.signatureItem}
                furniture={draft.furniture}
                engraving={draft.engraving}
                alt={selectedEntry.displayName}
                className="w-20 shrink-0"
              />
              <div className="min-w-0">
                <h3 className="truncate font-display text-2xl text-bone">
                  {selectedEntry.displayName}
                </h3>
                <p className="mt-1 font-mono text-[10px] tracking-wide text-muted uppercase">
                  {t(`faction.${selectedEntry.faction}`)} · {t(`heroClass.${selectedEntry.class}`)}
                </p>
                <p className="mt-1 text-xs text-muted">{selectedEntry.roles.join(' · ')}</p>
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('hero.ascension')}>
              <Select
                value={draft.ascension}
                onChange={(event) => patchDraft({ ascension: event.target.value as Ascension })}
              >
                {ASCENSIONS.map((ascension) => (
                  <option key={ascension} value={ascension}>
                    {t(`ascension.${ascension}`)}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label={t('hero.level')}>
              <Input
                type="number"
                min={1}
                max={1000}
                value={draft.level}
                onChange={(event) =>
                  patchDraft({ level: Math.max(1, Number(event.target.value) || 1) })
                }
              />
            </Field>

            <Field label={t('hero.signatureItem')}>
              <Select
                value={draft.signatureItem}
                onChange={(event) => patchDraft({ signatureItem: Number(event.target.value) })}
              >
                {[0, 10, 20, 30, 40].map((value) => (
                  <option key={value} value={value}>
                    {value === 0 ? t('common.none') : value}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label={t('hero.furniture')}>
              <Select
                value={draft.furniture}
                onChange={(event) =>
                  patchDraft({
                    furniture: Number(event.target.value) as HeroProgress['furniture'],
                  })
                }
              >
                {[0, 3, 9, 36].map((value) => (
                  <option key={value} value={value}>
                    {value === 0 ? t('common.none') : value}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label={t('hero.engraving')}>
              <Select
                value={draft.engraving}
                onChange={(event) =>
                  patchDraft({
                    engraving: Number(event.target.value) as HeroProgress['engraving'],
                  })
                }
              >
                {[0, 30, 60, 80].map((value) => (
                  <option key={value} value={value}>
                    {value === 0 ? t('common.none') : value}
                  </option>
                ))}
              </Select>
            </Field>

            <label className="flex items-center gap-2.5 self-end rounded-xl border border-line bg-void/30 px-3 py-2.5 text-sm text-bone">
              <input
                type="checkbox"
                checked={draft.inCrystal}
                onChange={(event) => patchDraft({ inCrystal: event.target.checked })}
                className="size-4 accent-gold"
              />
              {t('hero.inCrystal')}
            </label>
          </div>

          {selectedEntry?.faction === 'Dimensional' ? (
            <Field label={t('hero.linkedHero')} hint={t('hero.linkedHeroHint')}>
              <Select
                value={draft.linkedHeroId ?? ''}
                onChange={(event) => patchDraft({ linkedHeroId: event.target.value || undefined })}
              >
                <option value="">{t('common.none')}</option>
                {linkedHeroEntry && !linkedHeroIsListed ? (
                  <option value={linkedHeroEntry.id}>{linkedHeroEntry.displayName}</option>
                ) : null}
                {linkedHeroGroups.map((group) => (
                  <optgroup key={group.faction} label={t(`faction.${group.faction}`)}>
                    {group.heroes.map((hero) => (
                      <option key={hero.id} value={hero.id}>
                        {hero.displayName}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </Select>
            </Field>
          ) : null}

          <section>
            <h3 className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
              {t('hero.gear')}
            </h3>
            <div className="mt-2 space-y-2">
              {GEAR_SLOTS.map((slot) => {
                const piece = draft.gear[slot]
                const factionDisplay = getGearFactionDisplay(piece, selectedEntry?.faction)
                const exclusiveChecked =
                  piece?.exclusive ?? (piece ? isExclusiveTier(piece.tier) : false)
                const resonantChecked = piece?.resonant ?? false

                return (
                  <div
                    key={slot}
                    className="space-y-2 rounded-xl border border-line bg-void/25 p-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-1 text-sm text-bone">{t(`gearSlot.${slot}`)}</span>
                      <div className="flex flex-wrap items-center gap-3">
                        <label
                          className="flex items-center gap-1.5 text-[11px] text-muted"
                          title={t('hero.resonantHint')}
                        >
                          <input
                            type="checkbox"
                            checked={resonantChecked}
                            disabled={!piece}
                            onChange={(event) => setGearResonant(slot, event.target.checked)}
                            className="size-3.5 accent-cyan"
                          />
                          {t('hero.resonant')}
                        </label>
                        <label
                          className="flex items-center gap-1.5 text-[11px] text-muted"
                          title={t('hero.exclusiveHint')}
                        >
                          <input
                            type="checkbox"
                            checked={exclusiveChecked}
                            disabled={!piece}
                            onChange={(event) => setGearExclusive(slot, event.target.checked)}
                            className="size-3.5 accent-gold"
                          />
                          {t('hero.exclusive')}
                        </label>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3">
                      <Select
                        value={piece?.tier ?? 'none'}
                        onChange={(event) => setGearTier(slot, event.target.value as GearTier)}
                        aria-label={`${t(`gearSlot.${slot}`)} ${t('roster.tier')}`}
                      >
                        {GEAR_TIERS.map((tier) => (
                          <option key={tier} value={tier}>
                            {t(`gearTier.${tier}`)}
                          </option>
                        ))}
                      </Select>
                      <Select
                        value={piece?.stars ?? 0}
                        disabled={!piece}
                        onChange={(event) =>
                          updateGear(slot, {
                            stars: Number(event.target.value) as GearPiece['stars'],
                          })
                        }
                        aria-label={`${t(`gearSlot.${slot}`)} ${t('roster.stars')}`}
                      >
                        {[0, 1, 2, 3, 4, 5].map((stars) => (
                          <option key={stars} value={stars}>
                            {stars}★
                          </option>
                        ))}
                      </Select>

                      {factionDisplay.kind === 'select' ? (
                        <Select
                          value={piece?.faction ?? ''}
                          disabled={!piece}
                          onChange={(event) =>
                            updateGear(slot, {
                              faction: (event.target.value || undefined) as Faction | undefined,
                            })
                          }
                          aria-label={`${t(`gearSlot.${slot}`)} ${t('hero.faction')}`}
                        >
                          <option value="">{t('common.none')}</option>
                          {FACTIONS.map((faction) => (
                            <option key={faction} value={faction}>
                              {t(`faction.${faction}`)}
                            </option>
                          ))}
                        </Select>
                      ) : factionDisplay.kind === 'same' ? (
                        <div className="flex h-10 items-center rounded-xl border border-cyan/30 bg-cyan/5 px-3 text-xs text-cyan">
                          {t('hero.sameFaction')}: {t(`faction.${factionDisplay.faction}`)}
                        </div>
                      ) : (
                        <div className="flex h-10 items-center rounded-xl border border-line bg-void/30 px-3 text-xs text-muted">
                          {t('hero.noFaction')}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <Field label={t('hero.artifact')}>
              <Select
                value={draft.artifact ?? ''}
                onChange={(event) => patchDraft({ artifact: event.target.value || undefined })}
              >
                <option value="">{t('common.none')}</option>
                <optgroup label={t('artifacts.duraGroup')}>
                  {artifacts.map((artifact) => (
                    <option key={artifact.id} value={artifact.id}>
                      {artifact.name}
                    </option>
                  ))}
                </optgroup>
                {draft.artifact && !getArtifact(draft.artifact) ? (
                  <option value={draft.artifact}>{draft.artifact}</option>
                ) : null}
              </Select>
            </Field>

            <Field label={t('hero.collection')}>
              <Select
                value={draft.collection?.level ?? 0}
                onChange={(event) =>
                  patchDraft({
                    collection: {
                      level: Number(event.target.value) as NonNullable<
                        HeroProgress['collection']
                      >['level'],
                      mythicStats: draft.collection?.mythicStats ?? 0,
                    },
                  })
                }
              >
                {[0, 1, 2, 3].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label={t('hero.mythicStats')}>
              <Select
                value={draft.collection?.mythicStats ?? 0}
                onChange={(event) =>
                  patchDraft({
                    collection: {
                      level: draft.collection?.level ?? 0,
                      mythicStats: Number(event.target.value) as NonNullable<
                        HeroProgress['collection']
                      >['mythicStats'],
                    },
                  })
                }
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label={t('hero.notes')}>
            <Textarea
              value={draft.notes ?? ''}
              onChange={(event) => patchDraft({ notes: event.target.value })}
              placeholder={t('roster.notesPlaceholder')}
            />
          </Field>

          {error ? <p className="text-sm text-rose">{error}</p> : null}
        </div>
      ) : null}
    </Dialog>
  )
}
