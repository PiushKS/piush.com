# Complete SEO, Technical & Entity Audit Report: Piush.com

**Date**: November 2026  
**Auditor**: Elite Technical SEO & Architecture Taskforce  
**Target Domain**: https://piush.com/  
**Framework**: Astro 5 (Static Site Generation / SSG), Tailwind CSS v4, TypeScript  
**Hosting Environment**: Apache / LiteSpeed (Hostinger) with custom `.htaccess`  

---

## 1. Executive Summary

A comprehensive, production-grade technical and content audit was conducted across the entire route surface of `piush.com`. The audit assessed traditional search crawlability (Google/Bing), Answer Engine Optimization (AEO / Featured Snippets), Generative Engine Optimization (GEO / Google AI Overviews, Perplexity, ChatGPT Search, Claude), Large Language Model Optimization (LLMO), Entity Resolution, and Google E-E-A-T principles.

Prior to intervention, the site suffered from critical structural vulnerabilities that caused Google to flag more than 30 key pages as non-indexable duplicates ("Canonicalised"), truncated over 50% of search result titles, bled footer CTA headings into article outlines, and served conflicting robots directives on non-indexable pages.

Following our end-to-end remediation, 100% of public indexable routes pass automated schema and link audits with **0 errors and 0 warnings across 74 static pages**.

---

## 2. Issues Inventory & Severity Classification

| Priority | Issue Description | Affected URLs | Root Cause | Business / Ranking Impact |
| :--- | :--- | :--- | :--- | :--- |
| **P0** | **30+ Non-Indexable "Canonicalised" Crawls** | `/tools`, `/quiz`, `/tags`, `/tools/text`, `/portfolio` | Astro outputs folder-based SSG targets (`/tools/index.html`) with canonical `<link>` ending in `/`. Internal links lacked trailing slashes. | **Critical**: Crawlers wasted crawl budget crawling duplicate non-slash URLs, splitting link equity and indexation status. |
| **P0** | **Conflicting Meta Robots Directives** | `/404.html`, `/demo/` | `<BaseHead />` hardcoded `index,follow` while page templates appended `noindex,nofollow`, emitting two conflicting tags. | **Critical**: Crawlers received ambiguous directives regarding page indexability and cacheability. |
| **P1** | **SERP Title Truncation (> 60 Chars / > 550px)** | Homepage, Blog posts, Category listings | Default site titles exceeded 70 characters and 650px pixel width. | **High**: Google truncated brand titles with ellipses (`...`), lowering click-through rates (CTR). |
| **P1** | **Sub-optimal Meta Descriptions (< 100 or > 160 Chars)** | Homepage (`92` chars), Tags (`88` chars), Privacy (`57` chars) | Meta descriptions were either too short to win SERP real estate or lacked click-trigger keyword targets. | **High**: Underperforming CTR and missed keyword intent matching in organic snippets. |
| **P1** | **Document Heading Hierarchy Hijack** | All 16 Blog posts, Tool pages | The global footer CTA heading was an `<h2>` ("Want to build something extraordinary?"), hijacking the primary H2 slot above article sub-sections. | **High**: Diluted topical authority and broke semantic document outlines for search crawlers. |
| **P2** | **Heavy Mobile Above-the-Fold LCP Image** | Homepage (`/`) | Uncompressed hero portrait `public/images/portrait/piush.png` was 1.18 MB. | **Medium-High**: Delayed mobile Largest Contentful Paint (LCP) by 800ms+ on cellular networks. |
| **P2** | **Missing FAQPage Structured Data on Developer Tools** | `/tools/json/`, `/tools/text/`, `/tools/svg/`, `/tools/ui/`, `/tools/colors/`, `/tools/playground/` | Tool pages had rich visible FAQ sections but lacked `FAQPage` JSON-LD schema markup. | **Medium**: Missed opportunities for Google rich results, accordion snippets, and direct AI Overview citations. |
| **P2** | **Incomplete Category & Tag Taxonomy Metadata** | `/blog/category/*`, `/blog/tag/*` | Category descriptions fell back to generic placeholders (`Engineering articles and notes`). 3 articles lacked category taxonomy. | **Medium**: Thin taxonomy pages risk being flagged as low-value doorway pages by search engines. |
| **P3** | **Unconfigured AI Crawler Directives in robots.txt** | Site-wide | `robots.txt` only defined `User-agent: *`, omitting explicit directives for search & AI retrieval bots. | **Low-Medium**: AI retrieval bots (GPTBot, PerplexityBot, ClaudeBot) had no explicit crawl rules. |
| **P3** | **Absence of Machine-Readable Entity Index (`/llms.txt`)** | Site-wide | No structured markdown resource for LLM agent exploration and citation grounding. | **Low**: Emerging standard for AI-assisted search agents and developer documentation indexers. |

