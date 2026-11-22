import { lazy } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'

const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((module) => ({ default: module.DashboardPage })),
)
const RosterPage = lazy(() =>
  import('@/pages/RosterPage').then((module) => ({ default: module.RosterPage })),
)
const TeamsPage = lazy(() =>
  import('@/pages/TeamsPage').then((module) => ({ default: module.TeamsPage })),
)
const ArtifactsPage = lazy(() =>
  import('@/pages/ArtifactsPage').then((module) => ({ default: module.ArtifactsPage })),
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
          <Route path="teams" element={<TeamsPage />} />
          <Route path="artifacts" element={<ArtifactsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
