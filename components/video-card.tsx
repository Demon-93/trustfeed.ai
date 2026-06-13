"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrustBadge } from "@/components/trust-badge"
import { RedFlagAlert } from "@/components/red-flag-alert"
import { RankedResult } from "@/types"
import { ExternalLink, Eye, Bookmark } from "lucide-react"
import Link from "next/link"

interface VideoCardProps {
  result: RankedResult
}

function formatViewCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M views`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`
  return `${count} views`
}

function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return ""
  const hours = match[1] ? parseInt(match[1]) : 0
  const minutes = match[2] ? parseInt(match[2]) : 0
  const seconds = match[3] ? parseInt(match[3]) : 0
  if (hours > 0) return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function VideoCard({ result }: VideoCardProps) {
  const { video, creator, content, trustScore } = result

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <a
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-48 h-27 object-cover rounded-lg"
            />
          </a>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600"
                  >
                    {video.title}
                  </a>
                </h3>
                <p className="text-sm text-muted-foreground mb-1">
                  {video.channelName}
                  <span className="mx-1">·</span>
                  {formatViewCount(video.viewCount)}
                  <span className="mx-1">·</span>
                  {formatDuration(video.duration)}
                </p>
              </div>
              <TrustBadge score={trustScore.overall} size="sm" />
            </div>

            {trustScore.explanation && (
              <p className="text-sm text-muted-foreground italic mt-2 line-clamp-2">
                {trustScore.explanation}
              </p>
            )}

            {(content.topicsCovered?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {content.topicsCovered?.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="text-xs bg-secondary px-2 py-0.5 rounded"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}

            {(trustScore.redFlags?.length ?? 0) > 0 && (
              <div className="mt-2">
                <RedFlagAlert flags={trustScore.redFlags} />
              </div>
            )}

            <div className="flex gap-2 mt-3">
              <a
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Watch
                </Button>
              </a>
              <Link href={`/video/${video.videoId}`}>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Full Analysis
                </Button>
              </Link>
              <Button size="sm" variant="outline">
                <Bookmark className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
