import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Info, Trash2, Upload } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Field, Input } from '@/components/ui/Input'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { PageHeader } from '@/components/ui/PageHeader'
import { parseImport, serializeExport } from '@/features/persistence/importExport'
import { downloadTextFile } from '@/lib/download'
import { useAppStore } from '@/store/useAppStore'

type Feedback = { tone: 'success' | 'error'; message: string }

export function SettingsPage() {
  const { t } = useTranslation()
  const profile = useAppStore((state) => state.profile)
  const setProfile = useAppStore((state) => state.setProfile)
  const importData = useAppStore((state) => state.importData)
  const reset = useAppStore((state) => state.reset)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [resetOpen, setResetOpen] = useState(false)

  function handleExport() {
    downloadTextFile(
      `resonating-hall-${new Date().toISOString().slice(0, 10)}.json`,
      serializeExport(useAppStore.getState()),
    )
    setFeedback({ tone: 'success', message: t('settings.exportSuccess') })
  }

  async function handleImport(file: File) {
    try {
      const text = await file.text()
      const data = parseImport(text)
      importData(data)
      setFeedback({ tone: 'success', message: t('settings.importSuccess') })
    } catch {
      setFeedback({ tone: 'error', message: t('errors.invalidImport') })
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t('app.game')}
        title={t('settings.title')}
        subtitle={t('settings.subtitle')}
        actions={<Badge variant="cyan">{t('common.phaseTwo')}</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="codex-panel p-6">
          <h2 className="font-display text-2xl text-parch">{t('settings.profile')}</h2>
          <div className="mt-5 space-y-4">
            <Field label={t('settings.playerName')}>
              <Input
                type="text"
                value={profile.playerName ?? ''}
                onChange={(event) => setProfile({ playerName: event.target.value })}
                placeholder="—"
              />
            </Field>
            <Field label={t('settings.server')}>
              <Input
                type="text"
                value={profile.server ?? ''}
                onChange={(event) => setProfile({ server: event.target.value })}
                placeholder="—"
              />
            </Field>
            <Field label={t('settings.crystalLevel')}>
              <Input
                type="number"
                min={0}
                max={1000}
                value={profile.crystalLevel}
                onChange={(event) =>
                  setProfile({ crystalLevel: Math.max(0, Number(event.target.value) || 0) })
                }
                className="font-mono"
              />
            </Field>
          </div>
        </section>

        <section className="codex-panel p-6">
          <h2 className="font-display text-2xl text-parch">{t('settings.language')}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t('app.subtitle')}</p>
          <div className="mt-5">
            <LanguageToggle />
          </div>
        </section>

        <section className="codex-panel p-6">
          <h2 className="font-display text-2xl text-parch">{t('settings.data')}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t('settings.dataHint')}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleExport}>
              <Download size={16} aria-hidden="true" />
              {t('settings.exportBackup')}
            </Button>
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
              <Upload size={16} aria-hidden="true" />
              {t('settings.importBackup')}
            </Button>
            <Button variant="danger" onClick={() => setResetOpen(true)}>
              <Trash2 size={16} aria-hidden="true" />
              {t('settings.reset')}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) void handleImport(file)
                event.target.value = ''
              }}
            />
          </div>
          {feedback ? (
            <p
              role="status"
              className={
                feedback.tone === 'success' ? 'mt-4 text-sm text-arcane' : 'mt-4 text-sm text-ember'
              }
            >
              {feedback.message}
            </p>
          ) : null}
          <p className="mt-4 text-xs leading-relaxed text-muted">{t('settings.resetConfirm')}</p>
        </section>

        <section className="codex-panel p-6">
          <div className="flex items-center gap-2">
            <Info size={17} className="text-arcane" aria-hidden="true" />
            <h2 className="font-display text-2xl text-parch">{t('settings.about')}</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t('settings.disclaimer')}</p>
          <p className="mt-4 font-mono text-xs text-muted">{t('settings.schemaVersion')}: 1</p>
        </section>
      </div>

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title={t('settings.reset')}
        body={t('settings.resetConfirm')}
        confirmLabel={t('settings.reset')}
        onConfirm={() => {
          reset()
          setFeedback(null)
        }}
      />
    </div>
  )
}
