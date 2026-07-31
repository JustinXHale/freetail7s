import { initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { logger } from 'firebase-functions'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'

initializeApp()
const db = getFirestore()

const SCORE = new Set(['admin', 'owner', 'eventAdmin', 'scorekeeper'])

async function requireRole(uid: string | undefined, allowed: Set<string>) {
  if (!uid) throw new HttpsError('unauthenticated', 'Sign in required.')
  const snap = await db.doc(`users/${uid}`).get()
  const role = snap.data()?.role as string | undefined
  if (!role || !allowed.has(role)) {
    throw new HttpsError('permission-denied', 'Insufficient permissions.')
  }
  return role
}

export const submitScore = onCall(async (request) => {
  await requireRole(request.auth?.uid, SCORE)
  const { matchId, homeScore, awayScore, status, expectedVersion } =
    request.data ?? {}

  if (typeof matchId !== 'string' || matchId.length < 1) {
    throw new HttpsError('invalid-argument', 'matchId required.')
  }
  if (
    typeof homeScore !== 'number' ||
    typeof awayScore !== 'number' ||
    homeScore < 0 ||
    awayScore < 0
  ) {
    throw new HttpsError('invalid-argument', 'Scores must be non-negative numbers.')
  }

  const ref = db.doc(`matches/${matchId}`)
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref)
    if (!snap.exists) throw new HttpsError('not-found', 'Match not found.')
    const data = snap.data()!
    if (
      typeof expectedVersion === 'number' &&
      data.version !== expectedVersion
    ) {
      throw new HttpsError(
        'aborted',
        'Match was updated elsewhere. Refresh and try again.',
      )
    }
    const next = {
      homeScore,
      awayScore,
      status: status ?? 'final',
      version: (data.version ?? 0) + 1,
      updatedAt: new Date().toISOString(),
      updatedBy: request.auth!.uid,
    }
    tx.update(ref, next)
    tx.set(db.collection('auditLogs').doc(), {
      eventId: data.eventId,
      actorUid: request.auth!.uid,
      action: 'submitScore',
      entityType: 'match',
      entityId: matchId,
      before: {
        homeScore: data.homeScore,
        awayScore: data.awayScore,
        status: data.status,
        version: data.version,
      },
      after: next,
      createdAt: new Date().toISOString(),
    })
  })

  return { ok: true }
})

export const castMvpVote = onCall(async (request) => {
  const { eventId, nomineeId, voterKey } = request.data ?? {}
  if (
    typeof eventId !== 'string' ||
    typeof nomineeId !== 'string' ||
    typeof voterKey !== 'string' ||
    voterKey.length < 12
  ) {
    throw new HttpsError('invalid-argument', 'Invalid vote payload.')
  }

  const eventSnap = await db.doc(`events/${eventId}`).get()
  if (!eventSnap.exists || !eventSnap.data()?.mvpVotingOpen) {
    throw new HttpsError('failed-precondition', 'Voting is closed.')
  }

  const nomineeSnap = await db.doc(`mvpNominees/${nomineeId}`).get()
  if (!nomineeSnap.exists || !nomineeSnap.data()?.published) {
    throw new HttpsError('not-found', 'Nominee not found.')
  }

  const voteId = `${eventId}_${voterKey}`
  const voteRef = db.doc(`mvpVotes/${voteId}`)
  const existing = await voteRef.get()
  if (existing.exists) {
    throw new HttpsError('already-exists', 'You have already voted.')
  }

  await voteRef.set({
    eventId,
    nomineeId,
    voterKey,
    createdAt: new Date().toISOString(),
    userAgent:
      typeof request.rawRequest?.headers?.['user-agent'] === 'string'
        ? request.rawRequest.headers['user-agent'].slice(0, 200)
        : null,
  })

  return { ok: true }
})

