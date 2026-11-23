import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import '@/i18n'
import { createDefaultHeroProgress, createEmptyAppData } from '@/features/persistence/defaults'
import { useAppStore } from '@/store/useAppStore'
import { HeroDetailDialog } from './HeroDetailDialog'

beforeEach(() => {
  localStorage.clear()
  useAppStore.setState(createEmptyAppData())
})

describe('HeroDetailDialog', () => {
  it('shows the investment summary including furniture', () => {
    useAppStore.getState().addHero(
      createDefaultHeroProgress('182', {
        level: 240,
        signatureItem: 30,
        furniture: 9,
        engraving: 60,
      }),
    )

    render(<HeroDetailDialog heroId="182" onClose={vi.fn()} />)

    expect(screen.getByText('Level 240')).toBeInTheDocument()
    expect(screen.getByText('Signature Item 30')).toBeInTheDocument()
    expect(screen.getByText('Furniture 9')).toBeInTheDocument()
    expect(screen.getByText('Engraving 60')).toBeInTheDocument()
  })

  it('edits furniture from the view panel', async () => {
    const user = userEvent.setup()
    useAppStore.getState().addHero(createDefaultHeroProgress('182', { furniture: 9 }))

    render(<HeroDetailDialog heroId="182" onClose={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Edit Furniture' }))
    await user.click(screen.getByRole('button', { name: 'F3' }))

    expect(useAppStore.getState().heroes['182'].furniture).toBe(3)
    expect(screen.getByText('Furniture 3')).toBeInTheDocument()
  })

  it('shows the linked hero for Dimensionals', () => {
    useAppStore.getState().addHero(createDefaultHeroProgress('98', { linkedHeroId: '182' }))

    render(<HeroDetailDialog heroId="98" onClose={vi.fn()} />)

    expect(screen.getByText('Linked to Adrian & Elyse')).toBeInTheDocument()
  })

  it('links an owned hero from the view panel', async () => {
    const user = userEvent.setup()
    useAppStore.getState().addHero(createDefaultHeroProgress('98'))
    useAppStore.getState().addHero(createDefaultHeroProgress('182'))

    render(<HeroDetailDialog heroId="98" onClose={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Edit Linked hero' }))
    await user.click(screen.getByRole('button', { name: 'Adrian & Elyse' }))

    expect(useAppStore.getState().heroes['98'].linkedHeroId).toBe('182')
    expect(screen.getByText('Linked to Adrian & Elyse')).toBeInTheDocument()
  })

  it('locks ascension while a Dimensional is linked', () => {
    useAppStore.getState().addHero(createDefaultHeroProgress('182', { ascension: 'ascended' }))
    useAppStore.getState().addHero(createDefaultHeroProgress('98', { linkedHeroId: '182' }))

    render(<HeroDetailDialog heroId="98" onClose={vi.fn()} />)

    expect(screen.getByRole('button', { name: /^Ascension/ })).toBeDisabled()
    expect(screen.getByText('Ascension follows the linked hero.')).toBeInTheDocument()
  })

  it('keeps ascension editable while a Dimensional is unlinked', () => {
    useAppStore.getState().addHero(createDefaultHeroProgress('98'))

    render(<HeroDetailDialog heroId="98" onClose={vi.fn()} />)

    expect(screen.getByRole('button', { name: /^Ascension/ })).toBeEnabled()
  })

  it('offers only owned heroes when linking and can clear the link', async () => {
    const user = userEvent.setup()
    useAppStore.getState().addHero(createDefaultHeroProgress('98', { linkedHeroId: '182' }))
    useAppStore.getState().addHero(createDefaultHeroProgress('182'))

    render(<HeroDetailDialog heroId="98" onClose={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Edit Linked hero' }))

    expect(screen.getByRole('button', { name: 'Adrian & Elyse' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Alvida' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'None' }))

    expect(useAppStore.getState().heroes['98'].linkedHeroId).toBeUndefined()
    expect(screen.getByText('Link hero')).toBeInTheDocument()
  })
})
