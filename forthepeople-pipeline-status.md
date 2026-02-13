# ForThePeople — Pipeline Status & Next Steps

**Project:** source-check.org | GitHub: MonsMali/ForThePeople
**Date:** February 13, 2026
**Author:** Luis Conceicao

---

## Current Status: 70% Complete

The RSS → AI → Notion pipeline is built and partially tested. Two modules remain to be connected.

---

## What's Working ✅

### 1. Notion Database
- **Database ID:** `306f870c4d6880f4bbdeede7f28f8893`
- **Connection:** `ForThePeople-Notion` (ID: 5228104) — Active
- **Workspace:** Source Check's Space
- **Properties:** 15 fields configured (Status type used instead of Select — correct choice)
- **Location:** Inside ForThePeople HQ page

### 2. RSS Feed (Module 1)
- **Source:** FactCheck.org (`https://www.factcheck.org/feed/`)
- **Status:** Pulling 5 articles successfully
- **Fields available:** Title, Description, Summary, URL, Date, Author, Categories

### 3. Groq AI (Module 2 — HTTP)
- **Endpoint:** `https://api.groq.com/openai/v1/chat/completions`
- **Model:** `llama-3.3-70b-versatile`
- **Auth:** Manual header (`Authorization: Bearer gsk_...`)
- **Cost:** $0 (free tier — 14,400 requests/day)
- **Status:** Returning clean JSON, Status 200 on all 5 operations

### Sample AI Response (Operation 1):
```json
{
  "claim_pt": "",
  "claim_en": "ICE arrests increased, with a higher portion having no U.S. criminal record",
  "verdict": "true",
  "verdict_summary": "The data shows that as ICE arrests increased, a higher portion of those arrested had no U.S. criminal record",
  "tags": [],
  "party": "N/A",
  "person": "N/A",
  "country": "US",
  "translation_key": "ice-arrests-increased-with-no-us-criminal-record"
}
```

---

## What Needs to Be Done 📋

### Next Session (~15 minutes)

#### Step 1: Clean the Canvas
- Delete the current JSON Parse module (Module 3)
- Delete the current Notion module (Module 4)
- You should only have: **RSS → HTTP**

#### Step 2: Run Once
- Click "Run once" with just RSS → HTTP
- Verify both return Status 200

#### Step 3: Re-add JSON Parse Module
1. Click "+" after the HTTP module
2. Search "JSON" → Select "Parse JSON"
3. **Data Structure:** Select `FactCheckAIResponse` (already created)
4. **JSON string:** Map from HTTP module → `Data` → `choices` → `1` → `message` → `content`
5. Click OK

#### Step 4: Run Once Again
- All 3 modules should execute
- JSON Parse should output individual fields (claim_pt, verdict, etc.)

#### Step 5: Add Notion Module
1. Click "+" after JSON Parse
2. Search "Notion" → Select "Create a Database Item" **(Legacy)**
3. **Connection:** `ForThePeople-Notion`
4. **Database ID:** `306f870c4d6880f4bbdeede7f28f8893`

#### Step 6: Map Notion Fields

**Mapped from RSS module:**

| Notion Property   | Source                    |
|-------------------|---------------------------|
| Title             | RSS → Title               |
| Source_URL        | RSS → URL                 |
| Published_Date    | RSS → Date                |

**Mapped from JSON Parse module:**

| Notion Property   | Source                    |
|-------------------|---------------------------|
| Claim_PT          | JSON → claim_pt           |
| Claim_EN          | JSON → claim_en           |
| Verdict           | JSON → verdict            |
| Verdict_Summary   | JSON → verdict_summary    |
| Tags              | JSON → tags               |
| Party             | JSON → party              |
| Person            | JSON → person             |
| Country           | JSON → country            |
| Translation_Key   | JSON → translation_key    |

**Typed manually:**

| Notion Property   | Value                     |
|-------------------|---------------------------|
| Source_Name       | `FactCheck.org`           |
| Language          | `en`                      |
| Status            | `AI-Triaged`              |
| Ingested_Date     | `{{now}}`                 |

#### Step 7: Final Test
- Click "Run once"
- Check Notion database for new rows
- Verify all 15 fields are populated

#### Step 8: Activate
- Set schedule: Every **30 minutes**
- Toggle the scenario ON

---

## Known Issues to Address

### 1. Polígrafo RSS Feed Not Working
- `https://poligrafo.sapo.pt/feed/` returns "Not a feed" error
- Polígrafo uses WordPress with SAPO customizations
- **Try these alternatives:**
  - `https://poligrafo.sapo.pt/feed/sapo`
  - `https://observador.pt/seccao/factcheck/feed/` (alternative PT fact-checker)
- May need to use the HTTP module to fetch the page and parse it manually

