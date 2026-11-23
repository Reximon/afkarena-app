import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-gild text-night shadow-[0_0_28px_rgba(224,185,94,0.18)] hover:bg-[#ecc978] active:bg-[#c9a44e]',
  secondary: 'border border-line bg-dusk/60 text-parch hover:bg-dusk',
  ghost: 'text-muted hover:bg-dusk/60 hover:text-parch',
  danger: 'border border-ember/40 bg-ember/10 text-ember hover:bg-ember/20',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 rounded-lg px-3 text-xs',
  md: 'h-10 gap-2 rounded-xl px-4 text-sm',
  lg: 'h-12 gap-2 rounded-xl px-5 text-sm',
}

interface ButtonStyleOptions {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonStyleOptions = {}) {
  return cn(
    'inline-flex items-center justify-center font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45',
    variants[variant],
    sizes[size],
    className,
  )
}
