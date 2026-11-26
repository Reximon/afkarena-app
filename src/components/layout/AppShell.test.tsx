import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import '@/i18n'
import { AppShell } from './AppShell'

function renderShell(path = '/teams') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<p>dashboard page</p>} />
          <Route path="roster" element={<p>roster page</p>} />
          <Route path="teams" element={<p>teams page</p>} />
          <Route path="pets" element={<p>pets page</p>} />
          <Route path="equipment" element={<p>equipment page</p>} />
          <Route path="settings" element={<p>settings page</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('AppShell', () => {
  it('lists every destination in the mobile menu', async () => {
    const user = userEvent.setup()
    renderShell('/teams')

    await user.click(screen.getByRole('button', { name: 'Menu' }))

    const drawer = screen.getByRole('dialog')

    for (const name of [
      'Dashboard',
      'Roster',
      'Tier list',
      'Teams',
      'Pets',
      'Equipment',
      'Settings',
    ]) {
      expect(within(drawer).getByRole('link', { name })).toBeInTheDocument()
    }
  })

  it('navigates from the mobile menu and closes it', async () => {
    const user = userEvent.setup()
    renderShell('/teams')

    expect(screen.getByText('teams page')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Menu' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('link', { name: 'Roster' }))

    expect(screen.getByText('roster page')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
