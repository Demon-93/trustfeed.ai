import axios from "axios"
import * as cheerio from "cheerio"
import { searchDDG } from "./duckduckgo"

interface LinkedInData {
  headline: string
  roles: string[]
  education: string[]
  rawText: string
}

export async function scrapeLinkedIn(searchQuery: string): Promise<LinkedInData | null> {
  try {
    const ddgResults = await searchDDG(`${searchQuery} site:linkedin.com`)
    const linkedinResult = ddgResults.find((r) => r.url.includes("linkedin.com"))

    if (!linkedinResult) return null

    const response = await axios.get(linkedinResult.url, {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    const $ = cheerio.load(response.data)

    const headline = $("h1").first().text().trim() || linkedinResult.snippet

    const roles: string[] = []
    $("li").each((_, el) => {
      const text = $(el).text().trim()
      if (text.includes("at") || text.includes("Engineer") || text.includes("Analyst")) {
        roles.push(text)
      }
    })

    const education: string[] = []
    $("section").each((_, el) => {
      const text = $(el).text().trim()
      if (text.includes("Education") || text.includes("University") || text.includes("College")) {
        education.push(text)
      }
    })

    return {
      headline,
      roles: roles.slice(0, 3),
      education: education.slice(0, 3),
      rawText: linkedinResult.snippet,
    }
  } catch {
    return null
  }
}
