import {
  DivisionPanel,
  FactsStrip,
  FinalCta,
  Hero,
  LatestUpdate,
  SponsorFeature,
  VenueBlock,
} from '../components/home/HomeSections'
import { ActionShots } from '../components/home/PhotoGallery'
import { ButtonLink } from '../components/ui/Button'
import { DEFAULT_SPONSORS } from '../data/seedDefaults'

export function HomePage() {
  return (
    <>
      <Hero />
      <FactsStrip />
      <section className="section">
        <div className="container" style={{ maxWidth: '40rem' }}>
          <h2>About Freetail 7s</h2>
          <p>
            Freetail 7s is Austin’s New Year rugby tournament — Premier and
            Elite U18 sides sharing one field, one schedule, and one event.
            Join us for a weekend of rugby and fun.
          </p>
          <ButtonLink to="/about" variant="secondary">
            Tournament history & format
          </ButtonLink>
        </div>
      </section>
      <DivisionPanel />
      <ActionShots />
      <VenueBlock />
      <SponsorFeature />
      <LatestUpdate />
      <section className="section">
        <div className="container">
          <h2>Sponsors</h2>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              display: 'flex',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            {DEFAULT_SPONSORS.map((s) => (
              <li key={s.id} style={{ color: 'var(--color-text)' }}>
                <strong>{s.name}</strong>
                <span
                  style={{ color: 'var(--color-text-muted)', marginLeft: 8 }}
                >
                  {s.tier}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <FinalCta />
    </>
  )
}
