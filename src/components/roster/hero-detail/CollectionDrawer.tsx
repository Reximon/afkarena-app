import { Gem } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  EquipmentIconPicker,
  type EquipmentIconGroup,
} from '@/components/equipment/EquipmentIconPicker'
import { Field, Select } from '@/components/ui/Input'
import { getEligibleCollections } from '@/features/collections/collections'
import {
  COLLECTION_LEVELS,
  COLLECTION_MYTHIC_STATS,
  COLLECTION_SKILL_LEVELS,
  HERO_CLASSES,
  type CollectionLevel,
  type CollectionMythicStats,
  type CollectionProgress,
  type CollectionSkillLevel,
  type HeroClass,
} from '@/types'
import { PickerDrawer } from './PickerDrawer'

interface CollectionDrawerProps {
  collection?: CollectionProgress
  heroName: string
  heroClass?: HeroClass
  onSelect: (collectionId: string) => void
  onChange: (patch: Partial<CollectionProgress>) => void
  onClose: () => void
}

export function CollectionDrawer({
  collection,
  heroName,
  heroClass,
  onSelect,
  onChange,
  onClose,
}: CollectionDrawerProps) {
  const { t } = useTranslation()
  const eligible = getEligibleCollections(heroClass)

  const groups: EquipmentIconGroup[] = HERO_CLASSES.map((heroClassGroup) => ({
    label: t(`heroClass.${heroClassGroup}`),
    items: eligible
      .filter((item) => item.class === heroClassGroup)
      .map((item) => ({ id: item.id, name: item.name, image: item.image })),
  })).filter((group) => group.items.length > 0)

  return (
    <PickerDrawer kicker={heroName} title={t('hero.collection')} onClose={onClose}>
      <div className="mt-3">
        <EquipmentIconPicker
          value={collection?.collectionId}
          onChange={onSelect}
          noneLabel={t('common.none')}
          groups={groups}
          icon={Gem}
        />
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-muted">
        {t('heroDialog.collectionHint')}
      </p>

      {collection?.collectionId ? (
        <div className="mt-4 grid gap-2">
          <Field label={t('hero.collectionLevel')}>
            <Select
              value={collection.level}
              onChange={(event) =>
                onChange({ level: Number(event.target.value) as CollectionLevel })
              }
            >
              {COLLECTION_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t('hero.collectionSkill')}>
            <Select
              value={collection.skillLevel}
              onChange={(event) =>
                onChange({ skillLevel: Number(event.target.value) as CollectionSkillLevel })
              }
            >
              {COLLECTION_SKILL_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t('hero.mythicStats')}>
            <Select
              value={collection.mythicStats}
              onChange={(event) =>
                onChange({ mythicStats: Number(event.target.value) as CollectionMythicStats })
              }
            >
              {COLLECTION_MYTHIC_STATS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      ) : null}
    </PickerDrawer>
  )
}
