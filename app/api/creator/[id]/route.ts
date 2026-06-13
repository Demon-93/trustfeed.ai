import { NextRequest, NextResponse } from "next/server"
import { getCreator } from "@/lib/firebase/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Channel ID is required" },
        { status: 400 }
      )
    }

    const creator = await getCreator(id)

    if (!creator) {
      return NextResponse.json(
        { error: "Creator not found. Run a search first to analyze this creator." },
        { status: 404 }
      )
    }

    return NextResponse.json(creator)
  } catch (error) {
    console.error("Creator API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
