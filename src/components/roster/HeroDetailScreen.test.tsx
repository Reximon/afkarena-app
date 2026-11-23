import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import '@/i18n'
import { createDefaultHeroProgress, createEmptyAppData } from '@/features/persistence/defaults'
import { useAppStore } from '@/store/useAppStore'
import { HeroDetailScreen } from './HeroDetailScreen'

beforeEach(() => {
  localStorage.clear()
  useAppStore.setState(createEmptyAppData())
})

describe('HeroDetailScreen', () => {
  it('auto-saves edits to the store in edit mode', async () => {
    const user = userEvent.setup()
    useAppStore.getState().addHero(createDefaultHeroProgress('182', { level: 200 }))

    render(<HeroDetailScreen heroId="182" onClose={vi.fn()} />)

    expect(screen.getByText('Adrian & Elyse')).toBeInTheDocument()
    expect(screen.getByText('Progress saved')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'In crystal' }))
    expect(useAppStore.getState().heroes['182'].inCrystal).toBe(true)

    await user.click(screen.getByRole('button', { name: 'Target hero' }))
    expect(useAppStore.getState().heroes['182'].priority).toBe(true)

    await user.click(screen.getByRole('button', { name: 'Increase Signature Item' }))
    expect(useAppStore.getState().heroes['182'].signatureItem).toBe(10)

    await user.click(screen.getByRole('button', { name: 'Increase Ascension' }))
    expect(useAppStore.getState().heroes['182'].ascension).toBe('elite+')

    await user.click(screen.getByRole('button', { name: 'Weapon · Empty' }))
    await user.click(screen.getByRole('button', { name: 'Mythic' }))
    expect(useAppStore.getState().heroes['182'].gear.weapon?.tier).toBe('mythic')
  })

  it('adds a hero from the catalog picker and switches to edit mode', async () => {
    const user = userEvent.setup()
    useAppStore.getState().addHero(createDefaultHeroProgress('182'))

    render(<HeroDetailScreen heroId={null} onClose={vi.fn()} />)

    expect(screen.getByRole('button', { name: /Adrian & Elyse/ })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: /Alaro/ }))
    expect(screen.getByText('Alaro')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(useAppStore.getState().heroes['131']).toBeDefined()
    expect(screen.getByText('Progress saved')).toBeInTheDocument()
  })
})
