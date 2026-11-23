import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/cn'

interface PickerDrawerProps {
  kicker: string
  title: string
  onClose: () => void
  children: ReactNode
}

export function PickerDrawer({ kicker, title, onClose, children }: PickerDrawerProps) {
  const { t } = useTranslation()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)

  useEffect(() => {
    closeRef.current = onClose
  })

  useEffect(() => {
    panelRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      event.preventDefault()
      closeRef.current()
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [])

  return (
    <div className="absolute inset-0 z-30">
      <button
        type="button"
        onClick={onClose}
        aria-label={t('common.close')}
        className="picker-backdrop absolute inset-0 h-full w-full cursor-default bg-night/70 backdrop-blur-[2px]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="picker-drawer-title"
        tabIndex={-1}
        className={cn(
          'picker-drawer absolute inset-x-0 bottom-0 max-h-[85%] overflow-y-auto rounded-t-2xl border-t border-line bg-panel p-4 shadow-[0_-18px_60px_rgba(0,0,0,0.55)] outline-none',
          'sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[23rem] sm:max-h-none sm:rounded-t-none sm:rounded-l-2xl sm:border-t-0 sm:border-l',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">{kicker}</p>
            <h3 id="picker-drawer-title" className="font-display text-xl text-parch">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-action grid size-8 place-items-center rounded-full border border-line bg-night/60 text-muted hover:border-gild/40 hover:text-parch"
          >
            <X size={15} aria-hidden="true" />
            <span className="sr-only">{t('common.close')}</span>
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}
