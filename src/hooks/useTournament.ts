import { useDemo } from '../context/useDemo'
import { useAuth } from '../context/auth-context'
import type {
  ApplicationDoc,
  ApplicationStatus,
  ContactMessageDoc,
  DivisionCode,
  MatchDoc,
  MvpNomineeDoc,
  RefereeApplicationDoc,
} from '../types/models'
import { EVENT_ID } from '../lib/collections'

export function useEvent() {
  const { state } = useDemo()
  return state.event
}

export function useDivisions() {
  const { state } = useDemo()
  return state.divisions
}

export function useTeams(divisionCode?: DivisionCode) {
  const { state } = useDemo()
  const teams = state.teams.filter((t) => t.published)
  if (!divisionCode) return teams
  return teams.filter((t) => t.divisionCode === divisionCode)
}

export function useTeam(slug: string) {
  const { state } = useDemo()
  return state.teams.find((t) => t.slug === slug)
}

export function useMatches(filters?: {
  day?: string
  divisionCode?: string
  status?: string
}) {
  const { state } = useDemo()
  return state.matches
    .filter((m) => m.published)
    .filter((m) => (filters?.day ? m.day === filters.day : true))
    .filter((m) =>
      filters?.divisionCode ? m.divisionCode === filters.divisionCode : true,
    )
    .filter((m) => (filters?.status ? m.status === filters.status : true))
    .sort((a, b) => a.kickoffAt.localeCompare(b.kickoffAt))
}

export function usePools() {
  const { state } = useDemo()
  return state.pools.filter((p) => p.published)
}

export function useStandings(poolId?: string) {
  const { state } = useDemo()
  const rows = state.standings
  if (!poolId) return rows
  return rows
    .filter((s) => s.poolId === poolId)
    .sort((a, b) => {
      if (b.competitionPoints !== a.competitionPoints) {
        return b.competitionPoints - a.competitionPoints
      }
      return b.pointDiff - a.pointDiff
    })
}

export function useFaqs() {
  const { state } = useDemo()
  return [...state.faqs]
    .filter((f) => f.published)
    .sort((a, b) => a.order - b.order)
}

export function useSponsors() {
  const { state } = useDemo()
  return [...state.sponsors]
    .filter((s) => s.published)
    .sort((a, b) => a.order - b.order)
}

export function useAnnouncements() {
  const { state } = useDemo()
  return state.announcements
    .filter((a) => a.state === 'published')
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
}

export function useMvpNominees() {
  const { state } = useDemo()
  return [...state.mvpNominees]
    .filter((n) => n.published)
    .sort((a, b) => a.order - b.order)
}

export function useApplications() {
  const { state, setState } = useDemo()
  return {
    applications: state.applications,
    updateStatus: (id: string, status: ApplicationStatus) => {
      setState((prev) => ({
        ...prev,
        applications: prev.applications.map((a) =>
          a.id === id
            ? { ...a, status, updatedAt: new Date().toISOString() }
            : a,
        ),
      }))
    },
  }
}

export function useRefereeApplications() {
  const { state, setState } = useDemo()
  return {
    refereeApplications: state.refereeApplications,
    updateStatus: (id: string, status: ApplicationStatus) => {
      setState((prev) => ({
        ...prev,
        refereeApplications: prev.refereeApplications.map((a) =>
          a.id === id
            ? { ...a, status, updatedAt: new Date().toISOString() }
            : a,
        ),
      }))
    },
  }
}

type ApplicationInput = Omit<
  ApplicationDoc,
  'id' | 'createdAt' | 'updatedAt' | 'status' | 'eventId' | 'submittedByUid'
> & { honeypot?: string }

export function useSubmitApplication() {
  const { setState } = useDemo()
  const { user } = useAuth()
  return async (input: ApplicationInput | ApplicationInput[]) => {
    const list = Array.isArray(input) ? input : [input]
    if (list.some((item) => item.honeypot)) return { ok: true as const, ids: [] as string[] }
    if (!user?.uid) throw new Error('Sign in required to apply.')
    const now = new Date().toISOString()
    const docs: ApplicationDoc[] = list.map((item) => {
      const { honeypot: _hp, ...rest } = item
      return {
        ...rest,
        id: `app-${crypto.randomUUID()}`,
        eventId: EVENT_ID,
        status: 'submitted',
        submittedByUid: user.uid,
        createdAt: now,
        updatedAt: now,
      }
    })
    setState((prev) => ({
      ...prev,
      applications: [...docs, ...prev.applications],
    }))
    return { ok: true as const, ids: docs.map((d) => d.id) }
  }
}

