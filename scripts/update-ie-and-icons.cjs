const fs = require('fs');
const path = require('path');

console.log('Step 1: Enhancing Internet Explorer for seamless website loading and frame security handling...');
const iePath = path.join(__dirname, '..', 'src', 'lib', 'win95', 'apps', 'internetExplorer.ts');
let ieContent = fs.readFileSync(iePath, 'utf8');

// 1. Add FRAME_BLOCKED_DOMAINS and helper function
const blockedDomainsCode = `
const FRAME_BLOCKED_DOMAINS = [
  'google.com',
  'google.co',
  'youtube.com',
  'youtu.be',
  'github.com',
  'twitter.com',
  'x.com',
  'facebook.com',
  'instagram.com',
  'reddit.com',
  'linkedin.com',
  'amazon.com',
  'apple.com',
  'microsoft.com',
  'netflix.com',
  'yahoo.com',
  'bing.com',
  'duckduckgo.com',
  'twitch.tv',
  'spotify.com',
  'discord.com',
  'medium.com',
  'quora.com',
  'pinterest.com',
  'tiktok.com',
  'nytimes.com',
  'cnn.com',
  'bbc.com',
  'bbc.co.uk',
  'paypal.com',
  'ebay.com',
  'stackoverflow.com',
  'gitlab.com',
  'cloudflare.com',
];

function isBlockedByFrameSecurity(url: string): boolean {
  try {
    const parsed = new URL(url.startsWith('http') ? url : \`https://\${url}\`);
    const host = parsed.hostname.toLowerCase();
    return FRAME_BLOCKED_DOMAINS.some(
      (d) => host === d || host.endsWith('.' + d)
    );
  } catch (_) {
    return false;
  }
}
`;

// Insert FRAME_BLOCKED_DOMAINS before parseTargetUrl if not already present
if (!ieContent.includes('FRAME_BLOCKED_DOMAINS')) {
  ieContent = ieContent.replace(
    '// URL Target Parsing & Resolution',
    `${blockedDomainsCode}\n  // URL Target Parsing & Resolution`
  );
}

// 2. Ensure homePage always defaults cleanly to https://piush.com/ and purges stale google.com
const oldHomeBlock = `  // Default home page is always piush.com
  let homePage = 'https://piush.com/';
  try {
    const savedHome = localStorage.getItem(STORAGE_HOMEPAGE);
    if (savedHome) homePage = savedHome;
  } catch (_) {}`;

const newHomeBlock = `  // Default home page is always piush.com
  let homePage = 'https://piush.com/';
  try {
    const savedHome = localStorage.getItem(STORAGE_HOMEPAGE);
    if (savedHome && savedHome !== 'about:blank' && !savedHome.includes('google.com')) {
      homePage = savedHome;
    } else {
      localStorage.setItem(STORAGE_HOMEPAGE, 'https://piush.com/');
    }
  } catch (_) {}`;

ieContent = ieContent.replace(oldHomeBlock, newHomeBlock);

// 3. Update parseTargetUrl to intercept frame-blocked sites
const oldExternalBlock = `    // 3. Any external web site (Wikipedia, Hacker News, Google, Example, etc.)
    let fullUrl = raw;
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = 'https://' + fullUrl;
    }

    return {
      displayUrl: fullUrl,
      isRetro: false,
      iframeSrc: fullUrl,
      isExternal: true,
    };`;

const newExternalBlock = `    // 3. Any external web site (Wikipedia, Hacker News, Google, Example, etc.)
    let fullUrl = raw;
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = 'https://' + fullUrl;
    }

    // Check if the target site blocks iframe embedding
    const isFrameBlocked = isBlockedByFrameSecurity(fullUrl);
    if (isFrameBlocked) {
      return {
        displayUrl: fullUrl,
        isRetro: true,
        retroKey: \`security:\${fullUrl}\`,
        isExternal: true,
      };
    }

    return {
      displayUrl: fullUrl,
      isRetro: false,
      iframeSrc: fullUrl,
      isExternal: true,
    };`;

ieContent = ieContent.replace(oldExternalBlock, newExternalBlock);

