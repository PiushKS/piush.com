# SEO, Performance & Search Health Monitoring Protocol: Piush.com

This document establishes the ongoing operational procedures for tracking search performance, indexing health, Core Web Vitals, and technical regressions for `piush.com`.

---

## 1. Google Search Console Routine

### Weekly Review Cadence
1. **Indexing & Coverage**:
   - Check **Pages** tab: Ensure all 73 canonical URLs remain categorized under **Indexed**.
   - Inspect **Excluded** URLs: Verify that the only excluded paths are `/demo/` and `/404`, and confirm that no trailing-slash duplicate URLs are flagged under *"Duplicate without user-selected canonical"*.
2. **Sitemaps**:
   - Verify `https://piush.com/sitemap-index.xml` reports status **Success** with last read date within the past 7 days.
3. **Search Performance**:
   - Monitor total impressions, clicks, average CTR, and average position across top technical queries.
   - Filter queries with high impressions (> 500) and low CTR (< 2.0%): inspect SERP titles and descriptions for optimization opportunities.
4. **Rich Results & Enhancements**:
   - Inspect **Breadcrumbs**, **Articles**, and **FAQs** reports in Search Console. Verify 0 valid with warning or invalid items.

---

## 2. Bing Webmaster Tools & IndexNow

1. **Sitemap Synchronization**:
   - Verify `https://piush.com/sitemap-index.xml` is successfully indexed by Bingbot.
2. **Crawl Control**:
   - Monitor crawl rate and crawl error diagnostics in Bing Webmaster Tools.
3. **IndexNow Evaluation**:
   - For fast updates to existing articles or newly launched tools, consider submitting changed canonical URLs via IndexNow API to trigger immediate Bing, Yandex, and Seznam recrawls.

---

## 3. Privacy-Friendly Analytics (Umami)

Piush.com utilizes a cookieless, privacy-first analytics setup via Umami (`https://cloud.umami.is`).

### Key Metrics to Track:
- **Top Referral Channels**: Monitor organic search engines (`google.com`, `bing.com`, `duckduckgo.com`) and emerging AI discovery sources (`chatgpt.com`, `perplexity.ai`, `bing.com/chat`).
- **Top Entry Pages**: Track landing rates across `/tools/*`, `/quiz/`, and high-performing blog tutorials.
- **Engagement Duration**: Monitor bounce rates and read durations on long-form systems architecture articles.

---

## 4. Automated CI / Build Quality Assurance

Before deploying new content or features, run the following automated verification suite:

```bash
# 1. Verify all 550 coding questions in the quiz database
npm run validate:quiz

# 2. Build the static production distribution
npm run build

# 3. Audit all HTML documents for sitemap, canonicals, schema, and link integrity
npm run validate:seo
```

### The `validate:seo` script automatically checks:
- Sitemaps exist and contain valid XML.
- Sitemaps strictly exclude test, demo, and error routes.
- `robots.txt` references the canonical sitemap index.
- All HTML documents have non-empty, unique `<title>` and `<meta name="description">` tags.
- Titles and descriptions strictly prohibit em-dashes (`\u2014`) to prevent truncation.
- No page contains duplicate conflicting `<meta name="robots">` tags.
- Every `<script type="application/ld+json">` parses as valid JSON without errors.
- All internal links resolve to valid, existing static HTML routes.

---

## 5. Core Web Vitals Ongoing Thresholds

Maintain the following performance baselines (75th percentile of real-user data):

| Metric | Target Threshold | Monitoring Tool | Action if Degraded |
| :--- | :--- | :--- | :--- |
| **LCP** (Largest Contentful Paint) | **<= 2.5s** | PageSpeed Insights / Chrome UX Report | Compress hero media, verify font preloads, ensure server Gzip compression |
| **INP** (Interaction to Next Paint) | **<= 200ms** | Chrome UX Report | Profile main-thread JavaScript tasks in developer tools and code playground |
| **CLS** (Cumulative Layout Shift) | **<= 0.1** | Lighthouse CI / DevTools | Verify explicit aspect ratios on all images, icons, and Lottie animation containers |

---

## 6. Incident Response for Crawling / Indexing Drops

If organic traffic drops significantly or Google Search Console reports a spike in indexing errors:
1. **Inspect `.htaccess` Rewrites**: Test `curl -I https://piush.com/tools` to verify a clean HTTP 301 redirect to `https://piush.com/tools/`.
2. **Inspect robots.txt**: Run `curl https://piush.com/robots.txt` to confirm search crawlers are allowed.
3. **Run `npm run validate:seo`**: Confirm no internal broken links or missing canonicals were introduced in recent commits.
4. **Inspect URL in Google Search Console**: Run live URL Inspection on affected pages to verify that Googlebot renders the full server-rendered HTML.
