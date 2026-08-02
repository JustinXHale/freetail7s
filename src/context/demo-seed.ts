import { DIVISION_SEED, DEFAULT_FAQS, DEFAULT_SPONSORS } from '../data/seedDefaults'
import { EVENT_ID } from '../lib/collections'
import type {
  DivisionDoc,
  EventDoc,
  MatchDoc,
  PoolDoc,
  TeamDoc,
} from '../types/models'
import type { DemoState } from './demo-types'

export function buildInitialDemoState(): DemoState {
  const now = new Date().toISOString()
  const event: EventDoc = {
    id: EVENT_ID,
    name: 'Freetail 7s 2027',
    year: 2027,
    slug: 'freetail-2027',
    phase: 'promo',
    startDate: '2027-01-01',
    endDate: '2027-01-03',
    venueName: 'Huns Rugby Ranch',
    venueAddress: '4107 Nixon Lane',
    venueCity: 'Austin',
    venueState: 'Texas',
    titleSponsor: 'Legacy Ecowear',
    entryFee: 700,
    paymentDeadline: '2026-11-20',
    applicationOpen: true,
    mvpVotingOpen: false,
    mvpMode: 'per-division',
    emergencyBanner: null,
    streamingUrl: null,
    ticketUrl: null,
    paymentUrl: null,
    updatedAt: now,
  }

  const divisions: DivisionDoc[] = DIVISION_SEED.map((d) => ({
    ...d,
    eventId: EVENT_ID,
  }))

  const sampleTeams: TeamDoc[] = [
    {
      id: 'team-huns',
      eventId: EVENT_ID,
      divisionId: 'premier-men',
      divisionCode: 'premier-men',
      name: 'Austin Huns',
      slug: 'austin-huns',
      location: 'Austin, TX',
      hometown: 'Austin, TX',
      description: 'Host club. Premier Men.',
      published: true,
      paymentStatus: 'paid',
      managerUserIds: [],
      rosterAccess: 'shell',
      createdAt: now,
      updatedAt: now,
      poolId: 'pool-pm-a',
    },
    {
      id: 'team-stars-w',
      eventId: EVENT_ID,
      divisionId: 'premier-women',
      divisionCode: 'premier-women',
      name: 'Texas Stars Women',
      slug: 'texas-stars-women',
      location: 'Dallas, TX',
      hometown: 'Dallas, TX',
      published: true,
      paymentStatus: 'paid',
      managerUserIds: [],
      rosterAccess: 'shell',
      createdAt: now,
      updatedAt: now,
      poolId: 'pool-pw-a',
    },
    {
      id: 'team-u18-north',
      eventId: EVENT_ID,
      divisionId: 'elite-u18-boys',
      divisionCode: 'elite-u18-boys',
      name: 'North Texas U18',
      slug: 'north-texas-u18',
      location: 'Dallas, TX',
      hometown: 'Dallas, TX',
      published: true,
      paymentStatus: 'partial',
      managerUserIds: [],
      rosterAccess: 'shell',
      createdAt: now,
      updatedAt: now,
      poolId: 'pool-u18b-a',
    },
  ]

  const pools: PoolDoc[] = [
    {
      id: 'pool-pm-a',
      eventId: EVENT_ID,
      divisionId: 'premier-men',
      divisionCode: 'premier-men',
      name: 'Pool A',
      teamIds: ['team-huns'],
      locked: false,
      published: true,
    },
    {
      id: 'pool-pw-a',
      eventId: EVENT_ID,
      divisionId: 'premier-women',
      divisionCode: 'premier-women',
      name: 'Pool A',
      teamIds: ['team-stars-w'],
      locked: false,
      published: true,
    },
    {
      id: 'pool-u18b-a',
      eventId: EVENT_ID,
      divisionId: 'elite-u18-boys',
      divisionCode: 'elite-u18-boys',
      name: 'Pool A',
      teamIds: ['team-u18-north'],
      locked: false,
      published: true,
    },
  ]

  const friday = new Date('2027-01-01T10:00:00-06:00').toISOString()
  const matches: MatchDoc[] = [
    {
      id: 'match-1',
      eventId: EVENT_ID,
      divisionId: 'elite-u18-boys',
      divisionCode: 'elite-u18-boys',
      poolId: 'pool-u18b-a',
      stage: 'pool',
      day: 'friday',
      kickoffAt: friday,
      field: 'Field 1',
      homeTeamId: 'team-u18-north',
      awayTeamId: null,
      homeScore: null,
      awayScore: null,
      status: 'upcoming',
      published: true,
      version: 1,
      updatedAt: now,
    },
  ]

  return {
    event,
    divisions,
    teams: sampleTeams,
    applications: [],
    refereeApplications: [],
    pools,
    matches,
    standings: [],
    mvpNominees: [],
    announcements: [
      {
        id: 'ann-1',
        eventId: EVENT_ID,
        title: 'Applications are open',
        slug: 'applications-open',
        body: 'Team applications for the 2027 Freetail 7s are now open. Apply early — eight teams per division.',
        urgent: false,
        state: 'published',
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      },
    ],
    sponsors: DEFAULT_SPONSORS.map((s) => ({
      ...s,
      eventId: EVENT_ID,
      published: true,
    })),
    faqs: DEFAULT_FAQS.map((f) => ({
      ...f,
      eventId: EVENT_ID,
      published: true,
    })),
    contactMessages: [],
    emailSignups: [],
    mvpVotes: {},
  }
}
