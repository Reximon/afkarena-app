import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Minus, Plus, Waves } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Input } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { PetCard } from '@/components/pets/PetCard'
import { PetDialog } from '@/components/pets/PetDialog'
import { getPet, getPetName, PET_MAX_RESONANCE, petCatalogCount, pets } from '@/features/pets/pets'
import { useAppStore } from '@/store/useAppStore'
import { PET_TIERS } from '@/types'

export function PetsPage() {
  const { t } = useTranslation()
  const ownedPets = useAppStore((state) => state.pets)
  const profile = useAppStore((state) => state.profile)
  const addPet = useAppStore((state) => state.addPet)
  const removePet = useAppStore((state) => state.removePet)
  const setPetResonance = useAppStore((state) => state.setPetResonance)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [removeTarget, setRemoveTarget] = useState<string | null>(null)

  const ownedCount = Object.keys(ownedPets).length
  const editingPet = editingId ? getPet(editingId) : undefined
  const resonanceLevel = profile.petResonanceLevel ?? 0

  function stepResonance(delta: number) {
    setPetResonance(resonanceLevel + delta)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t('app.game')}
        title={t('pets.title')}
        subtitle={t('pets.subtitle')}
        actions={
          <Badge variant="gold">
            {t('pets.ownedCount', { owned: ownedCount, total: petCatalogCount })}
          </Badge>
        }
      />

      <section className="codex-panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="game-medallion size-12 shrink-0 text-arcane">
            <Waves size={22} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="panel-title text-xl">{t('pets.resonance')}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">{t('pets.resonanceHint')}</p>
            <p className="mt-1 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
              {t('pets.resonanceCaps')}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => stepResonance(-1)}
            disabled={resonanceLevel <= 0}
            aria-label={`${t('common.decrease')} ${t('pets.resonance')}`}
            className="icon-action rounded-lg border border-line bg-night/40 p-1.5 text-muted hover:border-gild/40 hover:text-parch disabled:opacity-40"
          >
            <Minus size={14} aria-hidden="true" />
          </button>
          <Input
            type="number"
            min={0}
            max={PET_MAX_RESONANCE}
            value={resonanceLevel}
            onChange={(event) => setPetResonance(Number(event.target.value) || 0)}
            aria-label={t('pets.resonance')}
            className="w-20 text-center font-mono"
          />
          <button
            type="button"
            onClick={() => stepResonance(1)}
            disabled={resonanceLevel >= PET_MAX_RESONANCE}
            aria-label={`${t('common.increase')} ${t('pets.resonance')}`}
            className="icon-action rounded-lg border border-line bg-night/40 p-1.5 text-muted hover:border-gild/40 hover:text-parch disabled:opacity-40"
          >
            <Plus size={14} aria-hidden="true" />
          </button>
        </div>
      </section>

      {PET_TIERS.map((tier) => {
        const tierPets = pets.filter((pet) => pet.tier === tier)
        const tierOwned = tierPets.filter((pet) => Boolean(ownedPets[pet.id])).length

        return (
          <section key={tier} className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="panel-title text-2xl">{t(`petTier.${tier}`)}</h2>
              <Badge variant="outline">
                {t('pets.sectionCount', { owned: tierOwned, total: tierPets.length })}
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {tierPets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  progress={ownedPets[pet.id]}
                  resonanceLevel={resonanceLevel}
                  onAdd={() => {
                    addPet(pet.id)
                    setEditingId(pet.id)
                  }}
                  onEdit={() => setEditingId(pet.id)}
                  onRemove={() => setRemoveTarget(pet.id)}
                />
              ))}
            </div>
          </section>
        )
      })}

      {editingPet ? (
        <PetDialog
          pet={editingPet}
          open={Boolean(editingPet)}
          onOpenChange={(open) => {
            if (!open) setEditingId(null)
          }}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(removeTarget)}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null)
        }}
        title={t('pets.removeTitle')}
        body={removeTarget ? t('pets.removeBody', { name: getPetName(removeTarget) }) : ''}
        confirmLabel={
          removeTarget ? t('pets.removeName', { name: getPetName(removeTarget) }) : undefined
        }
        onConfirm={() => {
          if (!removeTarget) return
          removePet(removeTarget)
          if (editingId === removeTarget) setEditingId(null)
          setRemoveTarget(null)
        }}
      />
    </div>
  )
}
