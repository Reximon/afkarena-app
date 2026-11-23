import { useTranslation } from 'react-i18next'
import { Minus, PawPrint, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Field } from '@/components/ui/Input'
import { EquipmentImage } from '@/components/equipment/EquipmentImage'
import {
  getPetMaxBuff,
  getPetMaxLevel,
  getPetTotalLevel,
  hasTraining,
  type PetDefinition,
} from '@/features/pets/pets'
import { useAppStore } from '@/store/useAppStore'
import type { PetProgress } from '@/types'
import { cn } from '@/lib/cn'

type BuffKey = 'strength' | 'intelligence' | 'agility'

const BUFF_KEYS: BuffKey[] = ['strength', 'intelligence', 'agility']

interface BuffControlProps {
  label: string
  value: number
  max: number
  onChange: (value: number) => void
}

function BuffControl({ label, value, max, onChange }: BuffControlProps) {
  const { t } = useTranslation()

  return (
    <div className="rounded-xl border border-line bg-night/30 px-3 py-2.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
          {label}
        </span>
        <span className="font-mono text-sm text-parch">
          {value}
          <span className="text-[10px] text-muted">/{max}</span>
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value <= 0}
          aria-label={`${t('common.decrease')} ${label}`}
          className="icon-action rounded-lg border border-line bg-night/40 p-1.5 text-muted hover:border-gild/40 hover:text-parch disabled:opacity-40"
        >
          <Minus size={14} aria-hidden="true" />
        </button>
        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label={label}
          className="min-w-0 flex-1 accent-gild"
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`${t('common.increase')} ${label}`}
          className="icon-action rounded-lg border border-line bg-night/40 p-1.5 text-muted hover:border-gild/40 hover:text-parch disabled:opacity-40"
        >
          <Plus size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

interface PetDialogProps {
  pet: PetDefinition
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PetDialog({ pet, open, onOpenChange }: PetDialogProps) {
  const { t } = useTranslation()
  const progress = useAppStore((state) => state.pets[pet.id])
  const updatePet = useAppStore((state) => state.updatePet)

  if (!progress) return null

  const maxBuff = getPetMaxBuff(pet.tier)
  const maxLevel = getPetMaxLevel(pet.tier)
  const totalLevel = getPetTotalLevel(progress)

  function setBuff(key: BuffKey, value: number) {
    const patch: Partial<PetProgress> =
      key === 'strength'
        ? { strength: value }
        : key === 'intelligence'
          ? { intelligence: value }
          : { agility: value }
    updatePet(pet.id, patch)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={pet.name}
      description={t('pets.editBody')}
      className="max-w-xl"
      footer={
        <>
          <span className="mr-auto self-center font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
            {t('heroScreen.autoSaved')}
          </span>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t('common.close')}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-gild/25 bg-night/40 ring-1 ring-gild/10">
            <EquipmentImage src={pet.image} alt={pet.name} icon={PawPrint} />
          </div>
          <div className="min-w-0">
            <p className="text-sm leading-relaxed text-muted">{pet.skill}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="gold">{t('pets.level', { level: totalLevel, max: maxLevel })}</Badge>
              {progress.training > 0 ? (
                <Badge variant="rose">
                  {t('pets.trainingValue', { level: progress.training })}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {BUFF_KEYS.map((key) => (
            <BuffControl
              key={key}
              label={t(`pets.${key}`)}
              value={progress[key]}
              max={maxBuff}
              onChange={(value) => setBuff(key, value)}
            />
          ))}
        </div>

        {hasTraining(pet.tier) ? (
          <Field label={t('pets.training')} hint={t('pets.trainingHint')} as="div">
            <div className="grid grid-cols-4 gap-1.5">
              {([0, 1, 2, 3] as const).map((level) => {
                const selected = progress.training === level

                return (
                  <button
                    key={level}
                    type="button"
                    aria-pressed={selected}
                    aria-label={t('pets.trainingValue', { level })}
                    onClick={() => updatePet(pet.id, { training: level })}
                    className={cn(
                      'h-10 rounded-lg border font-mono text-sm transition-colors',
                      selected
                        ? 'border-gild/50 bg-gild/15 text-gild'
                        : 'border-line bg-night/40 text-muted hover:border-arcane/40 hover:text-parch',
                    )}
                  >
                    {level}
                  </button>
                )
              })}
            </div>
          </Field>
        ) : (
          <p className="rounded-xl border border-line bg-night/25 px-3 py-2.5 text-xs text-muted">
            {t('pets.trainingRare')}
          </p>
        )}
      </div>
    </Dialog>
  )
}
