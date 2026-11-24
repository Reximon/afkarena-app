import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  body: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, body, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'codex-panel star-chart flex flex-col items-center justify-center px-6 py-16 text-center',
        className,
      )}
    >
      <span className="game-medallion mb-5 size-16 text-gild">
        <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h2 className="panel-title text-2xl">{title}</h2>
      <div className="gild-rule mt-4 w-40" aria-hidden="true" />
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{body}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
