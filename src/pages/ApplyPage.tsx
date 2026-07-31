import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button, ButtonLink } from '../components/ui/Button'
import {
  Field,
  TextInput,
  TextSelect,
  TextTextarea,
} from '../components/ui/Field'
import {
  useDivisions,
  useEvent,
  useSubmitApplication,
  useSubmitRefereeApplication,
} from '../hooks/useTournament'
import { EVENT_DATES } from '../data/eventCopy'
import type {
  DivisionCode,
  RefereePosition,
  SevensCompetitionLevel,
  SevensOfficiatingScope,
} from '../types/models'
import {
  REFEREE_POSITIONS,
  REFEREE_POSITION_LABELS,
  SEVENS_COMPETITION_LABELS,
  SEVENS_COMPETITION_LEVELS,
  SEVENS_OFFICIATING_SCOPE_LABELS,
  SEVENS_OFFICIATING_SCOPES,
} from '../types/models'
import { APPLY_TRACK_PHOTOS } from '../data/photos'
import { ClickablePhoto } from '../components/media/PhotoLightbox'
import { useAuth } from '../context/auth-context'
import './ApplyPage.css'

/** Public chooser — photos + copy + Apply → sign-in → form */
export function ApplyPage() {
  const event = useEvent()
  const divisions = useDivisions()
  const { user, needsOnboarding } = useAuth()

  if (!event.applicationOpen) {
    return (
      <div className="container section">
        <h1>Applications closed</h1>
        <p>Applications are not open at this time.</p>
      </div>
    )
  }

  const signedInReady = Boolean(user && !needsOnboarding)
  const teamHref = signedInReady
    ? '/apply/team'
    : `/login?next=${encodeURIComponent('/apply/team')}`
  const refereeHref = signedInReady
    ? '/apply/referee'
    : `/login?next=${encodeURIComponent('/apply/referee')}`

  return (
    <div className="container section apply-landing">
      <h1>Apply</h1>
      <p className="apply-landing__intro">
        Join {event.name} as a competing team or as part of the officiating
        crew. Choose a track below — you&apos;ll sign in to complete the
        application.
      </p>

      <div className="apply-panels">
        <article className="apply-panel">
          <div className="apply-panel__media">
            <ClickablePhoto
              photo={APPLY_TRACK_PHOTOS.team}
              photos={[APPLY_TRACK_PHOTOS.team]}
              index={0}
              className="apply-panel__photo"
              loading="eager"
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
          <div className="apply-panel__body">
            <h2>Team application</h2>
            <p>
              Bring your club, school, or program to Freetail 7s. We review
              applications on a rolling basis — divisions can fill before the
              deadline, so don&apos;t wait.
            </p>
            <ul>
              <li>
                Application deadline:{' '}
                <strong>{EVENT_DATES.applicationDeadline}</strong>
              </li>
              <li>
                Entry fee ${event.entryFee} — payment due by{' '}
                <strong>{EVENT_DATES.paymentDeadline}</strong>
              </li>
              <li>
                Eight teams per division · invitation after review
                <ul className="apply-panel__sublist">
                  {divisions.map((d) => (
                    <li key={d.id}>{d.name}</li>
                  ))}
                </ul>
              </li>
            </ul>
            <ButtonLink to={teamHref} size="lg">
              Apply as a team
            </ButtonLink>
          </div>
        </article>

        <article className="apply-panel">
          <div className="apply-panel__media">
            <ClickablePhoto
              photo={APPLY_TRACK_PHOTOS.referee}
              photos={[APPLY_TRACK_PHOTOS.referee]}
              index={0}
              className="apply-panel__photo"
              loading="eager"
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
          <div className="apply-panel__body">
            <h2>Referee application</h2>
            <p>
              Join the officiating crew and help deliver the weekend. Apply
              early; crew spots are filled on a rolling basis and may close
              before the deadline.
            </p>
            <ul>
              <li>
                Application deadline:{' '}
                <strong>{EVENT_DATES.applicationDeadline}</strong>
              </li>
              <li>
                Positions to apply for
                <ul className="apply-panel__sublist">
                  {REFEREE_POSITIONS.map((p) => (
                    <li key={p}>{REFEREE_POSITION_LABELS[p]}</li>
                  ))}
                </ul>
              </li>
              <li>
                Dual hotel or Airbnb lodging provided for accepted officials
              </li>
              <li>Flights to and from the event are not covered</li>
            </ul>
            <ButtonLink to={refereeHref} size="lg">
              Apply as a referee
            </ButtonLink>
          </div>
        </article>
      </div>
    </div>
  )
}

