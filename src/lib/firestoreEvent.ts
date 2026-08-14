import {
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore'
import { cols, EVENT_ID, eventRef } from './collections'
import type { DivisionDoc, EventDoc, EventPhase } from '../types/models'

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

export function mapEventDoc(id: string, data: DocumentData): EventDoc {
  return {
    ...(data as Omit<EventDoc, 'id' | 'updatedAt' | 'applicationDeadline'>),
    id,
    applicationDeadline:
      typeof data.applicationDeadline === 'string' && data.applicationDeadline
        ? data.applicationDeadline
        : '2026-10-01',
    updatedAt: asIso(data.updatedAt),
  }
}

export function mapDivisionDoc(id: string, data: DocumentData): DivisionDoc {
  return {
    ...(data as Omit<DivisionDoc, 'id'>),
    id,
  }
}

export function subscribeEvent(
  onData: (event: EventDoc | null) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  return onSnapshot(
    eventRef(),
    (snap) => {
      if (!snap.exists()) {
        onData(null)
        return
      }
      onData(mapEventDoc(snap.id, snap.data()))
    },
    (err) => onError?.(err),
  )
}

export function subscribeDivisions(
  onData: (docs: DivisionDoc[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(
    cols.divisions,
    where('eventId', '==', EVENT_ID),
    orderBy('order', 'asc'),
  )
  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => mapDivisionDoc(d.id, d.data())))
    },
    (err) => onError?.(err),
  )
}

export type EventSettingsPatch = Partial<
  Pick<
    EventDoc,
    | 'applicationOpen'
    | 'emergencyBanner'
    | 'phase'
    | 'applicationDeadline'
    | 'paymentDeadline'
  >
>

export async function updateEventSettings(
  patch: EventSettingsPatch,
): Promise<void> {
  await updateDoc(eventRef(), {
    ...patch,
    updatedAt: new Date().toISOString(),
  })
}

/** Format YYYY-MM-DD (or ISO) for public copy, e.g. October 1, 2026. */
export function formatEventDeadline(isoDate: string): string {
  const day = isoDate.slice(0, 10)
  const d = new Date(`${day}T12:00:00`)
  if (Number.isNaN(d.getTime())) return isoDate
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function isEventPhase(value: string): value is EventPhase {
  return (
    value === 'promo' ||
    value === 'prep' ||
    value === 'live' ||
    value === 'archive'
  )
}
