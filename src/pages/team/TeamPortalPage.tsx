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

  const linked =
    state.teams.find((t) => t.id === profile?.teamId) ??
    state.teams.find((t) => t.managerUserIds.includes(user?.uid ?? ''))

  if (!linked) {
    return (
      <div className="container section">
        <PagePhotoBand photo={PAGE_PHOTOS.teamPortal} />
        <h1>Team portal</h1>
        <p>
          No team is linked to your account yet. After your application is
          accepted, organizers will connect your login here so you can manage
          the team profile and (later) coaches and players.
        </p>
        <ButtonLink to="/apply">Go to application</ButtonLink>
      </div>
    )
  }

  const team = linked

  return (
    <div className="container section" style={{ maxWidth: 640 }}>
      <PagePhotoBand photo={PAGE_PHOTOS.teamPortal} />
      <h1>Team portal</h1>
      <p>
        Profile for <strong>{team.name}</strong> · {team.divisionCode}. Payment:{' '}
        {team.paymentStatus}.
      </p>

      <section
        style={{
          margin: '1.5rem 0',
          padding: '1rem 1.15rem',
          borderLeft: '4px solid var(--color-brand-primary)',
          background:
            'color-mix(in srgb, var(--color-brand-primary) 10%, transparent)',
        }}
      >
        <h2 style={{ margin: '0 0 0.35rem', fontSize: '1.1rem' }}>
          Roster shell
        </h2>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
          Coach and player registration forms are not open yet. When they are,
          accepted managers will add staff and athletes here. Right now this is
          a profile shell only.
        </p>
      </section>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          const hometown = String(fd.get('hometown') || '')
          const now = new Date().toISOString()
          setState((prev) => ({
            ...prev,
            teams: prev.teams.map((t) =>
              t.id === team.id
                ? {
                    ...t,
                    hometown,
                    location: hometown,
                    website: String(fd.get('website') || '') || undefined,
                    instagram: String(fd.get('instagram') || '') || undefined,
                    facebook: String(fd.get('facebook') || '') || undefined,
                    description:
                      String(fd.get('description') || '') || undefined,
                    updatedAt: now,
                  }
                : t,
            ),
          }))
        }}
      >
        <Field label="Hometown" htmlFor="hometown">
          <TextInput
            id="hometown"
            name="hometown"
            defaultValue={team.hometown ?? team.location}
          />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Instagram" htmlFor="instagram">
            <TextInput
              id="instagram"
              name="instagram"
              defaultValue={team.instagram ?? ''}
            />
          </Field>
          <Field label="Facebook" htmlFor="facebook">
            <TextInput
              id="facebook"
              name="facebook"
              defaultValue={team.facebook ?? ''}
            />
          </Field>
        </div>
        <Field label="Website" htmlFor="website">
          <TextInput
            id="website"
            name="website"
            defaultValue={team.website ?? ''}
          />
        </Field>
        <Field label="Short description" htmlFor="description">
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
