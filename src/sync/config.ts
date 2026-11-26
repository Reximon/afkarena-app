export const SYNC_SCHEMA_VERSION = 1

export function getApiUrl(): string {
  const value = import.meta.env.VITE_API_URL

  return typeof value === 'string' ? value.trim().replace(/\/+$/, '') : ''
}

export function isSyncEnabled(): boolean {
  return getApiUrl().length > 0
}
