import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { videoId, type } = body

    if (!videoId || !type) {
      return NextResponse.json({ error: "videoId and type are required" }, { status: 400 })
    }

    return NextResponse.json({
      message: "Feedback endpoint not yet implemented",
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
