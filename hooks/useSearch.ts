"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RankedResult } from "@/types"

export function useSearch() {
  const [results, setResults] = useState<RankedResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const search = async (query: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error("Search failed")
      }

      const data = await response.json()
      setResults(data.results)
      router.push(`/results?q=${encodeURIComponent(query)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return { results, loading, error, search }
}
