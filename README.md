# Community-Led Growth for B2B SaaS

Research assignment for 100Hires — curated expert content on Community-Led Growth (CLG) strategies for B2B SaaS companies.

---

## Project Overview

This repository aggregates and organizes high-signal content from 11 top practitioners in community-led growth. The goal is to extract actionable strategies for building and leveraging communities as a core B2B SaaS growth channel — not just a support function.

**Topic:** Community-Led Growth for B2B SaaS
**Experts collected:** 11
**Total content pieces:** 121 LinkedIn posts (76 with full article text) + 12 YouTube transcripts + 120 Medium articles

---

## Why Community-Led Growth for B2B SaaS?

I chose this specific topic because it directly impacts the growth architecture I am currently building for my own platforms: **Mosqify** ([mosqify.id](https://www.mosqify.id)) (a B2B2C SaaS and IoT ecosystem for organization management) and **Apto** ([apto.web.id](https://www.apto.web.id)), an AI-powered resume tailoring and interview preparation platform.

In my experience building these products and managing digital growth strategies, I've seen firsthand that community is the most vital, yet most frequently misunderstood, pillar of modern marketing. Traditional paid acquisition channels are becoming increasingly saturated.

Whether it is scaling organizational adoption for Mosqify or building organic word-of-mouth among job seekers for Apto, a well-executed community-led growth (CLG) strategy fundamentally shifts software economics:
* **Lowers Customer Acquisition Cost (CAC):** It turns our power users into an organic, self-sustaining distribution engine.
* **Drives Non-Linear Retention:** Users stick around for the shared knowledge, the ecosystem, and the network—making the software incredibly sticky beyond just its base utility.
* **Accelerates the Product Loop:** Active community engagement acts as a continuous, high-fidelity feedback loop that directly informs my engineering and QA priorities.

This repository serves as a direct research pipeline, extracting the playbooks of 10 elite operators who treat community as a measurable, engineering-driven growth engine rather than just an afterthought.

---

## How I Built This (Tools & Steps)

All scripts were written and debugged using **[Claude Code](https://claude.ai/code)** (Anthropic's AI coding assistant) as the primary development tool — from API integration to data parsing and repository management.

### Step 1 — Identify the Experts

I selected 11 practitioners who have *actually built* B2B communities at scale — not just written about it. Selection criteria:

- Must have shipped a real community (not just a newsletter or podcast)
- Must have a public content trail (LinkedIn, YouTube, Medium)
- Coverage across different roles: founder, operator, consultant, investor

### Step 2 — YouTube Transcripts (Supadata API)

- Used **Supadata API** (`api.supadata.ai/v1/youtube/transcript`) to extract full transcripts from 12 YouTube videos
- Videos were hand-picked: expert interviews, podcast appearances, and CLG talks
- Script: `scripts/fetch_transcripts.js`
- Output: `research/youtube-transcripts/` — one `.md` file per video

### Step 3 — LinkedIn Posts (Apify)

- Used **Apify** actor `automation-lab~linkedin-post-scraper` to fetch post metadata for each expert
- Fetched up to 20 recent posts per expert via their LinkedIn profile URL
- For posts that were LinkedIn Pulse articles (long-form), used a second Apify actor `scrapemint~linkedin-pulse-articles-scraper` to fetch the full article body text
- Batched requests in groups of 3–5 to avoid timeouts
- Scripts: `scripts/fetch_linkedin_posts.js`, `scripts/fetch_linkedin_content.js`
- Output: `research/linkedin-posts/` — one `.md` file per expert

### Step 4 — Medium Articles (RSS Feeds)

- Used **Medium RSS feeds** (free, no API key needed) to fetch articles
- Sources: expert profile feeds + topic tag feeds + publication feeds
- Parsed RSS XML manually in Node.js
- Script: `scripts/fetch_medium_posts.js`
- Output: `research/other/medium/` — one `.md` file per source

---

## Directory Structure

```
research/
├── sources.md                  # Full source list with links
├── linkedin-posts/             # LinkedIn posts by expert (11 files)
├── youtube-transcripts/        # YouTube transcripts (12 files)
└── other/
    └── medium/                 # Medium articles (12 files)

scripts/
├── fetch_transcripts.js        # YouTube transcript fetcher (Supadata API)
├── fetch_linkedin_posts.js     # LinkedIn post metadata fetcher (Apify)
├── fetch_linkedin_content.js   # LinkedIn Pulse article content fetcher (Apify)
└── fetch_medium_posts.js       # Medium articles fetcher (RSS)
```

---

## Expert Sources

### LinkedIn + YouTube + Medium

| # | Expert | Role | LinkedIn | YouTube | Medium |
|---|--------|------|----------|---------|--------|
| 1 | David Spinks | Co-founder CMX, author *The Business of Belonging* | [linkedin.com/in/davidspinks](https://www.linkedin.com/in/davidspinks) | [Remo Daily](https://www.youtube.com/watch?v=o2-3GYvmLyA) · [Orbit Platform](https://www.youtube.com/watch?v=UWW9DXlt6nM) | [medium.com/@davidspinks](https://medium.com/@davidspinks) |
| 2 | Rosie Sherry | Founder Rosieland, ex-Indie Hackers | [linkedin.com/in/rosiesherry](https://www.linkedin.com/in/rosiesherry) | [Bootstrapped Founder](https://www.youtube.com/watch?v=6Jn1gGqee3I) · [Indie Bites](https://www.youtube.com/watch?v=xhp7qy5dWWc) | [medium.com/@rosiesherry](https://medium.com/@rosiesherry) |
| 3 | Jono Bacon | Author *People Powered*, ex-GitHub/Canonical | [linkedin.com/in/jonobacon](https://www.linkedin.com/in/jonobacon) | [Fast Leader Podcast](https://www.youtube.com/watch?v=0PX7ULEa7d8) | [medium.com/@jonobacon](https://medium.com/@jonobacon) |
| 4 | Erica Kuhl | Built Salesforce Trailblazer Community (17M members) | [linkedin.com/in/ericakuhl](https://www.linkedin.com/in/ericakuhl) | [Unchurned Podcast](https://www.youtube.com/watch?v=AuoQno2yGcY) | — |
| 5 | Brian Oblinger | Community strategy consultant, 20+ years B2B | [linkedin.com/in/brianoblinger](https://www.linkedin.com/in/brianoblinger) | — | [medium.com/@brianoblinger](https://medium.com/@brianoblinger) |
| 6 | Jake McKee | Ex-LEGO Global Community Manager, founder Ant's Eye View | [linkedin.com/in/jakemckee](https://www.linkedin.com/in/jakemckee) | — | [medium.com/@jakemckee](https://medium.com/@jakemckee) |
| 7 | Gina Bianchini | CEO Mighty Networks, ex-CEO Ning | [linkedin.com/in/ginabianchini](https://www.linkedin.com/in/ginabianchini) | — | — |
| 8 | Patrick Woods | CEO Orbit (community CRM), creator of the Orbit Model | [linkedin.com/in/patrickjwoods](https://www.linkedin.com/in/patrickjwoods) | — | [medium.com/@patrickjwoods](https://medium.com/@patrickjwoods) |
| 9 | Whitney Rothe | B2B SaaS community & marketing practitioner | [linkedin.com/in/wkrothe](https://www.linkedin.com/in/wkrothe) | — | — |
| 10 | Megan Demenna | Senior Marketing Manager, Validity | [linkedin.com/in/socialmeagan](https://www.linkedin.com/in/socialmeagan) | [Gone Remote Panel](https://www.youtube.com/watch?v=NHSpL3OPQJM) | — |
| 11 | Dani Grant | Partner at Union Square Ventures (USV) | [linkedin.com/in/danigrant](https://www.linkedin.com/in/danigrant) | — | — |

### Additional YouTube Sources

| Video | Speaker | Link |
|-------|---------|------|
| Community Is the New Moat | Jacob Peters & Mack Redden (Comsort) | [Watch](https://www.youtube.com/watch?v=ODliamqOg04) |
| Community-Led Growth Scale-Up Guide | Whit Rhoda (Insight Partners) | [Watch](https://www.youtube.com/watch?v=vEhM3Nrsz9s) |
| Makerpad Community Q&A | Steph Smith (The Hustle) | [Watch](https://www.youtube.com/watch?v=-2hUPbi-sW4A) |
| C2C Podcast | Derek Anderson (Startup Grind) | [Watch](https://www.youtube.com/watch?v=qquI98xoqXw) |
| Community as a Party Framework | — | [Watch](https://www.youtube.com/watch?v=k4wkiqpdQ_c) |

### Additional Medium Sources

| Source | Type | Link |
|--------|------|------|
| Community Led Growth | Topic tag | [medium.com/tag/community-led-growth](https://medium.com/tag/community-led-growth) |
| Community Building | Topic tag | [medium.com/tag/community-building](https://medium.com/tag/community-building) |
| B2B SaaS | Topic tag | [medium.com/tag/b2b-saas](https://medium.com/tag/b2b-saas) |
| Developer Community | Topic tag | [medium.com/tag/developer-community](https://medium.com/tag/developer-community) |
| Online Community | Topic tag | [medium.com/tag/online-community](https://medium.com/tag/online-community) |
| Better Marketing | Publication | [medium.com/better-marketing](https://medium.com/better-marketing) |
| The Startup (SWLH) | Publication | [medium.com/swlh](https://medium.com/swlh) |

---

## Data Collected Summary

| Source Type | Count | Details |
|-------------|-------|---------|
| LinkedIn posts | 121 posts | 11 experts, 76 with full article body text |
| YouTube transcripts | 12 videos | Full text via Supadata API |
| Medium articles | 120 articles | 12 sources (expert profiles + topic tags + publications) |
| **Total** | **253 pieces** | |

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Claude Code** | AI coding assistant used to write all scripts, debug API integrations, and manage the repository end-to-end |
| Node.js | All automation scripts |
| Supadata API | YouTube transcript extraction |
| Apify (`automation-lab~linkedin-post-scraper`) | LinkedIn post metadata scraping |
| Apify (`scrapemint~linkedin-pulse-articles-scraper`) | LinkedIn Pulse article full-text extraction |
| Medium RSS feeds | Article collection (no API key needed) |
| GitHub | Version control and repository hosting |
