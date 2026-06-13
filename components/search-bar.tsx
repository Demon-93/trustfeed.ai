"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/results?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[600px]">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="What do you want to learn today?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-4 h-12 text-base"
        />
        <Button type="submit" className="ml-2 h-12 px-6">
          Search
        </Button>
      </div>
    </form>
  )
}
