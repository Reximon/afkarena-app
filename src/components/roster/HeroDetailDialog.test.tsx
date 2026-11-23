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
})
