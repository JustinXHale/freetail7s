import type { Dispatch, SetStateAction } from 'react'
import type {
  AnnouncementDoc,
  ApplicationDoc,
  ContactMessageDoc,
  DivisionDoc,
  EmailSignupDoc,
  EventDoc,
  FaqDoc,
  MatchDoc,
  MvpNomineeDoc,
  PoolDoc,
  RefereeApplicationDoc,
  SponsorDoc,
  StandingDoc,
  TeamDoc,
} from '../types/models'

export interface DemoState {
  event: EventDoc
  divisions: DivisionDoc[]
  teams: TeamDoc[]
  applications: ApplicationDoc[]
  refereeApplications: RefereeApplicationDoc[]
  pools: PoolDoc[]
  matches: MatchDoc[]
  standings: StandingDoc[]
  mvpNominees: MvpNomineeDoc[]
  announcements: AnnouncementDoc[]
  sponsors: SponsorDoc[]
  faqs: FaqDoc[]
  contactMessages: ContactMessageDoc[]
  emailSignups: EmailSignupDoc[]
  mvpVotes: Record<string, string>
}

export interface DemoContextValue {
  state: DemoState
  setState: Dispatch<SetStateAction<DemoState>>
  usingDemo: boolean
}
