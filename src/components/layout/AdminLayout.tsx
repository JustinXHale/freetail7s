import { useEffect, useId, useState } from 'react'
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import { isAdmin } from '../../types/models'
import { Button } from '../ui/Button'
import './AdminLayout.css'

type NavItem = { to: string; label: string; end?: boolean }

type NavGroup = { label: string; items: NavItem[] }

/** Condensed mobile-first admin IA — hubs instead of one link per tool. */
const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ to: '/admin', label: 'Dashboard', end: true }],
  },
  {
    label: 'Intake',
    items: [
      { to: '/admin/applications', label: 'Applications' },
      { to: '/admin/teams', label: 'Teams' },
    ],
  },
  {
    label: 'Tournament',
    items: [{ to: '/admin/event', label: 'Schedule & results' }],
  },
  {
    label: 'Site',
    items: [{ to: '/admin/site', label: 'Content & sponsors' }],
  },
  {
    label: 'Admin',
    items: [{ to: '/admin/settings', label: 'Settings' }],
  },
]

export function AdminLayout() {
  const { user, role, loading, needsOnboarding, signOut } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  if (loading) {
    return <div className="admin-shell container section">Loading…</div>
  }

  // Demo mode: allow admin UI without Firebase auth for local build-out
  const demoBypass =
    !import.meta.env.VITE_FIREBASE_API_KEY ||
    import.meta.env.VITE_USE_DEMO === 'true'

  if (!demoBypass && user && needsOnboarding) {
    return <Navigate to="/onboarding" replace />
  }

  // Signed-in non-admins must not keep next=/admin (causes a redirect loop /
  // blank dark screen). Send them home instead.
  if (!demoBypass && user && !isAdmin(role)) {
    return <Navigate to="/" replace />
  }

  if (!demoBypass && !user) {
    return <Navigate to="/login?next=/admin" replace />
  }

  const nav = (
    <>
      <p className="admin-nav__brand">Freetail Admin</p>
      <nav id={menuId} className="admin-nav__groups" aria-label="Admin">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="admin-nav__group">
            <p className="admin-nav__group-label">{group.label}</p>
            <ul>
              {group.items.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.end}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="admin-nav__foot">
        <NavLink to="/">View site</NavLink>
        {user ? (
          <Button size="sm" variant="secondary" onClick={() => void signOut()}>
            Sign out
          </Button>
        ) : (
          <span className="admin-nav__demo">Demo admin mode</span>
        )}
      </div>
    </>
  )

  return (
    <div className={`admin-shell${menuOpen ? ' admin-shell--menu-open' : ''}`}>
      <header className="admin-topbar">
        <p className="admin-topbar__brand">Freetail Admin</p>
        <button
          type="button"
          className="admin-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="visually-hidden">
            {menuOpen ? 'Close menu' : 'Open menu'}
          </span>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </header>

      {menuOpen ? (
        <button
          type="button"
          className="admin-nav__scrim"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <aside className="admin-nav">{nav}</aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
