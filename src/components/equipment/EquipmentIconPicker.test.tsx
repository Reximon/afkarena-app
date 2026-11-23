import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Gem } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'
import { EquipmentIconPicker } from './EquipmentIconPicker'

const groups = [
  {
    label: 'Artifacts',
    items: [
      { id: 'grace', name: "Dura's Grace", image: '/images/grace.webp' },
      { id: 'call', name: "Dura's Call", image: '/images/call.webp' },
    ],
  },
  {
    label: 'Class artifacts',
    items: [{ id: 'locked', name: 'Locked artifact', disabled: true }],
  },
]

describe('EquipmentIconPicker', () => {
  it('selects an equipment by its icon', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <EquipmentIconPicker
        value="grace"
        onChange={onChange}
        noneLabel="None"
        groups={groups}
        icon={Gem}
      />,
    )

    await user.click(screen.getByRole('button', { name: "Dura's Call" }))

    expect(onChange).toHaveBeenCalledWith('call')
  })

  it('clears the selection with the none option', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <EquipmentIconPicker
        value="grace"
        onChange={onChange}
        noneLabel="None"
        groups={groups}
        icon={Gem}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'None' }))

    expect(onChange).toHaveBeenCalledWith('')
  })

  it('does not select disabled equipment', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<EquipmentIconPicker onChange={onChange} noneLabel="None" groups={groups} icon={Gem} />)

    await user.click(screen.getByRole('button', { name: 'Locked artifact' }))

    expect(onChange).not.toHaveBeenCalled()
  })
})
