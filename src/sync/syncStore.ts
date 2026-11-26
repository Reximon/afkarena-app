import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RemoteRecord, SyncAccount, SyncErrorKind, SyncStatus } from './types'

export const SYNC_STORAGE_KEY = 'afk-astral-codex:sync'

interface SyncMeta {
  localUpdatedAt: number | null
  dirty: boolean
  lastSyncedAt: number | null
  lastSyncedServerVersion: string | null
  lastAccountId: string | null
}

interface SyncData {
  status: SyncStatus
  account: SyncAccount | null
  remoteRecordId: string | null
  lastError: SyncErrorKind | null
  conflict: RemoteRecord | null
}

interface PushSuccess {
  serverVersion: string
  accountId: string
  syncedStamp: number | null
}

interface PullSuccess {
  serverVersion: string
  accountId: string
  recordId: string
}

interface CheckSuccess {
  serverVersion: string
  accountId: string
}

export interface SyncState extends SyncMeta, SyncData {
  markLocalChange: () => void
  setAccount: (account: SyncAccount | null) => void
  setStatus: (status: SyncStatus) => void
  setLastError: (kind: SyncErrorKind | null) => void
  setRemoteRecordId: (id: string | null) => void
  openConflict: (remote: RemoteRecord) => void
  dismissConflict: () => void
  markPushSuccess: (input: PushSuccess) => void
  markPullSuccess: (input: PullSuccess) => void
  markCheckSuccess: (input: CheckSuccess) => void
}

export const SYNC_INITIAL_STATE = {
  localUpdatedAt: null,
  dirty: false,
  lastSyncedAt: null,
  lastSyncedServerVersion: null,
  lastAccountId: null,
  status: 'local',
  account: null,
  remoteRecordId: null,
  lastError: null,
  conflict: null,
} satisfies SyncMeta & SyncData

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      ...SYNC_INITIAL_STATE,

      markLocalChange: () => set({ localUpdatedAt: Date.now(), dirty: true }),

      setAccount: (account) => set({ account }),

      setStatus: (status) => set({ status }),

      setLastError: (lastError) => set({ lastError }),

      setRemoteRecordId: (remoteRecordId) => set({ remoteRecordId }),

      openConflict: (remote) =>
        set({ conflict: remote, remoteRecordId: remote.id, status: 'conflict' }),

      dismissConflict: () => set({ conflict: null }),

      markPushSuccess: ({ serverVersion, accountId, syncedStamp }) =>
        set((state) => ({
          dirty: state.localUpdatedAt !== syncedStamp,
          lastSyncedAt: Date.now(),
          lastSyncedServerVersion: serverVersion,
          lastAccountId: accountId,
          lastError: null,
        })),

      markPullSuccess: ({ serverVersion, accountId, recordId }) =>
        set({
          localUpdatedAt: Date.now(),
          dirty: false,
          lastSyncedAt: Date.now(),
          lastSyncedServerVersion: serverVersion,
          lastAccountId: accountId,
          remoteRecordId: recordId,
          lastError: null,
        }),

      markCheckSuccess: ({ serverVersion, accountId }) =>
        set({
          lastSyncedAt: Date.now(),
          lastSyncedServerVersion: serverVersion,
          lastAccountId: accountId,
          lastError: null,
        }),
    }),
    {
      name: SYNC_STORAGE_KEY,
      version: 1,
      partialize: (state) => ({
        localUpdatedAt: state.localUpdatedAt,
        dirty: state.dirty,
        lastSyncedAt: state.lastSyncedAt,
        lastSyncedServerVersion: state.lastSyncedServerVersion,
        lastAccountId: state.lastAccountId,
      }),
    },
  ),
)
