import { QueryAgentOutput, VideoResult } from "@/types"
import { searchYouTube, getVideoDetails } from "@/lib/youtube/search"

function deduplicateVideos(videos: VideoResult[]): VideoResult[] {
  const seen = new Set<string>()
  return videos.filter((video) => {
    if (seen.has(video.videoId)) return false
    seen.add(video.videoId)
    return true
  })
}

function sortByViewCount(videos: VideoResult[]): VideoResult[] {
  return [...videos].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
}

export async function runSearchAgent(
  queryOutput: QueryAgentOutput
): Promise<VideoResult[]> {
  const { expandedQueries } = queryOutput

  const searchResults = await Promise.all(
    expandedQueries.map((query) => searchYouTube(query, 15))
  )

  const allVideos = searchResults.flat()
  const uniqueVideos = deduplicateVideos(allVideos)
  const sortedVideos = sortByViewCount(uniqueVideos).slice(0, 30)

  if (sortedVideos.length === 0) return []

  const videoIds = sortedVideos.map((v) => v.videoId)
  const detailedResults = await getVideoDetails(videoIds)

  const detailsMap = new Map<string, Partial<VideoResult>>()
  for (const detail of detailedResults) {
    if (detail.videoId) {
      detailsMap.set(detail.videoId, detail)
    }
  }

  const enrichedVideos = sortedVideos.map((video) => {
    const details = detailsMap.get(video.videoId) || {}
    return {
      ...video,
      viewCount: details.viewCount ?? video.viewCount,
      likeCount: details.likeCount ?? video.likeCount,
      duration: details.duration ?? video.duration,
      tags: details.tags ?? video.tags,
    }
  })

  return enrichedVideos.slice(0, 30)
}
