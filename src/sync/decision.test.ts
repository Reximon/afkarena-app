import { describe, expect, it } from 'vitest'
import { decideSync } from './decision'

const base = {
  hasRemote: true,
  localDirty: false,
  sameAccount: true,
  lastSyncedServerVersion: 'v1',
  remoteVersion: 'v1',
}

describe('decideSync', () => {
  it('pushes when the server has no copy yet', () => {
    expect(decideSync({ ...base, hasRemote: false, remoteVersion: null })).toBe('push')
  })

  it('does nothing when neither side changed', () => {
    expect(decideSync(base)).toBe('none')
  })

  it('pushes when only the local copy changed', () => {
    expect(decideSync({ ...base, localDirty: true })).toBe('push')
  })

  it('pulls when only the server copy changed', () => {
    expect(decideSync({ ...base, remoteVersion: 'v2' })).toBe('pull')
  })

  it('reports a conflict when both sides changed', () => {
    expect(decideSync({ ...base, localDirty: true, remoteVersion: 'v2' })).toBe('conflict')
  })

  it('treats a different account as a first contact', () => {
    expect(decideSync({ ...base, sameAccount: false, localDirty: true, remoteVersion: 'v9' })).toBe(
      'conflict',
    )
    expect(
      decideSync({ ...base, sameAccount: false, localDirty: false, remoteVersion: 'v9' }),
    ).toBe('pull')
  })
})
