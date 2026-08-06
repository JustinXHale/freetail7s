import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { TextInput } from '../components/ui/Field'
import {
  useAnnouncements,
  useEmailSignup,
  useEvent,
  useFaqs,
} from '../hooks/useTournament'
import { EVENT_DATES } from '../data/eventCopy'
import { PAGE_PHOTOS, RANCH_PHOTOS } from '../data/photos'
import {
  ACCEPTANCE_PAYMENT_SUMMARY,
  DIVISION_VIABILITY_SUMMARY,
  FEE_ROWS,
  LEGACY_CONTACT,
  PRIZE_SUMMARY,
  REFUND_SUMMARY,
  RULES_PATH,
  TOURNAMENT_CONTACT,
  U18_ELIGIBILITY,
} from '../data/tournamentRules'
import { Link } from 'react-router-dom'
import {
  ClickablePhoto,
  PagePhotoBand,
} from '../components/media/PhotoLightbox'

const HUNS_FACILITY_URL =
  'https://www.hunsrugby.com/facilities/field-rentals'

export function VisitPage() {
  const event = useEvent()
  return (
    <div className="container section">
      <h1>Facility</h1>
      <h2>{event.venueName}</h2>
      <p>
        {event.venueAddress}, {event.venueCity}, {event.venueState}. Just east
        of downtown Austin — one of the country’s dedicated rugby facilities,
        with two full-sized pitches and large warm-up areas.
      </p>

      <ul className="ranch-gallery">
        {RANCH_PHOTOS.map((photo, index) => (
          <li key={photo.src}>
            <ClickablePhoto
              photo={photo}
              photos={[...RANCH_PHOTOS]}
              index={index}
              width={800}
              height={500}
            />
          </li>
        ))}
      </ul>

      <h3>On site</h3>
      <ul>
        <li>Two 120m × 70m pitches and warm-up space</li>
        <li>Ample parking</li>
        <li>Paved social area and covered “Big Tent” space</li>
        <li>Elevated platform for filming</li>
        <li>Weight shack and large-capacity smoker in the social corner</li>
      </ul>

      <h3>Getting here</h3>
      <p>
        Nearest major airport: Austin-Bergstrom (AUS). Host hotel details will
        publish here when confirmed.
      </p>

      <p>
        Facility details from the Austin Huns:{' '}
        <a href={HUNS_FACILITY_URL} target="_blank" rel="noopener noreferrer">
          Field rentals & amenities
        </a>
        .
      </p>
    </div>
  )
}

export function TicketsPage() {
  const event = useEvent()
  return (
    <div className="container section">
      <PagePhotoBand photo={PAGE_PHOTOS.tickets} />
      <h1>Tickets</h1>
      <p>Spectator ticket details and pricing will publish here.</p>
      {event.ticketUrl ? (
        <Button
          onClick={() => window.open(event.ticketUrl!, '_blank', 'noopener')}
        >
          Buy tickets
        </Button>
      ) : (
        <p>Ticket provider link coming soon.</p>
      )}
    </div>
  )
}

const SPONSORS = [
  {
    id: 'legacy-ecowear',
    name: 'Legacy Ecowear',
    tier: 'Title sponsor & event host',
    url: 'https://legacyecowear.com/pages/legacy-ecowear-company-profile',
    body: (
      <>
        <p>
          Legacy Ecowear (formerly Hooligan Sport) is the exclusive USA
          distributor for Tsunami Sport. Based in Central Texas, they supply
          eco-friendly apparel and gear for sports, schools, and corporate
          events — including rugby uniforms, balls, flags, and training
          equipment.
        </p>
        <p>
          Their focus is sustainable product quality and straightforward
          ordering for clubs and tournaments. They host Freetail 7s as title
          sponsor.
        </p>
        <p>
          Kit and sponsor questions:{' '}
          <a href={`mailto:${LEGACY_CONTACT.email}`}>{LEGACY_CONTACT.email}</a>
        </p>
      </>
    ),
  },
  {
    id: 'to3',
    name: 'Tō3',
    tier: 'Communications sponsor',
    url: 'https://justinxhale.github.io/to3-site/',
    body: (
      <>
        <p>
          Tō3 is live audio for events. Open a room, tap to join, and stay
          with your crew — clear audio and simple controls on your phone.
        </p>
      </>
    ),
  },
  {
    id: 'project-popolo',
    name: 'Project Pōpolo',
    tier: 'Referee crew managers',
    url: 'https://projectpopolo.com/',
    body: (
      <>
        <p>
          Project Pōpolo manages the referee crew for Freetail 7s — assigning
          and supporting match officials across Premier and Elite U18
          divisions.
        </p>
      </>
    ),
  },
]

export function SponsorsPage() {
  return (
    <div className="container section">
      <PagePhotoBand photo={PAGE_PHOTOS.sponsors} />
      <h1>Sponsors</h1>
      <p>
        Partners who make Freetail 7s possible — kit, communications, and
        match officials.
      </p>
      <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
        {SPONSORS.map((s) => (
          <article
            key={s.id}
            style={{
              border: '1px solid var(--color-border)',
              padding: '1.5rem',
              background: 'var(--color-bg-elevated)',
            }}
          >
            <p
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-brand-primary)',
                marginBottom: 4,
                fontSize: '0.8rem',
              }}
            >
              {s.tier}
            </p>
            <h2 style={{ fontSize: '1.75rem' }}>{s.name}</h2>
            {s.body}
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              Learn more
            </a>
          </article>
        ))}
      </div>
    </div>
  )
}

