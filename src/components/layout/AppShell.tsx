import { Suspense, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Gem, LayoutDashboard, Menu, Settings, Sparkles, Swords, Users, X } from 'lucide-react'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { cn } from '@/lib/cn'

const navItems = [
  { to: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard, end: true },
  { to: '/roster', labelKey: 'nav.roster', icon: Users, end: false },
  { to: '/teams', labelKey: 'nav.teams', icon: Swords, end: false },
  { to: '/settings', labelKey: 'nav.settings', icon: Settings, end: false },
] as const

type PageTitleKey = 'nav.dashboard' | 'nav.roster' | 'nav.teams' | 'nav.settings'

const pageTitleKeys: Record<string, PageTitleKey> = {
  '/': 'nav.dashboard',
  '/roster': 'nav.roster',
  '/teams': 'nav.teams',
  '/settings': 'nav.settings',
}

export function AppShell() {
  const { t } = useTranslation()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const pageTitleKey: PageTitleKey = pageTitleKeys[location.pathname] ?? 'nav.dashboard'

  useEffect(() => {
    document.title = `${t(pageTitleKey)} · ${t('app.name')}`
  }, [pageTitleKey, t])

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[264px_1fr]">
      {mobileOpen ? (
        <button
          type="button"
          aria-label={t('common.close')}
          className="fixed inset-0 z-40 bg-void/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        id="app-sidebar"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-line bg-ink/95 transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 lg:bg-ink/55',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-line px-5">
          <span className="grid size-9 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
            <Gem size={18} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-lg leading-none text-bone">{t('app.name')}</p>
            <p className="mt-1 truncate font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
              {t('app.game')}
            </p>
          </div>
          <button
            type="button"
            className="ml-auto rounded-lg p-2 text-muted hover:bg-violet hover:text-bone lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label={t('common.close')}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label={t('app.name')}>
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                    isActive
                      ? 'border border-gold/20 bg-gold/10 text-gold'
                      : 'border border-transparent text-muted hover:bg-violet/60 hover:text-bone',
                  )
                }
              >
                <Icon size={17} strokeWidth={1.7} aria-hidden="true" />
                <span className="font-medium">{t(item.labelKey)}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-line p-4">
          <div className="codex-panel-soft p-3">
            <div className="flex items-center gap-2 text-cyan">
              <Sparkles size={14} aria-hidden="true" />
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase">
                {t('common.phaseOne')}
              </p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">{t('app.subtitle')}</p>
          </div>
          <p className="mt-3 font-mono text-[9px] tracking-[0.14em] text-muted/70 uppercase">
            v0.1.0 · Phase 1
          </p>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-line bg-void/75 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="rounded-lg p-2 text-muted hover:bg-violet hover:text-bone lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label={t('common.openMenu')}
              aria-expanded={mobileOpen}
              aria-controls="app-sidebar"
            >
              <Menu size={20} aria-hidden="true" />
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-[9px] tracking-[0.2em] text-muted uppercase">
                {t('app.game')}
              </p>
              <p className="truncate text-sm font-semibold text-bone">{t(pageTitleKey)}</p>
            </div>

            <LanguageToggle />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <Suspense
            fallback={
              <p className="py-12 text-center text-sm text-muted" aria-live="polite">
                {t('common.loading')}
              </p>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
