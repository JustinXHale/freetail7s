import { Link } from 'react-router-dom'
import { EVENT_DATES } from '../../data/eventCopy'
import type { TournamentPhoto } from '../../data/photos'
import {
  ACCEPTANCE_PAYMENT_SUMMARY,
  DIVISION_VIABILITY_SUMMARY,
  FEE_ROWS,
  KIT_DISCOUNT,
  KIT_DISCOUNT_SUMMARY,
  LEGACY_CONTACT,
  PRIZE_SUMMARY,
  REFUND_SUMMARY,
  RULES_PATH,
} from '../../data/tournamentRules'
import { ClickablePhoto } from '../media/PhotoLightbox'
import './EntryFeeTable.css'

const KIT_FLYER: TournamentPhoto = {
  src: '/sponsors/LegacyEcowearFreetailPromotion.jpg',
  alt: 'Legacy Ecowear Freetail 7s kit promotion',
}

type EntryFeeTableProps = {
  /** Section id for in-page jump links */
  id?: string
  className?: string
}

export function EntryFeeTable({
  id = 'entry-fees',
  className,
}: EntryFeeTableProps) {
  const classes = ['apply-fees', className].filter(Boolean).join(' ')
  return (
    <section className={classes} id={id} aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`}>Fees, refunds, and prizes</h2>
      <p>
        Fees apply after invitation — there is no charge to apply. The base rate
        is <strong>${FEE_ROWS[0].fee}</strong> per team for one division.
        Payment is due in full by{' '}
        <strong>{EVENT_DATES.paymentDeadline}</strong>.{' '}
        {ACCEPTANCE_PAYMENT_SUMMARY}
      </p>
      <p>
        If more than one team from the same organization is accepted, each team
        pays the multi-division rate below. Rates lock when teams are accepted —
        they do not change later if another side withdraws.
      </p>
      <table className="apply-fees__table tabular">
        <thead>
          <tr>
            <th scope="col">Accepted teams from the same organization</th>
            <th scope="col">Fee per team</th>
          </tr>
        </thead>
        <tbody>
          {FEE_ROWS.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td>${row.fee}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <aside className="apply-fees__kit" aria-labelledby={`${id}-kit-heading`}>
        <div className="apply-fees__kit-copy">
          <p className="apply-fees__kit-eyebrow">Title sponsor offer</p>
          <h3 id={`${id}-kit-heading`}>
            Legacy Ecowear kit credit — ${KIT_DISCOUNT} off
          </h3>
          <p>{KIT_DISCOUNT_SUMMARY}</p>
          <p>
            Mark kit interest on the{' '}
            <Link to="/apply/team">team application</Link> so we can follow up
            with ordering details.
          </p>
          <p>
            Kit questions:{' '}
            <a href={`mailto:${LEGACY_CONTACT.email}`}>
              {LEGACY_CONTACT.email}
            </a>
          </p>
        </div>
        <figure className="apply-fees__flyer">
          <ClickablePhoto
            photo={KIT_FLYER}
            photos={[KIT_FLYER]}
            index={0}
            width={720}
            height={900}
            loading="lazy"
          />
        </figure>
      </aside>
      <ul className="apply-fees__notes">
        <li>
          Multi-division pricing applies when multiple teams from the same
          organization are accepted (register them together on one form — one
          team per division).
        </li>
        <li>
          <strong>Withdrawals and refunds:</strong> {REFUND_SUMMARY}
        </li>
        <li>
          <strong>Prizes:</strong> {PRIZE_SUMMARY}
        </li>
        <li>{DIVISION_VIABILITY_SUMMARY}</li>
        <li>
          On-field competition rules and Elite U18 eligibility:{' '}
          <Link to={RULES_PATH}>Tournament rules</Link>.
        </li>
      </ul>
    </section>
  )
}
