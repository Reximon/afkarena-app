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
`picker-sheet`, `formation-slot`, `portrait-frame`, `game-medallion`, `stat-medal`.
Controls: `btn-gild`, `btn-leather`, `btn-ghost`, `btn-danger`, `game-field`,
`game-tab`, `detail-action`, `icon-action`, badges `badge-gold|cyan|rose|muted|outline`.

## Header and navigation

The header is a single centered navigation rail on a near-black leather bar:
no logo and no monogram. The rail is the identity. The app name
still appears in the document title, the mobile drawer heading and the footer.

```
┌──────────────────────────────────────────────────────────────────────┐
│                  ┌──────────────────────────────────┐    ┌────────┐  │
│                  │ DASHBOARD ROSTER TEAMS ...       │    │ EN  ES │  │
│                  └──────────────────────────────────┘    └────────┘  │
├──────────────────────────────────────────────────────────────────────┤
```

Inspired by Koyeb's header: one soft segmented strip, mono uppercase tabs, compact
actions on the right and no rule or shadow fighting the content.

### Anatomy and sizes

- Header: `game-header sticky top-0 z-40 border-b border-gild/10`, inner height 64px
  (`h-16`), max width 1440px.
- Desktop layout: `lg:grid lg:grid-cols-[1fr_auto_1fr]`. The rail occupies the center
  column and stays optically centered on the page; the third column holds the controls.
- Rail (`nav-rail`): 48px tall (`h-12`), 4px padding, 8px radius, 1px brass border at
  12% opacity, `rgba(8, 4, 3, 0.55)` fill and a faint top inset highlight.
- Tab (`nav-tab`): full rail height, 1.1rem horizontal padding, 6px radius, JetBrains
  Mono 11px/500, 0.12em tracking, uppercase, `muted` text.
- Hover: text turns `parch` with a brass background at 7% opacity.
- Active (`aria-current="page"`): `gild-bright` text, a brass fill at 10% opacity and
  a 1px inset ring at 18% opacity. Never use an underline or a floating glow.

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
  `abyss/60` well. The active row uses the same gold fill and inset ring as `nav-tab`.
  Rows are full-width, mono 11px uppercase, with no icons or diamonds.

### Accessibility

- The desktop and drawer lists are `nav` landmarks; the desktop one is labelled with
  the app name, the drawer with the menu label.
- Active state comes from `NavLink` (`aria-current="page"`), so CSS never guesses.
- Language buttons keep `aria-pressed`; focus uses the global 2px gild outline.
- Do not remove the visible focus ring or the menu button's accessible name.

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
