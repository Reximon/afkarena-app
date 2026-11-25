import { describe, expect, it } from 'vitest'
import type { Team } from '@/types'
import { moveTeam, sortTeamsByPin } from './teamOrder'

function team(id: string, pinned?: boolean): Team {
  return {
    id,
    name: id,
    mode: 'campaign',
    slots: [],
    pinned,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }
}

describe('team order', () => {
  it('moves pinned teams first while keeping the manual order inside each group', () => {
    const teams = [team('a'), team('b', true), team('c'), team('d', true)]

    expect(sortTeamsByPin(teams).map((entry) => entry.id)).toEqual(['b', 'd', 'a', 'c'])
  })

  it('moves a team to the index of the drop target', () => {
    const teams = [team('a'), team('b'), team('c')]

    expect(moveTeam(teams, 'c', 'a').map((entry) => entry.id)).toEqual(['c', 'a', 'b'])
    expect(moveTeam(teams, 'a', 'b').map((entry) => entry.id)).toEqual(['b', 'a', 'c'])
  })

  it('ignores unknown or identical ids', () => {
    const teams = [team('a'), team('b')]

    expect(moveTeam(teams, 'a', 'a')).toBe(teams)
    expect(moveTeam(teams, 'a', 'missing')).toBe(teams)
  })
})
