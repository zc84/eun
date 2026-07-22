import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { achievements, certificates } from '../data/achievements'
import { currentUser } from '../data/currentUser'
import { useAppStore } from '../store/appStore'

type ProfileTab = 'created' | 'joined' | 'achievements' | 'certificates'

export function ProfilePage() {
  const { activities, createdActivityIds, joinedActivityIds } = useAppStore()
  const [tab, setTab] = useState<ProfileTab>('created')

  const createdActivities = useMemo(
    () => activities.filter((activity) => createdActivityIds.includes(activity.id)),
    [activities, createdActivityIds],
  )

  const joinedActivities = useMemo(
    () => activities.filter((activity) => joinedActivityIds.includes(activity.id)),
    [activities, joinedActivityIds],
  )

  const resolvedAchievements = achievements.map((badge) => ({
    ...badge,
    unlocked: currentUser.earnedBadgeIds.includes(badge.id)
      || (badge.id === 'first-organised' && createdActivities.some((item) => item.status === 'published')),
  }))

  const completion = Math.round((resolvedAchievements.filter((item) => item.unlocked).length / resolvedAchievements.length) * 100)

  return (
    <section className="container details-page">
      <h1>My profile</h1>
      <div className="panel">
        <h2>{currentUser.displayName}</h2>
        <p>{currentUser.organisation}</p>
        <p>{currentUser.roleLabel}</p>
        <p>Achievement progress: {completion}%</p>
        <progress max={100} value={completion} aria-label="Achievement progress" />
      </div>

      <div className="chips-row" role="tablist" aria-label="Profile sections">
        <button type="button" role="tab" aria-selected={tab === 'created'} className="ghost-button" onClick={() => setTab('created')}>My activities</button>
        <button type="button" role="tab" aria-selected={tab === 'joined'} className="ghost-button" onClick={() => setTab('joined')}>Joined activities</button>
        <button type="button" role="tab" aria-selected={tab === 'achievements'} className="ghost-button" onClick={() => setTab('achievements')}>Achievements</button>
        <button type="button" role="tab" aria-selected={tab === 'certificates'} className="ghost-button" onClick={() => setTab('certificates')}>Certificates</button>
      </div>

      {tab === 'created' ? (
        <div className="panel">
          <h2>My activities</h2>
          {createdActivities.length === 0 ? <p>No created activities yet.</p> : null}
          {createdActivities.map((activity) => (
            <article key={activity.id} className="activity-preview-card">
              <h3>{activity.title}</h3>
              <p>{activity.city}, {activity.countryName}</p>
              <p>Status: {activity.status}</p>
              <Link className="text-link-cta" to={`/activities/${activity.id}`}>View activity</Link>
            </article>
          ))}
          <Link to="/activities/new" className="text-link-cta">Create new activity</Link>
        </div>
      ) : null}

      {tab === 'joined' ? (
        <div className="panel">
          <h2>Joined activities</h2>
          {joinedActivities.length === 0 ? <p>No joined activities yet.</p> : null}
          {joinedActivities.map((activity) => (
            <article key={activity.id} className="activity-preview-card">
              <h3>{activity.title}</h3>
              <p>{activity.city}, {activity.countryName}</p>
              <Link className="text-link-cta" to={`/activities/${activity.id}`}>View activity</Link>
            </article>
          ))}
        </div>
      ) : null}

      {tab === 'achievements' ? (
        <div className="panel">
          <h2>Achievements</h2>
          <div className="details-grid">
            {resolvedAchievements.map((badge) => (
              <article key={badge.id} className={`activity-preview-card ${badge.unlocked ? '' : 'is-locked'}`}>
                <h3>{badge.icon} {badge.title}</h3>
                <p>{badge.description}</p>
                <p>{badge.unlocked ? 'Earned' : 'Locked'}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {tab === 'certificates' ? (
        <div className="panel">
          <h2>Certificates</h2>
          {certificates.map((certificate) => (
            <article key={certificate.id} className="activity-preview-card">
              <h3>{certificate.title}</h3>
              <p>Issued: {certificate.issueDate}</p>
              <a className="text-link-cta" href={certificate.fileUrl} target="_blank" rel="noreferrer">Open sample certificate</a>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

