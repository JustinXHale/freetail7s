import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import { connectStorageEmulator, getStorage } from 'firebase/storage'

/**
 * Auth helper domain must match how we sign in (same pattern as MatchReadyTX):
 * - localhost → *.firebaseapp.com (Firebase helper storage works)
 * - Hosting (*.web.app / *.firebaseapp.com) → same host (avoids third-party storage blocks)
 * See https://firebase.google.com/docs/auth/web/redirect-best-practices
 */
function resolveAuthDomain(): string {
  const fromEnv = (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined)?.trim()
  const projectId = (
    import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined
  )?.trim()
  const fallback = projectId
    ? `${projectId}.firebaseapp.com`
    : 'freetail7s.firebaseapp.com'

  if (typeof window === 'undefined') return fromEnv || fallback

  const host = window.location.hostname
  if (host === 'localhost' || host === '127.0.0.1') {
    return projectId ? `${projectId}.firebaseapp.com` : fromEnv || fallback
  }
  if (host.endsWith('.web.app') || host.endsWith('.firebaseapp.com')) {
    return host
  }
  return fromEnv || host
}

const apiKey = (import.meta.env.VITE_FIREBASE_API_KEY as string | undefined)?.trim()
const projectId = (
  import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined
)?.trim()
const appId = (import.meta.env.VITE_FIREBASE_APP_ID as string | undefined)?.trim()

/** True when real Firebase web config is present. */
export const isFirebaseConfigured = Boolean(apiKey && projectId && appId)

const firebaseConfig = {
  apiKey: apiKey || 'demo-api-key',
  authDomain: resolveAuthDomain(),
  projectId: projectId || 'freetail7s',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'freetail7s.appspot.com',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: appId || '1:000000000000:web:demo',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)

const useEmulators = import.meta.env.VITE_USE_EMULATORS === 'true'

let emulatorsConnected = false

export function connectEmulatorsIfNeeded() {
  if (!useEmulators || emulatorsConnected) return
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
  connectStorageEmulator(storage, '127.0.0.1', 9199)
  connectFunctionsEmulator(functions, '127.0.0.1', 5001)
  emulatorsConnected = true
}

connectEmulatorsIfNeeded()
