export type SyncDecision = 'push' | 'pull' | 'conflict' | 'none'

export interface SyncDecisionInput {
  hasRemote: boolean
  localDirty: boolean
  sameAccount: boolean
  lastSyncedServerVersion: string | null
  remoteVersion: string | null
}

export function decideSync({
  hasRemote,
  localDirty,
  sameAccount,
  lastSyncedServerVersion,
  remoteVersion,
}: SyncDecisionInput): SyncDecision {
  if (!hasRemote) {
    return 'push'
  }

  const baseline = sameAccount ? lastSyncedServerVersion : null

  if (remoteVersion === baseline) {
    return localDirty ? 'push' : 'none'
  }

  return localDirty ? 'conflict' : 'pull'
}
