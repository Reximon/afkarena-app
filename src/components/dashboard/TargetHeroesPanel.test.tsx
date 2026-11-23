import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import '@/i18n'
import { createDefaultHeroProgress, createEmptyAppData } from '@/features/persistence/defaults'
import { useAppStore } from '@/store/useAppStore'
import { TargetHeroesPanel } from './TargetHeroesPanel'

beforeEach(() => {
  localStorage.clear()
  useAppStore.setState(createEmptyAppData())
})

function renderPanel() {
  return render(
    <MemoryRouter>
      <TargetHeroesPanel />
    </MemoryRouter>,
  )
}

describe('TargetHeroesPanel', () => {
  it('marks an owned hero as target from the picker', async () => {
    const user = userEvent.setup()
    useAppStore.getState().addHero(createDefaultHeroProgress('182'))

    renderPanel()

    expect(screen.getByText('No targets yet')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add target' }))
    await user.click(screen.getByRole('button', { name: /Adrian & Elyse/ }))

    expect(useAppStore.getState().heroes['182'].priority).toBe(true)

    await user.keyboard('{Escape}')
    expect(screen.getByRole('button', { name: 'View Adrian & Elyse' })).toBeInTheDocument()
    expect(screen.getByText('SI 0')).toBeInTheDocument()
  })

  it('removes a target from its card', async () => {
    const user = userEvent.setup()
    useAppStore.getState().addHero(createDefaultHeroProgress('182', { priority: true }))

    renderPanel()

    await user.click(screen.getByRole('button', { name: 'Remove Adrian & Elyse from targets' }))

    expect(useAppStore.getState().heroes['182'].priority).toBe(false)
    expect(screen.getByText('No targets yet')).toBeInTheDocument()
  })

  it('opens the hero detail and syncs the target toggle', async () => {
    const user = userEvent.setup()
    useAppStore.getState().addHero(createDefaultHeroProgress('182', { priority: true }))

    renderPanel()

    await user.click(screen.getByRole('button', { name: 'View Adrian & Elyse' }))
    await user.click(screen.getByRole('button', { name: 'Target hero' }))

    expect(useAppStore.getState().heroes['182'].priority).toBe(false)
  })
})
