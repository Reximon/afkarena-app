import PocketBase, { ClientResponseError } from 'pocketbase'
import { recordVersion } from './recordVersion'
import {
  SyncRequestError,
  type PushInput,
  type RemoteRecord,
  type SyncAccount,
  type SyncClient,
} from './types'

const USERS_COLLECTION = 'users'
const ROSTER_COLLECTION = 'roster_data'

interface RosterRecord {
  id: string
  updated?: string
  schemaVersion: number
  clientUpdatedAt?: string
  data: unknown
}

function toAccount(record: { id: string; email?: unknown }): SyncAccount {
  return {
    id: record.id,
    email: typeof record.email === 'string' ? record.email : '',
  }
}

function toRemoteRecord(record: RosterRecord): RemoteRecord {
  return {
    id: record.id,
    updated: recordVersion(record),
    schemaVersion: record.schemaVersion,
    clientUpdatedAt: record.clientUpdatedAt ?? '',
    data: record.data,
  }
}

function isStatus(error: unknown, status: number): boolean {
  return error instanceof ClientResponseError && error.status === status
}

function mapError(error: unknown): SyncRequestError {
  if (error instanceof SyncRequestError) return error

  if (error instanceof ClientResponseError) {
    if (error.status === 0 || error.isAbort) {
      return new SyncRequestError('network', error.message)
    }
    if (error.status === 401 || error.status === 403) {
      return new SyncRequestError('auth', error.message)
    }
  }

  return new SyncRequestError('unknown', error instanceof Error ? error.message : undefined)
}

export function createPocketBaseClient(apiUrl: string): SyncClient {
  const pb = new PocketBase(apiUrl)
  pb.autoCancellation(false)

  const users = () => pb.collection(USERS_COLLECTION)
  const roster = () => pb.collection(ROSTER_COLLECTION)

  return {
    async restore() {
      const stored = pb.authStore.record
      if (!stored) return null

      try {
        const auth = await users().authRefresh()
        return auth.record ? toAccount(auth.record) : null
      } catch (error) {
        if (error instanceof ClientResponseError && error.status === 0) {
          return pb.authStore.isValid ? toAccount(stored) : null
        }
        pb.authStore.clear()
        return null
      }
    },

    async signIn(email, password) {
      try {
        const auth = await users().authWithPassword(email, password)
        if (!auth.record) {
          throw new SyncRequestError('auth', 'Missing auth record')
        }
        return toAccount(auth.record)
      } catch (error) {
        if (isStatus(error, 400)) {
          throw new SyncRequestError('auth', error instanceof Error ? error.message : undefined)
        }
        throw mapError(error)
      }
    },

    signOut() {
      pb.authStore.clear()
    },

    async fetchRemote(userId) {
      try {
        const record = await roster().getFirstListItem<RosterRecord>(
          pb.filter('user = {:user}', { user: userId }),
        )
        return toRemoteRecord(record)
      } catch (error) {
        if (isStatus(error, 404)) return null
        throw mapError(error)
      }
    },

    async pushRemote(userId, input: PushInput) {
      const body = {
        user: userId,
        data: input.data,
        schemaVersion: input.schemaVersion,
        clientUpdatedAt: input.clientUpdatedAt,
      }

      try {
        const record = input.recordId
          ? await roster().update<RosterRecord>(input.recordId, body)
          : await roster().create<RosterRecord>(body)
        return toRemoteRecord(record)
      } catch (error) {
        if (isStatus(error, 400) || isStatus(error, 404)) {
          throw new SyncRequestError('conflict', error instanceof Error ? error.message : undefined)
        }
        throw mapError(error)
      }
    },
  }
}
