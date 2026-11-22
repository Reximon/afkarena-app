import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

interface EquipmentCardProps {
  name: string
  subtitle?: string
  meta?: string
  effect?: string
  icon: LucideIcon
  count: number
  children: ReactNode
}

export function EquipmentCard({
  name,
  subtitle,
  meta,
  effect,
  icon: Icon,
  count,
  children,
}: EquipmentCardProps) {
  return (
    <article className="codex-panel flex flex-col p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-gold/25 bg-gold/10 text-gold ring-1 ring-gold/10 ring-offset-2 ring-offset-ink">
          <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl leading-tight text-bone">{name}</h2>
          {subtitle ? (
            <p className="mt-1 text-sm leading-snug text-cyan">{subtitle}</p>
          ) : null}
          {meta ? (
            <p className="mt-1 font-mono text-[9px] tracking-[0.14em] text-muted uppercase">
              {meta}
            </p>
          ) : null}
        </div>
        <Badge variant={count > 0 ? 'cyan' : 'muted'}>{count}</Badge>
      </div>

      {effect ? <p className="mt-3 text-sm leading-relaxed text-muted">{effect}</p> : null}

      {children}
    </article>
  )
}
