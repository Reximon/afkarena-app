import { beforeEach, describe, expect, it, vi } from 'vitest'

const { authWithPassword, clear } = vi.hoisted(() => ({
  authWithPassword: vi.fn(),
  clear: vi.fn(),
}))

vi.mock('pocketbase', () => {
  class ClientResponseError extends Error {
    status: number
    isAbort = false

    constructor(status: number) {
      super(`status ${status}`)
      this.status = status
    }
  }

  class PocketBase {
    authStore = { clear }

    autoCancellation() {}

    collection() {
      return { authWithPassword }
    }
  }

  return { default: PocketBase, ClientResponseError }
})

import { ClientResponseError } from 'pocketbase'
import { createPocketBaseClient } from './pocketbaseClient'

describe('createPocketBaseClient', () => {
  beforeEach(() => {
    authWithPassword.mockReset()
  })

  it('maps wrong credentials (400) to an auth error', async () => {
    authWithPassword.mockRejectedValue(new ClientResponseError(400))

    const client = createPocketBaseClient('http://api.test')

    await expect(client.signIn('player@test.dev', 'wrong')).rejects.toMatchObject({ kind: 'auth' })
  })

  it('maps an unreachable server to a network error', async () => {
    authWithPassword.mockRejectedValue(new ClientResponseError(0))

    const client = createPocketBaseClient('http://api.test')

    await expect(client.signIn('player@test.dev', 'wrong')).rejects.toMatchObject({
      kind: 'network',
    })
  })
})
