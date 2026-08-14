import {
  addDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
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
export function stripUndefined<T extends Record<string, unknown>>(
  data: T,
): Record<string, unknown> {
  const out: Record<string, unknown> = {}
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
  data: Record<string, unknown>,
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
  data: Record<string, unknown>,
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
): Promise<string[]> {
  const now = new Date().toISOString()
  const ids: string[] = []
  for (const input of inputs) {
    const { honeypot: _hp, ...rest } = input
    const payload = stripUndefined({
      ...rest,
      eventId: EVENT_ID,
      status: 'submitted' as const,
      submittedByUid: uid,
      createdAt: now,
      updatedAt: now,
    })
    const ref = await addDoc(cols.applications, payload as ApplicationDoc)
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
  const ref = await addDoc(
    cols.refereeApplications,
    payload as RefereeApplicationDoc,
  )
  return ref.id
}

export function subscribeTeamApplications(
  onData: (docs: ApplicationDoc[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(cols.applications, orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    (snap) => {
      onData(
        snap.docs.map((d) =>
          mapApplicationDoc(d.id, d.data() as Record<string, unknown>),
        ),
      )
    },
    (err) => onError?.(err),
  )
}

export function subscribeRefereeApplications(
  onData: (docs: RefereeApplicationDoc[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(cols.refereeApplications, orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    (snap) => {
      onData(
        snap.docs.map((d) =>
          mapRefereeApplicationDoc(d.id, d.data() as Record<string, unknown>),
        ),
      )
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

export async function updateRefereeApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<void> {
  await updateDoc(doc(db, 'refereeApplications', id), {
    status,
    updatedAt: new Date().toISOString(),
  })
}
