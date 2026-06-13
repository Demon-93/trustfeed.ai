import { searchDDG } from "./duckduckgo"

interface TwitterData {
  bio: string
  followers: string
  pinnedTweet: string
}

export async function scrapeTwitter(username: string): Promise<TwitterData | null> {
  try {
    const results = await searchDDG(`${username} site:twitter.com OR site:x.com`)

    if (results.length === 0) {
      return null
    }

    const twitterResult = results.find(
      (r) => r.url.includes("twitter.com") || r.url.includes("x.com")
    )

    if (!twitterResult) {
      return null
    }

    return {
      bio: twitterResult.snippet || "",
      followers: "",
      pinnedTweet: "",
    }
  } catch {
    return null
  }
}
