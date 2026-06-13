"use client"

import { SearchBar } from "@/components/search-bar"

export default function Home() {
  const suggestions = [
    "compound interest explained",
    "python for beginners",
    "nutrition science basics",
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Find videos you can actually trust
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          AI-powered search that verifies creator credentials and content quality
        </p>

        <SearchBar />

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <span className="text-sm text-muted-foreground">Try:</span>
          {suggestions.map((suggestion) => (
            <a
              key={suggestion}
              href={`/results?q=${encodeURIComponent(suggestion)}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {suggestion}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