export const recalculateStandings = onCall(async (request) => {
  await requireRole(request.auth?.uid, SCORE)
  const { poolId } = request.data ?? {}
  if (typeof poolId !== 'string') {
    throw new HttpsError('invalid-argument', 'poolId required.')
  }

  const poolSnap = await db.doc(`pools/${poolId}`).get()
  if (!poolSnap.exists) throw new HttpsError('not-found', 'Pool not found.')
  const pool = poolSnap.data()!

  const matchesSnap = await db
    .collection('matches')
    .where('poolId', '==', poolId)
    .where('status', 'in', ['final', 'forfeit'])
    .get()

  type Acc = {
    played: number
    won: number
    drawn: number
    lost: number
    pointsFor: number
    pointsAgainst: number
    competitionPoints: number
  }
  const table = new Map<string, Acc>()
  for (const teamId of pool.teamIds as string[]) {
    table.set(teamId, {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      competitionPoints: 0,
    })
  }

  for (const doc of matchesSnap.docs) {
    const m = doc.data()
    if (m.homeTeamId == null || m.awayTeamId == null) continue
    if (m.homeScore == null || m.awayScore == null) continue
    const home = table.get(m.homeTeamId)
    const away = table.get(m.awayTeamId)
    if (!home || !away) continue
    home.played += 1
    away.played += 1
    home.pointsFor += m.homeScore
    home.pointsAgainst += m.awayScore
    away.pointsFor += m.awayScore
    away.pointsAgainst += m.homeScore
    if (m.homeScore > m.awayScore) {
      home.won += 1
      away.lost += 1
      home.competitionPoints += 3
    } else if (m.awayScore > m.homeScore) {
      away.won += 1
      home.lost += 1
      away.competitionPoints += 3
    } else {
      home.drawn += 1
      away.drawn += 1
      home.competitionPoints += 1
      away.competitionPoints += 1
    }
  }

  const batch = db.batch()
  for (const [teamId, row] of table) {
    const id = `${poolId}_${teamId}`
    batch.set(
      db.doc(`standings/${id}`),
      {
        id,
        eventId: pool.eventId,
        poolId,
        divisionCode: pool.divisionCode,
        teamId,
        ...row,
        pointDiff: row.pointsFor - row.pointsAgainst,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    )
  }
  await batch.commit()
  logger.info('Standings recalculated', { poolId })
  return { ok: true }
})

export const onApplicationCreated = onDocumentCreated(
  'applications/{id}',
  async (event) => {
    const data = event.data?.data()
    if (!data) return
    logger.info('New application', {
      id: event.params.id,
      team: data.teamName,
      division: data.divisionCode,
      email: data.contactEmail,
    })
    // Wire SendGrid / Firebase Extensions for email in production.
    await db.collection('auditLogs').add({
      eventId: data.eventId,
      actorUid: 'system',
      action: 'applicationSubmitted',
      entityType: 'application',
      entityId: event.params.id,
      after: { teamName: data.teamName, status: data.status },
      createdAt: FieldValue.serverTimestamp(),
    })
  },
)

export const onRefereeApplicationCreated = onDocumentCreated(
  'refereeApplications/{id}',
  async (event) => {
    const data = event.data?.data()
    if (!data) return
    logger.info('New referee application', {
      id: event.params.id,
      name: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim(),
      email: data.email,
      positions: data.positions,
    })
    await db.collection('auditLogs').add({
      eventId: data.eventId,
      actorUid: 'system',
      action: 'refereeApplicationSubmitted',
      entityType: 'refereeApplication',
      entityId: event.params.id,
      after: {
        email: data.email,
        positions: data.positions,
        status: data.status,
      },
      createdAt: FieldValue.serverTimestamp(),
    })
  },
)

export const setUserRole = onCall(async (request) => {
  await requireRole(request.auth?.uid, new Set(['admin', 'owner']))
  const { uid, role, teamId } = request.data ?? {}
  const allowedRoles = ['admin', 'teamManager', 'referee', 'fan']
  if (typeof uid !== 'string' || !allowedRoles.includes(role)) {
    throw new HttpsError('invalid-argument', 'Invalid uid or role.')
  }
  await db.doc(`users/${uid}`).set(
    {
      role,
      teamId: teamId ?? null,
      onboardingComplete: true,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  )
  return { ok: true }
})
