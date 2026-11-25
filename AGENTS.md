# Agent guide

The Resonating Hall is a bilingual (EN/ES) roster and team tracker for AFK Arena Classic. All data stays in the browser; there is no backend.

## Stack

React 19 (strict TypeScript, `verbatimModuleSyntax`), Vite 8, Tailwind CSS v4, Zustand 5 with `persist`, Zod 4, i18next, Radix UI, lucide-react, dnd-kit, Vitest + Testing Library.

Routing uses `HashRouter`. Path alias `@/` maps to `src/`.

## Commands

| Command             | Purpose                                |
| ------------------- | -------------------------------------- |
| `npm run dev`       | Start the Vite dev server on port 5173 |
| `npm run typecheck` | `tsc -b`                               |
| `npm run lint`      | Oxlint                                 |
| `npm run test`      | Vitest once                            |
| `npm run format`    | Prettier                               |
| `npm run build`     | Typecheck + production build           |

Before finishing any task run `npm run typecheck`, `npm run lint` and `npm run test`. For UI changes, also exercise the feature in a browser against the dev server.

## Code style

- Prettier: no semicolons, single quotes, trailing commas, width 100 (`npx prettier --write <files>`).
- Use `import type` for type-only imports.
- Write no comments unless the why is non-obvious.
- Prefer existing primitives over new ones: `Button`, `Badge`, `Dialog`, `EmptyState`, `Input`/`Select`/`Field`, `PageHeader`, `cn()` from `@/lib/cn`.
- The visual language and header/navigation spec live in `DESIGN.md`. Tailwind tokens and component classes live in `src/index.css` (CSS-first, no `tailwind.config`). Reuse them instead of raw colors where possible:
  - Surfaces: `codex-panel`, `codex-panel-soft`, `dialog-frame`, `hero-stage`, `faction-scene` (plus `data-faction`), `picker-sheet`, `formation-slot`, `portrait-frame`, `game-medallion`, `stat-medal`.
  - Type and rules: `panel-title`, `display-title`, `page-eyebrow`, `gild-rule`, `stat-value`, `star-chart`. Display type is Poppins; body text is Manrope; labels use JetBrains Mono.
  - Controls: `btn-gild`, `btn-leather`, `btn-ghost`, `btn-danger`, `game-field`, `game-tab`, `detail-action`, `icon-action`, `badge-gold|cyan|rose|muted|outline`.
  - Motion and chrome: `card-lift`, `hero-foil`, `nav-rail`, `nav-tab`, `nav-row`.
- `Badge` variants: `gold`, `cyan`, `rose`, `muted`, `outline`.

## Layout

- `src/pages/` — route screens (Dashboard, Roster, Teams, Pets, Equipment, Settings).
- `src/components/` — `ui/` primitives, `roster/`, `dashboard/`, `teams/`, `pets/`, `equipment/`, `heroes/`.
- `src/components/roster/hero-detail/` — presentation pieces of the hero detail screen (portrait stage, gear pickers, investment panel). `FactionScene.tsx` paints the per-faction preview backdrop using the official paintings in `src/assets/factions/`; see `DESIGN.md`.
- `src/assets/factions/` — official faction paintings (one WebP per faction) used by the hero preview scenes; `icons/` holds the official 30px faction emblems used by `FactionIcon` (roster faction filter). `src/assets/classes/` and `src/assets/roles/` hold the official 64px class and role emblems used by `ClassIcon` / `RoleIcon`. `src/assets/backgrounds/` holds the per-route page backdrops (dashboard courtyard, world overview, elder tree statue, teams hall, pets forest); `AppShell` maps them by route and falls back to the world overview. `src/assets/elder-tree/` holds the stained-glass backdrop and the blessing icons (`blessings/`, one WebP per blessing) used by the Elder Tree page. Every page header stays background-free; the nav rail is a solid bar welded to the viewport top (flat top with concave shoulders, 24px half-pill bottom, drop shadow under the whole silhouette, underline active state) so it reads as browser chrome and the scene shows around it.
- `src/features/` — domain logic: `heroes`, `gear`, `artifacts`, `collections`, `pets`, `teams`, `persistence`.
- `src/store/useAppStore.ts` — Zustand store.
- `src/types/index.ts` — all shared types and enums.
- `src/i18n/locales/` — `en.ts`, `es.ts`, `locales.test.ts`.
- `src/data/` — generated catalogs (do not hand-edit).

## State and persistence

