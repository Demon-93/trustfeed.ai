import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase/admin"

export async function POST(request: NextRequest) {
  try {
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
