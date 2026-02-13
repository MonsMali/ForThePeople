# ForThePeople / ParaOPovo

**The Open-Source Verification Toolkit for Voters.**

Politicians make claims. We find the documents. You decide.

[![Live Site](https://img.shields.io/badge/Live-source--check.org-blue)](https://source-check.org)
[![License](https://img.shields.io/badge/License-MIT-green)](#license)
[![IFCN Principles](https://img.shields.io/badge/IFCN-Code%20of%20Principles-orange)](https://ifcncodeofprinciples.poynter.org/)

---

## What Is This?

ForThePeople is a transparency project that puts political claims next to the actual documents — parliamentary records, official votes, court filings, public databases — so citizens can verify what their representatives say against what the evidence shows.

Every fact-pack follows the same process:

1. **Identify the claim** — A specific, verifiable statement by a public figure
2. **Find the documents** — The primary source, not someone else's interpretation
3. **Show both** — Claim and document side by side, with screenshots
4. **Assign a verdict** — Based solely on what the documents show
5. **Link everything** — Every source is accessible. You never have to take our word for it

We check claims from **all political parties and public figures**. When a claim is true, we say so.

## Who Built This

Built by **Luis Conceicao**, an AI Tech Specialist based in Portugal.

> I built this because I was tired of seeing my friends get manipulated by fake prints in WhatsApp groups. Screenshots with no source. Claims with no documents. Outrage with no evidence. This isn't paid by anyone. It's just code.

## Funding & Independence

| Item | Detail |
|------|--------|
| **Total cost** | $10 (domain name) |
| **Hosting** | Free tier (Netlify) |
| **Political donations** | None. Zero. From any party. |
| **Corporate sponsors** | None. |
| **Editorial control** | The author alone. |

This project is not affiliated with FactCheck.org, SourceWatch, or any political party.

## Tech Stack

- [Astro](https://astro.build/) — Static site generator
- [Tailwind CSS v4](https://tailwindcss.com/) — Styling
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- Markdown content collections for fact-packs
- i18n support (English + Portuguese)
- OG image generation with [Satori](https://github.com/vercel/satori) + [Sharp](https://sharp.pixelplumbing.com/)

## Running Locally

```bash
# Clone
git clone https://github.com/MonsMali/ForThePeople.git
cd ForThePeople

# Install dependencies
npm install

# Start dev server
npm run dev
```

The site will be available at `http://localhost:4321`.

## Project Structure

```
src/
├── components/          # Astro components (Header, Footer, FactpackCard, etc.)
├── data/factpacks/
│   ├── en/              # English fact-packs (Markdown)
│   └── pt/              # Portuguese fact-packs (Markdown)
├── i18n/                # Translation strings and utilities
├── layouts/             # Base and Factpack layouts
├── pages/
│   ├── en/              # English routes (index, about, facts/[slug])
│   └── pt/              # Portuguese routes
└── styles/              # Global CSS and Tailwind theme
```

## Writing a Fact-Pack

Fact-packs are Markdown files in `src/data/factpacks/{lang}/`. Each file has YAML frontmatter:

```yaml
---
title: "The claim being checked"
translationKey: "slug-matching-both-languages"
summary: "One-line summary of the finding"
claim: "The exact claim being verified"
verdict: "false"          # false | misleading | missing-context | mixed | true
verdictSummary: "Why this verdict was assigned"
tags: ["economy", "portugal"]
publishedDate: 2026-02-13
sources:
  - label: "Source description"
    url: "https://primary-source-url.example"
    evidenceImage: "/evidence/screenshot.png"
---

## What They Are Saying

[Context about the claim...]

## What The Documents Show

[Evidence and analysis...]
```

**Verdicts:**
- `false` — Documents directly contradict the claim
- `misleading` — Some truth, but distorts context or creates false impression
- `missing-context` — Technically true but critically incomplete
- `mixed` — Parts true, parts false
- `true` — Documents support the claim (yes, we publish these)

## Contributing

Contributions are welcome. You can help by:

- **Submitting a claim to check** — [Open an issue](https://github.com/MonsMali/ForThePeople/issues) with the claim, who said it, and any source links you have
- **Writing a fact-pack** — Fork, write a fact-pack following the format above, and open a PR
- **Translating** — Help translate existing fact-packs between English and Portuguese
- **Reporting errors** — If we got something wrong, [open an issue](https://github.com/MonsMali/ForThePeople/issues). We correct publicly.
- **Code improvements** — Bug fixes, accessibility, performance — all welcome

### Guidelines for Fact-Pack Contributions

- Primary sources only. Link to the actual document, not someone's article about it.
- No opinions or predictions — only verifiable factual claims.
- Include claims from all political sides. Non-partisan coverage is non-negotiable.
- If a claim is true, say so. Credibility requires fairness.

## Editorial Standards

- **Primary sources only.** We link to the actual document.
- **No anonymous claims.** Every fact-pack identifies who said what and when.
- **Corrections are public.** Revision notes on every update. Git history is the audit trail.
- **No ideology.** We check claims from all sides.
- **Verifiable.** Every source is linked.

We adhere to the [IFCN Code of Principles](https://ifcncodeofprinciples.poynter.org/) (not yet a certified signatory).

## License

MIT License. Content is fact-based and sourced. Share freely.

## Contact

- **Email:** hello@forthepeople.org
- **Issues:** [github.com/MonsMali/ForThePeople/issues](https://github.com/MonsMali/ForThePeople/issues)
