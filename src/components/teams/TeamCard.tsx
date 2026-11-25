import { useTranslation } from 'react-i18next'
import { Copy, PawPrint, Pencil, Pin, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { EquipmentImage } from '@/components/equipment/EquipmentImage'
import { getPet } from '@/features/pets/pets'
import { cn } from '@/lib/cn'
import { FactionBonusPanel } from './FactionBonusPanel'
import { TeamFormation } from './TeamFormation'
import type { HeroProgress, PetProgress, PetTier, Team } from '@/types'

const TIER_BADGE: Record<PetTier, 'muted' | 'cyan' | 'gold'> = {
  rare: 'muted',
  elite: 'cyan',
  fabled: 'gold',
}

interface TeamCardProps {
  team: Team
  heroes: Record<string, HeroProgress>
  pets: Record<string, PetProgress>
  onEdit: (teamId: string) => void
  onDuplicate: (teamId: string) => void
  onDelete: (teamId: string) => void
  onTogglePin: (teamId: string) => void
}

export function TeamCard({
  team,
  heroes,
  pets,
  onEdit,
  onDuplicate,
  onDelete,
  onTogglePin,
}: TeamCardProps) {
  const { t } = useTranslation()
  const pet = team.petId && pets[team.petId] ? getPet(team.petId) : undefined

  return (
    <article className={cn('codex-panel codex-panel--sheer p-5', team.pinned && 'border-gild/45')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="panel-title truncate text-2xl leading-tight">{team.name}</h2>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <Badge variant="cyan">{t(`teamMode.${team.mode}`)}</Badge>
            {team.pinned ? (
              <Badge variant="gold">
                <Pin size={10} className="fill-current" aria-hidden="true" />
                {t('teams.pinned')}
              </Badge>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onTogglePin(team.id)}
            aria-pressed={Boolean(team.pinned)}
            aria-label={`${team.pinned ? t('teams.unpin') : t('teams.pin')}: ${team.name}`}
            className={cn(
              'icon-action rounded-lg p-1.5',
              team.pinned
                ? 'bg-gild/15 text-gild hover:bg-gild/25'
                : 'text-muted hover:bg-dusk hover:text-parch',
            )}
          >
            <Pin
              size={15}
              className={team.pinned ? 'fill-current' : undefined}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={() => onEdit(team.id)}
            aria-label={`${t('teams.edit')}: ${team.name}`}
            className="icon-action rounded-lg p-1.5 text-muted hover:bg-dusk hover:text-parch"
          >
            <Pencil size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDuplicate(team.id)}
            aria-label={`${t('teams.duplicate')}: ${team.name}`}
            className="icon-action rounded-lg p-1.5 text-muted hover:bg-dusk hover:text-parch"
          >
            <Copy size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(team.id)}
            aria-label={`${t('teams.delete')}: ${team.name}`}
            className="icon-action rounded-lg p-1.5 text-muted hover:bg-ember/15 hover:text-ember"
          >
            <Trash2 size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      <TeamFormation
        slots={team.slots}
        heroes={heroes}
        className="mt-4"
        onSlotClick={() => onEdit(team.id)}
      />

      <FactionBonusPanel heroIds={team.slots.map((slot) => slot.heroId)} className="mt-3" />

      {pet ? (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-gild/20 bg-abyss/45 px-2.5 py-1.5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.35)]">
          <span className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-md border border-gild/25 bg-night/40">
            <EquipmentImage src={pet.image} alt="" icon={PawPrint} iconClassName="size-4" />
          </span>
          <span className="min-w-0 flex-1 truncate text-xs font-semibold text-parch">
            {pet.name}
          </span>
          <Badge variant={TIER_BADGE[pet.tier]}>{t(`petTier.${pet.tier}`)}</Badge>
        </div>
      ) : null}

      {team.notes ? (
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">{team.notes}</p>
      ) : null}
    </article>
  )
}
