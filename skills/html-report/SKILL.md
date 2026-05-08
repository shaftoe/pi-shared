---
name: html-report
description: Produces analysis, reports, codebase reviews, and similar outputs as a single-page HTML file. Use whenever the user asks for a report, analysis, summary, review, or any deliverable that benefits from rich visual formatting.
---

# HTML Output

Generate analysis, reports, and reviews as a self-contained single-page HTML file using **semantic HTML** styled by **Pico.css** (loaded via CDN). Write the file using the `write` tool, then open it in the user's browser so they can review the results immediately.

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

## Styling Approach

- **No custom CSS** — all styling comes from Pico.css loaded via CDN
- Use **semantic HTML elements** (`<article>`, `<aside>`, `<nav>`, `<mark>`, `<details>`, `<progress>`, `<figure>`, etc.) to leverage Pico's built-in styles
- Use Pico utility classes where needed (e.g. `.grid`, `.container`, `.contrast`)

## HTML Structure

Always produce a **single self-contained file**. The only external dependency is the Pico.css CDN link. All JS must be embedded inline in `<script>` tags.

### Template

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ descriptive title }}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">
</head>
<body>
  <header class="container">
    <hgroup>
      <h1>{{ Title }}</h1>
      <p>{{ Date }} &middot; {{ Author / Agent }}</p>
    </hgroup>
  </header>

  <main class="container">
    <!-- Table of Contents -->
    <nav>
      <ul>
        <li><a href="#summary">Summary</a></li>
        <li><a href="#details">Detailed Findings</a></li>
        <!-- … -->
      </ul>
    </nav>

    <!-- Summary Section -->
    <section id="summary">
      <h2>Summary</h2>
      <p>…</p>
    </section>

    <!-- Detailed Findings -->
    <section id="details">
      <h2>Detailed Findings</h2>
      <!-- articles, tables, asides, progress bars, details as needed -->
    </section>
  </main>
</body>
</html>
```

## Semantic Component Guide

Use the following semantic HTML patterns instead of custom CSS classes:

### Cards → `<article>`

Use `<article>` for self-contained content blocks. Pico styles these with padding and a subtle border.

```html
<article>
  <header>Card Title</header>
  <p>Card body content goes here.</p>
  <footer>Optional footer or metadata</footer>
</article>
```

### Badges / Tags → `<mark>`, `<kbd>`, `<output>`

- `<mark>` — highlighted label (yellow background)
- `<kbd>` — keyboard/code-style tag (subtle box)
- `<output>` — numeric or computed value tag

```html
<p>Status: <mark>Active</mark></p>
<p>Priority: <kbd>High</kbd></p>
<p>Score: <output>42</output></p>
```

### Callouts → `<aside>`, `<details>`, `<blockquote>`

- `<aside>` — tangential notes and tips (Pico provides distinct styling)
- `<details>` / `<summary>` — collapsible callouts, useful for lengthy notes
- `<blockquote>` — quoted or emphasized content with attribution

```html
<aside>
  <h4>Info</h4>
  <p>This is an informational callout using semantic aside.</p>
</aside>

<details>
  <summary>Click to expand warning details</summary>
  <p>Hidden content revealed on click.</p>
</details>

<blockquote>
  <p>An important quoted statement or key takeaway.</p>
  <footer>— <cite>Source</cite></footer>
</blockquote>
```

### Metrics Grid → `.grid` + `<article>`

Use Pico's `.grid` utility with `<article>` cards for key numbers at a glance.

```html
<div class="grid">
  <article>
    <header>Metric Name</header>
    <p style="font-size:2rem;font-weight:700;text-align:center;margin:0;">42</p>
    <footer>Description</footer>
  </article>
  <!-- repeat for each metric -->
</div>
```

### Bar Charts → `<progress>`

Use the native `<progress>` element for horizontal bar visualizations. No JS library needed.

```html
<label>Test Coverage</label>
<progress value="78" max="100"></progress>
<small>78%</small>

<label>Technical Debt</label>
<progress value="35" max="100"></progress>
<small>35%</small>
```

### Tables → `<table>`

Pico provides clean, responsive table styling out of the box. Use semantic table elements directly.

```html
<table>
  <thead>
    <tr>
      <th>File</th>
      <th>Issues</th>
      <th>Severity</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>src/auth.ts</code></td>
      <td>3</td>
      <td><mark>High</mark></td>
    </tr>
  </tbody>
</table>
```

### Code Blocks → `<pre><code>`

Pico styles `<pre>` and `<code>` automatically with a monospace font and background.

```html
<pre><code>npm install --save-dev typescript</code></pre>
```

Inline code:

```html
<p>Edit the <code>config.json</code> file to change settings.</p>
```

### Figures → `<figure>`

Use for images, diagrams, or any content with a caption.

```html
<figure>
  <img src="diagram.png" alt="Architecture overview" />
  <figcaption>Figure 1: System architecture overview</figcaption>
</figure>
```

## Content Guidelines

1. **Header** — Always include a descriptive title and generation date using `<hgroup>`
2. **Table of Contents** — Use `<nav>` with `<ul>` to link to every `<section>` by `id`
3. **Summary first** — Lead with a concise executive summary or key findings
4. **Visual hierarchy** — Use semantic elements (`<article>`, `<aside>`, `<details>`, `<mark>`, `<progress>`, `<table>`) to make information scannable
5. **Tags/Labels** — Use `<mark>` for severity levels, `<kbd>` for status tags, `<output>` for values
6. **Callouts** — Use `<aside>` for important notes and tips, `<details>` for collapsible warnings, `<blockquote>` for key takeaways
7. **Metrics** — Use `.grid` with `<article>` cards for key numbers at a glance
8. **Bar charts** — Use `<progress>` elements for simple horizontal bar visualizations
9. **Tables** — Use for structured comparisons, file listings, dependency inventories, etc.
10. **Code blocks** — Use `<pre><code>` for file paths, snippets, or commands mentioned in the analysis
11. **Print-friendly** — Pico includes built-in print styles; ensure content works on paper too

## Anti-Patterns

- Do **not** split the report across multiple files — one HTML file only
- Do **not** use external CSS/JS files — everything must be embedded (except the Pico.css CDN link)
- Do **not** write custom CSS in `<style>` tags — use Pico.css classes and semantic HTML only
- Do **not** use frameworks (React, Vue, etc.) — plain HTML/JS only
- Do **not** use additional CSS frameworks or libraries alongside Pico.css
- Do **not** omit the table of contents for reports longer than a single screen
