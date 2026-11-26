import { getApiUrl, isSyncEnabled } from './config'
import { SyncEngine } from './engine'
import { createPocketBaseClient } from './pocketbaseClient'
import { SyncRequestError } from './types'

let engine: SyncEngine | null = null

export function startSync() {
  if (engine || !isSyncEnabled()) return

  engine = new SyncEngine(createPocketBaseClient(getApiUrl()))
  engine.start()
}

function requireEngine(): SyncEngine {
  if (!engine) {
    throw new SyncRequestError('unknown', 'Sync is not enabled')
  }

  return engine
}

export function signIn(email: string, password: string) {
  return requireEngine().signIn(email, password)
}

export function signOut() {
  engine?.signOut()
}

export function syncNow() {
  engine?.syncNow()
}

export function resolveConflict(choice: 'local' | 'server') {
  return requireEngine().resolveConflict(choice)
}

export function dismissConflict() {
  engine?.dismissConflict()
}
