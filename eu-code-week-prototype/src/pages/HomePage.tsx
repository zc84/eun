import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { countries } from '../data/countries'
import {
  activityTypeOptions,
  ageGroupOptions,
  languageOptions,
  modeOptions,
  topicOptions,
} from '../data/filters'
import { useAppStore } from '../store/appStore'
import { selectFilteredActivities } from '../store/selectors'
import type { ActivitySortBy } from '../types/filters'
import { clientNarrativeNotes, programmeContextHighlights } from '../data/programmeContext'

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
}

function toMapPosition(latitude: number, longitude: number) {
  const x = ((longitude + 25) / 70) * 100
  const y = ((72 - latitude) / 40) * 100
  return {
    left: `${Math.min(95, Math.max(5, x))}%`,
    top: `${Math.min(92, Math.max(8, y))}%`,
  }
}

export function HomePage() {
  const [searchParams] = useSearchParams()
  const {
    role,
    filters,
    setFilters,
    resetFilters,
    selectActivity,
    selectedActivityId,
    getActivities,
    activities,
  } = useAppStore()

  const [queryDraft, setQueryDraft] = useState(filters.query)
  const [showFiltersOnMobile, setShowFiltersOnMobile] = useState(false)
  const [mobileView, setMobileView] = useState<'map' | 'list'>('list')
  const [isLoading, setIsLoading] = useState(false)

  const filteredActivities = useMemo(
    () => selectFilteredActivities({ activities, filters, selectedActivityId }),
    [activities, filters, selectedActivityId],
  )

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (queryDraft !== filters.query) {
        setFilters({ ...filters, query: queryDraft })
      }
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [queryDraft, filters, setFilters])

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    getActivities(filters)
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [filters, getActivities])

  useEffect(() => {
    const highlight = searchParams.get('highlight')
    if (highlight) {
      selectActivity(highlight)
    }
  }, [searchParams, selectActivity])

  function updateSort(sortBy: ActivitySortBy) {
    setFilters({ ...filters, sortBy })
  }

  const activeFilterTags = [
    ...filters.countryCodes.map((code) => ({
      key: `country-${code}`,
      label: `Country: ${code}`,
      remove: () => setFilters({ ...filters, countryCodes: toggleValue(filters.countryCodes, code) }),
    })),
    ...filters.activityTypes.map((type) => ({
      key: `type-${type}`,
      label: `Type: ${type}`,
      remove: () => setFilters({ ...filters, activityTypes: toggleValue(filters.activityTypes, type) }),
    })),
    ...filters.ageGroups.map((age) => ({
      key: `age-${age}`,
      label: `Age: ${age}`,
      remove: () => setFilters({ ...filters, ageGroups: toggleValue(filters.ageGroups, age) }),
    })),
    ...filters.languages.map((language) => ({
      key: `language-${language}`,
      label: `Language: ${language}`,
      remove: () => setFilters({ ...filters, languages: toggleValue(filters.languages, language) }),
    })),
    ...filters.modes.map((mode) => ({
      key: `mode-${mode}`,
      label: `Mode: ${mode}`,
      remove: () => setFilters({ ...filters, modes: toggleValue(filters.modes, mode) as typeof filters.modes }),
    })),
    ...filters.topics.map((topic) => ({
      key: `topic-${topic}`,
      label: `Topic: ${topic}`,
      remove: () => setFilters({ ...filters, topics: toggleValue(filters.topics, topic) }),
    })),
  ]

  return (
    <div className="home-page">
      <section className="container home-hero" aria-labelledby="home-title">
        <div className="home-hero__content">
          <p className="eyebrow">EU Code Week</p>
          <h1 id="home-title">
            {role === 'participant'
              ? 'Discover coding activities across Europe'
              : 'Create and manage coding activities across Europe'}
          </h1>
          <p className="home-lead">
            {role === 'participant'
              ? 'Explore upcoming activities, compare opportunities by country and topic, and join sessions that match your interests.'
              : 'Preview the organiser journey: publish activities, review your submissions, and see how your events appear to participants.'}
          </p>
          <p className="role-context-note" aria-live="polite">
            Current preview mode: <strong>{role === 'participant' ? 'Participant' : 'Organiser'}</strong>
          </p>
          <div className="hero-actions">
            {role === 'participant' ? (
              <>
                <button type="button" className="primary-button" onClick={() => document.getElementById('activity-search')?.focus()}>
                  Start exploring
                </button>
                <button type="button" className="ghost-button" onClick={() => setShowFiltersOnMobile(true)}>
                  Open filters
                </button>
              </>
            ) : (
              <>
                <Link to="/activities/new" className="primary-button">
                  Create a new activity
                </Link>
                <Link to="/profile" className="ghost-button">
                  Review my created activities
                </Link>
              </>
            )}
          </div>
        </div>

        <aside className="home-hero__visual" aria-label="Platform highlights">
          <h2>What this platform offers</h2>
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

          <h3>Client-specific context</h3>
          <ul>
            {clientNarrativeNotes.map((note) => (
              <li key={note}><span>{note}</span></li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="container panel" aria-label="Programme context highlights">
        <h2>Programme context highlights</h2>
        <ul className="context-list">
          {programmeContextHighlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="container discovery-shell" aria-label="Activity discovery area">
        <div className="search-strip" role="search">
          <label htmlFor="activity-search" className="visually-hidden">
            Search activities
          </label>
          <input
            id="activity-search"
            type="search"
            value={queryDraft}
            onChange={(event) => setQueryDraft(event.target.value)}
            placeholder="Search by title, city, country, organiser or topic"
            aria-describedby="search-hint"
          />
          <button type="button" onClick={() => setFilters({ ...filters, query: queryDraft })}>Apply</button>
          <span id="search-hint">Results, filters, and map/list update automatically.</span>
        </div>

        <div className="result-toolbar panel" aria-label="Result summary" aria-live="polite">
          <p>
            <strong>{filteredActivities.length} activities</strong> found across{' '}
            {new Set(filteredActivities.map((item) => item.countryCode)).size} countries
          </p>
          <div className="chips-row">
            <label htmlFor="sort-by" className="visually-hidden">
              Sort results
            </label>
            <select
              id="sort-by"
              value={filters.sortBy}
              onChange={(event) => updateSort(event.target.value as ActivitySortBy)}
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="dateAscending">Date: Soonest first</option>
              <option value="dateDescending">Date: Latest first</option>
            </select>
            <button type="button" className="ghost-button mobile-only" onClick={() => setMobileView(mobileView === 'list' ? 'map' : 'list')}>
              Mobile view: {mobileView === 'list' ? 'List' : 'Map'}
            </button>
            <button type="button" className="ghost-button mobile-only" onClick={() => setShowFiltersOnMobile(true)}>
              Filters
            </button>
          </div>
        </div>

        {activeFilterTags.length > 0 ? (
          <div className="chips-row" aria-label="Active filters">
            {activeFilterTags.map((tag) => (
              <button type="button" className="chip" key={tag.key} onClick={tag.remove}>
                {tag.label} ×
              </button>
            ))}
          </div>
        ) : null}

        <div className="discovery-grid">
          <aside className={`panel filters-panel ${showFiltersOnMobile ? 'is-open' : ''}`} aria-labelledby="filters-title">
            <h2 id="filters-title">Filters</h2>
            <div className="filter-group">
              <h3>Country</h3>
              {countries.map((country) => (
                <label key={country.code}>
                  <input
                    type="checkbox"
                    checked={filters.countryCodes.includes(country.code)}
                    onChange={() => setFilters({ ...filters, countryCodes: toggleValue(filters.countryCodes, country.code) })}
                  />
                  {country.name}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h3>Date range</h3>
              <label>
                From
                <input
                  type="date"
                  value={filters.dateFrom ?? ''}
                  onChange={(event) => setFilters({ ...filters, dateFrom: event.target.value || undefined })}
                />
              </label>
              <label>
                To
                <input
                  type="date"
                  value={filters.dateTo ?? ''}
                  onChange={(event) => setFilters({ ...filters, dateTo: event.target.value || undefined })}
                />
              </label>
            </div>

            <div className="filter-group">
              <h3>Activity type</h3>
              {activityTypeOptions.map((type) => (
                <label key={type}>
                  <input
                    type="checkbox"
                    checked={filters.activityTypes.includes(type)}
                    onChange={() => setFilters({ ...filters, activityTypes: toggleValue(filters.activityTypes, type) })}
                  />
                  {type}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h3>Age group</h3>
              {ageGroupOptions.map((age) => (
                <label key={age}>
                  <input
                    type="checkbox"
                    checked={filters.ageGroups.includes(age)}
                    onChange={() => setFilters({ ...filters, ageGroups: toggleValue(filters.ageGroups, age) })}
                  />
                  {age}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h3>Language</h3>
              {languageOptions.map((language) => (
                <label key={language}>
                  <input
                    type="checkbox"
                    checked={filters.languages.includes(language)}
                    onChange={() => setFilters({ ...filters, languages: toggleValue(filters.languages, language) })}
                  />
                  {language}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h3>Mode</h3>
              {modeOptions.map((mode) => (
                <label key={mode}>
                  <input
                    type="checkbox"
                    checked={filters.modes.includes(mode)}
                    onChange={() => setFilters({ ...filters, modes: toggleValue(filters.modes, mode) as typeof filters.modes })}
                  />
                  {mode}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h3>Topic</h3>
              {topicOptions.map((topic) => (
                <label key={topic}>
                  <input
                    type="checkbox"
                    checked={filters.topics.includes(topic)}
                    onChange={() => setFilters({ ...filters, topics: toggleValue(filters.topics, topic) })}
                  />
                  {topic}
                </label>
              ))}
            </div>

            <button type="button" className="link-button" onClick={resetFilters}>
              Clear all filters
            </button>
            <button type="button" className="ghost-button mobile-only" onClick={() => setShowFiltersOnMobile(false)}>
              Close filters
            </button>
          </aside>

          <div className="content-column">
            <section className={`panel map-panel ${mobileView === 'list' ? 'mobile-hidden' : ''}`} aria-labelledby="map-title">
              <div className="panel-header">
                <h2 id="map-title">Europe activity map</h2>
                <span className="chip">Preview mode</span>
              </div>
              <div className="placeholder-box" role="img" aria-label="Interactive activity map">
                <div className="map-preview">
                  {filteredActivities.slice(0, 40).map((activity) => {
                    const position = toMapPosition(activity.latitude, activity.longitude)
                    return (
                      <button
                        key={activity.id}
                        type="button"
                        className={`map-pin ${selectedActivityId === activity.id ? 'is-selected' : ''}`}
                        style={position}
                        onClick={() => selectActivity(activity.id)}
                        aria-label={`${activity.title} in ${activity.city}`}
                      />
                    )
                  })}
                </div>
              </div>
            </section>

            <section className={`panel list-panel ${mobileView === 'map' ? 'mobile-hidden' : ''}`} aria-labelledby="list-title">
              <div className="panel-header">
                <h2 id="list-title">Activity list</h2>
                <p>{filteredActivities.length} results · {role === 'participant' ? 'Participant view' : 'Organiser view'}</p>
              </div>
              {isLoading ? <p className="skeleton-block">Loading activities…</p> : null}
              {!isLoading && filteredActivities.length === 0 ? (
                <div className="empty-state">
                  <h3>No matching activities</h3>
                  <p>Try removing filters or changing your search terms.</p>
                </div>
              ) : null}

              {filteredActivities.map((activity) => (
                <article
                  key={activity.id}
                  className={`activity-preview-card ${selectedActivityId === activity.id ? 'is-selected' : ''}`}
                >
                  <h3>{activity.title}</h3>
                  <p>
                    {activity.countryName} · {activity.city} · {activity.mode} · {activity.languages.join(', ')}
                  </p>
                  <div className="chips-row">
                    {activity.topics.slice(0, 2).map((topic) => (
                      <span className="chip" key={topic}>{topic}</span>
                    ))}
                    {activity.featured ? <span className="chip">Featured</span> : null}
                  </div>
                  <p>{activity.summary}</p>
                  <p>
                    Participants: {activity.participantCount}
                    {activity.capacity ? ` / ${activity.capacity}` : ''}
                  </p>
                  <Link
                    to={`/activities/${activity.id}`}
                    className="text-link-cta"
                    onFocus={() => selectActivity(activity.id)}
                    onMouseEnter={() => selectActivity(activity.id)}
                  >
                    {role === 'participant' ? 'View and join activity' : 'View activity as organiser'}
                  </Link>
                </article>
              ))}
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}

