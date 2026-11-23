import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Swords } from 'lucide-react'
import { TeamCard } from '@/components/teams/TeamCard'
import { TeamFormDialog } from '@/components/teams/TeamFormDialog'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAppStore } from '@/store/useAppStore'

export function TeamsPage() {
  const { t } = useTranslation()
  const teams = useAppStore((state) => state.teams)
  const heroes = useAppStore((state) => state.heroes)
  const pets = useAppStore((state) => state.pets)
  const duplicateTeam = useAppStore((state) => state.duplicateTeam)
  const removeTeam = useAppStore((state) => state.removeTeam)
  const [dialog, setDialog] = useState<{ teamId: string | null } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const deleteTeam = deleteTarget ? teams.find((team) => team.id === deleteTarget) : undefined

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t('app.game')}
        title={t('teams.title')}
        subtitle={t('teams.subtitle')}
        actions={
          <>
            <Badge variant="cyan">{t('teams.teamCount', { count: teams.length })}</Badge>
            <Button onClick={() => setDialog({ teamId: null })}>
              <Plus size={16} aria-hidden="true" />
              {t('teams.createTeam')}
            </Button>
          </>
        }
      />

      {teams.length === 0 ? (
        <EmptyState
          icon={Swords}
          title={t('teams.emptyTitle')}
          body={t('teams.emptyBody')}
          action={
            <Button onClick={() => setDialog({ teamId: null })}>
              <Plus size={16} aria-hidden="true" />
              {t('teams.createTeam')}
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              heroes={heroes}
              pets={pets}
              onEdit={(teamId) => setDialog({ teamId })}
              onDuplicate={duplicateTeam}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {dialog ? <TeamFormDialog teamId={dialog.teamId} onClose={() => setDialog(null)} /> : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        title={t('teams.deleteTitle')}
        body={t('teams.deleteBody', { name: deleteTeam?.name ?? '' })}
        onConfirm={() => {
          if (deleteTarget) removeTeam(deleteTarget)
        }}
      />
    </div>
  )
}
