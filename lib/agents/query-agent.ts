import { callGroq } from "@/lib/groq/client"
import { QueryAgentOutput } from "@/types"

const SYSTEM_PROMPT = `You are an expert at understanding search intent and domain classification.
Analyze the user's query and provide expanded search terms, domain classification, and required expertise.
Always respond with valid JSON only. No markdown, no explanation outside JSON.`

function buildUserPrompt(userQuery: string): string {
  return `I want to watch: "${userQuery}"

Analyze this query and provide:
1. expandedQueries: 3 search variations (original + 2 alternatives)
2. domain: The main topic domain (finance, health, tech, cooking, law, fitness, science, education, etc.)
3. subDomain: More specific sub-domain within the main domain
4. contentType: What type of content (tutorial, explainer, news, opinion, case-study)
5. audienceLevel: Who is this for (beginner, intermediate, advanced)
6. requiredExpertise: What credentials would make someone trustworthy on this topic
7. keyTopics: 3-5 specific topics this query covers

Respond with this exact JSON structure:
{
  "expandedQueries": ["query1", "query2", "query3"],
  "domain": "string",
  "subDomain": "string",
  "contentType": "tutorial|explainer|news|opinion|case-study",
  "audienceLevel": "beginner|intermediate|advanced",
  "requiredExpertise": ["credential1", "credential2"],
  "keyTopics": ["topic1", "topic2", "topic3"]
}`
}

export async function runQueryAgent(userQuery: string): Promise<QueryAgentOutput> {
  const userPrompt = buildUserPrompt(userQuery)
  const response = await callGroq(SYSTEM_PROMPT, userPrompt, 0.3)

  try {
    const cleaned = response.replace(/```json\n?|\n?```/g, "").trim()
    const parsed = JSON.parse(cleaned)

    return {
      expandedQueries: Array.isArray(parsed.expandedQueries)
        ? parsed.expandedQueries
        : [userQuery],
      domain: parsed.domain || "general",
      subDomain: parsed.subDomain || "general",
      contentType: parsed.contentType || "explainer",
      audienceLevel: parsed.audienceLevel || "intermediate",
      requiredExpertise: Array.isArray(parsed.requiredExpertise)
        ? parsed.requiredExpertise
        : [],
      keyTopics: Array.isArray(parsed.keyTopics) ? parsed.keyTopics : [],
    }
  } catch {
    return {
      expandedQueries: [userQuery],
      domain: "general",
      subDomain: "general",
      contentType: "explainer",
      audienceLevel: "intermediate",
      requiredExpertise: [],
      keyTopics: [],
    }
  }
}
