import { CreatorProfile, ContentAnalysis, VideoResult, TrustScore } from "@/types"

function calculateEngagementScore(video: VideoResult): number {
  if (!video.viewCount || !video.likeCount) return 50
  const ratio = (video.likeCount / video.viewCount) * 100
  return Math.min(Math.round(ratio * 25), 100)
}

function calculateConsistencyScore(video: VideoResult): number {
  let score = 50

  if (video.viewCount > 100000) score += 10
  if (video.viewCount > 1000000) score += 10

  if (video.likeCount && video.viewCount) {
    const likeRatio = video.likeCount / video.viewCount
    if (likeRatio > 0.03) score += 10
    if (likeRatio > 0.05) score += 10
  }

  if (video.tags && video.tags.length > 3) score += 10

  return Math.min(score, 100)
}

export function calculateTrustScore(
  creator: CreatorProfile,
  content: ContentAnalysis,
  video: VideoResult
): TrustScore {
  const credentialComponent = creator.credentialScore * 0.35
  const contentComponent = content.contentScore * 0.35
  const engagementComponent = calculateEngagementScore(video) * 0.20
  const consistencyComponent = calculateConsistencyScore(video) * 0.10

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
