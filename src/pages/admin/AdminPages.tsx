import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AdminAddTeamApplication } from '../../components/admin/AdminAddTeamApplication'
import { AdminApplicationDetail } from '../../components/admin/AdminApplicationDetail'
import { Button } from '../../components/ui/Button'
import { Field, TextInput, TextSelect } from '../../components/ui/Field'
import { useDemo } from '../../context/useDemo'
import {
  useAdminMatches,
  useAdminMvp,
  useAdminTeams,
  useApplications,
  useDivisions,
  useEvent,
  useRefereeApplications,
  useTeamName,
  useUpdateEventSettings,
} from '../../hooks/useTournament'
import type {
  ApplicationDoc,
  ApplicationStatus,
  DivisionCode,
  MatchDoc,
  MatchStatus,
  MvpNomineeDoc,
  PaymentStatus,
  RefereeApplicationDoc,
} from '../../types/models'
import {
  REFEREE_POSITION_LABELS,
  SEVENS_COMPETITION_LABELS,
  SEVENS_OFFICIATING_SCOPE_LABELS,
} from '../../types/models'
import { EVENT_ID } from '../../lib/collections'
import { formatEventDeadline, isEventPhase } from '../../lib/firestoreEvent'

function AdminHubTabs({
  tabs,
  param = 'tab',
}: {
  tabs: { id: string; label: string; content: ReactNode }[]
  param?: string
}) {
  const [params, setParams] = useSearchParams()
  const active =
    tabs.find((t) => t.id === params.get(param))?.id ?? tabs[0]?.id

  return (
    <>
      <div className="admin-tabs" role="tablist">
        {tabs.map((t) => (
          <Button
            key={t.id}
            size="sm"
            variant={active === t.id ? 'primary' : 'secondary'}
            role="tab"
            aria-selected={active === t.id}
            onClick={() => {
              const next = new URLSearchParams(params)
              next.set(param, t.id)
              setParams(next, { replace: true })
            }}
          >
            {t.label}
          </Button>
        ))}
      </div>
      {tabs.find((t) => t.id === active)?.content}
    </>
  )
}

export function AdminDashboard() {
  const { applications, loading: appsLoading, error: appsError } =
    useApplications()
  const {
    refereeApplications,
    loading: refLoading,
    error: refError,
  } = useRefereeApplications()
  const byStatus = (s: ApplicationStatus) =>
    applications.filter((a) => a.status === s).length

  return (
    <div>
      <h1>Dashboard</h1>
      {appsError || refError ? (
        <p role="alert" style={{ color: 'var(--color-danger, #c62828)' }}>
          {appsError || refError}
        </p>
      ) : null}
      <div className="admin-card-grid">
        <div className="admin-card">
          <strong className="tabular">
            {appsLoading ? '…' : applications.length}
          </strong>
          Team apps
        </div>
        <div className="admin-card">
          <strong className="tabular">
            {refLoading ? '…' : refereeApplications.length}
          </strong>
          Referee apps
        </div>
        <div className="admin-card">
          <strong className="tabular">
            {appsLoading ? '…' : byStatus('accepted')}
          </strong>
          Teams accepted
        </div>
        <div className="admin-card">
          <strong className="tabular">
            {appsLoading ? '…' : byStatus('submitted')}
          </strong>
          Awaiting review
        </div>
      </div>
      <p>
        Application and team data are live from Firestore.{' '}
        <Link to="/admin/applications">Review applications</Link>. Schedule and
        site CMS tools are still demo-only until those features ship.
      </p>
    </div>
  )
}

