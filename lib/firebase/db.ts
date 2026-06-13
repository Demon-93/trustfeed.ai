import { doc, getDoc, setDoc } from "firebase/firestore"
import { adminDb } from "./admin"
import { VideoResult, CreatorProfile, ContentAnalysis } from "@/types"

export async function getVideo(videoId: string): Promise<VideoResult | null> {
  const docRef = adminDb.collection("videos").doc(videoId)
  const docSnap = await docRef.get()
  return docSnap.exists ? (docSnap.data() as VideoResult) : null
}

export async function setVideo(videoId: string, data: Partial<VideoResult>): Promise<void> {
  await adminDb.collection("videos").doc(videoId).set(data, { merge: true })
}

export async function getCreator(channelId: string): Promise<CreatorProfile | null> {
  const docRef = adminDb.collection("creators").doc(channelId)
  const docSnap = await docRef.get()
  return docSnap.exists ? (docSnap.data() as CreatorProfile) : null
}

export async function setCreator(channelId: string, data: Partial<CreatorProfile>): Promise<void> {
  await adminDb.collection("creators").doc(channelId).set(data, { merge: true })
}

export async function getSearch(queryHash: string): Promise<unknown | null> {
  const docRef = adminDb.collection("searches").doc(queryHash)
  const docSnap = await docRef.get()
  return docSnap.exists ? docSnap.data() : null
}

export async function setSearch(queryHash: string, data: unknown): Promise<void> {
  await adminDb.collection("searches").doc(queryHash).set(data as Record<string, unknown>, { merge: true })
}
