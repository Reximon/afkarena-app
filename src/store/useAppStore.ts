import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppData, CollectionProgress, HeroProgress, PetProgress, Profile, Team } from '@/types'
import {
  createDefaultPetProgress,
  createEmptyAppData,
  createEmptyTeam,
} from '@/features/persistence/defaults'
import { clampPetBuffs, PET_MAX_RESONANCE } from '@/features/pets/pets'
import { createId } from '@/lib/id'

export const DATA_STORAGE_KEY = 'afk-astral-codex:data'

interface AppState extends AppData {
  addHero: (hero: HeroProgress) => void
  updateHero: (heroId: string, patch: Partial<HeroProgress>) => void
  removeHero: (heroId: string) => void
  assignArtifact: (heroId: string, artifactId: string) => void
  unassignArtifact: (heroId: string) => void
  assignCollection: (heroId: string, collection: CollectionProgress) => void
  unassignCollection: (heroId: string) => void
  addPet: (petId: string, overrides?: Partial<PetProgress>) => void
  updatePet: (petId: string, patch: Partial<PetProgress>) => void
  removePet: (petId: string) => void
  setPetResonance: (level: number) => void
  setProfile: (patch: Partial<Profile>) => void
  createTeam: (overrides?: Partial<Team>) => string
  updateTeam: (teamId: string, patch: Partial<Team>) => void
  duplicateTeam: (teamId: string) => string | null
  removeTeam: (teamId: string) => void
  importData: (data: AppData) => void
  reset: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...createEmptyAppData(),

      addHero: (hero) => {
        const now = new Date().toISOString()

        set((state) => ({
          heroes: {
            ...state.heroes,
            [hero.heroId]: {
              ...hero,
              heroId: hero.heroId,
              updatedAt: now,
            },
          },
        }))
      },

      updateHero: (heroId, patch) => {
        set((state) => {
          const current = state.heroes[heroId]
          if (!current) return state

          return {
            heroes: {
              ...state.heroes,
              [heroId]: {
                ...current,
                ...patch,
                heroId,
                updatedAt: new Date().toISOString(),
              },
            },
          }
        })
      },

      removeHero: (heroId) => {
        set((state) => {
          const heroes = { ...state.heroes }
          delete heroes[heroId]

          return {
            heroes,
            teams: state.teams.map((team) => ({
              ...team,
              slots: team.slots.map((slot) =>
                slot.heroId === heroId ? { ...slot, heroId: undefined } : slot,
              ),
              updatedAt: new Date().toISOString(),
            })),
          }
        })
      },

      assignArtifact: (heroId, artifactId) => {
        set((state) => {
          const current = state.heroes[heroId]
          if (!current) return state

          return {
            heroes: {
              ...state.heroes,
              [heroId]: {
                ...current,
                artifact: artifactId,
                collection: current.collection
                  ? { ...current.collection, collectionId: undefined }
                  : undefined,
                updatedAt: new Date().toISOString(),
              },
            },
          }
        })
      },

      unassignArtifact: (heroId) => {
        set((state) => {
          const current = state.heroes[heroId]
          if (!current) return state

          return {
            heroes: {
              ...state.heroes,
              [heroId]: {
                ...current,
                artifact: undefined,
                updatedAt: new Date().toISOString(),
              },
            },
          }
        })
      },

      assignCollection: (heroId, collection) => {
        set((state) => {
          const current = state.heroes[heroId]
          if (!current) return state

          return {
            heroes: {
              ...state.heroes,
              [heroId]: {
                ...current,
                artifact: undefined,
                collection,
                updatedAt: new Date().toISOString(),
              },
            },
          }
        })
      },

      unassignCollection: (heroId) => {
        set((state) => {
          const current = state.heroes[heroId]
          if (!current) return state

          return {
            heroes: {
              ...state.heroes,
              [heroId]: {
                ...current,
                collection: current.collection
                  ? { ...current.collection, collectionId: undefined }
                  : undefined,
                updatedAt: new Date().toISOString(),
              },
            },
          }
        })
      },

      addPet: (petId, overrides) => {
        const pet = createDefaultPetProgress(petId, overrides)

        set((state) => ({
          pets: {
            ...state.pets,
            [petId]: { ...pet, petId, updatedAt: new Date().toISOString() },
          },
        }))
      },

      updatePet: (petId, patch) => {
        set((state) => {
          const current = state.pets[petId]
          if (!current) return state

          return {
            pets: {
              ...state.pets,
              [petId]: clampPetBuffs(petId, {
                ...current,
                ...patch,
                petId,
                updatedAt: new Date().toISOString(),
              }),
            },
          }
        })
      },

      removePet: (petId) => {
        set((state) => {
          const pets = { ...state.pets }
          delete pets[petId]
          const now = new Date().toISOString()

          return {
            pets,
            teams: state.teams.map((team) =>
              team.petId === petId ? { ...team, petId: undefined, updatedAt: now } : team,
            ),
          }
        })
      },

      setPetResonance: (level) => {
        const next = Math.max(
          0,
          Math.min(PET_MAX_RESONANCE, Number.isFinite(level) ? Math.floor(level) : 0),
        )

        set((state) => ({
          profile: { ...state.profile, petResonanceLevel: next },
        }))
      },

      setProfile: (patch) => {
        set((state) => ({
          profile: {
            ...state.profile,
            ...patch,
          },
        }))
      },

      createTeam: (overrides) => {
        const team = createEmptyTeam(overrides)
        set((state) => ({ teams: [...state.teams, team] }))
        return team.id
      },

      updateTeam: (teamId, patch) => {
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId
              ? {
                  ...team,
                  ...patch,
                  id: team.id,
                  updatedAt: new Date().toISOString(),
                }
              : team,
          ),
        }))
      },

      duplicateTeam: (teamId) => {
        const team = get().teams.find((item) => item.id === teamId)
        if (!team) return null

        const now = new Date().toISOString()
        const copy: Team = {
          ...team,
          id: createId('team'),
          name: `${team.name} copy`,
          slots: team.slots.map((slot) => ({ ...slot })),
          createdAt: now,
          updatedAt: now,
        }

        set((state) => ({ teams: [...state.teams, copy] }))
        return copy.id
      },

      removeTeam: (teamId) => {
        set((state) => ({
          teams: state.teams.filter((team) => team.id !== teamId),
        }))
      },

      importData: (data) => {
        set({
          schemaVersion: data.schemaVersion,
          profile: data.profile,
          heroes: data.heroes,
          pets: data.pets,
          teams: data.teams,
        })
      },

      reset: () => {
        set(createEmptyAppData())
      },
    }),
    {
      name: DATA_STORAGE_KEY,
      version: 1,
      partialize: (state) => ({
        schemaVersion: state.schemaVersion,
        profile: state.profile,
        heroes: state.heroes,
        pets: state.pets,
        teams: state.teams,
      }),
    },
  ),
)
