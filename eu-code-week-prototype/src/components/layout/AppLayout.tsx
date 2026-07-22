import { Link, NavLink, Outlet } from 'react-router-dom'
import { appRoutes } from '../../app/routes'

const navItems = [
  { to: appRoutes.home, label: 'Explore activities' },
  { to: appRoutes.createActivity, label: 'Organiser mode' },
  { to: appRoutes.profile, label: 'My profile' },
]

export function AppLayout() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <div className="eu-top-strip" role="note" aria-label="Prototype information">
        <div className="container eu-top-strip__inner">
          <span>Interactive concept prototype for demonstration purposes</span>
          <span className="eu-top-strip__tag">Prototype</span>
        </div>
      </div>

      <header className="site-header">
        <div className="container site-header__inner">
          <Link className="brand" to={appRoutes.home} aria-label="EU Code Week prototype home">
            <img
              src="/images/codeweek-logo-icon.svg"
              alt="EU Code Week"
              className="brand__logo"
            />
            <div className="brand__text">
              <span>Interactive Concept Prototype</span>
            </div>
          </Link>

          <nav aria-label="Main navigation" className="main-nav-wrap">
            <ul className="main-nav">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => (isActive ? 'is-active' : undefined)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <button type="button" className="header-cta">
              Accessibility notes
            </button>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <p>Interactive concept prototype — demonstration data only.</p>
          <img src="/images/codeweek-footer-logo.svg" alt="EU Code Week" />
        </div>
      </footer>
    </div>
  )
}
