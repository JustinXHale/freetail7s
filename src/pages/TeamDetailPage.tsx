import { Link, useParams } from 'react-router-dom'
import { useTeam } from '../hooks/useTournament'
import { PAGE_PHOTOS } from '../data/photos'
import { PagePhotoBand } from '../components/media/PhotoLightbox'

export function TeamDetailPage() {
  const { teamSlug = '' } = useParams()
  const team = useTeam(teamSlug)
  if (!team) {
    return (
      <div className="container section">
        <PagePhotoBand photo={PAGE_PHOTOS.teams} />
        <h1>Team not found</h1>
        <Link to="/brackets">Back to teams &amp; brackets</Link>
      </div>
    )
  }
  return (
    <div className="container section">
      <PagePhotoBand photo={PAGE_PHOTOS.teams} />
      <p
        style={{
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--color-accent-on-dark)',
        }}
      >
        {team.divisionCode}
      </p>
      <h1>{team.name}</h1>
      <p>{team.location}</p>
      {team.description ? <p>{team.description}</p> : null}
      <Link to="/brackets">All teams &amp; brackets</Link>
    </div>
  )
}
