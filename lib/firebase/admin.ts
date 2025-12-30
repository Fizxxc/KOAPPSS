import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore, Timestamp } from "firebase-admin/firestore"

const adminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
}

// Init safe
const adminApp =
  getApps().find(app => app.name === "admin") ??
  initializeApp(adminConfig, "admin")

const adminAuth = getAuth(adminApp)
const adminDb = getFirestore(adminApp)

// 🔥 INI YANG KURANG
const adminTimestamp = Timestamp

adminDb.settings({ ignoreUndefinedProperties: true })

export { adminApp, adminAuth, adminDb, adminTimestamp }
