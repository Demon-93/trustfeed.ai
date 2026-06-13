import { cert, getApps, initializeApp, type App } from "firebase-admin/app"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

let app: App | null = null
let db: Firestore | null = null

function getAdminApp(): App {
  if (!app) {
    if (!getApps().length) {
      app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      })
    } else {
      app = getApps()[0]
    }
  }
  return app
}

export function getAdminDb(): Firestore {
  if (!db) {
    db = getFirestore(getAdminApp())
  }
  return db
}
