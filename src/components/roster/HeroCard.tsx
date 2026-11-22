import { useTranslation } from 'react-i18next'
import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { FramedHeroIcon } from '@/components/heroes/FramedHeroIcon'
import { getFactionColor, getHeroCatalogEntry, getHeroClassKey } from '@/features/heroes/heroCatalog'
import type { HeroCatalogEntry, HeroProgress } from '@/types'

interface HeroCardProps {
  hero: HeroProgress
  entry: HeroCatalogEntry
  onEdit: (heroId: string) => void
  onRemove: (heroId: string) => void
}

export function HeroCard({ hero, entry, onEdit, onRemove }: HeroCardProps) {
  const { t } = useTranslation()
  const linkedEntry = hero.linkedHeroId ? getHeroCatalogEntry(hero.linkedHeroId) : undefined

  return (
    <article className="codex-panel-soft group overflow-hidden">
      <div className="relative bg-void/35 p-2">
        <FramedHeroIcon
          heroId={entry.id}
          ascension={hero.ascension}
          signatureItem={hero.signatureItem}
          furniture={hero.furniture}
          engraving={hero.engraving}
          alt={entry.displayName}
          className="w-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span
          className="absolute top-2 left-2 size-2.5 rounded-full ring-2 ring-void/70"
          style={{ backgroundColor: getFactionColor(entry.faction) }}
          aria-hidden="true"
        />
        {hero.inCrystal ? (
          <Badge variant="cyan" className="absolute top-1.5 right-1.5">
            {t('hero.inCrystal')}
          </Badge>
        ) : null}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-bone">{entry.displayName}</h3>
            <p className="mt-0.5 truncate font-mono text-[10px] tracking-wide text-muted">
              {t(`faction.${entry.faction}`)} · {t(getHeroClassKey(entry))}
            </p>
            {linkedEntry ? (
              <p className="mt-1 truncate text-[11px] text-cyan">
                {t('hero.linkedTo', { name: linkedEntry.displayName })}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={() => onEdit(entry.id)}
              aria-label={`${t('common.edit')} ${entry.displayName}`}
              className="rounded-lg p-1.5 text-muted transition-colors hover:bg-violet hover:text-bone"
            >
              <Pencil size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(entry.id)}
              aria-label={`${t('common.delete')} ${entry.displayName}`}
              className="rounded-lg p-1.5 text-muted transition-colors hover:bg-rose/15 hover:text-rose"
            >
              <Trash2 size={14} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge variant="gold">{t(`ascension.${hero.ascension}`)}</Badge>
          <Badge variant="outline">
            {t('hero.level')} {hero.level}
          </Badge>
          {hero.signatureItem > 0 ? <Badge variant="cyan">SI {hero.signatureItem}</Badge> : null}
          {hero.furniture > 0 ? <Badge variant="rose">F {hero.furniture}</Badge> : null}
          {hero.engraving > 0 ? <Badge variant="muted">E {hero.engraving}</Badge> : null}
        </div>
      </div>
    </article>
  )
}
