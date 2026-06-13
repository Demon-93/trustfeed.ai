import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let firebaseApp: FirebaseApp
let firebaseAuth: Auth

if (typeof window !== "undefined") {
  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig)
  } else {
    firebaseApp = getApps()[0]
  }
  firebaseAuth = getAuth(firebaseApp)
}

export function getApp(): FirebaseApp {
  if (!firebaseApp) {
    throw new Error("Firebase not initialized. Make sure NEXT_PUBLIC_FIREBASE_* env vars are set.")
  }
  return firebaseApp
}

export function getFirebaseAuth(): Auth {
  if (!firebaseAuth) {
    throw new Error("Firebase Auth not initialized. Make sure NEXT_PUBLIC_FIREBASE_* env vars are set.")
  }
  return firebaseAuth
}
