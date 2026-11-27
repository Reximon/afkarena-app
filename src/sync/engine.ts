import { createExportData } from '@/features/persistence/importExport'
import { useAppStore } from '@/store/useAppStore'
import { SYNC_SCHEMA_VERSION } from './config'
import { decideSync } from './decision'
import { remoteToAppData } from './remotePayload'
import { useSyncStore } from './syncStore'
import { SyncRequestError, type RemoteRecord, type SyncAccount, type SyncClient } from './types'

interface SyncEngineOptions {
  debounceMs?: number
  baseRetryMs?: number
  maxRetryMs?: number
}

const DEFAULT_DEBOUNCE_MS = 2000
const DEFAULT_RETRY_BASE_MS = 2000
const DEFAULT_RETRY_MAX_MS = 60000

export class SyncEngine {
  private client: SyncClient
  private debounceMs: number
  private retryBaseMs: number
  private retryMaxMs: number
  private pushTimer: ReturnType<typeof setTimeout> | null = null
  private retryTimer: ReturnType<typeof setTimeout> | null = null
  private retryAttempt = 0
  private manualRequest = false
  private inFlight = false
  private rerunRequested = false
  private applyingRemote = false
  private started = false
  private unsubscribe: (() => void) | null = null

  constructor(client: SyncClient, options: SyncEngineOptions = {}) {
    this.client = client
    this.debounceMs = options.debounceMs ?? DEFAULT_DEBOUNCE_MS
    this.retryBaseMs = options.baseRetryMs ?? DEFAULT_RETRY_BASE_MS
    this.retryMaxMs = options.maxRetryMs ?? DEFAULT_RETRY_MAX_MS
  }

  start() {
    if (this.started) return
    this.started = true

    this.unsubscribe = useAppStore.subscribe((state, previous) => {
      if (this.applyingRemote) return
      if (
        state.profile === previous.profile &&
        state.heroes === previous.heroes &&
        state.pets === previous.pets &&
        state.teams === previous.teams
      ) {
        return
      }

      useSyncStore.getState().markLocalChange()
      this.schedulePush()
    })

    window.addEventListener('online', this.handleOnline)
    document.addEventListener('visibilitychange', this.handleVisibility)

    void this.restoreSession()
  }

  dispose() {
    this.unsubscribe?.()
    this.unsubscribe = null
    window.removeEventListener('online', this.handleOnline)
    document.removeEventListener('visibilitychange', this.handleVisibility)
    this.clearTimer('push')
    this.clearTimer('retry')
    this.inFlight = false
    this.rerunRequested = false
    this.manualRequest = false
    this.started = false
  }

  async signIn(email: string, password: string) {
    try {
      const account = await this.client.signIn(email, password)
      this.applyAccount(account)
      this.retryAttempt = 0
      await this.runSyncCycle()
    } catch (error) {
      useSyncStore.getState().setStatus('local')
      useSyncStore.getState().setLastError(null)
      throw error
    }
  }

  signOut() {
    this.client.signOut()
    this.clearTimer('push')
    this.clearTimer('retry')
    this.manualRequest = false

    const store = useSyncStore.getState()
    store.setAccount(null)
    store.clearConflict()
    store.setRemoteRecordId(null)
    store.setLastError(null)
    store.setStatus('local')
  }

  syncNow() {
    const store = useSyncStore.getState()
    if (store.conflict) {
      store.showConflict()
      return
    }

    this.retryAttempt = 0
    this.manualRequest = true
    this.requestCycle()
  }

  dismissConflict() {
    const store = useSyncStore.getState()
    if (!store.conflict) return

    store.dismissConflict()
  }

  async resolveConflict(choice: 'local' | 'server') {
    const conflict = useSyncStore.getState().conflict
    if (!conflict) return

    useSyncStore.getState().clearConflict()

    if (choice === 'server') {
      try {
        this.applyRemote(conflict)
        useSyncStore.getState().setStatus('synced')
      } catch (error) {
        this.handleFailure(error)
      }
      return
    }

    useSyncStore.getState().setStatus('syncing')
    await this.runPush(true)
  }

  private handleOnline = () => {
    this.retryAttempt = 0
    this.requestCycle()
  }

  private handleVisibility = () => {
    if (document.visibilityState === 'visible') {
      this.requestCycle()
    }
  }

  private async restoreSession() {
    useSyncStore.getState().setStatus('local')

    try {
      const account = await this.client.restore()
      if (!account) return
      this.applyAccount(account)
      await this.runSyncCycle()
    } catch (error) {
      this.handleFailure(error)
    }
  }

  private applyAccount(account: SyncAccount) {
    if (useSyncStore.getState().account?.id !== account.id) {
      useSyncStore.setState({
        remoteRecordId: null,
        lastSyncedAt: null,
        lastSyncedServerVersion: null,
        lastAccountId: null,
      })
    }

    useSyncStore.getState().setAccount(account)
    useSyncStore.getState().setStatus('syncing')
  }

  private requestCycle() {
    if (!useSyncStore.getState().account) {
      this.manualRequest = false
      return
    }

    if (this.inFlight) {
      this.rerunRequested = true
      return
    }

    void this.runSyncCycle()
  }

