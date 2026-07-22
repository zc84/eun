import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { appRoutes } from '../../app/routes'
import { useAppStore } from '../../store/appStore'

const navItems = [
  { to: appRoutes.home, label: 'Explore activities' },
  { to: appRoutes.createActivity, label: 'Organiser mode' },
  { to: appRoutes.profile, label: 'My profile' },
]

export function AppLayout() {
  const { role, setRole, resetState, highContrast, toggleHighContrast } = useAppStore()
  const navigate = useNavigate()
  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const openNotesButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!isNotesOpen) {
      return
    }

    const buttonRef = openNotesButtonRef.current

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsNotesOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
      buttonRef?.focus()
    }
  }, [isNotesOpen])

  return (
    <div className={`app-shell ${highContrast ? 'high-contrast' : ''}`}>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <div className="eu-top-strip" role="note" aria-label="Platform information">
        <div className="container eu-top-strip__inner">
          <span>EU Code Week activity platform</span>
          <span className="eu-top-strip__tag">Code Week</span>
        </div>
      </div>

      <header className="site-header">
        <div className="container site-header__inner">
          <Link className="brand" to={appRoutes.home} aria-label="EU Code Week home">
            <img
              src="/images/codeweek-logo-icon.svg"
              alt="EU Code Week"
              className="brand__logo"
            />
            <div className="brand__text">
              <span>European Schoolnet</span>
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

            <button
              type="button"
              className="header-cta"
              onClick={() => document.getElementById('preview-controls-start')?.focus()}
            >
              Preview controls
            </button>
            <button
              type="button"
              className="header-cta"
              ref={openNotesButtonRef}
              onClick={() => setIsNotesOpen(true)}
            >
              Accessibility notes
            </button>
          </nav>
        </div>

        <div className="container preview-toolbar" aria-label="Preview controls" id="preview-controls-start" tabIndex={-1}>
          <div className="chips-row">
            <span className="chip">Role</span>
            <span className="chip">Current: {role === 'participant' ? 'Participant' : 'Organiser'}</span>
            <button
              type="button"
              className={`ghost-button ${role === 'participant' ? 'is-active' : ''}`}
              onClick={() => setRole('participant')}
            >
              Participant mode
            </button>
            <button
              type="button"
              className={`ghost-button ${role === 'organiser' ? 'is-active' : ''}`}
              onClick={() => setRole('organiser')}
            >
              Organiser mode
            </button>
          </div>

          <div className="chips-row">
            <button type="button" className="ghost-button" onClick={toggleHighContrast}>
              {highContrast ? 'Disable high contrast' : 'Enable high contrast'}
            </button>
            <button type="button" className="ghost-button" onClick={resetState}>
              Reset preview data
            </button>
            <button type="button" className="ghost-button" onClick={() => navigate('/')}>Jump to discovery</button>
            <button type="button" className="ghost-button" onClick={() => navigate('/activities/new')}>Jump to create flow</button>
            <button type="button" className="ghost-button" onClick={() => navigate('/profile')}>Jump to profile</button>
          </div>
        </div>
      </header>

      <main id="main-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <p>EU Code Week activities across Europe.</p>
          <img src="/images/codeweek-footer-logo.svg" alt="EU Code Week" />
        </div>
      </footer>

      {isNotesOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsNotesOpen(false)}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="accessibility-notes-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="accessibility-notes-title">Accessibility notes</h2>
            <ul>
              <li>Use Tab to navigate primary controls and map/list actions.</li>
              <li>Visible focus styles and semantic labels are enabled across forms.</li>
              <li>Result count updates are announced through aria-live regions.</li>
              <li>Map and list provide equivalent access to every activity.</li>
            </ul>
            <button type="button" className="primary-button" onClick={() => setIsNotesOpen(false)}>
              Close notes
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
