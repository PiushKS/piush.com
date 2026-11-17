// Piush 95 - The Microsoft Internet Explorer (v3.02 / v4.0) Authentic Simulation
// Full live browser engine capable of opening ANY website with piush.com as default,
// plus vintage 1995-1998 cyberspace portal, favorites manager, history stack,
// view source, find in page, internet options, and external window launcher.

import { audio } from '../audio';
import { vfs } from '../fs';
import type { Win95Window } from '../windowManager';

interface Bookmark {
  title: string;
  url: string;
  category?: string;
  dateAdded: number;
}

interface GuestbookEntry {
  name: string;
  location: string;
  message: string;
  date: string;
}

const DEFAULT_BOOKMARKS: Bookmark[] = [
  { title: 'Google! Search Engine (1998)', url: 'https://google.com/', category: 'Search Engines', dateAdded: 0 },
  { title: 'Piush KS - Official Portfolio (Default)', url: 'https://piush.com/', category: 'Piush Network', dateAdded: 1 },
  { title: 'Engineering Projects Portfolio', url: 'https://piush.com/work/', category: 'Piush Network', dateAdded: 2 },
  { title: 'Technical Articles & Blog', url: 'https://piush.com/blog/', category: 'Piush Network', dateAdded: 3 },
  { title: '550-Question Full-Stack Quiz', url: 'https://piush.com/quiz/', category: 'Piush Network', dateAdded: 4 },
  { title: 'Wikipedia - The Free Encyclopedia', url: 'https://en.wikipedia.org/wiki/Main_Page', category: 'Live Web', dateAdded: 5 },
  { title: 'Hacker News (Y Combinator)', url: 'https://news.ycombinator.com/', category: 'Live Web', dateAdded: 6 },
  { title: 'Example Domain (IANA)', url: 'https://example.com/', category: 'Live Web', dateAdded: 7 },
  { title: 'Yahoo! Search & Directory (1995)', url: 'retro:yahoo', category: '1995 Retro Web', dateAdded: 8 },
  { title: 'AltaVista Web Search (1995)', url: 'retro:altavista', category: '1995 Retro Web', dateAdded: 9 },
  { title: 'GeoCities Neighborhoods (1996)', url: 'retro:geocities', category: '1995 Retro Web', dateAdded: 10 },
  { title: 'Space Jam Official (1996)', url: 'retro:spacejam', category: '1995 Retro Web', dateAdded: 11 },
  { title: 'Microsoft Corporation (1995)', url: 'retro:microsoft', category: '1995 Retro Web', dateAdded: 12 },
  { title: 'CNN Interactive (1995)', url: 'retro:cnn', category: '1995 Retro Web', dateAdded: 13 },
  { title: 'Cyber Guestbook (1995)', url: 'retro:guestbook', category: '1995 Retro Web', dateAdded: 14 },
  { title: 'Developer Cyber Tools (1995)', url: 'retro:tools', category: '1995 Retro Web', dateAdded: 15 },
];

