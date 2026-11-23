import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { GripVertical, Plus, Search, X } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import { FramedHeroIcon } from '@/components/heroes/FramedHeroIcon'
import {
  getFactionColor,
  getHeroCatalogEntry,
  getHeroClassKey,
} from '@/features/heroes/heroCatalog'
import { createEmptyTeam } from '@/features/persistence/defaults'
import { assignHeroToSlot, resolveDropTarget } from '@/features/teams/teamSlots'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/useAppStore'
import {
  TEAM_MODES,
  type HeroCatalogEntry,
  type HeroProgress,
  type Team,
  type TeamMode,
  type TeamSlot,
} from '@/types'

interface TeamFormDialogProps {
  teamId: string | null
  onClose: () => void
}

interface OwnedHero {
  hero: HeroProgress
  entry: HeroCatalogEntry
}

interface RosterHeroProps {
  hero: HeroProgress
  entry: HeroCatalogEntry
  used: boolean
}

function RosterHero({ hero, entry, used }: RosterHeroProps) {
  const { t } = useTranslation()
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `roster-${hero.heroId}`,
    data: { heroId: hero.heroId },
  })

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      style={{ touchAction: 'none' }}
      title={t('teams.dragHero', { name: entry.displayName })}
      className={cn(
        'group relative flex flex-col items-center rounded-xl border border-line bg-night/30 p-1.5 text-center transition-colors hover:border-gild/30 hover:bg-dusk/40',
        used && 'border-arcane/25 bg-arcane/5',
        isDragging && 'opacity-40',
      )}
    >
      <FramedHeroIcon
        heroId={entry.id}
        ascension={hero.ascension}
        signatureItem={hero.signatureItem}
        furniture={hero.furniture}
        engraving={hero.engraving}
        alt={entry.displayName}
        className="w-full"
      />
      <span className="mt-1 w-full truncate text-[11px] font-semibold text-parch">
        {entry.displayName}
      </span>
      <span className="mt-0.5 flex w-full items-center justify-center gap-1 font-mono text-[8px] tracking-wide text-muted uppercase">
        <span
          className="size-1.5 rounded-full"
          style={{ backgroundColor: getFactionColor(entry.faction) }}
          aria-hidden="true"
        />
        {t(getHeroClassKey(entry))}
      </span>
      <GripVertical
        size={10}
        className="absolute top-1 left-1 text-muted/70 opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />
      {used ? (
        <Badge variant="cyan" className="absolute top-1 right-1 px-1.5 py-0 text-[8px]">
          {t('teams.inTeam')}
        </Badge>
      ) : null}
    </button>
  )
}

interface TeamSlotCardProps {
  slot: TeamSlot
  hero: HeroProgress | undefined
  entry: HeroCatalogEntry | undefined
  availableHeroes: OwnedHero[]
  isDragging: boolean
  onAssign: (position: TeamSlot['position'], heroId: string) => void
}

