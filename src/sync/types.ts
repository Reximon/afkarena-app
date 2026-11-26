import type { ExportData } from '@/features/persistence/exportSchema'

export type SyncStatus = 'local' | 'syncing' | 'synced' | 'offline' | 'conflict' | 'error'

export type SyncErrorKind = 'network' | 'auth' | 'invalid' | 'newer' | 'conflict' | 'unknown'

export interface SyncAccount {
  id: string
  email: string
}

export interface RemoteRecord {
  id: string
  updated: string
  schemaVersion: number
  clientUpdatedAt: string
  data: unknown
}

export interface PushInput {
  recordId: string | null
  data: ExportData
  schemaVersion: number
  clientUpdatedAt: string
}

export interface SyncClient {
  restore: () => Promise<SyncAccount | null>
  signIn: (email: string, password: string) => Promise<SyncAccount>
  signOut: () => void
  fetchRemote: (userId: string) => Promise<RemoteRecord | null>
  pushRemote: (userId: string, input: PushInput) => Promise<RemoteRecord>
}

export class SyncRequestError extends Error {
  kind: SyncErrorKind

  constructor(kind: SyncErrorKind, message?: string) {
    super(message ?? kind)
    this.name = 'SyncRequestError'
    this.kind = kind
  }
}
