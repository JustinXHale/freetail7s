import { createContext, useContext } from 'react'
import type { User } from 'firebase/auth'
import type { SelfServeRole, UserDoc, UserRole } from '../types/models'

export interface OnboardingInput {
  firstName: string
  lastName: string
  role: SelfServeRole
}

export interface AuthContextValue {
  user: User | null
  profile: UserDoc | null
  role: UserRole
  loading: boolean
  needsOnboarding: boolean
  isDemoAuth: boolean
  authError: string | null
  /** Returns null when a mobile redirect was started (page will navigate away). */
  signInWithGoogle: () => Promise<User | null>
  signInWithApple: () => Promise<User | null>
  completeOnboarding: (input: OnboardingInput) => Promise<void>
  clearAuthError: () => void
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
