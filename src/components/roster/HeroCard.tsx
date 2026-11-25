import { useTranslation } from 'react-i18next'
import { Pencil, Target, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { FramedHeroIcon } from '@/components/heroes/FramedHeroIcon'
import {
  getFactionColor,
  getHeroCatalogEntry,
  getHeroClassKey,
} from '@/features/heroes/heroCatalog'
import { getHeroLevel } from '@/features/heroes/heroLevel'
import type { HeroCatalogEntry, HeroProgress } from '@/types'
import { cn } from '@/lib/cn'
import { hasFoilEffect } from '@/lib/framedIcon'
import { usePointerFoil } from '@/lib/usePointerFoil'

interface HeroCardProps {
  hero: HeroProgress
  entry: HeroCatalogEntry
  crystalLevel: number
  onView: (heroId: string) => void
  onEdit: (heroId: string) => void
  onToggleTarget: (heroId: string) => void
  onRemove: (heroId: string) => void
}

export function HeroCard({
  hero,
  entry,
  crystalLevel,
  onView,
  onEdit,
  onToggleTarget,
  onRemove,
}: HeroCardProps) {
  const { t } = useTranslation()
  const linkedEntry = hero.linkedHeroId ? getHeroCatalogEntry(hero.linkedHeroId) : undefined
  const hasFoil = hasFoilEffect(hero)
  const onFoilPointerMove = usePointerFoil()

  return (
    <article className="card-lift codex-panel-soft group overflow-hidden">
      <div className="portrait-frame relative m-2 p-1.5">
        <button
          type="button"
          onClick={() => onView(entry.id)}
          aria-label={t('roster.viewHero', { name: entry.displayName })}
          className="block w-full"
        >
          <span
            onPointerMove={onFoilPointerMove}
            className={cn(
              'block w-full transition-transform duration-300 group-hover:scale-[1.03]',
              hasFoil && 'hero-foil',
            )}
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
        </button>
        <span
          className="absolute top-2 left-2 size-2.5 rotate-45 rounded-[2px] ring-2 ring-night/70"
          style={{ backgroundColor: getFactionColor(entry.faction) }}
          aria-hidden="true"
        />
        {hero.priority || hero.inCrystal ? (
          <span className="absolute top-1.5 right-1.5 flex flex-col items-end gap-1">
            {hero.priority ? (
              <Badge variant="gold" className="flex items-center gap-1">
                <Target size={10} aria-hidden="true" />
                {t('roster.targetBadge')}
              </Badge>
            ) : null}
            {hero.inCrystal ? <Badge variant="cyan">{t('hero.inCrystal')}</Badge> : null}
          </span>
        ) : null}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="panel-title truncate text-[15px]">{entry.displayName}</h3>
            <p className="mt-0.5 truncate font-mono text-[10px] tracking-wide text-muted">
              {t(`faction.${entry.faction}`)} · {t(getHeroClassKey(entry))}
            </p>
            {linkedEntry ? (
              <p className="mt-1 truncate text-[11px] text-arcane">
                {t('hero.linkedTo', { name: linkedEntry.displayName })}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={() => onToggleTarget(entry.id)}
              aria-pressed={Boolean(hero.priority)}
              aria-label={
                hero.priority
                  ? t('roster.unmarkTarget', { name: entry.displayName })
                  : t('roster.markTarget', { name: entry.displayName })
              }
              title={
                hero.priority
                  ? t('roster.unmarkTarget', { name: entry.displayName })
                  : t('roster.markTarget', { name: entry.displayName })
              }
              className={cn(
                'icon-action rounded-lg p-1.5',
                hero.priority
                  ? 'text-gild hover:bg-gild/15'
                  : 'text-muted hover:bg-gild/10 hover:text-gild',
              )}
            >
              <Target size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(entry.id)}
              aria-label={`${t('common.edit')} ${entry.displayName}`}
              className="icon-action rounded-lg p-1.5 text-muted hover:bg-dusk hover:text-parch"
            >
              <Pencil size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(entry.id)}
              aria-label={`${t('common.delete')} ${entry.displayName}`}
              className="icon-action rounded-lg p-1.5 text-muted hover:bg-ember/15 hover:text-ember"
            >
              <Trash2 size={14} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge variant="gold">{t(`ascension.${hero.ascension}`)}</Badge>
          <Badge variant="outline">
            {t('hero.level')} {getHeroLevel(hero, crystalLevel)}
          </Badge>
          {hero.signatureItem > 0 ? <Badge variant="cyan">SI {hero.signatureItem}</Badge> : null}
          {hero.furniture > 0 ? <Badge variant="rose">F {hero.furniture}</Badge> : null}
          {hero.engraving > 0 ? <Badge variant="muted">E {hero.engraving}</Badge> : null}
        </div>
      </div>
    </article>
  )
}
