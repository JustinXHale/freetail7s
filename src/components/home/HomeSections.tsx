import { ButtonLink } from '../ui/Button'
import { useDivisions, useEvent, useAnnouncements } from '../../hooks/useTournament'
import { HERO_PHOTO, RANCH_PHOTOS } from '../../data/photos'
import { ClickablePhoto } from '../media/PhotoLightbox'
import logo from '../../assets/logos/ft7s-full.png'
import './HomeSections.css'

export function Hero() {
  const event = useEvent()
  return (
    <section className="hero">
      <div className="hero__atmosphere" aria-hidden="true">
        <img
          className="hero__photo"
          src={HERO_PHOTO.src}
          alt=""
          width={1600}
          height={1067}
          fetchPriority="high"
        />
        <div className="hero__scrim" />
      </div>
      <img
        className="hero__logo"
        src={logo}
        alt="Freetail 7s Rugby Tournament — Austin, Texas"
        width={320}
        height={248}
      />
      <div className="container hero__content">
        <p className="hero__eyebrow">The bats fly again</p>
        <h1>
          Freetail 7s
          <span className="hero__year">2027</span>
        </h1>
        <p className="hero__lede">
          January 1–3, 2027 · {event.venueCity}, {event.venueState}. The first
          rugby of the year starts here.
        </p>
        <div className="hero__actions">
          <ButtonLink to="/apply" size="lg">
            Apply your team
          </ButtonLink>
          <ButtonLink to="/about" variant="secondary" size="lg">
            Tournament info
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

export function FactsStrip() {
  return (
    <section className="facts" aria-label="Event facts">
      <div className="container facts__grid">
        <div>
          <strong className="tabular">4</strong>
          <span>Divisions</span>
        </div>
        <div>
          <strong className="tabular">32</strong>
          <span>Teams</span>
        </div>
        <div>
          <strong className="tabular">80</strong>
          <span>Matches</span>
        </div>
        <div>
          <strong className="tabular">3</strong>
          <span>Days</span>
        </div>
      </div>
    </section>
  )
}

export function DivisionPanel() {
  const divisions = useDivisions()
  return (
    <section className="section">
      <div className="container">
        <h2>Premier and Elite. One field.</h2>
        <p>
          Men, women, and U18 sides compete under the same Freetail standard —
          invitation-quality rugby to open the year in Austin.
        </p>
        <div className="division-grid">
          {divisions.map((d) => (
            <article key={d.id} className="division-card">
              <span className="division-card__code">{d.shortName}</span>
              <h3>{d.name}</h3>
              <p className="tabular">{d.capacity} teams</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function VenueBlock() {
  const event = useEvent()
  return (
    <section className="section section--light">
      <div className="container split-feature">
        <div className="split-feature__copy">
          <h2>Huns Rugby Ranch</h2>
          <p>
            {event.venueAddress}, {event.venueCity}, {event.venueState}. Field
            under lights, room for spectators, and an Austin New Year atmosphere
            built for sevens.
          </p>
          <ButtonLink to="/visit" variant="secondary">
            Facility details
          </ButtonLink>
        </div>
        <figure className="split-feature__media">
          <ClickablePhoto
            photo={RANCH_PHOTOS[1]}
            photos={[...RANCH_PHOTOS]}
            index={1}
            width={900}
            height={600}
            loading="lazy"
          />
        </figure>
      </div>
    </section>
  )
}

export function SponsorFeature() {
  return (
    <section className="section">
      <div className="container split-feature split-feature--sponsor">
        <div className="split-feature__copy">
          <p className="eyebrow">Title sponsor & event host</p>
          <h2>Legacy Ecowear</h2>
          <p>
            Eco-friendly teamwear and event gear from Central Texas. Formerly
            Hooligan Sport — now Legacy Ecowear, exclusive USA distributor for
            Tsunami Sport.
          </p>
          <ButtonLink to="/sponsors" variant="secondary">
            View sponsors
          </ButtonLink>
        </div>
        <figure className="split-feature__media split-feature__media--logo">
          <img
            src="/sponsors/LegacyEcowearLongLogo.svg"
            alt="Legacy Ecowear"
            width={480}
            height={114}
            loading="lazy"
            decoding="async"
          />
        </figure>
      </div>
    </section>
  )
}

export function LatestUpdate() {
  const updates = useAnnouncements()
  const latest = updates[0]
  if (!latest) return null
  return (
    <section className="section section--light">
      <div className="container">
        <h2>Latest update</h2>
        <article className="update-card">
          <h3>{latest.title}</h3>
          <p>{latest.body}</p>
          <ButtonLink to="/updates" variant="secondary">
            All updates
          </ButtonLink>
        </article>
      </div>
    </section>
  )
}

export function FinalCta() {
  return (
    <section className="final-cta">
      <div className="container">
        <h2>Ready for January?</h2>
        <p>Austin. New Year. Sevens.</p>
        <ButtonLink to="/apply" size="lg">
          Start your application
        </ButtonLink>
      </div>
    </section>
  )
}
