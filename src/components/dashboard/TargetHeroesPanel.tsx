import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Check, Plus, Search, Target, X } from 'lucide-react'
import { FramedHeroIcon } from '@/components/heroes/FramedHeroIcon'
import { HeroDetailDialog } from '@/components/roster/HeroDetailDialog'
import { getHeroLevel } from '@/features/heroes/heroLevel'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { buttonStyles } from '@/components/ui/buttonStyles'
import {
  getFactionColor,
  getHeroCatalogEntry,
  getHeroClassKey,
} from '@/features/heroes/heroCatalog'
import { hasFoilEffect } from '@/lib/framedIcon'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/useAppStore'
import { GEAR_SLOTS, type HeroCatalogEntry, type HeroProgress } from '@/types'

export function TargetHeroesPanel() {
  const { t } = useTranslation()
  const heroes = useAppStore((state) => state.heroes)
  const updateHero = useAppStore((state) => state.updateHero)
  const crystalLevel = useAppStore((state) => state.profile.crystalLevel)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [detailHeroId, setDetailHeroId] = useState<string | null>(null)

  const targets = useMemo(
    () =>
      Object.values(heroes)
        .flatMap((hero) => {
          const entry = getHeroCatalogEntry(hero.heroId)
          return hero.priority && entry ? [{ hero, entry }] : []
        })
        .sort((a, b) => a.entry.displayName.localeCompare(b.entry.displayName)),
    [heroes],
  )
  const ownedCount = Object.keys(heroes).length

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="panel-title text-2xl">{t('dashboard.targetTitle')}</h2>
        <Badge variant="outline">{targets.length}</Badge>
        {targets.length > 0 ? (
          <Button variant="secondary" size="sm" onClick={() => setPickerOpen(true)}>
            <Plus size={16} aria-hidden="true" />
            {t('dashboard.targetAdd')}
          </Button>
        ) : null}
      </div>

      {targets.length === 0 ? (
        <EmptyState
          icon={Target}
          title={t('dashboard.targetEmptyTitle')}
          body={t('dashboard.targetEmptyBody')}
          className="py-10"
          action={
            ownedCount === 0 ? (
              <Link to="/roster" className={buttonStyles()}>
                <Plus size={16} aria-hidden="true" />
                {t('dashboard.addHero')}
              </Link>
            ) : (
              <Button onClick={() => setPickerOpen(true)}>
                <Plus size={16} aria-hidden="true" />
                {t('dashboard.targetAdd')}
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {targets.map(({ hero, entry }) => (
            <TargetHeroCard
              key={hero.heroId}
              hero={hero}
              entry={entry}
              crystalLevel={crystalLevel}
              onOpen={setDetailHeroId}
              onRemove={(heroId) => updateHero(heroId, { priority: false })}
            />
          ))}
        </div>
      )}

      {pickerOpen ? <TargetHeroPickerDialog onClose={() => setPickerOpen(false)} /> : null}
      {detailHeroId ? (
        <HeroDetailDialog heroId={detailHeroId} onClose={() => setDetailHeroId(null)} />
      ) : null}
    </section>
  )
}

interface TargetHeroCardProps {
  hero: HeroProgress
  entry: HeroCatalogEntry
  crystalLevel: number
  onOpen: (heroId: string) => void
  onRemove: (heroId: string) => void
}

function TargetHeroCard({ hero, entry, crystalLevel, onOpen, onRemove }: TargetHeroCardProps) {
  const { t } = useTranslation()
  const hasFoil = hasFoilEffect(hero)
  const gearCount = GEAR_SLOTS.filter((slot) => hero.gear[slot]).length

  return (
    <article className="codex-panel-soft card-lift group relative flex gap-3 p-3">
      <div className={cn('w-14 shrink-0 self-start', hasFoil && 'hero-foil rounded-xl')}>
        <FramedHeroIcon
          heroId={entry.id}
          ascension={hero.ascension}
          signatureItem={hero.signatureItem}
          furniture={hero.furniture}
          engraving={hero.engraving}
          alt={entry.displayName}
          className="w-full"
        />
      </div>

      <button
        type="button"
        onClick={() => onOpen(hero.heroId)}
        aria-label={t('roster.viewHero', { name: entry.displayName })}
        className="min-w-0 flex-1 rounded-lg text-left focus-visible:ring-2 focus-visible:ring-gild/60 focus-visible:outline-none"
      >
        <span className="block truncate pr-6 text-sm font-semibold text-parch">
          {entry.displayName}
        </span>
        <span className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] tracking-wide text-muted">
          <span
            className="size-1.5 shrink-0 rotate-45 rounded-[1px]"
            style={{ backgroundColor: getFactionColor(entry.faction) }}
            aria-hidden="true"
          />
          <span className="truncate">
            {t(`faction.${entry.faction}`)} · {t(getHeroClassKey(entry))}
          </span>
        </span>
        <span className="mt-2 flex flex-wrap items-center gap-1">
          <Badge variant="gold">{t(`ascension.${hero.ascension}`)}</Badge>
          <Badge variant="outline">
            {t('hero.level')} {getHeroLevel(hero, crystalLevel)}
          </Badge>
          <Badge variant="cyan">SI {hero.signatureItem}</Badge>
          <Badge variant="rose">F {hero.furniture}</Badge>
          <Badge variant="muted">E {hero.engraving}</Badge>
          <Badge variant="outline">{t('dashboard.targetGear', { count: gearCount })}</Badge>
        </span>
      </button>

      <button
        type="button"
        onClick={() => onRemove(hero.heroId)}
        aria-label={t('dashboard.targetRemove', { name: entry.displayName })}
        className="icon-action absolute top-2 right-2 rounded-lg p-1.5 text-muted hover:bg-ember/15 hover:text-ember"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </article>
  )
}

