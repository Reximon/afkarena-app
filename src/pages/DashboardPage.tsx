import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ChevronRight, Download, Gem, Plus, Swords, Users } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { buttonStyles } from '@/components/ui/buttonStyles'
import {
  FACTION_COLORS,
  getHeroCatalogEntry,
  heroCatalogCount,
} from '@/features/heroes/heroCatalog'
import { FACTIONS } from '@/types'
import { useAppStore } from '@/store/useAppStore'

export function DashboardPage() {
  const { t } = useTranslation()
  const heroes = useAppStore((state) => state.heroes)
  const teams = useAppStore((state) => state.teams)
  const profile = useAppStore((state) => state.profile)

  const ownedHeroes = Object.keys(heroes).length
  const factionCounts = Object.values(heroes).reduce<Record<string, number>>((counts, hero) => {
    const catalogEntry = getHeroCatalogEntry(hero.heroId)
    if (catalogEntry) {
      counts[catalogEntry.faction] = (counts[catalogEntry.faction] ?? 0) + 1
    }
    return counts
  }, {})

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t('app.game')}
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
        actions={
          <>
            <Link to="/roster" className={buttonStyles({ variant: 'secondary' })}>
              <Plus size={16} aria-hidden="true" />
              {t('dashboard.addHero')}
            </Link>
            <Link to="/teams" className={buttonStyles()}>
              <Swords size={16} aria-hidden="true" />
              {t('dashboard.createTeam')}
            </Link>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label={t('dashboard.ownedHeroes')}
          value={ownedHeroes}
          hint={t('roster.catalogReady', { count: heroCatalogCount })}
          icon={Users}
          accent="gold"
        />
        <StatCard
          label={t('dashboard.savedTeams')}
          value={teams.length}
          hint={t('teams.subtitle')}
          icon={Swords}
          accent="cyan"
        />
        <StatCard
          label={t('dashboard.crystalLevel')}
          value={profile.crystalLevel}
          hint={t('settings.crystalLevel')}
          icon={Gem}
          accent="rose"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="codex-panel p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl text-bone">{t('dashboard.factionBreakdown')}</h2>
            <Badge variant="outline">{ownedHeroes}</Badge>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {FACTIONS.map((faction) => (
              <div
                key={faction}
                className="flex items-center gap-3 rounded-xl border border-line bg-void/25 px-3 py-2.5"
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: FACTION_COLORS[faction] }}
                  aria-hidden="true"
                />
                <span className="flex-1 text-sm text-bone">{t(`faction.${faction}`)}</span>
                <span className="font-mono text-xs text-muted">{factionCounts[faction] ?? 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="codex-panel p-6">
          <h2 className="font-display text-2xl text-bone">{t('dashboard.quickActions')}</h2>
          <div className="mt-5 space-y-3">
            <Link
              to="/roster"
              className={buttonStyles({
                variant: 'secondary',
                className: 'w-full justify-between',
              })}
            >
              <span className="flex items-center gap-2">
                <Users size={16} aria-hidden="true" />
                {t('nav.roster')}
              </span>
              <ChevronRight size={16} aria-hidden="true" />
            </Link>
            <Link
              to="/teams"
              className={buttonStyles({
                variant: 'secondary',
                className: 'w-full justify-between',
              })}
            >
              <span className="flex items-center gap-2">
                <Swords size={16} aria-hidden="true" />
                {t('nav.teams')}
              </span>
              <ChevronRight size={16} aria-hidden="true" />
            </Link>
            <Link
              to="/artifacts"
              className={buttonStyles({
                variant: 'secondary',
                className: 'w-full justify-between',
              })}
            >
              <span className="flex items-center gap-2">
                <Gem size={16} aria-hidden="true" />
                {t('nav.artifacts')}
              </span>
              <ChevronRight size={16} aria-hidden="true" />
            </Link>
            <button
              type="button"
              disabled
              className={buttonStyles({ variant: 'ghost', className: 'w-full justify-between' })}
            >
              <span className="flex items-center gap-2">
                <Download size={16} aria-hidden="true" />
                {t('dashboard.exportJson')}
              </span>
              <Badge variant="muted">{t('common.comingSoon')}</Badge>
            </button>
          </div>
        </div>
      </section>

      <section className="codex-panel star-chart flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <Badge variant="cyan">{t('common.phaseTwo')}</Badge>
          <h2 className="mt-3 font-display text-2xl text-bone">{t('dashboard.foundationTitle')}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t('dashboard.foundationBody')}</p>
        </div>
        <div className="shrink-0 rounded-xl border border-line bg-void/35 px-4 py-3 text-center">
          <p className="font-mono text-2xl text-gold">{heroCatalogCount}</p>
          <p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
            {t('app.game')}
          </p>
        </div>
      </section>
    </div>
  )
}
