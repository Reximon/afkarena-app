import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Search, SlidersHorizontal, Target, Users } from 'lucide-react'
import { ClassIcon } from '@/components/heroes/ClassIcon'
import { FactionIcon } from '@/components/heroes/FactionIcon'
import { RoleIcon } from '@/components/heroes/RoleIcon'
import { HeroCard } from '@/components/roster/HeroCard'
import { HeroDetailDialog } from '@/components/roster/HeroDetailDialog'
import { HeroDetailScreen } from '@/components/roster/HeroDetailScreen'
import { IconFilterGroup } from '@/components/roster/IconFilterGroup'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input, Select } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { getHeroCatalogEntry } from '@/features/heroes/heroCatalog'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/useAppStore'
import {
  ASCENSIONS,
  FACTIONS,
  HERO_CLASSES,
  HERO_ROLES,
  type Ascension,
  type Faction,
  type HeroClass,
  type HeroRole,
} from '@/types'

type FactionFilter = Faction | 'all'
type ClassFilter = HeroClass | 'all'
type AscensionFilter = Ascension | 'all'
type RoleFilter = HeroRole | 'all'
type SortOption = 'name' | 'ascension-desc' | 'ascension-asc'

export function RosterPage() {
  const { t } = useTranslation()
  const heroes = useAppStore((state) => state.heroes)
  const removeHero = useAppStore((state) => state.removeHero)
  const updateHero = useAppStore((state) => state.updateHero)
  const crystalLevel = useAppStore((state) => state.profile.crystalLevel)
  const [search, setSearch] = useState('')
  const [faction, setFaction] = useState<FactionFilter>('all')
  const [heroClass, setHeroClass] = useState<ClassFilter>('all')
  const [ascension, setAscension] = useState<AscensionFilter>('all')
  const [role, setRole] = useState<RoleFilter>('all')
  const [sort, setSort] = useState<SortOption>('name')
  const [onlyTargets, setOnlyTargets] = useState(false)
  const [dialog, setDialog] = useState<{ heroId: string | null } | null>(null)
  const [detailHeroId, setDetailHeroId] = useState<string | null>(null)
  const [removeTarget, setRemoveTarget] = useState<string | null>(null)

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

  const filteredHeroes = useMemo(() => {
    const term = search.trim().toLowerCase()

    const filtered = ownedHeroes.filter(({ hero, entry }) => {
      if (
        term &&
        !entry.displayName.toLowerCase().includes(term) &&
        !entry.name.toLowerCase().includes(term)
      ) {
        return false
      }
      if (faction !== 'all' && entry.faction !== faction) return false
      if (heroClass !== 'all' && entry.class !== heroClass) return false
      if (ascension !== 'all' && hero.ascension !== ascension) return false
      if (role !== 'all' && !entry.roles.includes(role)) return false
      if (onlyTargets && !hero.priority) return false
      return true
    })

    if (sort === 'name') return filtered

    const direction = sort === 'ascension-desc' ? -1 : 1
    return [...filtered].sort((a, b) => {
      const rank = ASCENSIONS.indexOf(a.hero.ascension) - ASCENSIONS.indexOf(b.hero.ascension)
      return rank !== 0 ? rank * direction : a.entry.displayName.localeCompare(b.entry.displayName)
    })
  }, [ascension, faction, heroClass, onlyTargets, ownedHeroes, role, search, sort])

  const hasFilters =
    search.trim().length > 0 ||
    faction !== 'all' ||
    heroClass !== 'all' ||
    ascension !== 'all' ||
    role !== 'all' ||
    onlyTargets

  const removeEntry = removeTarget ? getHeroCatalogEntry(removeTarget) : undefined

  function clearFilters() {
    setSearch('')
    setFaction('all')
    setHeroClass('all')
    setAscension('all')
    setRole('all')
    setOnlyTargets(false)
  }

  function toggleTarget(heroId: string) {
    const hero = heroes[heroId]
    if (hero) updateHero(heroId, { priority: !hero.priority })
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t('app.game')}
        title={t('roster.title')}
        subtitle={t('roster.subtitle')}
      />

      <div className="codex-panel space-y-3 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('roster.searchPlaceholder')}
                className="pl-9"
                aria-label={t('roster.searchPlaceholder')}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Badge variant="cyan">
                {t('roster.resultsCount', { count: ownedHeroes.length })}
              </Badge>
              <Button onClick={() => setDialog({ heroId: null })}>
                <Plus size={16} aria-hidden="true" />
                {t('roster.addHero')}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-muted" aria-hidden="true" />
            <span className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
              {t('roster.filters')}
            </span>
            <button
              type="button"
              aria-pressed={onlyTargets}
              onClick={() => setOnlyTargets((value) => !value)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase transition-colors',
                onlyTargets
                  ? 'border-gild/50 bg-gild/10 text-gild'
                  : 'border-line bg-night/40 text-muted hover:border-gild/40 hover:text-parch',
              )}
            >
              <Target size={13} aria-hidden="true" />
              {t('roster.onlyTargets')}
            </button>
            {hasFilters ? (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                {t('roster.clearFilters')}
              </Button>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          <IconFilterGroup
            allLabel={t('roster.allFactions')}
            value={faction}
            options={FACTIONS}
            getOptionLabel={(value) => t(`faction.${value}`)}
            renderIcon={(value) => <FactionIcon faction={value} />}
            onChange={setFaction}
          />

          <span className="h-6 w-px shrink-0 bg-gild/15" aria-hidden="true" />

          <IconFilterGroup
            allLabel={t('roster.allClasses')}
            value={heroClass}
            options={HERO_CLASSES}
            getOptionLabel={(value) => t(`heroClass.${value}`)}
            renderIcon={(value) => <ClassIcon heroClass={value} />}
            onChange={setHeroClass}
          />

          <span className="h-6 w-px shrink-0 bg-gild/15" aria-hidden="true" />

          <IconFilterGroup
            allLabel={t('roster.allRoles')}
            value={role}
            options={HERO_ROLES}
            getOptionLabel={(value) => value}
            renderIcon={(value) => <RoleIcon role={value} />}
            onChange={setRole}
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Select
            value={ascension}
            onChange={(event) => setAscension(event.target.value as AscensionFilter)}
            aria-label={t('roster.allAscensions')}
          >
            <option value="all">{t('roster.allAscensions')}</option>
            {ASCENSIONS.map((value) => (
              <option key={value} value={value}>
                {t(`ascension.${value}`)}
              </option>
            ))}
          </Select>

          <Select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            aria-label={t('roster.sortBy')}
          >
            <option value="name">{t('roster.sortName')}</option>
            <option value="ascension-desc">{t('roster.sortAscensionDesc')}</option>
            <option value="ascension-asc">{t('roster.sortAscensionAsc')}</option>
          </Select>
        </div>
      </div>

      {ownedHeroes.length === 0 ? (
        <EmptyState
          icon={Users}
          title={t('roster.emptyTitle')}
          body={t('roster.emptyBody')}
          action={
            <Button onClick={() => setDialog({ heroId: null })}>
              <Plus size={16} aria-hidden="true" />
              {t('roster.addHero')}
            </Button>
          }
        />
      ) : filteredHeroes.length === 0 ? (
        <div className="codex-panel px-6 py-12 text-center">
          <p className="text-sm text-muted">{t('roster.noResults')}</p>
          <Button variant="ghost" className="mt-3" onClick={clearFilters}>
            {t('roster.clearFilters')}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filteredHeroes.map(({ hero, entry }) => (
            <HeroCard
              key={hero.heroId}
              hero={hero}
              entry={entry}
              crystalLevel={crystalLevel}
              onView={setDetailHeroId}
              onEdit={(heroId) => setDialog({ heroId })}
              onToggleTarget={toggleTarget}
              onRemove={setRemoveTarget}
            />
          ))}
        </div>
      )}

      {detailHeroId ? (
        <HeroDetailDialog heroId={detailHeroId} onClose={() => setDetailHeroId(null)} />
      ) : null}

      {dialog ? <HeroDetailScreen heroId={dialog.heroId} onClose={() => setDialog(null)} /> : null}

      <ConfirmDialog
        open={Boolean(removeTarget)}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null)
        }}
        title={t('roster.removeTitle')}
        body={t('roster.removeBody', { name: removeEntry?.displayName ?? '' })}
        onConfirm={() => {
          if (removeTarget) {
            removeHero(removeTarget)
          }
        }}
      />
    </div>
  )
}
