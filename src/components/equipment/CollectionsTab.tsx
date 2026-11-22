import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  Gem,
  HeartPulse,
  Shield,
  Sparkles,
  Sword,
  Target,
  type LucideIcon,
} from 'lucide-react'
import { AssignedHeroChip } from '@/components/equipment/AssignedHeroChip'
import { EquipmentCard } from '@/components/equipment/EquipmentCard'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Input'
import { buttonStyles } from '@/components/ui/buttonStyles'
import {
  collections,
  getCollectionName,
  isCollectionEligible,
  type CollectionDefinition,
} from '@/features/collections/collections'
import { getHeroCatalogEntry } from '@/features/heroes/heroCatalog'
import { useAppStore } from '@/store/useAppStore'
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
  type HeroProgress,
} from '@/types'

const CLASS_ICONS: Record<HeroClass, LucideIcon> = {
  Warrior: Sword,
  Tank: Shield,
  Ranger: Target,
  Mage: Sparkles,
  Support: HeartPulse,
}

export function CollectionsTab() {
  const { t } = useTranslation()
  const heroes = useAppStore((state) => state.heroes)
  const assignCollection = useAppStore((state) => state.assignCollection)
  const unassignCollection = useAppStore((state) => state.unassignCollection)
  const updateHero = useAppStore((state) => state.updateHero)

  const ownedHeroes = useMemo(
    () =>
      Object.values(heroes)
        .flatMap((hero) => {
          const entry = getHeroCatalogEntry(hero.heroId)
          return entry ? [{ hero, entry }] : []
        })
        .sort((a, b) => a.entry.displayName.localeCompare(b.entry.displayName)),
    [heroes],
  )

  const classGroups = HERO_CLASSES.map((heroClass) => ({
    heroClass,
    items: collections.filter((collection) => collection.class === heroClass),
  })).filter((group) => group.items.length > 0)

  function updateProgress(hero: HeroProgress, patch: Partial<CollectionProgress>) {
    if (!hero.collection) return
    updateHero(hero.heroId, { collection: { ...hero.collection, ...patch } })
  }

  function renderCollection(collection: CollectionDefinition) {
    const Icon = CLASS_ICONS[collection.class]
    const assigned = ownedHeroes.filter(
      ({ hero }) => hero.collection?.collectionId === collection.id,
    )
    const compatible = ownedHeroes.some(({ entry }) =>
      isCollectionEligible(entry.class, collection),
    )
    const available = ownedHeroes.filter(
      ({ hero, entry }) =>
        hero.collection?.collectionId !== collection.id &&
        isCollectionEligible(entry.class, collection),
    )

    const emptyLabel =
      ownedHeroes.length === 0
        ? t('collections.noHeroesShort')
        : !compatible
          ? t('collections.noCompatibleHeroes', {
              class: t(`heroClass.${collection.class}`),
            })
          : available.length === 0
            ? t('collections.allAssigned')
            : t('collections.assignPlaceholder')

    return (
      <EquipmentCard
        key={collection.id}
        name={collection.name}
        subtitle={collection.skillName}
        meta={t(`heroClass.${collection.class}`)}
        effect={collection.effect}
        icon={Icon}
        count={assigned.length}
      >
        <div className="mt-4 space-y-2">
          {assigned.length > 0 ? (
            assigned.map(({ hero, entry }) => (
              <div
                key={hero.heroId}
                className="rounded-xl border border-line bg-void/25 p-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <AssignedHeroChip
                    hero={hero}
                    entry={entry}
                    onRemove={() => unassignCollection(hero.heroId)}
                    removeLabel={t('collections.removeAssignment', { name: entry.displayName })}
                  />
                  <span className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
                    Lv {hero.collection?.level ?? 0} · Skill {hero.collection?.skillLevel ?? 0} · Mythic{' '}
                    {hero.collection?.mythicStats ?? 0}
                  </span>
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <label className="block">
                    <span className="mb-1 block font-mono text-[9px] tracking-[0.14em] text-muted uppercase">
                      {t('collections.level')}
                    </span>
                    <Select
                      value={String(hero.collection?.level ?? 0)}
                      onChange={(event) =>
                        updateProgress(hero, {
                          level: Number(event.target.value) as CollectionLevel,
                        })
                      }
                    >
                      {COLLECTION_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block font-mono text-[9px] tracking-[0.14em] text-muted uppercase">
                      {t('collections.skillLevel')}
                    </span>
                    <Select
                      value={String(hero.collection?.skillLevel ?? 0)}
                      onChange={(event) =>
                        updateProgress(hero, {
                          skillLevel: Number(event.target.value) as CollectionSkillLevel,
                        })
                      }
                    >
                      {COLLECTION_SKILL_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block font-mono text-[9px] tracking-[0.14em] text-muted uppercase">
                      {t('hero.mythicStats')}
                    </span>
                    <Select
                      value={String(hero.collection?.mythicStats ?? 0)}
                      onChange={(event) =>
                        updateProgress(hero, {
                          mythicStats: Number(event.target.value) as CollectionMythicStats,
                        })
                      }
                    >
                      {COLLECTION_MYTHIC_STATS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </Select>
                  </label>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted">{t('collections.unassigned')}</p>
          )}
        </div>

        <div className="mt-auto pt-4">
          <Select
            value=""
            disabled={available.length === 0}
            onChange={(event) => {
              if (!event.target.value) return
              const hero = heroes[event.target.value]
              if (!hero) return

              assignCollection(event.target.value, {
                collectionId: collection.id,
                level: hero.collection?.level ?? 0,
                skillLevel: hero.collection?.skillLevel ?? 0,
                mythicStats: hero.collection?.mythicStats ?? 0,
              })
            }}
            aria-label={`${t('collections.assignHero')} · ${collection.name}`}
          >
            <option value="">{emptyLabel}</option>
            {available.map(({ hero, entry }) => {
              const current = getCollectionName(hero.collection?.collectionId)

              return (
                <option key={hero.heroId} value={hero.heroId}>
                  {entry.displayName}
                  {current ? ` · ${current}` : ''}
                </option>
              )
            })}
          </Select>
        </div>
      </EquipmentCard>
    )
  }

  return (
    <div className="space-y-8">
      {ownedHeroes.length === 0 ? (
        <div className="codex-panel star-chart flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-gold/25 bg-gold/10 text-gold">
              <Gem size={20} strokeWidth={1.6} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-xl text-bone">{t('collections.noHeroesTitle')}</h2>
              <p className="mt-1 text-sm text-muted">{t('collections.noHeroesBody')}</p>
            </div>
          </div>
          <Link to="/roster" className={buttonStyles({ variant: 'secondary' })}>
            {t('collections.addHeroes')}
          </Link>
        </div>
      ) : null}

      {classGroups.map((group) => (
        <section key={group.heroClass} className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-2xl text-bone">
              {t(`heroClass.${group.heroClass}`)}
            </h2>
            <Badge variant="cyan">
              {t('collections.collectionCount', { count: group.items.length })}
            </Badge>
          </div>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {group.items.map(renderCollection)}
          </div>
        </section>
      ))}
    </div>
  )
}
