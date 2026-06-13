"use client"

import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth-provider"

export default function Home() {
  const { user, signIn, logout } = useAuth()

  const suggestions = [
    "compound interest explained",
    "python for beginners",
    "nutrition science basics",
    "machine learning tutorial",
    "personal finance tips",
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-end p-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user.displayName || user.email}
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              Sign Out
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={signIn}>
            Sign in with Google
          </Button>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">
            Find videos you can actually trust
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            AI-powered search that verifies creator credentials and content
            quality
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
      </main>

      <footer className="p-4 text-center text-sm text-muted-foreground">
        Built with AI to help you find trustworthy content
      </footer>
    </div>
  )
}
