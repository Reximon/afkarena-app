import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import '@/i18n'
import { Stars } from './Stars'

describe('Stars', () => {
  it('selects a star value on click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Stars total={5} value={2} onChange={onChange} label="Stars" />)

    await user.click(screen.getByRole('radio', { name: 'Star 4' }))

    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('clears the last filled star when clicked again', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Stars total={5} value={2} onChange={onChange} label="Stars" />)

    await user.click(screen.getByRole('radio', { name: 'Star 2' }))

    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('renders read-only stars without buttons', () => {
    render(<Stars total={5} value={3} label="Stars" />)

    expect(screen.queryAllByRole('radio')).toHaveLength(0)
    expect(screen.getByLabelText('Stars')).toBeInTheDocument()
  })
})
