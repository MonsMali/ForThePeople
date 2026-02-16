# Source Check — Content Schema & Editorial Rules

## File Structure

Articles live in two folders:
- `src/data/factpacks/en/` — English versions
- `src/data/factpacks/pt/` — Portuguese versions

Both files for the same fact-check MUST share the same `translationKey` value.
Filename format: `kebab-case-slug.md` (e.g., `chega-anti-corruption.md`)

## Required Frontmatter (every field mandatory unless noted)

```yaml
---
title: "string"              # Clear headline, often a question
translationKey: "string"     # Must match between EN and PT files, must match filename slug
summary: "string"            # One sentence: what the claim is + what the evidence shows
claim: "string"              # The exact claim being checked, faithfully quoted or paraphrased
verdict: "string"            # ONLY one of: false | misleading | missing-context | mixed | true
verdictSummary: "string"     # 2-3 sentences explaining the verdict, referencing key evidence
tags: ["string", "string"]   # Lowercase, kebab-case topic tags
publishedDate: YYYY-MM-DD    # Today's date
sources:                     # Array of primary source documents (minimum 2)
  - label: "string"          # Official name of the document or dataset
    url: "string"            # Direct URL to the primary source
  # Do NOT include evidenceImage — added manually later
draft: true                  # Always true for new articles (published manually after review)
---
```

Optional fields (include only when applicable):
- `lastUpdated: YYYY-MM-DD` — only for corrections/revisions
- `revisionNote: "string"` — explanation of what changed
- `ogImage: "string"` — added manually

## Verdict Definitions

Use these STRICTLY. Do not invent new verdicts or hedge between them.

| Verdict | Meaning | When to use |
|---------|---------|-------------|
| `false` | The documents directly contradict the claim | The evidence clearly disproves the statement |
| `misleading` | Contains some truth but distorts context or creates a false impression | Cherry-picked data, out-of-context quotes, technically not lying but deceptive |
| `missing-context` | Technically true but critically incomplete | The claim is accurate but omits information that changes its meaning |
| `mixed` | Parts are literally true and parts are literally false | The claim bundles multiple statements, some right, some wrong |
| `true` | The documents support the claim | Evidence confirms what was said |

Do NOT default to "mixed" when unsure. If evidence clearly supports a stronger verdict, use it.

## Tags Used So Far

Reuse existing tags when possible: immigration, portugal, public-safety, corruption, broken-promises, rhetoric, us-politics, healthcare, eu, nato, defense, economy, elections, judiciary

## Body Structure (in order)

### "What They Are Saying"
- Who said it, when, where
- Present the claim fairly, no straw-manning
- Provide enough context for a reader unfamiliar with the topic

### "What The Documents Show"
- Walk through each primary source
- Use tables for data comparisons (year-over-year stats, claim vs. reality)
- Use subheadings (###) to organize evidence by theme
- Show the evidence, do not interpret it editorially

### Closing paragraph (NO heading)
- Summarize the gap between claim and evidence
- End by reminding readers the sources are public and linked
- Keep it to 2-3 sentences

## Writing Style

- Journalistic, not academic. Short paragraphs. Active voice.
- NEVER: "In conclusion," "It's important to note," "Let's dive in," "It is worth noting," "In today's political landscape"
- NEVER: dash-lists in prose (use proper paragraphs), emojis, exclamation marks
- Tables are encouraged for side-by-side comparisons
- Every factual statement must trace back to a frontmatter source
- When a claim has merit, acknowledge it explicitly (see "What IS True" sections)

## Portuguese Version Rules

- Must be natural European Portuguese (pt-PT), NOT Brazilian Portuguese
- Never: "você" (use "si"), "fato" (use "facto"), "time" (use "equipa")
- Use Portuguese institution names: Assembleia da República, Tribunal Constitucional, INE
- Adapt cultural context and references for a Portuguese reader
- Section headings in Portuguese: "O Que Estão a Dizer" / "O Que Os Documentos Mostram"
- This is NOT a translation — rewrite naturally for the audience
