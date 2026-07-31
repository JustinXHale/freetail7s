# Deploy notes

## GitHub

Repo: `justinxhale/freetail7s` (empty until first push).

### Secrets (Actions)

Already used by CI / Deploy:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN` — for production builds prefer `freetail7s.web.app` (Hosting host)
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID` (optional)

For Firebase deploy on `main` (MatchReadyTX pattern), also add:

```bash
firebase login:ci
```

Then set repository secret `FIREBASE_TOKEN` to the printed token.

### Workflows

| Workflow | When | What |
|----------|------|------|
| `.github/workflows/ci.yml` | PR + push to `main` | `npm ci`, functions build, web build |
| `.github/workflows/deploy.yml` | push to `main` + manual | same build, then `firebase deploy` hosting + rules + functions |

## Firebase project

1. Project id: `freetail7s`
2. Enable Auth (Google + Apple), Firestore, Storage, Functions, Hosting
3. Local: copy web app config into `.env.local` from `.env.example`
4. After first Hosting deploy, add `freetail7s.web.app` (and custom domain) to Auth authorized domains
5. Seed when ready: `npm run seed` (service account / emulators)

## Demo vs production data

Without `VITE_FIREBASE_API_KEY`, the client uses in-memory demo state. CI injects secrets so production builds talk to the real Firebase project.
