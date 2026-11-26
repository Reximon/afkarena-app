import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Plus, Swords } from 'lucide-react'
import { InvestmentMilestones } from '@/components/dashboard/InvestmentMilestones'
import { PetsOverview } from '@/components/dashboard/PetsOverview'
import { RosterComposition } from '@/components/dashboard/RosterComposition'
import { TargetHeroesPanel } from '@/components/dashboard/TargetHeroesPanel'
import { TeamsOverview } from '@/components/dashboard/TeamsOverview'
import { TopTierPanel } from '@/components/dashboard/TopTierPanel'
import { PageHeader } from '@/components/ui/PageHeader'
import { buttonStyles } from '@/components/ui/buttonStyles'
import { useAppStore } from '@/store/useAppStore'

export function DashboardPage() {
  const { t } = useTranslation()
  const heroes = useAppStore((state) => state.heroes)
  const teams = useAppStore((state) => state.teams)
  const pets = useAppStore((state) => state.pets)
  const profile = useAppStore((state) => state.profile)

  const identity = [profile.playerName, profile.server].filter(Boolean).join(' · ')

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={identity ? `${t('app.game')} · ${identity}` : t('app.game')}
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
        className="sm:flex-col sm:items-start sm:justify-start"
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

      <TargetHeroesPanel />

      <TopTierPanel />

      <InvestmentMilestones heroes={heroes} />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <TeamsOverview teams={teams} heroes={heroes} pets={pets} />
        <PetsOverview pets={pets} resonanceLevel={profile.petResonanceLevel ?? 0} />
      </div>

      <RosterComposition heroes={heroes} />
    </div>
  )
}
