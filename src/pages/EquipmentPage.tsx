import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { ArtifactsTab } from '@/components/equipment/ArtifactsTab'
import { CollectionsTab } from '@/components/equipment/CollectionsTab'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/ui/PageHeader'
import { artifacts } from '@/features/artifacts/artifacts'
import { collections } from '@/features/collections/collections'
import { cn } from '@/lib/cn'

type EquipmentTab = 'artifacts' | 'collections'

export function EquipmentPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab: EquipmentTab =
    searchParams.get('tab') === 'collections' ? 'collections' : 'artifacts'

  function setTab(tab: EquipmentTab) {
    setSearchParams(tab === 'artifacts' ? {} : { tab }, { replace: true })
  }

  const tabs: Array<{ id: EquipmentTab; label: string; count: number }> = [
    { id: 'artifacts', label: t('equipment.tabs.artifacts'), count: artifacts.length },
    { id: 'collections', label: t('equipment.tabs.collections'), count: collections.length },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t('app.game')}
        title={t('equipment.title')}
        subtitle={t('equipment.subtitle')}
        actions={
          <>
            <Badge variant="gold">
              {t('equipment.artifactCount', { count: artifacts.length })}
            </Badge>
            <Badge variant="cyan">
              {t('equipment.collectionCount', { count: collections.length })}
            </Badge>
          </>
        }
      />

      <div
        role="tablist"
        aria-label={t('equipment.title')}
        className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-2xl border border-line bg-void/30 p-1"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(tab.id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition-colors',
                isActive
                  ? 'border-gold/20 bg-gold/10 text-gold'
                  : 'border-transparent text-muted hover:bg-violet/60 hover:text-bone',
              )}
            >
              <span className="font-medium">{tab.label}</span>
              <Badge variant={isActive ? 'gold' : 'muted'}>{tab.count}</Badge>
            </button>
          )
        })}
      </div>

      <div role="tabpanel">{activeTab === 'artifacts' ? <ArtifactsTab /> : <CollectionsTab />}</div>
    </div>
  )
}
