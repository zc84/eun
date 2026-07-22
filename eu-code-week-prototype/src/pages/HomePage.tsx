import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="home-page">
      <section className="container home-hero" aria-labelledby="home-title">
        <div className="home-hero__content">
          <p className="eyebrow">EU Code Week</p>
          <h1 id="home-title">Discover coding activities across Europe</h1>
          <p className="home-lead">
            Explore upcoming activities, compare opportunities by country and topic, and preview
            the future user experience for participants and organisers.
          </p>
          <p className="prototype-notice">
            Interactive concept prototype — demonstration data only
          </p>
          <div className="hero-actions">
            <button type="button" className="primary-button">
              Explore activities
            </button>
            <button type="button" className="ghost-button">
              Open demo controls
            </button>
          </div>
        </div>

        <aside className="home-hero__visual" aria-label="Prototype highlights">
          <h2>What this concept demonstrates</h2>
          <ul>
            <li>
              <strong>Live search & filters</strong>
              <span>Country, date range, languages, activity mode, and topics.</span>
            </li>
            <li>
              <strong>Map + list sync</strong>
              <span>Unified discovery experience for desktop and mobile users.</span>
            </li>
            <li>
              <strong>Inclusive UX patterns</strong>
              <span>Keyboard support, focus visibility, and clear status messaging.</span>
            </li>
          </ul>
        </aside>
      </section>

      <section className="container discovery-shell" aria-label="Activity discovery area">
        <div className="search-strip" role="search">
          <label htmlFor="activity-search" className="visually-hidden">
            Search activities
          </label>
          <input
            id="activity-search"
            type="search"
            placeholder="Search by title, city, country, organiser or topic"
            aria-describedby="search-hint"
          />
          <button type="button">Search</button>
          <span id="search-hint">Result count and map update automatically in the next phase.</span>
        </div>

        <div className="result-toolbar panel" aria-label="Result summary">
          <p>
            <strong>12 activities</strong> found across 8 countries
          </p>
          <div className="chips-row">
            <span className="chip">Sort: Relevance</span>
            <span className="chip">Updated just now</span>
          </div>
        </div>

        <div className="discovery-grid">
          <aside className="panel filters-panel" aria-labelledby="filters-title">
            <h2 id="filters-title">Filters</h2>
            <div className="chips-row" aria-label="Selected filters">
              <span className="chip">Country: All</span>
              <span className="chip">Date: Upcoming</span>
              <span className="chip">Mode: Any</span>
            </div>
            <ul>
              <li>Country</li>
              <li>Activity type</li>
              <li>Age group</li>
              <li>Language</li>
              <li>Date range</li>
              <li>Mode (online / onsite / hybrid)</li>
              <li>Topic</li>
            </ul>
            <button type="button" className="link-button">
              Clear all filters
            </button>
          </aside>

          <div className="content-column">
            <section className="panel map-panel" aria-labelledby="map-title">
              <div className="panel-header">
                <h2 id="map-title">Europe activity map</h2>
                <span className="chip">Preview mode</span>
              </div>
              <div className="placeholder-box" role="img" aria-label="Map placeholder">
                <div className="map-preview">
                  <span className="map-pin pin-1" aria-hidden="true" />
                  <span className="map-pin pin-2" aria-hidden="true" />
                  <span className="map-pin pin-3" aria-hidden="true" />
                  <span className="map-pin pin-4" aria-hidden="true" />
                  <p>Map component placeholder (react-simple-maps will be integrated in Phase 3)</p>
                </div>
              </div>
            </section>

            <section className="panel list-panel" aria-labelledby="list-title">
              <div className="panel-header">
                <h2 id="list-title">Activity list</h2>
                <p>12 results</p>
              </div>
              <div className="activity-preview-card">
                <h3>Girls in Robotics — Milan</h3>
                <p>Italy · Onsite · Ages 11–14 · Italian, English</p>
                <div className="chips-row">
                  <span className="chip">Robotics</span>
                  <span className="chip">Featured</span>
                </div>
                <p>
                  Hands-on workshop where students build and program mini robots in mixed teams.
                </p>
                <Link to="/activities/demo-1" className="text-link-cta">
                  View activity
                </Link>
              </div>
              <div className="activity-preview-card">
                <h3>Digital Citizenship for Schools — Online</h3>
                <p>Cross-border · Online · Ages 13–17 · English</p>
                <div className="chips-row">
                  <span className="chip">Digital safety</span>
                  <span className="chip">Teacher toolkit</span>
                </div>
                <p>
                  Interactive lesson set for teachers and students focused on safe and creative use
                  of digital technologies.
                </p>
                <Link to="/activities/demo-2" className="text-link-cta">
                  View activity
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}

