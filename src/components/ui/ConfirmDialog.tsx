import { useTranslation } from 'react-i18next'
import { Button } from './Button'
import { Dialog } from './Dialog'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  body: string
  confirmLabel?: string
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  body,
  confirmLabel,
  onConfirm,
}: ConfirmDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={body}
      className="max-w-md"
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            {confirmLabel ?? t('common.delete')}
          </Button>
        </>
      }
    >
      <div className="h-2" />
    </Dialog>
  )
}
