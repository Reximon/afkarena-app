import { useTranslation } from 'react-i18next'
import { FactionIcon } from '@/components/heroes/FactionIcon'
import { Badge } from '@/components/ui/Badge'
import { computeFactionBonus, FACTION_TIER_LABELS } from '@/features/teams/factionBonus'
import { cn } from '@/lib/cn'

const HYPOGEAN_EFFECT_KEYS = [
  'hypogeanDefense',
  'hypogeanEnergy',
  'hypogeanCritRating',
  'hypogeanCritDamage',
  'hypogeanHaste',
] as const

interface FactionBonusPanelProps {
  heroIds: Array<string | undefined>
  className?: string
}

export function FactionBonusPanel({ heroIds, className }: FactionBonusPanelProps) {
  const { t } = useTranslation()
  const { filledCount, counts, regularBonus, celestialCount, hypogeanCount, draconisCount } =
    computeFactionBonus(heroIds)

  if (filledCount === 0) return null

  return (
    <section
      aria-label={t('teams.factionBonus')}
      className={cn(
        'rounded-xl border border-gild/15 bg-abyss/40 px-3 py-2.5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.35)]',
        className,
      )}
    >
      <p className="font-mono text-[9px] tracking-[0.18em] text-muted uppercase">
        {t('teams.factionBonus')}
      </p>

      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        {counts.map(({ faction, count }) => (
          <span
            key={faction}
            title={t(`faction.${faction}`)}
            className="inline-flex items-center gap-1.5 rounded-full border border-gild/20 bg-night/40 px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] text-parch uppercase"
          >
            <FactionIcon faction={faction} label={t(`faction.${faction}`)} className="size-4" />
            <span className="text-muted">×{count}</span>
          </span>
        ))}
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        {regularBonus ? (
          <Badge variant="gold">
            {t('teams.factionBonusSummary', {
              tier: FACTION_TIER_LABELS[regularBonus.tier],
              attack: regularBonus.attack,
              hp: regularBonus.hp,
            })}
          </Badge>
        ) : (
          <span className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
            {t('teams.noFactionBonus')}
          </span>
        )}
        {celestialCount > 0 ? (
          <span className="inline-flex items-center gap-1 text-[10px] text-muted">
            <FactionIcon faction="Celestial" label={t('faction.Celestial')} className="size-4" />
            {t('teams.celestialHint')}
          </span>
        ) : null}
      </div>

      {hypogeanCount > 0 ? (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span
            title={t('faction.Hypogean')}
            className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.12em] text-ember uppercase"
          >
            <FactionIcon faction="Hypogean" label={t('faction.Hypogean')} className="size-4" />
            <span>×{hypogeanCount}</span>
          </span>
          {HYPOGEAN_EFFECT_KEYS.slice(0, hypogeanCount).map((key) => (
            <Badge key={key} variant="rose">
              {t(`teams.${key}`)}
            </Badge>
          ))}
        </div>
      ) : null}

      {draconisCount > 0 ? (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span
            title={t('faction.Draconis')}
            className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.12em] text-gild uppercase"
          >
            <FactionIcon faction="Draconis" label={t('faction.Draconis')} className="size-4" />
            <span>×{draconisCount}</span>
          </span>
          <Badge variant="cyan">
            {t('teams.factionStatBonus', {
              attack: draconisCount * 2,
              hp: draconisCount * 2,
            })}
          </Badge>
        </div>
      ) : null}
    </section>
  )
}
