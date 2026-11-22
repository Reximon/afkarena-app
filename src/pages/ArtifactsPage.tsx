import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  Eye,
  FlaskConical,
  Gem,
  Shield,
  ShieldCheck,
  Sword,
  Target,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { FramedHeroIcon } from '@/components/heroes/FramedHeroIcon'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { buttonStyles } from '@/components/ui/buttonStyles'
import { artifacts, getArtifactName } from '@/features/artifacts/artifacts'
import { getHeroCatalogEntry } from '@/features/heroes/heroCatalog'
import { useAppStore } from '@/store/useAppStore'

const ARTIFACT_ICONS: Record<string, LucideIcon> = {
  'duras-grace': ShieldCheck,
  'duras-eye': Eye,
  'duras-call': Zap,
  'duras-drape': Shield,
  'duras-blade': Sword,
  'duras-chalice': FlaskConical,
  'duras-conviction': Target,
}

export function ArtifactsPage() {
  const { t } = useTranslation()
  const heroes = useAppStore((state) => state.heroes)
  const updateHero = useAppStore((state) => state.updateHero)

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

  const assignedCount = ownedHeroes.filter(({ hero }) => Boolean(hero.artifact)).length

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t('app.game')}
        title={t('artifacts.title')}
        subtitle={t('artifacts.subtitle')}
        actions={
          <>
            <Badge variant="gold">
              {t('artifacts.artifactCount', { count: artifacts.length })}
            </Badge>
            <Badge variant="cyan">{t('artifacts.assignedCount', { count: assignedCount })}</Badge>
          </>
        }
      />

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

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {artifacts.map((artifact) => {
          const Icon = ARTIFACT_ICONS[artifact.id] ?? Gem
          const assigned = ownedHeroes.filter(({ hero }) => hero.artifact === artifact.id)
          const available = ownedHeroes.filter(({ hero }) => hero.artifact !== artifact.id)

          return (
            <article key={artifact.id} className="codex-panel flex flex-col p-5">
              <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-gold/25 bg-gold/10 text-gold ring-1 ring-gold/10 ring-offset-2 ring-offset-ink">
                  <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-xl leading-tight text-bone">{artifact.name}</h2>
                  <p className="mt-1 font-mono text-[9px] tracking-[0.14em] text-muted uppercase">
                    {artifact.source}
                  </p>
                </div>
                <Badge variant={assigned.length > 0 ? 'cyan' : 'muted'}>{assigned.length}</Badge>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted">{artifact.effect}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {assigned.length > 0 ? (
                  assigned.map(({ hero, entry }) => (
                    <span
                      key={hero.heroId}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-void/30 py-0.5 pr-1 pl-0.5 text-xs text-bone"
                    >
                      <FramedHeroIcon
                        heroId={entry.id}
                        ascension={hero.ascension}
                        signatureItem={hero.signatureItem}
                        furniture={hero.furniture}
                        engraving={hero.engraving}
                        alt={entry.displayName}
                        className="size-6 shrink-0"
                      />
                      <span className="max-w-32 truncate">{entry.displayName}</span>
                      <button
                        type="button"
                        onClick={() => updateHero(hero.heroId, { artifact: undefined })}
                        aria-label={t('artifacts.removeAssignment', { name: entry.displayName })}
                        className="rounded-full p-0.5 text-muted transition-colors hover:bg-rose/15 hover:text-rose"
                      >
                        <X size={12} aria-hidden="true" />
                      </button>
                    </span>
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
                      updateHero(event.target.value, { artifact: artifact.id })
                    }
                  }}
                  aria-label={`${t('artifacts.assignHero')} · ${artifact.name}`}
                >
                  <option value="">
                    {ownedHeroes.length === 0
                      ? t('artifacts.noHeroesShort')
                      : available.length === 0
                        ? t('artifacts.allAssigned')
                        : t('artifacts.assignPlaceholder')}
                  </option>
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
            </article>
          )
        })}
      </section>
    </div>
  )
}
