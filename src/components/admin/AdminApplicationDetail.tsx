import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Button } from '../ui/Button'
import type {
  ApplicationDoc,
  ApplicationStatus,
  RefereeApplicationDoc,
} from '../../types/models'
import {
  REFEREE_POSITION_LABELS,
  SEVENS_COMPETITION_LABELS,
  SEVENS_OFFICIATING_SCOPE_LABELS,
} from '../../types/models'

const STATUSES: ApplicationStatus[] = [
  'submitted',
  'reviewing',
  'accepted',
  'waitlisted',
  'declined',
]

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  if (children == null || children === '') return null
  return (
    <div className="admin-detail__row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

function formatAddress(a: {
  street: string
  city: string
  state: string
  postalCode: string
}) {
  return [a.street, a.city, a.state, a.postalCode].filter(Boolean).join(', ')
}

type TeamProps = {
  kind: 'team'
  app: ApplicationDoc
  onStatusChange: (status: ApplicationStatus) => void
  onClose: () => void
}

type RefereeProps = {
  kind: 'referee'
  app: RefereeApplicationDoc
  onStatusChange: (status: ApplicationStatus) => void
  onClose: () => void
}

export function AdminApplicationDetail(props: TeamProps | RefereeProps) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const title =
    props.kind === 'team'
      ? props.app.teamName
      : `${props.app.firstName} ${props.app.lastName}`

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') props.onClose()
    }
    window.addEventListener('keydown', onKey)
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [props.onClose])

  return (
    <div
      className="admin-detail"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="admin-detail__backdrop"
        aria-label="Close application"
        onClick={props.onClose}
      />
      <div className="admin-detail__panel">
        <header className="admin-detail__header">
          <div>
            <p className="admin-detail__kind">
              {props.kind === 'team' ? 'Team application' : 'Referee application'}
            </p>
            <h2 id={titleId}>{title}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="admin-detail__close"
            onClick={props.onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="admin-detail__status">
          <label htmlFor="admin-app-status">Status</label>
          <select
            id="admin-app-status"
            value={props.app.status}
            onChange={(e) =>
              props.onStatusChange(e.target.value as ApplicationStatus)
            }
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <dl className="admin-detail__grid">
          {props.kind === 'team' ? (
            <>
              <DetailRow label="Organization">
                {props.app.organizationName}
              </DetailRow>
              <DetailRow label="Division">{props.app.divisionCode}</DetailRow>
              <DetailRow label="Hometown">{props.app.hometown}</DetailRow>
              <DetailRow label="Contact">{props.app.contactName}</DetailRow>
              <DetailRow label="Email">
                <a href={`mailto:${props.app.contactEmail}`}>
                  {props.app.contactEmail}
                </a>
              </DetailRow>
              <DetailRow label="Phone">
                <a href={`tel:${props.app.contactPhone}`}>
                  {props.app.contactPhone}
                </a>
              </DetailRow>
              <DetailRow label="Mailing address">
                {formatAddress(props.app.mailingAddress)}
              </DetailRow>
              <DetailRow label="Website">
                {props.app.website ? (
                  <a
                    href={props.app.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {props.app.website}
                  </a>
                ) : null}
              </DetailRow>
              <DetailRow label="Instagram">{props.app.instagram}</DetailRow>
              <DetailRow label="Facebook">{props.app.facebook}</DetailRow>
              <DetailRow label="Legacy kit interest">
                {props.app.legacyKitInterest ? 'Yes' : 'No'}
              </DetailRow>
              <DetailRow label="Notes">{props.app.notes}</DetailRow>
              <DetailRow label="Batch ID">{props.app.batchId}</DetailRow>
              <DetailRow label="Submitted by">{props.app.submittedByUid}</DetailRow>
              <DetailRow label="Submitted">
                {new Date(props.app.createdAt).toLocaleString()}
              </DetailRow>
              <DetailRow label="Updated">
                {new Date(props.app.updatedAt).toLocaleString()}
              </DetailRow>
            </>
          ) : (
            <>
              <DetailRow label="Email">
                <a href={`mailto:${props.app.email}`}>{props.app.email}</a>
              </DetailRow>
              <DetailRow label="Phone">
                <a href={`tel:${props.app.phone}`}>{props.app.phone}</a>
              </DetailRow>
              <DetailRow label="Mailing address">
                {formatAddress(props.app.mailingAddress)}
              </DetailRow>
              <DetailRow label="Years officiating">
                {props.app.yearsOfficiating}
              </DetailRow>
              <DetailRow label="Grade">{props.app.refereeGrade}</DetailRow>
              <DetailRow label="Society">{props.app.refereeSociety}</DetailRow>
              <DetailRow label="Positions">
                {props.app.positions
                  .map((p) => REFEREE_POSITION_LABELS[p])
                  .join(', ')}
              </DetailRow>
              <DetailRow label="Divisions">
                {props.app.divisionCodes.join(', ')}
              </DetailRow>
              <DetailRow label="Highest sevens competition">
                {SEVENS_COMPETITION_LABELS[props.app.highestSevensCompetition]}
                {props.app.highestSevensCompetitionOther
                  ? ` — ${props.app.highestSevensCompetitionOther}`
                  : null}
              </DetailRow>
              <DetailRow label="Sevens scope">
                {SEVENS_OFFICIATING_SCOPE_LABELS[props.app.highestSevensScope]}
              </DetailRow>
              <DetailRow label="Sevens notes">
                {props.app.highestSevensNotes}
              </DetailRow>
              <DetailRow label="Recommendation">
                {props.app.recommendationContact}
              </DetailRow>
              <DetailRow label="Instagram">{props.app.instagram}</DetailRow>
              <DetailRow label="Facebook">{props.app.facebook}</DetailRow>
              <DetailRow label="Match footage">
                {props.app.matchFootageUrl ? (
                  <a
                    href={props.app.matchFootageUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {props.app.matchFootageUrl}
                  </a>
                ) : null}
              </DetailRow>
              <DetailRow label="Submitted by">{props.app.submittedByUid}</DetailRow>
              <DetailRow label="Submitted">
                {new Date(props.app.createdAt).toLocaleString()}
              </DetailRow>
              <DetailRow label="Updated">
                {new Date(props.app.updatedAt).toLocaleString()}
              </DetailRow>
            </>
          )}
        </dl>

        <footer className="admin-detail__footer">
          <Button variant="secondary" onClick={props.onClose}>
            Close
          </Button>
        </footer>
      </div>
    </div>
  )
}
