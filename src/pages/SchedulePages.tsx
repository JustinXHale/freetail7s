import { useMemo } from 'react'
import { MatchCard } from '../components/ui/MatchCard'
import {
  useEvent,
  useMatches,
  usePools,
  useStandings,
  useTeamName,
  useTeams,
} from '../hooks/useTournament'
import type { MatchDoc } from '../types/models'
import { PAGE_PHOTOS } from '../data/photos'
import { PagePhotoBand } from '../components/media/PhotoLightbox'

function MatchRow({ match }: { match: MatchDoc }) {
  const home = useTeamName(match.homeTeamId)
  const away = useTeamName(match.awayTeamId)
  return <MatchCard match={match} homeName={home} awayName={away} />
}

export function SchedulePage() {
  return (
    <div className="container section" style={{ maxWidth: 560 }}>
      <PagePhotoBand photo={PAGE_PHOTOS.schedule} />
      <h1>Schedule</h1>
      <p>
        The match schedule is not published yet. Check back once pools are set
        and kickoff times are locked.
      </p>
      <p>Coming soon.</p>
    </div>
  )
}

export function TodayPage() {
  const event = useEvent()
  const all = useMatches()
  const todayKey = useMemo(() => {
    if (event.phase === 'live') {
      const d = new Date().getDay()
      if (d === 5) return 'friday'
      if (d === 6) return 'saturday'
      if (d === 0) return 'sunday'
    }
    return 'friday'
  }, [event.phase])
  const matches = all.filter((m) => m.day === todayKey)
  const live = matches.filter((m) => m.status === 'live')

  return (
    <div className="container section">
      <PagePhotoBand photo={PAGE_PHOTOS.today} />
      <h1>Today</h1>
      {live.length > 0 ? (
        <section style={{ marginBottom: '2rem' }}>
          <h2>Live now</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {live.map((m) => (
              <MatchRow key={m.id} match={m} />
            ))}
          </div>
        </section>
      ) : null}
      <h2>Upcoming · {todayKey}</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {matches.map((m) => (
          <MatchRow key={m.id} match={m} />
        ))}
      </div>
    </div>
  )
}

export function PoolsStandingsPage() {
  const pools = usePools()
  const teams = useTeams()
  const nameOf = (id: string) => teams.find((t) => t.id === id)?.name ?? id

  return (
    <div className="container section">
      <PagePhotoBand photo={PAGE_PHOTOS.pools} />
      <h1>Pools & Standings</h1>
      {pools.length === 0 ? <p>Pools not published yet.</p> : null}
      {pools.map((pool) => (
        <PoolBlock
          key={pool.id}
          poolId={pool.id}
          title={`${pool.divisionCode} · ${pool.name}`}
          nameOf={nameOf}
          teamIds={pool.teamIds}
        />
      ))}
    </div>
  )
}

function PoolBlock({
  poolId,
  title,
  nameOf,
  teamIds,
}: {
  poolId: string
  title: string
  nameOf: (id: string) => string
  teamIds: string[]
}) {
  const standings = useStandings(poolId)
  return (
    <section style={{ marginTop: '2rem' }}>
      <h2>{title}</h2>
      <p>Teams: {teamIds.map(nameOf).join(', ') || 'TBD'}</p>
      {standings.length === 0 ? (
        <p>Standings will appear after results.</p>
      ) : (
        <table
          className="tabular"
          style={{ width: '100%', borderCollapse: 'collapse' }}
        >
          <thead>
            <tr>
              <th align="left">Team</th>
              <th>P</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>PD</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s) => (
              <tr key={s.id}>
                <td>{nameOf(s.teamId)}</td>
                <td align="center">{s.played}</td>
                <td align="center">{s.won}</td>
                <td align="center">{s.drawn}</td>
                <td align="center">{s.lost}</td>
                <td align="center">{s.pointDiff}</td>
                <td align="center">{s.competitionPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export function ResultsPage() {
  const matches = useMatches().filter(
    (m) => m.status === 'final' || m.status === 'forfeit',
  )
  return (
    <div className="container section">
      <PagePhotoBand photo={PAGE_PHOTOS.results} />
      <h1>Results</h1>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {matches.length === 0 ? <p>No final results yet.</p> : null}
        {matches.map((m) => (
          <MatchRow key={m.id} match={m} />
        ))}
      </div>
    </div>
  )
}

export function BracketPage() {
  return (
    <div className="container section">
      <PagePhotoBand photo={PAGE_PHOTOS.brackets} />
      <h1>Brackets</h1>
      <p>
        Championship and placement brackets publish after pool stages lock.
      </p>
    </div>
  )
}
