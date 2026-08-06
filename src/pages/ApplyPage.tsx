import { useMemo, useState, type FormEvent } from 'react'
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
import {
  ACCEPTANCE_PAYMENT_SUMMARY,
  DIVISION_VIABILITY_SUMMARY,
  KIT_DISCOUNT,
  RULES_PATH,
} from '../data/tournamentRules'
import { EntryFeeTable } from '../components/tournament/EntryFeeTable'
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
              Bring your club, school, or program to Freetail 7s. Applying is
              free — entry fees are charged only after a team is accepted.
            </p>
            <ul>
              <li>
                Application deadline:{' '}
                <strong>{EVENT_DATES.applicationDeadline}</strong>
              </li>
              <li>
                Eight teams per division · invitation after review
                <ul className="apply-panel__sublist">
                  {divisions.map((d) => (
                    <li key={d.id}>{d.name}</li>
                  ))}
                </ul>
              </li>
              <li>
                Rolling review — divisions can fill before the deadline
              </li>
              <li>
                <Link to={RULES_PATH}>Tournament rules</Link> · eligibility and
                format
              </li>
            </ul>
            <ButtonLink to={teamHref} size="lg">
              Apply as a team
            </ButtonLink>
            {import.meta.env.DEV ? (
              <p className="apply-panel__preview">
                <Link to="/apply/team?preview=1">Local form preview</Link>
                {' '}
                (dev only, skips sign-in)
              </p>
            ) : null}
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
                Role(s) to apply for
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
            {import.meta.env.DEV ? (
              <p className="apply-panel__preview">
                <Link to="/apply/referee?preview=1">Local form preview</Link>
                {' '}
                (dev only, skips sign-in)
              </p>
            ) : null}
          </div>
        </article>
      </div>

      <section className="apply-info" aria-labelledby="team-apply-heading">
        <h2 id="team-apply-heading">How team applications work</h2>
        <ol className="apply-info__steps">
          <li>
            <strong>Sign in</strong> with Google or Apple (required to submit).
          </li>
          <li>
            <strong>Register up to four teams in one form</strong> — one per
            division. Shared contact details are reused; each team still becomes
            its own application for review and multi-division pricing.
          </li>
          <li>
            <strong>We review privately on a rolling basis.</strong> Acceptance
            is by invitation. Applying does not guarantee a place; divisions can
            fill before the deadline.
          </li>
          <li>
            <strong>If invited,</strong> you&apos;ll get payment instructions by
            email. Fees are due in full by{' '}
            <strong>{EVENT_DATES.paymentDeadline}</strong>.{' '}
            {ACCEPTANCE_PAYMENT_SUMMARY}
          </li>
          <li>
            {DIVISION_VIABILITY_SUMMARY} Withdrawals, refunds, and prizes are
            summarized below.
          </li>
        </ol>
        <p>
          The form collects your organization / team name, contact person,
          mailing address, hometown, and per-team division, social links, and
          Legacy Ecowear kit credit interest (${KIT_DISCOUNT} off that
          team&apos;s fee).
        </p>
      </section>

      <EntryFeeTable />
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

type TeamSlot = {
  id: string
  teamName: string
  /** False until the applicant edits this card’s team name */
  nameCustomized: boolean
  divisionCode: DivisionCode | ''
  instagram: string
  facebook: string
  legacyKitInterest: boolean
  open: boolean
}

function emptyTeamSlot(open: boolean, teamName = ''): TeamSlot {
  return {
    id: crypto.randomUUID(),
    teamName,
    nameCustomized: false,
    divisionCode: '',
    instagram: '',
    facebook: '',
    legacyKitInterest: false,
    open,
  }
}

