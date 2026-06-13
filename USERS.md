# TrustFeed AI — User Guide

> Find the most trustworthy YouTube videos for any topic. No more clickbait.

---

## What is TrustFeed AI?

TrustFeed AI is a free tool that helps you find the best YouTube videos based on **trust**, not just popularity. When you search for a topic, it:

1. Finds relevant YouTube videos
2. Checks if the creator is actually qualified to teach that topic
3. Analyzes the video content to confirm it's not clickbait
4. Gives each video a Trust Score from 0 to 100
5. Shows you exactly *why* each video is recommended

**Think of it as a trust filter for YouTube.**

---

## How to Use

### Step 1: Go to the Homepage

Open the app in your browser. You'll see a clean search page with a search bar in the center.

### Step 2: Type Your Search

Type what you want to learn about. Be specific for better results.

**Good examples:**
- "compound interest explained for beginners"
- "python programming tutorial"
- "nutrition science basics"
- "how to invest in index funds"

**Avoid vague searches like:**
- "money" (too broad)
- "video" (no topic)

### Step 3: Wait for Results

While the AI works, you'll see a progress indicator showing:
1. Searching YouTube...
2. Verifying creator credentials...
3. Analyzing video content...
4. Ranking by trust score...

This takes 10-30 seconds depending on how many videos need analysis.

### Step 4: Review Results

Each video result shows:
- **Thumbnail** — Click to watch on YouTube
- **Title and channel name**
- **View count and duration**
- **Trust Score** — A colored badge (green/yellow/red)
- **Why we trust this** — A short explanation of why this video was recommended
- **Topics covered** — What the video teaches
- **Red flags** — Any warnings about the video or creator

### Step 5: Watch or Save

- **Watch** — Opens the video on YouTube
- **Full Analysis** — See the complete trust breakdown
- **Save** — Save to your list (requires sign-in)

---

## Understanding Trust Scores

Every video gets a score from 0 to 100 based on four factors:

| Factor | Weight | What It Measures |
|--------|--------|------------------|
| Creator Credentials | 35% | Is the creator qualified to teach this topic? |
| Content Quality | 35% | Does the video actually cover what it promises? |
| Engagement Rate | 20% | Do viewers find it valuable (likes vs views)? |
| Channel Consistency | 10% | Is this an established, active channel? |

### Score Colors

- **Green (70-100)** — Highly trustworthy. Good to watch.
- **Yellow (40-69)** — Moderately trustworthy. Watch with some caution.
- **Red (0-39)** — Low trust. Watch carefully, may be misleading.

### Red Flags

The app may show warnings like:
- **No transcript** — Content couldn't be fully verified
- **Expertise mismatch** — Creator's background doesn't match the topic
- **Clickbait detected** — Title doesn't match actual content
- **No verifiable credentials** — No professional background found

---

## Signing In

Click "Sign in with Google" in the top right corner to:
- Save videos to your personal list
- Access your saved videos from any device

Your data is stored securely with Firebase. We don't share your information.

---

## Saved Videos

After signing in, you can save any video by clicking the Save button on a video card. Access your saved videos from the "Saved" link in the navigation.

---

## Video Detail Page

Click "Full Analysis" on any video to see:
- Embedded YouTube player
- Full trust score breakdown (all four components)
- Content analysis (depth level, topics, what's missing)
- Creator profile (credentials, education, verified roles)
- Red flags (if any)

---

## Creator Profile

Click on a creator's name or "View Creator Profile" to see:
- Their credential score
- Verified roles and titles
- Education background
- Web presence (articles, mentions)
- Topic expertise areas
- Any red flags

---

## Tips for Best Results

1. **Be specific** — "python list comprehension tutorial" is better than "python"
2. **Include your level** — "beginner", "intermediate", "advanced"
3. **State your goal** — "how to invest for retirement" vs just "investing"
4. **Check red flags** — Always note if warnings are shown
5. **Read the explanation** — The "why we trust this" text tells you exactly why a video was recommended

---

## Limitations

- **First search is slow** — Subsequent searches for the same topic are instant (cached)
- **No transcript = lower score** — Videos without captions get a default score of 40/100
- **English only** — Currently analyzes English transcripts and credentials
- **Credential verification is best-effort** — Some creators may have credentials we can't find online
- **Free tier limits** — About 30 unique searches per day (repeated searches are free)

---

## Frequently Asked Questions

**Q: Why is the first search slow?**
A: The AI needs to analyze each video's creator and content. This takes time but results are cached, so the same search is instant next time.

**Q: Why does a good video have a low score?**
A: Possible reasons:
- The creator's credentials couldn't be verified online
- The video has no transcript/captions
- The content doesn't match the title (clickbait)
- The channel is new with little history

**Q: Can I trust the Trust Score?**
A: The score is a helpful guide, not a guarantee. Always use your judgment. The score combines automated analysis of creator credentials, content quality, and engagement data.

**Q: Does this work for any topic?**
A: Yes, but it works best for educational and informational content. Entertainment, music, and vlogs may not score well since the system looks for verified expertise.

**Q: Is my data private?**
A: Yes. We only store your saved videos and search history. We don't share data with third parties.

---

## Troubleshooting

**"No results found"**
- Try a different or more specific search query
- Check your internet connection

**"Something went wrong"**
- The service may be temporarily unavailable
- Try again in a few minutes

**Scores seem wrong**
- New channels may have incomplete data
- Videos without transcripts get penalized automatically
- The system improves as more videos are analyzed

---

## Technical Details (for developers)

See [README.md](./README.md) for:
- Environment setup
- API documentation
- Project architecture
- Contributing guidelines

---

Built with AI to help you find trustworthy content. Open source under MIT license.