// 4. In getRetroPageContent, handle security: URLs
const securityPageHandler = `
    // Security Advisory Gateway for Frame-Restricted Sites
    if (cleanUrl.startsWith('security:')) {
      const targetUrl = url.replace(/^security:/i, '').trim();
      let hostname = targetUrl;
      try {
        hostname = new URL(targetUrl).hostname;
      } catch (_) {}

      return {
        title: \`Security Advisory - \${hostname}\`,
        html: \`
          <div class="space-y-4 font-serif text-black leading-relaxed p-4 max-w-xl mx-auto select-text">
            <div class="flex items-center gap-3 border-b-2 border-[#000080] pb-2">
              <span class="text-3xl select-none">🛡️</span>
              <div>
                <h2 class="text-base font-bold text-[#000080] font-sans">Internet Explorer Security Advisory</h2>
                <p class="text-xs text-gray-600 font-mono">\${targetUrl}</p>
              </div>
            </div>

            <div class="border-2 border-[#808080] bg-[#ffffea] p-3 text-xs space-y-2 shadow-[inset_1px_1px_0px_#ffffff]">
              <p>
                The destination website (<strong>\${hostname}</strong>) restricts embedding inside desktop application windows using modern browser frame security policies (<code>X-Frame-Options: SAMEORIGIN</code> / <code>CSP frame-ancestors</code>).
              </p>
              <p class="text-gray-700">
                To view this website without browser security blocks, please choose how you would like to proceed:
              </p>
            </div>

            <div class="space-y-2.5 pt-1">
              <div class="p-3 border-2 border-[#808080] bg-white flex items-center justify-between gap-3 shadow-[1px_1px_0px_#000000]">
                <div class="text-xs">
                  <div class="font-bold text-blue-900 font-sans">📖 Vintage Reader Mode (Recommended)</div>
                  <div class="text-gray-600 text-[11px] font-sans">Renders live text and articles from \${hostname} directly inside Internet Explorer.</div>
                </div>
                <button type="button" class="ie-action-reader retro-btn !py-1 !px-3 text-xs font-bold shrink-0 font-sans" data-url="\${targetUrl}">
                  Read Now
                </button>
              </div>

              <div class="p-3 border-2 border-[#808080] bg-white flex items-center justify-between gap-3 shadow-[1px_1px_0px_#000000]">
                <div class="text-xs">
                  <div class="font-bold text-blue-900 font-sans">↗ Open in New Browser Tab</div>
                  <div class="text-gray-600 text-[11px] font-sans">Launches \${hostname} in a full external browser tab with complete interactivity.</div>
                </div>
                <button type="button" class="ie-action-newtab retro-btn !py-1 !px-3 text-xs font-bold shrink-0 font-sans" data-url="\${targetUrl}">
                  Open Tab ↗
                </button>
              </div>

              <div class="p-2.5 border border-gray-300 bg-gray-50 flex items-center justify-between gap-3">
                <div class="text-xs">
                  <div class="font-bold text-gray-700 font-sans">🌐 Attempt Direct Frame Embed</div>
                  <div class="text-gray-500 text-[11px] font-sans">Try loading in raw iframe (may show browser security error).</div>
                </div>
                <button type="button" class="ie-action-embed retro-btn !py-0.5 !px-2.5 text-xs shrink-0 font-sans" data-url="\${targetUrl}">
                  Try Embed
                </button>
              </div>
            </div>

            <div class="pt-3 text-center text-[11px] text-gray-500 font-mono border-t border-gray-300">
              <a href="#" class="ie-link text-blue-800 underline" data-url="https://piush.com/">Return to Piush KS Portfolio (Default Home)</a>
            </div>
          </div>
        \`,
      };
    }
`;

if (!ieContent.includes("cleanUrl.startsWith('security:')")) {
  ieContent = ieContent.replace(
    '// Retro 1998 Google Search Engine',
    `${securityPageHandler}\n    // Retro 1998 Google Search Engine`
  );
}

