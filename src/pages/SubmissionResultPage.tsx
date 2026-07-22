import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAppStore } from '../store/appStore'

export function SubmissionResultPage() {
  const [searchParams] = useSearchParams()
  const { activities, approveActivity } = useAppStore()
  const [approved, setApproved] = useState(false)

  const activityId = searchParams.get('activityId')
  const activity = useMemo(
    () => activities.find((item) => item.id === activityId) ?? null,
    [activities, activityId],
  )

  return (
    <section className="container details-page">
      <h1>Submitted for moderation</h1>
      {!activity ? (
        <div className="panel">
          <p>No submitted activity was found in this preview state.</p>
          <Link to="/activities/new" className="text-link-cta">Create a new activity</Link>
        </div>
      ) : (
        <div className="panel">
          <h2>{activity.title}</h2>
          <p>Status: {approved ? 'published' : activity.status}</p>
          <p>
            This flow simulates moderation. Approving here will publish the activity in local preview data.
          </p>
          {!approved && activity.status === 'pending' ? (
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                approveActivity(activity.id)
                setApproved(true)
              }}
            >
              Approve activity
            </button>
          ) : null}

          {approved || activity.status === 'published' ? (
            <p role="status" aria-live="polite" className="success-alert">
              Activity approved. You can now view it on the map.
            </p>
          ) : null}

          <div className="hero-actions">
            <Link to={`/?highlight=${activity.id}`} className="text-link-cta">View on activity map</Link>
            <Link to="/profile" className="text-link-cta">Open profile</Link>
          </div>
        </div>
      )}
    </section>
  )
}

