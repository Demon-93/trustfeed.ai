import { CreatorProfile, ContentAnalysis, VideoResult, TrustScore } from "@/types"

function calculateEngagementScore(video: VideoResult): number {
  if (!video.viewCount || !video.likeCount) return 50
  const ratio = (video.likeCount / video.viewCount) * 100
  return Math.min(Math.round(ratio * 25), 100)
}

function calculateConsistencyScore(): number {
  return 70
}

export function calculateTrustScore(
  creator: CreatorProfile,
  content: ContentAnalysis,
  video: VideoResult
): TrustScore {
  const credentialComponent = creator.credentialScore * 0.35
  const contentComponent = content.contentScore * 0.35
  const engagementComponent = calculateEngagementScore(video) * 0.20
  const consistencyComponent = calculateConsistencyScore() * 0.10

  const overall = Math.round(
    credentialComponent + contentComponent + engagementComponent + consistencyComponent
  )

  const allRedFlags = [...(creator.redFlags || []), ...(content.redFlags || [])]

  return {
    overall,
    credentialComponent,
    contentComponent,
    engagementComponent,
    consistencyComponent,
    explanation: "",
    redFlags: allRedFlags,
  }
}
