# Astral Codex

Bilingual roster and team tracker for **AFK Arena Classic**. Record the heroes you own, their ascension and investments, and save formations by mode. All data stays in your browser.

## Features

- 255-hero AFK Arena Classic catalog generated from the community `afk-mine` CDN.
- Roster with ascension, level, Resonating Crystal, Signature Item, Furniture, Engraving, gear and notes.
- Search and filters by faction, class, ascension and role.
- Saved teams with a 2-front, 3-back formation, mode and notes.
- Versioned JSON export and validated import.
- English and Spanish interface, with game terms kept in English.
- Responsive dark “Astral Codex” design with framed hero icons.

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, Zod, i18next, Radix UI and Vitest.

## Development

```bash
npm install
npm run dev
```

## Scripts

| Command               | Description                                     |
| --------------------- | ----------------------------------------------- |
| `npm run dev`         | Start the Vite dev server.                      |
| `npm run build`       | Typecheck and build for production.             |
| `npm run preview`     | Preview the production build.                   |
| `npm run typecheck`   | Run `tsc -b`.                                   |
| `npm run lint`        | Run Oxlint.                                     |
| `npm run test`        | Run Vitest once.                                |
| `npm run test:watch`  | Run Vitest in watch mode.                       |
| `npm run sync:heroes` | Regenerate `src/data/heroes.json` from the CDN. |
| `npm run format`      | Format with Prettier.                           |

## Data

The catalog is generated from `https://raw.githubusercontent.com/afk-mine/cdn/main/unit.json` and stored in `src/data/heroes.json`. Hero icons are loaded from the `afk-mine` CDN at runtime. This is a fan-made project, not affiliated with or endorsed by Lilith Games.

## Deployment

### GitHub Pages

`.github/workflows/deploy.yml` typechecks, lints, tests and builds the app, then deploys `dist` to GitHub Pages. Enable Pages with **GitHub Actions** as the source. The workflow sets the Vite base path from the repository name automatically.

### Docker

```bash
docker compose up --build
```

Open `http://localhost:8080`. The image builds the static app and serves it with nginx. Override `VITE_BASE_PATH` at build time if the app is hosted under a subpath.

## Storage

- App data: `localStorage` key `afk-astral-codex:data`.
- Language preference: `localStorage` key `afk-astral-codex:lang`.
- Routing uses `HashRouter`, so static hosting needs no server rewrites.
