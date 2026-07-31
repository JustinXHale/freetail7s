import type { MatchDoc, MatchStatus } from '../../types/models'
import './MatchCard.css'

const STATUS_LABEL: Record<MatchStatus, string> = {
  upcoming: 'Upcoming',
  live: 'Live',
  final: 'Final',
  delayed: 'Delayed',
  cancelled: 'Cancelled',
  forfeit: 'Forfeit',
}

interface MatchCardProps {
  match: MatchDoc
  homeName: string
  awayName: string
  compact?: boolean
}

export function MatchCard({
  match,
  homeName,
  awayName,
  compact,
}: MatchCardProps) {
  const kickoff = new Date(match.kickoffAt)
  const time = kickoff.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <article
      className={`match-card ${compact ? 'match-card--compact' : ''} match-card--${match.status}`}
    >
      <header className="match-card__meta">
        <span className="match-card__division">{match.divisionCode}</span>
        <span className="match-card__stage">{match.stage}</span>
        {match.status === 'live' ? (
          <span className="live-pulse">Live</span>
        ) : (
          <span className={`match-card__status match-card__status--${match.status}`}>
            {STATUS_LABEL[match.status]}
          </span>
        )}
      </header>
      <div className="match-card__body">
        <div className="match-card__team">
          <span>{homeName}</span>
          <span className="tabular match-card__score">
            {match.homeScore ?? '—'}
          </span>
        </div>
        <div className="match-card__team">
          <span>{awayName}</span>
          <span className="tabular match-card__score">
            {match.awayScore ?? '—'}
          </span>
        </div>
      </div>
      <footer className="match-card__footer">
        <span className="tabular">{time}</span>
        <span>{match.field}</span>
        {match.placementLabel ? <span>{match.placementLabel}</span> : null}
      </footer>
    </article>
  )
}
