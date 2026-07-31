/**
 * Firebase Auth sign-in — same battle-tested pattern as MatchReadyTX:
 * popup-first, redirect only when a popup is truly blocked on mobile,
 * plus getRedirectResult on boot.
 */
import {
  GoogleAuthProvider,
  OAuthProvider,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  type AuthProvider,
  type User,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from './firebase'

const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('profile')
googleProvider.addScope('email')

const appleProvider = new OAuthProvider('apple.com')
appleProvider.addScope('email')
appleProvider.addScope('name')

/** Rough mobile / iPad detection — used only for popup-blocked fallback. */
function isMobileClient(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return true
  return navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua)
}

function isPopupBlockedError(err: unknown): boolean {
  const code =
    err && typeof err === 'object' && 'code' in err
      ? String((err as { code: unknown }).code)
      : ''
  // Only true blocks — do NOT treat cancelled-popup-request as blocked.
  return (
    code === 'auth/popup-blocked' ||
    (err instanceof Error &&
      /popup/i.test(err.message) &&
      /blocked/i.test(err.message))
  )
}

/**
 * Prefer popup everywhere. Redirect loses sessionStorage state on many mobile
 * browsers ("missing initial state") — only use it when the popup is blocked
 * on a phone/tablet.
 */
async function signInWithProvider(
  provider: AuthProvider,
): Promise<User | null> {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase Auth is not configured. Check VITE_FIREBASE_* in .env.local.',
    )
  }
  try {
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (err) {
    if (isPopupBlockedError(err) && isMobileClient()) {
      await signInWithRedirect(auth, provider)
      return null
    }
    throw err
  }
}

export async function signInWithGooglePopup(): Promise<User | null> {
  return signInWithProvider(googleProvider)
}

export async function signInWithApplePopup(): Promise<User | null> {
  return signInWithProvider(appleProvider)
}

/** Complete a redirect-based sign-in (no-op when there was no redirect). */
export async function completeRedirectSignIn(): Promise<User | null> {
  if (!isFirebaseConfigured) return null
  const result = await getRedirectResult(auth)
  return result?.user ?? null
}

export function authErrorMessage(
  provider: 'Google' | 'Apple',
  err: unknown,
): string {
  const code =
    err && typeof err === 'object' && 'code' in err
      ? String((err as { code: unknown }).code)
      : ''
  const message =
    err instanceof Error ? err.message : `${provider} sign-in failed.`

  if (code === 'auth/operation-not-allowed' || message.includes('auth/operation-not-allowed')) {
    return `${provider} sign-in is not enabled yet. In Firebase Console → Authentication → Sign-in method, enable ${provider}, then try again.`
  }
  if (code === 'auth/popup-closed-by-user' || message.includes('auth/popup-closed-by-user')) {
    return 'Sign-in was cancelled.'
  }
  if (code === 'auth/popup-blocked' || message.includes('auth/popup-blocked')) {
    return 'Pop-up blocked. Allow pop-ups for this site, then try again.'
  }
  if (code === 'auth/unauthorized-domain' || message.includes('auth/unauthorized-domain')) {
    return 'This domain is not authorized for Firebase Auth. Add it under Authentication → Settings → Authorized domains.'
  }
  if (
    message.includes('invalid_client') ||
    message.includes('auth/invalid-credential')
  ) {
    return 'Apple sign-in is still finishing setup. Try Google, or re-save the Services ID in Apple Developer.'
  }
  return message
}
