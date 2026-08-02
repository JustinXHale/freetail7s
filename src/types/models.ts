/** Primary app roles. Admin is never self-selected. */
export type UserRole = 'admin' | 'teamManager' | 'referee' | 'fan'

/** Roles a user may choose during onboarding */
export type SelfServeRole = 'fan' | 'teamManager' | 'referee'

export const SELF_SERVE_ROLES: SelfServeRole[] = [
  'fan',
  'teamManager',
  'referee',
]

export const SELF_SERVE_ROLE_LABELS: Record<SelfServeRole, string> = {
  fan: 'Fan',
  teamManager: 'Team manager',
  referee: 'Referee',
}

export const SELF_SERVE_ROLE_HINTS: Record<SelfServeRole, string> = {
  fan: 'Follow the tournament, vote in fan contests, and get updates.',
  teamManager: 'Apply for a team and manage athletes once accepted.',
  referee: 'Officials and crew — match assignments and referee tools.',
}

export type EventPhase = 'promo' | 'prep' | 'live' | 'archive'

export type ApplicationStatus =
  | 'submitted'
  | 'reviewing'
  | 'accepted'
  | 'waitlisted'
  | 'declined'

export type MatchStatus =
  | 'upcoming'
  | 'live'
  | 'final'
  | 'delayed'
  | 'cancelled'
  | 'forfeit'

export type MatchStage =
  | 'pool'
  | 'semifinal'
  | 'final'
  | 'placement'
  | 'championship'

export type DivisionCode =
  | 'premier-men'
  | 'premier-women'
  | 'elite-u18-boys'
  | 'elite-u18-girls'

export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'waived'

export type PublishState = 'draft' | 'published'

export interface EventDoc {
  id: string
  name: string
  year: number
  slug: string
  phase: EventPhase
  startDate: string
  endDate: string
  venueName: string
  venueAddress: string
  venueCity: string
  venueState: string
  titleSponsor: string
  entryFee: number
  paymentDeadline: string
  applicationOpen: boolean
  mvpVotingOpen: boolean
  mvpMode: 'overall' | 'per-division'
  emergencyBanner: string | null
  streamingUrl: string | null
  ticketUrl: string | null
  paymentUrl: string | null
  updatedAt: string
}

export interface DivisionDoc {
  id: string
  eventId: string
  code: DivisionCode
  name: string
  shortName: string
  capacity: number
  order: number
  isU18: boolean
}

export interface OrganizationDoc {
  id: string
  name: string
  location: string
  website?: string
  social?: string
}

