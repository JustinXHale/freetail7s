import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/auth-context'
import { useEvent, useOfflineCacheFlag } from '../../hooks/useTournament'
import { isAdmin } from '../../types/models'
import logo from '../../assets/logos/ft7s-full.png'
import { TOURNAMENT_CONTACT } from '../../data/tournamentRules'
import { PhotoViewerProvider } from '../media/PhotoLightbox'
import './PublicLayout.css'
import './JumpLinks.css'

const ABOUT_LINKS = [
  { to: '/about', label: 'History' },
  { to: '/sponsors', label: 'Sponsors' },
  { to: '/faq', label: 'FAQ' },
]

const TOURNAMENT_LINKS = [
  { to: '/visit', label: 'Facility' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/brackets', label: 'Teams & brackets' },
  { to: '/teams/rules', label: 'Tournament rules' },
]

export function PublicLayout() {
  const [open, setOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [tournamentOpen, setTournamentOpen] = useState(false)
  const aboutRef = useRef<HTMLLIElement>(null)
  const tournamentRef = useRef<HTMLLIElement>(null)
  const { role, user } = useAuth()
  const event = useEvent()
  const { isStale } = useOfflineCacheFlag()
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
    setAboutOpen(false)
    setTournamentOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!aboutRef.current?.contains(e.target as Node)) {
        setAboutOpen(false)
      }
      if (!tournamentRef.current?.contains(e.target as Node)) {
        setTournamentOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setAboutOpen(false)
        setTournamentOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const aboutActive = ABOUT_LINKS.some((l) => location.pathname === l.to)
  const tournamentActive =
    location.pathname === '/brackets' ||
    location.pathname.startsWith('/teams') ||
    TOURNAMENT_LINKS.some((l) => location.pathname === l.to)

  return (
    <PhotoViewerProvider>
      <div className="public-shell">
        {event.emergencyBanner ? (
          <div className="emergency-banner" role="status">
            {event.emergencyBanner}
          </div>
        ) : null}
        {isStale ? (
          <div className="stale-banner" role="status">
            Showing cached information — reconnect for the latest updates.
          </div>
        ) : null}
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="container site-header__inner">
            <div className="site-header__brand">
              <Link to="/" className="site-logo" onClick={() => setOpen(false)}>
                <img
                  src={logo}
                  alt="Freetail 7s Rugby Tournament"
                  width={140}
                  height={108}
                />
              </Link>
              <span className="site-header__x" aria-hidden="true">
                ×
              </span>
              <a
                href="https://www.legacyecowear.com"
                className="site-sponsor"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="site-sponsor__label">Title sponsor</span>
                <img
                  src="/sponsors/LegacyEcowearLongLogo.svg"
                  alt="Legacy Ecowear — title sponsor"
                  width={480}
                  height={114}
                />
              </a>
            </div>
            <button
              className="nav-toggle"
              aria-expanded={open}
              aria-controls="site-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Menu</span>
              <span />
              <span />
              <span />
            </button>
            <nav id="site-nav" className={`site-nav ${open ? 'is-open' : ''}`}>
              <ul className="site-nav__list">
                <li
                  className={`nav-dropdown ${aboutOpen ? 'is-open' : ''}`}
                  ref={aboutRef}
                >
                  <span className="nav-dropdown__label">About Freetail 7s</span>
                  <button
                    type="button"
                    className={`nav-dropdown__trigger ${aboutActive ? 'is-active' : ''}`}
                    aria-expanded={aboutOpen}
                    aria-haspopup="true"
                    onClick={() => setAboutOpen((v) => !v)}
                  >
                    About Freetail 7s
                  </button>
                  <ul className="nav-dropdown__menu">
                    {ABOUT_LINKS.map((item) => (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          onClick={() => {
                            setAboutOpen(false)
                            setOpen(false)
                          }}
                          className={({ isActive }) =>
                            isActive ? 'is-active' : undefined
                          }
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
                <li
                  className={`nav-dropdown ${tournamentOpen ? 'is-open' : ''}`}
                  ref={tournamentRef}
                >
                  <span className="nav-dropdown__label">
                    2027 Tournament Info
                  </span>
                  <button
                    type="button"
                    className={`nav-dropdown__trigger ${tournamentActive ? 'is-active' : ''}`}
                    aria-expanded={tournamentOpen}
                    aria-haspopup="true"
                    onClick={() => setTournamentOpen((v) => !v)}
                  >
                    2027 Tournament Info
                  </button>
                  <ul className="nav-dropdown__menu">
                    {TOURNAMENT_LINKS.map((item) => (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          onClick={() => {
                            setTournamentOpen(false)
                            setOpen(false)
                          }}
                          className={({ isActive }) =>
                            isActive ? 'is-active' : undefined
                          }
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
              <div className="site-nav__actions">
                <Link
                  className="apply-chip"
                  to="/apply"
                  onClick={() => setOpen(false)}
                >
                  Apply
                </Link>
              {isAdmin(role) ? (
                <Link to="/admin" onClick={() => setOpen(false)}>
                  Admin
                </Link>
              ) : user ? (
                <Link to="/login" onClick={() => setOpen(false)}>
                  Account
                </Link>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
              )}
              </div>
            </nav>
          </div>
        </header>
        <main id="main" key={location.pathname} className="page-enter">
          <Outlet />
        </main>
        <footer className="site-footer">
          <div className="container site-footer__grid">
            <div>
              <p className="footer-brand">Freetail 7s</p>
              <p>January 1–3, 2027 · Huns Rugby Ranch · Austin, Texas</p>
              <p>Title sponsor: Legacy Ecowear</p>
              <p>
                <a href={`mailto:${TOURNAMENT_CONTACT.email}`}>
                  {TOURNAMENT_CONTACT.email}
                </a>
              </p>
            </div>
            <div>
              <p className="footer-heading">Navigate</p>
              <ul>
                <li>
                  <Link to="/about">History</Link>
                </li>
                <li>
                  <Link to="/sponsors">Sponsors</Link>
                </li>
                <li>
                  <Link to="/faq">FAQ</Link>
                </li>
                <li>
                  <Link to="/visit">Facility</Link>
                </li>
                <li>
                  <Link to="/schedule">Schedule</Link>
                </li>
                <li>
                  <Link to="/brackets">Teams &amp; brackets</Link>
                </li>
                <li>
                  <Link to="/teams/rules">Tournament rules</Link>
                </li>
                <li>
                  <Link to="/apply">Apply</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="footer-heading">Legal</p>
              <ul>
                <li>
                  <Link to="/privacy">Privacy</Link>
                </li>
                <li>
                  <Link to="/terms">Terms</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="container footer-copy">
            <p>© {new Date().getFullYear()} Freetail 7s. The bats fly again.</p>
          </div>
        </footer>
      </div>
    </PhotoViewerProvider>
  )
}
