import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-gold text-void shadow-[0_0_28px_rgba(231,200,115,0.16)] hover:bg-[#f0d98f] active:bg-[#d8b95f]',
  secondary: 'border border-line bg-violet/60 text-bone hover:bg-violet',
  ghost: 'text-muted hover:bg-violet/60 hover:text-bone',
  danger: 'border border-rose/40 bg-rose/10 text-rose hover:bg-rose/20',
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
