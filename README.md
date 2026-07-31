# Freetail 7s PWA

Official Progressive Web App for the **2027 Freetail 7s** rugby tournament (January 1–3, Austin, Texas).

## Stack

- React + TypeScript + Vite
- Firebase Auth (Google + Apple), Firestore, Storage, Cloud Functions, Hosting
- vite-plugin-pwa

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — without keys, demo mode runs
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Without Firebase config the app uses in-memory demo data; `/admin` is available for local UI work.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local Vite server |
| `npm run build` | Production build |
| `npm run preview` | Preview build |
| `npm run emulators` | Firebase emulators |
| `npm run seed` | Seed Firestore (emulators/prod) |
| `npm run deploy` | Build + Firebase deploy |

## Docs

- [Product requirements](docs/Freetail-7s-PWA-PRD-v1.md)
- [Visual experience brief](docs/Freetail-7s-Visual-Experience-Brief-v1.md)
- [Auth setup](docs/AUTH-SETUP.md)
- Design tokens: `.design/theme.md`

## Brand

Default logo: **`FT7s Full Logo.png`** (`src/assets/logos/ft7s-full.png`) — header, hero, and PWA icons.

White variants remain available for dark overlays when needed. Source files live in `img/freetailLogos/`.

Photo archive: curated images from `img/ft7sPhotos/` are served at `/photos/` and featured on the homepage. Full set also on [Facebook](https://www.facebook.com/freetail7s/photos).
