import { describe, expect, it } from 'vitest'
import { artifactById, artifacts, getArtifact, getArtifactName } from './artifacts'

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
})
