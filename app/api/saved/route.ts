import { NextRequest, NextResponse } from "next/server"
import { getAdminDb, getAdminAuth } from "@/lib/firebase/admin"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const idToken = authHeader.split("Bearer ")[1]
    const decoded = await getAdminAuth().verifyIdToken(idToken)

    const db = getAdminDb()
    const userDoc = await db.collection("users").doc(decoded.uid).get()
    const userData = userDoc.data()

    if (!userData?.savedVideos?.length) {
      return NextResponse.json({ videos: [] })
    }

    const videoIds: string[] = userData.savedVideos
    const videoPromises = videoIds.map((id) => db.collection("videos").doc(id).get())
    const videoSnaps = await Promise.all(videoPromises)

    const videos = videoSnaps
      .filter((snap) => snap.exists)
      .map((snap) => snap.data())

    return NextResponse.json({ videos })
  } catch (error) {
    console.error("Saved API error:", error)
    return NextResponse.json({ videos: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const idToken = authHeader.split("Bearer ")[1]
    const decoded = await getAdminAuth().verifyIdToken(idToken)

    const { videoId } = await request.json()
    if (!videoId) {
      return NextResponse.json({ error: "videoId required" }, { status: 400 })
    }

    const db = getAdminDb()
    const userRef = db.collection("users").doc(decoded.uid)
    const userDoc = await userRef.get()
    const savedVideos: string[] = userDoc.data()?.savedVideos || []

    if (savedVideos.includes(videoId)) {
      await userRef.update({
        savedVideos: savedVideos.filter((id: string) => id !== videoId),
      })
      return NextResponse.json({ saved: false })
    } else {
      await userRef.update({
        savedVideos: [...savedVideos, videoId],
      })
      return NextResponse.json({ saved: true })
    }
  } catch (error) {
    console.error("Saved API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
