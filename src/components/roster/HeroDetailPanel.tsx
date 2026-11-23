import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Gem, Pencil } from 'lucide-react'
import { EquipmentImage } from '@/components/equipment/EquipmentImage'
import { FramedHeroIcon } from '@/components/heroes/FramedHeroIcon'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { getArtifact } from '@/features/artifacts/artifacts'
import { getCollection } from '@/features/collections/collections'
import { getGearFactionDisplay } from '@/features/gear/gear'
import { getHeroCatalogEntry, getHeroClassKey } from '@/features/heroes/heroCatalog'
import type { GearPiece, GearSlot, HeroCatalogEntry, HeroProgress } from '@/types'

interface HeroDetailPanelProps {
  hero: HeroProgress
  entry: HeroCatalogEntry
  onClose: () => void
  onEdit: () => void
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{children}</h3>
  )
}

function DetailStat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-[9px] tracking-[0.12em] text-muted uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm text-parch">{children}</dd>
    </div>
  )
}

function GearDetail({
  slot,
  piece,
  heroFaction,
}: {
  slot: GearSlot
  piece?: GearPiece
  heroFaction: HeroCatalogEntry['faction']
}) {
  const { t } = useTranslation()
  const display = getGearFactionDisplay(piece, heroFaction)

  return (
    <div className="rounded-xl border border-line bg-night/30 p-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[9px] tracking-[0.14em] text-muted uppercase">
          {t(`gearSlot.${slot}`)}
        </span>
        <Badge variant={piece ? 'outline' : 'muted'}>
          {piece ? t(`gearTier.${piece.tier}`) : t('common.none')}
        </Badge>
      </div>

      {piece ? (
        <>
          <p className="mt-1.5 font-mono text-xs text-gild">
            {'★'.repeat(piece.stars)}
            {'☆'.repeat(5 - piece.stars)}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {piece.resonant ? <Badge variant="cyan">{t('hero.resonant')}</Badge> : null}
            {piece.exclusive ? <Badge variant="rose">{t('hero.exclusive')}</Badge> : null}
            {display.kind === 'same' && display.faction ? (
              <Badge variant="cyan">{t(`faction.${display.faction}`)}</Badge>
            ) : null}
            {display.kind === 'select' && display.faction ? (
              <Badge variant="outline">{t(`faction.${display.faction}`)}</Badge>
            ) : null}
            {display.kind === 'select' && !display.faction ? (
              <Badge variant="muted">{t('hero.noFaction')}</Badge>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  )
}

export function HeroDetailPanel({ hero, entry, onClose, onEdit }: HeroDetailPanelProps) {
  const { t, i18n } = useTranslation()
  const linkedEntry = hero.linkedHeroId ? getHeroCatalogEntry(hero.linkedHeroId) : undefined
  const artifact = getArtifact(hero.artifact)
  const collection = getCollection(hero.collection?.collectionId)
  const hasSavedCollection = Boolean(hero.collection && !collection)
  const updatedAt = new Date(hero.updatedAt)
  const formattedUpdatedAt = Number.isNaN(updatedAt.getTime())
    ? hero.updatedAt
    : new Intl.DateTimeFormat(i18n.language, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(updatedAt)

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      title={entry.displayName}
      description={`${t(`faction.${entry.faction}`)} · ${t(getHeroClassKey(entry))}`}
      className="hero-detail-panel top-0 right-0 left-auto h-dvh max-h-none w-full max-w-md translate-x-0 translate-y-0 rounded-none border-y-0 border-r-0"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.close')}
          </Button>
          <Button onClick={onEdit}>
            <Pencil size={15} aria-hidden="true" />
            {t('common.edit')}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <section className="flex gap-4 rounded-2xl border border-line bg-night/30 p-3">
          <FramedHeroIcon
            heroId={entry.id}
            ascension={hero.ascension}
            signatureItem={hero.signatureItem}
            furniture={hero.furniture}
            engraving={hero.engraving}
            alt={entry.displayName}
            className="w-28 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="gold">{t(`ascension.${hero.ascension}`)}</Badge>
              <Badge variant="outline">
                {t('hero.level')} {hero.level}
              </Badge>
              {hero.inCrystal ? <Badge variant="cyan">{t('hero.inCrystal')}</Badge> : null}
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
              <DetailStat label={t('hero.signatureItem')}>{hero.signatureItem}</DetailStat>
              <DetailStat label={t('hero.furniture')}>{hero.furniture}</DetailStat>
              <DetailStat label={t('hero.engraving')}>{hero.engraving}</DetailStat>
              <DetailStat label={t('hero.roles')}>
                {entry.roles.length > 0 ? (
                  <span className="text-xs leading-relaxed">{entry.roles.join(' · ')}</span>
                ) : (
                  t('common.none')
                )}
              </DetailStat>
            </dl>
          </div>
        </section>

        <section>
          <SectionTitle>{t('hero.gear')}</SectionTitle>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(['weapon', 'helmet', 'chest', 'boots'] as const).map((slot) => (
              <GearDetail
                key={slot}
                slot={slot}
                piece={hero.gear[slot]}
                heroFaction={entry.faction}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>{t('equipment.title')}</SectionTitle>
          <div className="mt-2 space-y-2">
            {artifact ? (
              <div className="rounded-xl border border-gild/20 bg-gild/5 p-3">
                <div className="flex items-start gap-3">
                  <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-gild/25 bg-night/40">
                    <EquipmentImage
                      src={artifact.image}
                      icon={Gem}
                      className="size-full object-contain p-1"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg leading-tight text-parch">{artifact.name}</p>
                    <p className="mt-0.5 font-mono text-[9px] tracking-[0.12em] text-muted uppercase">
                      {artifact.source}
                    </p>
                  </div>
                  <Badge variant="gold">{t('hero.artifact')}</Badge>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">{artifact.effect}</p>
              </div>
            ) : null}

            {collection && hero.collection ? (
              <div className="rounded-xl border border-arcane/20 bg-arcane/5 p-3">
                <div className="flex items-start gap-3">
                  <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-arcane/25 bg-night/40">
                    <EquipmentImage
                      src={collection.image}
                      icon={Gem}
                      className="size-full object-contain p-1"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg leading-tight text-parch">
                      {collection.name}
                    </p>
                    <p className="mt-0.5 text-xs text-arcane">{collection.skillName}</p>
                  </div>
                  <Badge variant="cyan">{t('hero.collection')}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="outline">
                    {t('hero.collectionLevel')} {hero.collection.level}
                  </Badge>
                  <Badge variant="outline">
                    {t('hero.collectionSkill')} {hero.collection.skillLevel}
                  </Badge>
                  <Badge variant="outline">
                    {t('hero.mythicStats')} {hero.collection.mythicStats}/8
                  </Badge>
                </div>
                {collection.effect ? (
                  <p className="mt-2 text-xs leading-relaxed text-muted">{collection.effect}</p>
                ) : null}
              </div>
            ) : null}

            {!artifact && hasSavedCollection && hero.collection ? (
              <div className="rounded-xl border border-line bg-night/25 p-3">
                <p className="text-xs text-muted">{t('hero.collectionSaved')}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="outline">
                    {t('hero.collectionLevel')} {hero.collection.level}
                  </Badge>
                  <Badge variant="outline">
                    {t('hero.collectionSkill')} {hero.collection.skillLevel}
                  </Badge>
                  <Badge variant="outline">
                    {t('hero.mythicStats')} {hero.collection.mythicStats}/8
                  </Badge>
                </div>
              </div>
            ) : null}

            {!artifact && !collection && !hasSavedCollection ? (
              <p className="rounded-xl border border-dashed border-line bg-night/20 px-3 py-4 text-center text-xs text-muted">
                {t('hero.noEquipment')}
              </p>
            ) : null}
          </div>
        </section>

        {linkedEntry ? (
          <section>
            <SectionTitle>{t('hero.linkedHero')}</SectionTitle>
            <div className="mt-2 rounded-xl border border-line bg-night/30 p-3">
              <p className="text-sm text-parch">{linkedEntry.displayName}</p>
              <p className="mt-0.5 text-[11px] text-muted">
                {t(`faction.${linkedEntry.faction}`)} · {t(getHeroClassKey(linkedEntry))}
              </p>
            </div>
          </section>
        ) : null}

        <section>
          <SectionTitle>{t('hero.notes')}</SectionTitle>
          {hero.notes ? (
            <p className="mt-2 whitespace-pre-wrap rounded-xl border border-line bg-night/30 p-3 text-sm leading-relaxed text-parch/90">
              {hero.notes}
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted">{t('hero.noNotes')}</p>
          )}
        </section>

        <p className="text-[11px] text-muted">
          {t('hero.updatedAt', { date: formattedUpdatedAt })}
        </p>
      </div>
    </Dialog>
  )
}
