import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type BadgeVariant = 'gold' | 'cyan' | 'rose' | 'muted' | 'outline'

const variants: Record<BadgeVariant, string> = {
  gold: 'badge-gold',
  cyan: 'badge-cyan',
  rose: 'badge-rose',
  muted: 'badge-muted',
  outline: 'badge-outline',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({ className, variant = 'muted', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-[0.4rem] border px-2 py-0.5 font-mono text-[10px] leading-4 tracking-[0.12em] uppercase',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
