import type { ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/cn'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  overlay?: ReactNode
  className?: string
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  overlay,
  className,
}: DialogProps) {
  const { t } = useTranslation()

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="dialog-overlay fixed inset-0 z-50 bg-night/85 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={cn(
            'dialog-frame dialog-content fixed top-1/2 left-1/2 z-50 flex max-h-[90vh] w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl',
            className,
          )}
        >
          <div className="dialog-header flex items-start justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
              <DialogPrimitive.Title className="panel-title text-2xl leading-tight">
                {title}
              </DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="mt-1 text-sm leading-relaxed text-muted">
                  {description}
                </DialogPrimitive.Description>
              ) : null}
            </div>
            <DialogPrimitive.Close
              type="button"
              className="icon-action rounded-lg border border-gild/20 bg-night/60 p-2 text-muted hover:border-gild/45 hover:text-parch"
            >
              <X size={18} aria-hidden="true" />
              <span className="sr-only">{t('common.close')}</span>
            </DialogPrimitive.Close>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>

          {footer ? (
            <div className="dialog-footer flex flex-wrap justify-end gap-2 px-5 py-4">{footer}</div>
          ) : null}

          {overlay}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
