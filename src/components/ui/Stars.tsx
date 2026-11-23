import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/cn'

interface StarsProps {
  total: number
  value: number
  onChange?: (value: number) => void
  size?: number
  className?: string
  label?: string
}

export function Stars({ total, value, onChange, size = 14, className, label }: StarsProps) {
  const { t } = useTranslation()

  return (
    <div
      role={onChange ? 'radiogroup' : undefined}
      aria-label={label}
      className={cn('flex items-center gap-0.5', className)}
    >
      {Array.from({ length: total }, (_, index) => {
        const filled = index < value
        const star = (
          <Star
            size={size}
            aria-hidden="true"
            className={cn(
              'transition-colors',
              filled ? 'fill-gild text-gild' : 'fill-transparent text-muted/45',
            )}
          />
        )

        if (!onChange) {
          return (
            <span key={index} className="inline-flex">
              {star}
            </span>
          )
        }

        return (
          <button
            key={index}
            type="button"
            role="radio"
            aria-checked={filled}
            aria-label={t('heroScreen.starLabel', { n: index + 1 })}
            onClick={() => onChange(index + 1 === value ? index : index + 1)}
            className="icon-action rounded p-0.5 hover:text-gild"
          >
            {star}
          </button>
        )
      })}
    </div>
  )
}
