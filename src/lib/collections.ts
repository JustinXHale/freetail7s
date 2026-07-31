import {
  collection,
  doc,
  type CollectionReference,
  type DocumentReference,
} from 'firebase/firestore'
import { db } from './firebase'
import type {
  AnnouncementDoc,
  ApplicationDoc,
  AuditLogDoc,
  ContactMessageDoc,
  ContentDoc,
  DivisionDoc,
  EmailSignupDoc,
  EventDoc,
  FaqDoc,
  MatchDoc,
  MvpNomineeDoc,
  MvpVoteDoc,
  OperationsDoc,
  OrganizationDoc,
  PoolDoc,
  RefereeApplicationDoc,
  SponsorDoc,
  StandingDoc,
  TeamDoc,
  UserDoc,
} from '../types/models'

export const EVENT_ID = 'freetail-2027'

export const cols = {
  events: collection(db, 'events') as CollectionReference<EventDoc>,
  divisions: collection(db, 'divisions') as CollectionReference<DivisionDoc>,
  organizations: collection(
    db,
    'organizations',
  ) as CollectionReference<OrganizationDoc>,
  teams: collection(db, 'teams') as CollectionReference<TeamDoc>,
  applications: collection(
    db,
    'applications',
  ) as CollectionReference<ApplicationDoc>,
  refereeApplications: collection(
    db,
    'refereeApplications',
  ) as CollectionReference<RefereeApplicationDoc>,
  pools: collection(db, 'pools') as CollectionReference<PoolDoc>,
  matches: collection(db, 'matches') as CollectionReference<MatchDoc>,
  standings: collection(db, 'standings') as CollectionReference<StandingDoc>,
  mvpNominees: collection(
    db,
    'mvpNominees',
  ) as CollectionReference<MvpNomineeDoc>,
  mvpVotes: collection(db, 'mvpVotes') as CollectionReference<MvpVoteDoc>,
  announcements: collection(
    db,
    'announcements',
  ) as CollectionReference<AnnouncementDoc>,
  sponsors: collection(db, 'sponsors') as CollectionReference<SponsorDoc>,
  faq: collection(db, 'faq') as CollectionReference<FaqDoc>,
  content: collection(db, 'content') as CollectionReference<ContentDoc>,
  users: collection(db, 'users') as CollectionReference<UserDoc>,
  auditLogs: collection(db, 'auditLogs') as CollectionReference<AuditLogDoc>,
  contactMessages: collection(
    db,
    'contactMessages',
  ) as CollectionReference<ContactMessageDoc>,
  emailSignups: collection(
    db,
    'emailSignups',
  ) as CollectionReference<EmailSignupDoc>,
  operations: collection(db, 'operations') as CollectionReference<OperationsDoc>,
}

export function eventRef(): DocumentReference<EventDoc> {
  return doc(cols.events, EVENT_ID)
}

export function userRef(uid: string): DocumentReference<UserDoc> {
  return doc(cols.users, uid)
}
