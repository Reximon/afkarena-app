import { describe, expect, it } from 'vitest'
import { recordVersion } from './recordVersion'

describe('recordVersion', () => {
  it('prefers the server autodate timestamp', () => {
    expect(recordVersion({ updated: '2026-11-27 20:00:00.000Z', clientUpdatedAt: 'earlier' })).toBe(
      '2026-11-27 20:00:00.000Z',
    )
  })

  it('falls back to clientUpdatedAt when the autodate field is missing or empty', () => {
    expect(recordVersion({ clientUpdatedAt: '2026-11-27 19:15:46.165Z' })).toBe(
      '2026-11-27 19:15:46.165Z',
    )
    expect(recordVersion({ updated: '', clientUpdatedAt: '2026-11-27 19:15:46.165Z' })).toBe(
      '2026-11-27 19:15:46.165Z',
    )
  })

  it('returns an empty version when the row has no timestamps', () => {
    expect(recordVersion({})).toBe('')
    expect(recordVersion({ updated: 42, clientUpdatedAt: null })).toBe('')
  })
})
