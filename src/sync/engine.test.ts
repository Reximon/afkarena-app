import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDefaultHeroProgress, createEmptyAppData } from '@/features/persistence/defaults'
import { createExportData } from '@/features/persistence/importExport'
import { useAppStore } from '@/store/useAppStore'
import { SyncEngine } from './engine'
import { SYNC_INITIAL_STATE, useSyncStore } from './syncStore'
import {
  SyncRequestError,
  type PushInput,
  type RemoteRecord,
  type SyncAccount,
  type SyncClient,
} from './types'

const account: SyncAccount = { id: 'user1', email: 'player@example.com' }

function serverData() {
  const data = createEmptyAppData()
  data.heroes['9'] = createDefaultHeroProgress('9', {
    level: 300,
    updatedAt: '2026-11-26T09:00:00.000Z',
  })
  return createExportData(data)
}

function remoteRecord(updated = 'v1'): RemoteRecord {
  return {
    id: 'rec1',
    updated,
    schemaVersion: 1,
    clientUpdatedAt: '2026-11-26T09:00:00.000Z',
    data: serverData(),
  }
}

function createClient() {
  const client = {
    restore: vi.fn(async () => account),
    signIn: vi.fn(async () => account),
    signOut: vi.fn(),
    fetchRemote: vi.fn(async (_userId: string): Promise<RemoteRecord | null> => null),
    pushRemote: vi.fn(async (_userId: string, input: PushInput): Promise<RemoteRecord> => ({
      id: input.recordId ?? 'rec-new',
      updated: 'v1',
      schemaVersion: input.schemaVersion,
      clientUpdatedAt: input.clientUpdatedAt,
      data: input.data,
    })),
  }

  return client satisfies SyncClient
}

let engine: SyncEngine | null = null

beforeEach(() => {
  localStorage.clear()
  useAppStore.setState(createEmptyAppData())
  useSyncStore.setState({ ...SYNC_INITIAL_STATE })
})

afterEach(() => {
  engine?.dispose()
  engine = null
})

describe('SyncEngine', () => {
  it('uploads local changes after the debounce', async () => {
    const client = createClient()
    engine = new SyncEngine(client, { debounceMs: 5, baseRetryMs: 5, maxRetryMs: 10 })
    engine.start()

    await vi.waitFor(() => expect(client.fetchRemote).toHaveBeenCalledTimes(1))
    expect(client.pushRemote).not.toHaveBeenCalled()

    useAppStore.getState().setProfile({ playerName: 'Rex' })

    await vi.waitFor(() => expect(client.pushRemote).toHaveBeenCalledTimes(1))
    expect(client.pushRemote.mock.calls[0]?.[1].data.profile.playerName).toBe('Rex')

    await vi.waitFor(() => expect(useSyncStore.getState().dirty).toBe(false))
    expect(useSyncStore.getState().status).toBe('synced')
    expect(useSyncStore.getState().lastSyncedServerVersion).toBe('v1')
  })

  it('keeps background pushes silent and announces only manual syncs', async () => {
    const client = createClient()
    engine = new SyncEngine(client, { debounceMs: 5, baseRetryMs: 5, maxRetryMs: 10 })
    engine.start()

    await vi.waitFor(() => expect(useSyncStore.getState().status).toBe('synced'))
    await vi.waitFor(() => expect(useSyncStore.getState().account).not.toBeNull())

    const statuses: string[] = []
    const unsubscribe = useSyncStore.subscribe((state) => statuses.push(state.status))

    useAppStore.getState().setProfile({ playerName: 'Rex' })
    await vi.waitFor(() => expect(client.pushRemote).toHaveBeenCalledTimes(1))
    await vi.waitFor(() => expect(useSyncStore.getState().dirty).toBe(false))

    expect(statuses).not.toContain('syncing')

    engine.syncNow()
    await vi.waitFor(() => expect(statuses).toContain('syncing'))

    unsubscribe()
  })

  it('pulls the server copy when the local data is clean', async () => {
    const client = createClient()
    client.fetchRemote.mockResolvedValue(remoteRecord())
    engine = new SyncEngine(client, { debounceMs: 5, baseRetryMs: 5, maxRetryMs: 10 })
    engine.start()

    await vi.waitFor(() => expect(useAppStore.getState().heroes['9']?.level).toBe(300))
    expect(client.pushRemote).not.toHaveBeenCalled()
    expect(useSyncStore.getState().lastSyncedServerVersion).toBe('v1')
    expect(useSyncStore.getState().status).toBe('synced')
  })

  it('opens a conflict when both sides changed and keeps the local copy on demand', async () => {
    const client = createClient()
    client.fetchRemote.mockResolvedValue(remoteRecord())
    useSyncStore.setState({ dirty: true, localUpdatedAt: Date.now() })

    engine = new SyncEngine(client, { debounceMs: 5, baseRetryMs: 5, maxRetryMs: 10 })
    engine.start()

    await vi.waitFor(() => expect(useSyncStore.getState().conflict).not.toBeNull())
    expect(client.pushRemote).not.toHaveBeenCalled()

    client.pushRemote.mockImplementation(async (_userId, input) => ({
      id: input.recordId ?? 'rec-new',
      updated: 'v2',
      schemaVersion: input.schemaVersion,
      clientUpdatedAt: input.clientUpdatedAt,
      data: input.data,
    }))

    await engine.resolveConflict('local')

    expect(client.pushRemote).toHaveBeenCalledTimes(1)
    expect(client.pushRemote.mock.calls[0]?.[1].recordId).toBe('rec1')
    expect(useSyncStore.getState().conflict).toBeNull()
    expect(useSyncStore.getState().lastSyncedServerVersion).toBe('v2')
    expect(useAppStore.getState().heroes).toEqual({})
  })

  it('applies the server copy when the conflict is resolved in its favour', async () => {
    const client = createClient()
    client.fetchRemote.mockResolvedValue(remoteRecord())
    useSyncStore.setState({ dirty: true, localUpdatedAt: Date.now() })

    engine = new SyncEngine(client, { debounceMs: 5, baseRetryMs: 5, maxRetryMs: 10 })
    engine.start()

    await vi.waitFor(() => expect(useSyncStore.getState().conflict).not.toBeNull())

    await engine.resolveConflict('server')

    expect(useAppStore.getState().heroes['9']?.level).toBe(300)
    expect(client.pushRemote).not.toHaveBeenCalled()
    expect(useSyncStore.getState().dirty).toBe(false)
  })

  it('retries with backoff when the server is unreachable', async () => {
    const client = createClient()
    client.fetchRemote
      .mockRejectedValueOnce(new SyncRequestError('network'))
      .mockRejectedValueOnce(new SyncRequestError('network'))

    engine = new SyncEngine(client, { debounceMs: 5, baseRetryMs: 100, maxRetryMs: 200 })
    engine.start()

    await vi.waitFor(() => expect(useSyncStore.getState().status).toBe('offline'))
    await vi.waitFor(() => expect(client.fetchRemote.mock.calls.length).toBeGreaterThanOrEqual(3))
    await vi.waitFor(() => expect(useSyncStore.getState().status).toBe('synced'))
    expect(useSyncStore.getState().lastError).toBeNull()
  })
})
