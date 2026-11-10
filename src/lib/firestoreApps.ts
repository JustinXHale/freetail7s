import {
  addDoc,
  arrayUnion,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  updateDoc,
  where,
  doc,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore'
import { cols, EVENT_ID } from './collections'
import { db } from './firebase'
import type {
  ApplicationDoc,
  ApplicationStatus,
  RefereeApplicationDoc,
} from '../types/models'

/** Firestore rejects `undefined` field values. */
export function stripUndefined(data: object): DocumentData {
  const out: DocumentData = {}
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue
    out[key] = value
  }
  return out
}

function asIso(value: unknown): string {
  if (typeof value === 'string') return value
  if (
    value &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString()
  }
  return new Date().toISOString()
}

export function mapApplicationDoc(
  id: string,
  data: DocumentData,
): ApplicationDoc {
  return {
    ...(data as Omit<ApplicationDoc, 'id' | 'createdAt' | 'updatedAt'>),
    id,
    createdAt: asIso(data.createdAt),
    updatedAt: asIso(data.updatedAt),
  }
}

export function mapRefereeApplicationDoc(
  id: string,
  data: DocumentData,
): RefereeApplicationDoc {
  return {
    ...(data as Omit<RefereeApplicationDoc, 'id' | 'createdAt' | 'updatedAt'>),
    id,
    createdAt: asIso(data.createdAt),
    updatedAt: asIso(data.updatedAt),
  }
}

export async function createTeamApplications(
  inputs: Omit<
    ApplicationDoc,
    'id' | 'createdAt' | 'updatedAt' | 'status' | 'eventId' | 'submittedByUid'
  >[],
  uid: string,
  options?: { entrySource?: 'web' | 'admin' },
): Promise<string[]> {
  const now = new Date().toISOString()
  const entrySource = options?.entrySource ?? 'web'
  const ids: string[] = []
  for (const input of inputs) {
    const { honeypot: _hp, ...rest } = input
    const payload = stripUndefined({
      ...rest,
      eventId: EVENT_ID,
      status: 'submitted' as const,
      submittedByUid: uid,
      entrySource,
      createdAt: now,
      updatedAt: now,
    })
    const ref = await addDoc(cols.applications, payload)
    ids.push(ref.id)
  }
  return ids
}

export async function createRefereeApplication(
  input: Omit<
    RefereeApplicationDoc,
    'id' | 'createdAt' | 'updatedAt' | 'status' | 'eventId' | 'submittedByUid'
  >,
  uid: string,
): Promise<string> {
  const now = new Date().toISOString()
  const { honeypot: _hp, ...rest } = input
  const payload = stripUndefined({
    ...rest,
    eventId: EVENT_ID,
    status: 'submitted' as const,
    submittedByUid: uid,
    createdAt: now,
    updatedAt: now,
  })
  const ref = await addDoc(cols.refereeApplications, payload)
  return ref.id
}

export function subscribeTeamApplications(
  onData: (docs: ApplicationDoc[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(
    cols.applications,
    where('eventId', '==', EVENT_ID),
    orderBy('createdAt', 'desc'),
  )
  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => mapApplicationDoc(d.id, d.data())))
    },
    (err) => onError?.(err),
  )
}

export function subscribeRefereeApplications(
  onData: (docs: RefereeApplicationDoc[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(
    cols.refereeApplications,
    where('eventId', '==', EVENT_ID),
    orderBy('createdAt', 'desc'),
  )
  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => mapRefereeApplicationDoc(d.id, d.data())))
    },
    (err) => onError?.(err),
  )
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<void> {
  await updateDoc(doc(db, 'applications', id), {
    status,
    updatedAt: new Date().toISOString(),
  })
}

/**
 * Accept an application and create its private tournament-team workspace in a
 * single write. A deterministic team id makes repeat acceptance idempotent.
 */
export async function acceptTeamApplication(
  application: ApplicationDoc,
  existingTeamId?: string,
): Promise<void> {
  const now = new Date().toISOString()
  const teamId = existingTeamId ?? `team-${application.id}`
  const slug = application.teamName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const applicationRef = doc(db, 'applications', application.id)
  const teamRef = doc(db, 'teams', teamId)

  await runTransaction(db, async (transaction) => {
    const existingTeam = await transaction.get(teamRef)
    transaction.update(applicationRef, {
      status: 'accepted',
      updatedAt: now,
    })
    if (existingTeam.exists()) {
      transaction.update(
        teamRef,
        stripUndefined({
          applicationId: application.id,
          managerUserIds: application.submittedByUid
            ? arrayUnion(application.submittedByUid)
            : undefined,
          updatedAt: now,
        }),
      )
      return
    }

    transaction.set(
      teamRef,
      stripUndefined({
        id: teamId,
        eventId: application.eventId,
        applicationId: application.id,
        divisionId: application.divisionCode,
        divisionCode: application.divisionCode,
        name: application.teamName.trim(),
        slug: slug || teamId,
        location: application.hometown,
        hometown: application.hometown,
        mailingAddress: application.mailingAddress,
        website: application.website,
        instagram: application.instagram,
        facebook: application.facebook,
        published: false,
        paymentStatus: 'unpaid',
        managerUserIds: application.submittedByUid
          ? [application.submittedByUid]
          : [],
        rosterAccess: 'shell',
        createdAt: now,
        updatedAt: now,
      }),
    )
  })
}

export async function updateRefereeApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<void> {
  await updateDoc(doc(db, 'refereeApplications', id), {
    status,
    updatedAt: new Date().toISOString(),
  })
}
