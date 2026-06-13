"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/providers/auth-provider"
import { VideoCard } from "@/components/video-card"
import { Button } from "@/components/ui/button"
import { RankedResult } from "@/types"
import { SearchBar } from "@/components/search-bar"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SavedVideosPage() {
  const { user, signIn } = useAuth()
  const [savedVideos, setSavedVideos] = useState<RankedResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchSaved = async () => {
      try {
        const response = await fetch("/api/saved")
        if (response.ok) {
          const data = await response.json()
          setSavedVideos(data.videos || [])
        }
      } catch {
        console.error("Failed to load saved videos")
      } finally {
        setLoading(false)
      }
    }

    fetchSaved()
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">
            Sign in to view saved videos
          </h2>
          <p className="text-muted-foreground">
            Save your favorite trustworthy videos for later
          </p>
          <Button onClick={signIn}>Sign in with Google</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
          <h1 className="text-xl font-bold">Saved Videos</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : savedVideos.length > 0 ? (
          <div className="space-y-4">
            {savedVideos.map((result) => (
              <VideoCard key={result.video.videoId} result={result} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No saved videos yet</h2>
            <p className="text-muted-foreground mb-4">
              Search for videos and save the trustworthy ones
            </p>
            <Link href="/">
              <Button>Start Searching</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
