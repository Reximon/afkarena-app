import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import { FramedHeroIcon } from '@/components/heroes/FramedHeroIcon'
import { getHeroCatalogEntry } from '@/features/heroes/heroCatalog'
import { createEmptyTeam } from '@/features/persistence/defaults'
import { useAppStore } from '@/store/useAppStore'
import { TEAM_MODES, type Team, type TeamMode, type TeamSlot } from '@/types'

interface TeamFormDialogProps {
  teamId: string | null
  onClose: () => void
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
  const [error, setError] = useState<string | null>(null)

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

  const usedHeroIds = useMemo(
    () =>
      new Set(
        draft.slots
          .map((slot) => slot.heroId)
          .filter((heroId): heroId is string => Boolean(heroId)),
      ),
    [draft.slots],
  )

  function setSlotHero(position: TeamSlot['position'], heroId: string) {
    setDraft((current) => ({
      ...current,
      slots: current.slots.map((slot) => {
        if (slot.position === position) {
          return { ...slot, heroId: heroId || undefined }
        }
        if (heroId && slot.heroId === heroId) {
          return { ...slot, heroId: undefined }
        }
        return slot
      }),
    }))
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

  function renderSlot(slot: TeamSlot) {
    const hero = slot.heroId ? heroes[slot.heroId] : undefined
    const entry = hero ? getHeroCatalogEntry(hero.heroId) : undefined
    const availableHeroes = ownedHeroes.filter(
      ({ hero: ownedHero }) =>
        !usedHeroIds.has(ownedHero.heroId) || ownedHero.heroId === slot.heroId,
    )

    return (
      <div key={slot.position} className="rounded-xl border border-line bg-void/25 p-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
            {slot.position}
          </span>
          {slot.heroId ? (
            <button
              type="button"
              onClick={() => setSlotHero(slot.position, '')}
              aria-label={t('teams.emptySlot')}
              className="rounded-md p-1 text-muted transition-colors hover:bg-rose/15 hover:text-rose"
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
          onChange={(event) => setSlotHero(slot.position, event.target.value)}
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

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      title={editingTeam ? t('teams.editTitle') : t('teams.createTitle')}
      description={editingTeam ? t('teams.editBody') : t('teams.createBody')}
      className="max-w-3xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave}>{t('common.save')}</Button>
        </>
      }
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
          <p className="rounded-xl border border-rose/30 bg-rose/5 px-3 py-2 text-sm text-rose">
            {t('teams.noHeroes')}
          </p>
        ) : null}

        <div className="space-y-4">
          <div>
            <p className="mb-2 font-mono text-[10px] tracking-[0.18em] text-gold uppercase">
              {t('teams.front')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {draft.slots.filter((slot) => slot.row === 'front').map((slot) => renderSlot(slot))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-mono text-[10px] tracking-[0.18em] text-cyan uppercase">
              {t('teams.back')}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {draft.slots.filter((slot) => slot.row === 'back').map((slot) => renderSlot(slot))}
            </div>
          </div>
        </div>

        <Field label={t('teams.notes')}>
          <Textarea
            value={draft.notes ?? ''}
            onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
            placeholder={t('teams.notesPlaceholder')}
          />
        </Field>

        {error ? <p className="text-sm text-rose">{error}</p> : null}
      </div>
    </Dialog>
  )
}
