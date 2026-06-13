"use client"

import { use } from "react"
import { useState, useEffect } from "react"
import { TrustBadge } from "@/components/trust-badge"
import { ScoreBreakdown } from "@/components/score-breakdown"
import { RedFlagAlert } from "@/components/red-flag-alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface VideoData {
  video: {
    videoId: string
    title: string
    channelId: string
    channelName: string
    thumbnail: string
    description: string
    viewCount: number
    likeCount: number
    duration: string
    trustScore?: number
    trustExplanation?: string
    contentScore?: number
    isClickbait?: boolean
    depthLevel?: string
    topicsCovered?: string[]
    transcriptSummary?: string
  }
  creator: {
    channelId: string
    channelName: string
    credentialScore: number
    verifiedRoles: string[]
    educationSignals: string[]
    webPresence: string[]
    redFlags: string[]
    credentialSummary: string
  } | null
}

export default function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [data, setData] = useState<VideoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/video/${id}`)
        if (!response.ok) {
          throw new Error("Video not found")
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load video")
      } finally {
        setLoading(false)
      }
    }

    fetchVideo()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            {error || "Video not found"}
          </h2>
          <p className="text-muted-foreground mb-4">
            Run a search first to analyze this video
          </p>
          <Link href="/">
            <Button>Go to Search</Button>
          </Link>
        </div>
      </div>
    )
  }

  const { video, creator } = data

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            className="w-full h-full"
            allowFullScreen
          />
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
            <p className="text-muted-foreground">
              {video.channelName}
              <span className="mx-2">·</span>
              {video.viewCount?.toLocaleString()} views
            </p>
          </div>
          <TrustBadge score={video.trustScore || 0} size="lg" />
        </div>

        {video.trustExplanation && (
          <Card>
            <CardContent className="p-4">
              <p className="italic text-muted-foreground">
                {video.trustExplanation}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Content Score</span>
                <span className="font-medium">{video.contentScore || 0}/100</span>
              </div>
              <div className="flex justify-between">
                <span>Depth Level</span>
                <Badge variant="outline">{video.depthLevel || "unknown"}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Clickbait</span>
                <span>{video.isClickbait ? "Yes" : "No"}</span>
              </div>
            </CardContent>
          </Card>

          {creator && (
            <Card>
              <CardHeader>
                <CardTitle>Creator Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Credential Score</span>
                  <span className="font-medium">
                    {creator.credentialScore}/100
                  </span>
                </div>
                {creator.verifiedRoles?.length > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Verified Roles:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {creator.verifiedRoles.map((role) => (
                        <Badge key={role} variant="secondary">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {creator.educationSignals?.length > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Education:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {creator.educationSignals.map((edu) => (
                        <Badge key={edu} variant="secondary">
                          {edu}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {video.topicsCovered && video.topicsCovered.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Topics Covered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {video.topicsCovered.map((topic) => (
                  <Badge key={topic} variant="outline">
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {video.transcriptSummary && (
          <Card>
            <CardHeader>
              <CardTitle>Transcript Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{video.transcriptSummary}</p>
            </CardContent>
          </Card>
        )}

        {(creator?.redFlags?.length ?? 0) > 0 && (
          <RedFlagAlert flags={creator!.redFlags} />
        )}

        <div className="flex gap-4">
          <a
            href={`https://www.youtube.com/watch?v=${id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>
              <ExternalLink className="h-4 w-4 mr-2" />
              Watch on YouTube
            </Button>
          </a>
          {creator && (
            <Link href={`/creator/${creator.channelId}`}>
              <Button variant="outline">
                View Creator Profile
              </Button>
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}
