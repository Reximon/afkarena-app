import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({ eyebrow, title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <header
      className={cn('flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between', className)}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-2 font-mono text-[11px] tracking-[0.24em] text-gold uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-balance font-display text-4xl leading-[1.05] text-bone sm:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  )
}
