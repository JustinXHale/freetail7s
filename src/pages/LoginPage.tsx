import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, ButtonLink } from '../components/ui/Button'
import { Field, TextInput } from '../components/ui/Field'
import {
  AppleSignInButton,
  GoogleSignInButton,
} from '../components/auth/SocialSignInButtons'
import { useAuth } from '../context/auth-context'
import {
  SELF_SERVE_ROLE_HINTS,
  SELF_SERVE_ROLE_LABELS,
  SELF_SERVE_ROLES,
  safeNextPath,
  type SelfServeRole,
  type UserDoc,
  type UserRole,
} from '../types/models'
import { PAGE_PHOTOS } from '../data/photos'
import { PagePhotoBand } from '../components/media/PhotoLightbox'
import './AuthPages.css'

function AccountHub({
  email,
  profile,
  role,
  onSignOut,
}: {
  email: string | null
  profile: UserDoc
  role: UserRole
  onSignOut: () => void
}) {
  const { updateSelfServeRole } = useAuth()
  const canSelfServe = role !== 'admin'
  const [selected, setSelected] = useState<SelfServeRole>(
    canSelfServe && SELF_SERVE_ROLES.includes(role as SelfServeRole)
      ? (role as SelfServeRole)
      : 'fan',
  )
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSaveRole(e: FormEvent) {
    e.preventDefault()
    if (!canSelfServe) return
    setError(null)
    setMessage(null)
    setPending(true)
    try {
      await updateSelfServeRole(selected)
      setMessage(
        selected === 'teamManager'
          ? 'Role updated — you can use Apply and the team portal.'
          : selected === 'referee'
            ? 'Role updated — referee tools will use this account.'
            : 'Role updated — you still have full fan access.',
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update role.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="container section auth-page">
      <PagePhotoBand photo={PAGE_PHOTOS.login} />
      <h1>Your account</h1>
      <p>
        Signed in as{' '}
        <strong>
          {profile.firstName} {profile.lastName}
        </strong>{' '}
        ({email}) · role <strong>{SELF_SERVE_ROLE_LABELS[role as SelfServeRole] ?? role}</strong>
      </p>
      <p className="auth-page__fine">
        Fan access is included for every signed-in account. You can switch
        between fan, team manager, and referee if your needs change.
      </p>

      {canSelfServe ? (
        <form className="auth-page__form" onSubmit={(e) => void onSaveRole(e)}>
          <fieldset className="auth-page__roles">
            <legend>Change role</legend>
            {SELF_SERVE_ROLES.map((option) => (
              <label
                key={option}
                className={`auth-page__role ${selected === option ? 'is-selected' : ''}`}
              >
                <input
                  type="radio"
                  name="account-role"
                  value={option}
                  checked={selected === option}
                  onChange={() => {
                    setSelected(option)
                    setMessage(null)
                    setError(null)
                  }}
                />
                <span>
                  <strong>{SELF_SERVE_ROLE_LABELS[option]}</strong>
                  <small>{SELF_SERVE_ROLE_HINTS[option]}</small>
                </span>
              </label>
            ))}
          </fieldset>
          {error ? (
            <p className="auth-page__error" role="alert">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="auth-page__fine" role="status">
              {message}
            </p>
          ) : null}
          <div className="auth-page__actions">
            <Button
              type="submit"
              disabled={pending || selected === role}
            >
              {pending ? 'Saving…' : 'Save role'}
            </Button>
          </div>
        </form>
      ) : (
        <p className="auth-page__fine">
          Admin is assigned by organizers and is not changed here.
        </p>
      )}

      <div className="auth-page__actions">
        {role === 'admin' ? (
          <ButtonLink to="/admin">Open admin</ButtonLink>
        ) : null}
        {role === 'teamManager' ? (
          <ButtonLink to="/team-portal">Team portal</ButtonLink>
        ) : null}
        <ButtonLink to="/apply" variant="secondary">
          Apply
        </ButtonLink>
        <Button variant="ghost" onClick={onSignOut}>
          Sign out
        </Button>
      </div>
    </div>
  )
}

export function LoginPage() {
  const {
    user,
    profile,
    role,
    loading,
    needsOnboarding,
    isDemoAuth,
    authError,
    signInWithGoogle,
    signInWithApple,
    signOut,
    clearAuthError,
  } = useAuth()
  const [params] = useSearchParams()
  const next = params.get('next')
  const [pending, setPending] = useState<'google' | 'apple' | null>(null)

  if (!loading && user && needsOnboarding) {
    const q = next ? `?next=${encodeURIComponent(next)}` : ''
    return <Navigate to={`/onboarding${q}`} replace />
  }

  if (!loading && user && profile?.onboardingComplete) {
    // Deep-link after auth — otherwise show account hub
    if (next) {
      return <Navigate to={safeNextPath(next, role)} replace />
    }
  }

  if (!loading && user && profile?.onboardingComplete && !next) {
    return (
      <AccountHub
        email={user.email}
        profile={profile}
        role={role}
        onSignOut={() => void signOut()}
      />
    )
  }

  async function handleSignIn(provider: 'google' | 'apple') {
    clearAuthError()
    setPending(provider)
    try {
      const signedIn =
        provider === 'google'
          ? await signInWithGoogle()
          : await signInWithApple()
      // Redirect leaves the page; popup success keeps busy until Navigate.
      if (!signedIn) setPending(null)
    } catch {
      setPending(null)
    }
  }

  return (
    <div className="container section auth-page">
      <PagePhotoBand photo={PAGE_PHOTOS.login} />
      <h1>Sign in</h1>
      <p>
        Use Google or Apple to continue. Team applications, athlete forms, fan
        votes, and referee tools all start from the same account.
      </p>
      {isDemoAuth ? (
        <p className="auth-page__demo">
          Demo mode — sign-in is simulated locally until Firebase keys are set.
        </p>
      ) : null}
      {authError ? (
        <p className="auth-page__error" role="alert">
          {authError}
        </p>
      ) : null}
      {loading ? (
        <p>Checking session…</p>
      ) : (
        <div className="auth-page__providers" role="group" aria-label="Sign in">
          <GoogleSignInButton
            busy={pending === 'google'}
            disabled={pending !== null}
            onClick={() => void handleSignIn('google')}
          />
          <AppleSignInButton
            busy={pending === 'apple'}
            disabled={pending !== null}
            onClick={() => void handleSignIn('apple')}
          />
        </div>
      )}
      <p className="auth-page__fine">
        By continuing you agree to the{' '}
        <Link to="/terms">Terms</Link>, <Link to="/privacy">Privacy</Link>, and{' '}
        <Link to="/teams/rules">Tournament rules</Link> notices. Admin access is
        assigned by organizers — it is not available in role selection.
      </p>
      {user ? (
        <Button variant="ghost" onClick={() => void signOut()}>
          Sign out
        </Button>
      ) : null}
    </div>
  )
}

export function OnboardingPage() {
  const {
    user,
    profile,
    loading,
    needsOnboarding,
    completeOnboarding,
    signOut,
  } = useAuth()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const next = params.get('next')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState<SelfServeRole>('fan')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!profile) return
    setFirstName((prev) => prev || profile.firstName || '')
    setLastName((prev) => prev || profile.lastName || '')
  }, [profile])

  if (loading) {
    return (
      <div className="container section auth-page">
        <p>Loading…</p>
      </div>
    )
  }

  if (!user) {
    const q = next ? `?next=${encodeURIComponent(next)}` : ''
    return <Navigate to={`/login${q}`} replace />
  }

  if (!needsOnboarding && profile?.onboardingComplete) {
    return <Navigate to={safeNextPath(next, profile.role)} replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      await completeOnboarding({ firstName, lastName, role })
      navigate(safeNextPath(next, role as UserRole), { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save profile.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="container section auth-page">
      <h1>Welcome to Freetail 7s</h1>
      <p>
        Confirm your details. Email comes from your Google or Apple account.
        Everyone keeps fan access — pick the role that matches how you&apos;ll
        use the app.
      </p>

      <form className="auth-page__form" onSubmit={(e) => void onSubmit(e)}>
        <Field label="Email" htmlFor="email">
          <TextInput
            id="email"
            value={user.email ?? profile?.email ?? ''}
            readOnly
            disabled
          />
        </Field>
        <div className="auth-page__name-row">
          <Field label="First name" htmlFor="firstName">
            <TextInput
              id="firstName"
              name="firstName"
              required
              maxLength={60}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
            />
          </Field>
          <Field label="Last name" htmlFor="lastName">
            <TextInput
              id="lastName"
              name="lastName"
              required
              maxLength={60}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
            />
          </Field>
        </div>

        <fieldset className="auth-page__roles">
          <legend>I am joining as</legend>
          {SELF_SERVE_ROLES.map((option) => (
            <label
              key={option}
              className={`auth-page__role ${role === option ? 'is-selected' : ''}`}
            >
              <input
                type="radio"
                name="role"
                value={option}
                checked={role === option}
                onChange={() => setRole(option)}
              />
              <span>
                <strong>{SELF_SERVE_ROLE_LABELS[option]}</strong>
                <small>{SELF_SERVE_ROLE_HINTS[option]}</small>
              </span>
            </label>
          ))}
        </fieldset>

        <p className="auth-page__fine">
          Admin accounts are granted by organizers only.
        </p>

        {error ? (
          <p className="auth-page__error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="auth-page__actions">
          <Button type="submit" disabled={pending}>
            {pending ? 'Saving…' : 'Continue'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => void signOut()}
            disabled={pending}
          >
            Sign out
          </Button>
        </div>
      </form>
    </div>
  )
}
