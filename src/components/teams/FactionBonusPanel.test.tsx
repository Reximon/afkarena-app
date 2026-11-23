import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import '@/i18n'
import { FactionBonusPanel } from './FactionBonusPanel'

describe('FactionBonusPanel', () => {
  it('shows the faction counts and the 3+2 stat bonus', () => {
    render(<FactionBonusPanel heroIds={['182', '220', '3', '7', '126']} />)

    expect(screen.getByText('Lightbearer')).toBeInTheDocument()
    expect(screen.getByText('Wilder')).toBeInTheDocument()
    expect(screen.getByText('×3')).toBeInTheDocument()
    expect(screen.getByText('×2')).toBeInTheDocument()
    expect(screen.getByText('Faction bonus 3+2')).toBeInTheDocument()
    expect(screen.getByText('ATK +15% · HP +15%')).toBeInTheDocument()
  })

  it('lists only the active Hypogean ladder bonuses', () => {
    render(<FactionBonusPanel heroIds={['214', '178', '182']} />)

    expect(screen.getByText('Hypogean ×2')).toBeInTheDocument()
    expect(screen.getByText('+30% DEF')).toBeInTheDocument()
    expect(screen.getByText('+25% energy recovery when injured')).toBeInTheDocument()
    expect(screen.queryByText('+15% critical rating')).not.toBeInTheDocument()
    expect(screen.getByText('No faction bonus')).toBeInTheDocument()
  })

  it('renders nothing when the formation is empty', () => {
    const { container } = render(<FactionBonusPanel heroIds={[undefined, undefined]} />)

    expect(container).toBeEmptyDOMElement()
  })
})
