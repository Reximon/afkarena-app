import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { getFactionColor } from '@/features/heroes/heroCatalog'
import { computeFactionBonus, type FactionBonusTier } from '@/features/teams/factionBonus'
import { cn } from '@/lib/cn'

const TIER_LABELS: Record<FactionBonusTier, string> = {
  three: '3',
  threeTwo: '3+2',
  four: '4',
  five: '5',
}

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
      className={cn('rounded-xl border border-line bg-night/25 px-3 py-2.5', className)}
    >
      <p className="font-mono text-[9px] tracking-[0.18em] text-muted uppercase">
        {t('teams.factionBonus')}
      </p>

      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        {counts.map(({ faction, count }) => (
          <span
            key={faction}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/5 px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] text-parch uppercase"
          >
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: getFactionColor(faction) }}
              aria-hidden="true"
            />
            {t(`faction.${faction}`)}
            <span className="text-muted">×{count}</span>
          </span>
        ))}
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        {regularBonus ? (
          <Badge variant="gold">
            {t('teams.factionBonusSummary', {
              tier: TIER_LABELS[regularBonus.tier],
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
          <span className="text-[10px] text-muted">{t('teams.celestialHint')}</span>
        ) : null}
      </div>

      {hypogeanCount > 0 ? (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10px] tracking-[0.12em] text-ember uppercase">
            {t('faction.Hypogean')} ×{hypogeanCount}
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
          <span className="font-mono text-[10px] tracking-[0.12em] text-gild uppercase">
            {t('faction.Draconis')} ×{draconisCount}
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
