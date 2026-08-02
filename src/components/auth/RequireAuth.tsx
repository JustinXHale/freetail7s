import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'

/** Local Vite only — never enabled in production builds */
export function isLocalFormPreview(search: string) {
  return (
    import.meta.env.DEV &&
    new URLSearchParams(search).get('preview') === '1'
  )
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading, needsOnboarding } = useAuth()
  const location = useLocation()
  const localPreview = isLocalFormPreview(location.search)

  if (loading && !localPreview) {
    return (
      <div className="container section">
        <p>Checking sign-in…</p>
      </div>
    )
  }

  const next = `${location.pathname}${location.search}`

  if (!user && !localPreview) {
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(next)}`}
        replace
        state={{ from: location }}
      />
    )
  }

  if (user && needsOnboarding && !localPreview) {
    return (
      <Navigate
        to={`/onboarding?next=${encodeURIComponent(next)}`}
        replace
      />
    )
  }

  if (localPreview && !user) {
    return (
      <>
        <div
          className="container section"
          style={{
            paddingBottom: 0,
            marginBottom: 0,
          }}
        >
          <p
            role="status"
            style={{
              margin: 0,
              padding: '0.75rem 1rem',
              borderLeft: '4px solid var(--color-brand-primary)',
              background: 'color-mix(in srgb, var(--color-brand-primary) 12%, transparent)',
              color: 'var(--color-text-secondary)',
              fontSize: '0.9rem',
            }}
          >
            Local form preview — sign-in is skipped in development only (
            <code>?preview=1</code>). Production still requires an account.
          </p>
        </div>
        {children}
      </>
    )
  }

  return children
}
