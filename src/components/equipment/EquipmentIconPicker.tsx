import type { LucideIcon } from 'lucide-react'
import { Ban, Check } from 'lucide-react'
import { EquipmentImage } from '@/components/equipment/EquipmentImage'
import { cn } from '@/lib/cn'

export interface EquipmentIconOption {
  id: string
  name: string
  image?: string
  disabled?: boolean
  disabledReason?: string
}

export interface EquipmentIconGroup {
  label: string
  items: EquipmentIconOption[]
}

interface EquipmentIconPickerProps {
  value?: string
  onChange: (id: string) => void
  noneLabel: string
  groups: EquipmentIconGroup[]
  icon: LucideIcon
}

export function EquipmentIconPicker({
  value,
  onChange,
  noneLabel,
  groups,
  icon: Icon,
}: EquipmentIconPickerProps) {
  const selected = groups.flatMap((group) => group.items).find((item) => item.id === value)
  const legacy = value && !selected ? { id: value, name: value } : undefined

  return (
    <div className="rounded-xl border border-line bg-void/30 p-2.5">
      <button
        type="button"
        aria-label={noneLabel}
        aria-pressed={!value}
        onClick={() => onChange('')}
        className={cn(
          'flex h-9 w-full items-center justify-between gap-2 rounded-lg border px-2.5 text-xs transition-colors',
          value
            ? 'border-line bg-void/40 text-muted hover:border-gold/30 hover:text-bone'
            : 'border-gold/60 bg-gold/10 text-bone',
        )}
      >
        <span className="flex items-center gap-1.5">
          <Ban size={14} aria-hidden="true" />
          {noneLabel}
        </span>
        {value ? null : <Check size={14} className="text-gold" aria-hidden="true" />}
      </button>

      <div className="mt-2.5 max-h-56 space-y-2.5 overflow-y-auto pr-1">
        {legacy ? (
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              aria-label={legacy.name}
              aria-pressed
              title={legacy.name}
              onClick={() => onChange(legacy.id)}
              className="relative grid size-11 place-items-center overflow-hidden rounded-lg border border-gold/70 bg-void/40 ring-1 ring-gold/30"
            >
              <EquipmentImage icon={Icon} className="size-full object-contain p-0.5" />
              <Check
                size={10}
                strokeWidth={3}
                aria-hidden="true"
                className="absolute right-0.5 bottom-0.5 rounded-full bg-gold p-0.5 text-ink"
              />
            </button>
          </div>
        ) : null}

        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 font-mono text-[9px] tracking-[0.14em] text-muted uppercase">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => {
                const isSelected = item.id === value

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={item.name}
                    aria-pressed={isSelected}
                    disabled={item.disabled}
                    title={
                      item.disabled && item.disabledReason
                        ? `${item.name} · ${item.disabledReason}`
                        : item.name
                    }
                    onClick={() => onChange(item.id)}
                    className={cn(
                      'relative grid size-11 place-items-center overflow-hidden rounded-lg border bg-void/40 ring-1 transition-all',
                      isSelected
                        ? 'border-gold/70 ring-gold/30'
                        : 'border-line ring-transparent hover:border-gold/40',
                      item.disabled && 'cursor-not-allowed opacity-35 grayscale',
                    )}
                  >
                    <EquipmentImage
                      src={item.image}
                      icon={Icon}
                      className="size-full object-contain p-0.5"
                    />
                    {isSelected ? (
                      <Check
                        size={10}
                        strokeWidth={3}
                        aria-hidden="true"
                        className="absolute right-0.5 bottom-0.5 rounded-full bg-gold p-0.5 text-ink"
                      />
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <p className={cn('mt-2 truncate text-xs', selected || legacy ? 'text-cyan' : 'text-muted')}>
        {selected?.name ?? legacy?.name ?? noneLabel}
      </p>
    </div>
  )
}
