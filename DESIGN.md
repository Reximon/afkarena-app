# Design system

The Resonating Hall looks like a leather-bound codex lit by hearth light: near-black
leather, brass rules, parchment type and a single warm accent. It should read as an
AFK Arena companion, never as a generic SaaS dashboard.

All visual tokens and component classes live in `src/index.css` (Tailwind CSS v4,
CSS-first). Reuse these classes instead of inventing new colors or one-off panels.

## Typography

| Role    | Family                  | Usage                                               |
| ------- | ----------------------- | --------------------------------------------------- |
| Display | Poppins 500/600         | Page titles, panel titles, compact wordmarks        |
| Body    | Manrope Variable        | Paragraphs, descriptions, form content              |
| Label   | JetBrains Mono Variable | Eyebrows, stats, navigation, small uppercase labels |

Labels are uppercase with wide tracking (0.12–0.24em). Display type is sentence case;
only small labels are set in all caps.

## Palette

| Token                 | Value                       | Role                                |
| --------------------- | --------------------------- | ----------------------------------- |
| `--color-night`       | `#0c0705`                   | Page base                           |
| `--color-abyss`       | `#080403`                   | Inset wells, rails, recessed chrome |
| `--color-panel`       | `#1e110b`                   | Panel fill                          |
| `--color-dusk`        | `#332014`                   | Raised leather                      |
| `--color-wine`        | `#3b1218`                   | Curtain edges                       |
| `--color-gild`        | `#e2b96d`                   | Brass rules, borders, icons         |
| `--color-gild-bright` | `#f7dfa4`                   | Active text, highlights             |
| `--color-gild-deep`   | `#9a6b2a`                   | Pressed metal                       |
| `--color-arcane`      | `#78c8b5`                   | Secondary / positive accents        |
| `--color-ember`       | `#e26a43`                   | Warm warning accent                 |
| `--color-parch`       | `#f3e4c4`                   | Primary text                        |
| `--color-muted`       | `#b29a78`                   | Secondary text                      |
| `--color-line`        | `rgba(226, 185, 109, 0.22)` | Default border                      |

Surfaces: `codex-panel`, `codex-panel-soft`, `dialog-frame`, `hero-stage`,
`faction-scene`, `picker-sheet`, `formation-slot`, `portrait-frame`, `game-medallion`,
`stat-medal`.
Controls: `btn-gild`, `btn-leather`, `btn-ghost`, `btn-danger`, `game-field`,
`game-tab`, `detail-action`, `icon-action`, badges `badge-gold|cyan|rose|muted|outline`.

## Header and navigation

The header is a single centered navigation rail welded to the top edge of the viewport:
square at the top with concave shoulders tying it to the browser edge, half-pill rounded
at the bottom (24px, half its height), painted in one solid dark color with a soft
shadow below the whole silhouette, so it reads as browser chrome. No logo and no
monogram; the rail is the identity. The app name still appears in the document title,
the mobile drawer heading and the footer.

```
┌──────────────────────────────────────────────────────────────────────┐
│                ┌──────────────────────────────────┐    ┌────────┐    │
│                │ DASHBOARD ROSTER TEAMS ...       │    │ EN  ES │    │
│                ╰──────────────────────────────────╯    └────────┘    │
```

Inspired by browser chrome: the rail is flush with the top edge, the tabs are mono
uppercase with compact actions on the right, and the current tab is marked by a glowing
brass line under its label. The surface carries no border; separation comes from the
solid fill and a two-layer drop shadow under the bar and its shoulders.

### Anatomy and sizes

- Header: `sticky top-0 z-40`, max width 1440px; 64px tall on mobile, the rail height
  on desktop.
- Desktop layout: `lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-start`. The rail
  occupies the center column, starts at `top: 0` and stays optically centered; the
  third column holds the controls, top-aligned with the rail.
- Rail (`nav-rail`): 48px tall, 4px padding, no background of its own. The `nav-surface`
  layer behind it is one solid silhouette (`#140b07`): square top with 16px concave
  shoulders and 24px half-pill rounded bottom corners, plus a two-layer `drop-shadow`
  that follows the shape (shoulders included). Shoulders use the same solid fill and
  overlap the bar by 1px so no hairline can appear at the join. No border: the seams
  and the brass outline were removed on purpose. The top edge itself stays straight.
- Tab (`nav-tab`): full rail height, 1.1rem horizontal padding, 6px radius, JetBrains
  Mono 11px/500, 0.12em tracking, uppercase, `muted` text.
