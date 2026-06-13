import { RankedResult } from "@/types"
import { callGroq } from "@/lib/groq/client"

const SYSTEM_PROMPT = `Write a 1-2 sentence explanation of why this video is recommended.
Be specific. Mention the creator's credentials and what makes the content good.
Never be generic. Output plain text only. No quotes, no markdown.`

function sortByTrustScore(results: RankedResult[]): RankedResult[] {
  return [...results].sort(
    (a, b) => (b.trustScore?.overall || 0) - (a.trustScore?.overall || 0)
  )
}

async function generateExplanation(result: RankedResult): Promise<string> {
  const { creator, content, trustScore } = result

  const userPrompt = `Creator: ${creator.credentialSummary || "Unknown credentials"}
Content: ${content.transcriptSummary || "No summary"}
Score breakdown: Credentials ${creator.credentialScore}/100, Content ${content.contentScore}/100
Red flags (if any): ${(trustScore.redFlags || []).join(", ") || "None"}`

  try {
    const explanation = await callGroq(SYSTEM_PROMPT, userPrompt, 0.5)
    return explanation.trim().substring(0, 300)
  } catch {
    return `Trust Score: ${trustScore.overall}/100. Creator credential score: ${creator.credentialScore}/100.`
  }
}

export async function runRankingAgent(
  results: RankedResult[]
): Promise<RankedResult[]> {
  const sorted = sortByTrustScore(results)

  const topResults = sorted.slice(0, 10)

  const explained = await Promise.all(
    topResults.map(async (result) => {
      const explanation = await generateExplanation(result)
      return {
        ...result,
        trustScore: {
          ...result.trustScore,
          explanation,
        },
      }
    })
  )

  return explained
}