function TargetHeroPickerDialog({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  const heroes = useAppStore((state) => state.heroes)
  const updateHero = useAppStore((state) => state.updateHero)
  const [search, setSearch] = useState('')
  const ownedCount = Object.keys(heroes).length

  const candidates = useMemo(() => {
    const term = search.trim().toLowerCase()

    return Object.values(heroes)
      .flatMap((hero) => {
        const entry = getHeroCatalogEntry(hero.heroId)
        if (!entry) return []
        if (
          term &&
          !entry.displayName.toLowerCase().includes(term) &&
          !entry.name.toLowerCase().includes(term)
        ) {
          return []
        }
        return [{ hero, entry }]
      })
      .sort((a, b) => a.entry.displayName.localeCompare(b.entry.displayName))
  }, [heroes, search])

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      title={t('dashboard.targetPickerTitle')}
      description={t('dashboard.targetPickerBody')}
      footer={
        <Button variant="ghost" onClick={onClose}>
          {t('common.close')}
        </Button>
      }
    >
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('common.search')}
          aria-label={t('common.search')}
          className="pl-9"
        />
      </div>

      {candidates.length === 0 ? (
        <p className="mt-6 text-sm text-muted">
          {ownedCount === 0 ? t('dashboard.targetPickerEmpty') : t('roster.noResults')}
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {candidates.map(({ hero, entry }) => {
            const marked = Boolean(hero.priority)

            return (
              <button
                key={hero.heroId}
                type="button"
                aria-pressed={marked}
                onClick={() => updateHero(hero.heroId, { priority: !marked })}
                className={cn(
                  'flex items-center gap-2 rounded-xl border p-2 text-left transition-colors',
                  marked
                    ? 'border-gild/50 bg-gild/10'
                    : 'border-line bg-night/40 hover:border-gild/30',
                )}
              >
                <span className="w-10 shrink-0">
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
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-parch">
                    {entry.displayName}
                  </span>
                  <span className="block truncate font-mono text-[9px] tracking-wide text-muted uppercase">
                    {t(`faction.${entry.faction}`)}
                  </span>
                </span>
                {marked ? (
                  <Check size={14} className="shrink-0 text-gild" aria-hidden="true" />
                ) : null}
              </button>
            )
          })}
        </div>
      )}
    </Dialog>
  )
}
