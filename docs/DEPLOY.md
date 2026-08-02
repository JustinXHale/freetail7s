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
| `.github/workflows/deploy.yml` | push to `main` + manual | build with `VITE_*` secrets, deploy hosting + Firestore rules (required), then Cloud Functions (best-effort) |

Hosting/rules deploy first and **must** succeed. Cloud Functions deploy is attempted afterward with `continue-on-error` so Gen2 Cloud Run health-check / Eventarc failures do not mark the whole Deploy red or block the public site.

If Functions fail with `Container Healthcheck failed` / `PORT=8080`, open Cloud Run logs for one service (e.g. `setuserrole`) in `us-central1`. Common causes: cold-start crash, Eventarc/IAM still settling, or runtime issues. Re-run **Deploy** (Actions → workflow_dispatch) after fixing, or deploy functions locally: `firebase deploy --only functions`.

## Firebase project

1. Project id: `freetail7s`
2. Enable Auth (Google + Apple), Firestore, Storage, Functions, Hosting
3. Local: copy web app config into `.env.local` from `.env.example`
4. After first Hosting deploy, add `freetail7s.web.app` (and custom domain) to Auth authorized domains
5. Seed when ready: `npm run seed` (service account / emulators)

## Demo vs production data

Without `VITE_FIREBASE_API_KEY`, the client uses in-memory demo state. CI injects secrets so production builds talk to the real Firebase project.
