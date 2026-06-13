import { NextRequest, NextResponse } from "next/server"
import { getAdminDb, getAdminAuth } from "@/lib/firebase/admin"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const idToken = authHeader.split("Bearer ")[1]
    const decoded = await getAdminAuth().verifyIdToken(idToken)

    const body = await request.json()
    const { videoId, type } = body

    if (!videoId || typeof videoId !== "string") {
      return NextResponse.json(
        { error: "videoId is required" },
        { status: 400 }
      )
    }

    if (!type || !["up", "down"].includes(type)) {
      return NextResponse.json(
        { error: "type must be 'up' or 'down'" },
        { status: 400 }
      )
    }

    const db = getAdminDb()
    await db.collection("feedback").add({
      videoId,
      type,
      uid: decoded.uid,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Feedback API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
