# SEO, Core Web Vitals & AI Citation Monitoring Specification: Piush.com

**Date**: November 2026  
**Purpose**: Repeatable, privacy-conscious monitoring framework across Search Engines, AI Overviews, and Real-User Metrics.  
**Target Domain**: [https://piush.com](https://piush.com)  

---

## 1. Metrics & Data Collection Matrix

```text
====================================================================================================
METRIC CATEGORY         PRIMARY KPIS                        DATA SOURCE             COLLECTION METHOD
====================================================================================================
Organic Search          - Clicks & Impressions              Google Search Console   Weekly GSC Performance
Performance             - Average CTR & Position            Bing Webmaster Tools    Export / API
                        - Top Queries by Impression Volume
----------------------------------------------------------------------------------------------------
Index Health &          - Indexed vs Excluded Pages         Google Search Console   Weekly Index Coverage
Crawlability            - Sitemaps status (73 URLs)         Server Access Logs      Check; monthly crawl
                        - 404 / 500 error spikes            Hostinger LiteSpeed     audit
----------------------------------------------------------------------------------------------------
Core Web Vitals         - LCP (<= 2.5s on 75th percentile)  Chrome UX Report (CrUX) Google Search Console
(Real User Metrics)     - INP (<= 200ms)                    PageSpeed Insights      CWV Report; monthly
                        - CLS (<= 0.1)                      Lighthouse CI           local audit
----------------------------------------------------------------------------------------------------
AI Search &             - Referring domains (chatgpt, etc.) Umami Analytics         Daily event & referrer
Generative Engines      - Branded entity citations          Manual Test Battery     aggregation; monthly
                        - Target problem queries            (ChatGPT, Perplexity,   prompt audit
                                                             Claude, Copilot)
----------------------------------------------------------------------------------------------------
Conversion &            - Portfolio / project link clicks   Umami Custom Events     Event listener on
Engagement              - Contact email triggers            (/portfolio, outbound   button & link clicks
                        - Tool usage & copy actions         links, tool operations)
====================================================================================================
```

---

## 2. Google Search Console & Bing Setup

### A. Google Search Console (GSC) Verification
1. Add property `https://piush.com` using the **Domain** verification method (DNS TXT record on Hostinger DNS).
2. Submit the canonical sitemap index:
   ```text
   Sitemap URL: https://piush.com/sitemap-index.xml
   ```
3. Inspect key URLs via the URL Inspection tool to confirm Googlebot renders full server-generated HTML:
   - Homepage: `https://piush.com/`
   - Tool page: `https://piush.com/tools/json/`
   - Blog article: `https://piush.com/blog/sqlite-vs-realm-vs-mmkv-mobile-storage-benchmarks/`

### B. Bing Webmaster Tools & IndexNow
1. Import the verified domain directly from Google Search Console.
2. Submit `https://piush.com/sitemap-index.xml`.
3. Verify that Bingbot crawls with the permissions declared in [`public/robots.txt`](file:///Users/mac/Documents/piush.com/public/robots.txt).

---

## 3. Privacy-First Analytics Configuration (Umami)

Analytics are handled by Umami Cloud without cookies, GDPR banners, or personal data collection.

### Domain Filtering
To prevent test runs and local preview servers from skewing data or logging 400 errors, the script tag in [`src/components/BaseHead.astro`](file:///Users/mac/Documents/piush.com/src/components/BaseHead.astro) restricts execution:
```html
<script
  is:inline
  defer
  src="https://cloud.umami.is/script.js"
  data-website-id="a20b757f-1391-4280-908f-a846b9734e76"
  data-domains="piush.com,www.piush.com"
></script>
```

### Conversion Event Taxonomy
Track high-value user actions via data attributes:
- `data-umami-event="view_portfolio"`: Clicks on hero "View Portfolio" CTA.
- `data-umami-event="open_tool"`: Clicks on tool cards from `/tools/` or homepage.
- `data-umami-event="copy_code"`: Code copy button interactions inside playground or blog posts.
- `data-umami-event="contact_click"`: Email link interactions in footer.

---

## 4. Routine Maintenance & Anomaly Troubleshooting

If organic traffic or search impressions experience sudden declines:
1. **Server Health**: Run `curl -I https://piush.com/` to verify HTTP 200 and fast TTFB (<100ms).
2. **Robots Accessibility**: Confirm `https://piush.com/robots.txt` returns the correct agent policies without disallowing root.
3. **Internal Consistency**: Run `npm run validate:seo` to detect any broken internal links or canonical discrepancies.
4. **Google Search Console**: Check the Security & Manual Actions tab for penalties, and inspect the Page Indexing report for excluded pages.

