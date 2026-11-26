import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Cloud, LogIn, LogOut, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { isSyncEnabled, signOut, syncNow, useSyncStore } from '@/sync'
import { LoginDialog } from './LoginDialog'
import { formatSyncTime, statusKey, syncErrorKey } from './syncMessages'

export function AccountPanel() {
  const { t, i18n } = useTranslation()
  const account = useSyncStore((state) => state.account)
  const status = useSyncStore((state) => state.status)
  const dirty = useSyncStore((state) => state.dirty)
  const lastSyncedAt = useSyncStore((state) => state.lastSyncedAt)
  const lastError = useSyncStore((state) => state.lastError)

  const [loginOpen, setLoginOpen] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)

  if (!isSyncEnabled()) return null

  const errorKey = syncErrorKey(lastError)
  const syncedTime = lastSyncedAt ? formatSyncTime(lastSyncedAt, i18n.language) : null

  return (
    <section className="codex-panel p-6">
      <div className="flex items-center gap-2">
        <Cloud size={17} className="text-arcane" aria-hidden="true" />
        <h2 className="panel-title text-2xl">{t('sync.title')}</h2>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">{t('sync.hint')}</p>

      {account ? (
        <div className="mt-5 space-y-4">
          <div>
            <p className="text-sm text-parch">{t('sync.signedInAs', { email: account.email })}</p>
            <p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
              {t(statusKey[status])}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              {syncedTime ? t('sync.lastSynced', { time: syncedTime }) : t('sync.neverSynced')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => syncNow()}
              disabled={status === 'syncing' || status === 'conflict'}
            >
              <RefreshCw size={16} aria-hidden="true" />
              {t('sync.syncNow')}
            </Button>
            <Button variant="ghost" onClick={() => (dirty ? setSignOutOpen(true) : signOut())}>
              <LogOut size={16} aria-hidden="true" />
              {t('sync.signOut')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button variant="secondary" onClick={() => setLoginOpen(true)}>
            <LogIn size={16} aria-hidden="true" />
            {t('sync.signIn')}
          </Button>
          <Badge variant="muted">{t(statusKey[status])}</Badge>
        </div>
      )}

      {errorKey ? (
        <p role="status" className="mt-4 text-sm text-ember">
          {t(errorKey)}
        </p>
      ) : null}

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <ConfirmDialog
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        title={t('sync.signOut')}
        body={t('sync.signOutPending')}
        confirmLabel={t('sync.signOut')}
        onConfirm={() => {
          signOut()
          setSignOutOpen(false)
        }}
      />
    </section>
  )
}
