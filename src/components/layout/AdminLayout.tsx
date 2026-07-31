import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import { isAdmin } from '../../types/models'
import { Button } from '../ui/Button'
import './AdminLayout.css'

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/applications', label: 'Applications' },
  { to: '/admin/teams', label: 'Teams' },
  { to: '/admin/schedule', label: 'Schedule' },
  { to: '/admin/results', label: 'Results' },
  { to: '/admin/fan-mvp', label: 'Fan MVP' },
  { to: '/admin/announcements', label: 'Announcements' },
  { to: '/admin/content', label: 'Content' },
  { to: '/admin/sponsors', label: 'Sponsors' },
  { to: '/admin/operations', label: 'Operations' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/settings', label: 'Settings' },
]

export function AdminLayout() {
  const { user, role, loading, signOut } = useAuth()

  if (loading) {
    return <div className="admin-shell container section">Loading…</div>
  }

  // Demo mode: allow admin UI without Firebase auth for local build-out
  const demoBypass =
    !import.meta.env.VITE_FIREBASE_API_KEY ||
    import.meta.env.VITE_USE_DEMO === 'true'

  if (!demoBypass && (!user || !isAdmin(role))) {
    return <Navigate to="/login?next=/admin" replace />
  }

  return (
    <div className="admin-shell">
      <aside className="admin-nav">
        <p className="admin-nav__brand">Freetail Admin</p>
        <nav>
          <ul>
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="admin-nav__foot">
          <NavLink to="/">View site</NavLink>
          {user ? (
            <Button size="sm" variant="secondary" onClick={() => void signOut()}>
              Sign out
            </Button>
          ) : (
            <span style={{ fontSize: '0.8rem' }}>Demo admin mode</span>
          )}
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
