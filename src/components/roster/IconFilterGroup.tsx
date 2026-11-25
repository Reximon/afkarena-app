import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface IconFilterGroupProps<T extends string> {
  allLabel: string
  value: T | 'all'
  options: readonly T[]
  getOptionLabel: (value: T) => string
  renderIcon: (value: T) => ReactNode
  onChange: (value: T | 'all') => void
}

export function IconFilterGroup<T extends string>({
  allLabel,
  value,
  options,
  getOptionLabel,
  renderIcon,
  onChange,
}: IconFilterGroupProps<T>) {
  return (
    <div
      role="group"
      aria-label={allLabel}
      className="flex shrink-0 flex-nowrap items-center gap-1.5"
    >
      <button
        type="button"
        aria-pressed={value === 'all'}
        onClick={() => onChange('all')}
        className={cn(
          'h-9 rounded-full border px-3 font-mono text-[10px] tracking-[0.12em] uppercase transition-colors',
          value === 'all'
            ? 'border-gild/45 bg-gild/10 text-gild-bright'
            : 'border-line bg-night/40 text-muted hover:border-gild/40 hover:text-parch',
        )}
      >
        {allLabel}
      </button>
      {options.map((option) => {
        const label = getOptionLabel(option)
        return (
          <button
            key={option}
            type="button"
            aria-pressed={value === option}
            aria-label={label}
            title={label}
            onClick={() => onChange(value === option ? 'all' : option)}
            className={cn(
              'flex size-9 items-center justify-center rounded-full border transition-all',
              value === option
                ? 'border-gild/60 bg-gild/10 opacity-100 shadow-[0_0_16px_rgba(226,185,109,0.18)]'
                : 'border-line bg-night/40 opacity-65 hover:border-gild/40 hover:opacity-100',
            )}
          >
            {renderIcon(option)}
          </button>
        )
      })}
    </div>
  )
}
