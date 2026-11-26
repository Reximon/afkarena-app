import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Field, Input } from '@/components/ui/Input'
import { signIn, SyncRequestError, type SyncErrorKind } from '@/sync'
import { syncErrorKey } from './syncMessages'

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<SyncErrorKind | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return

    setPending(true)
    setError(null)

    try {
      await signIn(email.trim(), password)
      setPassword('')
      onOpenChange(false)
    } catch (caught) {
      setError(caught instanceof SyncRequestError ? caught.kind : 'unknown')
    } finally {
      setPending(false)
    }
  }

  const errorMessage =
    error === 'auth'
      ? t('sync.errorAuth')
      : error === 'network'
        ? t('sync.errorLogin')
        : error
          ? t(syncErrorKey(error) ?? 'sync.errorGeneric')
          : null

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('sync.signInTitle')}
      description={t('sync.signInBody')}
      className="max-w-md"
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            form="sync-login-form"
            disabled={pending || !email.trim() || !password}
          >
            {pending ? t('sync.signingIn') : t('sync.signIn')}
          </Button>
        </>
      }
    >
      <form
        id="sync-login-form"
        className="space-y-4"
        onSubmit={(event) => void handleSubmit(event)}
      >
        <Field label={t('sync.email')}>
          <Input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </Field>
        <Field label={t('sync.password')}>
          <Input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </Field>
        {errorMessage ? (
          <p role="alert" className="text-sm text-ember">
            {errorMessage}
          </p>
        ) : null}
      </form>
    </Dialog>
  )
}
