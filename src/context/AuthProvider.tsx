import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../lib/firebase'
import {
  authErrorMessage,
  completeRedirectSignIn,
  signInWithApplePopup,
  signInWithGooglePopup,
} from '../lib/authSignIn'
import { AuthContext, type OnboardingInput } from './auth-context'
import {
  splitDisplayName,
  type SelfServeRole,
  type UserDoc,
  type UserRole,
} from '../types/models'

const DEMO_PROFILE_KEY = 'freetail7s.demoAuthProfile'

export function isDemoAuthMode(): boolean {
  return !isFirebaseConfigured || import.meta.env.VITE_USE_DEMO === 'true'
}

function normalizeRole(raw: unknown): UserRole {
  if (raw === 'admin' || raw === 'owner' || raw === 'eventAdmin') return 'admin'
  if (raw === 'teamManager') return 'teamManager'
  if (raw === 'referee') return 'referee'
  if (raw === 'scorekeeper' || raw === 'contentEditor') return 'admin'
  return 'fan'
}

function profileFromFirestore(data: Record<string, unknown>, uid: string): UserDoc {
  const displayName = (data.displayName as string | null) ?? null
  const joined = [data.firstName, data.lastName].filter(Boolean).join(' ')
  const names = splitDisplayName(displayName || joined || null)
  return {
    uid,
    email: (data.email as string | null) ?? null,
    displayName,
    firstName: (data.firstName as string) || names.firstName,
    lastName: (data.lastName as string) || names.lastName,
    photoURL: (data.photoURL as string | null) ?? null,
    role: normalizeRole(data.role),
    onboardingComplete: Boolean(data.onboardingComplete),
    teamId: (data.teamId as string | undefined) || undefined,
    createdAt: (data.createdAt as string) || new Date().toISOString(),
    updatedAt: (data.updatedAt as string) || new Date().toISOString(),
  }
}

async function ensureUserProfile(user: User): Promise<UserDoc> {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    return profileFromFirestore(snap.data() as Record<string, unknown>, user.uid)
  }

  const names = splitDisplayName(user.displayName)
  const profile: UserDoc = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    firstName: names.firstName,
    lastName: names.lastName,
    photoURL: user.photoURL,
    role: 'fan',
    onboardingComplete: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  await setDoc(ref, {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return profile
}

function readDemoProfile(): UserDoc | null {
  try {
    const raw = localStorage.getItem(DEMO_PROFILE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as UserDoc
  } catch {
    return null
  }
}

function writeDemoProfile(profile: UserDoc | null) {
  if (!profile) {
    localStorage.removeItem(DEMO_PROFILE_KEY)
    return
  }
  localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(profile))
}

function makeDemoUser(profile: UserDoc): User {
  return {
    uid: profile.uid,
    email: profile.email,
    displayName:
      profile.displayName ||
      [profile.firstName, profile.lastName].filter(Boolean).join(' ') ||
      null,
    photoURL: profile.photoURL,
  } as User
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const demo = isDemoAuthMode()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserDoc | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (demo) {
      const existing = readDemoProfile()
      if (existing) {
        setProfile(existing)
        setUser(makeDemoUser(existing))
      }
      setLoading(false)
      return
    }

    let cancelled = false

    // Finish mobile redirect sign-in before relying on auth state alone.
    void completeRedirectSignIn().catch((err) => {
      console.error(err)
      if (!cancelled) {
        setAuthError(authErrorMessage('Google', err))
      }
    })

    const unsub = onAuthStateChanged(auth, async (next) => {
      setLoading(true)
      try {
        if (!next) {
          if (!cancelled) {
            setUser(null)
            setProfile(null)
          }
          return
        }
        const nextProfile = await ensureUserProfile(next)
        if (!cancelled) {
          setUser(next)
          setProfile(nextProfile)
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) {
          setAuthError('Could not load your account. Try signing in again.')
          setUser(null)
          setProfile(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })

    return () => {
      cancelled = true
      unsub()
    }
  }, [demo])

  const signInDemo = useCallback(async (provider: 'google' | 'apple') => {
    setAuthError(null)
    const existing = readDemoProfile()
    if (existing) {
      setProfile(existing)
      setUser(makeDemoUser(existing))
      return makeDemoUser(existing)
    }
    const names =
      provider === 'apple'
        ? { firstName: 'Alex', lastName: 'Apple' }
        : { firstName: 'Jamie', lastName: 'Google' }
    const next: UserDoc = {
      uid: `demo-${provider}-user`,
      email: `${provider}.demo@freetail7s.com`,
      displayName: `${names.firstName} ${names.lastName}`,
      firstName: names.firstName,
      lastName: names.lastName,
      photoURL: null,
      role: 'fan',
      onboardingComplete: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    writeDemoProfile(next)
    setProfile(next)
    const demoUser = makeDemoUser(next)
    setUser(demoUser)
    return demoUser
  }, [])

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null)
    if (demo) return signInDemo('google')
    try {
      return await signInWithGooglePopup()
    } catch (err) {
      console.error(err)
      const message = authErrorMessage('Google', err)
      setAuthError(message)
      throw err
    }
  }, [demo, signInDemo])

  const signInWithApple = useCallback(async () => {
    setAuthError(null)
    if (demo) return signInDemo('apple')
    try {
      return await signInWithApplePopup()
    } catch (err) {
      console.error(err)
      const message = authErrorMessage('Apple', err)
      setAuthError(message)
      throw err
    }
  }, [demo, signInDemo])

  const completeOnboarding = useCallback(
    async (input: OnboardingInput) => {
      if (!user || !profile) {
        throw new Error('Sign in before completing onboarding.')
      }
      const role: SelfServeRole = input.role
      const firstName = input.firstName.trim()
      const lastName = input.lastName.trim()
      if (!firstName || !lastName) {
        throw new Error('First and last name are required.')
      }
      if (!['fan', 'teamManager', 'referee'].includes(role)) {
        throw new Error('Invalid role.')
      }

      const next: UserDoc = {
        ...profile,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        role,
        onboardingComplete: true,
        updatedAt: new Date().toISOString(),
      }

      if (demo) {
        writeDemoProfile(next)
        setProfile(next)
        setUser(makeDemoUser(next))
        return
      }

      const ref = doc(db, 'users', user.uid)
      await updateDoc(ref, {
        firstName,
        lastName,
        displayName: next.displayName,
        role,
        onboardingComplete: true,
        updatedAt: serverTimestamp(),
      })
      setProfile(next)
    },
    [user, profile, demo],
  )

  const signOut = useCallback(async () => {
    setAuthError(null)
    if (demo) {
      writeDemoProfile(null)
      setUser(null)
      setProfile(null)
      return
    }
    await firebaseSignOut(auth)
  }, [demo])

  const clearAuthError = useCallback(() => setAuthError(null), [])

  const role: UserRole = profile?.role ?? 'fan'
  const needsOnboarding = Boolean(user && profile && !profile.onboardingComplete)

  const value = useMemo(
    () => ({
      user,
      profile,
      role,
      loading,
      needsOnboarding,
      isDemoAuth: demo,
      authError,
      signInWithGoogle,
      signInWithApple,
      completeOnboarding,
      clearAuthError,
      signOut,
    }),
    [
      user,
      profile,
      role,
      loading,
      needsOnboarding,
      demo,
      authError,
      signInWithGoogle,
      signInWithApple,
      completeOnboarding,
      clearAuthError,
      signOut,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
