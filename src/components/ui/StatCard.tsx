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
  gold: 'text-gold bg-gold/10 border-gold/20',
  cyan: 'text-cyan bg-cyan/10 border-cyan/20',
  rose: 'text-rose bg-rose/10 border-rose/20',
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
          <p className="mt-2 font-display text-3xl text-bone">{value}</p>
        </div>
        <span className={cn('rounded-xl border p-2.5', accents[accent])}>
          <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
        </span>
      </div>
      {hint ? <p className="mt-3 text-xs text-muted">{hint}</p> : null}
    </article>
  )
}
