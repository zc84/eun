import { Link } from 'react-router-dom'
import { useAppStore } from '../store/appStore'

export function MobileFeedPage() {
  const { activities } = useAppStore()
  const upcoming = activities
    .filter((activity) => activity.status === 'published')
    .slice(0, 6)

  return (
    <section className="container details-page">
      <h1>Mobile feed</h1>
      <p>Offline-ready view · saved filters · nearby activity highlights.</p>

      <div className="panel">
        <h2>Upcoming for your network</h2>
        {upcoming.map((activity) => (
          <article key={activity.id} className="activity-preview-card">
            <h3>{activity.title}</h3>
            <p>{activity.city}, {activity.countryName}</p>
            <p>{new Date(activity.startDate).toLocaleDateString()}</p>
            <Link to={`/activities/${activity.id}`} className="text-link-cta">Open activity</Link>
          </article>
        ))}
      </div>
    </section>
  )
}