function TeamSlotCard({
  slot,
  hero,
  entry,
  availableHeroes,
  isDragging,
  onAssign,
}: TeamSlotCardProps) {
  const { t } = useTranslation()
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${slot.position}` })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'rounded-xl border border-line bg-night/25 p-2 transition-colors',
        isDragging && 'border-dashed border-arcane/25',
        isOver && 'border-gild/60 bg-gild/10',
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
          {slot.position}
        </span>
        {slot.heroId ? (
          <button
            type="button"
            onClick={() => onAssign(slot.position, '')}
            aria-label={t('teams.removeHero')}
            className="rounded-md p-1 text-muted transition-colors hover:bg-ember/15 hover:text-ember"
          >
            <X size={12} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {hero && entry ? (
        <FramedHeroIcon
          heroId={entry.id}
          ascension={hero.ascension}
          signatureItem={hero.signatureItem}
          furniture={hero.furniture}
          engraving={hero.engraving}
          alt={entry.displayName}
          className="mt-1 w-full"
        />
      ) : (
        <div className="mt-1 flex aspect-square items-center justify-center rounded-lg border border-dashed border-line text-muted">
          <Plus size={18} aria-hidden="true" />
        </div>
      )}

      <Select
        value={slot.heroId ?? ''}
        onChange={(event) => onAssign(slot.position, event.target.value)}
        className="mt-2 h-8 text-xs"
        aria-label={`${t('teams.formation')} ${slot.position}`}
      >
        <option value="">{t('teams.emptySlot')}</option>
        {availableHeroes.map(({ hero: ownedHero, entry: ownedEntry }) => (
          <option key={ownedHero.heroId} value={ownedHero.heroId}>
            {ownedEntry.displayName}
          </option>
        ))}
      </Select>
    </div>
  )
}

interface FormationRowProps {
  row: 'front' | 'back'
  slots: TeamSlot[]
  heroes: Record<string, HeroProgress>
  ownedHeroes: OwnedHero[]
  usedHeroIds: Set<string>
  isDragging: boolean
  onAssign: (position: TeamSlot['position'], heroId: string) => void
}

function FormationRow({
  row,
  slots,
  heroes,
  ownedHeroes,
  usedHeroIds,
  isDragging,
  onAssign,
}: FormationRowProps) {
  const { t } = useTranslation()
  const hasEmptySlot = slots.some((slot) => !slot.heroId)
  const { setNodeRef, isOver } = useDroppable({ id: row, disabled: !hasEmptySlot })

  return (
    <div>
      <div
        ref={setNodeRef}
        className={cn(
          'mb-2 flex items-center justify-between gap-2 rounded-lg border border-transparent px-1 py-1 transition-colors',
          isDragging && 'border-dashed border-arcane/25',
          isOver && 'border-arcane/40 bg-arcane/5',
        )}
      >
        <p
          className={cn(
            'font-mono text-[10px] tracking-[0.18em] uppercase',
            row === 'front' ? 'text-gild' : 'text-arcane',
          )}
        >
          {t(`teams.${row}`)}
        </p>
        <span className="font-mono text-[9px] tracking-[0.14em] text-muted uppercase">
          {hasEmptySlot ? t('teams.dropToFill') : t('teams.rowFull')}
        </span>
      </div>
      <div className={row === 'front' ? 'grid grid-cols-2 gap-2' : 'grid grid-cols-3 gap-2'}>
        {slots.map((slot) => {
          const hero = slot.heroId ? heroes[slot.heroId] : undefined
          const entry = hero ? getHeroCatalogEntry(hero.heroId) : undefined
          const availableHeroes = ownedHeroes.filter(
            ({ hero: ownedHero }) =>
              !usedHeroIds.has(ownedHero.heroId) || ownedHero.heroId === slot.heroId,
          )

          return (
            <TeamSlotCard
              key={slot.position}
              slot={slot}
              hero={hero}
              entry={entry}
              availableHeroes={availableHeroes}
              isDragging={isDragging}
              onAssign={onAssign}
            />
          )
        })}
      </div>
    </div>
  )
}

export function TeamFormDialog({ teamId, onClose }: TeamFormDialogProps) {
  const { t } = useTranslation()
  const teams = useAppStore((state) => state.teams)
  const heroes = useAppStore((state) => state.heroes)
  const createTeam = useAppStore((state) => state.createTeam)
  const updateTeam = useAppStore((state) => state.updateTeam)
  const editingTeam = teamId ? teams.find((team) => team.id === teamId) : undefined
  const [draft, setDraft] = useState<Team>(
    () => editingTeam ?? createEmptyTeam({ name: t('teams.defaultName') }),
  )
  const [heroSearch, setHeroSearch] = useState('')
  const [activeHeroId, setActiveHeroId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  )

  const ownedHeroes = useMemo(
    () =>
      Object.values(heroes)
        .flatMap((hero) => {
          const entry = getHeroCatalogEntry(hero.heroId)
          return entry ? [{ hero, entry }] : []
        })
        .sort((a, b) => a.entry.displayName.localeCompare(b.entry.displayName)),
    [heroes],
  )

  const panelHeroes = useMemo(() => {
    const term = heroSearch.trim().toLowerCase()
    if (!term) return ownedHeroes

    return ownedHeroes.filter(
      ({ entry }) =>
        entry.displayName.toLowerCase().includes(term) || entry.name.toLowerCase().includes(term),
    )
  }, [heroSearch, ownedHeroes])

  const usedHeroIds = useMemo(
    () =>
      new Set(
        draft.slots
          .map((slot) => slot.heroId)
          .filter((heroId): heroId is string => Boolean(heroId)),
      ),
    [draft.slots],
  )

  const activeHero = activeHeroId ? heroes[activeHeroId] : undefined
  const activeEntry = activeHero ? getHeroCatalogEntry(activeHero.heroId) : undefined

  function setSlotHero(position: TeamSlot['position'], heroId: string) {
    setDraft((current) => ({
      ...current,
      slots: assignHeroToSlot(current.slots, position, heroId),
    }))
  }

  function handleDragStart(event: DragStartEvent) {
    const heroId = event.active.data.current?.heroId
    setActiveHeroId(typeof heroId === 'string' ? heroId : null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveHeroId(null)

    const heroId = event.active.data.current?.heroId
    if (typeof heroId !== 'string' || event.over?.id == null) return

    const position = resolveDropTarget(draft.slots, String(event.over.id))
    if (position) setSlotHero(position, heroId)
  }

  function handleSave() {
    if (!draft.name.trim()) {
      setError(t('teams.nameRequired'))
      return
    }

    const payload = {
      name: draft.name.trim(),
      mode: draft.mode,
      slots: draft.slots,
      notes: draft.notes ?? '',
    }

    if (editingTeam) {
      updateTeam(editingTeam.id, payload)
    } else {
      createTeam(payload)
    }

    onClose()
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      title={editingTeam ? t('teams.editTitle') : t('teams.createTitle')}
      description={editingTeam ? t('teams.editBody') : t('teams.createBody')}
      className="max-w-5xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave}>{t('common.save')}</Button>
        </>
      }
    >
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveHeroId(null)}
      >
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-[1.4fr_0.6fr]">
            <Field label={t('teams.teamName')}>
              <Input
                value={draft.name}
                onChange={(event) => {
                  setDraft((current) => ({ ...current, name: event.target.value }))
                  setError(null)
                }}
                autoFocus
              />
            </Field>
            <Field label={t('teams.mode')}>
              <Select
                value={draft.mode}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, mode: event.target.value as TeamMode }))
                }
              >
                {TEAM_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {t(`teamMode.${mode}`)}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          {ownedHeroes.length === 0 ? (
            <p className="rounded-xl border border-ember/30 bg-ember/5 px-3 py-2 text-sm text-ember">
              {t('teams.noHeroes')}
            </p>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <section className="codex-panel-soft flex min-h-0 flex-col p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-lg text-parch">{t('teams.rosterPanel')}</h3>
                  <p className="mt-0.5 text-[11px] text-muted">{t('teams.dragHint')}</p>
                </div>
                <Badge variant="outline">
                  {t('teams.rosterCount', { count: ownedHeroes.length })}
                </Badge>
              </div>

              <div className="relative mt-3">
                <Search
                  size={14}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  value={heroSearch}
                  onChange={(event) => setHeroSearch(event.target.value)}
                  placeholder={t('teams.searchRoster')}
                  className="pl-9"
                  aria-label={t('teams.searchRoster')}
                />
              </div>

              <div className="mt-3 grid max-h-[38vh] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3 lg:max-h-[52vh] lg:grid-cols-2">
                {panelHeroes.map(({ hero, entry }) => (
                  <RosterHero
                    key={hero.heroId}
                    hero={hero}
                    entry={entry}
                    used={usedHeroIds.has(hero.heroId)}
                  />
                ))}
              </div>

              {panelHeroes.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted">{t('teams.noRosterHeroes')}</p>
              ) : null}
            </section>

            <section className="space-y-4">
              <FormationRow
                row="front"
                slots={draft.slots.filter((slot) => slot.row === 'front')}
                heroes={heroes}
                ownedHeroes={ownedHeroes}
                usedHeroIds={usedHeroIds}
                isDragging={activeHeroId !== null}
                onAssign={setSlotHero}
              />
              <FormationRow
                row="back"
                slots={draft.slots.filter((slot) => slot.row === 'back')}
                heroes={heroes}
                ownedHeroes={ownedHeroes}
                usedHeroIds={usedHeroIds}
                isDragging={activeHeroId !== null}
                onAssign={setSlotHero}
              />
            </section>
          </div>

          <Field label={t('teams.notes')}>
            <Textarea
              value={draft.notes ?? ''}
              onChange={(event) =>
                setDraft((current) => ({ ...current, notes: event.target.value }))
              }
              placeholder={t('teams.notesPlaceholder')}
            />
          </Field>

          {error ? <p className="text-sm text-ember">{error}</p> : null}
        </div>

        {createPortal(
          <DragOverlay>
            {activeHero && activeEntry ? (
              <div className="w-24 rounded-xl border border-gild/50 bg-panel p-1.5 shadow-glow">
                <FramedHeroIcon
                  heroId={activeEntry.id}
                  ascension={activeHero.ascension}
                  signatureItem={activeHero.signatureItem}
                  furniture={activeHero.furniture}
                  engraving={activeHero.engraving}
                  alt={activeEntry.displayName}
                  className="w-full"
                />
                <p className="mt-1 truncate text-center text-[11px] font-semibold text-parch">
                  {activeEntry.displayName}
                </p>
              </div>
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </Dialog>
  )
}
