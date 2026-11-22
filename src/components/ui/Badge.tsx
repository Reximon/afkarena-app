import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type BadgeVariant = 'gold' | 'cyan' | 'rose' | 'muted' | 'outline'

const variants: Record<BadgeVariant, string> = {
  gold: 'border-gold/30 bg-gold/10 text-gold',
  cyan: 'border-cyan/30 bg-cyan/10 text-cyan',
  rose: 'border-rose/30 bg-rose/10 text-rose',
  muted: 'border-line bg-white/5 text-muted',
  outline: 'border-line bg-transparent text-bone',
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
