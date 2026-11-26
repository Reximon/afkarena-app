import { describe, expect, it } from 'vitest'
import type { AppData } from '@/types'
import { createDefaultHeroProgress, createEmptyAppData } from '@/features/persistence/defaults'
import { createExportData } from '@/features/persistence/importExport'
import { remoteToAppData } from './remotePayload'
import { SyncRequestError, type RemoteRecord } from './types'

function sampleData(): AppData {
  const data = createEmptyAppData()
  data.heroes['9'] = createDefaultHeroProgress('9', { level: 240 })
  return data
}

function remote(data: unknown, overrides: Partial<RemoteRecord> = {}): RemoteRecord {
  return {
    id: 'rec1',
    updated: '2026-11-26T10:00:00.000Z',
    schemaVersion: 1,
    clientUpdatedAt: '2026-11-26T10:00:00.000Z',
    data,
    ...overrides,
  }
}

function captureError(fn: () => unknown): SyncRequestError {
  try {
    fn()
  } catch (error) {
    if (error instanceof SyncRequestError) return error
    throw error
  }

  throw new Error('Expected a SyncRequestError')
}

describe('remoteToAppData', () => {
  it('parses a valid readable payload', () => {
    const data = remoteToAppData(remote(createExportData(sampleData())))

    expect(data.heroes['9']?.level).toBe(240)
  })

  it('accepts older schema versions and migrates them', () => {
    const data = remoteToAppData(remote(createExportData(sampleData()), { schemaVersion: 0 }))

    expect(data.heroes['9']?.level).toBe(240)
  })

  it('rejects a payload from a newer schema', () => {
    const error = captureError(() =>
      remoteToAppData(remote(createExportData(sampleData()), { schemaVersion: 2 })),
    )

    expect(error.kind).toBe('newer')
  })

  it('rejects an invalid payload without applying it', () => {
    const exported = createExportData(sampleData())
    const broken = {
      ...exported,
      heroes: { 'Unknown hero': exported.heroes['Brutus'] ?? Object.values(exported.heroes)[0] },
    }

    const error = captureError(() => remoteToAppData(remote(broken)))

    expect(error.kind).toBe('invalid')
  })

  it('rejects empty payloads', () => {
    const error = captureError(() => remoteToAppData(remote(undefined)))

    expect(error.kind).toBe('invalid')
  })
})
