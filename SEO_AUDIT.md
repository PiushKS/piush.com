# Complete Technical SEO, AEO, GEO, AIO & SXO Audit: Piush.com

**Date**: November 2026  
**Audit Team**: Principal Technical SEO Architect, Core Web Vitals Performance Engineer, Semantic Web Specialist  
**Domain**: [https://piush.com](https://piush.com)  
**Production Stack**: Astro 5 (Static Site Generation / SSG), Tailwind CSS v4, TypeScript, Sharp, LiteSpeed / Apache  

---

## 1. Executive Summary

A comprehensive, evidence-based technical audit was conducted across the entire public surface of **https://piush.com**. The audit evaluated:
- **Traditional Search Engine Optimization (SEO)**: Crawlability, indexability, canonical integrity, metadata hygiene, heading hierarchy, and link structure.
- **Answer Engine Optimization (AEO)**: Direct query resolution, featured snippet readiness, definition headers, and schema-backed FAQ accordions.
- **Generative Engine Optimization (GEO)**: First-party information gain, reproducible benchmarks, entity disambiguation, and machine-readable data layers (`/llms.txt`).
- **AI Search Optimization (AIO)**: Discovery across Google AI Overviews, ChatGPT Search, Perplexity AI, Microsoft Copilot, and Claude Search.
- **Search Experience Optimization (SXO)**: Core Web Vitals, page experience, visual stability, keyboard/screen-reader accessibility (WCAG 2.2 AA), and conversion friction.

### Baseline vs. Post-Implementation Results

| Metric / Audit Area | Initial Baseline | Post-Remediation | Status |
| :--- | :---: | :---: | :---: |
| **Desktop Performance** | 80 | **100** | Passed |
| **Mobile Performance** | ~75 – 80 | **100** | Passed |
| **Accessibility (WCAG 2.2 AA)** | 100 (warnings) | **100 (0 warnings)** | Passed |
| **Best Practices** | 96 (console errors) | **100 (0 errors)** | Passed |
| **SEO Score** | 100 (canonical bleed) | **100 (strict)** | Passed |
| **Agentic Browsing (AI Discovery)** | 2 / 2 | **2 / 2 (100%)** | Passed |
| **Automated SEO Audit (`validate-seo.mjs`)** | Not implemented | **74 / 74 Pages Validated (0 errors)** | Passed |
| **Quiz Knowledge Bank (`validate-quiz.mjs`)** | Not implemented | **550 / 550 Questions Validated (0 errors)** | Passed |

---

## 2. Issues Inventory & Root Cause Analysis

### P0 — Critical Technical Blockers

#### Issue 1: Split Link Equity via 30+ "Canonicalised" Non-Slash URLs
- **Observed Behavior**: Crawlers attempting to visit internal links (e.g. `https://piush.com/tools`, `https://piush.com/tools/text`, `https://piush.com/quiz`) encountered a non-indexable status ("Canonicalised") because the target canonical had a trailing slash (`https://piush.com/tools/`).
- **Root Cause**: Astro generated directory-based static files (`/tools/index.html`), but navigation components, breadcrumbs, and tool card links used unslashed routes (`href="/tools"`).
- **Remediation**:
  1. Configured `trailingSlash: 'always'` in [`astro.config.mjs`](file:///Users/mac/Documents/piush.com/astro.config.mjs).
  2. Updated all internal links across navigation, drawer, footer, breadcrumbs, and pagination to include trailing slashes.
  3. Added rewrite and 301 redirect rules in [`public/.htaccess`](file:///Users/mac/Documents/piush.com/public/.htaccess) to automatically enforce trailing slashes at the server level.

#### Issue 2: Conflicting Robots Directives on Private & Error Pages
- **Observed Behavior**: Pages such as `/404.html` and `/demo/` emitted two conflicting meta tags: `<meta name="robots" content="index,follow">` and `<meta name="robots" content="noindex,nofollow">`.
- **Root Cause**: [`src/components/BaseHead.astro`](file:///Users/mac/Documents/piush.com/src/components/BaseHead.astro) unconditionally rendered an index directive, while page templates appended a second tag.
- **Remediation**: Added a `noindex?: boolean` prop to `<BaseHead />` with conditional rendering. Excluded `/demo/` and `/404` from sitemap generation.

---

### P1 — High-Impact Discoverability & Experience Issues

#### Issue 3: Console Error 400 Depressing Best Practices Score (96 -> 100)
- **Observed Behavior**: Umami analytics emitted `Failed to load resource: the server responded with a status of 400 () from gateway.umami.is/api/send` during automated Lighthouse audits and headless runs.
- **Root Cause**: Umami script attempted to track events on local development hosts, preview environments, and headless runners where the domain was unauthorized.
- **Remediation**: Added `data-domains="piush.com,www.piush.com"` to the Umami script in [`src/components/BaseHead.astro`](file:///Users/mac/Documents/piush.com/src/components/BaseHead.astro). Umami now remains silent during tests and local previews.

#### Issue 4: WCAG 2.5.3 (Label in Name) Accessibility Mismatch
- **Observed Behavior**: Screen-reader accessible names did not match visible text on interactive controls:
  - Header brand link had visible text `Piush.` but `aria-label="Home"`.
  - Footer buttons had visible text `All Articles` and `Tags` but `aria-label="Browse all posts"` and `aria-label="Explore tags"`.
- **Root Cause**: Hardcoded, redundant `aria-label` attributes overrode plain text content.
- **Remediation**: Updated the header link to `aria-label="Piush. - Home"` and removed redundant `aria-label` attributes on footer elements with explicit text labels.

#### Issue 5: Document Outline Hijack via Global Footer Heading
- **Observed Behavior**: Search crawlers parsing article outlines encountered `<h2>Want to build something extraordinary?</h2>` at the end of every blog post, distorting document topic models.
- **Root Cause**: Footer call-to-action used an `<h2>` heading rather than a semantic `<h3>` or styled `<div>`.
- **Remediation**: Demoted the footer CTA heading to an `<h3>` with `card-surface` hierarchy in [`src/components/sections/Footer.astro`](file:///Users/mac/Documents/piush.com/src/components/sections/Footer.astro).

---

### P2 — Performance & Core Web Vitals Bottlenecks

#### Issue 6: Uncompressed Hero Portrait & Header Avatar
- **Observed Behavior**: The homepage loaded a 396 KB 1080x1080 PNG image (`public/images/portrait/piush.png`) and an 82 KB 380x380 favicon PNG (`public/favicon.png`) displayed at 36x36px.
- **Root Cause**: Lack of automated image downscaling and modern format delivery.
- **Remediation**:
  1. Generated responsive 600x600 and 840x840 WebP and AVIF formats with Sharp (`piush-600.avif` at 50 KB, `piush.webp` at 84 KB).
  2. Generated a crisp 72x72px retina avatar for the header (`avatar-72.webp` at 3.6 KB, down from 82 KB).
  3. Implemented responsive `<picture>` markup with responsive `<link rel="preload">` tags.

#### Issue 7: Inlined Data URI HTML Bloat (387 KB -> 24 KB)
- **Observed Behavior**: `dist/index.html` was 387 KB.
- **Root Cause**: Vite default inlined SVGs smaller than 4 KB as data URIs. Because the logo carousel triplicated 42 logos, 99 raw data URIs were embedded directly into the HTML document.
- **Remediation**:
  1. Configured `build.assetsInlineLimit: 0` in [`astro.config.mjs`](file:///Users/mac/Documents/piush.com/astro.config.mjs).
  2. Replaced the 185 KB auto-traced `Elixir-logo.svg` with a 400-byte clean vector droplet.
  3. Adjusted `Carousel.astro` duplication from 3x to 2x, precisely matching the `-50%` CSS keyframe loop.

#### Issue 8: WebGL Physics Mesh Blocking Main Thread
- **Observed Behavior**: Initial page load experienced 500ms+ of main-thread CPU execution from WebGL plushie physics and confetti setup.
- **Root Cause**: `InteractivePortrait.astro` statically imported `plushie.js`, `squeak.js`, and `canvas-confetti`.
- **Remediation**: Converted initialization to dynamic imports executed upon user interaction (`pointerenter`, `pointerdown`, `focusin`) or scheduled via `requestIdleCallback`. Initial bundle size dropped from 45.7 kB to 3.04 kB.

---

## 3. Public Route Classification & Status

```text
====================================================================================================
URL Path                           Type               Indexability   Canonical Target
====================================================================================================
https://piush.com/                 Homepage           Indexable      https://piush.com/
https://piush.com/about/           ProfilePage        Indexable      https://piush.com/about/
https://piush.com/portfolio/       CollectionPage     Indexable      https://piush.com/portfolio/
https://piush.com/quiz/            Quiz               Indexable      https://piush.com/quiz/
https://piush.com/tags/            CollectionPage     Indexable      https://piush.com/tags/
https://piush.com/tools/           CollectionPage     Indexable      https://piush.com/tools/
https://piush.com/tools/json/      WebApplication     Indexable      https://piush.com/tools/json/
https://piush.com/tools/text/      WebApplication     Indexable      https://piush.com/tools/text/
https://piush.com/tools/playground/ WebApplication    Indexable      https://piush.com/tools/playground/
https://piush.com/tools/svg/       WebApplication     Indexable      https://piush.com/tools/svg/
https://piush.com/tools/ui/        WebApplication     Indexable      https://piush.com/tools/ui/
https://piush.com/tools/colors/    WebApplication     Indexable      https://piush.com/tools/colors/
https://piush.com/blog/            CollectionPage     Indexable      https://piush.com/blog/
https://piush.com/blog/page/[2..3]/ CollectionPage    Indexable      https://piush.com/blog/page/[n]/
https://piush.com/blog/category/*  CollectionPage     Indexable      https://piush.com/blog/category/[cat]/
https://piush.com/blog/tag/*       CollectionPage     Indexable      https://piush.com/blog/tag/[tag]/
https://piush.com/blog/author/*    ProfilePage        Indexable      https://piush.com/blog/author/piush-ks/
https://piush.com/blog/[slug]/     TechArticle        Indexable      https://piush.com/blog/[slug]/
https://piush.com/privacy-policy/  WebPage            Indexable      https://piush.com/privacy-policy/
https://piush.com/404.html         Error Page         Noindex        noindex, nofollow
https://piush.com/demo/            Dev Preview        Noindex        noindex, nofollow (excluded in sitemap)
====================================================================================================
Total Public HTML Documents: 74 | Total Indexed in Sitemap: 73
```

---

## 4. Verification Checkpoint

1. **SEO Validator**: `npm run validate:seo` audited all 74 HTML output files in `dist/`. **0 errors, 0 warnings**.
2. **Quiz Knowledge Bank**: `npm run validate:quiz` validated 550 questions across 9 languages. **0 errors**.
3. **Lighthouse Desktop**: **100 Performance | 100 Accessibility | 100 Best Practices | 100 SEO | 100 Agentic Browsing**.
4. **Lighthouse Mobile**: **100 Performance | 100 Accessibility | 100 Best Practices | 100 SEO | 100 Agentic Browsing**.
5. **Production Build**: Built in 1.41 seconds with zero build warnings.
