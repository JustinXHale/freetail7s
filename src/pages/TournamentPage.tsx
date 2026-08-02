import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/ui/Button'
import { JumpLinks } from '../components/layout/JumpLinks'
import { EVENT_DATES } from '../data/eventCopy'
import { useEvent } from '../hooks/useTournament'
import { PAGE_PHOTOS, WINNERS_2022, WINNERS_2023 } from '../data/photos'
import { PagePhotoBand, PhotoGrid } from '../components/media/PhotoLightbox'
import { PRIZE_SUMMARY, RULES_PATH } from '../data/tournamentRules'

const HISTORY_JUMPS = [
  { id: 'past', label: 'Past tournaments' },
  { id: 'y2027', label: '2027' },
  { id: 'weekend', label: 'Weekend plan' },
  { id: 'entry', label: 'Entry' },
]

/** History / about the tournament (nav: About → History) */
export function TournamentPage() {
  const event = useEvent()
  return (
    <div className="container section" style={{ maxWidth: 900 }}>
      <PagePhotoBand
        photo={PAGE_PHOTOS.about}
        gallery={[WINNERS_2022[0], WINNERS_2023[0], WINNERS_2023[1], WINNERS_2022[5]]}
        label="Tournament history photos"
      />
      <h1>History</h1>
      <JumpLinks links={HISTORY_JUMPS} />
      <p>
        Freetail Events started in March 2019 in Austin, Texas, to run a
        world-class rugby tournament: Freetail 7s. The name comes from the
        Mexican free-tailed bat.
      </p>
      <p>
        {event.name} returns {EVENT_DATES.friday} through {EVENT_DATES.sunday}{' '}
        at {event.venueName}. Title sponsor and event host: Legacy Ecowear.
      </p>

      <h2 id="past" className="jump-target">
        2019
      </h2>
      <p>
        The first tournament fielded 8 men’s and 3 women’s teams (11 total).
        Phoenix Rugby (powered by Scion) won the women’s championship over the
        Central Queensland Dingoes. Atlantis Rugby men beat Lomaiviti USA (Santa
        Rosa, California). Referee kit sponsors: Techline Tools and Smartish.
      </p>

      <h2 id="y2020" className="jump-target">
        2020
      </h2>
      <p>No tournament — Freetail Events did not stage an event in 2020.</p>

      <h2 id="y2021" className="jump-target">
        2021
      </h2>
      <p>
        Eight men’s teams competed, and the women’s bracket grew to 7 (15 teams
        total). Chicago Lions beat 2019 champions Phoenix in the women’s cup.
        Hartford Harpooners (M) defeated reigning champs Atlantis. National
        Athletic Village edged Chicago Lions in the men’s third-place match —
        an early signal before NAV’s 2022 men’s club national title. US Army (W)
        took third over the Air Force Warthogs (W). Harpooners (W) and the
        Raggamuffins won the women’s and men’s bowls. Referee kit sponsors:
        Smartish and 4th Tap Brewing Co-Op.
      </p>

      <h2 id="y2022" className="jump-target">
        2022
      </h2>
      <p>
        Freetail returned with club sides chasing cup, plate, and bowl hardware
        across the men’s and women’s brackets. National Athletic Village took
        the men’s championship.
      </p>
      <PhotoGrid photos={WINNERS_2022} />

      <h2 id="y2023" className="jump-target">
        2023
      </h2>
      <p>
        Another New Year weekend of sevens — champions, runners-up, and
        placement winners across men’s and women’s competition, capped by
        celebration under the lights.
      </p>
      <PhotoGrid photos={WINNERS_2023} />

      <h2 id="y2027" className="jump-target">
        2027
      </h2>
      <p>
        Premier Men, Premier Women, Elite U18 Boys, and Elite U18 Girls — eight
        teams each, with placements first through eighth across the weekend.
      </p>

      <h2 id="weekend" className="jump-target">
        Weekend plan
      </h2>
      <ul>
        <li>
          <strong>{EVENT_DATES.friday}:</strong> Elite U18 Boys and Girls pool
          play
        </li>
        <li>
          <strong>{EVENT_DATES.saturday}:</strong> Elite U18 knockout and
          placement; first two Premier pool rounds
        </li>
        <li>
          <strong>{EVENT_DATES.sunday}:</strong> Final Premier pool round;
          adult knockout and placement
        </li>
      </ul>

      <h2 id="entry" className="jump-target">
        Entry
      </h2>
      <p>
        Entry fee ${event.entryFee} per team (multi-division and kit discounts
        available). Fees are due in full by {EVENT_DATES.paymentDeadline}. Fee
        tables, refunds, and prizes are on <Link to="/apply">Apply</Link>.
      </p>
      <p>{PRIZE_SUMMARY}</p>
      <p>
        On-field eligibility and format:{' '}
        <Link to={RULES_PATH}>Tournament rules</Link>.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <ButtonLink to="/apply">Apply</ButtonLink>
        <ButtonLink to={RULES_PATH} variant="secondary">
          Tournament rules
        </ButtonLink>
        <ButtonLink to="/faq" variant="secondary">
          FAQ
        </ButtonLink>
      </div>

      <p style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
        Earlier tournament notes from{' '}
        <a
          href="https://freetail7s.com/2022/08/16/about-freetail-7s/"
          target="_blank"
          rel="noopener noreferrer"
        >
          freetail7s.com
        </a>
        .
      </p>
    </div>
  )
}