export function FaqPage() {
  const faqs = useFaqs()
  return (
    <div className="container section" style={{ maxWidth: 720 }}>
      <PagePhotoBand photo={PAGE_PHOTOS.faq} />
      <h1>FAQ</h1>
      <p>
        Competition, eligibility, and prizes are in{' '}
        <Link to={RULES_PATH}>Tournament rules</Link>.
      </p>
      {faqs.map((f) => (
        <details
          key={f.id}
          style={{
            borderBottom: '1px solid var(--color-border)',
            padding: '1rem 0',
          }}
        >
          <summary
            style={{
              cursor: 'pointer',
              color: 'var(--color-text)',
              fontWeight: 700,
            }}
          >
            {f.question}
          </summary>
          <p style={{ marginTop: '0.75rem' }}>{f.answer}</p>
        </details>
      ))}
    </div>
  )
}

export function ContactPage() {
  return (
    <div className="container section" style={{ maxWidth: 640 }}>
      <PagePhotoBand photo={PAGE_PHOTOS.contact} />
      <h1>Contact</h1>
      <p>
        Reach the right person directly — no form. Email is best for most
        questions; use the tournament WhatsApp for day-of coordination.
      </p>

      <section style={{ marginTop: '1.75rem' }} aria-labelledby="contact-freetail">
        <h2 id="contact-freetail" style={{ fontSize: '1.35rem' }}>
          Freetail 7s
        </h2>
        <p>
          Tournament director: <strong>{TOURNAMENT_CONTACT.name}</strong>
        </p>
        <ul style={{ paddingLeft: '1.15rem', lineHeight: 1.7 }}>
          <li>
            Email:{' '}
            <a href={`mailto:${TOURNAMENT_CONTACT.email}`}>
              {TOURNAMENT_CONTACT.email}
            </a>
          </li>
          <li>{TOURNAMENT_CONTACT.whatsappLabel}</li>
        </ul>
      </section>

      <section style={{ marginTop: '1.75rem' }} aria-labelledby="contact-legacy">
        <h2 id="contact-legacy" style={{ fontSize: '1.35rem' }}>
          {LEGACY_CONTACT.name}
        </h2>
        <p>Title sponsor &amp; event host — kits, gear, and sponsor questions.</p>
        <ul style={{ paddingLeft: '1.15rem', lineHeight: 1.7 }}>
          <li>
            Email:{' '}
            <a href={`mailto:${LEGACY_CONTACT.email}`}>
              {LEGACY_CONTACT.email}
            </a>
          </li>
          <li>
            Web:{' '}
            <a
              href={LEGACY_CONTACT.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              www.legacyecowear.com
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}

export function UpdatesPage() {
  const updates = useAnnouncements()
  return (
    <div className="container section">
      <PagePhotoBand photo={PAGE_PHOTOS.updates} />
      <h1>Updates</h1>
      {updates.map((u) => (
        <article
          key={u.id}
          style={{
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <h2 style={{ fontSize: '1.5rem' }}>{u.title}</h2>
          <p>{u.body}</p>
        </article>
      ))}
    </div>
  )
}

export function EmailSignupInline() {
  const signup = useEmailSignup()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        await signup(email)
        setDone(true)
        setEmail('')
      }}
      style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
    >
      <TextInput
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email for tournament updates"
        aria-label="Email for tournament updates"
      />
      <Button type="submit">Sign up</Button>
      {done ? <span role="status">You’re on the list.</span> : null}
    </form>
  )
}

export function PrivacyPage() {
  return (
    <div className="container section" style={{ maxWidth: 720 }}>
      <PagePhotoBand photo={PAGE_PHOTOS.privacy} />
      <h1>Privacy</h1>
      <p>
        Freetail 7s collects application and contact information to run the
        tournament. Application data stays private. U18 contact and guardian
        details are not published on the public site. Fan MVP votes use a
        device key for integrity and are not sold.
      </p>
      <p>
        Elite U18: {U18_ELIGIBILITY.summary} See{' '}
        <Link to={RULES_PATH}>Tournament rules</Link> for full eligibility and
        safeguarding notes.
      </p>
      <p>
        Sign-in uses Google or Apple through Firebase Auth. Roles are stored in
        Firestore. Contact the organizer to request access or deletion of your
        data.
      </p>
    </div>
  )
}

export function TermsPage() {
  return (
    <div className="container section" style={{ maxWidth: 720 }}>
      <PagePhotoBand photo={PAGE_PHOTOS.terms} />
      <h1>Terms</h1>
      <p>
        Submitting an application does not guarantee acceptance. Entry is by
        invitation after review. Published schedules and results on this site
        are the official source during the event.
      </p>
      <p>
        Tournament dates: {EVENT_DATES.friday} through {EVENT_DATES.sunday}.
        Base entry fee is ${FEE_ROWS[0].fee} per team, due in full by{' '}
        {EVENT_DATES.paymentDeadline}. Multi-division discounts, kit credit,
        withdrawals, refunds, and prizes are on the{' '}
        <Link to="/apply">Apply</Link> page. {ACCEPTANCE_PAYMENT_SUMMARY}{' '}
        {DIVISION_VIABILITY_SUMMARY}
      </p>
      <p>Withdrawals and refunds: {REFUND_SUMMARY}</p>
      <p>Prizes: {PRIZE_SUMMARY}</p>
      <p>
        By applying or participating, teams agree to the{' '}
        <Link to={RULES_PATH}>Tournament rules</Link>, these terms, the fee
        terms on <Link to="/apply">Apply</Link>, and the{' '}
        <Link to="/privacy">Privacy</Link> policy.
      </p>
    </div>
  )
}
