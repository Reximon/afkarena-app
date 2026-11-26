import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import '@/i18n'
import { createDefaultHeroProgress, createEmptyAppData } from '@/features/persistence/defaults'
import { useAppStore } from '@/store/useAppStore'
import { TierListPage } from './TierListPage'
import type { GearSlot } from '@/types'

const SLOTS: GearSlot[] = ['weapon', 'helmet', 'chest', 'boots']

beforeEach(() => {
  localStorage.clear()
  useAppStore.setState(createEmptyAppData())
})

function renderPage() {
  render(
    <MemoryRouter>
      <TierListPage />
    </MemoryRouter>,
  )
}

function addMaxedEnvydiel() {
  const gear = Object.fromEntries(
    SLOTS.map((slot) => [slot, { slot, tier: 't5' as const, stars: 5 as const }]),
  )

  useAppStore.getState().addHero(
    createDefaultHeroProgress('214', {
      ascension: 'ascended5',
      signatureItem: 40,
      furniture: 36,
      engraving: 80,
      gear,
    }),
  )
}

describe('TierListPage', () => {
  it('shows the overall ranking with an optimization grade on owned heroes', () => {
    addMaxedEnvydiel()
    renderPage()

    expect(screen.getByRole('tab', { name: /Overall/ })).toHaveAttribute('aria-selected', 'true')

    const tile = screen.getByRole('button', { name: 'View Envydiel' })
    expect(within(tile).getByTitle('Optimization 100%')).toHaveTextContent('S+')

    expect(screen.getByText('Liberta')).toBeInTheDocument()
  })

  it('filters the ranking down to owned heroes', async () => {
    const user = userEvent.setup()
    addMaxedEnvydiel()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Owned only' }))

    expect(screen.getByRole('button', { name: 'View Envydiel' })).toBeInTheDocument()
    expect(screen.queryByText('Liberta')).not.toBeInTheDocument()
  })

  it('switches between game modes', async () => {
    const user = userEvent.setup()
    renderPage()

    const campaign = screen.getByRole('tab', { name: /Campaign/ })
    await user.click(campaign)

    expect(campaign).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: /Overall/ })).toHaveAttribute('aria-selected', 'false')
  })

  it('prompts to add heroes when the roster is empty', () => {
    renderPage()

    expect(
      screen.getByText('Add your heroes to see your optimization grade next to each ranking.'),
    ).toBeInTheDocument()
  })
})
