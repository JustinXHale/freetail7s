import { PLACEHOLDER_POOLS } from '../data/eventCopy'
import { useDivisions } from '../hooks/useTournament'
import { PAGE_PHOTOS } from '../data/photos'
import { PagePhotoBand } from '../components/media/PhotoLightbox'

export function TeamsPage() {
  const divisions = useDivisions()
  return (
    <div className="container section">
      <PagePhotoBand photo={PAGE_PHOTOS.teams} />
      <h1>Teams</h1>
      <p>
        Accepted teams will replace these placeholders once applications close
        and pools are set. Each division has two pools of four.
      </p>
      {divisions.map((d) => (
        <section key={d.id} style={{ marginTop: '2.5rem' }}>
          <h2>{d.name}</h2>
          <div
            style={{
              display: 'grid',
              gap: '1.25rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              marginTop: '1rem',
            }}
          >
            {PLACEHOLDER_POOLS.map((pool) => (
              <div
                key={`${d.id}-${pool.name}`}
                style={{
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg-elevated)',
                  padding: '1.25rem',
                }}
              >
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                  {pool.name}
                </h3>
                <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
                  {pool.teams.map((name) => (
                    <li key={name} style={{ marginBottom: '0.35rem' }}>
                      {name}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
