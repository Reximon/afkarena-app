import { useTranslation } from 'react-i18next'
import { isSyncEnabled, useSyncStore, type SyncStatus } from '@/sync'
import { cn } from '@/lib/cn'
import { statusKey } from './syncMessages'

const tones: Record<SyncStatus, string> = {
  local: 'bg-muted/60',
  syncing: 'bg-gild animate-pulse',
  synced: 'bg-arcane',
  offline: 'bg-ember',
  conflict: 'bg-ember',
  error: 'bg-ember',
}

export function SyncStatusIndicator() {
  const { t } = useTranslation()
  const status = useSyncStore((state) => state.status)

  if (!isSyncEnabled()) return null

  const label = t(statusKey[status])

  return (
    <span className="grid size-9 shrink-0 place-items-center" title={label}>
      <span className={cn('size-2 rounded-full', tones[status])} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  )
}
