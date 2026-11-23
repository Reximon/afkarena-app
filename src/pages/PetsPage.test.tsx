import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import '@/i18n'
import { createEmptyAppData } from '@/features/persistence/defaults'
import { useAppStore } from '@/store/useAppStore'
import { PetsPage } from './PetsPage'

beforeEach(() => {
  localStorage.clear()
  useAppStore.setState(createEmptyAppData())
})

describe('PetsPage', () => {
  it('lists every pet grouped by tier', () => {
    render(
      <MemoryRouter>
        <PetsPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Rare' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Elite' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Fabled' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Add / })).toHaveLength(30)
    expect(screen.getByText('0 / 30 owned')).toBeInTheDocument()
  })

  it('adds a pet and edits its buffs and training', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <PetsPage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Add Aureus' }))
    expect(useAppStore.getState().pets['6021']).toBeDefined()

    const dialog = screen.getByRole('dialog')
    const increaseStrength = within(dialog).getByRole('button', { name: 'Increase Strength buff' })
    for (let i = 0; i < 7; i += 1) await user.click(increaseStrength)

    expect(useAppStore.getState().pets['6021'].strength).toBe(7)
    expect(within(dialog).getByText('Lv 7 / 36')).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Training 2' }))
    expect(useAppStore.getState().pets['6021'].training).toBe(2)
  })

  it('flags pets below the resonance level without changing their buffs', async () => {
    const user = userEvent.setup()
    useAppStore.getState().addPet('6004', { strength: 2, intelligence: 2, agility: 1 })

    render(
      <MemoryRouter>
        <PetsPage />
      </MemoryRouter>,
    )

    const resonance = screen.getByLabelText('Beast resonance')
    await user.clear(resonance)
    await user.type(resonance, '7')

    expect(screen.getByLabelText('2 levels to resonance')).toHaveTextContent('+2')
    expect(useAppStore.getState().pets['6004']).toMatchObject({
      strength: 2,
      intelligence: 2,
      agility: 1,
    })

    await user.clear(resonance)
    await user.type(resonance, '3')
    expect(screen.queryByLabelText('2 levels to resonance')).not.toBeInTheDocument()

    await user.clear(resonance)
    await user.type(resonance, '20')
    expect(screen.getByLabelText('15 levels to resonance')).toHaveTextContent('+15')
    expect(useAppStore.getState().pets['6004'].strength).toBe(2)
  })

  it('hides the training control for rare pets', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <PetsPage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Add Dreary Ball' }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).queryByLabelText('Training')).not.toBeInTheDocument()
    expect(within(dialog).getByText('Rare pets have no training.')).toBeInTheDocument()
  })

  it('removes a pet after confirmation and clears the team pet', async () => {
    const user = userEvent.setup()
    useAppStore.getState().addPet('6004')
    const teamId = useAppStore.getState().createTeam({ name: 'Campaign', petId: '6004' })

    render(
      <MemoryRouter>
        <PetsPage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Remove Polar Beast' }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('Remove Polar Beast from your pets?')

    await user.click(within(dialog).getByRole('button', { name: 'Remove Polar Beast' }))

    expect(useAppStore.getState().pets['6004']).toBeUndefined()
    expect(useAppStore.getState().teams.find((team) => team.id === teamId)?.petId).toBeUndefined()
  })
})
