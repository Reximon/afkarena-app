import { lazy } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'

const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((module) => ({ default: module.DashboardPage })),
)
const RosterPage = lazy(() =>
  import('@/pages/RosterPage').then((module) => ({ default: module.RosterPage })),
)
const TierListPage = lazy(() =>
  import('@/pages/TierListPage').then((module) => ({ default: module.TierListPage })),
)
const TeamsPage = lazy(() =>
  import('@/pages/TeamsPage').then((module) => ({ default: module.TeamsPage })),
)
const PetsPage = lazy(() =>
  import('@/pages/PetsPage').then((module) => ({ default: module.PetsPage })),
)
const ElderTreePage = lazy(() =>
  import('@/pages/ElderTreePage').then((module) => ({ default: module.ElderTreePage })),
)
const EquipmentPage = lazy(() =>
  import('@/pages/EquipmentPage').then((module) => ({ default: module.EquipmentPage })),
)
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((module) => ({ default: module.SettingsPage })),
)

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="roster" element={<RosterPage />} />
          <Route path="tier-list" element={<TierListPage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="pets" element={<PetsPage />} />
          <Route path="beasts" element={<Navigate to="/pets" replace />} />
          <Route path="elder-tree" element={<ElderTreePage />} />
          <Route path="equipment" element={<EquipmentPage />} />
          <Route path="artifacts" element={<Navigate to="/equipment" replace />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
