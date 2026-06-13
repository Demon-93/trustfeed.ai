import { ContentAnalysis } from "@/types"

interface ContentAgentParams {
  videoId: string
  title: string
  description: string
  originalQuery: string
  domain: string
}

export async function runContentAgent(params: ContentAgentParams): Promise<ContentAnalysis> {
  throw new Error("Not implemented")
}
