import {
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore'
import { cols, EVENT_ID } from './collections'
import { db } from './firebase'
import { stripUndefined } from './firestoreApps'
import type { DivisionCode, PaymentStatus, TeamDoc } from '../types/models'

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

export function mapTeamDoc(id: string, data: DocumentData): TeamDoc {
  return {
    ...(data as Omit<TeamDoc, 'id' | 'createdAt' | 'updatedAt'>),
    id,
    createdAt: asIso(data.createdAt),
    updatedAt: asIso(data.updatedAt),
  }
}

export function subscribeEventTeams(
  onData: (docs: TeamDoc[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(
    cols.teams,
    where('eventId', '==', EVENT_ID),
    orderBy('name', 'asc'),
  )
  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => mapTeamDoc(d.id, d.data())))
    },
    (err) => onError?.(err),
  )
}

export function subscribePublishedTeams(
  onData: (docs: TeamDoc[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(
    cols.teams,
    where('eventId', '==', EVENT_ID),
    where('published', '==', true),
    orderBy('name', 'asc'),
  )
  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => mapTeamDoc(d.id, d.data())))
    },
    (err) => onError?.(err),
  )
}

export type TeamCreateInput = {
  name: string
  divisionCode: DivisionCode
}

export async function createTeam(input: TeamCreateInput): Promise<string> {
  const now = new Date().toISOString()
  const id = `team-${crypto.randomUUID()}`
  const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const payload = stripUndefined({
    id,
    eventId: EVENT_ID,
    divisionId: input.divisionCode,
    divisionCode: input.divisionCode,
    name: input.name.trim(),
    slug: slug || id,
    location: 'TBD',
    hometown: 'TBD',
    published: false,
    paymentStatus: 'unpaid' as PaymentStatus,
    managerUserIds: [] as string[],
    rosterAccess: 'shell' as const,
    createdAt: now,
    updatedAt: now,
  })
  await setDoc(doc(db, 'teams', id), payload)
  return id
}

export type TeamUpdateInput = Partial<
  Omit<TeamDoc, 'id' | 'eventId' | 'createdAt'>
>

export async function updateTeam(
  id: string,
  patch: TeamUpdateInput,
): Promise<void> {
  const payload = stripUndefined({
    ...patch,
    updatedAt: new Date().toISOString(),
  })
  await updateDoc(doc(db, 'teams', id), payload)
}

export async function deleteTeam(id: string): Promise<void> {
  await deleteDoc(doc(db, 'teams', id))
}
