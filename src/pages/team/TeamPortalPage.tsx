import { useDemo } from '../../context/useDemo'
import { Button, ButtonLink } from '../../components/ui/Button'
import { Field, TextInput } from '../../components/ui/Field'
import { useAuth } from '../../context/auth-context'
import { isTeamManager } from '../../types/models'
import { PagePhotoBand } from '../../components/media/PhotoLightbox'
import { PAGE_PHOTOS } from '../../data/photos'

export function TeamPortalPage() {
  const { user, role, profile } = useAuth()
  const { state, setState } = useDemo()

  if (!isTeamManager(role)) {
    return (
      <div className="container section" style={{ maxWidth: 640 }}>
        <PagePhotoBand photo={PAGE_PHOTOS.teamPortal} />
        <h1>Team portal</h1>
        <p>
          This area is for team managers. Your account role is{' '}
          <strong>{role}</strong>
          {profile?.firstName ? ` (${profile.firstName})` : ''}. If you need
          manager access, contact the organizers or re-register with the team
          manager role on a new account for now.
        </p>
        <p>
          Signed in as {user?.email}. Fan tools and tournament browsing stay
          available to you.
        </p>
      </div>
    )
  }

  const team =
    state.teams.find((t) => t.id === (profile?.teamId || state.teams[0]?.id)) ??
    state.teams[0]

  if (!team) {
    return (
      <div className="container section">
        <PagePhotoBand photo={PAGE_PHOTOS.teamPortal} />
        <h1>Team portal</h1>
        <p>
          No team is linked yet. Submit an application and once accepted, your
          team will appear here.
        </p>
        <ButtonLink to="/apply">Go to application</ButtonLink>
      </div>
    )
  }

  return (
    <div className="container section" style={{ maxWidth: 640 }}>
      <PagePhotoBand photo={PAGE_PHOTOS.teamPortal} />
      <h1>Team portal</h1>
      <p>
        Manage public profile details for <strong>{team.name}</strong>. Payment
        status: {team.paymentStatus}. Athlete registration status will appear
        here once forms open.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          const description = String(fd.get('description') || '')
          const location = String(fd.get('location') || '')
          setState((prev) => ({
            ...prev,
            teams: prev.teams.map((t) =>
              t.id === team.id
                ? { ...t, description, location, updatedAt: new Date().toISOString() }
                : t,
            ),
          }))
        }}
      >
        <Field label="Location" htmlFor="location">
          <TextInput
            id="location"
            name="location"
            defaultValue={team.location}
          />
        </Field>
        <Field label="Public description" htmlFor="description">
          <TextInput
            id="description"
            name="description"
            defaultValue={team.description ?? ''}
          />
        </Field>
        <Button type="submit">Save profile</Button>
      </form>
    </div>
  )
}
