import { getAdminDb } from "./admin"
import { VideoResult, CreatorProfile } from "@/types"

export async function getVideo(videoId: string): Promise<VideoResult | null> {
  const db = getAdminDb()
  const docRef = db.collection("videos").doc(videoId)
  const docSnap = await docRef.get()
  return docSnap.exists ? (docSnap.data() as VideoResult) : null
}

export async function setVideo(videoId: string, data: Partial<VideoResult>): Promise<void> {
  const db = getAdminDb()
  await db.collection("videos").doc(videoId).set(data, { merge: true })
}

export async function getCreator(channelId: string): Promise<CreatorProfile | null> {
  const db = getAdminDb()
  const docRef = db.collection("creators").doc(channelId)
  const docSnap = await docRef.get()
  return docSnap.exists ? (docSnap.data() as CreatorProfile) : null
}

export async function setCreator(channelId: string, data: Partial<CreatorProfile>): Promise<void> {
  const db = getAdminDb()
  await db.collection("creators").doc(channelId).set(data, { merge: true })
}

export async function getSearch(queryHash: string): Promise<unknown | null> {
  const db = getAdminDb()
  const docRef = db.collection("searches").doc(queryHash)
  const docSnap = await docRef.get()
  return docSnap.exists ? docSnap.data() : null
}

export async function setSearch(queryHash: string, data: unknown): Promise<void> {
  const db = getAdminDb()
  await db.collection("searches").doc(queryHash).set(data as Record<string, unknown>, { merge: true })
}

export async function getUser(uid: string): Promise<Record<string, unknown> | null> {
  const db = getAdminDb()
  const docRef = db.collection("users").doc(uid)
  const docSnap = await docRef.get()
  return docSnap.exists ? (docSnap.data() as Record<string, unknown>) : null
}

export async function updateUser(uid: string, data: Record<string, unknown>): Promise<void> {
  const db = getAdminDb()
  await db.collection("users").doc(uid).set(data, { merge: true })
}
