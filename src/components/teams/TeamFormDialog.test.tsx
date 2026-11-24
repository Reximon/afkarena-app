import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import '@/i18n'
import { createEmptyAppData } from '@/features/persistence/defaults'
import { useAppStore } from '@/store/useAppStore'
import { TeamFormDialog } from './TeamFormDialog'

beforeEach(() => {
  localStorage.clear()
  useAppStore.setState(createEmptyAppData())
})

describe('TeamFormDialog', () => {
  it('assigns a pet from the icon picker', async () => {
    const user = userEvent.setup()
    useAppStore.getState().addPet('6004')
    const teamId = useAppStore.getState().createTeam({ name: 'Campaign' })

    render(
      <MemoryRouter>
        <TeamFormDialog teamId={teamId} onClose={vi.fn()} />
      </MemoryRouter>,
    )

    const group = screen.getByRole('radiogroup', { name: 'Pet' })
    const pet = within(group).getByRole('radio', { name: 'Polar Beast' })
    expect(pet).toHaveAttribute('aria-checked', 'false')

    await user.click(pet)
    expect(pet).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByText('Polar Beast')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(useAppStore.getState().teams.find((team) => team.id === teamId)?.petId).toBe('6004')
  })

  it('clears the team pet with the no-pet icon', async () => {
    const user = userEvent.setup()
    useAppStore.getState().addPet('6004')
    const teamId = useAppStore.getState().createTeam({ name: 'Campaign', petId: '6004' })

    render(
      <MemoryRouter>
        <TeamFormDialog teamId={teamId} onClose={vi.fn()} />
      </MemoryRouter>,
    )

    const group = screen.getByRole('radiogroup', { name: 'Pet' })
    expect(within(group).getByRole('radio', { name: 'Polar Beast' })).toHaveAttribute(
      'aria-checked',
      'true',
    )

    await user.click(within(group).getByRole('radio', { name: 'No pet' }))
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(useAppStore.getState().teams.find((team) => team.id === teamId)?.petId).toBeUndefined()
  })
})