export interface MailingAddress {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface TeamDoc {
  id: string
  eventId: string
  organizationId?: string
  divisionId: string
  divisionCode: DivisionCode
  name: string
  slug: string
  /** Display hometown (city / metro) */
  location: string
  hometown?: string
  mailingAddress?: MailingAddress
  website?: string
  instagram?: string
  facebook?: string
  description?: string
  logoUrl?: string
  poolId?: string
  published: boolean
  paymentStatus: PaymentStatus
  managerUserIds: string[]
  /**
   * Roster (coaches / players) stays locked until acceptance workflow opens
   * manager forms. Shell only for now.
   */
  rosterAccess: 'shell' | 'open'
  createdAt: string
  updatedAt: string
}

export interface ApplicationDoc {
  id: string
  eventId: string
  /** Same value as teamName for current applications */
  organizationName: string
  teamName: string
  divisionCode: DivisionCode
  contactName: string
  contactEmail: string
  contactPhone: string
  mailingAddress: MailingAddress
  hometown: string
  website?: string
  instagram?: string
  facebook?: string
  legacyKitInterest: boolean
  notes?: string
  /** Links multi-team submissions from one form session */
  batchId?: string
  status: ApplicationStatus
  /** Firebase uid of the signed-in applicant */
  submittedByUid?: string
  honeypot?: string
  createdAt: string
  updatedAt: string
  reviewedBy?: string
}

/** Crew roles for referee applications */
export type RefereePosition =
  | 'matchOfficial'
  | 'assistantReferee'
  | 'cmo'
  | 'techZoneManager'

export const REFEREE_POSITIONS: RefereePosition[] = [
  'matchOfficial',
  'assistantReferee',
  'cmo',
  'techZoneManager',
]

export const REFEREE_POSITION_LABELS: Record<RefereePosition, string> = {
  matchOfficial: 'Match official',
  assistantReferee: 'Assistant referee',
  cmo: 'CMO',
  techZoneManager: 'Tech Zone Manager',
}

/**
 * Highest sevens competition the official has worked.
 * Ordered roughly from local to elite international.
 */
export type SevensCompetitionLevel =
  | 'localClub'
  | 'highSchoolU18'
  | 'mensWomensQualifiers'
  | 'nationalMensWomensSevens'
  | 'hsbcWorldSeries'
  | 'other'

export const SEVENS_COMPETITION_LEVELS: SevensCompetitionLevel[] = [
  'localClub',
  'highSchoolU18',
  'mensWomensQualifiers',
  'nationalMensWomensSevens',
  'hsbcWorldSeries',
  'other',
]

export const SEVENS_COMPETITION_LABELS: Record<SevensCompetitionLevel, string> =
  {
    localClub: 'Local / club sevens',
    highSchoolU18: 'High school / U18 sevens',
    mensWomensQualifiers: "Men's or Women's qualifiers",
    nationalMensWomensSevens: "National Men's or Women's sevens",
    hsbcWorldSeries: 'HSBC / World Rugby Sevens',
    other: 'Other',
  }

/** Geographic / organizational scope of that highest appointment */
export type SevensOfficiatingScope =
  | 'local'
  | 'regional'
  | 'national'
  | 'international'

export const SEVENS_OFFICIATING_SCOPES: SevensOfficiatingScope[] = [
  'local',
  'regional',
  'national',
  'international',
]

export const SEVENS_OFFICIATING_SCOPE_LABELS: Record<
  SevensOfficiatingScope,
  string
> = {
  local: 'Local only',
  regional: 'Regional',
  national: 'National',
  international: 'International',
}

export interface RefereeApplicationDoc {
  id: string
  eventId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  mailingAddress: MailingAddress
  yearsOfficiating: number
  refereeGrade?: string
  divisionCodes: DivisionCode[]
  positions: RefereePosition[]
  refereeSociety: string
  recommendationContact?: string
  instagram?: string
  facebook?: string
  /** Highest sevens competition worked (e.g. qualifiers vs HSBC) */
  highestSevensCompetition: SevensCompetitionLevel
  highestSevensCompetitionOther?: string
  /** Local vs regional vs national vs international for that competition */
  highestSevensScope: SevensOfficiatingScope
  highestSevensNotes?: string
  /** Optional link to match footage (preferably sevens) */
  matchFootageUrl?: string
  status: ApplicationStatus
  submittedByUid?: string
  honeypot?: string
  createdAt: string
  updatedAt: string
  reviewedBy?: string
}

export interface PoolDoc {
  id: string
  eventId: string
  divisionId: string
  divisionCode: DivisionCode
  name: string
  teamIds: string[]
  locked: boolean
  published: boolean
}

export interface MatchDoc {
  id: string
  eventId: string
  divisionId: string
  divisionCode: DivisionCode
  poolId?: string
  stage: MatchStage
  day: 'friday' | 'saturday' | 'sunday'
  kickoffAt: string
  field: string
  homeTeamId: string | null
  awayTeamId: string | null
  homeScore: number | null
  awayScore: number | null
  status: MatchStatus
  published: boolean
  placementLabel?: string
  notesPrivate?: string
  version: number
  updatedAt: string
  updatedBy?: string
}

export interface StandingDoc {
  id: string
  eventId: string
  poolId: string
  divisionCode: DivisionCode
  teamId: string
  played: number
  won: number
  drawn: number
  lost: number
  pointsFor: number
  pointsAgainst: number
  pointDiff: number
  competitionPoints: number
  overrideRank?: number
  updatedAt: string
}

export interface MvpNomineeDoc {
  id: string
  eventId: string
  divisionCode?: DivisionCode
  displayName: string
  teamId: string
  teamName: string
  photoUrl?: string
  bio?: string
  published: boolean
  isWinner: boolean
  order: number
}

export interface MvpVoteDoc {
  id: string
  eventId: string
  nomineeId: string
  voterKey: string
  createdAt: string
  userAgent?: string
}

export interface AnnouncementDoc {
  id: string
  eventId: string
  title: string
  slug: string
  body: string
  urgent: boolean
  state: PublishState
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface SponsorDoc {
  id: string
  eventId: string
  name: string
  tier: 'title' | 'presenting' | 'gold' | 'silver' | 'supporting'
  logoUrl?: string
  url?: string
  blurb?: string
  order: number
  published: boolean
}

export interface FaqDoc {
  id: string
  eventId: string
  question: string
  answer: string
  order: number
  published: boolean
}

export interface ContentDoc {
  id: string
  eventId: string
  key: string
  title: string
  body: string
  state: PublishState
  updatedAt: string
}

export interface UserDoc {
  uid: string
  email: string | null
  displayName: string | null
  firstName: string
  lastName: string
  photoURL: string | null
  /** Primary role. Signed-in users always retain fan permissions. */
  role: UserRole
  onboardingComplete: boolean
  teamId?: string
  createdAt: string
  updatedAt: string
}

export interface AuditLogDoc {
  id: string
  eventId: string
  actorUid: string
  action: string
  entityType: string
  entityId: string
  before?: unknown
  after?: unknown
  createdAt: string
}

export interface ContactMessageDoc {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  honeypot?: string
}

export interface EmailSignupDoc {
  id: string
  email: string
  createdAt: string
  source: string
}

export interface OperationsDoc {
  id: string
  eventId: string
  section: string
  title: string
  body: string
  updatedAt: string
}

export function isAdmin(role: UserRole): boolean {
  return role === 'admin'
}

/** Full tournament ops access — currently admin-only. */
export function isStaff(role: UserRole): boolean {
  return role === 'admin'
}

export function isTeamManager(role: UserRole): boolean {
  return role === 'teamManager'
}

export function isReferee(role: UserRole): boolean {
  return role === 'referee'
}

/** Every signed-in, onboarded account has fan capabilities. */
export function hasFanAccess(
  role: UserRole,
  opts?: { signedIn?: boolean; onboardingComplete?: boolean },
): boolean {
  if (opts?.signedIn === false) return false
  if (opts?.onboardingComplete === false) return false
  return (
    role === 'fan' ||
    role === 'teamManager' ||
    role === 'referee' ||
    role === 'admin'
  )
}

export function canManageScores(role: UserRole): boolean {
  return role === 'admin'
}

export function canManageContent(role: UserRole): boolean {
  return role === 'admin'
}

export function splitDisplayName(name: string | null | undefined): {
  firstName: string
  lastName: string
} {
  const trimmed = name?.trim() ?? ''
  if (!trimmed) return { firstName: '', lastName: '' }
  const parts = trimmed.split(/\s+/)
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  }
}

export function homePathForRole(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'teamManager':
      return '/team-portal'
    case 'referee':
      return '/'
    case 'fan':
    default:
      return '/'
  }
}
