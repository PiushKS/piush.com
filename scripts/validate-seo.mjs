import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');

if (!fs.existsSync(DIST_DIR)) {
  console.error('❌ dist/ directory not found. Run `npm run build` first.');
  process.exit(1);
}

console.log('🔍 Running automated SEO, Link & Structured Data validation on dist/...\n');

let errors = 0;
let warnings = 0;
let checkedPages = 0;

function getAllFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

const allDistFiles = getAllFiles(DIST_DIR);
const htmlFiles = allDistFiles.filter(f => f.endsWith('.html'));

// Set of all valid paths in dist
const validRoutes = new Set();
for (const file of allDistFiles) {
  const rel = path.relative(DIST_DIR, file);
  let route = '/' + rel.replace(/\/index\.html$/, '').replace(/\.html$/, '');
  if (route === '/index') route = '/';
  validRoutes.add(route);
  if (!route.endsWith('/')) validRoutes.add(route + '/');
  validRoutes.add('/' + rel);
}

const titlesSeen = new Map();
const descriptionsSeen = new Map();

for (const filePath of htmlFiles) {
  const rel = path.relative(DIST_DIR, filePath);
  let route = '/' + rel.replace(/\/index\.html$/, '').replace(/\.html$/, '');
  if (route === '/index') route = '/';

  const html = fs.readFileSync(filePath, 'utf8');
  checkedPages++;

  const isDemo = route.startsWith('/demo');
  const is404 = route === '/404';
  const isRedirect = html.includes('http-equiv="refresh"');

  if (isRedirect) {
    continue;
  }

  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const headHtml = headMatch ? headMatch[1] : html;

  // 1. Check title
  const titleMatch = headHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    console.error(`❌ [${route}] Missing <title> tag in <head>`);
    errors++;
  } else {
    const title = titleMatch[1].trim();
    if (title.includes('—')) {
      console.error(`❌ [${route}] Title contains prohibited em-dash '—': "${title}"`);
      errors++;
    }
    if (!isDemo && !is404 && titlesSeen.has(title)) {
      console.warn(`⚠️ [${route}] Duplicate title with [${titlesSeen.get(title)}]: "${title}"`);
      warnings++;
    } else {
      titlesSeen.set(title, route);
    }
  }

  // 2. Check meta description
  const descMatch = headHtml.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                    headHtml.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  if (!descMatch || !descMatch[1].trim()) {
    if (!isDemo) {
      console.error(`❌ [${route}] Missing meta description`);
      errors++;
    }
  } else {
    const desc = descMatch[1].trim();
    if (desc.includes('—')) {
      console.error(`❌ [${route}] Description contains prohibited em-dash '—'`);
      errors++;
    }
    if (!isDemo && !is404 && descriptionsSeen.has(desc)) {
      console.warn(`⚠️ [${route}] Duplicate description with [${descriptionsSeen.get(desc)}]`);
      warnings++;
    } else {
      descriptionsSeen.set(desc, route);
    }
  }

  // 3. Check Canonical
  const canonicalMatch = headHtml.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i) ||
                         headHtml.match(/<link\s+href=["']([^"']*)["']\s+rel=["']canonical["']/i);
  if (!canonicalMatch && !is404 && !isDemo) {
    console.error(`❌ [${route}] Missing canonical URL`);
    errors++;
  }

  // 4. Check H1 tag
  if (!is404 && !isDemo) {
    const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
    if (!h1Matches || h1Matches.length === 0) {
      console.warn(`⚠️ [${route}] Missing <h1> tag`);
      warnings++;
    } else if (h1Matches.length > 1) {
      console.warn(`⚠️ [${route}] Multiple <h1> tags found (${h1Matches.length})`);
      warnings++;
    }
  }

  // 5. Check Open Graph tags
  const ogTitle = headHtml.match(/<meta\s+property=["']og:title["']/i);
  const ogDesc = headHtml.match(/<meta\s+property=["']og:description["']/i);
  const ogImage = headHtml.match(/<meta\s+property=["']og:image["']/i);
  if (!ogTitle || !ogDesc || !ogImage) {
    if (!isDemo && !is404) {
      console.warn(`⚠️ [${route}] Incomplete Open Graph metadata`);
      warnings++;
    }
  }

  // 6. Check JSON-LD Structured Data
  const jsonLdMatches = html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const match of jsonLdMatches) {
    try {
      JSON.parse(match[1]);
    } catch (e) {
      console.error(`❌ [${route}] Invalid JSON-LD structured data: ${e.message}`);
      errors++;
    }
  }

  // 7. Check Internal Links
  const linkMatches = html.matchAll(/<a\s+[^>]*href=["']([^"'#?]+)["'][^>]*>/gi);
  for (const match of linkMatches) {
    const href = match[1];
    if (href.startsWith('/') && !href.startsWith('//')) {
      const cleanHref = href.split('?')[0].split('#')[0];
      if (!validRoutes.has(cleanHref) && !validRoutes.has(cleanHref.replace(/\/$/, ''))) {
        if (!cleanHref.startsWith('/_astro/') && !cleanHref.startsWith('/assets/')) {
          console.error(`❌ [${route}] Broken internal link: href="${href}" does not exist`);
          errors++;
        }
      }
    }
  }
}

// 8. Validate sitemap
const sitemapPath = path.join(DIST_DIR, 'sitemap-index.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('❌ dist/sitemap-index.xml does not exist');
  errors++;
} else {
  const sitemapIndex = fs.readFileSync(sitemapPath, 'utf8');
  console.log('✓ sitemap-index.xml exists and is valid XML');
  
  const subSitemapMatch = sitemapIndex.match(/<loc>(https:\/\/piush\.com\/sitemap-[^<]+)<\/loc>/);
  if (subSitemapMatch) {
    const subSitemapFile = path.join(DIST_DIR, path.basename(subSitemapMatch[1]));
    if (fs.existsSync(subSitemapFile)) {
      const subSitemap = fs.readFileSync(subSitemapFile, 'utf8');
      if (subSitemap.includes('/demo') || subSitemap.includes('/404')) {
        console.error('❌ Sitemap contains excluded pages (/demo or /404)');
        errors++;
      } else {
        console.log('✓ sitemap-0.xml correctly excludes private/demo/404 routes');
      }
    }
  }
}

// 9. Validate robots.txt
const robotsPath = path.join(DIST_DIR, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  console.error('❌ dist/robots.txt does not exist');
  errors++;
} else {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (!robots.includes('Sitemap: https://piush.com/sitemap-index.xml')) {
    console.error('❌ robots.txt does not point to canonical sitemap-index.xml');
    errors++;
  } else {
    console.log('✓ robots.txt correctly references canonical sitemap-index.xml');
  }
}

console.log(`\n========================================`);
console.log(`Audited ${checkedPages} HTML pages in dist/`);
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}`);
console.log(`========================================\n`);

if (errors > 0) {
  console.error('💥 SEO validation failed! Fix errors above.');
  process.exit(1);
} else {
  console.log('🎉 All SEO, Link, and Structured Data checks passed successfully!');
  process.exit(0);
}
