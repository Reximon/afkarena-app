import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { dismissConflict, isSyncEnabled, resolveConflict, useSyncStore } from '@/sync'
import { downloadTextFile } from '@/lib/download'

export function ConflictDialog() {
  const { t } = useTranslation()
  const conflict = useSyncStore((state) => state.conflict)

  if (!isSyncEnabled() || !conflict) return null

  function handleDownload() {
    if (!conflict) return

    downloadTextFile(
      `resonating-hall-server-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(conflict.data, null, 2),
    )
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) dismissConflict()
      }}
      title={t('sync.conflictTitle')}
      description={t('sync.conflictBody')}
      className="max-w-lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleDownload}>
            {t('sync.downloadServer')}
          </Button>
          <Button variant="secondary" onClick={() => void resolveConflict('server')}>
            {t('sync.keepServer')}
          </Button>
          <Button onClick={() => void resolveConflict('local')}>{t('sync.keepLocal')}</Button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-muted">{t('sync.conflictDetail')}</p>
    </Dialog>
  )
}