- LocalStorage key `afk-astral-codex:data` (language preference uses `afk-astral-codex:lang`).
- Persisted state is version 1; `partialize` keeps `{ schemaVersion, profile, heroes, pets, teams }`.
- Internally heroes are always keyed by `heroId`; never key store data by display name.
- Pets are keyed by `petId` in `pets`; presence in the record means the pet is owned. Beast level is derived (sum of the three attribute buffs); teams may reference one pet via `petId`.
- Teams keep their manual order in the `teams` array. `Team.pinned` (optional) keeps a team at the top of the list: `sortTeamsByPin` displays pinned teams first, and dragging a team in the dashboard persists the resulting array order via `reorderTeams`. The pin flag is part of the export.
- `Profile.petResonanceLevel` (optional, 0–54) is the player-set beast resonance target. It is informational only: pets below it show a `+N` deficit badge, and buffs are never raised automatically. The deficit is measured against `min(resonance, tier max level)`.
- Heroes flagged `inCrystal` derive their level from `Profile.crystalLevel` (`getHeroLevel` in `src/features/heroes/heroLevel.ts`), so updating the Resonating Crystal level in Settings updates them all. The per-hero `level` is kept as a fallback (used when not in crystal or while the profile level is 0) and the hero detail locks the level control while the hero is in crystal.
- Dimensional heroes mirror the ascension of their `linkedHeroId` (helpers in `src/features/heroes/linkedAscension.ts`): linking copies it, changes to the linked hero propagate, direct ascension edits are ignored while linked, and import/rehydration normalizes divergences. Unlinking keeps the last copied ascension, and the UI disables the ascension selector while linked.
- Deleting a linked hero does not touch other heroes' `linkedHeroId`: the Dimensional keeps a dangling link (shown via the catalog as "Linked to X"), keeps its last copied ascension, and the selector stays locked until the link is cleared manually. Only links whose target exists in `heroes` mirror or propagate ascension.
- Adding a field to `HeroProgress`, `PetProgress` or `Profile` requires:
  1. `src/types/index.ts`
  2. a default in `src/features/persistence/defaults.ts`
  3. the field in `heroProgressSchema` / `petProgressSchema` / `profileSchema` (`src/features/persistence/exportSchema.ts`) — Zod imports run in strip mode, so fields missing from the schema are silently dropped on import
  4. tests covering the round-trip
- Optional legacy fields: use `z.boolean().optional()` style, not `.default(...)`, to avoid rewriting old backups.

## Export / import format

Exports are human-readable by design:

- `heroes` is an object keyed by `displayName`; entries have no `heroId`.
- Hero links are exported as `linkedHero` (display name).
- Team slots are exported as `hero` (display name).
- `pets` is an object keyed by pet name; entries have no `petId`.
- A team's assigned pet is exported as `pet` (pet name).
- No hero or pet IDs appear anywhere in the exported JSON.

Import accepts both formats:

- Legacy backups keyed by hero ID (`legacyExportDataSchema`) are tried first and imported as-is.
- Readable exports (`exportDataSchema`) resolve display names to IDs via `heroCatalogByName` / `petByName`; unknown names throw.
- Readable exports from before pets existed omit `pets` and team `pet`; both are optional on import and default to an empty pets record.
- `backup/` contains real legacy backups; compatibility with them must be preserved.

When adding new references (e.g. a new hero link field), follow this dual-format pattern and extend `src/features/persistence/importExport.test.ts` with a legacy case.

## i18n

- `src/i18n/locales/en.ts` is the source of truth and exports `TranslationSchema`; `es.ts` must satisfy it.
- `locales.test.ts` enforces key parity and non-empty leaves. Add every key to both files.
- Game terms stay in English in Spanish text: ascension names, SI, furniture, engraving, gear, etc.

## Hero catalogs and game data

- `src/data/heroes.json` and `src/data/hero-classes.json` are generated by `npm run sync:heroes` / `npm run sync:hero-classes`; do not edit them manually.
- In `heroes.json`, `class` is the hero type (Warrior/Ranger/Mage). The real class (Warrior/Tank/Ranger/Mage/Support) comes from `hero-classes.json`; use `entry.type` for type-based logic (e.g. gear artwork) and `entry.class` for class restrictions (artifacts, collections).
- Display names are unique across the 255 heroes.
- Artifact and collection catalogs are maintained in code under `src/features/artifacts/` and `src/features/collections/`.
- The pet/beast catalog is maintained in `src/features/pets/pets.ts` (30 pets). Max buff per tier: Rare 6, Elite 12, Fabled 18; beast level is the sum of the three buffs. Training levels 0–3 unlock at beast levels 3/9/15 and only Elite/Fabled pets have it. `getPetResonanceDeficit` caps the resonance target per tier (18/36/54) and `PET_MAX_RESONANCE` is 54.
- Team faction bonuses are computed in `src/features/teams/factionBonus.ts` from the actual hero factions: 3 → +10% ATK/HP, 3+2 → +15/+15, 4 → +15/20, 5 → +25/25. Celestials are wildcards for regular factions (not for the Hypogean ladder), Hypogeans stack their own bonus ladder, Draconis grant +2% ATK/HP each, and Dimensional heroes do not count.
- Official artwork is loaded from `afk.global` / `afk-mine` CDNs at runtime (pet art: `/images/afk-arena/game/beast/{id}.webp`).

## Testing

- Tests are colocated (`*.test.ts(x)`) and use Vitest + Testing Library with jsdom.
- Store tests must reset persisted state between cases.
- Persistence tests must cover a full round-trip and legacy import paths for any new field.
- Prefer accessible queries (`getByRole`, `getByLabelText`) so tests match real usage.

## Keeping this file current

Update this guide when a convention changes (for example, the export format or persistence version).