export function useSubmitRefereeApplication() {
  const { setState } = useDemo()
  const { user } = useAuth()
  return async (
    input: Omit<
      RefereeApplicationDoc,
      'id' | 'createdAt' | 'updatedAt' | 'status' | 'eventId' | 'submittedByUid'
    > & { honeypot?: string },
  ) => {
    if (input.honeypot) return { ok: true as const }
    if (!user?.uid) throw new Error('Sign in required to apply.')
    if (input.positions.length === 0) {
      throw new Error('Select at least one position.')
    }
    if (input.divisionCodes.length === 0) {
      throw new Error('Select at least one division.')
    }
    const now = new Date().toISOString()
    const doc: RefereeApplicationDoc = {
      ...input,
      id: `ref-app-${crypto.randomUUID()}`,
      eventId: EVENT_ID,
      status: 'submitted',
      submittedByUid: user.uid,
      createdAt: now,
      updatedAt: now,
    }
    setState((prev) => ({
      ...prev,
      refereeApplications: [doc, ...prev.refereeApplications],
    }))
    return { ok: true as const, id: doc.id }
  }
}

export function useSubmitContact() {
  const { setState } = useDemo()
  return async (
    input: Omit<ContactMessageDoc, 'id' | 'createdAt'> & { honeypot?: string },
  ) => {
    if (input.honeypot) return { ok: true as const }
    const doc: ContactMessageDoc = {
      id: `contact-${crypto.randomUUID()}`,
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
      createdAt: new Date().toISOString(),
    }
    setState((prev) => ({
      ...prev,
      contactMessages: [doc, ...prev.contactMessages],
    }))
    return { ok: true as const }
  }
}

export function useEmailSignup() {
  const { setState } = useDemo()
  return async (email: string) => {
    setState((prev) => ({
      ...prev,
      emailSignups: [
        {
          id: `email-${crypto.randomUUID()}`,
          email,
          createdAt: new Date().toISOString(),
          source: 'homepage',
        },
        ...prev.emailSignups,
      ],
    }))
    return { ok: true as const }
  }
}

export function useCastMvpVote() {
  const { state, setState } = useDemo()
  return async (nomineeId: string, voterKey: string) => {
    if (!state.event.mvpVotingOpen) {
      throw new Error('Voting is closed.')
    }
    if (state.mvpVotes[voterKey]) {
      throw new Error('You have already voted.')
    }
    setState((prev) => ({
      ...prev,
      mvpVotes: { ...prev.mvpVotes, [voterKey]: nomineeId },
    }))
    return { ok: true as const }
  }
}

export function useAdminMatches() {
  const { state, setState } = useDemo()
  return {
    matches: state.matches,
    upsertMatch: (match: MatchDoc) => {
      setState((prev) => {
        const exists = prev.matches.some((m) => m.id === match.id)
        return {
          ...prev,
          matches: exists
            ? prev.matches.map((m) => (m.id === match.id ? match : m))
            : [...prev.matches, match],
        }
      })
    },
  }
}

export function useAdminMvp() {
  const { state, setState } = useDemo()
  return {
    nominees: state.mvpNominees,
    votingOpen: state.event.mvpVotingOpen,
    setVotingOpen: (open: boolean) => {
      setState((prev) => ({
        ...prev,
        event: { ...prev.event, mvpVotingOpen: open },
      }))
    },
    upsertNominee: (nominee: MvpNomineeDoc) => {
      setState((prev) => {
        const exists = prev.mvpNominees.some((n) => n.id === nominee.id)
        return {
          ...prev,
          mvpNominees: exists
            ? prev.mvpNominees.map((n) => (n.id === nominee.id ? nominee : n))
            : [...prev.mvpNominees, nominee],
        }
      })
    },
    publishWinner: (id: string) => {
      setState((prev) => ({
        ...prev,
        mvpNominees: prev.mvpNominees.map((n) => ({
          ...n,
          isWinner: n.id === id,
        })),
        event: { ...prev.event, mvpVotingOpen: false },
      }))
    },
  }
}

export function useTeamName(id: string | null) {
  const { state } = useDemo()
  if (!id) return 'TBD'
  return state.teams.find((t) => t.id === id)?.name ?? 'TBD'
}

export function useOfflineCacheFlag() {
  // Placeholder for SW stale indicator integration
  return { isStale: false, lastSyncedAt: new Date().toISOString() }
}