- Hover: text turns `parch` and a 1px `arcane` line fades in under the label (same slot
  as the active line, no fill, no glow).
- Active (`aria-current="page"`): `gild-bright` text plus a 2px brass line under the
  label (soft-edged gradient with a faint glow). No plate, no gem, no fill.

### Right-hand controls

- Language toggle: 36px tall segmented control (`border-gild/20`, `bg-abyss/60`,
  `p-0.5`); each button is mono 11px uppercase; the pressed option gets `bg-gild/10`
  and `gild-bright`.
- Mobile menu: 36px square, `rounded-md`, `border-gild/20`, transparent fill; it
  appears below `lg`.

### Responsive behavior

- `>= 1024px`: centered rail with all destinations visible. Both English and Spanish
  labels fit at 1024px (the longest is `Equipamiento`).
- `< 1024px`: the rail is hidden. The header shows the current page name in Poppins
  uppercase on the left, then the language toggle and menu button on the right.
- Mobile drawer: right-hand panel `min(19rem, 86vw)`, app name and game subtitle at the
  top, then the same destinations as a vertical `nav-row` list inside a rounded
  `abyss/60` well. The active row uses `gild-bright` text plus a 2px brass inset bar on
  the left. Rows are full-width, mono 11px uppercase, with no icons or diamonds.

### Accessibility

- The desktop and drawer lists are `nav` landmarks; the desktop one is labelled with
  the app name, the drawer with the menu label.
- Active state comes from `NavLink` (`aria-current="page"`), so CSS never guesses.
- Language buttons keep `aria-pressed`; focus uses the global 2px gild outline.
- Do not remove the visible focus ring or the menu button's accessible name.

## Hero faction scenes

Every hero preview sits in its own hall, framed by that faction's official artwork
the way the game presents a hero.

- `FactionScene` (`src/components/roster/hero-detail/FactionScene.tsx`) renders an
  `aria-hidden` layer with `class="faction-scene"` and `data-faction="<Faction>"`.
  It imports the eight WebP paintings from `src/assets/factions/` (one per faction)
  and exposes the active one as the `--faction-art` custom property, so Vite
  fingerprints the file and respects `base`.
- Used in two places: behind the whole `HeroDetailDialog`, and in the centered
  column of `HeroPortraitStage` in the add/edit screen (with the
  `faction-scene--stage` modifier). Both wrap it in a `relative overflow-hidden`
  container so it never leaks past the rounded frame.
- `::before` paints the artwork with `cover`, centered at 44%, and a per-faction
  `brightness(0.82–1.02)`/`saturate(0.92)` filter that pulls the painting into the
  app's dark palette.
- `::after` is the legibility scrim: a 52/34% vertical shade, a top-center canopy
  behind the header, a 55% edge vignette and a faction-colored floor glow. The
  stage modifier lightens the scrim (24/8%), zooms the art to 150% and shifts it to
  22% so the room's focal point shows above the portrait.
- Every faction color comes from `FACTION_COLORS` in `src/features/heroes/heroCatalog.ts`.
  Keep lettering gold/parch; the painting is the only faction signal.
- `FactionIcon` (`src/components/heroes/FactionIcon.tsx`) renders the official 30px
  faction emblem from `src/assets/factions/icons/`. `ClassIcon` and `RoleIcon` do the
  same for the 64px class/role emblems in `src/assets/classes/` and `src/assets/roles/`.
  The roster filters faction, class and role with `IconFilterGroup`: three groups of
  emblems, each preceded by an `All …` pill, sitting on a single scrollable line
  separated by brass hairlines. The active state is brass (`aria-pressed`), never a
  faction-colored ring.
- The scene is decoration only: it must stay `pointer-events-none`, `aria-hidden`
  and darker than the foreground. Never put body copy or form fields directly on
  bare art; the header label over the stage carries a 1px black text shadow.

## Motion

Entrances and hover lifts stay under 220ms with `cubic-bezier(0.16, 1, 0.3, 1)`.
Navigation only animates color and background. `prefers-reduced-motion` disables
dialog, drawer and card motion globally.

## Rules of thumb

- One brass accent per component. Gold marks structure; it is not a background wash.
- Hairlines and inset rings instead of drop shadows for small chrome.
- Mono for data and navigation, Poppins for hierarchy, Manrope for reading.
- Prefer existing classes; extend `src/index.css` in the components layer when a new
  pattern is genuinely needed, then add it to this document and to `AGENTS.md`.