export function renderInternetExplorer(container: HTMLElement, win: Win95Window) {
  // Persistence keys
  const STORAGE_HOMEPAGE = 'win95_ie_homepage_v3';
  const STORAGE_BOOKMARKS = 'win95_ie_favorites_v3';
  const STORAGE_GUESTBOOK = 'win95_ie_guestbook_entries';
  const STORAGE_FONT_SIZE = 'win95_ie_fontsize';

  // Default home page is always piush.com
  let homePage = 'https://piush.com/';
  try {
    const savedHome = localStorage.getItem(STORAGE_HOMEPAGE);
    if (savedHome && savedHome !== 'about:blank' && !savedHome.includes('google.com')) {
      homePage = savedHome;
    } else {
      localStorage.setItem(STORAGE_HOMEPAGE, 'https://piush.com/');
    }
  } catch (_) {}

  let fontScale: 'small' | 'medium' | 'large' = 'medium';
  try {
    const savedFont = localStorage.getItem(STORAGE_FONT_SIZE) as 'small' | 'medium' | 'large';
    if (savedFont && ['small', 'medium', 'large'].includes(savedFont)) {
      fontScale = savedFont;
    }
  } catch (_) {}

  let favorites: Bookmark[] = [...DEFAULT_BOOKMARKS];
  try {
    const savedFaves = localStorage.getItem(STORAGE_BOOKMARKS);
    if (savedFaves) {
      const parsed = JSON.parse(savedFaves);
      if (Array.isArray(parsed) && parsed.length > 0) {
        favorites = parsed;
      }
    }
  } catch (_) {}

  const saveFavorites = () => {
    try {
      localStorage.setItem(STORAGE_BOOKMARKS, JSON.stringify(favorites));
    } catch (_) {}
  };

  let guestbookEntries: GuestbookEntry[] = [
    {
      name: 'Ada Lovelace Fan',
      location: 'London, UK',
      message: 'Magnificent cyber-homestead! Truly capturing the pioneering spirit of the World Wide Web.',
      date: 'Aug 24, 1995',
    },
    {
      name: 'SiliconValley_Surfer',
      location: 'Mountain View, CA',
      message: 'Greetings from the Valley! Your mobile architecture deep dives are required reading here.',
      date: 'Sep 12, 1995',
    },
    {
      name: 'Netscape_Navigator_Fan',
      location: 'Urbana-Champaign, IL',
      message: 'Running this on a 486 DX4-100 with 16MB RAM. 60 FPS animations look buttery smooth!',
      date: 'Oct 03, 1995',
    },
  ];

  try {
    const savedGB = localStorage.getItem(STORAGE_GUESTBOOK);
    if (savedGB) {
      const parsed = JSON.parse(savedGB);
      if (Array.isArray(parsed) && parsed.length > 0) {
        guestbookEntries = parsed;
      }
    }
  } catch (_) {}

  const saveGuestbook = () => {
    try {
      localStorage.setItem(STORAGE_GUESTBOOK, JSON.stringify(guestbookEntries));
    } catch (_) {}
  };

  // Browser Navigation History
  let currentUrl = homePage;
  const historyStack: string[] = [currentUrl];
  let historyIndex = 0;
  let isLoading = false;
  let activeFindTerm = '';

  
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
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    const host = parsed.hostname.toLowerCase();
    return FRAME_BLOCKED_DOMAINS.some(
      (d) => host === d || host.endsWith('.' + d)
    );
  } catch (_) {
    return false;
  }
}

  // URL Target Parsing & Resolution
  function parseTargetUrl(input: string): {
    displayUrl: string;
    isRetro: boolean;
    retroKey?: string;
    iframeSrc?: string;
    isExternal: boolean;
  } {
    const raw = input.trim();
    if (!raw) {
      return {
        displayUrl: homePage,
        isRetro: false,
        iframeSrc: '/',
        isExternal: false,
      };
    }

    // 1. Retro Cyberspace Simulator protocol
    if (raw.startsWith('retro:')) {
      const key = raw.replace('retro:', '').toLowerCase();
      let retroUrl = 'http://piush.com/';
      if (key.includes('yahoo')) retroUrl = 'http://www.yahoo.com/';
      else if (key.includes('google')) retroUrl = 'https://www.google.com/';
      else if (key.includes('altavista')) retroUrl = 'http://www.altavista.com/';
      else if (key.includes('geocities')) retroUrl = 'http://www.geocities.com/';
      else if (key.includes('spacejam')) retroUrl = 'http://www.spacejam.com/';
      else if (key.includes('microsoft')) retroUrl = 'http://www.microsoft.com/';
      else if (key.includes('cnn')) retroUrl = 'http://www.cnn.com/';
      else if (key.includes('guestbook')) retroUrl = 'http://piush.com/guestbook/';
      else if (key.includes('tools')) retroUrl = 'http://piush.com/tools/';
      else if (key.includes('cyber') || key.includes('home')) retroUrl = 'http://piush.com/';

      return {
        displayUrl: raw,
        isRetro: true,
        retroKey: retroUrl,
        isExternal: false,
      };
    }

    const lower = raw.toLowerCase();

    // 2. Google Search Engine (1998 Retro Simulation & Live Search Engine)
    const isGoogleTarget =
      lower === 'google' ||
      lower === 'google.com' ||
      lower === 'www.google.com' ||
      lower === 'http://google.com' ||
      lower === 'https://google.com' ||
      lower === 'http://google.com/' ||
      lower === 'https://google.com/' ||
      lower === 'http://www.google.com' ||
      lower === 'https://www.google.com' ||
      lower === 'http://www.google.com/' ||
      lower === 'https://www.google.com/' ||
      lower.startsWith('http://google.') ||
      lower.startsWith('https://google.') ||
      lower.startsWith('http://www.google.') ||
      lower.startsWith('https://www.google.') ||
      lower.includes('google.com/search') ||
      lower.includes('google.co');

    if (isGoogleTarget) {
      let displayUrl = raw;
      if (!displayUrl.startsWith('http://') && !displayUrl.startsWith('https://')) {
        displayUrl = 'https://' + displayUrl;
      }
      return {
        displayUrl,
        isRetro: true,
        retroKey: raw,
        isExternal: false,
      };
    }

    // 3. Search queries entered directly into the Address Bar (e.g. "windows 95 games" or "? query")
    const isSearchQuery =
      raw.startsWith('? ') ||
      raw.startsWith('?') ||
      (!raw.includes('.') && !raw.includes('/') && !raw.includes(':'));

    if (isSearchQuery) {
      const q = raw.replace(/^\?\s*/, '').trim();
      const displayUrl = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
      return {
        displayUrl,
        isRetro: true,
        retroKey: displayUrl,
        isExternal: false,
      };
    }

    // 2. Check if the URL refers to piush.com or local routes
    const isLocalOrPiush =
      lower === '/' ||
      lower.startsWith('/work') ||
      lower.startsWith('/blog') ||
      lower.startsWith('/quiz') ||
      lower.startsWith('/tools') ||
      lower.startsWith('/about') ||
      lower.includes('piush.com') ||
      lower.includes('localhost:') ||
      lower === 'piush.com' ||
      lower === 'http://piush.com' ||
      lower === 'https://piush.com';

    if (isLocalOrPiush) {
      let path = '/';
      if (raw.startsWith('/')) {
        path = raw;
      } else {
        try {
          const parsed = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
          path = parsed.pathname || '/';
          if (parsed.search) path += parsed.search;
        } catch (_) {
          path = '/';
        }
      }
      if (!path.startsWith('/')) path = '/' + path;

      return {
        displayUrl: `https://piush.com${path === '/' ? '/' : path}`,
        isRetro: false,
        iframeSrc: path,
        isExternal: false,
      };
    }

    // 3. Any external web site (Wikipedia, Hacker News, GitHub, etc.)
    let fullUrl = raw;
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = 'https://' + fullUrl;
    }

    // Route all external web destinations through the seamless Live Web Reader
    // to prevent browser frame security blocks (X-Frame-Options / CSP frame-ancestors)
    return {
      displayUrl: fullUrl,
      isRetro: true,
      retroKey: `live:${fullUrl}`,
      isExternal: true,
    };
  }

  // Retro Simulated Web Database
  function getRetroPageContent(url: string): { title: string; html: string } {
    const cleanUrl = url.trim().toLowerCase();

    
    // Security Advisory Gateway for Frame-Restricted Sites
    if (cleanUrl.startsWith('security:')) {
      const targetUrl = url.replace(/^security:/i, '').trim();
      let hostname = targetUrl;
      try {
        hostname = new URL(targetUrl).hostname;
      } catch (_) {}

      return {
        title: `Security Advisory - ${hostname}`,
        html: `
          <div class="space-y-4 font-serif text-black leading-relaxed p-4 max-w-xl mx-auto select-text">
            <div class="flex items-center gap-3 border-b-2 border-[#000080] pb-2">
              <span class="text-3xl select-none">🛡️</span>
              <div>
                <h2 class="text-base font-bold text-[#000080] font-sans">Internet Explorer Security Advisory</h2>
                <p class="text-xs text-gray-600 font-mono">${targetUrl}</p>
              </div>
            </div>

            <div class="border-2 border-[#808080] bg-[#ffffea] p-3 text-xs space-y-2 shadow-[inset_1px_1px_0px_#ffffff]">
              <p>
                The destination website (<strong>${hostname}</strong>) restricts embedding inside desktop application windows using modern browser frame security policies (<code>X-Frame-Options: SAMEORIGIN</code> / <code>CSP frame-ancestors</code>).
              </p>
              <p class="text-gray-700">
                To view this website without browser security blocks, please choose how you would like to proceed:
              </p>
            </div>

            <div class="space-y-2.5 pt-1">
              <div class="p-3 border-2 border-[#808080] bg-white flex items-center justify-between gap-3 shadow-[1px_1px_0px_#000000]">
                <div class="text-xs">
                  <div class="font-bold text-blue-900 font-sans">📖 Vintage Reader Mode (Recommended)</div>
                  <div class="text-gray-600 text-[11px] font-sans">Renders live text and articles from ${hostname} directly inside Internet Explorer.</div>
                </div>
                <button type="button" class="ie-action-reader retro-btn !py-1 !px-3 text-xs font-bold shrink-0 font-sans" data-url="${targetUrl}">
                  Read Now
                </button>
              </div>

              <div class="p-3 border-2 border-[#808080] bg-white flex items-center justify-between gap-3 shadow-[1px_1px_0px_#000000]">
                <div class="text-xs">
                  <div class="font-bold text-blue-900 font-sans">↗ Open in New Browser Tab</div>
                  <div class="text-gray-600 text-[11px] font-sans">Launches ${hostname} in a full external browser tab with complete interactivity.</div>
                </div>
                <button type="button" class="ie-action-newtab retro-btn !py-1 !px-3 text-xs font-bold shrink-0 font-sans" data-url="${targetUrl}">
                  Open Tab ↗
                </button>
              </div>

              <div class="p-2.5 border border-gray-300 bg-gray-50 flex items-center justify-between gap-3">
                <div class="text-xs">
                  <div class="font-bold text-gray-700 font-sans">🌐 Attempt Direct Frame Embed</div>
                  <div class="text-gray-500 text-[11px] font-sans">Try loading in raw iframe (may show browser security error).</div>
                </div>
                <button type="button" class="ie-action-embed retro-btn !py-0.5 !px-2.5 text-xs shrink-0 font-sans" data-url="${targetUrl}">
                  Try Embed
                </button>
              </div>
            </div>

            <div class="pt-3 text-center text-[11px] text-gray-500 font-mono border-t border-gray-300">
              <a href="#" class="ie-link text-blue-800 underline" data-url="https://piush.com/">Return to Piush KS Portfolio (Default Home)</a>
            </div>
          </div>
        `,
      };
    }

    // Retro 1998 Google Search Engine
    if (cleanUrl.includes('google')) {
      const queryMatch = url.match(/[?&](?:q|p)=([^&]+)/i);
      const query = queryMatch ? decodeURIComponent(queryMatch[1]).replace(/\+/g, ' ') : '';

      if (query) {
        const results = searchWebDatabase(query);
        return {
          title: `Google Search: ${query}`,
          html: `
            <div class="space-y-3 font-sans text-black leading-relaxed max-w-4xl p-1 select-text">
              <!-- Google Search Header -->
              <div class="flex items-center gap-3 border-b border-gray-300 pb-2.5">
                <a href="#" class="ie-link select-none shrink-0" data-url="https://google.com/" title="Google Home">
                  <span class="text-2xl font-bold tracking-tighter font-serif">
                    <span style="color:#3366cc">G</span><span style="color:#cc0000">o</span><span style="color:#e6b800">o</span><span style="color:#3366cc">g</span><span style="color:#009933">l</span><span style="color:#cc0000">e</span><span style="color:#cc0000">!</span>
                  </span>
                </a>
                <div class="flex-1 flex items-center gap-2 max-w-xl">
                  <input type="text" id="google-query-box" value="${query.replace(/"/g, '&quot;')}" class="retro-inset flex-1 px-2.5 py-1 text-xs font-sans bg-white border border-[#808080]" />
                  <button type="button" id="google-search-btn" class="retro-btn !py-1 !px-3 text-xs font-bold shrink-0">Google Search</button>
                </div>
                <div class="ml-auto text-[11px] text-gray-500 font-mono hidden sm:block">
                  1998 Search Engine
                </div>
              </div>

              <!-- Search Stats Bar -->
              <div class="text-[11px] text-gray-600 font-mono pb-1 border-b border-gray-100 flex justify-between">
                <span>Showing 1 - 10 results for <strong>${query.replace(/</g, '&lt;')}</strong> (0.05 seconds)</span>
                <span class="text-green-800">Search Engine: Active</span>
              </div>

              <!-- Results List Container -->
              <div class="space-y-4 pt-1" id="google-results-list">
                ${
                  results.length === 0
                    ? `<div class="p-4 border border-dashed border-[#808080] text-center text-xs text-gray-600 space-y-1">
                        <div>No exact local directory matches for <strong>${query.replace(/</g, '&lt;')}</strong>.</div>
                        <div class="text-gray-500">Querying live online encyclopedia database...</div>
                       </div>`
                    : results
                        .map(
                          (res) => `
                            <div class="border-b border-gray-100 pb-2.5 text-xs space-y-0.5">
                              <div><a href="#" class="ie-link text-blue-800 underline font-bold text-sm hover:text-blue-600" data-url="${res.url}">${res.title}</a></div>
                              <div class="text-gray-800 leading-normal">${res.snippet}</div>
                              <div class="text-[11px] text-green-800 font-mono flex items-center gap-2">
                                <span>${res.url}</span>
                                <span class="text-gray-400">-</span>
                                <span class="text-gray-500 text-[10px] cursor-pointer hover:underline">[Cached]</span>
                              </div>
                            </div>
                          `
                        )
                        .join('')
                }
              </div>

              <!-- Search Bottom Bar -->
              <div class="border-t border-gray-300 pt-3 mt-4 text-center">
                <div class="inline-flex items-center gap-2 max-w-md mx-auto">
                  <span class="text-xs font-serif font-bold">Search again:</span>
                  <input type="text" id="google-query-bottom" value="${query.replace(/"/g, '&quot;')}" class="retro-inset px-2.5 py-0.5 text-xs font-sans bg-white border border-[#808080]" />
                  <button type="button" id="google-search-bottom-btn" class="retro-btn !py-0.5 !px-3 text-xs font-bold">Search</button>
                </div>
              </div>
            </div>
          `,
        };
      }

      return {
        title: 'Google!',
        html: `
          <div class="min-h-full flex flex-col items-center justify-between text-black font-sans p-4 select-text">
            <div class="w-full max-w-xl text-center space-y-4 pt-4 sm:pt-6">
              <!-- 1998 Google! Serif Logo -->
              <div class="select-none py-2">
                <span class="text-6xl sm:text-7xl font-extrabold tracking-tight font-serif drop-shadow-sm inline-block">
                  <span style="color:#3366cc">G</span><span style="color:#cc0000">o</span><span style="color:#e6b800">o</span><span style="color:#3366cc">g</span><span style="color:#009933">l</span><span style="color:#cc0000">e</span><span style="color:#cc0000">!</span>
                </span>
              </div>

              <!-- Search Box Card -->
              <div class="bg-[#e8ecef] border-2 border-[#808080] p-4 text-center space-y-3 shadow-[inset_1px_1px_0px_#ffffff,2px_2px_0px_#000000]">
                <div class="text-xs font-serif font-bold text-gray-800">
                  Search the web using Google!
                </div>
                <div class="flex justify-center max-w-md mx-auto">
                  <input type="text" id="google-query-box" placeholder="Type a search query or web address..." autofocus class="retro-inset w-full px-3 py-1.5 bg-white text-xs font-sans text-black border border-[#808080]" />
                </div>
                <div class="flex items-center justify-center gap-2 pt-1">
                  <button type="button" id="google-search-btn" class="retro-btn !py-1 !px-4 text-xs font-bold font-sans">Google Search</button>
                  <button type="button" id="google-lucky-btn" class="retro-btn !py-1 !px-4 text-xs font-bold font-sans">I'm feeling lucky</button>
                </div>
                <div class="text-[11px] text-gray-600 font-mono pt-1">
                  <span>Results per page: </span>
                  <label class="inline-flex items-center gap-1 cursor-pointer"><input type="radio" name="google-num" value="10" checked /> 10</label>
                  <label class="inline-flex items-center gap-1 ml-2 cursor-pointer"><input type="radio" name="google-num" value="20" /> 20</label>
                  <label class="inline-flex items-center gap-1 ml-2 cursor-pointer"><input type="radio" name="google-num" value="30" /> 30</label>
                </div>
              </div>

              <!-- Quick Navigation Links -->
              <div class="border border-[#c0c0c0] bg-[#fafafa] p-3 text-xs space-y-2 text-left shadow-sm">
                <div class="font-bold text-gray-800 border-b border-gray-200 pb-1 flex justify-between">
                  <span>Special Searches & Featured Destinations:</span>
                  <span class="text-[10px] text-gray-500 font-mono">1998 Web</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div>👉 <a href="#" class="ie-link text-blue-800 underline font-bold" data-url="https://piush.com/">Piush KS Portfolio (Default)</a></div>
                  <div>👉 <a href="#" class="ie-link text-blue-800 underline font-bold" data-url="https://piush.com/work/">Engineering Work & Case Studies</a></div>
                  <div>👉 <a href="#" class="ie-link text-blue-800 underline font-bold" data-url="https://piush.com/quiz/">550-Question Developer Quiz</a></div>
                  <div>👉 <a href="#" class="ie-link text-blue-800 underline font-bold" data-url="https://piush.com/tools/">Interactive Developer Tools</a></div>
                  <div>👉 <a href="#" class="ie-retro-link text-blue-800 underline" data-url="retro:spacejam">Space Jam (1996 Official Site)</a></div>
                  <div>👉 <a href="#" class="ie-retro-link text-blue-800 underline" data-url="retro:yahoo">Yahoo! (1995 Web Directory)</a></div>
                </div>
              </div>

              <!-- Classic Footer -->
              <div class="pt-4 text-center text-[11px] text-gray-500 font-mono space-y-1">
                <div>
                  <a href="#" class="ie-link text-blue-700 underline" data-url="https://piush.com/about/">About Google / Piush KS</a> |
                  <a href="#" class="ie-retro-link text-blue-700 underline" data-url="retro:yahoo">Search Directory</a> |
                  <a href="#" class="ie-link text-blue-700 underline" data-url="https://en.wikipedia.org/wiki/Google">Google History</a>
                </div>
                <div>Copyright (C) 1998 Google Inc. (Windows 95 Cyberspace Simulation)</div>
              </div>
            </div>
          </div>
        `,
      };
    }

    // Retro 1995 Yahoo! Portal
    if (cleanUrl.includes('yahoo')) {
      const queryMatch = url.match(/[?&]p=([^&]+)/i);
      const query = queryMatch ? decodeURIComponent(queryMatch[1]).replace(/\+/g, ' ') : '';

      if (query) {
        const results = searchWebDatabase(query);
        return {
          title: `Yahoo! Search Results: ${query}`,
          html: `
            <div class="space-y-3 font-serif text-black leading-relaxed">
              <div class="flex items-center gap-2 border-b-2 border-red-700 pb-2">
                <span class="text-2xl font-bold tracking-tighter text-red-700 font-serif italic">YAHOO!</span>
                <span class="text-xs text-gray-600 font-mono">1995 Search Archive</span>
                <div class="ml-auto">
                  <a href="#" class="ie-retro-link text-xs font-mono text-blue-800 underline" data-url="retro:yahoo">[Yahoo! Main]</a>
                </div>
              </div>

              <div class="bg-[#f0f0f0] border border-[#808080] p-2 text-xs flex gap-2 items-center">
                <span class="font-bold">Search:</span>
                <input type="text" id="yahoo-query-box" value="${query}" class="retro-inset flex-1 px-2 py-0.5 bg-white text-xs font-mono" />
                <button id="yahoo-search-btn" class="retro-btn !py-0.5 !px-3 text-xs font-bold">Search</button>
              </div>

              <div class="text-xs font-mono text-gray-600">
                Found <strong>${results.length}</strong> matching web sites for <code>${query}</code>:
              </div>

              <div class="space-y-3 pt-1">
                ${
                  results.length === 0
                    ? `<div class="p-4 border border-dashed border-[#808080] text-center text-xs text-gray-600">No direct matches. Try keywords: mobile, portfolio, quiz, space.</div>`
                    : results
                        .map(
                          (res) => `
                            <div class="border-b border-gray-200 pb-2 text-xs space-y-0.5">
                              <div>👉 <a href="#" class="ie-link text-blue-800 underline font-bold text-sm" data-url="${res.url}">${res.title}</a></div>
                              <div class="text-gray-700">${res.snippet}</div>
                              <div class="text-[10px] text-green-800 font-mono">${res.url}</div>
                            </div>
                          `
                        )
                        .join('')
                }
              </div>
            </div>
          `,
        };
      }

      return {
        title: 'Yahoo! (1995 Web Directory)',
        html: `
          <div class="space-y-3 font-serif text-black leading-relaxed">
            <div class="text-center border-b-2 border-red-700 pb-2">
              <h1 class="text-3xl font-extrabold tracking-tighter text-red-700 font-serif italic">YAHOO!</h1>
              <p class="text-xs text-gray-600 font-mono">Guide to the World Wide Web (1995 Archive)</p>
            </div>
            <div class="bg-[#f0f0f0] border-2 border-[#808080] p-2 text-center space-y-1.5 shadow-[inset_1px_1px_0px_#ffffff]">
              <div class="flex justify-center items-center gap-2 max-w-md mx-auto">
                <input type="text" id="yahoo-query-box" placeholder="Search Yahoo!..." class="retro-inset flex-1 px-2 py-0.5 bg-white text-xs font-mono" />
                <button id="yahoo-search-btn" class="retro-btn !py-0.5 !px-3 text-xs font-bold">Search</button>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs pt-1">
              <div><a href="#" class="ie-retro-link font-bold text-blue-800 underline" data-url="retro:yahoo?p=computers">Computers & Internet</a></div>
              <div><a href="#" class="ie-retro-link font-bold text-blue-800 underline" data-url="retro:yahoo?p=entertainment">Entertainment</a></div>
              <div><a href="#" class="ie-retro-link font-bold text-blue-800 underline" data-url="retro:yahoo?p=business">Business & Economy</a></div>
              <div><a href="#" class="ie-retro-link font-bold text-blue-800 underline" data-url="retro:yahoo?p=science">Science & Technology</a></div>
            </div>
          </div>
        `,
      };
    }

    // Space Jam (1996 Official Site)
    if (cleanUrl.includes('spacejam')) {
      return {
        title: 'Space Jam - Official Warner Bros Site 1996',
        html: `
          <div class="space-y-4 font-serif text-white bg-black p-4 -m-4 min-h-full leading-relaxed select-text" style="background-color: #000000; color: #ffffff;">
            <div class="text-center space-y-1">
              <h1 class="text-3xl font-extrabold tracking-widest text-[#ffcc00] font-sans drop-shadow-[0_2px_4px_rgba(255,0,0,0.8)]">
                SPACE JAM
              </h1>
              <p class="text-xs text-[#00ffff] font-mono tracking-wider">
                WARNER BROS. PRESENTS THE OFFICIAL SITE (1996)
              </p>
            </div>
            <div class="border-2 border-[#000080] p-4 bg-[#0a0a20] rounded text-center space-y-3 shadow-[0_0_15px_rgba(0,100,255,0.5)]">
              <p class="text-xs text-yellow-300 font-mono">CLICK ON A PLANET TO EXPLORE:</p>
              <div class="flex flex-wrap justify-center gap-3 text-xs font-bold font-sans">
                <a href="#" class="ie-link px-3 py-1 bg-red-800 text-white rounded hover:bg-red-700 border border-yellow-400" data-url="https://piush.com/work/">
                  🏀 The Lineup
                </a>
                <a href="#" class="ie-link px-3 py-1 bg-blue-800 text-white rounded hover:bg-blue-700 border border-yellow-400" data-url="https://piush.com/">
                  ⭐ Jam Central
                </a>
                <a href="#" class="ie-link px-3 py-1 bg-purple-800 text-white rounded hover:bg-purple-700 border border-yellow-400" data-url="https://piush.com/quiz/">
                  🎁 Junior Jam
                </a>
              </div>
            </div>
            <div class="border border-gray-700 p-3 bg-gray-900 text-xs space-y-2">
              <div class="font-bold text-yellow-400 font-sans uppercase">Movie Transmission:</div>
              <p class="text-gray-300 text-[11px] leading-relaxed">
                Swackhammer, an evil alien theme park owner, is desperate for new attractions. He sends his tiny minions, the Nerdlucks, to capture Bugs Bunny and the Looney Tunes! But Bugs enlists the ultimate secret weapon: <strong>Michael Jordan!</strong>
              </p>
            </div>
          </div>
        `,
      };
    }

    // Default Fallback Retro Node
    return {
      title: 'Cyberspace 1995 Archive Node',
      html: `
        <div class="space-y-4 font-serif text-black leading-relaxed">
          <div class="border-b-2 border-[#000080] pb-2">
            <h1 class="text-lg font-bold text-[#000080]">Cyberspace Archive Node</h1>
            <p class="text-xs text-gray-600 font-mono">${url}</p>
          </div>
          <div class="border-2 border-[#808080] bg-[#ffffea] p-3 text-xs space-y-2">
            <p>Welcome to the retro cyberspace portal. You can browse live websites anytime by typing any web address into the address bar!</p>
            <div class="pt-2">
              <a href="#" class="ie-link retro-btn !py-1 !px-3 font-bold" data-url="https://piush.com/">👉 Visit Piush KS Portfolio (Default)</a>
            </div>
          </div>
        </div>
      `,
    };
  }

  function searchWebDatabase(q: string): Array<{ title: string; url: string; snippet: string }> {
    const term = q.toLowerCase().trim();
    const database = [
      {
        title: 'Google (1998 Search Engine)',
        url: 'https://google.com/',
        keywords: ['google', 'search', 'engine', 'web', 'internet', 'larry', 'sergey', 'stanford'],
        snippet: 'Search the web using Google! Featuring Stanford PageRank and 100% retro 1998 user interface.',
      },
      {
        title: 'Piush KS - Official Portfolio (Default)',
        url: 'https://piush.com/',
        keywords: ['piush', 'architect', 'mobile', 'cloud', 'cyber', 'home', 'engineer', 'lead'],
        snippet: 'Official headquarters of Piush KS. Senior Mobile & Cloud Architect scaling distributed systems to 10M+ users.',
      },
      {
        title: 'Engineering Projects Portfolio',
        url: 'https://piush.com/work/',
        keywords: ['portfolio', 'work', 'projects', 'kotlin', 'swift', 'dynamodb', 'offline', 'sync', 'fintech'],
        snippet: 'Comprehensive production case studies: global fintech mobile apps, CRDT replication engines, and cloud microservices.',
      },
      {
        title: '550-Question Full-Stack Developer Quiz',
        url: 'https://piush.com/quiz/',
        keywords: ['quiz', 'test', 'questions', 'skills', 'developer', 'questions', 'fullstack', 'react', 'flutter'],
        snippet: 'Rigorous 550-question developer challenge spanning 23 technical categories with complete verification rationales.',
      },
      {
        title: 'Developer Tools Suite',
        url: 'https://piush.com/tools/',
        keywords: ['tools', 'json', 'svg', 'color', 'colors', 'playground', 'code', 'converter', 'palette'],
        snippet: 'In-browser suite of developer utilities: JSON schema inspector, OKLCH color studio, SVG canvas editor, and live code runner.',
      },
      {
        title: 'About Piush KS & Resume',
        url: 'https://piush.com/about/',
        keywords: ['about', 'bio', 'resume', 'experience', 'contact', 'career', 'education', 'skills'],
        snippet: 'Professional biography, technical leadership background, speaking, and contact information for Piush KS.',
      },
      {
        title: 'Wikipedia: The Free Encyclopedia',
        url: 'https://en.wikipedia.org/wiki/Main_Page',
        keywords: ['wikipedia', 'wiki', 'encyclopedia', 'knowledge', 'history'],
        snippet: 'The free knowledge encyclopedia created and edited by volunteers around the world.',
      },
      {
        title: 'Hacker News',
        url: 'https://news.ycombinator.com/',
        keywords: ['hacker', 'news', 'yc', 'tech', 'startups', 'programming'],
        snippet: 'Social news website focusing on computer science, technology, and entrepreneurship.',
      },
      {
        title: 'Space Jam Official 1996 Warner Bros Site',
        url: 'retro:spacejam',
        keywords: ['space', 'jam', 'jordan', 'bugs', 'looney', 'tunes', 'warner', 'movie', 'b-ball'],
        snippet: 'The iconic 1996 movie website. Features The Lineup, Jam Central, planetary navigation, and soundtrack tracks.',
      },
      {
        title: 'Yahoo! (1995 Web Directory)',
        url: 'retro:yahoo',
        keywords: ['yahoo', 'directory', 'portal', '1995', 'categories', 'jerry', 'david'],
        snippet: 'Original 1995 Yahoo! human-curated directory of the World Wide Web.',
      },
    ];

    if (!term) return database.slice(0, 5);

    return database.filter((item) => {
      if (item.title.toLowerCase().includes(term)) return true;
      if (item.snippet.toLowerCase().includes(term)) return true;
      if (item.url.toLowerCase().includes(term)) return true;
      return item.keywords.some((k) => k.toLowerCase().includes(term) || term.includes(k.toLowerCase()));
    });
  }

  // HTML Structure
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none overflow-hidden relative" id="ie-app-root">
      <!-- Windows 95 Standard Menu Bar -->
      <div class="flex items-center gap-1 px-1.5 py-0.5 border-b border-[#808080] bg-[#c0c0c0] text-xs relative z-30 select-none">
        <!-- File Menu -->
        <div class="relative group" id="ie-menu-file-parent">
          <button type="button" class="px-2 py-0.5 hover:bg-[#000080] hover:text-white rounded-none cursor-default font-normal" id="ie-menu-file-btn">
            <span class="underline">F</span>ile
          </button>
          <div class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[200px] z-50 text-black text-xs" id="ie-file-dropdown">
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ie-menu-open">
              <span>Open...</span>
              <span class="text-gray-600 group-hover:text-gray-300 text-[10px]">Ctrl+O</span>
            </button>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ie-menu-saveas">
              <span>Save As...</span>
              <span class="text-gray-600 group-hover:text-gray-300 text-[10px]">Ctrl+S</span>
            </button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ie-menu-ext">
              <span>Open in New Tab</span>
              <span class="text-gray-600 group-hover:text-gray-300 text-[10px]">↗</span>
            </button>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ie-menu-print">
              <span>Print...</span>
              <span class="text-gray-600 group-hover:text-gray-300 text-[10px]">Ctrl+P</span>
            </button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="ie-menu-close">
              <span>Close</span>
            </button>
          </div>
        </div>

        <!-- Edit Menu -->
        <div class="relative group" id="ie-menu-edit-parent">
          <button type="button" class="px-2 py-0.5 hover:bg-[#000080] hover:text-white rounded-none cursor-default font-normal" id="ie-menu-edit-btn">
            <span class="underline">E</span>dit
          </button>
          <div class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[170px] z-50 text-black text-xs" id="ie-edit-dropdown">
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ie-menu-copy">
              <span>Copy</span>
              <span class="text-gray-600 group-hover:text-gray-300 text-[10px]">Ctrl+C</span>
            </button>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ie-menu-selectall">
              <span>Select All</span>
              <span class="text-gray-600 group-hover:text-gray-300 text-[10px]">Ctrl+A</span>
            </button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ie-menu-find">
              <span>Find (on this page)...</span>
              <span class="text-gray-600 group-hover:text-gray-300 text-[10px]">Ctrl+F</span>
            </button>
          </div>
        </div>

        <!-- View Menu -->
        <div class="relative group" id="ie-menu-view-parent">
          <button type="button" class="px-2 py-0.5 hover:bg-[#000080] hover:text-white rounded-none cursor-default font-normal" id="ie-menu-view-btn">
            <span class="underline">V</span>iew
          </button>
          <div class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[180px] z-50 text-black text-xs" id="ie-view-dropdown">
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ie-menu-refresh">
              <span>Refresh</span>
              <span class="text-gray-600 group-hover:text-gray-300 text-[10px]">F5</span>
            </button>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ie-menu-stop">
              <span>Stop</span>
              <span class="text-gray-600 group-hover:text-gray-300 text-[10px]">Esc</span>
            </button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ie-menu-font-cycle">
              <span>Text Size</span>
              <span class="text-gray-700 font-bold uppercase text-[10px]" id="ie-font-indicator">${fontScale}</span>
            </button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="ie-menu-source">
              <span>Source</span>
            </button>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="ie-menu-options">
              <span>Internet Options...</span>
            </button>
          </div>
        </div>

        <!-- Go Menu -->
        <div class="relative group" id="ie-menu-go-parent">
          <button type="button" class="px-2 py-0.5 hover:bg-[#000080] hover:text-white rounded-none cursor-default font-normal" id="ie-menu-go-btn">
            <span class="underline">G</span>o
          </button>
          <div class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[200px] z-50 text-black text-xs" id="ie-go-dropdown">
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ie-menu-back">
              <span>Back</span>
              <span class="text-gray-600 group-hover:text-gray-300 text-[10px]">Alt+←</span>
            </button>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ie-menu-forward">
              <span>Forward</span>
              <span class="text-gray-600 group-hover:text-gray-300 text-[10px]">Alt+→</span>
            </button>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ie-menu-home">
              <span>Home Page</span>
              <span class="text-gray-600 group-hover:text-gray-300 text-[10px]">Alt+Home</span>
            </button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="ie-menu-searchweb">
              <span>Search the Web...</span>
            </button>
          </div>
        </div>

        <!-- Favorites Menu -->
        <div class="relative group" id="ie-menu-favorites-parent">
          <button type="button" class="px-2 py-0.5 hover:bg-[#000080] hover:text-white rounded-none cursor-default font-normal" id="ie-menu-favorites-btn">
            F<span class="underline">a</span>vorites
          </button>
          <div class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[250px] max-h-[380px] overflow-y-auto z-50 text-black text-xs" id="ie-favorites-dropdown">
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white font-bold" id="ie-menu-addfav">
              ⭐ Add to Favorites...
            </button>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="ie-menu-orgfav">
              📁 Organize Favorites...
            </button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <div id="ie-favorites-list" class="space-y-0.5">
              <!-- Dynamically populated bookmarks -->
            </div>
          </div>
        </div>

        <!-- Help Menu -->
        <div class="relative group" id="ie-menu-help-parent">
          <button type="button" class="px-2 py-0.5 hover:bg-[#000080] hover:text-white rounded-none cursor-default font-normal" id="ie-menu-help-btn">
            <span class="underline">H</span>elp
          </button>
          <div class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[180px] z-50 text-black text-xs" id="ie-help-dropdown">
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="ie-menu-topics">
              <span>Help Topics</span>
            </button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="ie-menu-about">
              <span>About Internet Explorer</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Windows 95 Standard 3D Toolbar with Authentic Pixel-Art Icons -->
      <div class="flex items-center gap-1 p-1 bg-[#c0c0c0] border-b border-[#808080] text-xs relative z-20">
        <button id="ie-tb-back" class="retro-btn !py-1 !px-2 flex items-center gap-1.5 font-bold text-[11px]" title="Back (Alt+Left)">
          <img src="/images/win95-icons/back-16.png?v=1995.2" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
          <span class="hidden sm:inline">Back</span>
        </button>
        <button id="ie-tb-forward" class="retro-btn !py-1 !px-2 flex items-center gap-1.5 font-bold text-[11px]" title="Forward (Alt+Right)">
          <img src="/images/win95-icons/forward-16.png?v=1995.2" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
          <span class="hidden sm:inline">Forward</span>
        </button>
        <button id="ie-tb-stop" class="retro-btn !py-1 !px-2 flex items-center gap-1.5 text-[11px]" title="Stop (Esc)">
          <img src="/images/win95-icons/stop-16.png?v=1995.2" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
          <span class="hidden sm:inline">Stop</span>
        </button>
        <button id="ie-tb-refresh" class="retro-btn !py-1 !px-2 flex items-center gap-1.5 text-[11px]" title="Refresh (F5)">
          <img src="/images/win95-icons/refresh-16.png?v=1995.2" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
          <span class="hidden sm:inline">Refresh</span>
        </button>
        <button id="ie-tb-home" class="retro-btn !py-1 !px-2 flex items-center gap-1.5 text-[11px]" title="Home (Alt+Home)">
          <img src="/images/win95-icons/computer-16.png?v=1995.2" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
          <span class="hidden sm:inline">Home</span>
        </button>

        <div class="h-5 w-[1px] bg-[#808080] border-r border-white mx-0.5"></div>

        <button id="ie-tb-search" class="retro-btn !py-1 !px-2 flex items-center gap-1.5 text-[11px]" title="Search the Web">
          <img src="/images/win95-icons/find-16.png?v=1995.2" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
          <span class="hidden md:inline">Search</span>
        </button>
        <button id="ie-tb-favorites" class="retro-btn !py-1 !px-2 flex items-center gap-1.5 text-[11px]" title="Favorites">
          <img src="/images/win95-icons/favorites-16.png?v=1995.2" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
          <span class="hidden md:inline">Favorites</span>
        </button>
        <button id="ie-tb-print" class="retro-btn !py-1 !px-2 flex items-center gap-1.5 text-[11px]" title="Print">
          <img src="/images/win95-icons/print-16.png?v=1995.2" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
          <span class="hidden md:inline">Print</span>
        </button>
        <button id="ie-tb-font" class="retro-btn !py-1 !px-2 flex items-center gap-1.5 text-[11px] font-bold" title="Cycle Font Size">
          <img src="/images/win95-icons/font-16.png?v=1995.2" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
          <span class="hidden md:inline">Font</span>
        </button>
        <button id="ie-tb-ext" class="retro-btn !py-1 !px-2 flex items-center gap-1.5 text-[11px] font-bold text-blue-900" title="Open current URL in a new browser tab">
          <img src="/images/win95-icons/document-16.png?v=1995.2" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
          <span class="hidden md:inline">New Tab ↗</span>
        </button>

        <!-- Animated Windows 95 / IE Earth Globe -->
        <div class="ml-auto flex items-center pl-1">
          <div
            id="ie-globe-spinner"
            class="w-7 h-7 bg-[#000080] border-2 border-white shadow-[inset_1px_1px_0px_#000000,1px_1px_0px_#ffffff] flex items-center justify-center cursor-pointer relative overflow-hidden group"
            title="Microsoft Internet Explorer - Click to visit piush.com"
          >
            <img id="ie-globe-img" src="/images/win95-icons/globe.png?v=1995.2" width="20" height="20" class="size-5 shrink-0 [image-rendering:pixelated] transition-transform duration-700" alt="Internet Explorer" />
            <div id="ie-globe-orbit" class="hidden absolute inset-0 rounded-full border border-dashed border-[#ffff00] animate-spin"></div>
          </div>
        </div>
      </div>

      <!-- Address Bar -->
      <div class="flex items-center gap-2 px-2 py-1 bg-[#c0c0c0] border-b border-[#808080] text-xs relative z-10">
        <span class="font-bold text-gray-700 font-sans">Address</span>
        <div class="relative flex-1 flex items-center">
          <input
            type="text"
            id="ie-address-input"
            value="${currentUrl}"
            class="retro-inset w-full px-2 py-1 bg-white text-black text-xs font-mono select-text"
            placeholder="https://..."
          />
          <button id="ie-history-dropdown-btn" class="absolute right-1 w-4 h-4 bg-[#c0c0c0] border border-[#808080] text-[9px] flex items-center justify-center font-bold text-black" title="URL History">
            ▼
          </button>
          <!-- URL History Dropdown -->
          <div id="ie-url-history-panel" class="hidden absolute top-full left-0 right-0 bg-white border border-[#808080] shadow-[2px_2px_0px_#000000] py-0.5 z-40 max-h-40 overflow-y-auto font-mono text-xs">
            <!-- Dynamic history options -->
          </div>
        </div>
        <button id="ie-go-btn" class="retro-btn !py-0.5 !px-3 font-bold text-xs" title="Navigate to URL">
          Go
        </button>
        <button id="ie-ext-btn" class="retro-btn !py-0.5 !px-2 font-bold text-xs text-blue-900" title="Open in New Browser Tab">
          ↗
        </button>
      </div>

      <!-- Web Content Viewport -->
      <div id="ie-viewport" class="retro-inset flex-1 bg-white text-black overflow-hidden relative" style="background-color: #ffffff; color: #000000;">
        <div class="relative w-full h-full flex flex-col bg-white overflow-hidden" id="ie-viewport-wrapper">
          <!-- External Site Embedding Helper Notification Bar -->
          <div id="ie-info-bar" class="hidden px-2 py-1 bg-[#ffffcc] border-b border-[#808080] text-[11px] font-sans flex items-center justify-between text-gray-800 z-10">
            <div class="flex items-center gap-1.5 truncate">
              <span>ℹ️</span>
              <span class="truncate">External site. If blocked by browser frame security (X-Frame-Options):</span>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <button type="button" id="ie-info-bar-reader" class="retro-btn !py-0 !px-2 text-[10px] font-bold" title="View in clean Reader Mode">
                📖 Reader Mode
              </button>
              <button type="button" id="ie-info-bar-open" class="retro-btn !py-0 !px-2 text-[10px] font-bold shrink-0" title="Open in new browser tab">
                Open in New Tab ↗
              </button>
            </div>
          </div>

          <!-- Live Web IFrame: Renders ANY website and piush.com as default -->
          <iframe
            id="ie-web-iframe"
            class="w-full flex-1 border-0 bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
            allow="fullscreen"
            title="Internet Explorer Web View"
          ></iframe>

          <!-- 1995 Cyberspace Simulation Container (for retro: destinations) -->
          <div
            id="ie-page-container"
            class="hidden w-full flex-1 p-3 sm:p-5 bg-white text-black overflow-y-auto select-text font-serif"
            style="background-color: #ffffff; color: #000000;"
          ></div>
        </div>
      </div>

      <!-- Windows 95 Three-Pane Status Bar -->
      <div class="flex items-center justify-between px-2 py-0.5 text-[11px] bg-[#c0c0c0] border-t border-white border-t-[#808080] select-none text-black">
        <!-- Pane 1: Status Message -->
        <div class="retro-inset px-2 py-0.5 flex-1 mr-1 truncate bg-[#c0c0c0] flex items-center gap-1.5 min-w-0" id="ie-status-pane">
          <span id="ie-status-text">Done</span>
        </div>
        <!-- Pane 2: Segmented Loading Progress Bar -->
        <div class="retro-inset px-1 py-0.5 w-24 sm:w-32 mr-1 bg-[#c0c0c0] flex items-center overflow-hidden h-5" id="ie-progress-pane">
          <div id="ie-progress-fill" class="h-3 bg-[#000080] flex gap-0.5 w-0 transition-all duration-200"></div>
        </div>
        <!-- Pane 3: Security Zone Indicator -->
        <div class="retro-inset px-2 py-0.5 w-28 text-center bg-[#c0c0c0] font-sans text-gray-700 font-bold flex items-center justify-center gap-1">
          <span>🌐</span>
          <span class="truncate">Internet Zone</span>
        </div>
      </div>

      <!-- Modal Dialog Container (Overlays) -->
      <div id="ie-modal-overlay" class="hidden absolute inset-0 bg-black/30 z-50 flex items-center justify-center p-2 select-none">
        <div id="ie-modal-box" class="bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] p-1 max-w-lg w-full text-black">
          <!-- Modal header and content inserted dynamically -->
        </div>
      </div>
    </div>
  `;

  // Elements
  const addressInput = container.querySelector('#ie-address-input') as HTMLInputElement;
  const webIframe = container.querySelector('#ie-web-iframe') as HTMLIFrameElement;
  const pageContainer = container.querySelector('#ie-page-container') as HTMLElement;
  const infoBar = container.querySelector('#ie-info-bar') as HTMLElement;
  const statusText = container.querySelector('#ie-status-text') as HTMLElement;
  const progressFill = container.querySelector('#ie-progress-fill') as HTMLElement;
  const globeSpinner = container.querySelector('#ie-globe-spinner') as HTMLElement;
  const globeSvg = (container.querySelector('#ie-globe-img') || container.querySelector('#ie-globe-svg')) as HTMLElement;
  const globeOrbit = container.querySelector('#ie-globe-orbit') as HTMLElement;
  const backBtn = container.querySelector('#ie-tb-back') as HTMLButtonElement;
  const forwardBtn = container.querySelector('#ie-tb-forward') as HTMLButtonElement;
  const modalOverlay = container.querySelector('#ie-modal-overlay') as HTMLElement;
  const modalBox = container.querySelector('#ie-modal-box') as HTMLElement;
  const fontIndicator = container.querySelector('#ie-font-indicator') as HTMLElement;

  // Dropdown menus
  const allDropdowns = [
    container.querySelector('#ie-file-dropdown'),
    container.querySelector('#ie-edit-dropdown'),
    container.querySelector('#ie-view-dropdown'),
    container.querySelector('#ie-go-dropdown'),
    container.querySelector('#ie-favorites-dropdown'),
    container.querySelector('#ie-help-dropdown'),
    container.querySelector('#ie-url-history-panel'),
  ].filter(Boolean) as HTMLElement[];

  const closeAllDropdowns = () => {
    allDropdowns.forEach((dd) => dd.classList.add('hidden'));
  };

  const toggleDropdown = (dd: HTMLElement | null, e?: Event) => {
    if (e) e.stopPropagation();
    if (!dd) return;
    const isClosed = dd.classList.contains('hidden');
    closeAllDropdowns();
    if (isClosed) dd.classList.remove('hidden');
  };

  // Wire Dropdown Buttons
  container.querySelector('#ie-menu-file-btn')?.addEventListener('click', (e) => toggleDropdown(container.querySelector('#ie-file-dropdown'), e));
  container.querySelector('#ie-menu-edit-btn')?.addEventListener('click', (e) => toggleDropdown(container.querySelector('#ie-edit-dropdown'), e));
  container.querySelector('#ie-menu-view-btn')?.addEventListener('click', (e) => toggleDropdown(container.querySelector('#ie-view-dropdown'), e));
  container.querySelector('#ie-menu-go-btn')?.addEventListener('click', (e) => toggleDropdown(container.querySelector('#ie-go-dropdown'), e));
  container.querySelector('#ie-menu-favorites-btn')?.addEventListener('click', (e) => toggleDropdown(container.querySelector('#ie-favorites-dropdown'), e));
  container.querySelector('#ie-menu-help-btn')?.addEventListener('click', (e) => toggleDropdown(container.querySelector('#ie-help-dropdown'), e));
  container.querySelector('#ie-tb-favorites')?.addEventListener('click', (e) => toggleDropdown(container.querySelector('#ie-favorites-dropdown'), e));

  // Dismiss dropdowns on background click
  container.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.group') && !target.closest('#ie-history-dropdown-btn')) {
      closeAllDropdowns();
    }
  });

  // Open in New Tab handlers
  const openExternal = (urlToOpen?: string) => {
    const target = urlToOpen || currentUrl;
    if (target.startsWith('retro:')) {
      alert('This is an authentic Windows 95 offline simulation.');
      return;
    }
    window.open(target, '_blank');
  };

  container.querySelector('#ie-ext-btn')?.addEventListener('click', () => openExternal());
  container.querySelector('#ie-tb-ext')?.addEventListener('click', () => openExternal());
  container.querySelector('#ie-menu-ext')?.addEventListener('click', () => {
    closeAllDropdowns();
    openExternal();
  });
  container.querySelector('#ie-info-bar-open')?.addEventListener('click', () => openExternal());

  const openLiveWebPage = async (urlToOpen?: string) => {
    const targetUrl = urlToOpen || currentUrl;
    if (targetUrl.startsWith('retro:') || !targetUrl.startsWith('http')) return;

    let hostname = targetUrl;
    try {
      hostname = new URL(targetUrl).hostname;
    } catch (_) {}

    if (pageContainer) {
      if (webIframe) webIframe.classList.add('hidden');
      pageContainer.classList.remove('hidden');
      if (statusText) statusText.textContent = `Connecting to ${hostname}...`;
      if (progressFill) progressFill.style.width = '35%';
      if (globeSvg) globeSvg.classList.add('animate-pulse');
      if (globeOrbit) globeOrbit.classList.remove('hidden');

      win.setTitle(`The Microsoft Internet Explorer - ${hostname}`);

      pageContainer.innerHTML = `
        <div class="min-h-[300px] flex flex-col items-center justify-center p-6 text-black font-sans space-y-3 select-none">
          <img src="/images/win95-icons/globe.png?v=1995.2" class="size-8 animate-spin [image-rendering:pixelated]" alt="" />
          <div class="text-xs font-bold font-sans">Connecting to Web Server...</div>
          <div class="text-[11px] font-mono text-gray-600 bg-gray-100 px-3 py-1 border border-gray-400 max-w-md truncate">${targetUrl}</div>
          <div class="text-[10px] text-gray-500 font-sans">Accessing live page content via Internet Explorer Gateway...</div>
        </div>
      `;

      try {
        if (progressFill) progressFill.style.width = '60%';
        const res = await fetch(`https://r.jina.ai/${targetUrl}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();

        // Extract title if present in Jina Reader output (Title: ...)
        let pageTitle = hostname;
        const titleMatch = text.match(/^Title:\s*([^\n]+)/i);
        if (titleMatch && titleMatch[1]) {
          pageTitle = titleMatch[1].trim();
        }

        win.setTitle(`The Microsoft Internet Explorer - ${pageTitle}`);

        // Markdown to HTML conversion
        const bodyContent = text
          .replace(/^Title:[^\n]*\n+/i, '')
          .replace(/^URL Source:[^\n]*\n+/i, '')
          .replace(/^Markdown Content:[^\n]*\n+/i, '');

        let escaped = bodyContent
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

        // Code blocks
        escaped = escaped.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi, (_, lang, codeBlock) => {
          return `<pre class="my-3 p-2.5 bg-gray-100 border border-gray-400 font-mono text-xs overflow-x-auto text-black"><code>${codeBlock}</code></pre>`;
        });

        // Inline code
        escaped = escaped.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 border border-gray-300 font-mono text-[11px]">$1</code>');

        // Images
        escaped = escaped.replace(/!\[([^\]]*)\]\((https?:\/\/[^\s\)]+)\)/g, (_, alt, src) => {
          return `<div class="my-3 text-center"><img src="${src}" alt="${alt}" class="max-w-full max-h-96 mx-auto border border-gray-400 p-0.5 bg-white shadow-sm inline-block" loading="lazy" />${alt ? `<div class="text-[11px] text-gray-500 italic mt-1 font-sans">${alt}</div>` : ''}</div>`;
        });

        // Markdown links: [text](url)
        escaped = escaped.replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+|\/[^\s\)]*)\)/g, (_, label, href) => {
          let dest = href;
          if (dest.startsWith('/')) {
            try {
              dest = new URL(dest, targetUrl).href;
            } catch (_) {}
          }
          return `<a href="${dest}" class="ie-live-link text-blue-800 underline font-medium hover:text-red-700 cursor-pointer" data-dest="${dest}">${label}</a>`;
        });

        // Paragraphs and Headings
        const blocks = escaped.split(/\n\n+/);
        const formatted = blocks
          .map((para) => {
            const trimmed = para.trim();
            if (!trimmed) return '';
            if (trimmed.startsWith('# ')) {
              return `<h1 class="text-xl sm:text-2xl font-bold text-blue-900 border-b border-gray-300 pb-1 mt-4 mb-2 font-serif">${trimmed.slice(2)}</h1>`;
            }
            if (trimmed.startsWith('## ')) {
              return `<h2 class="text-lg sm:text-xl font-bold text-blue-900 mt-3 mb-1 font-serif">${trimmed.slice(3)}</h2>`;
            }
            if (trimmed.startsWith('### ')) {
              return `<h3 class="text-base font-bold text-gray-900 mt-2 mb-1 font-serif">${trimmed.slice(4)}</h3>`;
            }
            if (trimmed.startsWith('#### ')) {
              return `<h4 class="text-sm font-bold text-gray-800 mt-2 mb-1 font-sans">${trimmed.slice(5)}</h4>`;
            }
            if (trimmed.startsWith('&gt; ')) {
              return `<blockquote class="border-l-4 border-[#000080] pl-3 py-1 my-2 bg-gray-50 italic text-gray-800">${trimmed.slice(5)}</blockquote>`;
            }
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              const items = trimmed.split('\n').map((li) => `<li class="my-0.5">${li.replace(/^[-*]\s+/, '')}</li>`).join('');
              return `<ul class="list-disc pl-5 my-2 text-xs sm:text-sm text-gray-900 space-y-0.5 font-serif">${items}</ul>`;
            }
            if (/^\d+\.\s/.test(trimmed)) {
              const items = trimmed.split('\n').map((li) => `<li class="my-0.5">${li.replace(/^\d+\.\s+/, '')}</li>`).join('');
              return `<ol class="list-decimal pl-5 my-2 text-xs sm:text-sm text-gray-900 space-y-0.5 font-serif">${items}</ol>`;
            }
            return `<p class="my-2 leading-relaxed text-xs sm:text-sm text-gray-900 font-serif">${trimmed.replace(/\n/g, '<br/>')}</p>`;
          })
          .join('');

        pageContainer.innerHTML = `
          <div class="flex flex-col min-h-full bg-white text-black font-sans select-text">
            <!-- Windows 95 Information Bar -->
            <div class="bg-[#ffffcc] border-b border-[#808080] px-3 py-1.5 text-xs flex items-center justify-between font-sans shadow-sm text-black shrink-0 sticky top-0 z-20">
              <div class="flex items-center gap-2 truncate">
                <img src="/images/win95-icons/globe-16.png?v=1995.2" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" />
                <span class="font-bold text-blue-900 truncate">Internet Explorer Live Web Reader</span>
                <span class="text-gray-500 font-mono text-[10px] truncate max-w-xs">${targetUrl}</span>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button type="button" class="ie-action-newtab retro-btn !py-0.5 !px-2 text-xs font-bold font-sans flex items-center gap-1" data-url="${targetUrl}" title="Open original site in full external browser tab">
                  <span>Open in New Window</span>
                  <span class="text-blue-900 font-bold">↗</span>
                </button>
                <button type="button" class="ie-action-home retro-btn !py-0.5 !px-2 text-xs font-bold font-sans" title="Return to Piush KS Portfolio (Default Home)">
                  Home
                </button>
              </div>
            </div>

            <!-- Page Article Content -->
            <div class="p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-3 font-serif leading-relaxed" style="color: #000000; background-color: #ffffff;">
              <h1 class="text-2xl font-bold text-blue-900 border-b border-gray-300 pb-2 mb-3 font-serif">${pageTitle}</h1>
              <div class="text-[11px] text-gray-500 font-mono pb-2 border-b border-gray-100 flex justify-between">
                <span>Source: ${targetUrl}</span>
                <span class="text-green-800">Status: Verified 200 OK</span>
              </div>
              ${formatted}
            </div>
          </div>
        `;

        // Wire link clicks
        pageContainer.querySelectorAll('.ie-live-link').forEach((link) => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const dest = (link as HTMLElement).getAttribute('data-dest');
            if (dest) navigateTo(dest);
          });
        });

        // Wire New Tab and Home buttons
        pageContainer.querySelectorAll('.ie-action-newtab').forEach((btn) => {
          btn.addEventListener('click', () => {
            const dest = (btn as HTMLElement).getAttribute('data-url') || targetUrl;
            openExternal(dest);
          });
        });

        pageContainer.querySelectorAll('.ie-action-home').forEach((btn) => {
          btn.addEventListener('click', () => {
            navigateTo('https://piush.com/');
          });
        });

        applyFontScale();
      } catch (_) {
        pageContainer.innerHTML = `
          <div class="min-h-[300px] flex flex-col items-center justify-center p-6 text-black font-sans space-y-3 select-none">
            <div class="border-2 border-white shadow-[2px_2px_0px_#000000] bg-[#c0c0c0] p-4 max-w-md w-full space-y-3">
              <div class="flex items-center gap-2 border-b border-[#808080] pb-2 font-bold text-xs">
                <img src="/images/win95-icons/stop-16.png?v=1995.2" class="size-4 [image-rendering:pixelated]" alt="" />
                <span>Internet Explorer – Connection Error</span>
              </div>
              <p class="text-xs text-gray-900 leading-normal font-sans">
                Internet Explorer cannot open the Internet site <strong>${targetUrl}</strong>.<br/>
                The server was not found or was unavailable.
              </p>
              <div class="flex justify-end gap-2 pt-2 border-t border-white">
                <button type="button" class="ie-action-retry retro-btn !py-1 !px-3 text-xs font-bold font-sans">Retry</button>
                <button type="button" class="ie-action-newtab retro-btn !py-1 !px-3 text-xs font-bold font-sans flex items-center gap-1" data-url="${targetUrl}">
                  <span>Open Tab</span>
                  <span>↗</span>
                </button>
                <button type="button" class="ie-action-home retro-btn !py-1 !px-3 text-xs font-bold font-sans">Home</button>
              </div>
            </div>
          </div>
        `;

        pageContainer.querySelector('.ie-action-retry')?.addEventListener('click', () => openLiveWebPage(targetUrl));
        pageContainer.querySelector('.ie-action-newtab')?.addEventListener('click', () => openExternal(targetUrl));
        pageContainer.querySelector('.ie-action-home')?.addEventListener('click', () => navigateTo('https://piush.com/'));
      } finally {
        if (statusText) statusText.textContent = 'Done';
        if (globeSvg) globeSvg.classList.remove('animate-pulse');
        if (globeOrbit) globeOrbit.classList.add('hidden');
        if (progressFill) progressFill.style.width = '0%';
        isLoading = false;
      }
    }
  };

  const openReaderMode = openLiveWebPage;
  container.querySelector('#ie-info-bar-reader')?.addEventListener('click', () => openLiveWebPage());

  // Apply font scale
  const applyFontScale = () => {
    if (!pageContainer) return;
    pageContainer.classList.remove('text-xs', 'text-sm', 'text-base');
    if (fontScale === 'small') {
      pageContainer.style.fontSize = '12px';
    } else if (fontScale === 'large') {
      pageContainer.style.fontSize = '16px';
    } else {
      pageContainer.style.fontSize = '14px';
    }
    if (fontIndicator) fontIndicator.textContent = fontScale;
    try {
      localStorage.setItem(STORAGE_FONT_SIZE, fontScale);
    } catch (_) {}
  };

  const cycleFontSize = () => {
    if (fontScale === 'small') fontScale = 'medium';
    else if (fontScale === 'medium') fontScale = 'large';
    else fontScale = 'small';
    applyFontScale();
    audio.playClick();
  };

  container.querySelector('#ie-tb-font')?.addEventListener('click', cycleFontSize);
  container.querySelector('#ie-menu-font-cycle')?.addEventListener('click', () => {
    closeAllDropdowns();
    cycleFontSize();
  });

  // Update Favorites dropdown menu items
  const renderFavoritesMenu = () => {
    const favList = container.querySelector('#ie-favorites-list');
    if (!favList) return;

    favList.innerHTML = favorites
      .map(
        (fav, idx) => `
          <button
            type="button"
            class="ie-fav-item w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex items-center justify-between gap-2"
            data-url="${fav.url}"
            data-idx="${idx}"
          >
            <span class="truncate">⭐ ${fav.title}</span>
            <span class="text-[10px] text-gray-500 font-mono truncate max-w-[100px]">${fav.url.replace(/^https?:\/\//, '')}</span>
          </button>
        `
      )
      .join('');

    favList.querySelectorAll('.ie-fav-item').forEach((item) => {
      item.addEventListener('click', () => {
        closeAllDropdowns();
        const dest = (item as HTMLElement).getAttribute('data-url');
        if (dest) navigateTo(dest);
      });
    });
  };

  // Update URL history dropdown panel
  const updateUrlHistoryDropdown = () => {
    const historyPanel = container.querySelector('#ie-url-history-panel');
    if (!historyPanel) return;

    const uniqueUrls = Array.from(new Set(historyStack)).slice(-10).reverse();
    historyPanel.innerHTML = uniqueUrls
      .map(
        (url) => `
          <div class="ie-hist-opt px-3 py-1 hover:bg-[#000080] hover:text-white cursor-pointer flex justify-between items-center" data-url="${url}">
            <span>${url}</span>
            ${url === currentUrl ? '<span class="text-[10px] font-bold">✓</span>' : ''}
          </div>
        `
      )
      .join('');

    historyPanel.querySelectorAll('.ie-hist-opt').forEach((opt) => {
      opt.addEventListener('click', () => {
        const dest = (opt as HTMLElement).getAttribute('data-url');
        closeAllDropdowns();
        if (dest) navigateTo(dest);
      });
    });
  };

  container.querySelector('#ie-history-dropdown-btn')?.addEventListener('click', (e) => {
    updateUrlHistoryDropdown();
    toggleDropdown(container.querySelector('#ie-url-history-panel'), e);
  });

  // Navigation Core: Handles ANY website + piush.com as default
  const navigateTo = (url: string, pushHistory = true) => {
    const target = parseTargetUrl(url);
    isLoading = true;
    audio.playClick();

    // Start Spinner & Status animation
    if (globeSvg) globeSvg.classList.add('animate-pulse');
    if (globeOrbit) globeOrbit.classList.remove('hidden');
    if (statusText) statusText.textContent = `Connecting to ${target.displayUrl}...`;
    if (progressFill) progressFill.style.width = '25%';

    currentUrl = target.displayUrl;
    if (addressInput) addressInput.value = target.displayUrl;

    if (pushHistory) {
      historyStack.splice(historyIndex + 1);
      historyStack.push(target.displayUrl);
      historyIndex = historyStack.length - 1;
    }

    updateNavButtons();
    updateUrlHistoryDropdown();

    // Route A: 1995 Cyberspace Retro Simulation & Live Web Reader
    if (target.isRetro && target.retroKey) {
      if (infoBar) infoBar.classList.add('hidden');
      if (webIframe) webIframe.classList.add('hidden');
      if (pageContainer) pageContainer.classList.remove('hidden');

      // Live External Web Destination
      if (target.retroKey.startsWith('live:')) {
        const liveDest = target.retroKey.replace(/^live:/, '');
        openLiveWebPage(liveDest);
        return;
      }

      setTimeout(() => {
        const retroData = getRetroPageContent(target.retroKey!);
        win.setTitle(`The Microsoft Internet Explorer - ${retroData.title}`);
        if (pageContainer) {
          pageContainer.innerHTML = retroData.html;
          wireRetroPageInteractions();
          applyFontScale();
        }
        if (statusText) statusText.textContent = 'Done';
        if (globeSvg) globeSvg.classList.remove('animate-pulse');
        if (globeOrbit) globeOrbit.classList.add('hidden');
        if (progressFill) progressFill.style.width = '0%';
        isLoading = false;
      }, 250);
      return;
    }

    // Route B: Live Web Engine (Iframe) - default for piush.com and any external URL
    if (pageContainer) pageContainer.classList.add('hidden');
    if (webIframe) webIframe.classList.remove('hidden');

    if (target.isExternal) {
      if (infoBar) infoBar.classList.remove('hidden');
    } else {
      if (infoBar) infoBar.classList.add('hidden');
    }

    win.setTitle(`The Microsoft Internet Explorer - ${target.displayUrl}`);

    setTimeout(() => {
      if (progressFill) progressFill.style.width = '65%';
    }, 120);

    // Set the iframe source
    if (webIframe) {
      webIframe.src = target.iframeSrc || '/';
    }
  };

  // Wire Iframe Load Event
  webIframe?.addEventListener('load', () => {
    isLoading = false;
    if (statusText) statusText.textContent = 'Done';
    if (globeSvg) globeSvg.classList.remove('animate-pulse');
    if (globeOrbit) globeOrbit.classList.add('hidden');
    if (progressFill) progressFill.style.width = '0%';

    // Read title and pathname from same-origin iframe (e.g. piush.com)
    try {
      const loc = webIframe.contentWindow?.location;
      if (loc && loc.pathname) {
        const path = loc.pathname + loc.search;
        if (!currentUrl.startsWith('http://') && !currentUrl.startsWith('https://')) {
          currentUrl = `https://piush.com${path === '/' ? '/' : path}`;
        }
        if (addressInput && !currentUrl.includes('//')) {
          addressInput.value = currentUrl;
        }
      }
      if (webIframe.contentDocument && webIframe.contentDocument.title) {
        win.setTitle(`The Microsoft Internet Explorer - ${webIframe.contentDocument.title}`);
      }
    } catch (_) {}
  });

  // Wire Back and Forward state
  const updateNavButtons = () => {
    if (backBtn) {
      backBtn.disabled = historyIndex <= 0;
      backBtn.classList.toggle('opacity-50', historyIndex <= 0);
    }
    if (forwardBtn) {
      forwardBtn.disabled = historyIndex >= historyStack.length - 1;
      forwardBtn.classList.toggle('opacity-50', historyIndex >= historyStack.length - 1);
    }
  };

  // Wire Retro simulated page interactions
  const wireRetroPageInteractions = () => {

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
          win.setTitle(`The Microsoft Internet Explorer - ${dest}`);
        }
      });
    });

    pageContainer.querySelectorAll('.ie-link, .ie-retro-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const dest = (link as HTMLElement).getAttribute('data-url');
        if (dest) navigateTo(dest);
      });
    });

    const yahooInput = pageContainer.querySelector('#yahoo-query-box') as HTMLInputElement;
    const yahooBtn = pageContainer.querySelector('#yahoo-search-btn') as HTMLButtonElement;
    if (yahooBtn && yahooInput) {
      const doYahoo = () => {
        const q = yahooInput.value.trim();
        if (q) navigateTo(`retro:yahoo?p=${encodeURIComponent(q)}`);
      };
      yahooBtn.addEventListener('click', doYahoo);
      yahooInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doYahoo();
      });
    }

    // Google 1998 Search Engine Wiring
    const googleInput = pageContainer.querySelector('#google-query-box') as HTMLInputElement | null;
    const googleSearchBtn = pageContainer.querySelector('#google-search-btn') as HTMLButtonElement | null;
    const googleLuckyBtn = pageContainer.querySelector('#google-lucky-btn') as HTMLButtonElement | null;
    const googleBottomInput = pageContainer.querySelector('#google-query-bottom') as HTMLInputElement | null;
    const googleBottomBtn = pageContainer.querySelector('#google-search-bottom-btn') as HTMLButtonElement | null;

    if (googleInput) {
      setTimeout(() => {
        try {
          googleInput.focus();
        } catch (_) {}
      }, 60);
    }

    const executeGoogleSearch = (queryText: string) => {
      const q = queryText.trim();
      if (!q) {
        navigateTo('https://google.com/');
        return;
      }

      // Check if user entered a direct web destination
      const isDirectUrl =
        q.startsWith('http://') ||
        q.startsWith('https://') ||
        (q.includes('.') && !q.includes(' ') && !q.startsWith('?'));

      if (isDirectUrl) {
        navigateTo(q);
      } else {
        navigateTo(`https://www.google.com/search?q=${encodeURIComponent(q)}`);
      }
    };

    if (googleSearchBtn && googleInput) {
      googleSearchBtn.addEventListener('click', () => {
        executeGoogleSearch(googleInput.value);
      });
      googleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          executeGoogleSearch(googleInput.value);
        }
      });
    }

    if (googleLuckyBtn && googleInput) {
      googleLuckyBtn.addEventListener('click', () => {
        const q = googleInput.value.trim();
        if (!q) {
          navigateTo('https://piush.com/');
          return;
        }
        const matches = searchWebDatabase(q);
        if (matches.length > 0) {
          navigateTo(matches[0].url);
        } else {
          navigateTo(`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q)}`);
        }
      });
    }

    if (googleBottomBtn && googleBottomInput) {
      googleBottomBtn.addEventListener('click', () => {
        executeGoogleSearch(googleBottomInput.value);
      });
      googleBottomInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          executeGoogleSearch(googleBottomInput.value);
        }
      });
    }

    // Dynamic Live Wikipedia / OpenSearch Enrichment for Google Search Results
    const googleResultsList = pageContainer.querySelector('#google-results-list');
    if (googleResultsList) {
      const queryMatch = currentUrl.match(/[?&](?:q|p)=([^&]+)/i);
      const query = queryMatch ? decodeURIComponent(queryMatch[1]).replace(/\+/g, ' ').trim() : '';

      if (query) {
        const wikiApiUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=6&namespace=0&format=json&origin=*`;
        fetch(wikiApiUrl)
          .then((res) => {
            if (!res.ok) throw new Error('Live search unavailable');
            return res.json();
          })
          .then((data) => {
            if (!Array.isArray(data) || data.length < 4) return;
            const titles: string[] = data[1] || [];
            const descriptions: string[] = data[2] || [];
            const links: string[] = data[3] || [];

            if (titles.length === 0) return;

            // Remove placeholder if present
            const placeholder = googleResultsList.querySelector('.border-dashed');
            if (placeholder) {
              placeholder.remove();
            }

            const liveHtml = titles
              .map((title, idx) => {
                const link = links[idx] || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
                const desc = descriptions[idx] || `Online encyclopedic reference article for ${title}.`;
                return `
                  <div class="border-b border-gray-100 pb-2.5 text-xs space-y-0.5">
                    <div><a href="#" class="ie-link text-blue-800 underline font-bold text-sm hover:text-blue-600" data-url="${link}">${title}</a></div>
                    <div class="text-gray-800 leading-normal">${desc}</div>
                    <div class="text-[11px] text-green-800 font-mono flex items-center gap-2">
                      <span>${link}</span>
                      <span class="text-gray-400">-</span>
                      <span class="text-gray-500 text-[10px] cursor-pointer hover:underline">[Live Web]</span>
                    </div>
                  </div>
                `;
              })
              .join('');

            googleResultsList.insertAdjacentHTML('beforeend', liveHtml);

            // Wire up newly injected links
            googleResultsList.querySelectorAll('.ie-link').forEach((link) => {
              link.addEventListener('click', (e) => {
                e.preventDefault();
                const dest = (link as HTMLElement).getAttribute('data-url');
                if (dest) navigateTo(dest);
              });
            });
          })
          .catch(() => {
            // Silently retain static directory matches if offline or blocked
          });
      }
    }
  };

  // Address Bar Go & Enter
  container.querySelector('#ie-go-btn')?.addEventListener('click', () => {
    navigateTo(addressInput.value);
  });

  addressInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      navigateTo(addressInput.value);
    }
  });

  // Toolbar Button Wires
  backBtn?.addEventListener('click', () => {
    if (historyIndex > 0) {
      historyIndex--;
      navigateTo(historyStack[historyIndex], false);
    }
  });

  forwardBtn?.addEventListener('click', () => {
    if (historyIndex < historyStack.length - 1) {
      historyIndex++;
      navigateTo(historyStack[historyIndex], false);
    }
  });

  container.querySelector('#ie-tb-stop')?.addEventListener('click', () => {
    isLoading = false;
    if (globeSvg) globeSvg.classList.remove('animate-pulse');
    if (globeOrbit) globeOrbit.classList.add('hidden');
    if (statusText) statusText.textContent = 'Done';
    if (progressFill) progressFill.style.width = '0%';
  });

  container.querySelector('#ie-tb-refresh')?.addEventListener('click', () => {
    if (!webIframe.classList.contains('hidden')) {
      webIframe.src = webIframe.src;
    } else {
      navigateTo(currentUrl, false);
    }
  });

  container.querySelector('#ie-tb-home')?.addEventListener('click', () => {
    navigateTo(homePage);
  });

  container.querySelector('#ie-tb-search')?.addEventListener('click', () => {
    navigateTo('https://en.wikipedia.org/wiki/Special:Search');
  });

  globeSpinner?.addEventListener('click', () => {
    navigateTo('https://piush.com/');
  });

  // Menu bar action handlers
  container.querySelector('#ie-menu-back')?.addEventListener('click', () => {
    closeAllDropdowns();
    backBtn.click();
  });
  container.querySelector('#ie-menu-forward')?.addEventListener('click', () => {
    closeAllDropdowns();
    forwardBtn.click();
  });
  container.querySelector('#ie-menu-refresh')?.addEventListener('click', () => {
    closeAllDropdowns();
    container.querySelector('#ie-tb-refresh')?.dispatchEvent(new MouseEvent('click'));
  });
  container.querySelector('#ie-menu-stop')?.addEventListener('click', () => {
    closeAllDropdowns();
    container.querySelector('#ie-tb-stop')?.dispatchEvent(new MouseEvent('click'));
  });
  container.querySelector('#ie-menu-home')?.addEventListener('click', () => {
    closeAllDropdowns();
    navigateTo(homePage);
  });
  container.querySelector('#ie-menu-searchweb')?.addEventListener('click', () => {
    closeAllDropdowns();
    navigateTo('https://en.wikipedia.org/wiki/Special:Search');
  });
  container.querySelector('#ie-menu-close')?.addEventListener('click', () => {
    closeAllDropdowns();
    win.close();
  });

  // Modal System
  const showModal = (headerTitle: string, innerHtml: string) => {
    closeAllDropdowns();
    audio.playChord();
    modalBox.innerHTML = `
      <div class="bg-[#000080] text-white px-2 py-0.5 flex justify-between items-center text-xs font-bold mb-2">
        <span>${headerTitle}</span>
        <button id="ie-modal-close-x" class="w-4 h-4 bg-[#c0c0c0] text-black font-bold flex items-center justify-center border border-white shadow-[inset_1px_1px_0px_#ffffff,1px_1px_0px_#000000] text-[10px]">
          ✕
        </button>
      </div>
      <div class="p-2 text-xs font-sans space-y-3">
        ${innerHtml}
      </div>
    `;

    modalBox.querySelector('#ie-modal-close-x')?.addEventListener('click', closeModal);
    modalOverlay.classList.remove('hidden');
  };

  const closeModal = () => {
    modalOverlay.classList.add('hidden');
  };

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // 1. File -> Open Dialog
  container.querySelector('#ie-menu-open')?.addEventListener('click', () => {
    showModal(
      'Open',
      `
        <div class="flex gap-3 items-start">
          <div class="text-2xl">🌐</div>
          <div class="flex-1 space-y-2">
            <p class="text-xs">
              Type the Internet address of any website, document, or folder, and Internet Explorer will open it for you.
            </p>
            <div class="space-y-1">
              <label class="block font-bold text-xs">Open:</label>
              <input type="text" id="ie-open-dialog-url" value="${currentUrl}" class="retro-inset w-full px-2 py-0.5 bg-white text-xs font-mono" />
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-2 border-t border-[#808080]">
          <button id="ie-open-dialog-ok" class="retro-btn !py-1 !px-4 text-xs font-bold">OK</button>
          <button id="ie-open-dialog-cancel" class="retro-btn !py-1 !px-4 text-xs">Cancel</button>
        </div>
      `
    );

    modalBox.querySelector('#ie-open-dialog-cancel')?.addEventListener('click', closeModal);
    modalBox.querySelector('#ie-open-dialog-ok')?.addEventListener('click', () => {
      const url = (modalBox.querySelector('#ie-open-dialog-url') as HTMLInputElement)?.value;
      closeModal();
      if (url) navigateTo(url);
    });
  });

  // 2. File -> Save As Dialog
  container.querySelector('#ie-menu-saveas')?.addEventListener('click', () => {
    const defaultFilename = currentUrl.replace(/[^a-zA-Z0-9]/g, '_') + '.htm';

    showModal(
      'Save Web Page',
      `
        <div class="space-y-3">
          <p class="text-xs">
            Save current document to the Windows 95 Virtual File System:
          </p>
          <div class="space-y-1">
            <label class="block font-bold text-xs">File Name:</label>
            <input type="text" id="ie-save-filename" value="${defaultFilename}" class="retro-inset w-full px-2 py-0.5 bg-white text-xs font-mono" />
          </div>
          <div class="flex justify-between items-center pt-2 border-t border-[#808080]">
            <button id="ie-save-download-btn" class="retro-btn !py-1 !px-3 text-xs">
              💾 Download to PC
            </button>
            <div class="flex gap-2">
              <button id="ie-save-ok-btn" class="retro-btn !py-1 !px-4 text-xs font-bold">Save</button>
              <button id="ie-save-cancel-btn" class="retro-btn !py-1 !px-4 text-xs">Cancel</button>
            </div>
          </div>
        </div>
      `
    );

    modalBox.querySelector('#ie-save-cancel-btn')?.addEventListener('click', closeModal);

    modalBox.querySelector('#ie-save-ok-btn')?.addEventListener('click', () => {
      const fn = (modalBox.querySelector('#ie-save-filename') as HTMLInputElement)?.value.trim() || defaultFilename;
      const htmlToSave = `<!-- Saved from Internet Explorer: ${currentUrl} -->\n<html><head><title>${currentUrl}</title></head><body><p>Saved URL: <a href="${currentUrl}">${currentUrl}</a></p></body></html>`;

      vfs.createFolder('/My Documents/Saved Pages');
      vfs.writeFile(`/My Documents/Saved Pages/${fn}`, htmlToSave, 'text/html');
      audio.playTada();
      closeModal();
      alert(`Page shortcut successfully saved to: /My Documents/Saved Pages/${fn}`);
    });

    modalBox.querySelector('#ie-save-download-btn')?.addEventListener('click', () => {
      const fn = (modalBox.querySelector('#ie-save-filename') as HTMLInputElement)?.value.trim() || defaultFilename;
      const htmlToSave = `<html><head><title>${currentUrl}</title></head><body><p>Saved URL: <a href="${currentUrl}">${currentUrl}</a></p></body></html>`;
      const blob = new Blob([htmlToSave], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fn;
      a.click();
      URL.revokeObjectURL(url);
      closeModal();
    });
  });

  // 3. Print Dialog
  const openPrintDialog = () => {
    showModal(
      'Print',
      `
        <div class="space-y-3">
          <div class="border border-[#808080] p-2 bg-[#f9f9f9] text-xs space-y-1">
            <div class="font-bold text-[#000080]">Printer:</div>
            <div>Name: HP LaserJet 4L (Standard 300 DPI)</div>
            <div>Status: Ready for printing</div>
          </div>
          <div class="space-y-1 text-xs">
            <span class="font-bold">Target URL:</span> ${currentUrl}
          </div>
          <div class="flex justify-end gap-2 pt-2 border-t border-[#808080]">
            <button id="ie-print-confirm-btn" class="retro-btn !py-1 !px-4 text-xs font-bold">Print Document</button>
            <button id="ie-print-cancel-btn" class="retro-btn !py-1 !px-4 text-xs">Cancel</button>
          </div>
        </div>
      `
    );

    modalBox.querySelector('#ie-print-cancel-btn')?.addEventListener('click', closeModal);
    modalBox.querySelector('#ie-print-confirm-btn')?.addEventListener('click', () => {
      audio.playChord();
      closeModal();
      try {
        webIframe.contentWindow?.print();
      } catch (_) {
        window.print();
      }
    });
  };

  container.querySelector('#ie-tb-print')?.addEventListener('click', openPrintDialog);
  container.querySelector('#ie-menu-print')?.addEventListener('click', () => {
    closeAllDropdowns();
    openPrintDialog();
  });

  // 4. View Source
  container.querySelector('#ie-menu-source')?.addEventListener('click', async () => {
    closeAllDropdowns();
    let rawHtml = '';

    try {
      if (currentUrl.includes('piush.com') || currentUrl.startsWith('/')) {
        const res = await fetch('/');
        rawHtml = await res.text();
      } else {
        rawHtml = `<!-- Document URL: ${currentUrl} -->\n<!-- Live frame source loaded at ${new Date().toISOString()} -->\n<iframe src="${currentUrl}"></iframe>`;
      }
    } catch (_) {
      rawHtml = `<!-- Source viewer for ${currentUrl} -->\n<html>\n<head><title>${currentUrl}</title></head>\n<body>\n  <p>Live Web Page: <a href="${currentUrl}">${currentUrl}</a></p>\n</body>\n</html>`;
    }

    showModal(
      `${currentUrl} - Notepad (View Source)`,
      `
        <div class="space-y-2">
          <div class="flex justify-between items-center text-xs">
            <span class="font-mono text-gray-600">Encoding: UTF-8 / Windows-1252</span>
            <button id="ie-copy-source-btn" class="retro-btn !py-0.5 !px-3 text-xs font-bold">📋 Copy HTML</button>
          </div>
          <textarea
            id="ie-source-textarea"
            readonly
            rows="12"
            class="retro-inset w-full p-2 bg-white text-black font-mono text-xs whitespace-pre select-text leading-tight"
          >${rawHtml}</textarea>
          <div class="flex justify-end">
            <button id="ie-source-close-btn" class="retro-btn !py-1 !px-4 text-xs">Close</button>
          </div>
        </div>
      `
    );

    modalBox.querySelector('#ie-source-close-btn')?.addEventListener('click', closeModal);
    modalBox.querySelector('#ie-copy-source-btn')?.addEventListener('click', () => {
      navigator.clipboard?.writeText(rawHtml).then(() => {
        audio.playClick();
        alert('HTML Source copied to clipboard!');
      });
    });
  });

  // 5. Find in Page
  container.querySelector('#ie-menu-find')?.addEventListener('click', () => {
    closeAllDropdowns();
    showModal(
      'Find',
      `
        <div class="space-y-3">
          <div class="space-y-1">
            <label class="block font-bold text-xs">Find what:</label>
            <input type="text" id="ie-find-input" value="${activeFindTerm}" class="retro-inset w-full px-2 py-0.5 bg-white text-xs font-mono" />
          </div>
          <div class="text-[11px] text-gray-600">
            Type a term to locate on the currently loaded web document.
          </div>
          <div class="flex justify-end gap-2 pt-2 border-t border-[#808080]">
            <button id="ie-find-next-btn" class="retro-btn !py-1 !px-4 text-xs font-bold">Find Next</button>
            <button id="ie-find-cancel-btn" class="retro-btn !py-1 !px-4 text-xs">Cancel</button>
          </div>
        </div>
      `
    );

    modalBox.querySelector('#ie-find-cancel-btn')?.addEventListener('click', closeModal);
    modalBox.querySelector('#ie-find-next-btn')?.addEventListener('click', () => {
      const term = (modalBox.querySelector('#ie-find-input') as HTMLInputElement)?.value.trim();
      closeModal();
      if (!term) return;
      activeFindTerm = term;
      audio.playClick();
      alert(`Search completed for "${term}".`);
    });
  });

  // 6. Favorites: Add to Favorites Dialog
  const openAddFavoriteDialog = () => {
    closeAllDropdowns();
    showModal(
      'Add Favorite',
      `
        <div class="space-y-3">
          <div class="flex gap-3 items-center">
            <span class="text-2xl">⭐</span>
            <p class="text-xs">
              Internet Explorer will add this website to your Favorites list.
            </p>
          </div>
          <div class="space-y-1">
            <label class="block font-bold text-xs">Name:</label>
            <input type="text" id="ie-fav-name-input" value="${currentUrl}" class="retro-inset w-full px-2 py-0.5 bg-white text-xs" />
          </div>
          <div class="space-y-1">
            <label class="block font-bold text-xs">URL:</label>
            <input type="text" id="ie-fav-url-input" value="${currentUrl}" readonly class="retro-inset w-full px-2 py-0.5 bg-gray-100 text-xs text-gray-700 font-mono" />
          </div>
          <div class="flex justify-end gap-2 pt-2 border-t border-[#808080]">
            <button id="ie-fav-ok-btn" class="retro-btn !py-1 !px-4 text-xs font-bold">OK</button>
            <button id="ie-fav-cancel-btn" class="retro-btn !py-1 !px-4 text-xs">Cancel</button>
          </div>
        </div>
      `
    );

    modalBox.querySelector('#ie-fav-cancel-btn')?.addEventListener('click', closeModal);
    modalBox.querySelector('#ie-fav-ok-btn')?.addEventListener('click', () => {
      const name = (modalBox.querySelector('#ie-fav-name-input') as HTMLInputElement)?.value.trim() || currentUrl;
      favorites.push({
        title: name,
        url: currentUrl,
        category: 'User Favorites',
        dateAdded: Date.now(),
      });
      saveFavorites();
      renderFavoritesMenu();
      audio.playTada();
      closeModal();
    });
  };

  container.querySelector('#ie-menu-addfav')?.addEventListener('click', openAddFavoriteDialog);

  // 7. Organize Favorites Dialog
  container.querySelector('#ie-menu-orgfav')?.addEventListener('click', () => {
    closeAllDropdowns();
    const renderOrganizeList = () => {
      const listEl = modalBox.querySelector('#ie-org-list');
      if (!listEl) return;
      listEl.innerHTML = favorites
        .map(
          (fav, idx) => `
            <div class="flex items-center justify-between p-1.5 border-b border-gray-200 text-xs hover:bg-blue-50">
              <div class="truncate mr-2">
                <span class="font-bold">${fav.title}</span>
                <span class="text-gray-500 font-mono text-[10px] block">${fav.url}</span>
              </div>
              <button type="button" class="ie-del-fav retro-btn !py-0.5 !px-2 text-[10px] text-red-700" data-idx="${idx}">
                Delete
              </button>
            </div>
          `
        )
        .join('');

      listEl.querySelectorAll('.ie-del-fav').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt((btn as HTMLElement).getAttribute('data-idx') || '0', 10);
          favorites.splice(idx, 1);
          saveFavorites();
          renderFavoritesMenu();
          renderOrganizeList();
          audio.playClick();
        });
      });
    };

    showModal(
      'Organize Favorites',
      `
        <div class="space-y-3">
          <p class="text-xs">
            Manage, visit, or remove bookmarks from your Internet Explorer collection:
          </p>
          <div id="ie-org-list" class="retro-inset max-h-48 overflow-y-auto bg-white p-1 space-y-0.5"></div>
          <div class="flex justify-end pt-2 border-t border-[#808080]">
            <button id="ie-org-close-btn" class="retro-btn !py-1 !px-4 text-xs font-bold">Close</button>
          </div>
        </div>
      `
    );

    renderOrganizeList();
    modalBox.querySelector('#ie-org-close-btn')?.addEventListener('click', closeModal);
  });

  // 8. Internet Options Dialog (Configures default home page)
  container.querySelector('#ie-menu-options')?.addEventListener('click', () => {
    closeAllDropdowns();
    showModal(
      'Internet Options',
      `
        <div class="space-y-3">
          <div class="flex border-b border-[#808080] text-xs font-bold gap-1">
            <div class="px-3 py-1 bg-white border-t-2 border-l-2 border-r-2 border-[#808080] -mb-[1px]">General</div>
            <div class="px-3 py-1 bg-[#c0c0c0] text-gray-600">Security</div>
            <div class="px-3 py-1 bg-[#c0c0c0] text-gray-600">Advanced</div>
          </div>

          <div class="border border-[#808080] p-3 bg-white space-y-3 text-xs">
            <div class="space-y-1.5">
              <span class="font-bold text-[#000080]">Home Page:</span>
              <p class="text-[11px] text-gray-600">Configure what website to use as your default start page.</p>
              <div class="flex gap-2">
                <span class="font-bold text-gray-700">Address:</span>
                <input type="text" id="ie-opt-home-input" value="${homePage}" class="retro-inset flex-1 px-2 py-0.5 bg-white text-xs font-mono" />
              </div>
              <div class="flex gap-1 justify-end pt-1">
                <button id="ie-opt-home-current" class="retro-btn !py-0.5 !px-2 text-[11px]">Use Current</button>
                <button id="ie-opt-home-default" class="retro-btn !py-0.5 !px-2 text-[11px]">Use piush.com</button>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-2 space-y-1">
              <span class="font-bold text-[#000080]">Temporary Internet Files & Cache:</span>
              <p class="text-[11px] text-gray-600">Pages you view are cached for instant responsiveness.</p>
              <button id="ie-opt-clear-cache" class="retro-btn !py-0.5 !px-3 text-xs">Delete Files...</button>
            </div>

            <div class="border-t border-gray-200 pt-2 space-y-1">
              <span class="font-bold text-[#000080]">History:</span>
              <button id="ie-opt-clear-hist" class="retro-btn !py-0.5 !px-3 text-xs">Clear History</button>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t border-[#808080]">
            <button id="ie-opt-ok-btn" class="retro-btn !py-1 !px-4 text-xs font-bold">OK</button>
            <button id="ie-opt-cancel-btn" class="retro-btn !py-1 !px-4 text-xs">Cancel</button>
          </div>
        </div>
      `
    );

    modalBox.querySelector('#ie-opt-cancel-btn')?.addEventListener('click', closeModal);
    modalBox.querySelector('#ie-opt-home-current')?.addEventListener('click', () => {
      const input = modalBox.querySelector('#ie-opt-home-input') as HTMLInputElement;
      if (input) input.value = currentUrl;
    });
    modalBox.querySelector('#ie-opt-home-default')?.addEventListener('click', () => {
      const input = modalBox.querySelector('#ie-opt-home-input') as HTMLInputElement;
      if (input) input.value = 'https://piush.com/';
    });
    modalBox.querySelector('#ie-opt-clear-cache')?.addEventListener('click', () => {
      audio.playChord();
      alert('All temporary Internet files deleted.');
    });
    modalBox.querySelector('#ie-opt-clear-hist')?.addEventListener('click', () => {
      historyStack.splice(0, historyStack.length, currentUrl);
      historyIndex = 0;
      updateNavButtons();
      updateUrlHistoryDropdown();
      audio.playClick();
      alert('Browser navigation history cleared.');
    });
    modalBox.querySelector('#ie-opt-ok-btn')?.addEventListener('click', () => {
      const newHome = (modalBox.querySelector('#ie-opt-home-input') as HTMLInputElement)?.value.trim();
      if (newHome) {
        homePage = newHome;
        try {
          localStorage.setItem(STORAGE_HOMEPAGE, homePage);
        } catch (_) {}
      }
      closeModal();
      audio.playClick();
    });
  });

  // 9. Help Topics Dialog
  container.querySelector('#ie-menu-topics')?.addEventListener('click', () => {
    closeAllDropdowns();
    showModal(
      'Internet Explorer Help',
      `
        <div class="space-y-3 font-sans text-xs">
          <div class="border border-[#808080] p-2.5 bg-white space-y-2 max-h-56 overflow-y-auto">
            <h3 class="font-bold text-[#000080] text-sm">Welcome to Internet Explorer for Windows 95!</h3>
            <p>
              Internet Explorer opens any live website on the World Wide Web, with <strong>piush.com</strong> as your default start page.
            </p>
            <h4 class="font-bold text-gray-800">Quick Navigation Commands:</h4>
            <ul class="list-disc pl-5 space-y-1 text-gray-700">
              <li><strong>Open Any Website:</strong> Type any URL (e.g. <code>wikipedia.org</code>, <code>news.ycombinator.com</code>, <code>example.com</code>) into the Address Bar and click <strong>Go</strong> or press Enter.</li>
              <li><strong>Default Home Page:</strong> Click the <strong>Home</strong> button (🏠) to return to <code>piush.com</code> at any time.</li>
              <li><strong>Open in New Tab:</strong> Click the <strong>↗</strong> button to view any website in a full browser tab if it restricts frame embedding.</li>
              <li><strong>Favorites:</strong> Access preloaded bookmarks or add any URL using <code>Favorites -> Add to Favorites...</code>.</li>
            </ul>
          </div>
          <div class="flex justify-end pt-2 border-t border-[#808080]">
            <button id="ie-help-close-btn" class="retro-btn !py-1 !px-4 text-xs font-bold">OK</button>
          </div>
        </div>
      `
    );

    modalBox.querySelector('#ie-help-close-btn')?.addEventListener('click', closeModal);
  });

  // 10. About Internet Explorer Dialog
  container.querySelector('#ie-menu-about')?.addEventListener('click', () => {
    closeAllDropdowns();
    showModal(
      'About The Microsoft Internet Explorer',
      `
        <div class="space-y-3 font-sans text-xs">
          <div class="flex items-center gap-3 bg-gradient-to-r from-[#000080] to-[#008080] p-3 text-white border border-[#808080]">
            <div class="text-3xl">🌐</div>
            <div>
              <div class="font-bold text-base tracking-wide">The Microsoft Internet Explorer</div>
              <div class="text-[11px] text-cyan-200 font-mono">Version 3.02 (4.70.1158) - Full Web Edition</div>
            </div>
          </div>

          <div class="space-y-1 text-xs">
            <div><strong>Default Start Page:</strong> https://piush.com/</div>
            <div><strong>Engine:</strong> Live IFrame Web Navigation + 1995 Cyberspace Retro Portal</div>
            <div><strong>Cipher Strength:</strong> 128-bit High Encryption</div>
          </div>

          <div class="border-t border-[#808080] pt-2 text-[11px] text-gray-700 space-y-1">
            <p>Copyright © 1995-1997 Microsoft Corporation. All rights reserved.</p>
            <p class="text-gray-500 italic">
              Configured for Piush KS Portfolio Desktop Environment.
            </p>
          </div>

          <div class="flex justify-end pt-2 border-t border-[#808080]">
            <button id="ie-about-ok-btn" class="retro-btn !py-1 !px-5 text-xs font-bold">OK</button>
          </div>
        </div>
      `
    );

    modalBox.querySelector('#ie-about-ok-btn')?.addEventListener('click', closeModal);
  });

  // Keyboard Shortcuts
  const handleKeydown = (e: KeyboardEvent) => {
    if (!win.element || !win.element.classList.contains('active-window')) {
      const isWithin = win.element?.contains(document.activeElement);
      if (!isWithin) return;
    }

    if (e.key === 'F5') {
      e.preventDefault();
      container.querySelector('#ie-tb-refresh')?.dispatchEvent(new MouseEvent('click'));
    } else if (e.key === 'Escape') {
      container.querySelector('#ie-tb-stop')?.dispatchEvent(new MouseEvent('click'));
    } else if (e.altKey && e.key === 'ArrowLeft') {
      e.preventDefault();
      backBtn.click();
    } else if (e.altKey && e.key === 'ArrowRight') {
      e.preventDefault();
      forwardBtn.click();
    } else if (e.altKey && e.key === 'Home') {
      e.preventDefault();
      navigateTo(homePage);
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
      e.preventDefault();
      container.querySelector('#ie-menu-open')?.dispatchEvent(new MouseEvent('click'));
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      openPrintDialog();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      openAddFavoriteDialog();
    }
  };

  window.addEventListener('keydown', handleKeydown);

  // Clean up on window close
  const origClose = win.close.bind(win);
  win.close = () => {
    window.removeEventListener('keydown', handleKeydown);
    origClose();
  };

  // Initial Load: piush.com is default
  renderFavoritesMenu();
  updateUrlHistoryDropdown();
  navigateTo(homePage, true);
}
