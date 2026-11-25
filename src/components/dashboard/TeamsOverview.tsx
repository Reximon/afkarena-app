import { useState } from 'react'
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { ChevronRight, GripVertical, PawPrint, Pin, Plus, Swords } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FramedHeroIcon } from '@/components/heroes/FramedHeroIcon'
import { Badge } from '@/components/ui/Badge'
import { buttonStyles } from '@/components/ui/buttonStyles'
import { getPet } from '@/features/pets/pets'
import { getHeroCatalogEntry } from '@/features/heroes/heroCatalog'
import { computeFactionBonus, FACTION_TIER_LABELS } from '@/features/teams/factionBonus'
import { sortTeamsByPin } from '@/features/teams/teamOrder'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/useAppStore'
import type { HeroProgress, PetProgress, Team } from '@/types'

interface TeamsOverviewProps {
  teams: Team[]
  heroes: Record<string, HeroProgress>
  pets: Record<string, PetProgress>
}

export function TeamsOverview({ teams, heroes, pets }: TeamsOverviewProps) {
  const { t } = useTranslation()
  const reorderTeams = useAppStore((state) => state.reorderTeams)
  const updateTeam = useAppStore((state) => state.updateTeam)
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  )
  const orderedTeams = sortTeamsByPin(teams)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      reorderTeams(String(active.id), String(over.id))
    }
  }

  return (
    <section className="codex-panel flex h-full flex-col p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="panel-title text-2xl">{t('dashboard.teamsTitle')}</h2>
          <p className="mt-1 text-sm text-muted">{t('dashboard.teamsHint')}</p>
        </div>
        <Link
          to="/teams"
          className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.16em] text-gild uppercase transition-colors hover:text-gild-bright"
        >
          {t('dashboard.teamsViewAll')}
          <ChevronRight size={14} aria-hidden="true" />
        </Link>
      </div>

      {orderedTeams.length === 0 ? (
        <div className="mt-5 flex flex-col items-center gap-3 rounded-xl border border-dashed border-line bg-night/25 px-6 py-10 text-center">
          <span className="game-medallion size-12 text-gild">
            <Swords size={22} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <div>
            <p className="panel-title text-lg">{t('dashboard.teamsEmptyTitle')}</p>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted">
              {t('dashboard.teamsEmptyBody')}
            </p>
          </div>
          <Link to="/teams" className={buttonStyles({ variant: 'secondary', size: 'sm' })}>
            <Plus size={14} aria-hidden="true" />
            {t('dashboard.createTeam')}
          </Link>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={(event) => setActiveId(String(event.active.id))}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            {orderedTeams.map((team) => (
              <TeamOverviewCard
                key={team.id}
                team={team}
                heroes={heroes}
                pets={pets}
                isDragging={activeId === team.id}
                onTogglePin={() => updateTeam(team.id, { pinned: !team.pinned })}
              />
            ))}
          </div>
        </DndContext>
      )}
    </section>
  )
}

interface TeamOverviewCardProps {
  team: Team
  heroes: Record<string, HeroProgress>
  pets: Record<string, PetProgress>
  isDragging: boolean
  onTogglePin: () => void
}

function TeamOverviewCard({ team, heroes, pets, isDragging, onTogglePin }: TeamOverviewCardProps) {
  const { t } = useTranslation()
  const { attributes, listeners, setNodeRef: setDragRef, transform } = useDraggable({ id: team.id })
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: team.id })
  const bonus = computeFactionBonus(team.slots.map((slot) => slot.heroId))
  const pet = team.petId && pets[team.petId] ? getPet(team.petId) : undefined
  const slots = [...team.slots].sort((a, b) => a.position - b.position)
  const setNodeRef = (node: HTMLElement | null) => {
    setDragRef(node)
    setDropRef(node)
  }

  return (
    <article
      ref={setNodeRef}
      style={
        transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined
      }
      className={cn(
        'codex-panel-soft relative flex flex-col',
        team.pinned && 'border-gild/40',
        isDragging && 'z-30 opacity-80 shadow-[0_24px_60px_rgba(0,0,0,0.6)]',
        isOver && !isDragging && 'border-gild/70',
      )}
    >
      <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-0.5">
        <button
          type="button"
          onClick={onTogglePin}
          aria-pressed={Boolean(team.pinned)}
          aria-label={`${team.pinned ? t('teams.unpin') : t('teams.pin')}: ${team.name}`}
          className={cn(
            'icon-action rounded-md p-1',
            team.pinned
              ? 'bg-gild/15 text-gild hover:bg-gild/25'
              : 'text-muted hover:bg-dusk hover:text-parch',
          )}
        >
          <Pin size={13} className={team.pinned ? 'fill-current' : undefined} aria-hidden="true" />
        </button>
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`${t('teams.dragToReorder')}: ${team.name}`}
          className="icon-action cursor-grab touch-none rounded-md p-1 text-muted hover:bg-dusk hover:text-parch active:cursor-grabbing"
        >
          <GripVertical size={13} aria-hidden="true" />
        </button>
      </div>

      <Link
        to="/teams"
        className="flex flex-1 flex-col gap-3 rounded-[inherit] p-4 focus-visible:ring-2 focus-visible:ring-gild/60 focus-visible:outline-none"
      >
        <div className="min-w-0 pr-14">
          <p className="truncate text-sm font-semibold text-parch">{team.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <Badge variant="cyan">{t(`teamMode.${team.mode}`)}</Badge>
            {team.pinned ? (
              <Badge variant="gold">
                <Pin size={9} className="fill-current" aria-hidden="true" />
                {t('teams.pinned')}
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {slots.map((slot) => {
            const hero = slot.heroId ? heroes[slot.heroId] : undefined
            const entry = hero ? getHeroCatalogEntry(hero.heroId) : undefined

            if (!hero || !entry) {
              return (
                <span
                  key={slot.position}
                  className="size-9 shrink-0 rounded-lg border border-dashed border-line bg-night/35"
                  aria-hidden="true"
                />
              )
            }

            return (
              <span
                key={slot.position}
                className={cn('w-9 shrink-0', hero.priority && 'hero-foil rounded-lg')}
                title={entry.displayName}
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
              </span>
            )
          })}
          <span className="ml-auto shrink-0 font-mono text-[10px] tracking-[0.08em] text-muted">
            {t('dashboard.teamsHeroesDeployed', { count: bonus.filledCount })}
          </span>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {bonus.regularBonus ? (
              <>
                <Badge variant="gold">{FACTION_TIER_LABELS[bonus.regularBonus.tier]}</Badge>
                <span className="font-mono text-[10px] tracking-[0.06em] text-muted">
                  {t('teams.factionStatBonus', {
                    attack: bonus.regularBonus.attack,
                    hp: bonus.regularBonus.hp,
                  })}
                </span>
              </>
            ) : (
              <span className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
                {t('teams.noFactionBonus')}
              </span>
            )}
          </div>
          {pet ? (
            <span className="inline-flex min-w-0 items-center gap-1 text-[10px] text-muted">
              <PawPrint size={12} aria-hidden="true" className="shrink-0" />
              <span className="truncate">{pet.name}</span>
            </span>
          ) : null}
        </div>
      </Link>
    </article>
  )
}
