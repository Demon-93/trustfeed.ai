import { getSubtitles } from "youtube-captions-scraper"

export async function getTranscript(videoId: string): Promise<string | null> {
  try {
    const transcript = await getSubtitles({ videoID: videoId, lang: "en" })
    if (!transcript || transcript.length === 0) return null

    const fullText = transcript.map((t) => t.text).join(" ")
    const words = fullText.split(" ")
    const truncated = words.slice(0, 4000).join(" ")

    return truncated
  } catch {
    return null
  }
}