  private async runSyncCycle() {
    if (this.inFlight) {
      this.rerunRequested = true
      return
    }

    const manual = this.manualRequest
    this.manualRequest = false

    const initial = useSyncStore.getState()
    if (!initial.account || initial.conflict) return

    this.inFlight = true
    this.clearTimer('retry')
    const accountId = initial.account.id
    if (manual) useSyncStore.getState().setStatus('syncing')

    try {
      const remote = await this.client.fetchRemote(accountId)
      if (useSyncStore.getState().account?.id !== accountId) return

      const current = useSyncStore.getState()
      current.setRemoteRecordId(remote?.id ?? null)

      const decision = decideSync({
        hasRemote: remote !== null,
        localDirty: current.dirty,
        sameAccount: current.lastAccountId === accountId,
        lastSyncedServerVersion: current.lastSyncedServerVersion,
        remoteVersion: remote?.updated ?? null,
      })

      if (decision === 'conflict' && remote) {
        current.detectConflict(remote)
      } else if (decision === 'pull' && remote) {
        this.applyRemote(remote)
        useSyncStore.getState().setStatus('synced')
        this.retryAttempt = 0
      } else if (decision === 'push') {
        await this.runPush(manual)
      } else if (decision === 'none' && remote) {
        current.markCheckSuccess({ serverVersion: remote.updated, accountId })
        current.setStatus('synced')
        this.retryAttempt = 0
      }

      useSyncStore.getState().setLastError(null)
    } catch (error) {
      this.handleFailure(error)
    } finally {
      this.inFlight = false
      if (this.rerunRequested) {
        this.rerunRequested = false
        this.requestCycle()
      }
    }
  }

  private async runPush(manual = false) {
    const initial = useSyncStore.getState()
    if (!initial.account) return

    if (!initial.dirty) {
      initial.setStatus('synced')
      return
    }

    const accountId = initial.account.id
    const syncedStamp = initial.localUpdatedAt
    const data = createExportData(useAppStore.getState())

    try {
      const record = await this.client.pushRemote(accountId, {
        recordId: initial.remoteRecordId,
        data,
        schemaVersion: SYNC_SCHEMA_VERSION,
        clientUpdatedAt: new Date(syncedStamp ?? Date.now()).toISOString(),
      })

      if (useSyncStore.getState().account?.id !== accountId) return

      const current = useSyncStore.getState()
      current.markPushSuccess({ serverVersion: record.updated, accountId, syncedStamp })
      current.setRemoteRecordId(record.id)
      this.retryAttempt = 0

      if (useSyncStore.getState().dirty) {
        if (manual) current.setStatus('syncing')
        this.schedulePush()
      } else {
        current.setStatus('synced')
      }
    } catch (error) {
      this.handleFailure(error)
    }
  }

  private applyRemote(remote: RemoteRecord) {
    const account = useSyncStore.getState().account
    if (!account) return

    const data = remoteToAppData(remote)

    this.applyingRemote = true
    try {
      useAppStore.getState().importData(data)
    } finally {
      this.applyingRemote = false
    }

    useSyncStore.getState().markPullSuccess({
      serverVersion: remote.updated,
      accountId: account.id,
      recordId: remote.id,
    })
    this.retryAttempt = 0
  }

  private handleFailure(error: unknown) {
    const kind = error instanceof SyncRequestError ? error.kind : 'unknown'

    if (kind === 'conflict') {
      this.scheduleCycle(0)
      return
    }

    const store = useSyncStore.getState()
    store.setLastError(kind)
    store.setStatus(kind === 'network' ? 'offline' : 'error')

    if (kind === 'auth') {
      this.client.signOut()
      store.setAccount(null)
      store.setRemoteRecordId(null)
      this.clearTimer('push')
      this.clearTimer('retry')
      return
    }

    if (kind === 'network' || kind === 'unknown') {
      this.scheduleCycle()
    }
  }

  private schedulePush() {
    this.clearTimer('push')

    const store = useSyncStore.getState()
    if (!store.account || store.conflict) return

    this.pushTimer = setTimeout(() => {
      this.pushTimer = null
      this.requestCycle()
    }, this.debounceMs)
  }

  private scheduleCycle(delay?: number) {
    if (!useSyncStore.getState().account) return
    if (this.retryTimer) return

    const wait = delay ?? this.nextRetryDelay()

    this.retryTimer = setTimeout(() => {
      this.retryTimer = null
      this.requestCycle()
    }, wait)
  }

  private nextRetryDelay() {
    const delay = Math.min(this.retryBaseMs * 2 ** this.retryAttempt, this.retryMaxMs)
    this.retryAttempt += 1
    return delay
  }

  private clearTimer(timer: 'push' | 'retry') {
    if (timer === 'push') {
      if (this.pushTimer) clearTimeout(this.pushTimer)
      this.pushTimer = null
      return
    }

    if (this.retryTimer) clearTimeout(this.retryTimer)
    this.retryTimer = null
  }
}
