import type { Team } from '@/types'

export function sortTeamsByPin(teams: Team[]): Team[] {
  return [...teams].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)))
}

export function moveTeam(teams: Team[], activeId: string, overId: string): Team[] {
  if (activeId === overId) return teams

  const from = teams.findIndex((team) => team.id === activeId)
  const to = teams.findIndex((team) => team.id === overId)
  if (from < 0 || to < 0) return teams

  const next = [...teams]
  const moved = next[from]
  next.splice(from, 1)
  next.splice(to, 0, moved)

  return next
}
