import { Suspense, useEffect, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useTranslation } from 'react-i18next'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Gem, LayoutDashboard, Menu, PawPrint, Settings, Swords, Users, X } from 'lucide-react'
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
  const [mobileNavPath, setMobileNavPath] = useState<string | null>(null)
  const mobileNavOpen = mobileNavPath === location.pathname
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

          <span className="min-w-0 flex-1 truncate font-display text-base text-parch sm:hidden">
            {t(pageTitleKey)}
          </span>

          <nav
            className="-mx-1 hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:flex"
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

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <LanguageToggle />

            <DialogPrimitive.Root
              open={mobileNavOpen}
              onOpenChange={(open) => setMobileNavPath(open ? location.pathname : null)}
            >
              <DialogPrimitive.Trigger asChild>
                <button
                  type="button"
                  aria-label={t('nav.menu')}
                  className="icon-action grid size-9 place-items-center rounded-lg border border-line bg-night/40 text-muted hover:border-gild/40 hover:text-parch xl:hidden"
                >
                  <Menu size={18} strokeWidth={1.7} aria-hidden="true" />
                </button>
              </DialogPrimitive.Trigger>

              <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="dialog-overlay fixed inset-0 z-50 bg-night/70 backdrop-blur-sm" />
                <DialogPrimitive.Content className="nav-drawer fixed inset-y-0 right-0 z-50 flex w-[min(19rem,86vw)] flex-col border-l border-line bg-night px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[-18px_0_60px_rgba(0,0,0,0.55)] outline-none">
                  <div className="flex items-center justify-between gap-3">
                    <DialogPrimitive.Title className="truncate font-display text-lg tracking-wide text-parch">
                      {t('app.name')}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Close className="icon-action grid size-8 shrink-0 place-items-center rounded-full border border-line bg-panel/60 text-muted hover:border-gild/40 hover:text-parch">
                      <X size={15} aria-hidden="true" />
                      <span className="sr-only">{t('common.close')}</span>
                    </DialogPrimitive.Close>
                  </div>
                  <DialogPrimitive.Description className="mt-1 font-mono text-[9px] tracking-[0.18em] text-muted uppercase">
                    {t('app.game')}
                  </DialogPrimitive.Description>

                  <nav aria-label={t('nav.menu')} className="mt-5 flex flex-col gap-1">
                    {navItems.map((item) => {
                      const Icon = item.icon

                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          end={item.end}
                          onClick={() => setMobileNavPath(null)}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors',
                              isActive
                                ? 'border-gild/40 bg-gild/10 text-gild'
                                : 'border-transparent text-muted hover:border-line hover:bg-panel/60 hover:text-parch',
                            )
                          }
                        >
                          <Icon size={17} strokeWidth={1.7} aria-hidden="true" />
                          <span className="font-medium">{t(item.labelKey)}</span>
                        </NavLink>
                      )
                    })}
                  </nav>
                </DialogPrimitive.Content>
              </DialogPrimitive.Portal>
            </DialogPrimitive.Root>
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
          {t('app.name')} · v1.3.0 · {t('app.game')}
        </p>
      </footer>
    </div>
  )
}