export function TeamApplyPage() {
  const event = useEvent()

  if (!event.applicationOpen) {
    return (
      <div className="container section">
        <h1>Applications closed</h1>
        <p>Team applications are not open at this time.</p>
        <ButtonLink to="/apply" variant="secondary">
          Back to Apply
        </ButtonLink>
      </div>
    )
  }

  return (
    <div className="container section apply-form-page">
      <p className="apply-form-page__back">
        <Link to="/apply">← All application tracks</Link>
      </p>
      <TeamApplyForm />
    </div>
  )
}

export function RefereeApplyPage() {
  const event = useEvent()

  if (!event.applicationOpen) {
    return (
      <div className="container section">
        <h1>Applications closed</h1>
        <p>Referee applications are not open at this time.</p>
        <ButtonLink to="/apply" variant="secondary">
          Back to Apply
        </ButtonLink>
      </div>
    )
  }

  return (
    <div className="container section apply-form-page">
      <p className="apply-form-page__back">
        <Link to="/apply">← All application tracks</Link>
      </p>
      <RefereeApplyForm />
    </div>
  )
}

function TeamApplyForm() {
  const event = useEvent()
  const divisions = useDivisions()
  const submit = useSubmitApplication()
  const { profile, user } = useAuth()
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const defaultContactName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || ''
  const defaultEmail = profile?.email ?? user?.email ?? ''

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setPending(true)
    const form = e.currentTarget
    const fd = new FormData(form)
    try {
      const honeypot = String(fd.get('company') ?? '')
      await submit({
        organizationName: String(fd.get('organizationName')),
        teamName: String(fd.get('teamName')),
        divisionCode: String(fd.get('divisionCode')) as DivisionCode,
        contactName: String(fd.get('contactName')),
        contactEmail: String(fd.get('contactEmail')),
        contactPhone: String(fd.get('contactPhone')),
        location: String(fd.get('location')),
        website: String(fd.get('website') || '') || undefined,
        social: String(fd.get('social') || '') || undefined,
        pairedTeamInterest: fd.get('pairedTeamInterest') === 'on',
        pairedDivisionCode:
          (String(fd.get('pairedDivisionCode') || '') as DivisionCode) ||
          undefined,
        legacyKitInterest: fd.get('legacyKitInterest') === 'on',
        notes: String(fd.get('notes') || '') || undefined,
        honeypot,
      })
      setDone(true)
      form.reset()
    } catch {
      setError('Could not submit application. Try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="apply-form">
      <h1>Team application</h1>
      <p>
        Working entry fee ${event.entryFee}. Apply by{' '}
        {EVENT_DATES.applicationDeadline} (rolling acceptance). Payment deadline{' '}
        {EVENT_DATES.paymentDeadline}.
      </p>

      {done ? (
        <p role="status" className="apply-form__success">
          Application received. The organizer will review it privately and follow
          up by email.
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="apply-form__error">
          {error}
        </p>
      ) : null}

      <form onSubmit={onSubmit} noValidate>
        <div className="hp" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" tabIndex={-1} autoComplete="off" />
        </div>
        <Field label="Organization" htmlFor="organizationName">
          <TextInput id="organizationName" name="organizationName" required />
        </Field>
        <Field label="Team name" htmlFor="teamName">
          <TextInput id="teamName" name="teamName" required maxLength={120} />
        </Field>
        <Field label="Division" htmlFor="divisionCode">
          <TextSelect id="divisionCode" name="divisionCode" required>
            {divisions.map((d) => (
              <option key={d.id} value={d.code}>
                {d.name}
              </option>
            ))}
          </TextSelect>
        </Field>
        <Field label="Contact name" htmlFor="contactName">
          <TextInput
            id="contactName"
            name="contactName"
            required
            defaultValue={defaultContactName}
          />
        </Field>
        <Field label="Contact email" htmlFor="contactEmail">
          <TextInput
            id="contactEmail"
            name="contactEmail"
            type="email"
            required
            defaultValue={defaultEmail}
          />
        </Field>
        <Field label="Contact phone" htmlFor="contactPhone">
          <TextInput id="contactPhone" name="contactPhone" required />
        </Field>
        <Field label="Location" htmlFor="location">
          <TextInput id="location" name="location" required />
        </Field>
        <Field label="Website" htmlFor="website" hint="Optional">
          <TextInput id="website" name="website" type="url" />
        </Field>
        <Field label="Social profile" htmlFor="social" hint="Optional">
          <TextInput id="social" name="social" />
        </Field>
        <label className="apply-check">
          <input type="checkbox" name="pairedTeamInterest" />
          Interested in paired boys/girls or men/women entry
        </label>
        <Field label="Paired division (if any)" htmlFor="pairedDivisionCode">
          <TextSelect id="pairedDivisionCode" name="pairedDivisionCode">
            <option value="">None</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.code}>
                {d.name}
              </option>
            ))}
          </TextSelect>
        </Field>
        <label className="apply-check">
          <input type="checkbox" name="legacyKitInterest" />
          Interested in Legacy Ecowear kit incentive
        </label>
        <Field label="Notes" htmlFor="notes">
          <TextTextarea id="notes" name="notes" />
        </Field>
        <p className="apply-form__fine">
          By submitting you acknowledge the event terms and privacy policy.
        </p>
        <Button type="submit" disabled={pending}>
          {pending ? 'Submitting…' : 'Submit team application'}
        </Button>
      </form>
    </div>
  )
}

