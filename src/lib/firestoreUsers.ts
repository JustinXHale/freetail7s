import {
  collection,
  onSnapshot,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import type { UserDoc, UserRole } from '../types/models'
import { db, functions } from './firebase'

export type AdminUserRecord = Omit<UserDoc, 'role'> & {
  role: string
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

function mapUserDoc(uid: string, data: DocumentData): AdminUserRecord {
  return {
    uid,
    email: typeof data.email === 'string' ? data.email : null,
    displayName:
      typeof data.displayName === 'string' ? data.displayName : null,
    firstName: typeof data.firstName === 'string' ? data.firstName : '',
    lastName: typeof data.lastName === 'string' ? data.lastName : '',
    photoURL: typeof data.photoURL === 'string' ? data.photoURL : null,
    role: typeof data.role === 'string' ? data.role : 'fan',
    onboardingComplete: Boolean(data.onboardingComplete),
    teamId: typeof data.teamId === 'string' ? data.teamId : undefined,
    createdAt: asIso(data.createdAt),
    updatedAt: asIso(data.updatedAt),
  }
}

export function subscribeUsers(
  onData: (users: AdminUserRecord[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    collection(db, 'users'),
    (snapshot) => {
      const users = snapshot.docs
        .map((item) => mapUserDoc(item.id, item.data()))
        .sort((a, b) => {
          const aName = `${a.firstName} ${a.lastName}`.trim() || a.email || a.uid
          const bName = `${b.firstName} ${b.lastName}`.trim() || b.email || b.uid
          return aName.localeCompare(bName)
        })
      onData(users)
    },
    (error) => onError?.(error),
  )
}

export async function setAdminUserRole(
  uid: string,
  role: UserRole,
  teamId?: string,
): Promise<void> {
  const setUserRole = httpsCallable<
    { uid: string; role: UserRole; teamId?: string },
    { ok: boolean }
  >(functions, 'setUserRole')
  await setUserRole({ uid, role, teamId })
}
