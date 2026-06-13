export interface VideoResult {
  videoId: string
  title: string
  channelId: string
  channelName: string
  thumbnail: string
  description: string
  publishedAt: string
  viewCount: number
  likeCount: number
  duration: string
  tags: string[]
}

export interface CreatorProfile {
  channelId: string
  channelName: string
  channelUrl: string
  subscriberCount: number
  videoCount: number
  channelAge: string
  channelDescription: string
  linkedSocials: {
    linkedin: string | null
    twitter: string | null
    website: string | null
  }
  credentialScore: number
  topicExpertise: string[]
  verifiedRoles: string[]
  educationSignals: string[]
  webPresence: string[]
  redFlags: string[]
  credentialSummary: string
  verifiedAt: string
}

export interface ContentAnalysis {
  videoId: string
  contentScore: number
  isClickbait: boolean
  depthLevel: "surface" | "intermediate" | "deep"
  topicsCovered: string[]
  actuallyAnswersQuery: boolean
  transcriptSummary: string
  redFlags: string[]
  analyzedAt: string
}

export interface TrustScore {
  overall: number
  credentialComponent: number
  contentComponent: number
  engagementComponent: number
  consistencyComponent: number
  explanation: string
  redFlags: string[]
}

export interface QueryAgentOutput {
  expandedQueries: string[]
  domain: string
  subDomain: string
  contentType: string
  audienceLevel: string
  requiredExpertise: string[]
  keyTopics: string[]
}

export interface RankedResult {
  video: VideoResult
  creator: CreatorProfile
  content: ContentAnalysis
  trustScore: TrustScore
}

export interface SearchResponse {
  results: RankedResult[]
  query: string
  totalAnalyzed: number
  cachedAt: string | null
}
