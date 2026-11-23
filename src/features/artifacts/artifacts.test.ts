import { describe, expect, it } from 'vitest'
import {
  artifactById,
  artifacts,
  getArtifact,
  getArtifactName,
  getEligibleArtifacts,
  isArtifactEligible,
} from './artifacts'

describe('artifact catalog', () => {
  it('has unique ids and names', () => {
    expect(new Set(artifacts.map((artifact) => artifact.id)).size).toBe(artifacts.length)
    expect(new Set(artifacts.map((artifact) => artifact.name)).size).toBe(artifacts.length)
    expect(artifactById.size).toBe(artifacts.length)
  })

  it('resolves artifacts by id', () => {
    expect(getArtifactName('duras-call')).toBe("Dura's Call")
    expect(getArtifact('duras-grace')?.source).toContain('Ranhorn')
    expect(getArtifact('missing')).toBeUndefined()
    expect(getArtifactName(undefined)).toBeUndefined()
  })

  it('contains the seven Dura artifacts and fifteen class artifacts', () => {
    expect(artifacts.filter((artifact) => artifact.kind === 'dura')).toHaveLength(7)
    expect(artifacts.filter((artifact) => artifact.kind === 'class')).toHaveLength(15)
    expect(artifacts).toHaveLength(22)
  })

  it('provides a unique image for every artifact', () => {
    expect(
      artifacts.every((artifact) => artifact.image.startsWith('/images/afk-arena/game/artifact/')),
    ).toBe(true)
    expect(new Set(artifacts.map((artifact) => artifact.image)).size).toBe(artifacts.length)
    expect(getArtifact('duras-grace')?.image).toBe('/images/afk-arena/game/artifact/1.webp')
    expect(getArtifact('tidebearer')?.image).toBe('/images/afk-arena/game/artifact/501.webp')
  })

  it('restricts class artifacts to matching hero classes', () => {
    const tidebearer = getArtifact('tidebearer')
    const chaosBringer = getArtifact('chaos-bringer')
    const durasCall = getArtifact('duras-call')

    expect(tidebearer && isArtifactEligible('Support', tidebearer)).toBe(true)
    expect(tidebearer && isArtifactEligible('Mage', tidebearer)).toBe(false)
    expect(chaosBringer && isArtifactEligible('Warrior', chaosBringer)).toBe(true)
    expect(chaosBringer && isArtifactEligible(undefined, chaosBringer)).toBe(false)
    expect(durasCall && isArtifactEligible('Mage', durasCall)).toBe(true)
  })

  it('filters picker options down to the hero class', () => {
    expect(getEligibleArtifacts(undefined)).toHaveLength(22)

    const warrior = getEligibleArtifacts('Warrior')
    expect(warrior).toHaveLength(10)
    expect(warrior.filter((artifact) => artifact.kind === 'dura')).toHaveLength(7)
    expect(
      warrior.every((artifact) => artifact.kind === 'dura' || artifact.class === 'Warrior'),
    ).toBe(true)
  })
})
