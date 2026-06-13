import { VideoResult } from "@/types"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3"

export async function searchYouTube(query: string, maxResults = 15): Promise<VideoResult[]> {
  const url = `${YOUTUBE_BASE_URL}/search?q=${encodeURIComponent(query)}&part=snippet&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
  const response = await fetch(url)
  const data = await response.json()

  if (!data.items) return []

  return data.items.map((item: Record<string, unknown>) => ({
    videoId: (item.id as Record<string, string>).videoId,
    title: (item.snippet as Record<string, string>).title,
    channelId: (item.snippet as Record<string, string>).channelId,
    channelName: (item.snippet as Record<string, string>).channelTitle,
    thumbnail: ((item.snippet as Record<string, unknown>)?.thumbnails as Record<string, Record<string, string>>)?.high?.url || "",
    description: (item.snippet as Record<string, string>).description,
    publishedAt: (item.snippet as Record<string, string>).publishedAt,
    viewCount: 0,
    likeCount: 0,
    duration: "",
    tags: [],
  }))
}

export async function getVideoDetails(videoIds: string[]): Promise<Partial<VideoResult>[]> {
  if (videoIds.length === 0) return []

  const url = `${YOUTUBE_BASE_URL}/videos?id=${videoIds.join(",")}&part=statistics,contentDetails,snippet&key=${YOUTUBE_API_KEY}`
  const response = await fetch(url)
  const data = await response.json()

  if (!data.items) return []

  return data.items.map((item: Record<string, unknown>) => ({
    videoId: item.id as string,
    viewCount: parseInt((item.statistics as Record<string, string>).viewCount || "0"),
    likeCount: parseInt((item.statistics as Record<string, string>).likeCount || "0"),
    duration: (item.contentDetails as Record<string, string>).duration || "",
    tags: (item.snippet as Record<string, string[]>).tags || [],
  }))
}
