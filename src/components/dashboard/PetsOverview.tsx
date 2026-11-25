import { ChevronRight, PawPrint, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { EquipmentImage } from '@/components/equipment/EquipmentImage'
import { Badge } from '@/components/ui/Badge'
import { buttonStyles } from '@/components/ui/buttonStyles'
import { getPetOverview } from '@/features/dashboard/insights'
import { PET_MAX_RESONANCE } from '@/features/pets/pets'
import type { PetProgress } from '@/types'

interface PetsOverviewProps {
  pets: Record<string, PetProgress>
  resonanceLevel: number
}

export function PetsOverview({ pets, resonanceLevel }: PetsOverviewProps) {
  const { t } = useTranslation()
  const overview = getPetOverview(pets, resonanceLevel)
  const resonancePercent = Math.round((overview.resonanceLevel / PET_MAX_RESONANCE) * 100)

  return (
    <section className="codex-panel flex h-full flex-col p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="panel-title text-2xl">{t('dashboard.petsTitle')}</h2>
          <p className="mt-1 text-sm text-muted">{t('dashboard.petsHint')}</p>
        </div>
        <Link
          to="/pets"
          aria-label={t('nav.pets')}
          className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.16em] text-gild uppercase transition-colors hover:text-gild-bright"
        >
          {t('nav.pets')}
          <ChevronRight size={14} aria-hidden="true" />
        </Link>
      </div>

      {overview.owned === 0 ? (
        <div className="mt-5 flex flex-col items-center gap-3 rounded-xl border border-dashed border-line bg-night/25 px-6 py-10 text-center">
          <span className="game-medallion size-12 text-gild">
            <PawPrint size={22} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <div>
            <p className="panel-title text-lg">{t('dashboard.petsEmptyTitle')}</p>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted">
              {t('dashboard.petsEmptyBody')}
            </p>
          </div>
          <Link to="/pets" className={buttonStyles({ variant: 'secondary', size: 'sm' })}>
            <Plus size={14} aria-hidden="true" />
            {t('pets.add')}
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[9px] tracking-[0.18em] text-muted uppercase">
                  {t('dashboard.petsTarget')}
                </p>
                <p className="stat-value mt-1 text-4xl leading-none">
                  {overview.resonanceLevel}
                  <span className="ml-1 font-mono text-xs tracking-[0.1em] text-muted">
                    / {PET_MAX_RESONANCE}
                  </span>
                </p>
              </div>
              <Badge variant={overview.belowResonance > 0 ? 'cyan' : 'gold'}>
                {overview.belowResonance > 0
                  ? t('dashboard.petsBelowCount', { count: overview.belowResonance })
                  : t('dashboard.petsAllAtTarget')}
              </Badge>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-night/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#2f6f61,#78c8b5_60%,#c8f5e7)] transition-[width] duration-500"
                style={{ width: `${resonancePercent}%` }}
              />
            </div>
          </div>

          <div className="mt-5">
            <p className="font-mono text-[9px] tracking-[0.18em] text-muted uppercase">
              {t('dashboard.petsTop')}
            </p>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {overview.topPets.map((pet) => (
                <div
                  key={pet.progress.petId}
                  className="rounded-xl border border-gild/15 bg-abyss/40 p-2 text-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.35)]"
                >
                  <div className="relative mx-auto w-12">
                    <div className="game-medallion size-12 overflow-hidden">
                      <EquipmentImage
                        src={pet.definition.image}
                        alt={pet.definition.name}
                        icon={PawPrint}
                      />
                    </div>
                    {pet.deficit > 0 ? (
                      <Badge
                        variant="cyan"
                        className="absolute -top-1.5 -right-1.5 bg-night shadow-[0_4px_12px_rgba(5,2,1,0.65)]"
                        aria-label={t('pets.resonancePending', { count: pet.deficit })}
                      >
                        +{pet.deficit}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-1.5 truncate text-[11px] font-semibold text-parch">
                    {pet.definition.name}
                  </p>
                  <p className="font-mono text-[9px] tracking-[0.08em] text-muted">
                    {t('dashboard.petsLevel', { level: pet.level })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {overview.resonanceLevel === 0 ? (
            <p className="mt-4 text-xs leading-relaxed text-muted">{t('dashboard.petsNoTarget')}</p>
          ) : null}
        </>
      )}
    </section>
  )
}