function TeamApplyForm() {
  const divisions = useDivisions()
  const submit = useSubmitApplication()
  const { profile, user } = useAuth()
  const [done, setDone] = useState(false)
  const [submittedCount, setSubmittedCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [teamCount, setTeamCount] = useState(1)
  const [organizationName, setOrganizationName] = useState('')
  const [defaultTeamName, setDefaultTeamName] = useState('')
  const [teams, setTeams] = useState<TeamSlot[]>(() => [emptyTeamSlot(true)])

  const defaultContactName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || ''
  const defaultEmail = profile?.email ?? user?.email ?? ''

  const maxTeams = Math.min(4, divisions.length)

  function setCount(next: number) {
    const n = Math.max(1, Math.min(maxTeams, next))
    setTeamCount(n)
    setTeams((prev) => {
      if (n === prev.length) return prev
      if (n < prev.length) return prev.slice(0, n)
      const added = Array.from({ length: n - prev.length }, (_, i) =>
        emptyTeamSlot(prev.length === 0 && i === 0, defaultTeamName),
      )
      return [...prev, ...added]
    })
  }

  function onDefaultTeamNameChange(value: string) {
    setDefaultTeamName(value)
    setTeams((prev) =>
      prev.map((t) =>
        t.nameCustomized ? t : { ...t, teamName: value },
      ),
    )
  }

  function updateTeam(id: string, patch: Partial<TeamSlot>) {
    setTeams((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    )
  }

  const divisionOptions = useMemo(
    () => divisions.map((d) => ({ code: d.code, name: d.name })),
    [divisions],
  )

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setPending(true)
    const form = e.currentTarget
    const fd = new FormData(form)
    try {
      const honeypot = String(fd.get('company') ?? '')
      const orgName = organizationName.trim()
      if (!orgName) {
        throw new Error('Organization name is required.')
      }
      if (teams.some((t) => !t.teamName.trim())) {
        throw new Error('Each team needs a team name.')
      }
      const codes = teams.map((t) => t.divisionCode)
      if (codes.some((c) => !c)) {
        throw new Error('Choose a division for each team.')
      }
      if (new Set(codes).size !== codes.length) {
        throw new Error('Each team must be in a different division.')
      }

      const mailingAddress = {
        street: String(fd.get('street')),
        city: String(fd.get('city')),
        state: String(fd.get('state')),
        postalCode: String(fd.get('postalCode')),
        country: String(fd.get('country') || 'United States'),
      }
      const batchId =
        teams.length > 1 ? `batch-${crypto.randomUUID()}` : undefined
      const shared = {
        organizationName: orgName,
        contactName: String(fd.get('contactName')),
        contactEmail: String(fd.get('contactEmail')),
        contactPhone: String(fd.get('contactPhone')),
        mailingAddress,
        hometown: String(fd.get('hometown')),
        website: String(fd.get('website') || '') || undefined,
        notes: String(fd.get('notes') || '') || undefined,
        batchId,
        honeypot,
      }

      await submit(
        teams.map((t) => ({
          ...shared,
          teamName: t.teamName.trim(),
          divisionCode: t.divisionCode as DivisionCode,
          instagram: t.instagram.trim() || undefined,
          facebook: t.facebook.trim() || undefined,
          legacyKitInterest: t.legacyKitInterest,
        })),
      )
      setSubmittedCount(teams.length)
      setDone(true)
      form.reset()
      setTeamCount(1)
      setOrganizationName('')
      setDefaultTeamName('')
      setTeams([emptyTeamSlot(true)])
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
    <div className="apply-form apply-form--wide">
      <h1>Team application</h1>
      <p>
        Applying is free. If invited, the entry fee is due by{' '}
        {EVENT_DATES.paymentDeadline}. Deadline to apply:{' '}
        {EVENT_DATES.applicationDeadline} (rolling review). Fee, refund, and
        prize details are on the <Link to="/apply">Apply</Link> page; on-field
        eligibility is in the <Link to={RULES_PATH}>Tournament rules</Link>.
      </p>

      {done ? (
        <p role="status" className="apply-form__success">
          {submittedCount > 1
            ? `${submittedCount} applications received (one per team). `
            : 'Application received. '}
          The organizer will review privately and follow up by email.
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

        <Field
          label="How many teams are you registering?"
          htmlFor="teamCount"
          hint={`One team per division · max ${maxTeams}. Contact details below are shared; each team still gets its own application.`}
        >
          <TextSelect
            id="teamCount"
            value={String(teamCount)}
            onChange={(e) => setCount(Number(e.target.value))}
          >
            {Array.from({ length: maxTeams }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'team' : 'teams'}
              </option>
            ))}
          </TextSelect>
        </Field>

        <fieldset className="apply-fieldset">
          <legend>Shared contact details</legend>
          <p className="apply-fieldset__hint">
            Used for every team in this submission.
          </p>

          <div className="apply-form__row">
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
          </div>

          <Field label="Contact phone" htmlFor="contactPhone">
            <TextInput id="contactPhone" name="contactPhone" required />
          </Field>

          <div className="apply-form__row">
            <Field
              label="Organization"
              htmlFor="organizationName"
              hint="Club, school, or program"
            >
              <TextInput
                id="organizationName"
                name="organizationName"
                required
                maxLength={120}
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            </Field>
            <Field
              label="Team name"
              htmlFor="defaultTeamName"
              hint="Pre-fills each team below — change per card if a side uses a different name"
            >
              <TextInput
                id="defaultTeamName"
                name="defaultTeamName"
                required
                maxLength={120}
                value={defaultTeamName}
                onChange={(e) => onDefaultTeamNameChange(e.target.value)}
              />
            </Field>
          </div>

          <Field label="Street address" htmlFor="street">
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

          <Field
            label="Team hometown"
            htmlFor="hometown"
            hint="City or metro fans will recognize (may differ from mailing address)"
          >
            <TextInput id="hometown" name="hometown" required />
          </Field>

          <Field label="Website" htmlFor="website" hint="Optional">
            <TextInput id="website" name="website" type="url" />
          </Field>
        </fieldset>

        <h2 className="apply-form__section-title">
          {teamCount > 1 ? 'Each team' : 'Team details'}
        </h2>
        <p className="apply-form__section-lead">
          Team name, division, socials, and kit credit
          {teamCount > 1 ? ' — one card per application' : ''}.
        </p>

        <div className="apply-team-cards">
          {teams.map((team, index) => {
            const usedElsewhere = new Set(
              teams
                .filter((t) => t.id !== team.id && t.divisionCode)
                .map((t) => t.divisionCode),
            )
            const divisionLabel = team.divisionCode
              ? divisionOptions.find((d) => d.code === team.divisionCode)?.name
              : null
            const title =
              team.teamName.trim() ||
              divisionLabel ||
              `Team ${index + 1}`

            return (
              <details
                key={team.id}
                className="apply-team-card"
                open={team.open}
                onToggle={(e) =>
                  updateTeam(team.id, {
                    open: (e.target as HTMLDetailsElement).open,
                  })
                }
              >
                <summary className="apply-team-card__summary">
                  <span className="apply-team-card__eyebrow">
                    Application {index + 1} of {teams.length}
                    {divisionLabel ? ` · ${divisionLabel}` : ''}
                  </span>
                  <span className="apply-team-card__title">{title}</span>
                </summary>
                <div className="apply-team-card__body">
                  <Field
                    label="Team name"
                    htmlFor={`teamName-${team.id}`}
                    hint={
                      teamCount > 1
                        ? 'Change if this side uses a different name than the organization default'
                        : undefined
                    }
                  >
                    <TextInput
                      id={`teamName-${team.id}`}
                      required
                      maxLength={120}
                      value={team.teamName}
                      onChange={(e) =>
                        updateTeam(team.id, {
                          teamName: e.target.value,
                          nameCustomized: true,
                        })
                      }
                    />
                  </Field>
                  <Field
                    label="Division"
                    htmlFor={`division-${team.id}`}
                  >
                    <TextSelect
                      id={`division-${team.id}`}
                      required
                      value={team.divisionCode}
                      onChange={(e) =>
                        updateTeam(team.id, {
                          divisionCode: e.target.value as DivisionCode | '',
                        })
                      }
                    >
                      <option value="">Select division</option>
                      {divisionOptions.map((d) => (
                        <option
                          key={d.code}
                          value={d.code}
                          disabled={usedElsewhere.has(d.code)}
                        >
                          {d.name}
                          {usedElsewhere.has(d.code) ? ' (already selected)' : ''}
                        </option>
                      ))}
                    </TextSelect>
                  </Field>
                  <div className="apply-form__row">
                    <Field
                      label="Instagram"
                      htmlFor={`ig-${team.id}`}
                      hint="Optional · handle or URL"
                    >
                      <TextInput
                        id={`ig-${team.id}`}
                        value={team.instagram}
                        onChange={(e) =>
                          updateTeam(team.id, { instagram: e.target.value })
                        }
                        placeholder="@yourclub"
                      />
                    </Field>
                    <Field
                      label="Facebook"
                      htmlFor={`fb-${team.id}`}
                      hint="Optional · page or URL"
                    >
                      <TextInput
                        id={`fb-${team.id}`}
                        value={team.facebook}
                        onChange={(e) =>
                          updateTeam(team.id, { facebook: e.target.value })
                        }
                      />
                    </Field>
                  </div>
                  <label className="apply-check apply-check--kit">
                    <input
                      type="checkbox"
                      checked={team.legacyKitInterest}
                      onChange={(e) =>
                        updateTeam(team.id, {
                          legacyKitInterest: e.target.checked,
                        })
                      }
                    />
                    <span>
                      <strong>
                        Legacy Ecowear kit credit — ${KIT_DISCOUNT} off this
                        team:
                      </strong>{' '}
                      interested in the Freetail custom kit package (stacks with
                      multi-division pricing)
                    </span>
                  </label>
                </div>
              </details>
            )
          })}
        </div>

        <Field label="Notes" htmlFor="notes" hint="Optional · applies to this submission">
          <TextTextarea id="notes" name="notes" />
        </Field>
        <p className="apply-form__fine">
          {DIVISION_VIABILITY_SUMMARY} {ACCEPTANCE_PAYMENT_SUMMARY}
        </p>
        <p className="apply-form__fine">
          By submitting you acknowledge the{' '}
          <Link to={RULES_PATH}>tournament rules</Link>,{' '}
          <Link to="/terms">terms</Link>, and{' '}
          <Link to="/privacy">privacy</Link> policy, including the fee and
          refund terms on the <Link to="/apply">Apply</Link> page. Each team
          above is stored as a separate application.
        </p>
        <Button type="submit" disabled={pending}>
          {pending
            ? 'Submitting…'
            : teamCount > 1
              ? `Submit ${teamCount} applications`
              : 'Submit team application'}
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
        throw new Error('Select at least one role.')
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
      const footageRaw = String(fd.get('matchFootageUrl') || '').trim()

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
        instagram: String(fd.get('instagram') || '').trim() || undefined,
        facebook: String(fd.get('facebook') || '').trim() || undefined,
        highestSevensCompetition,
        highestSevensCompetitionOther: otherDetail.trim() || undefined,
        highestSevensScope: String(
          fd.get('highestSevensScope'),
        ) as SevensOfficiatingScope,
        highestSevensNotes:
          String(fd.get('highestSevensNotes') || '').trim() || undefined,
        matchFootageUrl: footageRaw || undefined,
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

        <div className="apply-form__row">
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
        </div>

        <div className="apply-form__row">
          <Field
            label="Instagram"
            htmlFor="instagram"
            hint="Optional · handle or URL"
          >
            <TextInput
              id="instagram"
              name="instagram"
              placeholder="@yourhandle"
            />
          </Field>
          <Field
            label="Facebook"
            htmlFor="facebook"
            hint="Optional · page or URL"
          >
            <TextInput id="facebook" name="facebook" />
          </Field>
        </div>

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

        <div className="apply-form__row">
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
        </div>

        <div className="apply-form__row apply-form__row--align-start">
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
            <legend>Role(s)</legend>
            <div className="apply-checks">
              {REFEREE_POSITIONS.map((p) => (
                <label key={p} className="apply-check">
                  <input type="checkbox" name={`position_${p}`} />
                  {REFEREE_POSITION_LABELS[p]}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="apply-form__row">
          <Field label="Referee society" htmlFor="refereeSociety">
            <TextInput id="refereeSociety" name="refereeSociety" required />
          </Field>
          <Field
            label="Recommendation contact"
            htmlFor="recommendationContact"
            hint="Optional — name and phone or email"
          >
            <TextInput
              id="recommendationContact"
              name="recommendationContact"
            />
          </Field>
        </div>

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

        <Field
          label="Match footage link"
          htmlFor="matchFootageUrl"
          hint="Optional — preferably sevens (YouTube, Hudl, Google Drive, etc.)"
        >
          <TextInput
            id="matchFootageUrl"
            name="matchFootageUrl"
            type="url"
            placeholder="https://"
          />
        </Field>
        <p className="apply-form__fine">
          By submitting you acknowledge the event{' '}
          <Link to="/terms">terms</Link> and{' '}
          <Link to="/privacy">privacy</Link> policy.
        </p>
        <Button type="submit" disabled={pending}>
          {pending ? 'Submitting…' : 'Submit referee application'}
        </Button>
      </form>
    </div>
  )
}

