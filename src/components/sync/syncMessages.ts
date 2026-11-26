import type { SyncErrorKind, SyncStatus } from '@/sync'

type StatusKey =
  | 'sync.status.local'
  | 'sync.status.syncing'
  | 'sync.status.synced'
  | 'sync.status.offline'
  | 'sync.status.conflict'
  | 'sync.status.error'

type ErrorKey =
  | 'sync.errorAuth'
  | 'sync.errorConflict'
  | 'sync.errorGeneric'
  | 'sync.errorInvalid'
  | 'sync.errorNetwork'
  | 'sync.errorNewer'
  | 'sync.errorSession'

export const statusKey: Record<SyncStatus, StatusKey> = {
  local: 'sync.status.local',
  syncing: 'sync.status.syncing',
  synced: 'sync.status.synced',
  offline: 'sync.status.offline',
  conflict: 'sync.status.conflict',
  error: 'sync.status.error',
}

export function syncErrorKey(kind: SyncErrorKind | null): ErrorKey | null {
  switch (kind) {
    case 'network':
      return 'sync.errorNetwork'
    case 'auth':
      return 'sync.errorSession'
    case 'invalid':
      return 'sync.errorInvalid'
    case 'newer':
      return 'sync.errorNewer'
    case 'conflict':
      return 'sync.errorConflict'
    case 'unknown':
      return 'sync.errorGeneric'
    default:
      return null
  }
}

export function formatSyncTime(timestamp: number, language: string): string {
  return new Intl.DateTimeFormat(language, { hour: '2-digit', minute: '2-digit' }).format(
    new Date(timestamp),
  )
}
