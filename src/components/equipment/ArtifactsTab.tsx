import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  Crosshair,
  Eye,
  Flame,
  FlaskConical,
  Gem,
  HeartPulse,
  Shield,
  ShieldCheck,
  Sparkles,
  Sword,
  Target,
  Waves,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { AssignedHeroChip } from '@/components/equipment/AssignedHeroChip'
import { EquipmentCard } from '@/components/equipment/EquipmentCard'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Input'
import { buttonStyles } from '@/components/ui/buttonStyles'
import { artifacts, getArtifactName, isArtifactEligible } from '@/features/artifacts/artifacts'
import { getHeroCatalogEntry } from '@/features/heroes/heroCatalog'
import { useAppStore } from '@/store/useAppStore'
import { HERO_CLASSES } from '@/types'

const ARTIFACT_ICONS: Record<string, LucideIcon> = {
  'duras-grace': ShieldCheck,
  'duras-eye': Eye,
  'duras-call': Zap,
  'duras-drape': Shield,
  'duras-blade': Sword,
  'duras-chalice': FlaskConical,
  'duras-conviction': Target,
  'chaos-bringer': Flame,
  carnage: Sword,
  'pauldron-of-burning-fury': Shield,
  'the-barricade': ShieldCheck,
  'waistband-of-resilience': Shield,
  'lifes-limit': HeartPulse,
  'shroud-of-verdure': Crosshair,
  'verdant-longbow': Target,
  'dual-divinity': Sparkles,
  windbinder: Zap,
  'warden-of-the-arcane': Eye,
  'winged-warden': Sparkles,
  tidebearer: Waves,
  'seraphic-tide': HeartPulse,
  'the-oceanic-strings': Sparkles,
}

export function ArtifactsTab() {
  const { t } = useTranslation()
  const heroes = useAppStore((state) => state.heroes)
  const assignArtifact = useAppStore((state) => state.assignArtifact)
  const unassignArtifact = useAppStore((state) => state.unassignArtifact)

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

  const duraArtifacts = artifacts.filter((artifact) => artifact.kind === 'dura')
  const classGroups = HERO_CLASSES.map((heroClass) => ({
    heroClass,
    items: artifacts.filter(
      (artifact) => artifact.kind === 'class' && artifact.class === heroClass,
    ),
  })).filter((group) => group.items.length > 0)

  function renderArtifact(artifact: (typeof artifacts)[number]) {
    const Icon = ARTIFACT_ICONS[artifact.id] ?? Gem
    const assigned = ownedHeroes.filter(({ hero }) => hero.artifact === artifact.id)
    const compatible = ownedHeroes.some(({ entry }) => isArtifactEligible(entry.class, artifact))
    const available = ownedHeroes.filter(
      ({ hero, entry }) =>
        hero.artifact !== artifact.id && isArtifactEligible(entry.class, artifact),
    )

    const emptyLabel =
      ownedHeroes.length === 0
        ? t('artifacts.noHeroesShort')
        : !compatible
          ? t('artifacts.noCompatibleHeroes', {
              class: artifact.class ? t(`heroClass.${artifact.class}`) : '',
            })
          : available.length === 0
            ? t('artifacts.allAssigned')
            : t('artifacts.assignPlaceholder')

    return (
      <EquipmentCard
        key={artifact.id}
        name={artifact.name}
        subtitle={
          artifact.kind === 'class' && artifact.class
            ? t(`heroClass.${artifact.class}`)
            : t('artifacts.dura')
        }
        meta={artifact.source}
        effect={artifact.effect}
        image={artifact.image}
        icon={Icon}
        count={assigned.length}
      >
        <div className="mt-4 flex flex-wrap gap-1.5">
          {assigned.length > 0 ? (
            assigned.map(({ hero, entry }) => (
              <AssignedHeroChip
                key={hero.heroId}
                hero={hero}
                entry={entry}
                onRemove={() => unassignArtifact(hero.heroId)}
                removeLabel={t('artifacts.removeAssignment', { name: entry.displayName })}
              />
            ))
          ) : (
            <p className="text-xs text-muted">{t('artifacts.unassigned')}</p>
          )}
        </div>

        <div className="mt-auto pt-4">
          <Select
            value=""
            disabled={available.length === 0}
            onChange={(event) => {
              if (event.target.value) {
                assignArtifact(event.target.value, artifact.id)
              }
            }}
            aria-label={`${t('artifacts.assignHero')} · ${artifact.name}`}
          >
            <option value="">{emptyLabel}</option>
            {available.map(({ hero, entry }) => {
              const current = getArtifactName(hero.artifact)

              return (
                <option key={hero.heroId} value={hero.heroId}>
                  {entry.displayName}
                  {current ? ` · ${current}` : ''}
                </option>
              )
            })}
          </Select>
        </div>
      </EquipmentCard>
    )
  }

  return (
    <div className="space-y-8">
      {ownedHeroes.length === 0 ? (
        <div className="codex-panel star-chart flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-gold/25 bg-gold/10 text-gold">
              <Gem size={20} strokeWidth={1.6} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-xl text-bone">{t('artifacts.noHeroesTitle')}</h2>
              <p className="mt-1 text-sm text-muted">{t('artifacts.noHeroesBody')}</p>
            </div>
          </div>
          <Link to="/roster" className={buttonStyles({ variant: 'secondary' })}>
            {t('artifacts.addHeroes')}
          </Link>
        </div>
      ) : null}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl text-bone">{t('artifacts.duraGroup')}</h2>
          <Badge variant="gold">
            {t('artifacts.artifactCount', { count: duraArtifacts.length })}
          </Badge>
        </div>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {duraArtifacts.map(renderArtifact)}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl text-bone">{t('artifacts.classArtifacts')}</h2>
          <Badge variant="cyan">
            {t('artifacts.artifactCount', {
              count: classGroups.reduce((total, group) => total + group.items.length, 0),
            })}
          </Badge>
        </div>
        {classGroups.map((group) => (
          <div key={group.heroClass} className="space-y-4">
            <h3 className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
              {t(`heroClass.${group.heroClass}`)}
            </h3>
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {group.items.map(renderArtifact)}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