// 5. Wire security page actions in wireRetroPageInteractions
const wireSecurityActions = `
    // Security Advisory Action Wiring
    pageContainer.querySelectorAll('.ie-action-reader').forEach((btn) => {
      btn.addEventListener('click', () => {
        const dest = (btn as HTMLElement).getAttribute('data-url');
        if (dest) openReaderMode(dest);
      });
    });

    pageContainer.querySelectorAll('.ie-action-newtab').forEach((btn) => {
      btn.addEventListener('click', () => {
        const dest = (btn as HTMLElement).getAttribute('data-url');
        if (dest) openExternal(dest);
      });
    });

    pageContainer.querySelectorAll('.ie-action-embed').forEach((btn) => {
      btn.addEventListener('click', () => {
        const dest = (btn as HTMLElement).getAttribute('data-url');
        if (dest) {
          if (pageContainer) pageContainer.classList.add('hidden');
          if (webIframe) {
            webIframe.classList.remove('hidden');
            webIframe.src = dest;
          }
          if (infoBar) infoBar.classList.remove('hidden');
          win.setTitle(\`The Microsoft Internet Explorer - \${dest}\`);
        }
      });
    });
`;

if (!ieContent.includes('pageContainer.querySelectorAll(\'.ie-action-reader\')')) {
  ieContent = ieContent.replace(
    'const wireRetroPageInteractions = () => {',
    `const wireRetroPageInteractions = () => {\n${wireSecurityActions}`
  );
}

fs.writeFileSync(iePath, ieContent, 'utf8');
console.log('Internet Explorer updated successfully!');

// Step 2: Update Win95Desktop.astro icon sizing & cache buster
console.log('Step 2: Updating desktop icons to true 32x32 size and cache busting ?v=1995...');
const deskPath = path.join(__dirname, '..', 'src', 'components', 'sections', 'Win95Desktop.astro');
let deskContent = fs.readFileSync(deskPath, 'utf8');

// Replace width="36" height="36" class="size-9 shrink-0 [image-rendering:pixelated] drop-shadow-[1px_1px_0px_#000000]"
// with width="32" height="32" class="size-8 shrink-0 [image-rendering:pixelated]"
deskContent = deskContent.replace(
  /width="36"\s+height="36"\s+class="size-9 shrink-0 \[image-rendering:pixelated\] drop-shadow-\[1px_1px_0px_#000000\]"/g,
  'width="32"\n          height="32"\n          class="size-8 shrink-0 [image-rendering:pixelated]"'
);

// Replace ?v=95 with ?v=1995 across all files
deskContent = deskContent.replace(/\?v=95/g, '?v=1995');
fs.writeFileSync(deskPath, deskContent, 'utf8');
console.log('Win95Desktop.astro updated!');

// Step 3: Update Header.astro
console.log('Step 3: Updating Header.astro titlebar icon and ?v=1995...');
const headerPath = path.join(__dirname, '..', 'src', 'components', 'sections', 'Header.astro');
let headerContent = fs.readFileSync(headerPath, 'utf8');

// Replace line 50 generic monitor SVG with authentic computer-16.png
const oldSvgMonitor = `<svg class="size-4 shrink-0 text-white fill-current" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h11A1.5 1.5 0 0 1 15 2.5v8a1.5 1.5 0 0 1-1.5 1.5h-3.75l.75 2h1.5a.5.5 0 0 1 0 1h-8a.5.5 0 0 1 0-1h1.5l.75-2H2.5A1.5 1.5 0 0 1 1 10.5v-8ZM2.5 2a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-11Z"/>
        </svg>`;

const newImgMonitor = `<img
          src="/images/win95-icons/computer-16.png?v=1995"
          alt="PC"
          width="16"
          height="16"
          class="size-4 shrink-0 [image-rendering:pixelated]"
        />`;

if (headerContent.includes(oldSvgMonitor)) {
  headerContent = headerContent.replace(oldSvgMonitor, newImgMonitor);
}

headerContent = headerContent.replace(/\?v=95/g, '?v=1995');
fs.writeFileSync(headerPath, headerContent, 'utf8');
console.log('Header.astro updated!');

// Step 4: Update Footer.astro, accessories.ts, multimedia.ts
['Footer.astro', '../lib/win95/apps/accessories.ts', '../lib/win95/apps/multimedia.ts'].forEach(rel => {
  const p = path.resolve(__dirname, '..', 'src', 'components', 'sections', rel);
  if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    c = c.replace(/\?v=95/g, '?v=1995');
    fs.writeFileSync(p, c, 'utf8');
    console.log(`Updated ?v=1995 in ${rel}`);
  }
});

console.log('All updates applied successfully!');
