interface VersionedRecord {
  updated?: unknown
  clientUpdatedAt?: unknown
}

// Rows created before the roster_data autodate migration have no `updated`.
export function recordVersion(record: VersionedRecord): string {
  if (typeof record.updated === 'string' && record.updated) return record.updated
  if (typeof record.clientUpdatedAt === 'string' && record.clientUpdatedAt) {
    return record.clientUpdatedAt
  }
  return ''
}
