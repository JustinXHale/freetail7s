import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Button } from '../ui/Button'
import { Field, TextInput, TextSelect, TextTextarea } from '../ui/Field'
import { useDivisions } from '../../hooks/useTournament'
import type { ApplicationDoc, DivisionCode } from '../../types/models'

type ApplicationInput = Omit<
  ApplicationDoc,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'status'
  | 'eventId'
  | 'submittedByUid'
  | 'entrySource'
>

type Props = {
  onClose: () => void
  onSave: (input: ApplicationInput) => Promise<void>
}

const empty = {
  organizationName: '',
  teamName: '',
  divisionCode: '' as DivisionCode | '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'United States',
  hometown: '',
  website: '',
  instagram: '',
  facebook: '',
  legacyKitInterest: false,
  notes: '',
}

export function AdminAddTeamApplication({ onClose, onSave }: Props) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const divisions = useDivisions()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(empty)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !pending) onClose()
    }
    window.addEventListener('keydown', onKey)
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, pending])

  function set<K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!form.divisionCode) {
      setError('Choose a division.')
      return
    }
    setPending(true)
    try {
      await onSave({
        organizationName: form.organizationName.trim(),
        teamName: form.teamName.trim(),
        divisionCode: form.divisionCode,
        contactName: form.contactName.trim(),
        contactEmail: form.contactEmail.trim(),
        contactPhone: form.contactPhone.trim(),
        mailingAddress: {
          street: form.street.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          postalCode: form.postalCode.trim(),
          country: form.country.trim() || 'United States',
        },
        hometown: form.hometown.trim(),
        website: form.website.trim() || undefined,
        instagram: form.instagram.trim() || undefined,
        facebook: form.facebook.trim() || undefined,
        legacyKitInterest: form.legacyKitInterest,
        notes: form.notes.trim() || undefined,
      })
      onClose()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not save application.',
      )
    } finally {
      setPending(false)
    }
  }

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
        aria-label="Close"
        disabled={pending}
        onClick={onClose}
      />
      <div className="admin-detail__panel">
        <header className="admin-detail__header">
          <div>
            <p className="admin-detail__kind">Manual entry</p>
            <h2 id={titleId}>Add team application</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="admin-detail__close"
            onClick={onClose}
            disabled={pending}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <p className="admin-table__hint">
          Use this for Google Form or offline submissions. Saved to the same
          Applications list as website entries.
        </p>

        {error ? (
          <p role="alert" style={{ color: 'var(--color-danger, #c62828)' }}>
            {error}
          </p>
        ) : null}

        <form className="admin-add-app" onSubmit={(e) => void onSubmit(e)}>
          <div className="admin-add-app__grid">
            <Field label="Contact name" htmlFor="admin-contactName">
              <TextInput
                id="admin-contactName"
                required
                disabled={pending}
                value={form.contactName}
                onChange={(e) => set('contactName', e.target.value)}
              />
            </Field>
            <Field label="Contact email" htmlFor="admin-contactEmail">
              <TextInput
                id="admin-contactEmail"
                type="email"
                required
                disabled={pending}
                value={form.contactEmail}
                onChange={(e) => set('contactEmail', e.target.value)}
              />
            </Field>
            <Field label="Contact phone" htmlFor="admin-contactPhone">
              <TextInput
                id="admin-contactPhone"
                required
                disabled={pending}
                value={form.contactPhone}
                onChange={(e) => set('contactPhone', e.target.value)}
              />
            </Field>
            <Field label="Organization" htmlFor="admin-org">
              <TextInput
                id="admin-org"
                required
                maxLength={120}
                disabled={pending}
                value={form.organizationName}
                onChange={(e) => set('organizationName', e.target.value)}
              />
            </Field>
            <Field label="Team name" htmlFor="admin-teamName">
              <TextInput
                id="admin-teamName"
                required
                maxLength={120}
                disabled={pending}
                value={form.teamName}
                onChange={(e) => set('teamName', e.target.value)}
              />
            </Field>
            <Field label="Division" htmlFor="admin-division">
              <TextSelect
                id="admin-division"
                required
                disabled={pending}
                value={form.divisionCode}
                onChange={(e) =>
                  set('divisionCode', e.target.value as DivisionCode | '')
                }
              >
                <option value="">Select division</option>
                {divisions.map((d) => (
                  <option key={d.id} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </TextSelect>
            </Field>
            <Field label="Street address" htmlFor="admin-street">
              <TextInput
                id="admin-street"
                required
                disabled={pending}
                value={form.street}
                onChange={(e) => set('street', e.target.value)}
              />
            </Field>
            <Field label="City" htmlFor="admin-city">
              <TextInput
                id="admin-city"
                required
                disabled={pending}
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
              />
            </Field>
            <Field label="State" htmlFor="admin-state">
              <TextInput
                id="admin-state"
                required
                disabled={pending}
                value={form.state}
                onChange={(e) => set('state', e.target.value)}
              />
            </Field>
            <Field label="Postal code" htmlFor="admin-postal">
              <TextInput
                id="admin-postal"
                required
                disabled={pending}
                value={form.postalCode}
                onChange={(e) => set('postalCode', e.target.value)}
              />
            </Field>
            <Field label="Country" htmlFor="admin-country">
              <TextInput
                id="admin-country"
                required
                disabled={pending}
                value={form.country}
                onChange={(e) => set('country', e.target.value)}
              />
            </Field>
            <Field label="Team hometown" htmlFor="admin-hometown">
              <TextInput
                id="admin-hometown"
                required
                disabled={pending}
                value={form.hometown}
                onChange={(e) => set('hometown', e.target.value)}
              />
            </Field>
            <Field label="Website" htmlFor="admin-website" hint="Optional">
              <TextInput
                id="admin-website"
                type="url"
                disabled={pending}
                value={form.website}
                onChange={(e) => set('website', e.target.value)}
              />
            </Field>
            <Field label="Instagram" htmlFor="admin-ig" hint="Optional">
              <TextInput
                id="admin-ig"
                disabled={pending}
                value={form.instagram}
                onChange={(e) => set('instagram', e.target.value)}
              />
            </Field>
            <Field label="Facebook" htmlFor="admin-fb" hint="Optional">
              <TextInput
                id="admin-fb"
                disabled={pending}
                value={form.facebook}
                onChange={(e) => set('facebook', e.target.value)}
              />
            </Field>
          </div>

          <label className="admin-add-app__check">
            <input
              type="checkbox"
              disabled={pending}
              checked={form.legacyKitInterest}
              onChange={(e) => set('legacyKitInterest', e.target.checked)}
            />
            Legacy Ecowear kit credit interest
          </label>

          <Field
            label="Notes"
            htmlFor="admin-notes"
            hint="Optional — e.g. from Google Form"
          >
            <TextTextarea
              id="admin-notes"
              disabled={pending}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={3}
            />
          </Field>

          <footer className="admin-detail__footer" style={{ gap: 8 }}>
            <Button
              type="button"
              variant="secondary"
              disabled={pending}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving…' : 'Save application'}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  )
}
