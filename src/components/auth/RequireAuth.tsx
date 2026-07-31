import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading, needsOnboarding } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="container section">
        <p>Checking sign-in…</p>
      </div>
    )
  }

  const next = `${location.pathname}${location.search}`

  if (!user) {
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(next)}`}
        replace
        state={{ from: location }}
      />
    )
  }

  if (needsOnboarding) {
    return (
      <Navigate
        to={`/onboarding?next=${encodeURIComponent(next)}`}
        replace
      />
    )
  }

  return children
}
