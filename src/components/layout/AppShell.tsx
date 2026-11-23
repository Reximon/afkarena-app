import { Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Gem, LayoutDashboard, PawPrint, Settings, Swords, Users } from 'lucide-react'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { cn } from '@/lib/cn'

const navItems = [
  { to: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard, end: true },
  { to: '/roster', labelKey: 'nav.roster', icon: Users, end: false },
  { to: '/teams', labelKey: 'nav.teams', icon: Swords, end: false },
  { to: '/pets', labelKey: 'nav.pets', icon: PawPrint, end: false },
  { to: '/equipment', labelKey: 'nav.equipment', icon: Gem, end: false },
  { to: '/settings', labelKey: 'nav.settings', icon: Settings, end: false },
] as const

type PageTitleKey =
  'nav.dashboard' | 'nav.roster' | 'nav.teams' | 'nav.pets' | 'nav.equipment' | 'nav.settings'

const pageTitleKeys: Record<string, PageTitleKey> = {
  '/': 'nav.dashboard',
  '/roster': 'nav.roster',
  '/teams': 'nav.teams',
  '/pets': 'nav.pets',
  '/equipment': 'nav.equipment',
  '/settings': 'nav.settings',
}

export function AppShell() {
  const { t } = useTranslation()
  const location = useLocation()
  const pageTitleKey: PageTitleKey = pageTitleKeys[location.pathname] ?? 'nav.dashboard'

  useEffect(() => {
    document.title = `${t(pageTitleKey)} · ${t('app.name')}`
  }, [pageTitleKey, t])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-night/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex shrink-0 items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg border border-gild/40 bg-gild/10 text-gild shadow-[0_0_18px_rgba(224,185,94,0.18)]">
              <Gem size={18} strokeWidth={1.6} aria-hidden="true" />
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate font-display text-base leading-tight tracking-wide text-parch">
                {t('app.name')}
              </span>
              <span className="block truncate font-mono text-[9px] tracking-[0.18em] text-muted uppercase">
                {t('app.game')}
              </span>
            </span>
          </NavLink>

          <nav
            className="-mx-1 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label={t('app.name')}
          >
            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'nav-link group flex h-16 shrink-0 items-center gap-2 px-3 text-sm transition-colors',
                      isActive
                        ? 'text-gild [text-shadow:0_0_14px_rgba(224,185,94,0.45)]'
                        : 'text-muted hover:text-parch',
                    )
                  }
                >
                  <Icon size={16} strokeWidth={1.7} aria-hidden="true" />
                  <span className="font-medium whitespace-nowrap">{t(item.labelKey)}</span>
                </NavLink>
              )
            })}
          </nav>

          <div className="shrink-0">
            <LanguageToggle />
          </div>
        </div>
        <div className="gild-rule" aria-hidden="true" />
      </header>

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
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

      <footer className="border-t border-line py-4">
        <p className="text-center font-mono text-[9px] tracking-[0.16em] text-muted/70 uppercase">
          {t('app.name')} · v1.2.0 · {t('app.game')}
        </p>
      </footer>
    </div>
  )
}
