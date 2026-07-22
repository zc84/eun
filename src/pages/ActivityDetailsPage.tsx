import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppStore } from '../store/appStore'

export function ActivityDetailsPage() {
  const { activityId } = useParams()
  const { role, activities, joinedActivityIds, registerForActivity, selectActivity } = useAppStore()
  const [isJoinOpen, setIsJoinOpen] = useState(false)
  const [joinMessage, setJoinMessage] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  const activity = useMemo(
    () => activities.find((item) => item.id === activityId) ?? null,
    [activities, activityId],
  )

  const similarActivities = useMemo(() => {
    if (!activity) {
      return []
    }

    return activities
      .filter((item) => item.id !== activity.id)
      .filter(
        (item) =>
          item.countryCode === activity.countryCode
          || item.topics.some((topic) => activity.topics.includes(topic)),
      )
      .slice(0, 3)
  }, [activities, activity])

  useEffect(() => {
    if (activityId) {
      selectActivity(activityId)
    }
  }, [activityId, selectActivity])

  useEffect(() => {
    if (isJoinOpen) {
      closeRef.current?.focus()
    }
  }, [isJoinOpen])

  if (!activity) {
    return (
      <section className="container placeholder-page">
        <h1>Activity not found</h1>
        <p>The selected activity is not available in this preview dataset.</p>
        <Link to="/" className="text-link-cta">Back to discovery</Link>
      </section>
    )
  }

  const alreadyJoined = joinedActivityIds.includes(activity.id)

  async function handleJoin() {
    if (!activity) {
      return
    }

    if (alreadyJoined) {
      setJoinMessage('You are already registered for this activity.')
      setIsJoinOpen(false)
      return
    }

    setIsJoining(true)
    await registerForActivity(activity.id)
    setIsJoining(false)
    setJoinMessage('Registration confirmed. This activity is now listed in your joined activities.')
    setIsJoinOpen(false)
  }

  return (
    <section className="container details-page">
      <nav aria-label="Breadcrumbs" className="breadcrumbs">
        <Link to="/">Activity map</Link> / <span>{activity.title}</span>
      </nav>

      <header className="details-header">
        <h1>{activity.title}</h1>
        <div className="chips-row">
          <span className="chip">{activity.status}</span>
          <span className="chip">{activity.mode}</span>
          {activity.featured ? <span className="chip">Featured</span> : null}
        </div>
      </header>

      {joinMessage ? (
        <p role="status" aria-live="polite" className="success-alert">{joinMessage}</p>
      ) : null}

      <div className="details-grid">
        <article className="panel">
          <h2>About this activity</h2>
          <p>{activity.description}</p>
          <h3>When and where</h3>
          <p>
            {new Date(activity.startDate).toLocaleString()} — {new Date(activity.endDate).toLocaleString()}
          </p>
          <p>
            {activity.countryName}, {activity.city}
            {activity.address ? ` · ${activity.address}` : ''}
          </p>
          <h3>Who it is for</h3>
          <p>Ages: {activity.ageGroups.join(', ')}</p>
          <p>Languages: {activity.languages.join(', ')}</p>
          <h3>Organiser</h3>
          <p>
            {activity.organiser.name} · {activity.organiser.organisation}
          </p>
          <p>Participants: {activity.participantCount}{activity.capacity ? ` / ${activity.capacity}` : ''}</p>

          {role === 'participant' ? (
            <button type="button" className="primary-button" onClick={() => setIsJoinOpen(true)}>
              {alreadyJoined ? 'Already joined' : 'Join activity'}
            </button>
          ) : (
            <div className="role-context-note" aria-live="polite">
              Organiser preview: registration is hidden in this mode. Switch to Participant mode to join activities.
            </div>
          )}
        </article>

        <aside className="panel">
          <h2>Similar activities</h2>
          {similarActivities.length === 0 ? (
            <p>No similar activities in this preview set yet.</p>
          ) : (
            <ul className="details-similar-list">
              {similarActivities.map((item) => (
                <li key={item.id}>
                  <h3>{item.title}</h3>
                  <p>{item.city}, {item.countryName}</p>
                  <Link to={`/activities/${item.id}`} className="text-link-cta">View activity</Link>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      {isJoinOpen && role === 'participant' ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsJoinOpen(false)}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="join-activity-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="join-activity-title">Confirm registration</h2>
            <p>You are about to join “{activity.title}”.</p>
            <div className="hero-actions">
              <button
                type="button"
                className="primary-button"
                disabled={isJoining}
                onClick={() => {
                  void handleJoin()
                }}
              >
                {isJoining ? 'Joining…' : 'Confirm'}
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={() => setIsJoinOpen(false)}
                ref={closeRef}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

