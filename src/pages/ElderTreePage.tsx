import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { VirtueBranch } from '@/components/elder-tree/VirtueBranch'
import { VirtueOverview } from '@/components/elder-tree/VirtueOverview'
import { ClassIcon } from '@/components/heroes/ClassIcon'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/ui/PageHeader'
import { elderTreeVirtues, getVirtue, getVirtueMaxLevel } from '@/features/elderTree/elderTree'
import { cn } from '@/lib/cn'
import type { HeroClass } from '@/types'

type Selection = HeroClass | 'all'

const initialLevels: Record<HeroClass, number> = {
  Warrior: 5,
  Tank: 5,
  Ranger: 5,
  Mage: 5,
  Support: 5,
}

const tabBase = 'flex h-10 shrink-0 items-center gap-2 rounded-full border px-3 transition-all'
const tabActive =
  'border-gild/55 bg-gild/10 text-gild-bright shadow-[0_0_18px_rgba(226,185,109,0.16)]'
const tabIdle =
  'border-line bg-night/40 text-muted opacity-70 hover:border-gild/40 hover:opacity-100'

export function ElderTreePage() {
  const { t } = useTranslation()
  const [selection, setSelection] = useState<Selection>('all')
  const [levels, setLevels] = useState(initialLevels)

  const virtue = selection === 'all' ? null : getVirtue(selection)

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t('elderTree.eyebrow')}
        title={t('elderTree.title')}
        subtitle={t('elderTree.subtitle')}
        actions={<Badge variant="gold">{t('elderTree.virtueCount', { count: 5 })}</Badge>}
      />

      <div
        role="tablist"
        aria-label={t('elderTree.virtues')}
        className="flex items-center gap-2 overflow-x-auto pb-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={selection === 'all'}
          onClick={() => setSelection('all')}
          className={cn(tabBase, 'px-4', selection === 'all' ? tabActive : tabIdle)}
        >
          <span className="font-mono text-[10px] tracking-[0.12em] uppercase">
            {t('elderTree.all')}
          </span>
        </button>
        {elderTreeVirtues.map((entry) => {
          const active = entry.class === selection
          const label = `${t(`heroClass.${entry.class}`)} · ${entry.name}`
          return (
            <button
              key={entry.class}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={label}
              title={label}
              onClick={() => setSelection(entry.class)}
              className={cn(tabBase, active ? tabActive : tabIdle)}
            >
              <ClassIcon heroClass={entry.class} className="size-6" />
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase">
                {t(`heroClass.${entry.class}`)}
              </span>
            </button>
          )
        })}
      </div>

      {virtue ? (
        <VirtueBranch
          virtue={virtue}
          level={Math.min(levels[virtue.class], getVirtueMaxLevel(virtue))}
          onLevelChange={(level) =>
            setLevels((previous) => ({ ...previous, [virtue.class]: level }))
          }
        />
      ) : (
        <VirtueOverview levels={levels} onSelect={setSelection} />
      )}
    </div>
  )
}
