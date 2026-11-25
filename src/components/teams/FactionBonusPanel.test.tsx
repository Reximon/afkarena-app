import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import '@/i18n'
import { FactionBonusPanel } from './FactionBonusPanel'

describe('FactionBonusPanel', () => {
  it('shows the faction counts and the 3+2 stat bonus', () => {
    render(<FactionBonusPanel heroIds={['182', '220', '3', '7', '126']} />)

    expect(screen.getByRole('img', { name: 'Lightbearer' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Wilder' })).toBeInTheDocument()
    expect(screen.getByText('×3')).toBeInTheDocument()
    expect(screen.getByText('×2')).toBeInTheDocument()
    expect(screen.getByText('3+2 · ATK +15% · HP +15%')).toBeInTheDocument()
  })

  it('lists only the active Hypogean ladder bonuses', () => {
    render(<FactionBonusPanel heroIds={['214', '178', '182']} />)

    expect(screen.getAllByRole('img', { name: 'Hypogean' })).toHaveLength(2)
    expect(screen.getByText('+30% DEF')).toBeInTheDocument()
    expect(screen.getByText('+25% energy recovery when injured')).toBeInTheDocument()
    expect(screen.queryByText('+15% critical rating')).not.toBeInTheDocument()
    expect(screen.getByText('No faction bonus')).toBeInTheDocument()
  })

  it('shows the celestial emblem in the wildcard hint', () => {
    render(<FactionBonusPanel heroIds={['182', '102']} />)

    expect(screen.getAllByRole('img', { name: 'Celestial' })).toHaveLength(2)
    expect(screen.getByText('Count as any faction.')).toBeInTheDocument()
  })

  it('renders nothing when the formation is empty', () => {
    const { container } = render(<FactionBonusPanel heroIds={[undefined, undefined]} />)

    expect(container).toBeEmptyDOMElement()
  })
})
