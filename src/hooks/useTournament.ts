import { useEffect, useState } from 'react'
import { useDemo } from '../context/useDemo'
import { useAuth } from '../context/auth-context'
import type {
  ApplicationDoc,
  ApplicationStatus,
  DivisionCode,
  DivisionDoc,
  EventDoc,
  MatchDoc,
  MvpNomineeDoc,
  RefereeApplicationDoc,
  TeamDoc,
} from '../types/models'
import { EVENT_ID } from '../lib/collections'
import {
  createRefereeApplication,
  createTeamApplications,
  subscribeRefereeApplications,
  subscribeTeamApplications,
  updateApplicationStatus,
  updateRefereeApplicationStatus,
} from '../lib/firestoreApps'
import {
  subscribeDivisions,
  subscribeEvent,
  updateEventSettings,
  type EventSettingsPatch,
} from '../lib/firestoreEvent'
import {
  createTeam,
  deleteTeam,
  subscribeEventTeams,
  subscribePublishedTeams,
  updateTeam,
  type TeamUpdateInput,
} from '../lib/firestoreTeams'

export function useEvent() {
  const { state, usingDemo } = useDemo()
  const [remote, setRemote] = useState<EventDoc | null>(null)

  useEffect(() => {
    if (usingDemo) {
      setRemote(null)
      return
    }
    return subscribeEvent(
      (doc) => setRemote(doc),
      (err) => console.error(err),
    )
  }, [usingDemo])

  return usingDemo ? state.event : (remote ?? state.event)
}

export function useDivisions() {
  const { state, usingDemo } = useDemo()
  const [remote, setRemote] = useState<DivisionDoc[] | null>(null)

  useEffect(() => {
    if (usingDemo) {
      setRemote(null)
      return
    }
    return subscribeDivisions(
      (docs) => setRemote(docs),
      (err) => console.error(err),
    )
  }, [usingDemo])

  if (usingDemo || remote === null) return state.divisions
  return remote
}

export function useUpdateEventSettings() {
  const { setState, usingDemo } = useDemo()
  return async (patch: EventSettingsPatch) => {
    if (usingDemo) {
      setState((prev) => ({
        ...prev,
        event: {
          ...prev.event,
          ...patch,
          updatedAt: new Date().toISOString(),
        },
      }))
      return
    }
    await updateEventSettings(patch)
  }
}

export function useTeams(divisionCode?: DivisionCode) {
  const { state, usingDemo } = useDemo()
  const [remote, setRemote] = useState<TeamDoc[] | null>(null)

  useEffect(() => {
    if (usingDemo) {
      setRemote(null)
      return
    }
    return subscribePublishedTeams(
      (docs) => setRemote(docs),
      (err) => console.error(err),
    )
  }, [usingDemo])

  const teams = usingDemo
    ? state.teams.filter((t) => t.published)
    : (remote ?? [])
  if (!divisionCode) return teams
  return teams.filter((t) => t.divisionCode === divisionCode)
}

export function useTeam(slug: string) {
  const teams = useTeams()
  return teams.find((t) => t.slug === slug)
}

export function useAdminTeams() {
  const { state, setState, usingDemo } = useDemo()
  const [remote, setRemote] = useState<TeamDoc[]>([])
  const [loading, setLoading] = useState(!usingDemo)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (usingDemo) {
      setLoading(false)
      setError(null)
      return
    }
    setLoading(true)
    return subscribeEventTeams(
      (docs) => {
        setRemote(docs)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error(err)
        setError(
          err.message.includes('permission')
            ? 'Cannot load teams. Confirm your account role is admin.'
            : err.message,
        )
        setLoading(false)
      },
    )
  }, [usingDemo])

  return {
    teams: usingDemo ? state.teams : remote,
    loading,
    error,
    addTeam: async (name: string, divisionCode: DivisionCode) => {
      if (usingDemo) {
        const now = new Date().toISOString()
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        setState((prev) => ({
          ...prev,
          teams: [
            ...prev.teams,
            {
              id: `team-${crypto.randomUUID()}`,
              eventId: EVENT_ID,
              divisionId: divisionCode,
              divisionCode,
              name,
              slug,
              location: 'TBD',
              hometown: 'TBD',
              published: false,
              paymentStatus: 'unpaid',
              managerUserIds: [],
              rosterAccess: 'shell',
              createdAt: now,
              updatedAt: now,
            },
          ],
        }))
        return
      }
      await createTeam({ name, divisionCode })
    },
    saveTeam: async (id: string, patch: TeamUpdateInput) => {
      if (usingDemo) {
        setState((prev) => ({
          ...prev,
          teams: prev.teams.map((t) =>
            t.id !== id
              ? t
              : {
                  ...t,
                  ...patch,
                  updatedAt: new Date().toISOString(),
                },
          ),
        }))
        return
      }
      await updateTeam(id, patch)
    },
    removeTeam: async (id: string) => {
      if (usingDemo) {
        setState((prev) => ({
          ...prev,
          teams: prev.teams.filter((x) => x.id !== id),
          pools: prev.pools.map((p) => ({
            ...p,
            teamIds: p.teamIds.filter((tid) => tid !== id),
          })),
          matches: prev.matches.map((m) => ({
            ...m,
            homeTeamId: m.homeTeamId === id ? null : m.homeTeamId,
            awayTeamId: m.awayTeamId === id ? null : m.awayTeamId,
          })),
          standings: prev.standings.filter((s) => s.teamId !== id),
        }))
        return
      }
      await deleteTeam(id)
    },
  }
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
  const { state, setState, usingDemo } = useDemo()
  const [remote, setRemote] = useState<ApplicationDoc[]>([])
  const [loading, setLoading] = useState(!usingDemo)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (usingDemo) {
      setLoading(false)
      setError(null)
      return
    }
    setLoading(true)
    return subscribeTeamApplications(
      (docs) => {
        setRemote(docs)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error(err)
        setError(
          err.message.includes('permission')
            ? 'Cannot load applications. Confirm your account role is admin.'
            : err.message,
        )
        setLoading(false)
      },
    )
  }, [usingDemo])

  return {
    applications: usingDemo ? state.applications : remote,
    loading,
    error,
    updateStatus: async (id: string, status: ApplicationStatus) => {
      if (usingDemo) {
        setState((prev) => ({
          ...prev,
          applications: prev.applications.map((a) =>
            a.id === id
              ? { ...a, status, updatedAt: new Date().toISOString() }
              : a,
          ),
        }))
        return
      }
      await updateApplicationStatus(id, status)
    },
  }
}

