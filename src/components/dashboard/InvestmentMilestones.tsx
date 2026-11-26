import type { LucideIcon } from 'lucide-react'
import { Armchair, Sparkles, Star, Sword } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { getRosterMilestones } from '@/features/dashboard/insights'
import { cn } from '@/lib/cn'
import type { HeroProgress } from '@/types'

type Accent = 'gold' | 'cyan' | 'rose'

const ACCENT_TEXT: Record<Accent, string> = {
  gold: 'text-gild',
  cyan: 'text-arcane',
  rose: 'text-ember',
}

const ACCENT_BAR: Record<Accent, string> = {
  gold: 'linear-gradient(90deg, #9a6b2a, #e2b96d 60%, #f7dfa4)',
  cyan: 'linear-gradient(90deg, #2f6f61, #78c8b5 60%, #c8f5e7)',
  rose: 'linear-gradient(90deg, #7a3320, #e26a43 60%, #f4b09a)',
}

interface MilestoneItem {
  key: string
  label: string
  count: number
  icon: LucideIcon
  accent: Accent
}

export function InvestmentMilestones({ heroes }: { heroes: Record<string, HeroProgress> }) {
  const { t } = useTranslation()
  const milestones = getRosterMilestones(heroes)

  const items: MilestoneItem[] = [
    {
      key: 'fiveStar',
      label: t('dashboard.milestoneFiveStar'),
      count: milestones.fiveStar,
      icon: Star,
      accent: 'gold',
    },
    {
      key: 'signature',
      label: t('dashboard.milestoneSignature'),
      count: milestones.signature30,
      icon: Sword,
      accent: 'rose',
    },
    {
      key: 'furniture',
      label: t('dashboard.milestoneFurniture'),
      count: milestones.furniture9,
      icon: Armchair,
      accent: 'gold',
    },
    {
      key: 'engraving',
      label: t('dashboard.milestoneEngraving'),
      count: milestones.engraving60,
      icon: Sparkles,
      accent: 'cyan',
    },
  ]

  return (
    <section className="codex-panel p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="panel-title text-xl">{t('dashboard.milestoneTitle')}</h2>
          <p className="mt-1 text-sm text-muted">{t('dashboard.milestoneBody')}</p>
        </div>
        <Badge variant="outline">
          {t('dashboard.milestoneCount', { count: milestones.owned })}
        </Badge>
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {items.map((item) => (
          <MilestoneCard key={item.key} item={item} total={milestones.owned} />
        ))}
      </div>
    </section>
  )
}

function MilestoneCard({ item, total }: { item: MilestoneItem; total: number }) {
  const percent = total > 0 ? Math.round((item.count / total) * 100) : 0
  const Icon = item.icon

  return (
    <article className="codex-panel-soft flex flex-col p-3">
      <div className="flex items-start justify-between gap-2">
        <span className={cn('game-medallion size-8 shrink-0', ACCENT_TEXT[item.accent])}>
          <Icon size={14} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className="font-mono text-[10px] tracking-[0.08em] text-muted">{percent}%</span>
      </div>

      <p className="mt-2 font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
        {item.label}
      </p>
      <p className="stat-value mt-1 text-xl leading-none">
        {item.count}
        <span className="ml-1 font-mono text-[11px] tracking-normal text-muted">/ {total}</span>
      </p>

      <div className="mt-auto pt-2">
        <div className="h-1 overflow-hidden rounded-full bg-night/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{ width: `${percent}%`, background: ACCENT_BAR[item.accent] }}
          />
        </div>
      </div>
    </article>
  )
}
