import { useTranslation } from 'react-i18next'
import { Copy, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { TeamFormation } from './TeamFormation'
import type { HeroProgress, Team } from '@/types'

interface TeamCardProps {
  team: Team
  heroes: Record<string, HeroProgress>
  onEdit: (teamId: string) => void
  onDuplicate: (teamId: string) => void
  onDelete: (teamId: string) => void
}

export function TeamCard({ team, heroes, onEdit, onDuplicate, onDelete }: TeamCardProps) {
  const { t } = useTranslation()

  return (
    <article className="codex-panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate font-display text-2xl leading-tight text-parch">{team.name}</h2>
          <Badge variant="cyan" className="mt-1.5">
            {t(`teamMode.${team.mode}`)}
          </Badge>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onEdit(team.id)}
            aria-label={`${t('teams.edit')}: ${team.name}`}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-dusk hover:text-parch"
          >
            <Pencil size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDuplicate(team.id)}
            aria-label={`${t('teams.duplicate')}: ${team.name}`}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-dusk hover:text-parch"
          >
            <Copy size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(team.id)}
            aria-label={`${t('teams.delete')}: ${team.name}`}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-ember/15 hover:text-ember"
          >
            <Trash2 size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      <TeamFormation slots={team.slots} heroes={heroes} className="mt-4" />

      {team.notes ? (
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">{team.notes}</p>
      ) : null}
    </article>
  )
}
