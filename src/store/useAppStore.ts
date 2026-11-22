import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppData, HeroProgress, Profile, Team } from '@/types'
import { createEmptyAppData, createEmptyTeam } from '@/features/persistence/defaults'
import { createId } from '@/lib/id'

export const DATA_STORAGE_KEY = 'afk-astral-codex:data'

interface AppState extends AppData {
  addHero: (hero: HeroProgress) => void
  updateHero: (heroId: string, patch: Partial<HeroProgress>) => void
  removeHero: (heroId: string) => void
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
        teams: state.teams,
      }),
    },
  ),
)