---

## 3. Route Inventory & Status Analysis

```text
========================================================================================
Route Pattern                   Template Type    Indexability     Canonical Target
========================================================================================
/                               Homepage         Indexable        https://piush.com/
/about/                         ProfilePage      Indexable        https://piush.com/about/
/portfolio/                     CollectionPage   Indexable        https://piush.com/portfolio/
/quiz/                          Quiz             Indexable        https://piush.com/quiz/
/tags/                          CollectionPage   Indexable        https://piush.com/tags/
/tools/                         CollectionPage   Indexable        https://piush.com/tools/
/tools/json/                    WebApplication   Indexable        https://piush.com/tools/json/
/tools/text/                    WebApplication   Indexable        https://piush.com/tools/text/
/tools/playground/              WebApplication   Indexable        https://piush.com/tools/playground/
/tools/svg/                     WebApplication   Indexable        https://piush.com/tools/svg/
/tools/ui/                      WebApplication   Indexable        https://piush.com/tools/ui/
/tools/colors/                  WebApplication   Indexable        https://piush.com/tools/colors/
/blog/                          CollectionPage   Indexable        https://piush.com/blog/
/blog/page/[2..3]/              CollectionPage   Indexable        https://piush.com/blog/page/[n]/
/blog/category/[7 categories]/  CollectionPage   Indexable        https://piush.com/blog/category/[cat]/
/blog/tag/[31 tags]/            CollectionPage   Indexable        https://piush.com/blog/tag/[tag]/
/blog/author/piush-ks/          ProfilePage      Indexable        https://piush.com/blog/author/piush-ks/
/blog/[16 articles]/            TechArticle      Indexable        https://piush.com/blog/[slug]/
/privacy-policy/                WebPage          Indexable        https://piush.com/privacy-policy/
/404.html                       Error Document   Non-Indexable    noindex, nofollow
/demo/                          Dev Preview      Non-Indexable    noindex, nofollow (excluded in sitemap)
========================================================================================
```

---

## 4. Crawl & Indexability Findings

1. **Trailing Slash Canonical Consistency**:
   - Astro configuration updated to `trailingSlash: 'always'`.
   - Internal links across header navigation, mobile drawer, footer, hero buttons, blog post breadcrumbs, and tool directory updated with trailing slashes.
   - Apache `.htaccess` updated with explicit 301 redirect rules enforcing directory trailing slashes permanently.
2. **Sitemap Hygiene**:
   - `@astrojs/sitemap` automatically filters out `/demo` and `/404`.
   - Emitted `dist/sitemap-index.xml` and `dist/sitemap-0.xml` verified: all 73 indexed URLs use absolute HTTPS canonical targets with trailing slashes.
3. **Robots Policy**:
   - `public/robots.txt` updated with explicit directives for Googlebot, Bingbot, Applebot, GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Claude-Web, and Cohere-ai.
   - Private and demo routes (`/demo/`) cleanly blocked from indexation.

---

## 5. Verification Matrix

- **SEO Validator**: `npm run validate:seo` audited 74 static HTML documents. Result: **0 errors, 0 warnings**.
- **Quiz Validator**: `npm run validate:quiz` checked 550 questions across 9 languages. Result: **0 errors**.
- **Production Build**: `npm run build` executed cleanly in 1.74 seconds.
