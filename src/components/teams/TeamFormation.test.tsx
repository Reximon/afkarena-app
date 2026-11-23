import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import '@/i18n'
import { createDefaultHeroProgress, createTeamSlots } from '@/features/persistence/defaults'
import { TeamFormation } from './TeamFormation'

describe('TeamFormation', () => {
  it('opens the editor when an empty slot is clicked', async () => {
    const user = userEvent.setup()
    const onSlotClick = vi.fn()

    render(<TeamFormation slots={createTeamSlots()} heroes={{}} onSlotClick={onSlotClick} />)

    await user.click(screen.getByRole('button', { name: 'Add hero to slot 1' }))

    expect(onSlotClick).toHaveBeenCalledWith(expect.objectContaining({ position: 1 }))
  })

  it('does not turn filled slots into buttons', () => {
    const slots = createTeamSlots().map((slot) =>
      slot.position === 1 ? { ...slot, heroId: '182' } : slot,
    )

    render(
      <TeamFormation
        slots={slots}
        heroes={{ '182': createDefaultHeroProgress('182') }}
        onSlotClick={vi.fn()}
      />,
    )

    expect(screen.getByText('Adrian & Elyse')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Add hero to slot 1' })).not.toBeInTheDocument()
  })
})
