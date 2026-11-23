import { Minus, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ProgressStepControlProps<T extends number> {
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
}

export function ProgressStepControl<T extends number>({
  label,
  value,
  options,
  onChange,
}: ProgressStepControlProps<T>) {
  const { t } = useTranslation()
  const index = options.indexOf(value)

  function step(delta: number) {
    const next = Math.min(options.length - 1, Math.max(0, index + delta))
    onChange(options[next])
  }

  return (
    <div className="rounded-xl border border-line bg-night/30 px-3 py-2.5">
      <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{label}</p>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={index <= 0}
          aria-label={`${t('common.decrease')} ${label}`}
          className="icon-action rounded-lg border border-line bg-night/40 p-1.5 text-muted hover:border-gild/40 hover:text-parch disabled:opacity-40"
        >
          <Minus size={14} aria-hidden="true" />
        </button>
        <span className="font-display text-xl text-parch">
          {value === 0 ? t('common.none') : value}
        </span>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={index >= options.length - 1}
          aria-label={`${t('common.increase')} ${label}`}
          className="icon-action rounded-lg border border-line bg-night/40 p-1.5 text-muted hover:border-gild/40 hover:text-parch disabled:opacity-40"
        >
          <Plus size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
