import { NextRequest, NextResponse } from "next/server"
import { getVideo, getCreator } from "@/lib/firebase/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      )
    }

    const video = await getVideo(id)

    if (!video) {
      return NextResponse.json(
        { error: "Video not found. Run a search first to analyze this video." },
        { status: 404 }
      )
    }

    let creator = null
    if (video.channelId) {
      creator = await getCreator(video.channelId)
    }

    return NextResponse.json({
      video,
      creator,
    })
  } catch (error) {
    console.error("Video API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
