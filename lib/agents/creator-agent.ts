import { CreatorProfile } from "@/types"
import { callGroq } from "@/lib/groq/client"
import { searchDDG } from "@/lib/scraper/duckduckgo"
import { scrapeLinkedIn } from "@/lib/scraper/linkedin"
import { scrapeTwitter } from "@/lib/scraper/twitter"
import { getCreator, setCreator } from "@/lib/firebase/db"

interface CreatorAgentParams {
  channelId: string
  channelName: string
  channelDescription: string
  domain: string
  requiredExpertise: string[]
}

const SYSTEM_PROMPT = `You are an expert at evaluating professional credentials for content creators.
Analyze the provided data and score the creator's credibility specifically for the topic domain.
Consider: job titles, companies, education, certifications, years of experience, notable achievements.
A mismatch between expertise and topic should heavily reduce the score.
Always respond with valid JSON only. No markdown, no explanation outside JSON.`

function buildUserPrompt(
  channelName: string,
  channelDescription: string,
  domain: string,
  requiredExpertise: string[],
  ddgResults: string,
  linkedinData: string,
  twitterData: string
): string {
  return `Topic domain: ${domain}
Required expertise: ${requiredExpertise.join(", ")}

Creator data found:
- YouTube channel: ${channelName}
- YouTube bio: ${channelDescription}
- LinkedIn data: ${linkedinData || "Not found"}
- Twitter bio: ${twitterData || "Not found"}
- Web search results: ${ddgResults || "Not found"}

Score their credibility for this specific topic.

Respond with this exact JSON structure:
{
  "credentialScore": number (0-100),
  "topicMatch": boolean,
  "verifiedRoles": ["role1", "role2"],
  "educationSignals": ["education1", "education2"],
  "webPresence": ["mention1", "mention2"],
  "redFlags": ["flag1", "flag2"],
  "credentialSummary": "1-2 sentence summary"
}`
}

function isCacheValid(verifiedAt: string | undefined): boolean {
  if (!verifiedAt) return false
  const verified = new Date(verifiedAt)
  const now = new Date()
  const daysDiff = (now.getTime() - verified.getTime()) / (1000 * 60 * 60 * 24)
  return daysDiff < 7
}

export async function runCreatorAgent(
  params: CreatorAgentParams
): Promise<CreatorProfile> {
  const { channelId, channelName, channelDescription, domain, requiredExpertise } = params

  const cached = await getCreator(channelId)
  if (cached && isCacheValid(cached.verifiedAt)) {
    return cached
  }

  const [ddgCredentialResults, ddgLinkedinResults, linkedinData, twitterData] =
    await Promise.all([
      searchDDG(`${channelName} ${domain} professional credentials`),
      searchDDG(`${channelName} site:linkedin.com`),
      scrapeLinkedIn(`${channelName} ${domain}`),
      scrapeTwitter(channelName.replace(/\s+/g, "").toLowerCase()),
    ])

  const ddgResultsText = [
    ...ddgCredentialResults.map((r) => `${r.title}: ${r.snippet}`),
    ...ddgLinkedinResults.map((r) => `${r.title}: ${r.snippet}`),
  ].join("\n")

  const linkedinText = linkedinData
    ? `Headline: ${linkedinData.headline}\nRoles: ${linkedinData.roles.join(", ")}\nEducation: ${linkedinData.education.join(", ")}\nSummary: ${linkedinData.rawText}`
    : ""

  const twitterText = twitterData
    ? `Bio: ${twitterData.bio}\nFollowers: ${twitterData.followers}\nPinned: ${twitterData.pinnedTweet}`
    : ""

  const userPrompt = buildUserPrompt(
    channelName,
    channelDescription,
    domain,
    requiredExpertise,
    ddgResultsText,
    linkedinText,
    twitterText
  )

  const response = await callGroq(SYSTEM_PROMPT, userPrompt, 0.3)

  try {
    const cleaned = response.replace(/```json\n?|\n?```/g, "").trim()
    const parsed = JSON.parse(cleaned)

    const profile: CreatorProfile = {
      channelId,
      channelName,
      channelUrl: `https://www.youtube.com/channel/${channelId}`,
      subscriberCount: 0,
      videoCount: 0,
      channelAge: "",
      channelDescription,
      linkedSocials: {
        linkedin: linkedinData ? "found" : null,
        twitter: twitterData ? "found" : null,
        website: null,
      },
      credentialScore: Math.min(100, Math.max(0, parsed.credentialScore || 50)),
      topicExpertise: parsed.topicMatch ? [domain] : [],
      verifiedRoles: Array.isArray(parsed.verifiedRoles) ? parsed.verifiedRoles : [],
      educationSignals: Array.isArray(parsed.educationSignals) ? parsed.educationSignals : [],
      webPresence: Array.isArray(parsed.webPresence) ? parsed.webPresence : [],
      redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
      credentialSummary: parsed.credentialSummary || "No summary available",
      verifiedAt: new Date().toISOString(),
    }

    await setCreator(channelId, profile)

    return profile
  } catch {
    const fallbackProfile: CreatorProfile = {
      channelId,
      channelName,
      channelUrl: `https://www.youtube.com/channel/${channelId}`,
      subscriberCount: 0,
      videoCount: 0,
      channelAge: "",
      channelDescription,
      linkedSocials: { linkedin: null, twitter: null, website: null },
      credentialScore: 50,
      topicExpertise: [],
      verifiedRoles: [],
      educationSignals: [],
      webPresence: [],
      redFlags: ["credential_analysis_failed"],
      credentialSummary: "Could not verify credentials automatically",
      verifiedAt: new Date().toISOString(),
    }

    await setCreator(channelId, fallbackProfile)

    return fallbackProfile
  }
}
