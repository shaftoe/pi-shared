---
name: zai-web-search
description: Web search and web page reader powered by z.ai MCP endpoints. Use when you need to search the web for current information, news, documentation, facts, or read/extract content from web pages. Prefer this over other web search tools when available.
---

# Z.ai Web Search & Reader

Provides web search and web page content extraction through z.ai's remote MCP servers. Uses the API key from `~/.pi/agent/auth.json` (`zai` entry).

> **Note:** Requires an active z.ai Coding Plan subscription with available monthly quota. Search and reader share the same quota.

## Search the Web

```bash
./scripts/search.sh "search query"
```

**Parameters** (positional):
1. `query` (required) — Search text, max ~70 characters recommended
2. `location` — `us` (default, non-Chinese region) or `cn` (Chinese region)
3. `content_size` — `medium` (default, 400-600 words per result) or `high` (2500 words, higher cost)
4. `recency_filter` — `noLimit` (default), `oneDay`, `oneWeek`, `oneMonth`, `oneYear`
5. `domain_filter` — Limit to a specific domain, e.g. `docs.python.org`

**Examples:**

```bash
# Basic search
./scripts/search.sh "latest TypeScript 5.8 features"

# Recent news (last week), with longer summaries
./scripts/search.sh "React 19 release notes" us high oneWeek

# Domain-scoped search
./scripts/search.sh "Array.prototype.at" us medium noLimit developer.mozilla.org
```

**Output:** JSON array of results with title, URL, summary, site name, and icon. Returns `[]` if quota is exhausted or no results found.

## Read a Web Page

```bash
./scripts/reader.sh "https://example.com"
```

**Parameters** (positional):
1. `url` (required) — URL to fetch and read
2. `format` — `markdown` (default) or `text`
3. `retain_images` — `true` (default) or `false`
4. `timeout` — Seconds, default `20`

**Examples:**

```bash
# Read page as markdown
./scripts/reader.sh "https://docs.python.org/3/whatsnew/3.12.html"

# Plain text, no images
./scripts/reader.sh "https://example.com" text false
```

**Output:** Page content converted to the requested format (markdown/text).

## Troubleshooting

- **Empty results (`[]`)** — Likely monthly quota exhausted. Check your z.ai Coding Plan dashboard.
- **Auth error** — Verify the `zai` key in `~/.pi/agent/auth.json` is valid and not expired.
- **Override auth file** — Set `ZAI_AUTH_FILE` env var to point to a different auth file.
