import { useTranslation } from 'react-i18next'
import {
  EquipmentIconPicker,
  type EquipmentIconGroup,
} from '@/components/equipment/EquipmentIconPicker'
import { Gem } from 'lucide-react'
import { getEligibleArtifacts } from '@/features/artifacts/artifacts'
import { HERO_CLASSES, type HeroClass } from '@/types'
import { PickerDrawer } from './PickerDrawer'

interface ArtifactDrawerProps {
  artifactId?: string
  heroName: string
  heroClass?: HeroClass
  onChange: (artifactId: string) => void
  onClose: () => void
}

export function ArtifactDrawer({
  artifactId,
  heroName,
  heroClass,
  onChange,
  onClose,
}: ArtifactDrawerProps) {
  const { t } = useTranslation()
  const eligible = getEligibleArtifacts(heroClass)

  const groups: EquipmentIconGroup[] = [
    {
      label: t('artifacts.duraGroup'),
      items: eligible
        .filter((artifact) => artifact.kind === 'dura')
        .map((artifact) => ({ id: artifact.id, name: artifact.name, image: artifact.image })),
    },
    ...HERO_CLASSES.map((heroClassGroup) => ({
      label: t(`heroClass.${heroClassGroup}`),
      items: eligible
        .filter((artifact) => artifact.kind === 'class' && artifact.class === heroClassGroup)
        .map((artifact) => ({ id: artifact.id, name: artifact.name, image: artifact.image })),
    })).filter((group) => group.items.length > 0),
  ]

  return (
    <PickerDrawer kicker={heroName} title={t('hero.artifact')} onClose={onClose}>
      <div className="mt-3">
        <EquipmentIconPicker
          value={artifactId}
          onChange={onChange}
          noneLabel={t('common.none')}
          groups={groups}
          icon={Gem}
        />
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-muted">{t('heroDialog.artifactHint')}</p>
    </PickerDrawer>
  )
}