### 2. AI Response Quality
- `claim_pt` field was empty in the sample response (needs Portuguese translation)
- `tags` array was empty (AI needs more context — consider adding Description back with proper escaping)
- `party` and `person` returned N/A (correct for some articles, but may need article body for better extraction)

### 3. Prompt Improvement Ideas
- Add the `Summary` field from RSS (HTML-stripped) for better context
- Use Make.com's `stripHTML` function: `{{stripTags(1.summary)}}`
- This gives Groq more content to work with without JSON-breaking HTML

---

## RSS Source Registry

### Active (tested and working)

| Source | URL | Language | Status |
|--------|-----|----------|--------|
| FactCheck.org | `https://www.factcheck.org/feed/` | EN | ✅ Working |

### To Be Added (in order of priority)

| # | Source | URL | Language | Filter Needed |
|---|--------|-----|----------|---------------|
| 1 | Observador | `https://observador.pt/seccao/factcheck/feed/` | PT | `factcheck` in URL |
| 2 | PolitiFact | `https://www.politifact.com/rss/factchecks/` | EN | None |
| 3 | Snopes | `https://www.snopes.com/feed/` | EN | `fact-check` in URL |
| 4 | Full Fact | `https://fullfact.org/feed/` | EN | None |
| 5 | AFP PT | `https://factcheck.afp.com/list/all/all/all/38970/rss` | PT | None |
| 6 | AFP EN | `https://factcheck.afp.com/list/all/all/all/38969/rss` | EN | None |
| 7 | PolitiFact (Trump) | `https://www.politifact.com/rss/factchecks/list/?speaker=donald-trump` | EN | None |

---

## Make.com Account Details

| Item | Value |
|------|-------|
| **User** | Source Check (source.check.4thepeople@gmail.com) |
| **Team ID** | 1032650 |
| **Timezone** | Europe/Lisbon |
| **Scenario (main)** | ForThePeople - RSS Ingestion |
| **Scenario (test, delete)** | ID 4468451 |
| **Notion Connection** | ID 5228104 (ForThePeople-Notion) |
| **Duplicate Connection (delete)** | ID 5228138 |

---

## Operations Budget (Make.com Free Tier)

**Free tier limit:** 1,000 operations/month

**Per fact-check item:** 5 operations (RSS + HTTP + JSON + Notion + overhead)

| Configuration | Items/Day | Ops/Month | Status |
|---------------|-----------|-----------|--------|
| 1 feed, 30 min | ~3-5 | ~450-750 | ✅ Within free tier |
| 2 feeds, 30 min | ~6-10 | ~900-1,500 | ⚠️ Borderline |
| 4 feeds, 15 min | ~15-20 | ~2,250-3,000 | ❌ Needs paid plan ($9/mo) |

**Recommendation:** Start with 1-2 feeds at 30-minute intervals.

---

## Architecture Overview

```
┌────────────────────────────────────────────────┐
│              MAKE.COM (Free Tier)               │
│                                                 │
│  [RSS Feed] → [Filter] → [Groq AI] → [Parse]  │
│                              │          │       │
│                           FREE        JSON      │
│                                         │       │
│                                    [Notion DB]  │
└────────────────────────────────────┬────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │     NOTION (Free Tier)          │
                    │                                  │
                    │  Fact-Check Backlog Database     │
                    │                                  │
                    │  AI-Triaged → Reviewed →         │
                    │  Approved → Published            │
                    └────────────────┬────────────────┘
                                     │
                         (Future automation)
                                     │
                    ┌────────────────▼────────────────┐
                    │   source-check.org (Netlify)    │
                    │                                  │
                    │   Astro 5 + Tailwind CSS v4     │
                    │   src/data/factpacks/{en,pt}/   │
                    └─────────────────────────────────┘
```

---

## Total Monthly Cost

| Service | Cost |
|---------|------|
| Make.com (Free) | $0 |
| Groq AI (Free) | $0 |
| Notion (Free) | $0 |
| Netlify (Free) | $0 |
| Domain (source-check.org) | ~$1 |
| **Total** | **~$1/month** |

---

## Future Pipeline Phases

### Phase 2: Notion → GitHub (Automated Publishing)
- When Status changes to "Approved" in Notion
- Make.com generates a `.md` file with correct frontmatter
- Pushes to `src/data/factpacks/{en,pt}/` via GitHub API
- Netlify auto-deploys

### Phase 3: Enhanced AI Triage
- Fetch full article text (not just title) for better extraction
- Add translation step (Groq can handle PT↔EN)
- Auto-generate evidence screenshot URLs
- Confidence scoring on AI verdicts

### Phase 4: Multi-Source Router
- Single scenario with Router module
- Parallel paths for PT and EN sources
- Deduplication check against existing Notion entries
- Slack/email notification on high-priority claims
