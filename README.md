# TrustFeed AI

An open-source AI agent that finds the most trustworthy, relevant YouTube videos for any topic — saving you from clickbait and unqualified creators.

## Features

- Natural language search for YouTube videos
- Creator credential verification via LinkedIn, Twitter/X, DuckDuckGo
- Transcript-based content quality analysis
- Trust Score (0-100) per video with color-coded badge
- "Why we trust this" explanation per result
- Results sorted by Trust Score, not views
- Saved videos with Firebase Auth

## Tech Stack

- **Frontend:** Next.js 16 + Tailwind CSS + shadcn/ui
- **Backend:** Next.js API Routes
- **LLM:** Groq API (Llama 3.3 70B)
- **Database:** Firebase Firestore
- **Auth:** Firebase Auth (Google Sign-in)
- **Cache:** Upstash Redis
- **YouTube Data:** YouTube Data API v3
- **Transcripts:** youtube-captions-scraper

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Demon-93/trustfeed.ai.git
cd trustfeed.ai
```

2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env.local` and fill in your API keys:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

See `.env.example` for all required environment variables:

| Variable | Description | Source |
|----------|-------------|--------|
| `GROQ_API_KEY` | Groq API key for LLM inference | [console.groq.com](https://console.groq.com) |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key | [console.cloud.google.com](https://console.cloud.google.com) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase client API key | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | Firebase Console |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Firebase admin service account JSON | Firebase Console → Service Accounts |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL | [upstash.com](https://upstash.com) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token | [upstash.com](https://upstash.com) |

## Project Structure

```
trustfeed-ai/
├── app/
│   ├── api/
│   │   ├── search/route.ts      # Main search pipeline
│   │   ├── creator/[id]/route.ts # Creator profile endpoint
│   │   ├── video/[id]/route.ts   # Video detail endpoint
│   │   └── feedback/route.ts     # User feedback endpoint
│   ├── creator/[id]/page.tsx     # Creator profile page
│   ├── results/page.tsx          # Search results page
│   ├── saved/page.tsx            # Saved videos page
│   ├── video/[id]/page.tsx       # Video detail page
│   ├── global-error.tsx          # Global error boundary
│   ├── loading.tsx               # Root loading state
│   ├── not-found.tsx             # 404 page
│   └── page.tsx                  # Home page
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── loading-skeleton.tsx      # Skeleton cards
│   ├── red-flag-alert.tsx        # Warning alerts
│   ├── score-breakdown.tsx       # Score breakdown
│   ├── search-bar.tsx            # Search input
│   ├── search-progress.tsx       # Loading progress
│   ├── trust-badge.tsx           # Score badge
│   └── video-card.tsx            # Video result card
├── lib/
│   ├── agents/                   # AI agent pipeline
│   │   ├── query-agent.ts        # Query expansion
│   │   ├── search-agent.ts       # YouTube search
│   │   ├── creator-agent.ts      # Creator verification
│   │   ├── content-agent.ts      # Content analysis
│   │   └── ranking-agent.ts      # Score ranking
│   ├── cache/redis.ts            # Upstash Redis helpers
│   ├── firebase/
│   │   ├── admin.ts              # Firebase admin SDK
│   │   ├── config.ts             # Firebase client SDK
│   │   └── db.ts                 # Firestore helpers
│   ├── groq/client.ts            # Groq LLM client
│   ├── scraper/
│   │   ├── duckduckgo.ts         # DuckDuckGo scraper
│   │   ├── linkedin.ts           # LinkedIn scraper
│   │   └── twitter.ts            # Twitter/Nitter scraper
│   └── youtube/
│       ├── search.ts             # YouTube API search
│       └── transcript.ts         # Transcript fetcher
├── providers/
│   ├── auth-provider.tsx         # Firebase auth context
│   └── providers.tsx             # Client providers
├── types/
│   └── index.ts                  # TypeScript interfaces
└── hooks/
    ├── useAuth.ts                # Auth hook
    └── useSearch.ts              # Search state hook
```

## API Routes

### POST /api/search
Search for videos with trust scoring.

**Request:**
```json
{
  "query": "compound interest explained"
}
```

**Response:**
```json
{
  "query": "compound interest explained",
  "results": [...],
  "totalAnalyzed": 15,
  "cached": false
}
```

### GET /api/video/[id]
Get video details with trust score and creator profile.

### GET /api/creator/[id]
Get creator profile with credential verification.

### POST /api/feedback
Submit user feedback (thumbs up/down) for a video.

## License

MIT
