import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type BadgeVariant = 'gold' | 'cyan' | 'rose' | 'muted' | 'outline'

const variants: Record<BadgeVariant, string> = {
  gold: 'border-gild/30 bg-gild/10 text-gild',
  cyan: 'border-arcane/30 bg-arcane/10 text-arcane',
  rose: 'border-ember/30 bg-ember/10 text-ember',
  muted: 'border-line bg-white/5 text-muted',
  outline: 'border-line bg-transparent text-parch',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({ className, variant = 'muted', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.12em] uppercase',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
