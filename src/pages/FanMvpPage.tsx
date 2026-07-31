import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import {
  useCastMvpVote,
  useEvent,
  useMvpNominees,
} from '../hooks/useTournament'

function voterKey(): string {
  const key = 'ft7s-mvp-voter'
  let existing = localStorage.getItem(key)
  if (!existing) {
    existing = crypto.randomUUID()
    localStorage.setItem(key, existing)
  }
  return existing
}

export function FanMvpPage() {
  const event = useEvent()
  const nominees = useMvpNominees()
  const cast = useCastMvpVote()
  const [selected, setSelected] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const winner = useMemo(() => nominees.find((n) => n.isWinner), [nominees])

  useEffect(() => {
    void voterKey()
  }, [])

  async function confirmVote(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (!selected) {
      setError('Select a nominee before confirming.')
      return
    }
    try {
      await cast(selected, voterKey())
      setMessage('Vote submitted. Thank you.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Vote failed.')
    }
  }

  return (
    <div className="container section">
      <h1>Fan MVP</h1>
      <p>
        Fan-selected tournament recognition. Live vote totals stay hidden until
        winners are published.
      </p>

      {winner ? (
        <section
          style={{
            border: '1px solid var(--color-brand-primary)',
            padding: '1.5rem',
            marginBottom: '2rem',
            background: 'var(--color-bg-elevated)',
          }}
        >
          <p className="live-pulse" style={{ color: 'var(--color-brand-primary)' }}>
            Winner
          </p>
          <h2>{winner.displayName}</h2>
          <p>
            {winner.teamName}
            {winner.divisionCode ? ` · ${winner.divisionCode}` : ''}
          </p>
        </section>
      ) : null}

      {!event.mvpVotingOpen ? (
        <p role="status">Voting is currently closed.</p>
      ) : nominees.length === 0 ? (
        <p>Nominees will appear when voting opens.</p>
      ) : (
        <form onSubmit={confirmVote}>
          <div
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            }}
          >
            {nominees.map((n) => (
              <label
                key={n.id}
                style={{
                  border: `1px solid ${selected === n.id ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                  padding: '1rem',
                  background: 'var(--color-bg-elevated)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="nominee"
                  value={n.id}
                  checked={selected === n.id}
                  onChange={() => setSelected(n.id)}
                  style={{ marginRight: 8 }}
                />
                <strong style={{ color: 'var(--color-text)' }}>{n.displayName}</strong>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  {n.teamName}
                </div>
              </label>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <Button type="submit">Confirm vote</Button>
          </div>
        </form>
      )}

      {message ? (
        <p role="status" style={{ color: 'var(--color-success)', fontWeight: 700 }}>
          {message}
        </p>
      ) : null}
      {error ? (
        <p role="alert" style={{ color: 'var(--color-error)' }}>
          {error}
        </p>
      ) : null}
    </div>
  )
}
