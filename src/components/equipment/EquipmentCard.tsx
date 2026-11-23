import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { EquipmentImage } from '@/components/equipment/EquipmentImage'
import { Badge } from '@/components/ui/Badge'

interface EquipmentCardProps {
  name: string
  subtitle?: string
  meta?: string
  effect?: string
  image?: string
  icon: LucideIcon
  count: number
  children: ReactNode
}

export function EquipmentCard({
  name,
  subtitle,
  meta,
  effect,
  image,
  icon: Icon,
  count,
  children,
}: EquipmentCardProps) {
  return (
    <article className="codex-panel flex flex-col p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-gold/25 bg-void/40 ring-1 ring-gold/10 ring-offset-2 ring-offset-ink">
          <EquipmentImage
            src={image}
            icon={Icon}
            className="size-full object-contain p-0.5"
            iconClassName="text-gold"
          />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl leading-tight text-bone">{name}</h2>
          {subtitle ? <p className="mt-1 text-sm leading-snug text-cyan">{subtitle}</p> : null}
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
