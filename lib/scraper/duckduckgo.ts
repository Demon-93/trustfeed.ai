import axios from "axios"

interface DDGResult {
  title: string
  url: string
  snippet: string
}

export async function searchDDG(query: string): Promise<DDGResult[]> {
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`
    const response = await axios.get(url, { timeout: 10000 })
    const data = response.data

    const results: DDGResult[] = []

    if (data.AbstractText) {
      results.push({
        title: data.Heading || query,
        url: data.AbstractURL || "",
        snippet: data.AbstractText,
      })
    }

    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      for (const topic of data.RelatedTopics.slice(0, 5)) {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.split(" - ")[0] || "",
            url: topic.FirstURL,
            snippet: topic.Text,
          })
        }
      }
    }

    return results.slice(0, 5)
  } catch {
    return []
  }
}