export function AdminApplicationsPage() {
  const { applications, updateStatus, addApplication, loading, error } =
    useApplications()
  const {
    refereeApplications,
    updateStatus: updateRefereeStatus,
    loading: refLoading,
    error: refError,
  } = useRefereeApplications()
  const [tab, setTab] = useState<'team' | 'referee'>('team')
  const [selectedTeam, setSelectedTeam] = useState<ApplicationDoc | null>(null)
  const [selectedReferee, setSelectedReferee] =
    useState<RefereeApplicationDoc | null>(null)
  const [addingTeam, setAddingTeam] = useState(false)
  const statuses: ApplicationStatus[] = [
    'submitted',
    'reviewing',
    'accepted',
    'waitlisted',
    'declined',
  ]

  const openTeam = applications.find((a) => a.id === selectedTeam?.id) ?? null
  const openReferee =
    refereeApplications.find((a) => a.id === selectedReferee?.id) ?? null

  function exportTeamCsv() {
    const header = [
      'teamName',
      'organizationName',
      'divisionCode',
      'contactName',
      'contactEmail',
      'contactPhone',
      'hometown',
      'mailingStreet',
      'mailingCity',
      'mailingState',
      'mailingPostal',
      'instagram',
      'facebook',
      'legacyKitInterest',
      'batchId',
      'status',
      'createdAt',
    ]
    const rows = applications.map((a) =>
      [
        a.teamName,
        a.organizationName,
        a.divisionCode,
        a.contactName,
        a.contactEmail,
        a.contactPhone,
        a.hometown,
        a.mailingAddress.street,
        a.mailingAddress.city,
        a.mailingAddress.state,
        a.mailingAddress.postalCode,
        a.instagram ?? '',
        a.facebook ?? '',
        a.legacyKitInterest,
        a.batchId ?? '',
        a.status,
        a.createdAt,
      ]
        .map((v) => JSON.stringify(String(v)))
        .join(','),
    )
    const blob = new Blob([[header.join(','), ...rows].join('\n')], {
      type: 'text/csv',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'team-applications.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportRefereeCsv() {
    const header = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'yearsOfficiating',
      'refereeGrade',
      'refereeSociety',
      'recommendationContact',
      'instagram',
      'facebook',
      'positions',
      'divisionCodes',
      'highestSevensCompetition',
      'highestSevensScope',
      'matchFootageUrl',
      'status',
      'createdAt',
    ]
    const rows = refereeApplications.map((a) =>
      [
        a.firstName,
        a.lastName,
        a.email,
        a.phone,
        a.yearsOfficiating,
        a.refereeGrade ?? '',
        a.refereeSociety,
        a.recommendationContact ?? '',
        a.instagram ?? '',
        a.facebook ?? '',
        a.positions.map((p) => REFEREE_POSITION_LABELS[p]).join('; '),
        a.divisionCodes.join('; '),
        SEVENS_COMPETITION_LABELS[a.highestSevensCompetition],
        SEVENS_OFFICIATING_SCOPE_LABELS[a.highestSevensScope],
        a.matchFootageUrl ?? '',
        a.status,
        a.createdAt,
      ]
        .map((v) => JSON.stringify(String(v)))
        .join(','),
    )
    const blob = new Blob([[header.join(','), ...rows].join('\n')], {
      type: 'text/csv',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'referee-applications.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <h1>Applications</h1>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {tab === 'team' ? (
            <Button size="sm" onClick={() => setAddingTeam(true)}>
              Add team application
            </Button>
          ) : null}
          <Button
            size="sm"
            variant="secondary"
            onClick={tab === 'team' ? exportTeamCsv : exportRefereeCsv}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {error || refError ? (
        <p role="alert" style={{ color: 'var(--color-danger, #c62828)' }}>
          {error || refError}
        </p>
      ) : null}
      {loading || refLoading ? <p>Loading applications…</p> : null}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <Button
          size="sm"
          variant={tab === 'team' ? 'primary' : 'secondary'}
          onClick={() => setTab('team')}
        >
          Teams ({applications.length})
        </Button>
        <Button
          size="sm"
          variant={tab === 'referee' ? 'primary' : 'secondary'}
          onClick={() => setTab('referee')}
        >
          Referees ({refereeApplications.length})
        </Button>
      </div>

      <p className="admin-table__hint">Tap a row to read the full application.</p>

      {tab === 'team' ? (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Team</th>
                <th>Division</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  className="admin-table__row--clickable"
                  tabIndex={0}
                  onClick={() => setSelectedTeam(app)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedTeam(app)
                    }
                  }}
                >
                  <td>
                    <strong>{app.teamName}</strong>
                    <div>{app.hometown}</div>
                    {app.entrySource === 'admin' ? (
                      <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>
                        Manual entry
                      </div>
                    ) : null}
                    {app.batchId ? (
                      <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>
                        Multi-team batch
                      </div>
                    ) : null}
                  </td>
                  <td>{app.divisionCode}</td>
                  <td>
                    {app.contactName}
                    <div>{app.contactEmail}</div>
                    <div>{app.contactPhone}</div>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      value={app.status}
                      aria-label={`Status for ${app.teamName}`}
                      onChange={(e) =>
                        updateStatus(app.id, e.target.value as ApplicationStatus)
                      }
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{new Date(app.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {applications.length === 0 ? <p>No team applications yet.</p> : null}
        </>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Official</th>
                <th>Positions</th>
                <th>Sevens level</th>
                <th>Society</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {refereeApplications.map((app) => (
                <tr
                  key={app.id}
                  className="admin-table__row--clickable"
                  tabIndex={0}
                  onClick={() => setSelectedReferee(app)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedReferee(app)
                    }
                  }}
                >
                  <td>
                    <strong>
                      {app.firstName} {app.lastName}
                    </strong>
                    <div>{app.email}</div>
                    <div>{app.phone}</div>
                  </td>
                  <td>
                    {app.positions
                      .map((p) => REFEREE_POSITION_LABELS[p])
                      .join(', ')}
                    <div style={{ fontSize: '0.85rem' }}>
                      {app.divisionCodes.join(', ')}
                    </div>
                  </td>
                  <td>
                    {SEVENS_COMPETITION_LABELS[app.highestSevensCompetition]}
                    <div style={{ fontSize: '0.85rem' }}>
                      {SEVENS_OFFICIATING_SCOPE_LABELS[app.highestSevensScope]}
                    </div>
                  </td>
                  <td>{app.refereeSociety}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      value={app.status}
                      aria-label={`Status for ${app.firstName} ${app.lastName}`}
                      onChange={(e) =>
                        updateRefereeStatus(
                          app.id,
                          e.target.value as ApplicationStatus,
                        )
                      }
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{new Date(app.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {refereeApplications.length === 0 ? (
            <p>No referee applications yet.</p>
          ) : null}
        </>
      )}

      {openTeam ? (
        <AdminApplicationDetail
          kind="team"
          app={openTeam}
          onClose={() => setSelectedTeam(null)}
          onStatusChange={(status) => void updateStatus(openTeam.id, status)}
        />
      ) : null}
      {openReferee ? (
        <AdminApplicationDetail
          kind="referee"
          app={openReferee}
          onClose={() => setSelectedReferee(null)}
          onStatusChange={(status) =>
            void updateRefereeStatus(openReferee.id, status)
          }
        />
      ) : null}
      {addingTeam ? (
        <AdminAddTeamApplication
          onClose={() => setAddingTeam(false)}
          onSave={async (input) => {
            await addApplication(input)
          }}
        />
      ) : null}
    </div>
  )
}

export function AdminTeamsPage() {
  const { teams, loading, error, addTeam, saveTeam, removeTeam } =
    useAdminTeams()
  const divisions = useDivisions()
  const [name, setName] = useState('')
  const [divisionCode, setDivisionCode] = useState<DivisionCode>('premier-men')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const editing = teams.find((t) => t.id === editingId) ?? null

  async function onAdd(e: FormEvent) {
    e.preventDefault()
    setActionError(null)
    setPending(true)
    try {
      await addTeam(name.trim(), divisionCode)
      setName('')
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Could not add team.',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <div>
      <h1>Teams</h1>
      <p>
        Teams are stored in Firestore. Coach and player roster forms stay locked
        until accepted managers get access later.
      </p>
      {error ? (
        <p role="alert" style={{ color: 'var(--color-danger, #c62828)' }}>
          {error}
        </p>
      ) : null}
      {actionError ? (
        <p role="alert" style={{ color: 'var(--color-danger, #c62828)' }}>
          {actionError}
        </p>
      ) : null}
      {loading ? <p>Loading teams…</p> : null}
      <form
        onSubmit={(e) => void onAdd(e)}
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}
      >
        <TextInput
          placeholder="Team name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={pending}
        />
        <TextSelect
          value={divisionCode}
          disabled={pending}
          onChange={(e) => setDivisionCode(e.target.value as DivisionCode)}
        >
          {divisions.map((d) => (
            <option key={d.id} value={d.code}>
              {d.name}
            </option>
          ))}
        </TextSelect>
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? 'Saving…' : 'Add team'}
        </Button>
      </form>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Division</th>
            <th>Hometown</th>
            <th>Payment</th>
            <th>Published</th>
            <th>Roster</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((t) => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.divisionCode}</td>
              <td>{t.hometown ?? t.location}</td>
              <td>{t.paymentStatus}</td>
              <td>{t.published ? 'yes' : 'no'}</td>
              <td>{t.rosterAccess}</td>
              <td style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    setEditingId((id) => (id === t.id ? null : t.id))
                  }
                >
                  {editingId === t.id ? 'Close' : 'Edit'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  disabled={pending}
                  onClick={() => {
                    if (
                      !window.confirm(
                        `Remove ${t.name} from the tournament list?`,
                      )
                    ) {
                      return
                    }
                    setEditingId((id) => (id === t.id ? null : id))
                    setPending(true)
                    setActionError(null)
                    void removeTeam(t.id)
                      .catch((err) =>
                        setActionError(
                          err instanceof Error
                            ? err.message
                            : 'Could not remove team.',
                        ),
                      )
                      .finally(() => setPending(false))
                  }}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!loading && teams.length === 0 ? (
        <p>No teams yet. Add one above — deletes stay gone after refresh.</p>
      ) : null}

      {editing ? (
        <form
          key={editing.id}
          style={{
            marginTop: 24,
            padding: 16,
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-elevated)',
            maxWidth: 560,
          }}
          onSubmit={(e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            const nextName = String(fd.get('name'))
            const hometown = String(fd.get('hometown'))
            setPending(true)
            setActionError(null)
            void saveTeam(editing.id, {
              name: nextName,
              slug: nextName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              divisionCode: String(fd.get('divisionCode')) as DivisionCode,
              divisionId: String(fd.get('divisionCode')),
              hometown,
              location: hometown,
              website: String(fd.get('website') || '') || undefined,
              instagram: String(fd.get('instagram') || '') || undefined,
              facebook: String(fd.get('facebook') || '') || undefined,
              description: String(fd.get('description') || '') || undefined,
              paymentStatus: String(fd.get('paymentStatus')) as PaymentStatus,
              published: fd.get('published') === 'on',
              mailingAddress: {
                street: String(fd.get('street')),
                city: String(fd.get('city')),
                state: String(fd.get('state')),
                postalCode: String(fd.get('postalCode')),
                country: String(fd.get('country') || 'United States'),
              },
            })
              .then(() => setEditingId(null))
              .catch((err) =>
                setActionError(
                  err instanceof Error ? err.message : 'Could not save team.',
                ),
              )
              .finally(() => setPending(false))
          }}
        >
          <h2 style={{ marginTop: 0 }}>Edit · {editing.name}</h2>
          <p style={{ fontSize: '0.9rem' }}>
            Profile shell — coaches and players attach later when roster access
            opens for accepted managers.
          </p>
          <Field label="Team name" htmlFor="edit-name">
            <TextInput
              id="edit-name"
              name="name"
              required
              defaultValue={editing.name}
            />
          </Field>
          <Field label="Division" htmlFor="edit-division">
            <TextSelect
              id="edit-division"
              name="divisionCode"
              defaultValue={editing.divisionCode}
            >
              {divisions.map((d) => (
                <option key={d.id} value={d.code}>
                  {d.name}
                </option>
              ))}
            </TextSelect>
          </Field>
          <Field label="Hometown" htmlFor="edit-hometown">
            <TextInput
              id="edit-hometown"
              name="hometown"
              required
              defaultValue={editing.hometown ?? editing.location}
            />
          </Field>
          <Field label="Street" htmlFor="edit-street">
            <TextInput
              id="edit-street"
              name="street"
              defaultValue={editing.mailingAddress?.street ?? ''}
            />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Field label="City" htmlFor="edit-city">
              <TextInput
                id="edit-city"
                name="city"
                defaultValue={editing.mailingAddress?.city ?? ''}
              />
            </Field>
            <Field label="State" htmlFor="edit-state">
              <TextInput
                id="edit-state"
                name="state"
                defaultValue={editing.mailingAddress?.state ?? ''}
              />
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Field label="Postal code" htmlFor="edit-postal">
              <TextInput
                id="edit-postal"
                name="postalCode"
                defaultValue={editing.mailingAddress?.postalCode ?? ''}
              />
            </Field>
            <Field label="Country" htmlFor="edit-country">
              <TextInput
                id="edit-country"
                name="country"
                defaultValue={editing.mailingAddress?.country ?? 'United States'}
              />
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Field label="Instagram" htmlFor="edit-ig">
              <TextInput
                id="edit-ig"
                name="instagram"
                defaultValue={editing.instagram ?? ''}
              />
            </Field>
            <Field label="Facebook" htmlFor="edit-fb">
              <TextInput
                id="edit-fb"
                name="facebook"
                defaultValue={editing.facebook ?? ''}
              />
            </Field>
          </div>
          <Field label="Website" htmlFor="edit-web">
            <TextInput
              id="edit-web"
              name="website"
              defaultValue={editing.website ?? ''}
            />
          </Field>
          <Field label="Internal notes / description" htmlFor="edit-desc">
            <TextInput
              id="edit-desc"
              name="description"
              defaultValue={editing.description ?? ''}
            />
          </Field>
          <Field label="Payment status" htmlFor="edit-pay">
            <TextSelect
              id="edit-pay"
              name="paymentStatus"
              defaultValue={editing.paymentStatus}
            >
              <option value="unpaid">unpaid</option>
              <option value="partial">partial</option>
              <option value="paid">paid</option>
              <option value="waived">waived</option>
            </TextSelect>
          </Field>
          <label className="apply-check" style={{ display: 'flex', gap: 8 }}>
            <input
              type="checkbox"
              name="published"
              defaultChecked={editing.published}
            />
            Published (admin / future public listing)
          </label>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? 'Saving…' : 'Save team'}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setEditingId(null)}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  )
}

export function AdminSchedulePage({
  embedded = false,
}: {
  embedded?: boolean
} = {}) {
  const { matches, upsertMatch } = useAdminMatches()
  const { state } = useDemo()

  function addMatch() {
    const now = new Date().toISOString()
    const match: MatchDoc = {
      id: `match-${crypto.randomUUID()}`,
      eventId: EVENT_ID,
      divisionId: 'premier-men',
      divisionCode: 'premier-men',
      stage: 'pool',
      day: 'saturday',
      kickoffAt: new Date('2027-01-02T10:00:00-06:00').toISOString(),
      field: 'Field 1',
      homeTeamId: state.teams[0]?.id ?? null,
      awayTeamId: state.teams[1]?.id ?? null,
      homeScore: null,
      awayScore: null,
      status: 'upcoming',
      published: true,
      version: 1,
      updatedAt: now,
    }
    upsertMatch(match)
  }

  const Title = embedded ? 'h2' : 'h1'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Title>Schedule</Title>
        <Button size="sm" onClick={addMatch}>
          Add match slot
        </Button>
      </div>
      <p>22-minute slot model. Publish/unpublish from each row.</p>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Kickoff</th>
            <th>Division</th>
            <th>Home</th>
            <th>Away</th>
            <th>Status</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((m) => (
            <tr key={m.id}>
              <td>{new Date(m.kickoffAt).toLocaleString()}</td>
              <td>{m.divisionCode}</td>
              <td>
                <TeamLabel id={m.homeTeamId} />
              </td>
              <td>
                <TeamLabel id={m.awayTeamId} />
              </td>
              <td>{m.status}</td>
              <td>
                <button
                  type="button"
                  onClick={() =>
                    upsertMatch({ ...m, published: !m.published })
                  }
                >
                  {m.published ? 'Unpublish' : 'Publish'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TeamLabel({ id }: { id: string | null }) {
  return <>{useTeamName(id)}</>
}

export function AdminResultsPage({
  embedded = false,
}: {
  embedded?: boolean
} = {}) {
  const { matches, upsertMatch } = useAdminMatches()
  const { setState } = useDemo()

  function saveAndRecalc(match: MatchDoc) {
    upsertMatch(match)
    if (!match.poolId || (match.status !== 'final' && match.status !== 'forfeit')) {
      return
    }
    setState((prev) => {
      const pool = prev.pools.find((p) => p.id === match.poolId)
      if (!pool) return prev
      const poolMatches = prev.matches
        .map((m) => (m.id === match.id ? match : m))
        .filter(
          (m) =>
            m.poolId === pool.id &&
            (m.status === 'final' || m.status === 'forfeit'),
        )
      type Acc = {
        played: number
        won: number
        drawn: number
        lost: number
        pointsFor: number
        pointsAgainst: number
        competitionPoints: number
      }
      const table = new Map<string, Acc>()
      for (const teamId of pool.teamIds) {
        table.set(teamId, {
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          pointsFor: 0,
          pointsAgainst: 0,
          competitionPoints: 0,
        })
      }
      for (const m of poolMatches) {
        if (
          m.homeTeamId == null ||
          m.awayTeamId == null ||
          m.homeScore == null ||
          m.awayScore == null
        ) {
          continue
        }
        const home = table.get(m.homeTeamId)
        const away = table.get(m.awayTeamId)
        if (!home || !away) continue
        home.played += 1
        away.played += 1
        home.pointsFor += m.homeScore
        home.pointsAgainst += m.awayScore
        away.pointsFor += m.awayScore
        away.pointsAgainst += m.homeScore
        if (m.homeScore > m.awayScore) {
          home.won += 1
          away.lost += 1
          home.competitionPoints += 3
        } else if (m.awayScore > m.homeScore) {
          away.won += 1
          home.lost += 1
          away.competitionPoints += 3
        } else {
          home.drawn += 1
          away.drawn += 1
          home.competitionPoints += 1
          away.competitionPoints += 1
        }
      }
      const standings = [...table.entries()].map(([teamId, row]) => ({
        id: `${pool.id}_${teamId}`,
        eventId: pool.eventId,
        poolId: pool.id,
        divisionCode: pool.divisionCode,
        teamId,
        ...row,
        pointDiff: row.pointsFor - row.pointsAgainst,
        updatedAt: new Date().toISOString(),
      }))
      return {
        ...prev,
        standings: [
          ...prev.standings.filter((s) => s.poolId !== pool.id),
          ...standings,
        ],
      }
    })
  }

  return (
    <div>
      {embedded ? <h2>Results</h2> : <h1>Results</h1>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Match</th>
            <th>Home</th>
            <th>Away</th>
            <th>Status</th>
            <th>Save</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((m) => (
            <ScoreRow key={m.id} match={m} onSave={saveAndRecalc} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ScoreRow({
  match,
  onSave,
}: {
  match: MatchDoc
  onSave: (m: MatchDoc) => void
}) {
  const [home, setHome] = useState(String(match.homeScore ?? 0))
  const [away, setAway] = useState(String(match.awayScore ?? 0))
  const [status, setStatus] = useState<MatchStatus>(match.status)
  const homeName = useTeamName(match.homeTeamId)
  const awayName = useTeamName(match.awayTeamId)

  return (
    <tr>
      <td>
        {homeName} vs {awayName}
      </td>
      <td>
        <input
          className="tabular"
          style={{ width: 64 }}
          value={home}
          onChange={(e) => setHome(e.target.value)}
        />
      </td>
      <td>
        <input
          className="tabular"
          style={{ width: 64 }}
          value={away}
          onChange={(e) => setAway(e.target.value)}
        />
      </td>
      <td>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as MatchStatus)}
        >
          <option value="upcoming">upcoming</option>
          <option value="live">live</option>
          <option value="final">final</option>
          <option value="delayed">delayed</option>
          <option value="cancelled">cancelled</option>
          <option value="forfeit">forfeit</option>
        </select>
      </td>
      <td>
        <Button
          size="sm"
          onClick={() =>
            onSave({
              ...match,
              homeScore: Number(home),
              awayScore: Number(away),
              status,
              version: match.version + 1,
              updatedAt: new Date().toISOString(),
            })
          }
        >
          Save
        </Button>
      </td>
    </tr>
  )
}

export function AdminFanMvpPage({
  embedded = false,
}: {
  embedded?: boolean
} = {}) {
  const { nominees, votingOpen, setVotingOpen, upsertNominee, publishWinner } =
    useAdminMvp()
  const [name, setName] = useState('')
  const [teamName, setTeamName] = useState('')

  return (
    <div>
      {embedded ? <h2>Fan MVP</h2> : <h1>Fan MVP</h1>}
      <label style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="checkbox"
          checked={votingOpen}
          onChange={(e) => setVotingOpen(e.target.checked)}
        />
        Voting open
      </label>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const nominee: MvpNomineeDoc = {
            id: `mvp-${crypto.randomUUID()}`,
            eventId: EVENT_ID,
            displayName: name,
            teamId: 'unknown',
            teamName,
            published: true,
            isWinner: false,
            order: nominees.length + 1,
          }
          upsertNominee(nominee)
          setName('')
          setTeamName('')
        }}
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}
      >
        <TextInput
          placeholder="Player display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextInput
          placeholder="Team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        />
        <Button type="submit" size="sm">
          Add nominee
        </Button>
      </form>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nominee</th>
            <th>Team</th>
            <th>Winner</th>
          </tr>
        </thead>
        <tbody>
          {nominees.map((n) => (
            <tr key={n.id}>
              <td>{n.displayName}</td>
              <td>{n.teamName}</td>
              <td>
                <Button size="sm" variant="secondary" onClick={() => publishWinner(n.id)}>
                  {n.isWinner ? 'Winner' : 'Publish winner'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function AdminAnnouncementsPage({
  embedded = false,
}: {
  embedded?: boolean
} = {}) {
  const { state, setState } = useDemo()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  return (
    <div>
      {embedded ? <h2>Announcements</h2> : <h1>Announcements</h1>}
      <p>
        Published announcements appear on the public{' '}
        <Link to="/updates">Updates</Link> page and as “Latest update” on the
        homepage.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const now = new Date().toISOString()
          setState((prev) => ({
            ...prev,
            announcements: [
              {
                id: `ann-${crypto.randomUUID()}`,
                eventId: EVENT_ID,
                title,
                slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                body,
                urgent: false,
                state: 'published',
                publishedAt: now,
                createdAt: now,
                updatedAt: now,
              },
              ...prev.announcements,
            ],
          }))
          setTitle('')
          setBody('')
        }}
      >
        <Field label="Title" htmlFor="title">
          <TextInput
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Field>
        <Field label="Body" htmlFor="body">
          <TextInput
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </Field>
        <Button type="submit">Publish</Button>
      </form>
      <ul>
        {state.announcements.map((a) => (
          <li key={a.id}>
            <strong>{a.title}</strong> — {a.state}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AdminContentPage({
  embedded = false,
}: {
  embedded?: boolean
} = {}) {
  return (
    <div>
      {embedded ? <h2>Content</h2> : <h1>Content</h1>}
      <p>
        Manage FAQ, privacy, terms, and homepage copy here. Seeded FAQ content is
        editable in a future CMS iteration; current FAQ lives in demo state.
      </p>
    </div>
  )
}

export function AdminSponsorsPage({
  embedded = false,
}: {
  embedded?: boolean
} = {}) {
  const { state } = useDemo()
  return (
    <div>
      {embedded ? <h2>Sponsors</h2> : <h1>Sponsors</h1>}
      <ul>
        {state.sponsors.map((s) => (
          <li key={s.id}>
            {s.name} ({s.tier})
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AdminOperationsPage({
  embedded = false,
}: {
  embedded?: boolean
} = {}) {
  return (
    <div>
      {embedded ? <h2>Operations</h2> : <h1>Operations</h1>}
      <p>Staff-only operational notes. Do not store medical records here.</p>
      <ul>
        <li>Venue contacts</li>
        <li>Referee information</li>
        <li>Emergency action plan links</li>
        <li>Daily opening / closing checklists</li>
        <li>Facility and sanitation status</li>
      </ul>
    </div>
  )
}

export function AdminUsersPage({
  embedded = false,
}: {
  embedded?: boolean
} = {}) {
  return (
    <div>
      {embedded ? <h2>Users</h2> : <h1>Users</h1>}
      <p>
        Promote users to admin, teamManager, referee, or fan via the{' '}
        <code>setUserRole</code> callable (admin only). Admin cannot be chosen
        during self-serve onboarding.
        Documented in docs/AUTH-SETUP.md.
      </p>
    </div>
  )
}

export function AdminSettingsPage({
  embedded = false,
}: {
  embedded?: boolean
} = {}) {
  const event = useEvent()
  const updateSettings = useUpdateEventSettings()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [banner, setBanner] = useState(event.emergencyBanner ?? '')
  const [appDeadline, setAppDeadline] = useState(
    event.applicationDeadline ?? '2026-10-01',
  )
  const [payDeadline, setPayDeadline] = useState(
    event.paymentDeadline || '2026-11-20',
  )

  useEffect(() => {
    setBanner(event.emergencyBanner ?? '')
    setAppDeadline(event.applicationDeadline ?? '2026-10-01')
    setPayDeadline(event.paymentDeadline || '2026-11-20')
  }, [
    event.emergencyBanner,
    event.applicationDeadline,
    event.paymentDeadline,
  ])

  async function applyPatch(
    patch: Parameters<typeof updateSettings>[0],
  ) {
    setError(null)
    setSaved(false)
    setPending(true)
    try {
      await updateSettings(patch)
      setSaved(true)
    } catch (err) {
      console.error(err)
      setError(
        err instanceof Error ? err.message : 'Could not save settings.',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <div>
      {embedded ? <h2>Event</h2> : <h1>Settings</h1>}
      <p style={{ marginBottom: 16, color: 'var(--color-text-secondary)' }}>
        These controls write to Firestore and affect the live apply flow.
        Display deadlines:{' '}
        <strong>{formatEventDeadline(appDeadline)}</strong> (apply) ·{' '}
        <strong>{formatEventDeadline(payDeadline)}</strong> (payment).
      </p>
      {error ? (
        <p role="alert" style={{ color: 'var(--color-danger, #c62828)' }}>
          {error}
        </p>
      ) : null}
      {saved && !error ? (
        <p role="status" style={{ marginBottom: 12 }}>
          Saved.
        </p>
      ) : null}
      <label style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          type="checkbox"
          checked={event.applicationOpen}
          disabled={pending}
          onChange={(e) =>
            void applyPatch({ applicationOpen: e.target.checked })
          }
        />
        Applications open
      </label>
      <Field label="Emergency banner" htmlFor="banner">
        <TextInput
          id="banner"
          value={banner}
          disabled={pending}
          onChange={(e) => setBanner(e.target.value)}
          onBlur={() => {
            const next = banner.trim() || null
            if (next === (event.emergencyBanner ?? null)) return
            void applyPatch({ emergencyBanner: next })
          }}
        />
      </Field>
      <Field label="Application deadline (YYYY-MM-DD)" htmlFor="appDeadline">
        <TextInput
          id="appDeadline"
          value={appDeadline}
          disabled={pending}
          onChange={(e) => setAppDeadline(e.target.value)}
          onBlur={() => {
            const value = appDeadline.trim()
            if (!value || value === event.applicationDeadline) return
            void applyPatch({ applicationDeadline: value })
          }}
        />
      </Field>
      <Field label="Payment deadline (YYYY-MM-DD)" htmlFor="payDeadline">
        <TextInput
          id="payDeadline"
          value={payDeadline}
          disabled={pending}
          onChange={(e) => setPayDeadline(e.target.value)}
          onBlur={() => {
            const value = payDeadline.trim()
            if (!value || value === event.paymentDeadline) return
            void applyPatch({ paymentDeadline: value })
          }}
        />
      </Field>
      <Field label="Event phase" htmlFor="phase">
        <TextSelect
          id="phase"
          value={event.phase}
          disabled={pending}
          onChange={(e) => {
            const value = e.target.value
            if (!isEventPhase(value)) return
            void applyPatch({ phase: value })
          }}
        >
          <option value="promo">promo</option>
          <option value="prep">prep</option>
          <option value="live">live</option>
          <option value="archive">archive</option>
        </TextSelect>
      </Field>
    </div>
  )
}

export function AdminEventDayPage() {
  return (
    <div>
      <h1>Schedule & results</h1>
      <p className="admin-table__hint">
        Demo tools for match day. Live schedule wiring comes later.
      </p>
      <AdminHubTabs
        tabs={[
          {
            id: 'schedule',
            label: 'Schedule',
            content: <AdminSchedulePage embedded />,
          },
          {
            id: 'results',
            label: 'Results',
            content: <AdminResultsPage embedded />,
          },
          {
            id: 'fan-mvp',
            label: 'Fan MVP',
            content: <AdminFanMvpPage embedded />,
          },
        ]}
      />
    </div>
  )
}

export function AdminSitePage() {
  return (
    <div>
      <h1>Content & sponsors</h1>
      <p className="admin-table__hint">
        Site CMS is still demo-backed until content ships live.
      </p>
      <AdminHubTabs
        tabs={[
          {
            id: 'announcements',
            label: 'Announcements',
            content: <AdminAnnouncementsPage embedded />,
          },
          {
            id: 'content',
            label: 'Content',
            content: <AdminContentPage embedded />,
          },
          {
            id: 'sponsors',
            label: 'Sponsors',
            content: <AdminSponsorsPage embedded />,
          },
        ]}
      />
    </div>
  )
}

export function AdminSettingsHubPage() {
  return (
    <div>
      <h1>Settings</h1>
      <AdminHubTabs
        tabs={[
          {
            id: 'event',
            label: 'Event',
            content: <AdminSettingsPage embedded />,
          },
          {
            id: 'users',
            label: 'Users',
            content: <AdminUsersPage embedded />,
          },
          {
            id: 'operations',
            label: 'Operations',
            content: <AdminOperationsPage embedded />,
          },
        ]}
      />
    </div>
  )
}
