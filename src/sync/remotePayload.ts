import type { AppData } from '@/types'
import { parseImport } from '@/features/persistence/importExport'
import { SYNC_SCHEMA_VERSION } from './config'
import { SyncRequestError, type RemoteRecord } from './types'

type Migration = (data: unknown) => unknown

const migrations: Record<number, Migration> = {}

export function remoteToAppData(record: RemoteRecord): AppData {
  const version = record.schemaVersion

  if (!Number.isFinite(version) || version < 0) {
    throw new SyncRequestError('invalid', 'Invalid remote schema version')
  }

  if (version > SYNC_SCHEMA_VERSION) {
    throw new SyncRequestError('newer', 'Remote schema is newer than the app')
  }

  let data = record.data

  for (let target = version + 1; target <= SYNC_SCHEMA_VERSION; target += 1) {
    const migrate = migrations[target]
    if (migrate) {
      data = migrate(data)
    }
  }

  const raw = JSON.stringify(data)

  if (raw === undefined) {
    throw new SyncRequestError('invalid', 'Remote data is empty')
  }

  try {
    return parseImport(raw)
  } catch (error) {
    throw new SyncRequestError('invalid', error instanceof Error ? error.message : undefined)
  }
}
