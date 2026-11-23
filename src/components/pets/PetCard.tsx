import { useTranslation } from 'react-i18next'
import { PawPrint, Pencil, Plus, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EquipmentImage } from '@/components/equipment/EquipmentImage'
import {
  getPetMaxLevel,
  getPetResonanceDeficit,
  getPetTotalLevel,
  PET_TIER_MAX_BUFF,
  type PetDefinition,
} from '@/features/pets/pets'
import type { PetProgress, PetTier } from '@/types'
import { cn } from '@/lib/cn'

const TIER_BADGE: Record<PetTier, 'muted' | 'cyan' | 'gold'> = {
  rare: 'muted',
  elite: 'cyan',
  fabled: 'gold',
}

interface PetCardProps {
  pet: PetDefinition
  progress?: PetProgress
  resonanceLevel: number
  onAdd: () => void
  onEdit: () => void
  onRemove: () => void
}

export function PetCard({ pet, progress, resonanceLevel, onAdd, onEdit, onRemove }: PetCardProps) {
  const { t } = useTranslation()
  const owned = Boolean(progress)
  const maxBuff = PET_TIER_MAX_BUFF[pet.tier]
  const maxLevel = getPetMaxLevel(pet.tier)
  const totalLevel = progress ? getPetTotalLevel(progress) : 0
  const resonanceDeficit = progress ? getPetResonanceDeficit(pet.tier, progress, resonanceLevel) : 0

  return (
    <article className="codex-panel flex flex-col gap-3 p-4">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div
            className={cn(
              'grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-gild/25 bg-night/40 ring-1 ring-gild/10',
              !owned && 'opacity-50',
            )}
          >
            <EquipmentImage src={pet.image} alt={pet.name} icon={PawPrint} />
          </div>
          {resonanceDeficit > 0 ? (
            <Badge
              variant="cyan"
              className="absolute -top-2 -right-2 bg-night shadow-[0_4px_12px_rgba(4,7,20,0.6)]"
              aria-label={t('pets.resonancePending', { count: resonanceDeficit })}
            >
              +{resonanceDeficit}
            </Badge>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg leading-tight text-parch">{pet.name}</h3>
            {owned ? (
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={onEdit}
                  aria-label={t('pets.editName', { name: pet.name })}
                  className="icon-action rounded-lg p-1.5 text-muted hover:bg-dusk hover:text-parch"
                >
                  <Pencil size={14} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={onRemove}
                  aria-label={t('pets.removeName', { name: pet.name })}
                  className="icon-action rounded-lg p-1.5 text-muted hover:bg-ember/15 hover:text-ember"
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
            ) : null}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <Badge variant={TIER_BADGE[pet.tier]}>{t(`petTier.${pet.tier}`)}</Badge>
            {progress ? (
              <>
                <Badge variant="cyan">
                  {t('pets.level', { level: totalLevel, max: maxLevel })}
                </Badge>
                {progress.training > 0 ? (
                  <Badge variant="rose">
                    {t('pets.trainingValue', { level: progress.training })}
                  </Badge>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted">{pet.skill}</p>

      {progress ? (
        <div className="mt-auto grid grid-cols-3 gap-2">
          {(['strength', 'intelligence', 'agility'] as const).map((key) => (
            <div
              key={key}
              title={t(`pets.${key}`)}
              className="rounded-lg border border-line bg-night/25 px-2 py-1.5 text-center"
            >
              <span className="block font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
                {key[0].toUpperCase()}
              </span>
              <span className="font-mono text-sm text-parch">
                {progress[key]}
                <span className="text-[10px] text-muted">/{maxBuff}</span>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          className="mt-auto w-full"
          onClick={onAdd}
          aria-label={t('pets.addName', { name: pet.name })}
        >
          <Plus size={14} aria-hidden="true" />
          {t('pets.add')}
        </Button>
      )}
    </article>
  )
}
