import { useMemo } from 'react'
import { Gem } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  EquipmentIconPicker,
  type EquipmentIconGroup,
} from '@/components/equipment/EquipmentIconPicker'
import { Field, Select } from '@/components/ui/Input'
import {
  getArtifact,
  getEligibleArtifacts,
  isArtifactEligible,
} from '@/features/artifacts/artifacts'
import {
  getCollection,
  getEligibleCollections,
  isCollectionEligible,
} from '@/features/collections/collections'
import {
  COLLECTION_LEVELS,
  COLLECTION_MYTHIC_STATS,
  COLLECTION_SKILL_LEVELS,
  HERO_CLASSES,
  type CollectionLevel,
  type CollectionMythicStats,
  type CollectionProgress,
  type CollectionSkillLevel,
  type HeroCatalogEntry,
  type HeroProgress,
} from '@/types'

interface EquipmentPanelProps {
  entry: HeroCatalogEntry
  progress: HeroProgress
  commit: (patch: Partial<HeroProgress>) => void
}

export function EquipmentPanel({ entry, progress, commit }: EquipmentPanelProps) {
  const { t } = useTranslation()

  const currentArtifact = getArtifact(progress.artifact)
  const currentCollection = getCollection(progress.collection?.collectionId)
  const artifactIneligible = Boolean(
    currentArtifact && !isArtifactEligible(entry.class, currentArtifact),
  )
  const collectionIneligible = Boolean(
    currentCollection && !isCollectionEligible(entry.class, currentCollection),
  )
  const hasEquipmentConflict = Boolean(progress.artifact && progress.collection?.collectionId)

  const artifactPickerGroups: EquipmentIconGroup[] = useMemo(() => {
    const eligible = getEligibleArtifacts(entry.class)

    return [
      {
        label: t('artifacts.duraGroup'),
        items: eligible
          .filter((artifact) => artifact.kind === 'dura')
          .map((artifact) => ({
            id: artifact.id,
            name: artifact.name,
            image: artifact.image,
          })),
      },
      ...HERO_CLASSES.map((heroClass) => ({
        label: t(`heroClass.${heroClass}`),
        items: eligible
          .filter((artifact) => artifact.kind === 'class' && artifact.class === heroClass)
          .map((artifact) => ({
            id: artifact.id,
            name: artifact.name,
            image: artifact.image,
          })),
      })).filter((group) => group.items.length > 0),
    ]
  }, [entry.class, t])

  const collectionPickerGroups: EquipmentIconGroup[] = useMemo(() => {
    const eligible = getEligibleCollections(entry.class)

    return HERO_CLASSES.map((heroClass) => ({
      label: t(`heroClass.${heroClass}`),
      items: eligible
        .filter((collection) => collection.class === heroClass)
        .map((collection) => ({
          id: collection.id,
          name: collection.name,
          image: collection.image,
        })),
    })).filter((group) => group.items.length > 0)
  }, [entry.class, t])

  function setArtifact(artifactId: string) {
    commit({
      artifact: artifactId || undefined,
      collection:
        artifactId && progress.collection
          ? { ...progress.collection, collectionId: undefined }
          : progress.collection,
    })
  }

  function setCollection(collectionId: string) {
    if (!collectionId) {
      commit({ collection: undefined })
      return
    }

    commit({
      artifact: undefined,
      collection: {
        collectionId,
        level: progress.collection?.level ?? 0,
        skillLevel: progress.collection?.skillLevel ?? 0,
        mythicStats: progress.collection?.mythicStats ?? 0,
      },
    })
  }

  function updateCollectionProgress(patch: Partial<CollectionProgress>) {
    if (progress.collection) {
      commit({ collection: { ...progress.collection, ...patch } })
    }
  }

  return (
    <section className="space-y-3">
      {hasEquipmentConflict ? (
        <p className="rounded-xl border border-ember/30 bg-ember/5 px-3 py-2 text-xs leading-relaxed text-ember">
          {t('hero.equipmentConflict')}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          as="div"
          label={t('hero.artifact')}
          hint={
            artifactIneligible
              ? t('artifacts.classRequired', {
                  class: currentArtifact?.class ? t(`heroClass.${currentArtifact.class}`) : '',
                })
              : undefined
          }
        >
          <EquipmentIconPicker
            value={progress.artifact}
            onChange={setArtifact}
            noneLabel={t('common.none')}
            groups={artifactPickerGroups}
            icon={Gem}
          />
        </Field>

        <Field
          as="div"
          label={t('hero.collection')}
          hint={
            collectionIneligible
              ? t('collections.classRequired', {
                  class: currentCollection?.class
                    ? t(`heroClass.${currentCollection.class}`)
                    : '',
                })
              : progress.collection && !progress.collection.collectionId
                ? t('hero.collectionSaved')
                : undefined
          }
        >
          <EquipmentIconPicker
            value={progress.collection?.collectionId}
            onChange={setCollection}
            noneLabel={t('common.none')}
            groups={collectionPickerGroups}
            icon={Gem}
          />
        </Field>
      </div>

      {progress.collection?.collectionId ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label={t('hero.collectionLevel')}>
            <Select
              value={progress.collection.level}
              onChange={(event) =>
                updateCollectionProgress({ level: Number(event.target.value) as CollectionLevel })
              }
            >
              {COLLECTION_LEVELS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </Field>

          <Field label={t('hero.collectionSkill')}>
            <Select
              value={progress.collection.skillLevel}
              onChange={(event) =>
                updateCollectionProgress({
                  skillLevel: Number(event.target.value) as CollectionSkillLevel,
                })
              }
            >
              {COLLECTION_SKILL_LEVELS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </Field>

          <Field label={t('hero.mythicStats')}>
            <Select
              value={progress.collection.mythicStats}
              onChange={(event) =>
                updateCollectionProgress({
                  mythicStats: Number(event.target.value) as CollectionMythicStats,
                })
              }
            >
              {COLLECTION_MYTHIC_STATS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      ) : null}
    </section>
  )
}
