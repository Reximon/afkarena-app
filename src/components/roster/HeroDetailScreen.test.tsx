import { render, screen, within } from '@testing-library/react'
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

  it('uses the Resonating Crystal level for crystal heroes', async () => {
    const user = userEvent.setup()
    useAppStore.getState().setProfile({ crystalLevel: 350 })
    useAppStore.getState().addHero(createDefaultHeroProgress('182', { level: 200 }))

    render(<HeroDetailScreen heroId="182" onClose={vi.fn()} />)

    expect(screen.getByRole('spinbutton', { name: 'Level' })).toHaveValue(200)

    await user.click(screen.getByRole('button', { name: 'In crystal' }))

    expect(screen.getByRole('spinbutton', { name: 'Level' })).toHaveValue(350)
    expect(screen.getByRole('spinbutton', { name: 'Level' })).toBeDisabled()
    expect(
      screen.getByText('Level comes from the Resonating Crystal in Settings.'),
    ).toBeInTheDocument()
    expect(useAppStore.getState().heroes['182'].level).toBe(200)
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

  it('limits Dimensional linked heroes to the owned roster', async () => {
    const user = userEvent.setup()
    useAppStore.getState().addHero(createDefaultHeroProgress('98'))
    useAppStore.getState().addHero(createDefaultHeroProgress('182', { ascension: 'ascended' }))

    render(<HeroDetailScreen heroId="98" onClose={vi.fn()} />)

    const select = screen.getByRole('combobox', { name: /linked hero/i })
    expect(within(select).getByRole('option', { name: 'Adrian & Elyse' })).toBeInTheDocument()
    expect(within(select).queryByRole('option', { name: 'Alvida' })).not.toBeInTheDocument()

    await user.selectOptions(select, '182')
    expect(useAppStore.getState().heroes['98']).toMatchObject({
      linkedHeroId: '182',
      ascension: 'ascended',
    })
  })

  it('locks the ascension control while a Dimensional is linked', () => {
    useAppStore.getState().addHero(createDefaultHeroProgress('182', { ascension: 'ascended' }))
    useAppStore.getState().addHero(createDefaultHeroProgress('98', { linkedHeroId: '182' }))

    render(<HeroDetailScreen heroId="98" onClose={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Decrease Ascension' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Increase Ascension' })).toBeDisabled()
    expect(screen.queryByRole('radio', { name: 'Star 1' })).not.toBeInTheDocument()
    expect(screen.getByText('Ascension follows the linked hero.')).toBeInTheDocument()
  })

  it('mirrors the linked ascension while drafting a Dimensional', async () => {
    const user = userEvent.setup()
    useAppStore.getState().addHero(createDefaultHeroProgress('182', { ascension: 'ascended' }))

    render(<HeroDetailScreen heroId={null} onClose={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /Ainz Ooal Gown/ }))
    await user.selectOptions(screen.getByRole('combobox', { name: /linked hero/i }), '182')

    expect(screen.getByText('Ascended')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Increase Ascension' })).toBeDisabled()
  })

  it('keeps showing a stored linked hero that is no longer owned', () => {
    useAppStore.getState().addHero(createDefaultHeroProgress('98', { linkedHeroId: '220' }))

    render(<HeroDetailScreen heroId="98" onClose={vi.fn()} />)

    expect(screen.getByRole('combobox', { name: /linked hero/i })).toHaveDisplayValue('Alvida')
  })
})
