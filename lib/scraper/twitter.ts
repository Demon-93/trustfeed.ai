import axios from "axios"
import * as cheerio from "cheerio"

interface TwitterData {
  bio: string
  followers: string
  pinnedTweet: string
}

export async function scrapeTwitter(username: string): Promise<TwitterData | null> {
  try {
    const url = `https://nitter.net/${username}`
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    const $ = cheerio.load(response.data)

    const bio = $(".profile-bio").text().trim() || ""
    const followers = $(".followers").text().trim() || "0"
    const pinnedTweet = $(".pinned").first().text().trim() || ""

    return { bio, followers, pinnedTweet }
  } catch {
    return null
  }
}
