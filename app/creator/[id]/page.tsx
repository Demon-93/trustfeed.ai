"use client"

import { use } from "react"
import { useState, useEffect } from "react"
import { TrustBadge } from "@/components/trust-badge"
import { RedFlagAlert } from "@/components/red-flag-alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

interface CreatorData {
  channelId: string
  channelName: string
  channelUrl: string
  channelDescription: string
  credentialScore: number
  topicExpertise: string[]
  verifiedRoles: string[]
  educationSignals: string[]
  webPresence: string[]
  redFlags: string[]
  credentialSummary: string
  linkedSocials: {
    linkedin: string | null
    twitter: string | null
    website: string | null
  }
}

export default function CreatorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [creator, setCreator] = useState<CreatorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const response = await fetch(`/api/creator/${id}`)
        if (!response.ok) {
          throw new Error("Creator not found")
        }
        const data = await response.json()
        setCreator(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load creator")
      } finally {
        setLoading(false)
      }
    }

    fetchCreator()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            {error || "Creator not found"}
          </h2>
          <p className="text-muted-foreground mb-4">
            Run a search first to analyze this creator
          </p>
          <Link href="/">
            <Button>Go to Search</Button>
          </Link>
        </div>
      </div>
    )
  }

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
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{creator.channelName}</h1>
            <p className="text-muted-foreground">{creator.channelDescription}</p>
          </div>
          <TrustBadge score={creator.credentialScore} size="lg" />
        </div>

        {creator.credentialSummary && (
          <Card>
            <CardContent className="p-4">
              <p className="italic text-muted-foreground">
                {creator.credentialSummary}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Verified Roles</CardTitle>
            </CardHeader>
            <CardContent>
              {creator.verifiedRoles?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {creator.verifiedRoles.map((role) => (
                    <Badge key={role} variant="secondary">
                      {role}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No verified roles found</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              {creator.educationSignals?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {creator.educationSignals.map((edu) => (
                    <Badge key={edu} variant="secondary">
                      {edu}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No education signals found
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {creator.topicExpertise?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Topic Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {creator.topicExpertise.map((topic) => (
                  <Badge key={topic} variant="outline">
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {creator.webPresence?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Web Presence</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {creator.webPresence.map((presence) => (
                  <li key={presence} className="text-muted-foreground">
                    {presence}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {(creator.redFlags?.length ?? 0) > 0 && (
          <RedFlagAlert flags={creator.redFlags} />
        )}

        <div className="flex gap-4">
          <a
            href={creator.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit YouTube Channel
            </Button>
          </a>
        </div>
      </main>
    </div>
  )
}
