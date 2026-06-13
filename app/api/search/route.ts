import { NextRequest, NextResponse } from "next/server"
import { createHash } from "crypto"
import { runQueryAgent } from "@/lib/agents/query-agent"
import { runSearchAgent } from "@/lib/agents/search-agent"
import { runCreatorAgent } from "@/lib/agents/creator-agent"
import { runContentAgent } from "@/lib/agents/content-agent"
import { runRankingAgent } from "@/lib/agents/ranking-agent"
import { calculateTrustScore } from "@/lib/scoring/trust-score"
import { cacheGet, cacheSet } from "@/lib/cache/redis"
import { RankedResult, SearchResponse } from "@/types"

function generateCacheKey(query: string): string {
  const normalized = query.toLowerCase().trim()
  return createHash("md5").update(normalized).digest("hex")
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<SearchResponse | { error: string }>> {
  try {
    const body = await request.json()
    const { query } = body

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const trimmedQuery = query.trim()
    if (trimmedQuery.length < 2) {
      return NextResponse.json(
        { error: "Query must be at least 2 characters" },
        { status: 400 }
      )
    }

    const cacheKey = `search:${generateCacheKey(trimmedQuery)}`
    const cached = await cacheGet<SearchResponse>(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    const queryOutput = await runQueryAgent(trimmedQuery)

    const videos = await runSearchAgent(queryOutput)

    if (videos.length === 0) {
      return NextResponse.json({
        results: [],
        query: trimmedQuery,
        totalAnalyzed: 0,
        cachedAt: null,
      })
    }

    const resultsWithScores = await Promise.allSettled(
      videos.map(async (video) => {
        const [creator, content] = await Promise.allSettled([
          runCreatorAgent({
            channelId: video.channelId,
            channelName: video.channelName,
            channelDescription: video.description || "",
            domain: queryOutput.domain,
            requiredExpertise: queryOutput.requiredExpertise,
          }),
          runContentAgent({
            videoId: video.videoId,
            title: video.title,
            description: video.description || "",
            originalQuery: trimmedQuery,
            domain: queryOutput.domain,
          }),
        ])

        const creatorProfile =
          creator.status === "fulfilled"
            ? creator.value
            : {
                channelId: video.channelId,
                channelName: video.channelName,
                channelUrl: "",
                subscriberCount: 0,
                videoCount: 0,
                channelAge: "",
                channelDescription: "",
                linkedSocials: { linkedin: null, twitter: null, website: null },
                credentialScore: 50,
                topicExpertise: [],
                verifiedRoles: [],
                educationSignals: [],
                webPresence: [],
                redFlags: ["creator_analysis_failed"],
                credentialSummary: "Could not verify credentials",
                verifiedAt: new Date().toISOString(),
              }

        const contentAnalysis =
          content.status === "fulfilled"
            ? content.value
            : {
                videoId: video.videoId,
                contentScore: 50,
                isClickbait: false,
                depthLevel: "surface" as const,
                topicsCovered: [],
                actuallyAnswersQuery: false,
                transcriptSummary: "Could not analyze content",
                redFlags: ["content_analysis_failed"],
                analyzedAt: new Date().toISOString(),
              }

        const trustScore = calculateTrustScore(
          creatorProfile,
          contentAnalysis,
          video
        )

        const result: RankedResult = {
          video,
          creator: creatorProfile,
          content: contentAnalysis,
          trustScore,
        }

        return result
      })
    )

    const successfulResults = resultsWithScores
      .filter(
        (r): r is PromiseFulfilledResult<RankedResult> =>
          r.status === "fulfilled"
      )
      .map((r) => r.value)

    const rankedResults = await runRankingAgent(successfulResults)

    const searchResponse: SearchResponse = {
      results: rankedResults,
      query: trimmedQuery,
      totalAnalyzed: successfulResults.length,
      cachedAt: null,
    }

    await cacheSet(cacheKey, searchResponse, 86400)

    return NextResponse.json(searchResponse)
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
