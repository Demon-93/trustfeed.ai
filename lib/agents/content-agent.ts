import { ContentAnalysis } from "@/types"
import { callGroq } from "@/lib/groq/client"
import { getTranscript } from "@/lib/youtube/transcript"
import { getVideo, setVideo } from "@/lib/firebase/db"

interface ContentAgentParams {
  videoId: string
  title: string
  description: string
  originalQuery: string
  domain: string
}

const SYSTEM_PROMPT = `You analyze YouTube video transcripts for educational quality and relevance.
Be strict. Most videos are clickbait or surface-level.
Always respond with valid JSON only. No markdown, no explanation outside JSON.`

function buildUserPrompt(
  originalQuery: string,
  domain: string,
  title: string,
  description: string,
  transcript: string
): string {
  return `User's query: "${originalQuery}"
Domain: ${domain}
Video title: "${title}"
Video description: ${description.substring(0, 500)}

Video transcript (first 3500 words):
${transcript}

Analyze this video for:
1. Does it actually answer what the user asked?
2. Is it clickbait or genuine?
3. How deep is the content?
4. What topics does it cover?
5. What's missing?

Respond with this exact JSON structure:
{
  "contentScore": number (0-100),
  "isClickbait": boolean,
  "depthLevel": "surface|intermediate|deep",
  "topicsCovered": ["topic1", "topic2"],
  "actuallyAnswersQuery": boolean,
  "informationDensity": "high|medium|low",
  "redFlags": ["flag1", "flag2"],
  "contentSummary": "1-2 sentence summary of content quality",
  "whatIsMissing": "What the video doesn't cover"
}`
}

function isCacheValid(analyzedAt: string | undefined): boolean {
  if (!analyzedAt) return false
  const analyzed = new Date(analyzedAt)
  const now = new Date()
  const daysDiff = (now.getTime() - analyzed.getTime()) / (1000 * 60 * 60 * 24)
  return daysDiff < 30
}

export async function runContentAgent(
  params: ContentAgentParams
): Promise<ContentAnalysis> {
  const { videoId, title, description, originalQuery, domain } = params

  const cached = await getVideo(videoId)
  if (cached && isCacheValid((cached as unknown as ContentAnalysis).analyzedAt)) {
    return cached as unknown as ContentAnalysis
  }

  const transcript = await getTranscript(videoId)

  if (!transcript) {
    const fallback: ContentAnalysis = {
      videoId,
      contentScore: 40,
      isClickbait: false,
      depthLevel: "surface",
      topicsCovered: [],
      actuallyAnswersQuery: false,
      transcriptSummary: "Could not verify content — no captions available",
      redFlags: ["transcript_unavailable"],
      analyzedAt: new Date().toISOString(),
    }

    await setVideo(videoId, fallback as unknown as Record<string, unknown>)

    return fallback
  }

  const truncatedTranscript = transcript.split(" ").slice(0, 3500).join(" ")

  const userPrompt = buildUserPrompt(
    originalQuery,
    domain,
    title,
    description,
    truncatedTranscript
  )

  const response = await callGroq(SYSTEM_PROMPT, userPrompt, 0.3)

  try {
    const cleaned = response.replace(/```json\n?|\n?```/g, "").trim()
    const parsed = JSON.parse(cleaned)

    const validDepthLevels = ["surface", "intermediate", "deep"]
    const depthLevel = validDepthLevels.includes(parsed.depthLevel)
      ? parsed.depthLevel
      : "surface"

    const analysis: ContentAnalysis = {
      videoId,
      contentScore: Math.min(100, Math.max(0, parsed.contentScore || 50)),
      isClickbait: Boolean(parsed.isClickbait),
      depthLevel: depthLevel as "surface" | "intermediate" | "deep",
      topicsCovered: Array.isArray(parsed.topicsCovered) ? parsed.topicsCovered : [],
      actuallyAnswersQuery: Boolean(parsed.actuallyAnswersQuery),
      transcriptSummary: parsed.contentSummary || "No summary available",
      redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
      analyzedAt: new Date().toISOString(),
    }

    await setVideo(videoId, analysis as unknown as Record<string, unknown>)

    return analysis
  } catch {
    const fallbackAnalysis: ContentAnalysis = {
      videoId,
      contentScore: 50,
      isClickbait: false,
      depthLevel: "surface",
      topicsCovered: [],
      actuallyAnswersQuery: false,
      transcriptSummary: "Could not analyze transcript",
      redFlags: ["analysis_failed"],
      analyzedAt: new Date().toISOString(),
    }

    await setVideo(videoId, fallbackAnalysis as unknown as Record<string, unknown>)

    return fallbackAnalysis
  }
}
