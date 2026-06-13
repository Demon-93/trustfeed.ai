"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { VideoCard } from "@/components/video-card"
import { SearchProgress } from "@/components/search-progress"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { Button } from "@/components/ui/button"
import { RankedResult, SearchResponse } from "@/types"
import { SearchBar } from "@/components/search-bar"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

function ResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [results, setResults] = useState<RankedResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progressStep, setProgressStep] = useState(0)
  const [totalAnalyzed, setTotalAnalyzed] = useState(0)

  useEffect(() => {
    if (!query) return

    const search = async () => {
      setLoading(true)
      setError(null)
      setResults([])
      setProgressStep(0)

      const progressTimer1 = setTimeout(() => setProgressStep(1), 2000)
      const progressTimer2 = setTimeout(() => setProgressStep(2), 5000)
      const progressTimer3 = setTimeout(() => setProgressStep(3), 9000)

      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Search failed")
        }

        const data: SearchResponse = await response.json()
        setResults(data.results)
        setTotalAnalyzed(data.totalAnalyzed)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An error occurred"
        )
      } finally {
        clearTimeout(progressTimer1)
        clearTimeout(progressTimer2)
        clearTimeout(progressTimer3)
        setLoading(false)
      }
    }

    search()
  }, [query])

  return (
    <main className="max-w-4xl mx-auto p-4">
      {loading && (
        <div className="space-y-6">
          <SearchProgress currentStep={progressStep} />
          <LoadingSkeleton />
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">
            Something went wrong
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">
              Found {totalAnalyzed} videos for &ldquo;{query}&rdquo;
            </h2>
            <span className="text-sm text-muted-foreground">
              Sorted by Trust Score
            </span>
          </div>
          {results.map((result) => (
            <VideoCard key={result.video.videoId} result={result} />
          ))}
        </div>
      )}

      {!loading && !error && results.length === 0 && query && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No results found</h2>
          <p className="text-muted-foreground">
            Try a different search query
          </p>
        </div>
      )}
    </main>
  )
}

function ResultsSkeleton() {
  return (
    <main className="max-w-4xl mx-auto p-4 space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </main>
  )
}

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-xl font-bold">
            TrustFeed
          </Link>
          <div className="flex-1">
            <SearchBar />
          </div>
        </div>
      </header>

      <Suspense fallback={<ResultsSkeleton />}>
        <ResultsContent />
      </Suspense>
    </div>
  )
}
