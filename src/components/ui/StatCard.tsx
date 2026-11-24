import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface StatCardProps {
  label: string
  value: string | number
  hint?: string
  icon: LucideIcon
  accent?: 'gold' | 'cyan' | 'rose'
  className?: string
}

const accents = {
  gold: 'text-gild',
  cyan: 'text-arcane',
  rose: 'text-ember',
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = 'gold',
  className,
}: StatCardProps) {
  return (
    <article className={cn('codex-panel p-5', className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">{label}</p>
          <p className="stat-value mt-2 text-3xl">{value}</p>
        </div>
        <span className={cn('stat-medal shrink-0', accents[accent])}>
          <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
        </span>
      </div>
      {hint ? <p className="mt-3 text-xs text-muted">{hint}</p> : null}
    </article>
  )
}
