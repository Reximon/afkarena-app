import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import '@/i18n'
import { createDefaultHeroProgress, createEmptyAppData } from '@/features/persistence/defaults'
import { useAppStore } from '@/store/useAppStore'
import { RosterPage } from './RosterPage'

beforeEach(() => {
  localStorage.clear()
  useAppStore.setState(createEmptyAppData())
})

describe('RosterPage sorting', () => {
  it('orders heroes by ascension in both directions', async () => {
    const user = userEvent.setup()
    useAppStore.getState().addHero(createDefaultHeroProgress('131', { ascension: 'mythic' }))
    useAppStore.getState().addHero(createDefaultHeroProgress('98', { ascension: 'elite' }))
    useAppStore.getState().addHero(createDefaultHeroProgress('182', { ascension: 'ascended' }))

    render(
      <MemoryRouter>
        <RosterPage />
      </MemoryRouter>,
    )

    const viewOrder = () =>
      screen
        .getAllByRole('button', { name: /^View / })
        .map((button) => button.getAttribute('aria-label'))

    expect(viewOrder()).toEqual(['View Adrian & Elyse', 'View Ainz Ooal Gown', 'View Alaro'])

    const select = screen.getByRole('combobox', { name: 'Sort by' })
    await user.selectOptions(select, 'ascension-desc')
    expect(viewOrder()).toEqual(['View Adrian & Elyse', 'View Alaro', 'View Ainz Ooal Gown'])

    await user.selectOptions(select, 'ascension-asc')
    expect(viewOrder()).toEqual(['View Ainz Ooal Gown', 'View Alaro', 'View Adrian & Elyse'])
  })
})

describe('RosterPage targets', () => {
  it('flags target cards and filters the roster to them', async () => {
    const user = userEvent.setup()
    useAppStore.getState().addHero(createDefaultHeroProgress('182', { priority: true }))
    useAppStore.getState().addHero(createDefaultHeroProgress('131'))

    render(
      <MemoryRouter>
        <RosterPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Target')).toBeInTheDocument()
    expect(screen.getByText('Alaro')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Targets only' }))

    expect(screen.getByText('Adrian & Elyse')).toBeInTheDocument()
    expect(screen.queryByText('Alaro')).not.toBeInTheDocument()
  })

  it('toggles the target flag directly from a card', async () => {
    const user = userEvent.setup()
    useAppStore.getState().addHero(createDefaultHeroProgress('131'))

    render(
      <MemoryRouter>
        <RosterPage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Mark Alaro as target' }))
    expect(useAppStore.getState().heroes['131'].priority).toBe(true)
    expect(screen.getByRole('button', { name: 'Unmark Alaro as target' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Unmark Alaro as target' }))
    expect(useAppStore.getState().heroes['131'].priority).toBe(false)
    expect(screen.getByRole('button', { name: 'Mark Alaro as target' })).toBeInTheDocument()
  })
})
