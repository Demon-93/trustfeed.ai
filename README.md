# TrustFeed AI

An open-source AI agent that finds the most trustworthy, relevant YouTube videos for any topic — saving you from clickbait and unqualified creators.

## Features

- Natural language search for YouTube videos
- Creator credential verification via LinkedIn, Twitter/X, DuckDuckGo
- Transcript-based content quality analysis
- Trust Score (0-100) per video with color-coded badge
- "Why we trust this" explanation per result
- Results sorted by Trust Score, not views

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

See `.env.example` for all required environment variables.

## License

MIT
