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
      <span className="mb-5 rounded-2xl border border-gold/25 bg-gold/10 p-4 text-gold">
        <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h2 className="font-display text-2xl text-bone">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{body}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
