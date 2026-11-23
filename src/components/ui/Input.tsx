import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { cn } from '@/lib/cn'

const fieldStyles =
  'w-full rounded-xl border border-line bg-void/50 px-3 text-sm text-bone placeholder:text-muted/60 transition-colors focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/15 disabled:opacity-60'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
  return <input className={cn('h-10', fieldStyles, className)} {...props} />
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({ className, ...props }: TextareaProps) {
  return <textarea className={cn('min-h-24 py-2.5', fieldStyles, className)} {...props} />
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select className={cn('h-10', fieldStyles, className)} {...props}>
      {children}
    </select>
  )
}

interface FieldProps {
  label: string
  hint?: string
  children: ReactNode
  className?: string
  as?: 'label' | 'div'
}

export function Field({ label, hint, children, className, as: Component = 'label' }: FieldProps) {
  const groupProps = Component === 'div' ? { role: 'group', 'aria-label': label } : {}

  return (
    <Component className={cn('block', className)} {...groupProps}>
      <span className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint ? <span className="mt-1 block text-[11px] text-muted">{hint}</span> : null}
    </Component>
  )
}
