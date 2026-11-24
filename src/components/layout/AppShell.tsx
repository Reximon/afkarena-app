import { Suspense, useEffect, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useTranslation } from 'react-i18next'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { cn } from '@/lib/cn'

const navItems = [
  { to: '/', labelKey: 'nav.dashboard', end: true },
  { to: '/roster', labelKey: 'nav.roster', end: false },
  { to: '/teams', labelKey: 'nav.teams', end: false },
  { to: '/pets', labelKey: 'nav.pets', end: false },
  { to: '/equipment', labelKey: 'nav.equipment', end: false },
  { to: '/settings', labelKey: 'nav.settings', end: false },
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
      <header className="game-header sticky top-0 z-40 shadow-[0_14px_32px_rgba(4,2,1,0.55)]">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-stretch gap-3 px-4 sm:px-6 lg:px-8">
          <NavLink to="/" aria-label={t('app.name')} className="flex shrink-0 items-center gap-3">
            <span className="brand-seal" aria-hidden="true">
              RH
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate font-display text-[15px] leading-tight font-semibold tracking-[0.01em] text-parch">
                {t('app.name')}
              </span>
              <span className="mt-0.5 block truncate font-mono text-[8px] tracking-[0.24em] text-muted uppercase">
                {t('app.game')}
              </span>
            </span>
          </NavLink>

          <span className="flex min-w-0 flex-1 items-center truncate font-display text-[11px] font-semibold tracking-[0.18em] text-parch uppercase sm:hidden">
            {t(pageTitleKey)}
          </span>

          <nav className="ml-auto hidden items-stretch xl:flex" aria-label={t('app.name')}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className="nav-plate focus-visible:z-10"
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-3 xl:ml-0">
            <span className="hidden h-5 w-px bg-gild/15 xl:block" aria-hidden="true" />
            <LanguageToggle />

            <DialogPrimitive.Root
              open={mobileNavOpen}
              onOpenChange={(open) => setMobileNavPath(open ? location.pathname : null)}
            >
              <DialogPrimitive.Trigger asChild>
                <button
                  type="button"
                  aria-label={t('nav.menu')}
                  className="icon-action grid size-9 place-items-center rounded-[5px] border border-gild/25 text-muted hover:border-gild/50 hover:bg-gild/5 hover:text-parch xl:hidden"
                >
                  <Menu size={18} strokeWidth={1.7} aria-hidden="true" />
                </button>
              </DialogPrimitive.Trigger>

              <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="dialog-overlay fixed inset-0 z-50 bg-night/70 backdrop-blur-sm" />
                <DialogPrimitive.Content className="nav-drawer game-header fixed inset-y-0 right-0 z-50 flex w-[min(19rem,86vw)] flex-col border-l border-gild/25 px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[-18px_0_60px_rgba(5,2,1,0.65)] outline-none">
                  <div className="flex items-center justify-between gap-3">
                    <DialogPrimitive.Title className="min-w-0 truncate font-display text-[15px] font-semibold tracking-[0.01em] text-parch">
                      {t('app.name')}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Close className="icon-action grid size-8 shrink-0 place-items-center rounded-[4px] border border-line text-muted hover:border-gild/40 hover:text-parch">
                      <X size={15} aria-hidden="true" />
                      <span className="sr-only">{t('common.close')}</span>
                    </DialogPrimitive.Close>
                  </div>
                  <DialogPrimitive.Description className="mt-1 font-mono text-[8px] tracking-[0.24em] text-muted uppercase">
                    {t('app.game')}
                  </DialogPrimitive.Description>

                  <nav
                    aria-label={t('nav.menu')}
                    className="mt-7 flex flex-col border-t border-gild/15"
                  >
                    {navItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() => setMobileNavPath(null)}
                        className={({ isActive }) =>
                          cn(
                            'nav-row flex items-center justify-between gap-3 border-b border-gild/10 px-2 py-3.5 text-[11px] transition-colors',
                            isActive ? 'text-gild-bright' : 'text-muted hover:text-parch',
                          )
                        }
                      >
                        <span>{t(item.labelKey)}</span>
                        <span className="nav-mark" aria-hidden="true" />
                      </NavLink>
                    ))}
                  </nav>
                </DialogPrimitive.Content>
              </DialogPrimitive.Portal>
            </DialogPrimitive.Root>
          </div>
        </div>
        <div className="header-rule" aria-hidden="true" />
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

      <div className="gild-rule mt-4" aria-hidden="true" />
      <footer className="py-5">
        <p className="text-center font-mono text-[9px] tracking-[0.16em] text-muted/70 uppercase">
          {t('app.name')} · v1.3.0 · {t('app.game')}
        </p>
      </footer>
    </div>
  )
}