export function useRefereeApplications() {
  const { state, setState, usingDemo } = useDemo()
  const [remote, setRemote] = useState<RefereeApplicationDoc[]>([])
  const [loading, setLoading] = useState(!usingDemo)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (usingDemo) {
      setLoading(false)
      setError(null)
      return
    }
    setLoading(true)
    return subscribeRefereeApplications(
      (docs) => {
        setRemote(docs)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error(err)
        setError(
          err.message.includes('permission')
            ? 'Cannot load referee applications. Confirm your account role is admin.'
            : err.message,
        )
        setLoading(false)
      },
    )
  }, [usingDemo])

  return {
    refereeApplications: usingDemo ? state.refereeApplications : remote,
    loading,
    error,
    updateStatus: async (id: string, status: ApplicationStatus) => {
      if (usingDemo) {
        setState((prev) => ({
          ...prev,
          refereeApplications: prev.refereeApplications.map((a) =>
            a.id === id
              ? { ...a, status, updatedAt: new Date().toISOString() }
              : a,
          ),
        }))
        return
      }
      await updateRefereeApplicationStatus(id, status)
    },
  }
}

type ApplicationInput = Omit<
  ApplicationDoc,
  'id' | 'createdAt' | 'updatedAt' | 'status' | 'eventId' | 'submittedByUid'
> & { honeypot?: string }

export function useSubmitApplication() {
  const { setState, usingDemo } = useDemo()
  const { user } = useAuth()
  return async (input: ApplicationInput | ApplicationInput[]) => {
    const list = Array.isArray(input) ? input : [input]
    if (list.some((item) => item.honeypot)) {
      return { ok: true as const, ids: [] as string[] }
    }
    if (!user?.uid) throw new Error('Sign in required to apply.')

    if (!usingDemo) {
      const ids = await createTeamApplications(list, user.uid)
      return { ok: true as const, ids }
    }

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
  const { setState, usingDemo } = useDemo()
  const { user } = useAuth()
  return async (
    input: Omit<
      RefereeApplicationDoc,
      'id' | 'createdAt' | 'updatedAt' | 'status' | 'eventId' | 'submittedByUid'
    > & { honeypot?: string },
  ) => {
    if (input.honeypot) return { ok: true as const, id: '' }
    if (!user?.uid) throw new Error('Sign in required to apply.')
    if (input.positions.length === 0) {
      throw new Error('Select at least one position.')
    }
    if (input.divisionCodes.length === 0) {
      throw new Error('Select at least one division.')
    }

    if (!usingDemo) {
      const id = await createRefereeApplication(input, user.uid)
      return { ok: true as const, id }
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
  const published = useTeams()
  const { state, usingDemo } = useDemo()
  if (!id) return 'TBD'
  if (usingDemo) {
    return state.teams.find((t) => t.id === id)?.name ?? 'TBD'
  }
  return published.find((t) => t.id === id)?.name ?? 'TBD'
}

export function useOfflineCacheFlag() {
  // Placeholder for SW stale indicator integration
  return { isStale: false, lastSyncedAt: new Date().toISOString() }
}
