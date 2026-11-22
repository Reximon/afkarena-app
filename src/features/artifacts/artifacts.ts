export interface ArtifactDefinition {
  id: string
  name: string
  effect: string
  source: string
}

export const artifacts: ArtifactDefinition[] = [
  {
    id: 'duras-grace',
    name: "Dura's Grace",
    effect: 'Divine shield when the wearer uses their ultimate.',
    source: "Peaks of Time · Ranhorn's Strife",
  },
  {
    id: 'duras-eye',
    name: "Dura's Eye",
    effect: 'Haste burst after a critical strike.',
    source: 'Peaks of Time · Secrets of the Forest',
  },
  {
    id: 'duras-call',
    name: "Dura's Call",
    effect: 'Restores energy every second and shares remaining energy when slain.',
    source: 'Peaks of Time · Rest in Peace',
  },
  {
    id: 'duras-drape',
    name: "Dura's Drape",
    effect: 'Improves health recovery, defense and magic resistance.',
    source: 'Peaks of Time · The Far Frontier',
  },
  {
    id: 'duras-blade',
    name: "Dura's Blade",
    effect: 'Attack rating and accuracy ramp up during battle.',
    source: "Peaks of Time · Viper's Marsh",
  },
  {
    id: 'duras-chalice',
    name: "Dura's Chalice of Vitality",
    effect: 'Restores health over the opening seconds of battle.',
    source: 'Peaks of Time · The Savage Wastes',
  },
  {
    id: 'duras-conviction',
    name: "Dura's Conviction",
    effect: 'Attack rating when isolated; knockback shockwave at five stars.',
    source: 'Peaks of Time · The Solar Plane',
  },
]

export const artifactById = new Map<string, ArtifactDefinition>(
  artifacts.map((artifact) => [artifact.id, artifact]),
)

export function getArtifact(id: string | undefined): ArtifactDefinition | undefined {
  return id ? artifactById.get(id) : undefined
}

export function getArtifactName(id: string | undefined): string | undefined {
  return getArtifact(id)?.name
}
