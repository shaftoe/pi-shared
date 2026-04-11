---
name: html-report
description: Produces analysis, reports, codebase reviews, and similar outputs as a single-page HTML file. Use whenever the user asks for a report, analysis, summary, review, or any deliverable that benefits from rich visual formatting.
---

# HTML Output

Generate analysis, reports, and reviews as a self-contained single-page HTML file with embedded CSS and JS. Write the file using the `write` tool, then open it in the user's browser so they can review the results immediately.

## When to Use

Activate this skill whenever the user request involves:

- Codebase analysis or audit
- Architecture review or technical report
- Data analysis summary or visualization
- Benchmark or performance report
- Comparison or evaluation of options
- Any output where a formatted, navigable document adds value

## Output File

- Use the `write` tool to create an `.html` file in the project root or a sensible location
- Name the file descriptively, e.g. `report-codebase-analysis.html`, `report-auth-review.html`
- After writing, open the file in the browser: `open report-<name>.html` (macOS) or `xdg-open report-<name>.html` (Linux)

## HTML Structure

Always produce a **single self-contained file** — all CSS in `<style>`, all JS in `<script>`, no external dependencies (except optionally a CDN link for an icon library like FontAwesome).

### Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ descriptive title }}</title>
  <style>
    /* ── Reset & Base ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a2e;
      background: #f8f9fa;
      padding: 0 0 4rem 0;
    }

    /* ── Layout ── */
    .container { max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem; }

    /* ── Header ── */
    header {
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      color: #fff;
      padding: 3rem 1.5rem;
      text-align: center;
    }
    header h1 { font-size: 2rem; margin-bottom: .25rem; }
    header p.meta { opacity: .7; font-size: .9rem; }

    /* ── Table of Contents ── */
    .toc {
      background: #fff;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 1.5rem 2rem;
      margin: 2rem 0;
    }
    .toc h2 { font-size: 1.1rem; margin-bottom: .75rem; color: #495057; }
    .toc ol { padding-left: 1.25rem; }
    .toc li { margin-bottom: .35rem; }
    .toc a { color: #0d6efd; text-decoration: none; }
    .toc a:hover { text-decoration: underline; }

    /* ── Sections ── */
    section { margin: 2rem 0; }
    section h2 {
      font-size: 1.4rem;
      padding-bottom: .5rem;
      border-bottom: 2px solid #e9ecef;
      margin-bottom: 1rem;
      color: #1a1a2e;
    }
    section h3 { font-size: 1.15rem; margin: 1.25rem 0 .5rem; color: #343a40; }

    /* ── Cards ── */
    .card {
      background: #fff;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1rem;
    }

    /* ── Tables ── */
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    th, td { padding: .65rem 1rem; text-align: left; border-bottom: 1px solid #dee2e6; }
    th { background: #f1f3f5; font-weight: 600; font-size: .85rem; text-transform: uppercase; letter-spacing: .03em; }
    tr:hover td { background: #f8f9fa; }

    /* ── Badges ── */
    .badge {
      display: inline-block;
      padding: .15rem .6rem;
      border-radius: 999px;
      font-size: .75rem;
      font-weight: 600;
      vertical-align: middle;
    }
    .badge-green  { background: #d3f9d8; color: #2b8a3e; }
    .badge-yellow { background: #fff3bf; color: #e67700; }
    .badge-red    { background: #ffe3e3; color: #c92a2a; }
    .badge-blue   { background: #d0ebff; color: #1864ab; }

    /* ── Callouts ── */
    .callout {
      padding: 1rem 1.25rem;
      border-radius: 8px;
      margin: 1rem 0;
      border-left: 4px solid;
    }
    .callout-info    { background: #e7f5ff; border-color: #339af0; }
    .callout-warn    { background: #fff9db; border-color: #fcc419; }
    .callout-success { background: #ebfbee; border-color: #51cf66; }
    .callout-danger  { background: #fff5f5; border-color: #ff6b6b; }

    /* ── Code ── */
    code {
      background: #f1f3f5;
      padding: .15em .4em;
      border-radius: 4px;
      font-size: .88em;
    }
    pre {
      background: #1a1a2e;
      color: #e9ecef;
      padding: 1.25rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1rem 0;
      font-size: .88rem;
      line-height: 1.5;
    }

    /* ── Charts (simple bar) ── */
    .bar-chart { display: flex; flex-direction: column; gap: .5rem; margin: 1rem 0; }
    .bar-row { display: flex; align-items: center; gap: .75rem; }
    .bar-label { width: 120px; font-size: .85rem; text-align: right; flex-shrink: 0; }
    .bar-track { flex: 1; background: #e9ecef; border-radius: 4px; height: 24px; overflow: hidden; }
    .bar-fill  { height: 100%; border-radius: 4px; transition: width .3s ease; }
    .bar-value { font-size: .85rem; font-weight: 600; min-width: 40px; }

    /* ── Metrics row ── */
    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin: 1.5rem 0; }
    .metric-card {
      background: #fff;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 1.25rem;
      text-align: center;
    }
    .metric-value { font-size: 2rem; font-weight: 700; color: #1a1a2e; }
    .metric-label { font-size: .85rem; color: #6c757d; margin-top: .25rem; }

    /* ── Print ── */
    @media print {
      body { background: #fff; }
      header { background: #1a1a2e; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .toc, .card { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <header>
    <h1>{{ Title }}</h1>
    <p class="meta">{{ Date }} · {{ Author / Agent }}</p>
  </header>

  <div class="container">
    <!-- Table of Contents -->
    <nav class="toc">
      <h2>Table of Contents</h2>
      <ol>
        <li><a href="#summary">Summary</a></li>
        <li><a href="#details">Detailed Findings</a></li>
        <!-- … -->
      </ol>
    </nav>

    <!-- Sections -->
    <section id="summary">
      <h2>Summary</h2>
      <p>…</p>
    </section>

    <section id="details">
      <h2>Detailed Findings</h2>
      <!-- cards, tables, callouts, charts as needed -->
    </section>
  </div>
</body>
</html>
```

## Content Guidelines

1. **Header** — Always include a descriptive title and generation date
2. **Table of Contents** — Link to every `<section>` by `id` for easy navigation
3. **Summary first** — Lead with a concise executive summary or key findings
4. **Visual hierarchy** — Use the provided component classes (cards, badges, callouts, metrics, bar charts, tables) to make information scannable
5. **Badges** — Use for severity levels (green/yellow/red), status tags, or categories
6. **Callouts** — Highlight important notes, warnings, or key takeaways
7. **Metrics** — Use `.metrics` grid for key numbers at a glance
8. **Bar charts** — Use `.bar-chart` for simple horizontal bar visualizations (no JS charting library needed)
9. **Tables** — Use for structured comparisons, file listings, dependency inventories, etc.
10. **Code blocks** — Use `<pre><code>` for file paths, snippets, or commands mentioned in the analysis
11. **Print-friendly** — The template includes a print stylesheet; ensure content works on paper too

## Anti-Patterns

- Do **not** split the report across multiple files — one HTML file only
- Do **not** use external CSS/JS files — everything must be embedded
- Do **not** rely on CDN-only resources for critical content — the page must render fully offline
- Do **not** use frameworks (React, Vue, etc.) — plain HTML/CSS/JS only
- Do **not** omit the table of contents for reports longer than a single screen
