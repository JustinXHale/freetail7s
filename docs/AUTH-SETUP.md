# Auth setup (Google + Apple)

Freetail 7s uses Firebase Authentication with the same battle-tested pattern as MatchReadyTX: **popup-first**, redirect only if a popup is truly blocked on mobile, and `getRedirectResult` on boot. Profile and role live in Firestore `users/{uid}`.

## Google (wired for project `freetail7s`)

Already done locally:

1. Firebase CLI pointed at `freetail7s`
2. Web app SDK config written to **`.env.local`** (gitignored)
3. Cloud Firestore created + security rules deployed

### Verify in Console

1. [Authentication → Sign-in method](https://console.firebase.google.com/project/freetail7s/authentication/providers) — Google enabled
2. [Authentication → Settings → Authorized domains](https://console.firebase.google.com/project/freetail7s/authentication/settings) — include `localhost` (default) and your production domain when you deploy
3. Restart the Vite dev server after creating/changing `.env.local` (`npm run dev`)

### Auth domain

Set `VITE_FIREBASE_AUTH_DOMAIN` to your **Hosting host** (e.g. `freetail7s.web.app`) in production builds. On `localhost` the app automatically uses `{projectId}.firebaseapp.com` so the Auth helper storage works. See [Firebase redirect best practices](https://firebase.google.com/docs/auth/web/redirect-best-practices).

### PWA note

The service worker must not intercept Firebase Auth helper URLs (`/__/auth/...`). `vite.config.ts` sets `navigateFallbackDenylist: [/^\/__\//]` for this.

### Smoke test

1. Open `/login`
2. You should **not** see “Demo mode”
3. Official **Continue with Google** / **Sign in with Apple** buttons → popup → then `/onboarding`
4. In [Firestore → users](https://console.firebase.google.com/project/freetail7s/firestore) you should see `users/{uid}`

### Promote yourself to admin

After onboarding, in Firestore set `users/{yourUid}.role` to `admin`.

## Enable providers

1. Firebase Console → Authentication → Sign-in method
2. Enable **Google**
3. Enable **Apple** (optional for later)

### Apple requirements

- Apple Developer account
- Services ID (e.g. `com.freetail7s.web`)
- Sign in with Apple key (.p8)
- Configure Services ID return URL from Firebase Apple provider panel
- Add the Services ID, Team ID, Key ID, and private key in Firebase

Never commit `.p8` files.

## Sign-in and onboarding flow

1. User taps **Continue with Google** or **Sign in with Apple** on `/login`
2. Auth creates or loads `users/{uid}` with `role: fan`, `onboardingComplete: false`
3. `/onboarding` asks for first name, last name (prefilled from the provider when possible), and a self-serve role
4. Self-serve roles: **fan**, **team manager**, **referee** — **admin cannot be chosen**
5. Every signed-in account keeps fan permissions regardless of primary role
6. Form routes (`/apply/team`, `/apply/referee`) require a signed-in, onboarded account; `/apply` is public

## Roles

| Role | How assigned | Access |
|------|--------------|--------|
| admin | Organizers only (`setUserRole` or Firestore) | Full admin |
| teamManager | Onboarding (or admin) | Team portal, applications, athlete status |
| referee | Onboarding (or admin) | Referee tools (coming) + fan access |
| fan | Default / onboarding | Fan contests, browsing, updates |

## Local demo

Without Firebase web config (or with `VITE_USE_DEMO=true`), Google/Apple buttons create a **local demo session**. With `.env.local` filled, real Firebase Auth is used.