function RefereeApplyForm() {
  const divisions = useDivisions()
  const submit = useSubmitRefereeApplication()
  const { profile, user } = useAuth()
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [competition, setCompetition] =
    useState<SevensCompetitionLevel>('localClub')

  const defaultEmail = profile?.email ?? user?.email ?? ''

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setPending(true)
    const form = e.currentTarget
    const fd = new FormData(form)
    try {
      const honeypot = String(fd.get('website_url') ?? '')
      const positions = REFEREE_POSITIONS.filter(
        (p) => fd.get(`position_${p}`) === 'on',
      ) as RefereePosition[]
      const divisionCodes = divisions
        .map((d) => d.code)
        .filter((code) => fd.get(`division_${code}`) === 'on') as DivisionCode[]

      if (positions.length === 0) {
        throw new Error('Select at least one position.')
      }
      if (divisionCodes.length === 0) {
        throw new Error('Select at least one division.')
      }

      const yearsRaw = Number(fd.get('yearsOfficiating'))
      if (!Number.isFinite(yearsRaw) || yearsRaw < 0 || yearsRaw > 80) {
        throw new Error('Enter a valid number of years officiating.')
      }

      const highestSevensCompetition = String(
        fd.get('highestSevensCompetition'),
      ) as SevensCompetitionLevel
      const otherDetail = String(fd.get('highestSevensCompetitionOther') || '')

      await submit({
        firstName: String(fd.get('firstName')).trim(),
        lastName: String(fd.get('lastName')).trim(),
        email: String(fd.get('email')).trim(),
        phone: String(fd.get('phone')).trim(),
        mailingAddress: {
          street: String(fd.get('street')).trim(),
          city: String(fd.get('city')).trim(),
          state: String(fd.get('state')).trim(),
          postalCode: String(fd.get('postalCode')).trim(),
          country: String(fd.get('country') || 'United States').trim(),
        },
        yearsOfficiating: yearsRaw,
        refereeGrade: String(fd.get('refereeGrade') || '').trim() || undefined,
        divisionCodes,
        positions,
        refereeSociety: String(fd.get('refereeSociety')).trim(),
        recommendationContact:
          String(fd.get('recommendationContact') || '').trim() || undefined,
        highestSevensCompetition,
        highestSevensCompetitionOther: otherDetail.trim() || undefined,
        highestSevensScope: String(
          fd.get('highestSevensScope'),
        ) as SevensOfficiatingScope,
        highestSevensNotes:
          String(fd.get('highestSevensNotes') || '').trim() || undefined,
        notes: String(fd.get('notes') || '').trim() || undefined,
        honeypot,
      })
      setDone(true)
      form.reset()
      setCompetition('localClub')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not submit application. Try again.',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="apply-form">
      <h1>Referee application</h1>
      <p>
        Apply by {EVENT_DATES.applicationDeadline} (rolling acceptance). Dual
        hotel or Airbnb lodging is provided for accepted officials; flights to
        and from the event are not covered. Assignments are coordinated with
        Project Pōpolo.
      </p>

      {done ? (
        <p role="status" className="apply-form__success">
          Referee application received. We&apos;ll review it and follow up by
          email.
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="apply-form__error">
          {error}
        </p>
      ) : null}

      <form onSubmit={onSubmit} noValidate>
        <div className="hp" aria-hidden="true">
          <label htmlFor="website_url">Website</label>
          <input
            id="website_url"
            name="website_url"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="apply-form__row">
          <Field label="First name" htmlFor="firstName">
            <TextInput
              id="firstName"
              name="firstName"
              required
              maxLength={80}
              defaultValue={profile?.firstName ?? ''}
            />
          </Field>
          <Field label="Last name" htmlFor="lastName">
            <TextInput
              id="lastName"
              name="lastName"
              required
              maxLength={80}
              defaultValue={profile?.lastName ?? ''}
            />
          </Field>
        </div>

        <Field label="Email address" htmlFor="email">
          <TextInput
            id="email"
            name="email"
            type="email"
            required
            defaultValue={defaultEmail}
          />
        </Field>
        <Field label="Phone number" htmlFor="phone">
          <TextInput id="phone" name="phone" type="tel" required />
        </Field>

        <fieldset className="apply-fieldset">
          <legend>Mailing address</legend>
          <Field label="Street" htmlFor="street">
            <TextInput
              id="street"
              name="street"
              required
              autoComplete="street-address"
            />
          </Field>
          <div className="apply-form__row">
            <Field label="City" htmlFor="city">
              <TextInput
                id="city"
                name="city"
                required
                autoComplete="address-level2"
              />
            </Field>
            <Field label="State" htmlFor="state">
              <TextInput
                id="state"
                name="state"
                required
                autoComplete="address-level1"
              />
            </Field>
          </div>
          <div className="apply-form__row">
            <Field label="Postal code" htmlFor="postalCode">
              <TextInput
                id="postalCode"
                name="postalCode"
                required
                autoComplete="postal-code"
              />
            </Field>
            <Field label="Country" htmlFor="country">
              <TextInput
                id="country"
                name="country"
                required
                defaultValue="United States"
                autoComplete="country-name"
              />
            </Field>
          </div>
        </fieldset>

        <Field
          label="Years of officiating experience"
          htmlFor="yearsOfficiating"
        >
          <TextInput
            id="yearsOfficiating"
            name="yearsOfficiating"
            type="number"
            min={0}
            max={80}
            step={1}
            required
          />
        </Field>
        <Field
          label="Referee grade"
          htmlFor="refereeGrade"
          hint="If known — optional"
        >
          <TextInput id="refereeGrade" name="refereeGrade" />
        </Field>

        <fieldset className="apply-fieldset">
          <legend>Divisions interested in</legend>
          <div className="apply-checks">
            {divisions.map((d) => (
              <label key={d.id} className="apply-check">
                <input type="checkbox" name={`division_${d.code}`} />
                {d.name}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="apply-fieldset">
          <legend>Positions interested in</legend>
          <div className="apply-checks">
            {REFEREE_POSITIONS.map((p) => (
              <label key={p} className="apply-check">
                <input type="checkbox" name={`position_${p}`} />
                {REFEREE_POSITION_LABELS[p]}
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="Referee society" htmlFor="refereeSociety">
          <TextInput id="refereeSociety" name="refereeSociety" required />
        </Field>
        <Field
          label="Recommendation contact"
          htmlFor="recommendationContact"
          hint="Optional — name and phone or email"
        >
          <TextInput id="recommendationContact" name="recommendationContact" />
        </Field>

        <fieldset className="apply-fieldset">
          <legend>Highest level of sevens officiated</legend>
          <p className="apply-fieldset__hint">
            Tell us the highest sevens competition you have worked, and whether
            that was local only or a higher tier (for example local Men&apos;s
            qualifiers vs national Men&apos;s sevens vs HSBC Sevens).
          </p>
          <Field
            label="Highest sevens competition"
            htmlFor="highestSevensCompetition"
          >
            <TextSelect
              id="highestSevensCompetition"
              name="highestSevensCompetition"
              required
              value={competition}
              onChange={(e) =>
                setCompetition(e.target.value as SevensCompetitionLevel)
              }
            >
              {SEVENS_COMPETITION_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {SEVENS_COMPETITION_LABELS[level]}
                </option>
              ))}
            </TextSelect>
          </Field>
          {competition === 'other' ? (
            <Field
              label="Describe the competition"
              htmlFor="highestSevensCompetitionOther"
            >
              <TextInput
                id="highestSevensCompetitionOther"
                name="highestSevensCompetitionOther"
                required
              />
            </Field>
          ) : (
            <input type="hidden" name="highestSevensCompetitionOther" value="" />
          )}
          <Field
            label="At what level / scope"
            htmlFor="highestSevensScope"
            hint="Was that appointment local, regional, national, or international?"
          >
            <TextSelect
              id="highestSevensScope"
              name="highestSevensScope"
              required
              defaultValue="local"
            >
              {SEVENS_OFFICIATING_SCOPES.map((scope) => (
                <option key={scope} value={scope}>
                  {SEVENS_OFFICIATING_SCOPE_LABELS[scope]}
                </option>
              ))}
            </TextSelect>
          </Field>
          <Field
            label="More detail on sevens experience"
            htmlFor="highestSevensNotes"
            hint="Optional — events, years, or notable appointments"
          >
            <TextTextarea id="highestSevensNotes" name="highestSevensNotes" />
          </Field>
        </fieldset>

        <Field label="Additional notes" htmlFor="notes" hint="Optional">
          <TextTextarea id="notes" name="notes" />
        </Field>
        <p className="apply-form__fine">
          By submitting you acknowledge the event terms and privacy policy.
        </p>
        <Button type="submit" disabled={pending}>
          {pending ? 'Submitting…' : 'Submit referee application'}
        </Button>
      </form>
    </div>
  )
}
