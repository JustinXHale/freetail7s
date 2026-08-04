/**
 * Seed script for Firestore (run against emulators or prod with credentials).
 * Usage:
 *   VITE_USE_EMULATORS=true npx tsx scripts/seed.ts
 *   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json npx tsx scripts/seed.ts
 */
import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { DIVISION_SEED, DEFAULT_FAQS, DEFAULT_SPONSORS } from '../src/data/seedDefaults'

const EVENT_ID = 'freetail-2027'

if (!getApps().length) {
  if (process.env.FIRESTORE_EMULATOR_HOST || process.env.VITE_USE_EMULATORS === 'true') {
    process.env.FIRESTORE_EMULATOR_HOST ||= '127.0.0.1:8080'
    initializeApp({ projectId: 'freetail7s' })
  } else {
    initializeApp({ credential: applicationDefault(), projectId: 'freetail7s' })
  }
}

const db = getFirestore()
const now = new Date().toISOString()

async function main() {
  await db.doc(`events/${EVENT_ID}`).set(
    {
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
      titleSponsor: 'Legacy EcoWear',
      entryFee: 650,
      paymentDeadline: '2026-11-20',
      applicationOpen: true,
      mvpVotingOpen: false,
      mvpMode: 'per-division',
      emergencyBanner: null,
      streamingUrl: null,
      ticketUrl: null,
      paymentUrl: null,
      updatedAt: now,
    },
    { merge: true },
  )

  for (const d of DIVISION_SEED) {
    await db.doc(`divisions/${d.id}`).set({ ...d, eventId: EVENT_ID }, { merge: true })
  }

  for (const f of DEFAULT_FAQS) {
    await db.doc(`faq/${f.id}`).set(
      { ...f, eventId: EVENT_ID, published: true },
      { merge: true },
    )
  }

  for (const s of DEFAULT_SPONSORS) {
    await db.doc(`sponsors/${s.id}`).set(
      { ...s, eventId: EVENT_ID, published: true },
      { merge: true },
    )
  }

  console.log('Seeded event, divisions, FAQ, and sponsors for', EVENT_ID)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
