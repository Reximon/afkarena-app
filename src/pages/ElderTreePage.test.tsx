import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import '@/i18n'
import { ElderTreePage } from './ElderTreePage'

function cardLevel(name: string) {
  return within(screen.getByRole('button', { name: new RegExp(name) })).getByText(
    (_, element) => element?.classList.contains('stat-value') ?? false,
  )
}

describe('ElderTreePage', () => {
  it('shows every branch level at a glance in the all view', async () => {
    const user = userEvent.setup()
    render(<ElderTreePage />)

    expect(screen.getByRole('heading', { name: 'The Elder Tree' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'All branches' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'true')

    expect(cardLevel("Ranger · Dura's Celerity")).toHaveTextContent(/Lv 5\s*\/\s*180/)
    expect(cardLevel("Tank · Dura's Fortitude")).toHaveTextContent(/Lv 5\s*\/\s*165/)

    await user.click(screen.getByRole('button', { name: /Support · Dura's Sustenance/ }))

    expect(screen.getByRole('heading', { name: "Dura's Sustenance" })).toBeInTheDocument()
  })

  it('shows the base blessing values and updates them with the level', async () => {
    const user = userEvent.setup()
    render(<ElderTreePage />)

    await user.click(screen.getByRole('tab', { name: "Ranger · Dura's Celerity" }))

    expect(screen.getByRole('heading', { name: "Dura's Celerity" })).toBeInTheDocument()
    expect(screen.getByText(/Dodge will be increased by 80 points/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Set level 60' }))

    expect(screen.getAllByText('Haste increased by 15 points.').length).toBeGreaterThan(0)
    expect(screen.getByText('Next at Lv 75')).toBeInTheDocument()
  })

  it('keeps a separate level per branch', async () => {
    const user = userEvent.setup()
    render(<ElderTreePage />)

    await user.click(screen.getByRole('tab', { name: "Ranger · Dura's Celerity" }))
    await user.click(screen.getByRole('button', { name: 'Set level 60' }))
    await user.click(screen.getByRole('tab', { name: 'All' }))

    expect(cardLevel("Ranger · Dura's Celerity")).toHaveTextContent(/Lv 60\s*\/\s*180/)
    expect(cardLevel("Tank · Dura's Fortitude")).toHaveTextContent(/Lv 5\s*\/\s*165/)
  })

  it('switches the virtue branch from the class tabs', async () => {
    const user = userEvent.setup()
    render(<ElderTreePage />)

    await user.click(screen.getByRole('tab', { name: "Tank · Dura's Fortitude" }))

    expect(screen.getByRole('heading', { name: "Dura's Fortitude" })).toBeInTheDocument()
    expect(screen.getByText(/unleash a small shockwave/)).toBeInTheDocument()
  })
})
