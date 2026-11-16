// Piush 95 - The Microsoft Internet Explorer (v3.02 / v4.0) Authentic Simulation
// Full retro web portal, interactive 1995-1998 cyberspace, working search engines,
// favorites manager, history stack, view source, find in page, internet options, and print preview.

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
  { title: 'Piush KS Cyber-Home', url: 'http://piush.com/', category: 'Piush Network', dateAdded: 1 },
  { title: 'Engineering Portfolio', url: 'http://piush.com/work/', category: 'Piush Network', dateAdded: 2 },
  { title: 'Technical Articles & Blog', url: 'http://piush.com/blog/', category: 'Piush Network', dateAdded: 3 },
  { title: '550-Question Developer Quiz', url: 'http://piush.com/quiz/', category: 'Piush Network', dateAdded: 4 },
  { title: 'About the Architect', url: 'http://piush.com/about/', category: 'Piush Network', dateAdded: 5 },
  { title: 'Cyber Guestbook', url: 'http://piush.com/guestbook/', category: 'Piush Network', dateAdded: 6 },
  { title: 'Developer Web Tools', url: 'http://piush.com/tools/', category: 'Piush Network', dateAdded: 7 },
  { title: 'Yahoo! Search & Directory', url: 'http://www.yahoo.com/', category: 'Portals', dateAdded: 8 },
  { title: 'AltaVista Web Search', url: 'http://www.altavista.com/', category: 'Portals', dateAdded: 9 },
  { title: 'GeoCities Neighborhoods', url: 'http://www.geocities.com/', category: 'Portals', dateAdded: 10 },
  { title: 'Space Jam Official (1996)', url: 'http://www.spacejam.com/', category: 'Entertainment', dateAdded: 11 },
  { title: 'Microsoft Corporation', url: 'http://www.microsoft.com/', category: 'Technology', dateAdded: 12 },
  { title: 'CNN Interactive (1995)', url: 'http://www.cnn.com/', category: 'News', dateAdded: 13 },
];

export function renderInternetExplorer(container: HTMLElement, win: Win95Window) {
  // Persistence keys
  const STORAGE_HOMEPAGE = 'win95_ie_homepage';
  const STORAGE_BOOKMARKS = 'win95_ie_favorites_v2';
  const STORAGE_GUESTBOOK = 'win95_ie_guestbook_entries';
  const STORAGE_FONT_SIZE = 'win95_ie_fontsize';

  // Load state
  let homePage = 'http://piush.com/';
  try {
    const savedHome = localStorage.getItem(STORAGE_HOMEPAGE);
    if (savedHome) homePage = savedHome;
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

  // Generate web content dynamically based on URL
  function getPageContent(url: string): { title: string; html: string; rawSource?: string } {
    const cleanUrl = url.trim().toLowerCase();

    // 1. Piush KS Cyber-Home
    if (cleanUrl === 'http://piush.com/' || cleanUrl === 'http://piush.com' || cleanUrl === 'piush.com') {
      return {
        title: 'Piush KS Cyber-Home - Senior Mobile & Cloud Architect',
        html: `
          <div class="space-y-4 font-serif text-black leading-relaxed">
            <!-- Retro Cyber Header Banner -->
            <div class="border-4 border-double border-[#000080] p-3 bg-[#e6e6fa] text-center shadow-[2px_2px_0px_#808080]">
              <div class="text-xs uppercase tracking-widest text-[#000080] font-mono font-bold mb-1">
                ~~~ WELCOME TO CYBERSPACE ~~~
              </div>
              <h1 class="text-2xl font-bold text-[#000080] tracking-wide" style="font-family: 'Times New Roman', serif;">
                Piush KS Cyber-Home
              </h1>
              <p class="text-xs font-mono text-gray-700 mt-1 font-bold">
                Senior Mobile & Cloud Architect | Production Native & Distributed Systems
              </p>
            </div>

            <!-- 90s Marquee Simulation -->
            <div class="bg-[#ffffcc] border border-[#808000] px-2 py-1 text-xs font-mono text-[#800000] overflow-hidden whitespace-nowrap">
              <span class="inline-block animate-marquee font-bold">
                📢 LATEST DISPATCH: Scaled native mobile applications to 10,000,000+ active users with zero downtime! Take the 550-Question Full-Stack Quiz now!
              </span>
            </div>

            <!-- Introduction Paragraph -->
            <p class="text-sm">
              Welcome, fellow traveler of the World Wide Web! You have arrived at the digital headquarters of <strong>Piush KS</strong>. Over the past 8+ years, I have architected and scaled high-performance client applications, cross-platform engines, and resilient cloud infrastructures across Android, iOS, TypeScript, and Go.
            </p>

            <!-- Navigation Matrix Table -->
            <div class="border-2 border-[#808080] bg-[#c0c0c0] p-1.5 shadow-[inset_1px_1px_0px_#ffffff,inset_-1px_-1px_0px_#000000]">
              <div class="bg-[#000080] text-white px-2 py-0.5 text-xs font-bold font-mono uppercase mb-1">
                Directory of Cyber-Destinations
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-1 bg-white border border-[#808080] text-xs">
                <a href="#" class="ie-link block p-2 hover:bg-[#000080] hover:text-white border border-gray-200 group text-blue-800" data-url="http://piush.com/work/">
                  <div class="font-bold underline group-hover:text-white">💼 Engineering Portfolio</div>
                  <div class="text-[11px] text-gray-600 group-hover:text-gray-200">Selected production applications, SDKs, and mobile ecosystems.</div>
                </a>
                <a href="#" class="ie-link block p-2 hover:bg-[#000080] hover:text-white border border-gray-200 group text-blue-800" data-url="http://piush.com/blog/">
                  <div class="font-bold underline group-hover:text-white">📝 Technical Articles & Dispatches</div>
                  <div class="text-[11px] text-gray-600 group-hover:text-gray-200">Architectural deep dives into Flutter, 60 FPS animations, and CRDTs.</div>
                </a>
                <a href="#" class="ie-link block p-2 hover:bg-[#000080] hover:text-white border border-gray-200 group text-blue-800" data-url="http://piush.com/quiz/">
                  <div class="font-bold underline group-hover:text-white">💡 550-Question Developer Quiz</div>
                  <div class="text-[11px] text-gray-600 group-hover:text-gray-200">Comprehensive full-stack challenge across 23 technical categories.</div>
                </a>
                <a href="#" class="ie-link block p-2 hover:bg-[#000080] hover:text-white border border-gray-200 group text-blue-800" data-url="http://piush.com/about/">
                  <div class="font-bold underline group-hover:text-white">👤 About the Engineer & Specs</div>
                  <div class="text-[11px] text-gray-600 group-hover:text-gray-200">Technical certifications, workstation specs, and career timeline.</div>
                </a>
                <a href="#" class="ie-link block p-2 hover:bg-[#000080] hover:text-white border border-gray-200 group text-blue-800" data-url="http://piush.com/guestbook/">
                  <div class="font-bold underline group-hover:text-white">✍️ World Wide Web Guestbook</div>
                  <div class="text-[11px] text-gray-600 group-hover:text-gray-200">Leave your digital signature and greeting for fellow net-surfers.</div>
                </a>
                <a href="#" class="ie-link block p-2 hover:bg-[#000080] hover:text-white border border-gray-200 group text-blue-800" data-url="http://piush.com/tools/">
                  <div class="font-bold underline group-hover:text-white">🛠️ Developer Cyber-Tools</div>
                  <div class="text-[11px] text-gray-600 group-hover:text-gray-200">Built-in ASCII banner generator, hex converters, and timestamp utilities.</div>
                </a>
              </div>
            </div>

            <!-- Technical Highlights Table -->
            <div class="border border-[#808080] p-2 bg-[#f0f8ff] text-xs space-y-1">
              <h3 class="font-bold text-[#000080] border-b border-[#000080] pb-0.5">Core Technical Architectural Competencies:</h3>
              <ul class="list-disc pl-5 space-y-1 text-gray-800">
                <li><strong>Mobile Systems Mastery:</strong> Kotlin, Swift, Flutter, React Native, Jetpack Compose, SwiftUI.</li>
                <li><strong>Distributed Cloud Backends:</strong> Node.js, Go, Python, AWS Lambda, DynamoDB, PostgreSQL, Redis.</li>
                <li><strong>Edge Data Synchronization:</strong> Conflict-free Replicated Data Types (CRDTs) with offline-first indexing.</li>
                <li><strong>High-Frequency Rendering:</strong> Micro-animations engineered to maintain rock-solid 60 FPS on edge hardware.</li>
              </ul>
            </div>

            <!-- Retro Web Badges and Visitor Counter -->
            <div class="pt-2 border-t border-[#808080] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div class="flex items-center gap-2">
                <span class="border border-black bg-black text-[#00ff00] px-2 py-0.5 font-bold tracking-widest">
                  VISITOR #008492
                </span>
                <span class="text-gray-600 text-[11px]">Best viewed in 800x600 resolution</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="bg-[#c0c0c0] border border-white text-black px-1.5 py-0.5 text-[10px] font-bold shadow-[1px_1px_0px_#000000]">
                  🌐 IE 3.0+ READY
                </span>
                <span class="bg-[#000080] text-white px-1.5 py-0.5 text-[10px] font-bold">
                  VALID HTML 3.2
                </span>
              </div>
            </div>
          </div>
        `,
      };
    }

    // 2. Piush KS Engineering Portfolio
    if (cleanUrl === 'http://piush.com/work/' || cleanUrl === 'http://piush.com/work') {
      return {
        title: 'Piush KS - Engineering Projects & Portfolio',
        html: `
          <div class="space-y-4 font-serif text-black leading-relaxed">
            <div class="border-b-2 border-[#000080] pb-2 flex justify-between items-baseline">
              <h1 class="text-xl font-bold text-[#000080]">Engineering Projects Portfolio</h1>
              <a href="#" class="ie-link text-xs font-mono text-blue-800 underline" data-url="http://piush.com/">[Back to Cyber-Home]</a>
            </div>
            <p class="text-xs text-gray-700">
              Selected production systems, mobile architectures, and developer tools engineered by Piush KS.
            </p>

            <!-- Portfolio Table -->
            <div class="border-2 border-[#808080] bg-[#ffffff] text-xs">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="bg-[#c0c0c0] text-black font-bold border-b border-[#808080] text-left">
                    <th class="p-1.5 border-r border-[#808080]">Project Name</th>
                    <th class="p-1.5 border-r border-[#808080]">Architecture</th>
                    <th class="p-1.5 border-r border-[#808080]">Scale / Reach</th>
                    <th class="p-1.5">Key Technical Innovation</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#c0c0c0]">
                  <tr>
                    <td class="p-2 font-bold text-[#000080] border-r border-[#c0c0c0]">Global Fintech Mobile Suite</td>
                    <td class="p-2 font-mono text-[11px] border-r border-[#c0c0c0]">Kotlin, Swift, AWS, DynamoDB</td>
                    <td class="p-2 font-bold text-emerald-800 border-r border-[#c0c0c0]">10,000,000+ Users</td>
                    <td class="p-2">Zero-knowledge secure enclave encryption with sub-second payment settlement.</td>
                  </tr>
                  <tr class="bg-gray-50">
                    <td class="p-2 font-bold text-[#000080] border-r border-[#c0c0c0]">Offline Edge Replication Engine</td>
                    <td class="p-2 font-mono text-[11px] border-r border-[#c0c0c0]">TypeScript, SQLite, CRDT</td>
                    <td class="p-2 font-bold text-blue-800 border-r border-[#c0c0c0]">500,000+ Syncs/day</td>
                    <td class="p-2">State-based conflict resolution ensuring zero data loss during network dropouts.</td>
                  </tr>
                  <tr>
                    <td class="p-2 font-bold text-[#000080] border-r border-[#c0c0c0]">Full-Stack Developer Quiz Engine</td>
                    <td class="p-2 font-mono text-[11px] border-r border-[#c0c0c0]">Astro, React, TypeScript</td>
                    <td class="p-2 font-bold text-purple-800 border-r border-[#c0c0c0]">550 Questions Verified</td>
                    <td class="p-2">Granular skill assessments across 23 domains with live telemetry and zero server cost.</td>
                  </tr>
                  <tr class="bg-gray-50">
                    <td class="p-2 font-bold text-[#000080] border-r border-[#c0c0c0]">Windows 95 Web Hyper-Desktop</td>
                    <td class="p-2 font-mono text-[11px] border-r border-[#c0c0c0]">Web Audio API, Canvas, VFS</td>
                    <td class="p-2 font-bold text-amber-800 border-r border-[#c0c0c0]">Pure Offline Ready</td>
                    <td class="p-2">Authentic 1995 operating system recreation running entirely in modern web runtimes.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="border border-[#808080] bg-[#ffffea] p-2.5 text-xs text-gray-800 space-y-1">
              <span class="font-bold text-[#000080]">Note for Engineering Leaders:</span>
              <p>
                All production systems are engineered with modular micro-frameworks, comprehensive unit/integration test suites, and observability dashboards.
              </p>
            </div>
          </div>
        `,
      };
    }

    // 3. Piush KS Engineering Blog Index
    if (cleanUrl === 'http://piush.com/blog/' || cleanUrl === 'http://piush.com/blog') {
      return {
        title: 'Piush KS - Technical Articles & Dispatches',
        html: `
          <div class="space-y-4 font-serif text-black leading-relaxed">
            <div class="border-b-2 border-[#000080] pb-2 flex justify-between items-baseline">
              <h1 class="text-xl font-bold text-[#000080]">Engineering Articles & Dispatches</h1>
              <a href="#" class="ie-link text-xs font-mono text-blue-800 underline" data-url="http://piush.com/">[Cyber-Home]</a>
            </div>
            <p class="text-xs text-gray-700">
              Architectural dispatches, mobile system performance analysis, and distributed engineering insights.
            </p>

            <div class="space-y-3">
              <div class="border border-[#808080] p-3 bg-white hover:bg-blue-50 transition-colors">
                <div class="flex justify-between text-xs text-gray-500 font-mono mb-1">
                  <span>Architecture & Cross-Platform</span>
                  <span>November 2025</span>
                </div>
                <h3 class="text-base font-bold text-[#000080]">
                  <a href="#" class="ie-link underline" data-url="http://piush.com/blog/flutter-vs-react-native/">
                    React Native vs. Flutter: Production Architectural Trade-Offs
                  </a>
                </h3>
                <p class="text-xs text-gray-700 mt-1">
                  An objective comparison of JNI/Hermes bridging against Skia/Impeller direct canvas rasterization when delivering mission-critical applications at scale.
                </p>
              </div>

              <div class="border border-[#808080] p-3 bg-white hover:bg-blue-50 transition-colors">
                <div class="flex justify-between text-xs text-gray-500 font-mono mb-1">
                  <span>UI Rendering & Graphics</span>
                  <span>October 2025</span>
                </div>
                <h3 class="text-base font-bold text-[#000080]">
                  <a href="#" class="ie-link underline" data-url="http://piush.com/blog/60fps-animations/">
                    Micro-Animations That Don't Ruin 60 FPS on Mobile Devices
                  </a>
                </h3>
                <p class="text-xs text-gray-700 mt-1">
                  Taming GPU overhead, avoiding main-thread layout thrashing, and orchestrating native transform matrices for fluid UI transitions.
                </p>
              </div>

              <div class="border border-[#808080] p-3 bg-white hover:bg-blue-50 transition-colors">
                <div class="flex justify-between text-xs text-gray-500 font-mono mb-1">
                  <span>Distributed Systems & Offline Sync</span>
                  <span>September 2025</span>
                </div>
                <h3 class="text-base font-bold text-[#000080]">
                  <a href="#" class="ie-link underline" data-url="http://piush.com/blog/offline-crdt-sync/">
                    Mastering Offline-First Synchronization with CRDTs
                  </a>
                </h3>
                <p class="text-xs text-gray-700 mt-1">
                  Implementing state-based conflict-free replicated data types in SQLite and TypeScript for fault-tolerant mobile clients.
                </p>
              </div>
            </div>
          </div>
        `,
      };
    }

    // 3a. Blog Article: Flutter vs React Native
    if (cleanUrl === 'http://piush.com/blog/flutter-vs-react-native/') {
      return {
        title: 'React Native vs. Flutter: Production Architectural Trade-Offs',
        html: `
          <div class="space-y-3 font-serif text-black leading-relaxed">
            <div class="border-b border-[#000080] pb-1 flex justify-between items-baseline">
              <span class="text-xs font-mono text-gray-600">Engineering Dispatches > Cross-Platform Systems</span>
              <a href="#" class="ie-link text-xs font-mono text-blue-800 underline" data-url="http://piush.com/blog/">[Back to Articles]</a>
            </div>
            <h1 class="text-lg font-bold text-[#000080]">React Native vs. Flutter: Production Architectural Trade-Offs</h1>
            <p class="text-xs text-gray-500 font-mono">Published by Piush KS | Senior Architect</p>
            <div class="border-t border-b border-[#808080] py-2 my-2 text-xs leading-relaxed space-y-2">
              <p>
                When selecting an enterprise cross-platform framework, teams frequently debate developer ergonomics while overlooking the foundational rendering pipeline.
              </p>
              <h3 class="font-bold text-[#000080]">The React Native Architecture (Hermes & Fabric)</h3>
              <p>
                Modern React Native relies on the Hermes JavaScript engine and the Fabric C++ rendering core via JSI (JavaScript Interface). While eliminating the legacy JSON serialization bridge, Fabric still maps virtual elements into platform-native Android Views and iOS UIViews.
              </p>
              <h3 class="font-bold text-[#000080]">The Flutter Architecture (Impeller & Skia)</h3>
              <p>
                Flutter takes total control of the framebuffer. Instead of delegating to OEM controls, Dart code compiles ahead-of-time (AOT) to native machine code and renders pixels directly via Impeller on Metal (iOS) and Vulkan/OpenGL (Android).
              </p>
              <div class="bg-[#f0f8ff] border border-[#808080] p-2 font-mono text-[11px]">
                Verdict: For apps requiring absolute pixel fidelity and predictable frame budgets under heavy animation, Flutter's direct GPU canvas wins. For apps requiring deep native OS integration and code-sharing with web React codebases, React Native Fabric remains supreme.
              </div>
            </div>
          </div>
        `,
      };
    }

    // 3b. Blog Article: 60 FPS
    if (cleanUrl === 'http://piush.com/blog/60fps-animations/') {
      return {
        title: 'Micro-Animations That Don\'t Ruin 60 FPS on Mobile Devices',
        html: `
          <div class="space-y-3 font-serif text-black leading-relaxed">
            <div class="border-b border-[#000080] pb-1 flex justify-between items-baseline">
              <span class="text-xs font-mono text-gray-600">Engineering Dispatches > Graphics Performance</span>
              <a href="#" class="ie-link text-xs font-mono text-blue-800 underline" data-url="http://piush.com/blog/">[Back to Articles]</a>
            </div>
            <h1 class="text-lg font-bold text-[#000080]">Micro-Animations That Don't Ruin 60 FPS on Mobile Devices</h1>
            <p class="text-xs text-gray-500 font-mono">Published by Piush KS | Senior Architect</p>
            <div class="border-t border-b border-[#808080] py-2 my-2 text-xs leading-relaxed space-y-2">
              <p>
                Every mobile engineer knows the cardinal rule: 16.6 milliseconds is all you get per frame. Drop below that, and jank destroys user delight.
              </p>
              <h3 class="font-bold text-[#000080]">Rule 1: Stick to Composite-Only Properties</h3>
              <p>
                Never animate properties that cause Reflow (layout calculation) or Repaint. In both Web and React Native/Flutter, stick strictly to <code>transform</code> and <code>opacity</code>.
              </p>
              <h3 class="font-bold text-[#000080]">Rule 2: Decouple Gestures from Business Logic</h3>
              <p>
                Ensure pan/drag gesture handlers compute on the native UI thread (e.g. Flutter RenderObject or React Native Reanimated worklets) without crossing the JavaScript/Dart VM barrier on every tick.
              </p>
            </div>
          </div>
        `,
      };
    }

    // 3c. Blog Article: CRDTs
    if (cleanUrl === 'http://piush.com/blog/offline-crdt-sync/') {
      return {
        title: 'Mastering Offline-First Synchronization with CRDTs',
        html: `
          <div class="space-y-3 font-serif text-black leading-relaxed">
            <div class="border-b border-[#000080] pb-1 flex justify-between items-baseline">
              <span class="text-xs font-mono text-gray-600">Engineering Dispatches > Distributed Systems</span>
              <a href="#" class="ie-link text-xs font-mono text-blue-800 underline" data-url="http://piush.com/blog/">[Back to Articles]</a>
            </div>
            <h1 class="text-lg font-bold text-[#000080]">Mastering Offline-First Synchronization with CRDTs</h1>
            <p class="text-xs text-gray-500 font-mono">Published by Piush KS | Senior Architect</p>
            <div class="border-t border-b border-[#808080] py-2 my-2 text-xs leading-relaxed space-y-2">
              <p>
                Building reliable mobile systems means assuming the network is hostile, flaky, or completely absent. Last-Write-Wins (LWW) timestamps fail due to clock drift.
              </p>
              <h3 class="font-bold text-[#000080]">State-based vs. Operation-based CRDTs</h3>
              <p>
                State-based CRDTs (CvRDTs) send their full state or delta to peers, merging via a join-semilattice. Operation-based CRDTs (CmRDTs) send commutative edit operations. For mobile apps with intermittent connectivity, Delta-State CRDTs minimize network bandwidth while guaranteeing convergence.
              </p>
            </div>
          </div>
        `,
      };
    }

    // 4. About the Engineer
    if (cleanUrl === 'http://piush.com/about/' || cleanUrl === 'http://piush.com/about') {
      return {
        title: 'About Piush KS - Engineering Profile & Credentials',
        html: `
          <div class="space-y-4 font-serif text-black leading-relaxed">
            <div class="border-b-2 border-[#000080] pb-2 flex justify-between items-baseline">
              <h1 class="text-xl font-bold text-[#000080]">About Piush KS</h1>
              <a href="#" class="ie-link text-xs font-mono text-blue-800 underline" data-url="http://piush.com/">[Cyber-Home]</a>
            </div>
            <p class="text-xs leading-relaxed">
              Senior Mobile & Cloud Architect with extensive experience designing, deploying, and maintaining high-throughput mobile ecosystems and distributed cloud backends.
            </p>

            <div class="border-2 border-[#808080] bg-[#f0f0f0] p-3 text-xs space-y-2 font-mono">
              <div class="font-bold text-[#000080] border-b border-[#808080] pb-1 uppercase">
                System Operator Dossier
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div><span class="text-gray-600">Handle / Identity:</span> Piush KS</div>
                <div><span class="text-gray-600">Discipline:</span> Mobile & Cloud Architecture</div>
                <div><span class="text-gray-600">Production Experience:</span> 8+ Years</div>
                <div><span class="text-gray-600">Global Reach:</span> 10,000,000+ Active Users</div>
                <div><span class="text-gray-600">Primary Core:</span> Kotlin, Swift, Flutter, React, TypeScript</div>
                <div><span class="text-gray-600">Backend Cloud:</span> AWS, Node.js, Go, PostgreSQL, Redis</div>
              </div>
            </div>

            <div class="border border-[#808080] p-2 bg-[#ffffea] text-xs">
              <span class="font-bold text-[#000080]">Engineering Philosophy:</span>
              <p class="mt-1 text-gray-800">
                Software should be rock-solid, performant, and respectful of the user's hardware. Clean architectural separation between Domain Logic, UI Presentation, and Data Persistence guarantees decade-long maintainability.
              </p>
            </div>
          </div>
        `,
      };
    }

    // 5. Quiz Overview
    if (cleanUrl === 'http://piush.com/quiz/' || cleanUrl === 'http://piush.com/quiz') {
      return {
        title: '550-Question Full-Stack Developer Quiz Engine',
        html: `
          <div class="space-y-4 font-serif text-black leading-relaxed">
            <div class="border-b-2 border-[#000080] pb-2 flex justify-between items-baseline">
              <h1 class="text-xl font-bold text-[#000080]">550-Question Developer Quiz Engine</h1>
              <a href="#" class="ie-link text-xs font-mono text-blue-800 underline" data-url="http://piush.com/">[Cyber-Home]</a>
            </div>
            <p class="text-xs text-gray-700">
              The premier verification engine for software engineers. Test your deep technical knowledge across 23 domains.
            </p>

            <div class="border-2 border-[#808080] bg-[#ffffff] p-3 text-xs space-y-2">
              <div class="font-bold text-[#000080]">Sample Challenge Question:</div>
              <div class="p-2 bg-[#f0f8ff] border border-[#808080] space-y-1">
                <p class="font-bold">Q: In Flutter, what is the primary architectural difference between Impeller and Skia?</p>
                <div class="space-y-0.5 text-[11px] pl-2 font-mono">
                  <div>[A] Impeller compiles all shaders offline AOT to eliminate runtime shader jank.</div>
                  <div>[B] Impeller uses CPU rasterization instead of GPU compute.</div>
                  <div>[C] Impeller requires Hermes JavaScript runtime.</div>
                  <div>[D] Impeller only works on desktop operating systems.</div>
                </div>
                <div class="text-[11px] text-emerald-800 font-bold mt-1">
                  ✓ Correct Answer: [A] Impeller compiles shaders AOT to banish jank.
                </div>
              </div>
            </div>

            <div class="border border-[#808080] bg-[#c0c0c0] p-2 text-center shadow-[inset_1px_1px_0px_#ffffff]">
              <p class="text-xs font-bold mb-1.5">Ready to take the full 550-question challenge on your desktop?</p>
              <button id="ie-open-quiz-app" class="retro-btn !py-1 !px-4 text-xs font-bold text-[#000080]">
                ⚡ Launch Quiz.exe Application Now
              </button>
            </div>
          </div>
        `,
      };
    }

    // 6. Interactive Guestbook
    if (cleanUrl === 'http://piush.com/guestbook/' || cleanUrl === 'http://piush.com/guestbook') {
      const entriesHtml = guestbookEntries
        .map(
          (entry) => `
            <div class="border-b border-[#808080] pb-2 text-xs space-y-0.5 font-serif">
              <div class="flex justify-between items-baseline font-bold text-[#000080]">
                <span>${entry.name} <span class="font-normal text-gray-600 text-[11px]">(${entry.location})</span></span>
                <span class="font-mono text-[10px] text-gray-500">${entry.date}</span>
              </div>
              <p class="text-gray-800 italic">"${entry.message}"</p>
            </div>
          `
        )
        .join('');

      return {
        title: 'Piush KS Cyber-Guestbook - Sign and Read',
        html: `
          <div class="space-y-4 font-serif text-black leading-relaxed">
            <div class="border-b-2 border-[#000080] pb-2 flex justify-between items-baseline">
              <h1 class="text-xl font-bold text-[#000080]">World Wide Web Guestbook</h1>
              <a href="#" class="ie-link text-xs font-mono text-blue-800 underline" data-url="http://piush.com/">[Cyber-Home]</a>
            </div>
            <p class="text-xs text-gray-700">
              Welcome to the digital ledger. Leave your comments, feedback, or greetings for Piush KS and the cyber community!
            </p>

            <!-- Sign Form -->
            <div class="border-2 border-[#808080] bg-[#c0c0c0] p-2.5 shadow-[inset_1px_1px_0px_#ffffff]">
              <div class="text-xs font-bold text-[#000080] mb-2 uppercase font-mono">Sign the Guestbook</div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2">
                <div>
                  <label class="block text-[11px] font-bold mb-0.5">Your Name or Handle:</label>
                  <input type="text" id="gb-name" placeholder="e.g. CyberPioneer95" class="retro-inset w-full px-2 py-0.5 bg-white text-xs" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold mb-0.5">Your Location / City:</label>
                  <input type="text" id="gb-loc" placeholder="e.g. Tokyo, Japan" class="retro-inset w-full px-2 py-0.5 bg-white text-xs" />
                </div>
              </div>
              <div class="mb-2">
                <label class="block text-[11px] font-bold mb-0.5">Your Message:</label>
                <textarea id="gb-msg" rows="2" placeholder="Leave your mark on the web..." class="retro-inset w-full px-2 py-0.5 bg-white text-xs"></textarea>
              </div>
              <div class="flex justify-end gap-2">
                <button type="button" id="gb-submit-btn" class="retro-btn !py-0.5 !px-3 text-xs font-bold">
                  ✍️ Sign Guestbook
                </button>
              </div>
            </div>

            <!-- Existing Entries -->
            <div class="border border-[#808080] bg-white p-3 space-y-3">
              <div class="text-xs font-bold text-[#000080] border-b border-[#000080] pb-1 uppercase font-mono">
                Recent Signatures (${guestbookEntries.length})
              </div>
              <div class="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                ${entriesHtml}
              </div>
            </div>
          </div>
        `,
      };
    }

    // 7. Developer Web Tools
    if (cleanUrl === 'http://piush.com/tools/' || cleanUrl === 'http://piush.com/tools') {
      return {
        title: 'Developer Cyber-Tools - Online Utilities',
        html: `
          <div class="space-y-4 font-serif text-black leading-relaxed">
            <div class="border-b-2 border-[#000080] pb-2 flex justify-between items-baseline">
              <h1 class="text-xl font-bold text-[#000080]">Developer Cyber-Tools & Utilities</h1>
              <a href="#" class="ie-link text-xs font-mono text-blue-800 underline" data-url="http://piush.com/">[Cyber-Home]</a>
            </div>
            <p class="text-xs text-gray-700">
              Handy developer utilities designed to run directly within the Internet Explorer viewport.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <!-- ASCII Text Banner Tool -->
              <div class="border-2 border-[#808080] bg-[#c0c0c0] p-2 space-y-1.5 shadow-[inset_1px_1px_0px_#ffffff]">
                <div class="font-bold text-[#000080] uppercase">ASCII Banner Generator</div>
                <input type="text" id="tool-ascii-in" value="WIN95" class="retro-inset w-full px-1.5 py-0.5 bg-white text-xs" />
                <button id="tool-ascii-btn" class="retro-btn !py-0.5 !px-2 text-xs font-bold w-full">Generate Banner</button>
                <pre id="tool-ascii-out" class="retro-inset p-1.5 bg-black text-[#00ff00] text-[9px] overflow-x-auto whitespace-pre font-mono">
 _ _ _ _ _____ _____ ___ _____ 
| | | | |     |   | | | |  ___|
| | | | |-   -| | | |9| |___  |
|_____|_|_____|_|___|_| |_____|
                </pre>
              </div>

              <!-- Base64 Encoder / Decoder -->
              <div class="border-2 border-[#808080] bg-[#c0c0c0] p-2 space-y-1.5 shadow-[inset_1px_1px_0px_#ffffff]">
                <div class="font-bold text-[#000080] uppercase">Base64 Converter</div>
                <input type="text" id="tool-b64-in" value="Piush KS Architect" class="retro-inset w-full px-1.5 py-0.5 bg-white text-xs" />
                <div class="flex gap-1">
                  <button id="tool-b64-enc" class="retro-btn !py-0.5 !px-2 text-xs flex-1">Encode</button>
                  <button id="tool-b64-dec" class="retro-btn !py-0.5 !px-2 text-xs flex-1">Decode</button>
                </div>
                <input type="text" id="tool-b64-out" readonly class="retro-inset w-full px-1.5 py-0.5 bg-gray-100 text-xs text-blue-900 font-bold" />
              </div>

              <!-- Hex to RGB Converter -->
              <div class="border-2 border-[#808080] bg-[#c0c0c0] p-2 space-y-1.5 shadow-[inset_1px_1px_0px_#ffffff]">
                <div class="font-bold text-[#000080] uppercase">Hex Color to RGB</div>
                <input type="text" id="tool-hex-in" value="#000080" class="retro-inset w-full px-1.5 py-0.5 bg-white text-xs" />
                <button id="tool-hex-btn" class="retro-btn !py-0.5 !px-2 text-xs font-bold w-full">Convert Color</button>
                <div id="tool-hex-out" class="retro-inset p-1.5 bg-white text-[11px] font-bold text-gray-800">
                  rgb(0, 0, 128) - Navy Blue
                </div>
              </div>

              <!-- Unix Epoch Converter -->
              <div class="border-2 border-[#808080] bg-[#c0c0c0] p-2 space-y-1.5 shadow-[inset_1px_1px_0px_#ffffff]">
                <div class="font-bold text-[#000080] uppercase">Epoch Timestamp</div>
                <button id="tool-epoch-btn" class="retro-btn !py-0.5 !px-2 text-xs font-bold w-full">Get Current Timestamp</button>
                <div id="tool-epoch-out" class="retro-inset p-1.5 bg-white text-[11px] font-bold text-gray-800">
                  Click button to inspect epoch time.
                </div>
              </div>
            </div>
          </div>
        `,
      };
    }

    // 8. Yahoo! (1995 Authentic Retro Portal & Search Engine)
    if (cleanUrl.startsWith('http://www.yahoo.com') || cleanUrl.startsWith('www.yahoo.com') || cleanUrl.startsWith('yahoo.com')) {
      // Check for search query parameter
      const queryMatch = url.match(/[?&]p=([^&]+)/i);
      const query = queryMatch ? decodeURIComponent(queryMatch[1]).replace(/\+/g, ' ') : '';

      if (query) {
        // Return simulated search results
        const results = searchWebDatabase(query);
        return {
          title: `Yahoo! Search Results: ${query}`,
          html: `
            <div class="space-y-3 font-serif text-black leading-relaxed">
              <div class="flex items-center gap-2 border-b-2 border-red-700 pb-2">
                <span class="text-2xl font-bold tracking-tighter text-red-700 font-serif italic">YAHOO!</span>
                <span class="text-xs text-gray-600 font-mono">Search Results</span>
                <div class="ml-auto">
                  <a href="#" class="ie-link text-xs font-mono text-blue-800 underline" data-url="http://www.yahoo.com/">[Yahoo! Main]</a>
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
                    ? `
                      <div class="p-4 border border-dashed border-[#808080] text-center text-xs text-gray-600 space-y-1">
                        <p class="font-bold">No direct web pages matched "${query}".</p>
                        <p>Try searching for keywords like <em>mobile</em>, <em>portfolio</em>, <em>quiz</em>, <em>space</em>, <em>crdt</em>, or <em>geocities</em>.</p>
                      </div>
                    `
                    : results
                        .map(
                          (res) => `
                            <div class="border-b border-gray-200 pb-2 text-xs space-y-0.5">
                              <div>
                                👉 <a href="#" class="ie-link text-blue-800 underline font-bold text-sm" data-url="${res.url}">${res.title}</a>
                              </div>
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

      // Default Yahoo! Directory Page
      return {
        title: 'Yahoo!',
        html: `
          <div class="space-y-3 font-serif text-black leading-relaxed">
            <!-- Header -->
            <div class="text-center border-b-2 border-red-700 pb-2">
              <h1 class="text-3xl font-extrabold tracking-tighter text-red-700 font-serif italic">YAHOO!</h1>
              <p class="text-xs text-gray-600 font-mono">Guide to the World Wide Web</p>
            </div>

            <!-- Search Form -->
            <div class="bg-[#f0f0f0] border-2 border-[#808080] p-2 text-center space-y-1.5 shadow-[inset_1px_1px_0px_#ffffff]">
              <div class="flex justify-center items-center gap-2 max-w-md mx-auto">
                <input type="text" id="yahoo-query-box" placeholder="What are you searching for today?" class="retro-inset flex-1 px-2 py-0.5 bg-white text-xs font-mono" />
                <button id="yahoo-search-btn" class="retro-btn !py-0.5 !px-3 text-xs font-bold">Search</button>
              </div>
              <div class="text-[10px] text-gray-600 font-mono">
                [ <a href="#" class="ie-link text-blue-800 underline" data-url="http://www.yahoo.com/?p=mobile+architecture">Mobile</a> |
                  <a href="#" class="ie-link text-blue-800 underline" data-url="http://www.yahoo.com/?p=full+stack+quiz">Developer Quiz</a> |
                  <a href="#" class="ie-link text-blue-800 underline" data-url="http://www.yahoo.com/?p=space+jam">Space Jam</a> |
                  <a href="#" class="ie-link text-blue-800 underline" data-url="http://www.yahoo.com/?p=geocities">GeoCities</a> ]
              </div>
            </div>

            <!-- 14 Classic Yahoo Categories -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs pt-1">
              <div>
                <a href="#" class="ie-link font-bold text-blue-800 underline" data-url="http://www.yahoo.com/?p=arts">Arts & Humanities</a>
                <span class="text-gray-600 text-[11px]"> - Photography, History, Literature...</span>
              </div>
              <div>
                <a href="#" class="ie-link font-bold text-blue-800 underline" data-url="http://www.yahoo.com/?p=business">Business & Economy</a>
                <span class="text-gray-600 text-[11px]"> - Markets, Investments, Startups...</span>
              </div>
              <div>
                <a href="#" class="ie-link font-bold text-blue-800 underline" data-url="http://www.yahoo.com/?p=computers">Computers & Internet</a>
                <span class="text-gray-600 text-[11px]"> - Internet, Software, Mobile, Cloud...</span>
              </div>
              <div>
                <a href="#" class="ie-link font-bold text-blue-800 underline" data-url="http://www.yahoo.com/?p=education">Education</a>
                <span class="text-gray-600 text-[11px]"> - Universities, Courses, K-12...</span>
              </div>
              <div>
                <a href="#" class="ie-link font-bold text-blue-800 underline" data-url="http://www.yahoo.com/?p=entertainment">Entertainment</a>
                <span class="text-gray-600 text-[11px]"> - Cool Links, Movies, Music, Space Jam...</span>
              </div>
              <div>
                <a href="#" class="ie-link font-bold text-blue-800 underline" data-url="http://www.yahoo.com/?p=government">Government</a>
                <span class="text-gray-600 text-[11px]"> - Agencies, Law, Policy, Military...</span>
              </div>
              <div>
                <a href="#" class="ie-link font-bold text-blue-800 underline" data-url="http://www.yahoo.com/?p=health">Health & Medicine</a>
                <span class="text-gray-600 text-[11px]"> - Fitness, Nutrition, Pharmacology...</span>
              </div>
              <div>
                <a href="#" class="ie-link font-bold text-blue-800 underline" data-url="http://www.yahoo.com/?p=news">News & Media</a>
                <span class="text-gray-600 text-[11px]"> - Current Events, CNN, Newspapers...</span>
              </div>
              <div>
                <a href="#" class="ie-link font-bold text-blue-800 underline" data-url="http://www.yahoo.com/?p=recreation">Recreation & Sports</a>
                <span class="text-gray-600 text-[11px]"> - Games, Basketball, Outdoors...</span>
              </div>
              <div>
                <a href="#" class="ie-link font-bold text-blue-800 underline" data-url="http://www.yahoo.com/?p=science">Science</a>
                <span class="text-gray-600 text-[11px]"> - Astronomy, Physics, Biology, Space...</span>
              </div>
            </div>

            <!-- Footer -->
            <div class="border-t border-[#808080] pt-2 text-center text-[10px] text-gray-500 font-mono">
              Copyright © 1995 Yahoo! Inc. All rights reserved. Text-only version available.
            </div>
          </div>
        `,
      };
    }

    // 9. AltaVista (Digital Equipment Corporation 1995)
    if (cleanUrl.startsWith('http://www.altavista.com') || cleanUrl.startsWith('www.altavista.com') || cleanUrl.startsWith('altavista.com')) {
      const queryMatch = url.match(/[?&]q=([^&]+)/i);
      const query = queryMatch ? decodeURIComponent(queryMatch[1]).replace(/\+/g, ' ') : '';

      return {
        title: 'AltaVista: Main Page',
        html: `
          <div class="space-y-4 font-serif text-black leading-relaxed">
            <div class="border-b-4 border-[#000080] pb-2 flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-bold tracking-tight text-[#000080]" style="font-family: Arial, sans-serif;">
                  ALTAVISTA <span class="text-xs text-red-600 font-mono font-normal">Search</span>
                </div>
                <div class="text-[10px] text-gray-500 font-mono">OnSite.Knowledge by Digital Equipment Corp.</div>
              </div>
              <div class="border border-black px-2 py-0.5 bg-[#e0e0e0] text-[10px] font-mono font-bold">
                Alpha 64-bit Powered
              </div>
            </div>

            <div class="bg-[#f5f5f5] border border-[#808080] p-3 space-y-2">
              <div class="text-xs font-bold text-gray-800">Search the Web and Display the Results in Standard Form:</div>
              <div class="flex gap-2">
                <input type="text" id="av-query-box" value="${query}" placeholder="Submit keyword query..." class="retro-inset flex-1 px-2 py-0.5 bg-white text-xs font-mono" />
                <button id="av-submit-btn" class="retro-btn !py-0.5 !px-4 text-xs font-bold">Submit</button>
              </div>
            </div>

            ${
              query
                ? `
                  <div class="text-xs font-mono text-gray-700">
                    Results for <strong>${query}</strong> indexed across 30,000,000 documents:
                  </div>
                  <div class="space-y-3 pt-1">
                    ${searchWebDatabase(query)
                      .map(
                        (res) => `
                          <div class="border-b border-gray-200 pb-2 text-xs space-y-0.5">
                            <div><a href="#" class="ie-link text-blue-800 underline font-bold" data-url="${res.url}">${res.title}</a></div>
                            <div class="text-gray-700">${res.snippet}</div>
                            <div class="text-[10px] text-green-800 font-mono">${res.url}</div>
                          </div>
                        `
                      )
                      .join('')}
                  </div>
                `
                : `
                  <div class="p-3 border border-gray-300 text-xs space-y-1.5 bg-[#fafafa]">
                    <div class="font-bold text-[#000080]">AltaVista Quick Tips:</div>
                    <ul class="list-disc pl-5 space-y-1 text-gray-600 text-[11px]">
                      <li>Use quotes for exact phrase searches, e.g. <code>"mobile architecture"</code></li>
                      <li>Use the <code>+</code> symbol to require terms, e.g. <code>+flutter +skia</code></li>
                      <li>AltaVista indexes every single word on every page on the Web!</li>
                    </ul>
                  </div>
                `
            }
          </div>
        `,
      };
    }

    // 10. GeoCities (1996)
    if (cleanUrl.startsWith('http://www.geocities.com') || cleanUrl.startsWith('www.geocities.com') || cleanUrl.startsWith('geocities.com')) {
      return {
        title: 'Welcome to GeoCities! The Largest Web Community in Cyberspace',
        html: `
          <div class="space-y-4 font-serif text-black leading-relaxed">
            <div class="border-4 border-double border-[#ff00ff] p-2 bg-[#000033] text-center text-white">
              <h1 class="text-2xl font-bold tracking-widest text-[#ffff00] animate-pulse" style="font-family: 'Comic Sans MS', cursive, sans-serif;">
                ✨ GeoCities Neighborhoods ✨
              </h1>
              <p class="text-xs text-[#00ffff] font-mono">Home of 500,000+ Free Web Homesteads on the Net!</p>
            </div>

            <!-- Under Construction Banner -->
            <div class="border-2 border-yellow-500 bg-yellow-100 p-2 text-center text-xs font-mono font-bold text-amber-900 flex items-center justify-center gap-2">
              <span>🚧</span>
              <span>UNDER CONSTRUCTION - HARD HATS REQUIRED</span>
              <span>🚧</span>
            </div>

            <p class="text-xs leading-relaxed">
              Welcome to the World's First Internet Neighborhood Community! Choose your neighborhood to browse real homepages created by citizens of cyberspace:
            </p>

            <!-- Neighborhoods Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div class="border-2 border-[#808080] p-2 bg-[#f0f8ff] space-y-1">
                <div class="font-bold text-[#000080] flex items-center gap-1">
                  💻 SiliconValley
                </div>
                <p class="text-[11px] text-gray-700">Hardware, software, coding, Linux, and high tech.</p>
                <a href="#" class="ie-link text-[11px] text-blue-800 underline font-bold" data-url="http://piush.com/">Visit Piush KS Homestead</a>
              </div>

              <div class="border-2 border-[#808080] p-2 bg-[#fff0f5] space-y-1">
                <div class="font-bold text-purple-900 flex items-center gap-1">
                  🚀 CapeCanaveral
                </div>
                <p class="text-[11px] text-gray-700">Aviation, astronomy, NASA shuttle missions, and rocketry.</p>
                <a href="#" class="ie-link text-[11px] text-blue-800 underline font-bold" data-url="http://www.spacejam.com/">Visit Space Jam Base</a>
              </div>

              <div class="border-2 border-[#808080] p-2 bg-[#f5fffa] space-y-1">
                <div class="font-bold text-emerald-900 flex items-center gap-1">
                  🎬 Hollywood
                </div>
                <p class="text-[11px] text-gray-700">Movies, TV, actors, soundtrack reviews, and fan clubs.</p>
                <a href="#" class="ie-link text-[11px] text-blue-800 underline font-bold" data-url="http://www.spacejam.com/">Visit Warner Bros Lot</a>
              </div>

              <div class="border-2 border-[#808080] p-2 bg-[#fffff0] space-y-1">
                <div class="font-bold text-amber-900 flex items-center gap-1">
                  🏡 Heartland
                </div>
                <p class="text-[11px] text-gray-700">Hometowns, pets, family albums, and gardening tips.</p>
                <a href="#" class="ie-link text-[11px] text-blue-800 underline font-bold" data-url="http://piush.com/guestbook/">Visit Guestbook Homestead</a>
              </div>
            </div>

            <!-- Dancing Baby / Retro Badges Footer -->
            <div class="border-t border-[#808080] pt-2 flex justify-between items-center text-[10px] text-gray-500 font-mono">
              <div>Visitors: <span class="bg-black text-[#00ff00] px-1 font-bold">042,109</span></div>
              <div class="flex gap-1">
                <span class="border border-black bg-blue-100 px-1">Internet Explorer 3.0</span>
                <span class="border border-black bg-purple-100 px-1">Netscape Gold</span>
              </div>
            </div>
          </div>
        `,
      };
    }

    // 11. Space Jam (1996 Official Iconic Site)
    if (cleanUrl.startsWith('http://www.spacejam.com') || cleanUrl.startsWith('www.spacejam.com') || cleanUrl.startsWith('spacejam.com')) {
      return {
        title: 'Space Jam - Official Warner Bros Site 1996',
        html: `
          <div class="space-y-4 font-serif text-white bg-black p-4 -m-4 min-h-full leading-relaxed select-text" style="background-color: #000000; color: #ffffff;">
            <!-- Space Jam Header -->
            <div class="text-center space-y-1">
              <h1 class="text-3xl font-extrabold tracking-widest text-[#ffcc00] font-sans drop-shadow-[0_2px_4px_rgba(255,0,0,0.8)]">
                SPACE JAM
              </h1>
              <p class="text-xs text-[#00ffff] font-mono tracking-wider">
                WARNER BROS. PRESENTS THE OFFICIAL SITE (1996)
              </p>
            </div>

            <!-- Planetary Navigation Links -->
            <div class="border-2 border-[#000080] p-4 bg-[#0a0a20] rounded text-center space-y-3 shadow-[0_0_15px_rgba(0,100,255,0.5)]">
              <p class="text-xs text-yellow-300 font-mono">CLICK ON A PLANET TO EXPLORE:</p>
              <div class="flex flex-wrap justify-center gap-3 text-xs font-bold font-sans">
                <a href="#" class="ie-link px-3 py-1 bg-red-800 text-white rounded hover:bg-red-700 border border-yellow-400" data-url="http://www.spacejam.com/lineup">
                  🏀 The Lineup
                </a>
                <a href="#" class="ie-link px-3 py-1 bg-blue-800 text-white rounded hover:bg-blue-700 border border-yellow-400" data-url="http://www.spacejam.com/jamcentral">
                  ⭐ Jam Central
                </a>
                <a href="#" class="ie-link px-3 py-1 bg-purple-800 text-white rounded hover:bg-purple-700 border border-yellow-400" data-url="http://www.spacejam.com/souvenirs">
                  🎁 Stellar Souvenirs
                </a>
                <a href="#" class="ie-link px-3 py-1 bg-emerald-800 text-white rounded hover:bg-emerald-700 border border-yellow-400" data-url="http://www.spacejam.com/junior">
                  🚀 Junior Jam
                </a>
              </div>
            </div>

            <!-- Synopsis -->
            <div class="border border-gray-700 p-3 bg-gray-900 text-xs space-y-2">
              <div class="font-bold text-yellow-400 font-sans uppercase">Movie Transmission:</div>
              <p class="text-gray-300 text-[11px] leading-relaxed">
                Swackhammer, an evil alien theme park owner, is desperate for new attractions. He sends his tiny minions, the Nerdlucks, to capture Bugs Bunny and the Looney Tunes! To win their freedom, the Tunes challenge the aliens to a basketball showdown. But when the aliens steal the talent of NBA superstars, Bugs enlists the ultimate secret weapon: <strong>Michael Jordan!</strong>
              </p>
            </div>

            <!-- Soundtrack Tracklist -->
            <div class="border border-gray-700 p-2 text-xs font-mono space-y-1 text-gray-400">
              <div class="text-yellow-400 font-bold">Official Soundtrack Highlights:</div>
              <div>1. "Space Jam" - Quad City DJ's</div>
              <div>2. "Fly Like an Eagle" - Seal</div>
              <div>3. "I Believe I Can Fly" - R. Kelly</div>
              <div>4. "Hit 'Em High" - B-Real, Coolio, Method Man, LL Cool J, Busta Rhymes</div>
            </div>

            <div class="text-center pt-2">
              <a href="#" class="ie-link text-xs text-yellow-400 underline font-mono" data-url="http://piush.com/">
                [Return to Piush KS Cyber-Home]
              </a>
            </div>
          </div>
        `,
      };
    }

    // 12. Microsoft Corporation (1995)
    if (cleanUrl.startsWith('http://www.microsoft.com') || cleanUrl.startsWith('www.microsoft.com') || cleanUrl.startsWith('microsoft.com')) {
      return {
        title: 'Microsoft Corporation - World Wide Web Server',
        html: `
          <div class="space-y-4 font-serif text-black leading-relaxed">
            <div class="border-b-2 border-black pb-2 flex justify-between items-center">
              <div>
                <h1 class="text-2xl font-bold tracking-tight text-black" style="font-family: Arial, sans-serif;">
                  Microsoft<span class="text-xs font-normal">®</span>
                </h1>
                <div class="text-xs text-gray-600 font-mono italic">Where do you want to go today?™</div>
              </div>
              <div class="border border-black px-2 py-0.5 bg-[#000080] text-white text-xs font-mono font-bold">
                Windows 95
              </div>
            </div>

            <!-- Windows 95 Launch Headline -->
            <div class="border-2 border-[#808080] bg-[#e6e6fa] p-3 space-y-2 shadow-[2px_2px_0px_#000000]">
              <h2 class="text-lg font-bold text-[#000080]">Windows 95 Has Arrived!</h2>
              <p class="text-xs">
                Microsoft officially introduces Windows 95, bringing 32-bit preemptive multitasking, Plug and Play hardware support, and the revolutionary Start Menu to personal computing worldwide.
              </p>
              <div class="pt-1 flex gap-2">
                <a href="#" class="ie-link retro-btn !py-0.5 !px-3 text-xs font-bold" data-url="http://piush.com/">
                  Return to Desktop
                </a>
              </div>
            </div>

            <!-- Internet Explorer 3.0 Spotlight -->
            <div class="border border-[#808080] p-3 bg-white space-y-1.5 text-xs">
              <h3 class="font-bold text-[#000080]">The Microsoft Internet Explorer 3.02</h3>
              <p class="text-gray-700">
                Browse the World Wide Web with full support for HTML 3.2, Cascading Style Sheets (CSS), ActiveX controls, and Java applets. Free for all Windows users!
              </p>
              <div class="text-[11px] font-mono text-gray-600">
                Installed version: 3.02 (4.70.1158) with 128-bit Strong Encryption Cipher.
              </div>
            </div>

            <!-- Bill Gates Memo -->
            <div class="border border-[#808080] p-2 bg-[#ffffea] text-xs space-y-1">
              <span class="font-bold text-[#000080]">Executive Dispatch: The Internet Tidal Wave</span>
              <p class="text-[11px] text-gray-800">
                "The Internet is a tidal wave. It changes the rules. It is an incredible opportunity as well as an incredible challenge." - Bill Gates
              </p>
            </div>
          </div>
        `,
      };
    }

    // 13. CNN Interactive (1995)
    if (cleanUrl.startsWith('http://www.cnn.com') || cleanUrl.startsWith('www.cnn.com') || cleanUrl.startsWith('cnn.com')) {
      return {
        title: 'CNN Interactive - World News 1995',
        html: `
          <div class="space-y-4 font-serif text-black leading-relaxed">
            <div class="border-b-4 border-red-700 pb-2 flex justify-between items-baseline">
              <h1 class="text-2xl font-black text-red-700 tracking-tight font-sans">CNN Interactive</h1>
              <span class="text-xs font-mono text-gray-600">August 24, 1995</span>
            </div>

            <div class="border-2 border-[#808080] p-3 bg-white space-y-2">
              <h2 class="text-base font-bold text-black hover:text-red-700 cursor-pointer">
                WINDOWS 95 LAUNCHES WORLDWIDE AMID MIDNIGHT CELEBRATIONS
              </h2>
              <p class="text-xs text-gray-700">
                REDMOND, WA - Crowds gathered at computer retailers at midnight across the globe as Microsoft launched its much anticipated Windows 95 operating system, with the Empire State Building lit in Microsoft colors.
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div class="border border-gray-300 p-2 bg-[#f9f9f9]">
                <h3 class="font-bold text-red-800">NASA Galileo Spacecraft Approaches Jupiter</h3>
                <p class="text-[11px] text-gray-600 mt-1">Probe prepares to dive directly into the Jovian atmosphere to gather first ever in-situ measurements.</p>
              </div>
              <div class="border border-gray-300 p-2 bg-[#f9f9f9]">
                <h3 class="font-bold text-red-800">Netscape Communications IPO Surges</h3>
                <p class="text-[11px] text-gray-600 mt-1">Wall Street values the web browser pioneer at \$3 billion on its opening day of trading.</p>
              </div>
            </div>

            <div class="text-center pt-2">
              <a href="#" class="ie-link text-xs text-blue-800 underline font-mono" data-url="http://piush.com/">
                [Back to Cyber-Home]
              </a>
            </div>
          </div>
        `,
      };
    }

    // 14. Fallback: Intelligent Simulated Retro Web Archive View
    const domain = cleanUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    return {
      title: `${domain} - Simulated Web Document`,
      html: `
        <div class="space-y-4 font-serif text-black leading-relaxed">
          <div class="border-b-2 border-[#000080] pb-2">
            <h1 class="text-lg font-bold text-[#000080]">Simulated Web Node: ${domain}</h1>
            <p class="text-xs text-gray-600 font-mono">${url}</p>
          </div>

          <div class="border-2 border-[#808080] bg-[#ffffea] p-3 text-xs space-y-2 shadow-[2px_2px_0px_#808080]">
            <div class="font-bold text-[#000080]">Cyber-Archive Status: Active</div>
            <p>
              You have connected to simulated host <strong>${domain}</strong>. In the 1995-1998 cyberspace era, this web server responded with standard HTTP/1.0 protocol.
            </p>
            <div class="p-2 bg-white border border-[#808080] text-[11px] font-mono space-y-1">
              <div>HTTP/1.0 200 OK</div>
              <div>Server: NCSA/1.5.2 (Unix)</div>
              <div>Content-Type: text/html; charset=iso-8859-1</div>
              <div>Connection: Keep-Alive</div>
            </div>
          </div>

          <div class="border border-[#808080] bg-[#f0f8ff] p-3 text-xs space-y-2">
            <h3 class="font-bold text-[#000080]">Recommended Destinations:</h3>
            <ul class="list-disc pl-5 space-y-1">
              <li>Search for "${domain}" on <a href="#" class="ie-link text-blue-800 underline font-bold" data-url="http://www.yahoo.com/?p=${encodeURIComponent(domain)}">Yahoo! Directory</a></li>
              <li>Query the <a href="#" class="ie-link text-blue-800 underline font-bold" data-url="http://www.altavista.com/?q=${encodeURIComponent(domain)}">AltaVista Web Crawler</a></li>
              <li>Return to <a href="#" class="ie-link text-blue-800 underline font-bold" data-url="http://piush.com/">Piush KS Cyber-Home</a></li>
            </ul>
          </div>
        </div>
      `,
    };
  }

  // Search Engine simulated database
  function searchWebDatabase(q: string): Array<{ title: string; url: string; snippet: string }> {
    const term = q.toLowerCase().trim();
    const database = [
      {
        title: 'Piush KS Cyber-Home',
        url: 'http://piush.com/',
        keywords: ['piush', 'architect', 'mobile', 'cloud', 'cyber', 'home', 'engineer', 'lead'],
        snippet: 'Official headquarters of Piush KS. Senior Mobile & Cloud Architect scaling distributed systems to 10M+ users.',
      },
      {
        title: 'Engineering Projects Portfolio',
        url: 'http://piush.com/work/',
        keywords: ['portfolio', 'work', 'projects', 'kotlin', 'swift', 'dynamodb', 'offline', 'sync', 'fintech'],
        snippet: 'Comprehensive production case studies: global fintech mobile apps, CRDT replication engines, and cloud microservices.',
      },
      {
        title: '550-Question Full-Stack Developer Quiz',
        url: 'http://piush.com/quiz/',
        keywords: ['quiz', 'test', 'questions', 'skills', 'developer', 'questions', 'fullstack', 'react', 'flutter'],
        snippet: 'Rigorous 550-question developer challenge spanning 23 technical categories with complete verification rationales.',
      },
      {
        title: 'React Native vs. Flutter: Production Architectural Trade-Offs',
        url: 'http://piush.com/blog/flutter-vs-react-native/',
        keywords: ['react', 'native', 'flutter', 'skia', 'impeller', 'hermes', 'cross-platform', 'architecture'],
        snippet: 'A deep dive comparing Hermes JSI rendering vs. Flutter Impeller direct GPU canvas rasterization at scale.',
      },
      {
        title: 'Micro-Animations That Don\'t Ruin 60 FPS on Mobile',
        url: 'http://piush.com/blog/60fps-animations/',
        keywords: ['animations', '60fps', 'fps', 'performance', 'rendering', 'jank', 'gpu'],
        snippet: 'Guidelines for keeping mobile frame budgets under 16ms using composite-only transforms and GPU caching.',
      },
      {
        title: 'Mastering Offline-First Synchronization with CRDTs',
        url: 'http://piush.com/blog/offline-crdt-sync/',
        keywords: ['crdt', 'offline', 'sync', 'sqlite', 'replication', 'conflict', 'distributed'],
        snippet: 'State-based conflict-free replicated data types and delta-state sync implementation for mobile clients.',
      },
      {
        title: 'Space Jam Official 1996 Warner Bros Site',
        url: 'http://www.spacejam.com/',
        keywords: ['space', 'jam', 'jordan', 'bugs', 'looney', 'tunes', 'warner', 'movie', 'b-ball'],
        snippet: 'The iconic 1996 movie website. Features The Lineup, Jam Central, planetary navigation, and soundtrack tracks.',
      },
      {
        title: 'GeoCities Neighborhood Communities',
        url: 'http://www.geocities.com/',
        keywords: ['geocities', 'community', 'homestead', 'siliconvalley', 'under', 'construction', 'neighborhood'],
        snippet: 'The largest web community on the Net. Free homepages across SiliconValley, CapeCanaveral, and Hollywood.',
      },
      {
        title: 'Microsoft Corporation - Windows 95 Launch',
        url: 'http://www.microsoft.com/',
        keywords: ['microsoft', 'windows', '95', 'bill', 'gates', 'ie', 'explorer'],
        snippet: 'Where do you want to go today? Windows 95 announcement, 32-bit computing, and Internet Explorer 3.0.',
      },
      {
        title: 'CNN Interactive 1995 News Archive',
        url: 'http://www.cnn.com/',
        keywords: ['cnn', 'news', 'interactive', 'galileo', 'jupiter', 'netscape', 'ipo'],
        snippet: 'Breaking world news reports from 1995: Galileo probe reaches Jupiter, Netscape IPO, and Windows 95 debut.',
      },
      {
        title: 'World Wide Web Guestbook',
        url: 'http://piush.com/guestbook/',
        keywords: ['guestbook', 'sign', 'ledger', 'comments', 'visitors'],
        snippet: 'Read and sign the community cyber-ledger. Add your name, location, and thoughts to the guestbook.',
      },
      {
        title: 'Developer Cyber-Tools',
        url: 'http://piush.com/tools/',
        keywords: ['tools', 'ascii', 'base64', 'hex', 'epoch', 'utilities'],
        snippet: 'In-browser developer utilities including ASCII text banner generator, Base64 encoder, and color converters.',
      },
    ];

    if (!term) return database.slice(0, 6);

    return database.filter((item) => {
      if (item.title.toLowerCase().includes(term)) return true;
      if (item.snippet.toLowerCase().includes(term)) return true;
      if (item.url.toLowerCase().includes(term)) return true;
      return item.keywords.some((k) => k.toLowerCase().includes(term) || term.includes(k.toLowerCase()));
    });
  }

  // Initial HTML Structure
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none overflow-hidden relative" id="ie-app-root">
      <!-- Windows 95 Standard Menu Bar -->
      <div class="flex items-center gap-1 px-1.5 py-0.5 border-b border-[#808080] bg-[#c0c0c0] text-xs relative z-30 select-none">
        <!-- File Menu -->
        <div class="relative group" id="ie-menu-file-parent">
          <button type="button" class="px-2 py-0.5 hover:bg-[#000080] hover:text-white rounded-none cursor-default font-normal" id="ie-menu-file-btn">
            <span class="underline">F</span>ile
          </button>
          <div class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[190px] z-50 text-black text-xs" id="ie-file-dropdown">
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ie-menu-open">
              <span>Open...</span>
              <span class="text-gray-600 group-hover:text-gray-300 text-[10px]">Ctrl+O</span>
            </button>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ie-menu-saveas">
              <span>Save As...</span>
              <span class="text-gray-600 group-hover:text-gray-300 text-[10px]">Ctrl+S</span>
            </button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
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
            <!-- Font Scale Submenu Options -->
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
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="ie-menu-bestweb">
              <span>Best of the Web</span>
            </button>
          </div>
        </div>

        <!-- Favorites Menu -->
        <div class="relative group" id="ie-menu-favorites-parent">
          <button type="button" class="px-2 py-0.5 hover:bg-[#000080] hover:text-white rounded-none cursor-default font-normal" id="ie-menu-favorites-btn">
            F<span class="underline">a</span>vorites
          </button>
          <div class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[240px] max-h-[360px] overflow-y-auto z-50 text-black text-xs" id="ie-favorites-dropdown">
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

      <!-- Windows 95 Standard 3D Toolbar -->
      <div class="flex items-center gap-1 p-1 bg-[#c0c0c0] border-b border-[#808080] text-xs relative z-20">
        <button id="ie-tb-back" class="retro-btn !py-1 !px-2 flex items-center gap-1 font-bold text-[11px]" title="Back (Alt+Left)">
          <span>⬅️</span>
          <span class="hidden sm:inline">Back</span>
        </button>
        <button id="ie-tb-forward" class="retro-btn !py-1 !px-2 flex items-center gap-1 font-bold text-[11px]" title="Forward (Alt+Right)">
          <span>➡️</span>
          <span class="hidden sm:inline">Forward</span>
        </button>
        <button id="ie-tb-stop" class="retro-btn !py-1 !px-2 flex items-center gap-1 text-[11px]" title="Stop (Esc)">
          <span>🛑</span>
          <span class="hidden sm:inline">Stop</span>
        </button>
        <button id="ie-tb-refresh" class="retro-btn !py-1 !px-2 flex items-center gap-1 text-[11px]" title="Refresh (F5)">
          <span>🔄</span>
          <span class="hidden sm:inline">Refresh</span>
        </button>
        <button id="ie-tb-home" class="retro-btn !py-1 !px-2 flex items-center gap-1 text-[11px]" title="Home (Alt+Home)">
          <span>🏠</span>
          <span class="hidden sm:inline">Home</span>
        </button>

        <div class="h-5 w-[1px] bg-[#808080] border-r border-white mx-0.5"></div>

        <button id="ie-tb-search" class="retro-btn !py-1 !px-2 flex items-center gap-1 text-[11px]" title="Search the Web">
          <span>🔍</span>
          <span class="hidden md:inline">Search</span>
        </button>
        <button id="ie-tb-favorites" class="retro-btn !py-1 !px-2 flex items-center gap-1 text-[11px]" title="Favorites">
          <span>⭐</span>
          <span class="hidden md:inline">Favorites</span>
        </button>
        <button id="ie-tb-print" class="retro-btn !py-1 !px-2 flex items-center gap-1 text-[11px]" title="Print">
          <span>🖨️</span>
          <span class="hidden md:inline">Print</span>
        </button>
        <button id="ie-tb-font" class="retro-btn !py-1 !px-2 flex items-center gap-1 text-[11px] font-bold" title="Cycle Font Size">
          <span>🔤</span>
          <span class="hidden md:inline">Font</span>
        </button>

        <!-- Animated Spinning Windows 95 / IE Earth Globe -->
        <div class="ml-auto flex items-center pl-1">
          <div
            id="ie-globe-spinner"
            class="w-7 h-7 bg-[#000080] border-2 border-white shadow-[inset_1px_1px_0px_#000000,1px_1px_0px_#ffffff] flex items-center justify-center cursor-pointer relative overflow-hidden group"
            title="Microsoft Internet Explorer - Click to visit Microsoft.com"
          >
            <!-- Earth Globe SVG with Longitude/Latitude lines -->
            <svg id="ie-globe-svg" class="w-5 h-5 text-white transition-transform duration-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10" stroke="#00ffff" fill="#000080" />
              <line x1="2" y1="12" x2="22" y2="12" stroke="#ffffff" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#ffffff" />
            </svg>
            <!-- Spinning Orbit Indicator -->
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
            placeholder="http://..."
          />
          <button id="ie-history-dropdown-btn" class="absolute right-1 w-4 h-4 bg-[#c0c0c0] border border-[#808080] text-[9px] flex items-center justify-center font-bold text-black" title="URL History">
            ▼
          </button>
          <!-- URL History Dropdown -->
          <div id="ie-url-history-panel" class="hidden absolute top-full left-0 right-0 bg-white border border-[#808080] shadow-[2px_2px_0px_#000000] py-0.5 z-40 max-h-40 overflow-y-auto font-mono text-xs">
            <!-- Dynamic history options -->
          </div>
        </div>
        <button id="ie-go-btn" class="retro-btn !py-0.5 !px-3 font-bold text-xs">
          Go
        </button>
      </div>

      <!-- Web Content Viewport -->
      <div
        id="ie-viewport"
        class="retro-inset flex-1 p-3 sm:p-5 bg-white text-black overflow-y-auto select-text font-serif relative"
        style="background-color: #ffffff; color: #000000;"
      >
        <div id="ie-page-container" class="max-w-4xl mx-auto">
          <!-- Page HTML loaded here -->
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
  const root = container.querySelector('#ie-app-root') as HTMLElement;
  const addressInput = container.querySelector('#ie-address-input') as HTMLInputElement;
  const pageContainer = container.querySelector('#ie-page-container') as HTMLElement;
  const statusText = container.querySelector('#ie-status-text') as HTMLElement;
  const progressFill = container.querySelector('#ie-progress-fill') as HTMLElement;
  const globeSpinner = container.querySelector('#ie-globe-spinner') as HTMLElement;
  const globeSvg = container.querySelector('#ie-globe-svg') as HTMLElement;
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
            <span class="text-[10px] text-gray-500 font-mono truncate max-w-[90px]">${fav.url.replace(/^http:\/\//, '')}</span>
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

  // Navigation Core
  const navigateTo = (url: string, pushHistory = true) => {
    if (isLoading) return;
    let target = url.trim();
    if (!target) return;

    // Normalization
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'http://' + target;
    }

    isLoading = true;
    audio.playClick();

    // Start Spinner & Status animation
    if (globeSvg) globeSvg.classList.add('animate-pulse');
    if (globeOrbit) globeOrbit.classList.remove('hidden');
    if (statusText) statusText.textContent = `Finding site: ${target}...`;
    if (progressFill) progressFill.style.width = '20%';

    // Step 2
    setTimeout(() => {
      if (statusText) statusText.textContent = `Connecting to ${target}...`;
      if (progressFill) progressFill.style.width = '55%';
    }, 100);

    // Step 3
    setTimeout(() => {
      if (statusText) statusText.textContent = `Transferring document...`;
      if (progressFill) progressFill.style.width = '85%';
    }, 200);

    // Render Complete
    setTimeout(() => {
      currentUrl = target;
      if (addressInput) addressInput.value = target;

      const pageData = getPageContent(target);
      win.setTitle(`The Microsoft Internet Explorer - ${pageData.title}`);

      if (pageContainer) {
        pageContainer.innerHTML = pageData.html;
        wirePageInteractions();
        applyFontScale();
      }

      if (pushHistory) {
        historyStack.splice(historyIndex + 1);
        historyStack.push(target);
        historyIndex = historyStack.length - 1;
      }

      // Update Nav Buttons
      updateNavButtons();
      updateUrlHistoryDropdown();

      // Reset loading states
      if (globeSvg) globeSvg.classList.remove('animate-pulse');
      if (globeOrbit) globeOrbit.classList.add('hidden');
      if (progressFill) progressFill.style.width = '0%';
      if (statusText) statusText.textContent = 'Done';
      isLoading = false;
    }, 320);
  };

  // Wire buttons Back and Forward state
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

  // Wire in-page hyperlinks and form interactions
  const wirePageInteractions = () => {
    // Hyperlinks
    pageContainer.querySelectorAll('.ie-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const dest = (link as HTMLElement).getAttribute('data-url');
        if (dest) navigateTo(dest);
      });

      // Status Bar Preview on Link Hover
      link.addEventListener('mouseenter', () => {
        const dest = (link as HTMLElement).getAttribute('data-url');
        if (dest && statusText) statusText.textContent = `Shortcut to ${dest}`;
      });
      link.addEventListener('mouseleave', () => {
        if (statusText && !isLoading) statusText.textContent = 'Done';
      });
    });

    // Launch Quiz app button
    pageContainer.querySelector('#ie-open-quiz-app')?.addEventListener('click', () => {
      audio.playChord();
      // Look up desktop global launcher if present
      const launcher = (window as unknown as { launchWin95App?: (id: string) => void }).launchWin95App;
      if (launcher) launcher('quiz');
      else alert('Quiz.exe has been summoned to your desktop taskbar!');
    });

    // Yahoo Search Bar wire
    const yahooInput = pageContainer.querySelector('#yahoo-query-box') as HTMLInputElement;
    const yahooBtn = pageContainer.querySelector('#yahoo-search-btn') as HTMLButtonElement;
    if (yahooBtn && yahooInput) {
      const doYahoo = () => {
        const q = yahooInput.value.trim();
        if (q) navigateTo(`http://www.yahoo.com/?p=${encodeURIComponent(q)}`);
      };
      yahooBtn.addEventListener('click', doYahoo);
      yahooInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doYahoo();
      });
    }

    // AltaVista Search Bar wire
    const avInput = pageContainer.querySelector('#av-query-box') as HTMLInputElement;
    const avBtn = pageContainer.querySelector('#av-submit-btn') as HTMLButtonElement;
    if (avBtn && avInput) {
      const doAv = () => {
        const q = avInput.value.trim();
        if (q) navigateTo(`http://www.altavista.com/?q=${encodeURIComponent(q)}`);
      };
      avBtn.addEventListener('click', doAv);
      avInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doAv();
      });
    }

    // Guestbook signing wire
    const gbSubmit = pageContainer.querySelector('#gb-submit-btn');
    if (gbSubmit) {
      gbSubmit.addEventListener('click', () => {
        const nameInput = pageContainer.querySelector('#gb-name') as HTMLInputElement;
        const locInput = pageContainer.querySelector('#gb-loc') as HTMLInputElement;
        const msgInput = pageContainer.querySelector('#gb-msg') as HTMLTextAreaElement;

        const name = nameInput?.value.trim() || 'Anonymous Netizen';
        const location = locInput?.value.trim() || 'Cyberspace';
        const message = msgInput?.value.trim();

        if (!message) {
          audio.playError();
          alert('Please enter a message before submitting to the Guestbook.');
          return;
        }

        guestbookEntries.unshift({
          name,
          location,
          message,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        });

        saveGuestbook();
        audio.playTada();
        navigateTo('http://piush.com/guestbook/', false);
      });
    }

    // Developer Web Tools Wires
    // 1. ASCII generator
    pageContainer.querySelector('#tool-ascii-btn')?.addEventListener('click', () => {
      const txt = (pageContainer.querySelector('#tool-ascii-in') as HTMLInputElement)?.value.toUpperCase() || 'WIN95';
      const out = pageContainer.querySelector('#tool-ascii-out');
      if (out) {
        audio.playClick();
        out.textContent = `
  +-+-+-+-+-+-+-+-+
  |  ${txt.padEnd(10, ' ')} |
  +-+-+-+-+-+-+-+-+
  [ 1995 CYBER-ASCII ENGINE ]
        `.trim();
      }
    });

    // 2. Base64
    pageContainer.querySelector('#tool-b64-enc')?.addEventListener('click', () => {
      const txt = (pageContainer.querySelector('#tool-b64-in') as HTMLInputElement)?.value || '';
      const out = pageContainer.querySelector('#tool-b64-out') as HTMLInputElement;
      if (out) {
        try {
          out.value = btoa(txt);
          audio.playClick();
        } catch (_) {
          out.value = 'Encoding Error';
        }
      }
    });
    pageContainer.querySelector('#tool-b64-dec')?.addEventListener('click', () => {
      const txt = (pageContainer.querySelector('#tool-b64-in') as HTMLInputElement)?.value || '';
      const out = pageContainer.querySelector('#tool-b64-out') as HTMLInputElement;
      if (out) {
        try {
          out.value = atob(txt);
          audio.playClick();
        } catch (_) {
          out.value = 'Invalid Base64 sequence';
        }
      }
    });

    // 3. Hex Color
    pageContainer.querySelector('#tool-hex-btn')?.addEventListener('click', () => {
      const hex = (pageContainer.querySelector('#tool-hex-in') as HTMLInputElement)?.value.trim() || '#000080';
      const out = pageContainer.querySelector('#tool-hex-out');
      if (out) {
        audio.playClick();
        const clean = hex.replace('#', '');
        const r = parseInt(clean.substring(0, 2) || '0', 16);
        const g = parseInt(clean.substring(2, 4) || '0', 16);
        const b = parseInt(clean.substring(4, 6) || '0', 16);
        out.textContent = `rgb(${r}, ${g}, ${b}) - Converted successfully!`;
      }
    });

    // 4. Epoch
    pageContainer.querySelector('#tool-epoch-btn')?.addEventListener('click', () => {
      const out = pageContainer.querySelector('#tool-epoch-out');
      if (out) {
        audio.playClick();
        const now = Date.now();
        out.textContent = `Timestamp: ${Math.floor(now / 1000)} (${new Date().toLocaleString()})`;
      }
    });
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
    navigateTo(currentUrl, false);
  });

  container.querySelector('#ie-tb-home')?.addEventListener('click', () => {
    navigateTo(homePage);
  });

  container.querySelector('#ie-tb-search')?.addEventListener('click', () => {
    navigateTo('http://www.yahoo.com/');
  });

  globeSpinner?.addEventListener('click', () => {
    navigateTo('http://www.microsoft.com/');
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
    navigateTo(currentUrl, false);
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
    navigateTo('http://www.yahoo.com/');
  });
  container.querySelector('#ie-menu-bestweb')?.addEventListener('click', () => {
    closeAllDropdowns();
    navigateTo('http://piush.com/');
  });
  container.querySelector('#ie-menu-close')?.addEventListener('click', () => {
    closeAllDropdowns();
    win.close();
  });

  // Copy / Select All
  container.querySelector('#ie-menu-selectall')?.addEventListener('click', () => {
    closeAllDropdowns();
    const selection = window.getSelection();
    const range = document.createRange();
    if (pageContainer && selection) {
      range.selectNodeContents(pageContainer);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });

  container.querySelector('#ie-menu-copy')?.addEventListener('click', () => {
    closeAllDropdowns();
    const selection = window.getSelection();
    if (selection) {
      navigator.clipboard?.writeText(selection.toString()).catch(() => {});
      audio.playClick();
    }
  });

  // Modal System
  const showModal = (headerTitle: string, innerHtml: string) => {
    closeAllDropdowns();
    audio.playChord();
    modalBox.innerHTML = `
      <!-- Modal Title Bar -->
      <div class="bg-[#000080] text-white px-2 py-0.5 flex justify-between items-center text-xs font-bold mb-2">
        <span>${headerTitle}</span>
        <button id="ie-modal-close-x" class="w-4 h-4 bg-[#c0c0c0] text-black font-bold flex items-center justify-center border border-white shadow-[inset_1px_1px_0px_#ffffff,1px_1px_0px_#000000] text-[10px]">
          ✕
        </button>
      </div>
      <!-- Modal Body -->
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
              Type the Internet address of a document or folder, and Internet Explorer will open it for you.
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
    const pageData = getPageContent(currentUrl);
    const defaultFilename = currentUrl.replace(/[^a-zA-Z0-9]/g, '_') + '.htm';

    showModal(
      'Save HTML Document',
      `
        <div class="space-y-3">
          <p class="text-xs">
            Save current document HTML to the Windows 95 Virtual File System:
          </p>
          <div class="space-y-1">
            <label class="block font-bold text-xs">File Name:</label>
            <input type="text" id="ie-save-filename" value="${defaultFilename}" class="retro-inset w-full px-2 py-0.5 bg-white text-xs font-mono" />
          </div>
          <div class="space-y-1">
            <label class="block font-bold text-xs">Save as type:</label>
            <select class="retro-inset w-full px-1.5 py-0.5 bg-white text-xs">
              <option>HTML Document (*.htm, *.html)</option>
              <option>Text Document (*.txt)</option>
            </select>
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
      const htmlToSave = `<!DOCTYPE html>\n<!-- Saved from The Microsoft Internet Explorer -->\n<html>\n<head><title>${pageData.title}</title></head>\n<body>\n${pageData.html}\n</body>\n</html>`;

      vfs.createFolder('/My Documents/Saved Pages');
      vfs.writeFile(`/My Documents/Saved Pages/${fn}`, htmlToSave, 'text/html');
      audio.playTada();
      closeModal();
      alert(`Document successfully saved to virtual path: /My Documents/Saved Pages/${fn}`);
    });

    modalBox.querySelector('#ie-save-download-btn')?.addEventListener('click', () => {
      const fn = (modalBox.querySelector('#ie-save-filename') as HTMLInputElement)?.value.trim() || defaultFilename;
      const htmlToSave = `<!DOCTYPE html>\n<!-- Saved from The Microsoft Internet Explorer -->\n<html>\n<head><title>${pageData.title}</title></head>\n<body>\n${pageData.html}\n</body>\n</html>`;
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
    const pageData = getPageContent(currentUrl);
    showModal(
      'Print',
      `
        <div class="space-y-3">
          <div class="border border-[#808080] p-2 bg-[#f9f9f9] text-xs space-y-1">
            <div class="font-bold text-[#000080]">Printer:</div>
            <div>Name: HP LaserJet 4L (Standard 300 DPI)</div>
            <div>Status: Ready for printing</div>
            <div>Type: Hewlett-Packard PCL 5e</div>
          </div>
          <div class="space-y-1 text-xs">
            <span class="font-bold">Document:</span> ${pageData.title}
          </div>
          <div class="border border-dashed border-[#808080] p-3 max-h-36 overflow-y-auto bg-white text-[11px] font-serif text-black leading-tight">
            ${pageData.html}
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
      window.print();
    });
  };

  container.querySelector('#ie-tb-print')?.addEventListener('click', openPrintDialog);
  container.querySelector('#ie-menu-print')?.addEventListener('click', () => {
    closeAllDropdowns();
    openPrintDialog();
  });

  // 4. View Source
  container.querySelector('#ie-menu-source')?.addEventListener('click', () => {
    closeAllDropdowns();
    const pageData = getPageContent(currentUrl);
    const rawHtml = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">\n<!-- Document Source: ${currentUrl} -->\n<html>\n<head>\n  <title>${pageData.title}</title>\n</head>\n<body>\n${pageData.html.trim()}\n</body>\n</html>`;

    showModal(
      `${currentUrl} - Notepad (View Source)`,
      `
        <div class="space-y-2">
          <div class="flex justify-between items-center text-xs">
            <span class="font-mono text-gray-600">Encoding: Windows-1252 / ISO-8859-1</span>
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
            Type a word or phrase to locate inside the currently loaded webpage.
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
      if (!term || !pageContainer) return;
      activeFindTerm = term;

      // Find in page using window.find or highlight
      const text = pageContainer.innerText;
      if (text.toLowerCase().includes(term.toLowerCase())) {
        audio.playClick();
        alert(`Match found for "${term}" on this page!`);
      } else {
        audio.playError();
        alert(`Cannot find the string "${term}".`);
      }
    });
  });

  // 6. Favorites: Add to Favorites Dialog
  const openAddFavoriteDialog = () => {
    closeAllDropdowns();
    const pageData = getPageContent(currentUrl);

    showModal(
      'Add Favorite',
      `
        <div class="space-y-3">
          <div class="flex gap-3 items-center">
            <span class="text-2xl">⭐</span>
            <p class="text-xs">
              Internet Explorer will add this page to your Favorites list.
            </p>
          </div>
          <div class="space-y-1">
            <label class="block font-bold text-xs">Name:</label>
            <input type="text" id="ie-fav-name-input" value="${pageData.title}" class="retro-inset w-full px-2 py-0.5 bg-white text-xs" />
          </div>
          <div class="space-y-1">
            <label class="block font-bold text-xs">URL:</label>
            <input type="text" id="ie-fav-url-input" value="${currentUrl}" readonly class="retro-inset w-full px-2 py-0.5 bg-gray-100 text-xs text-gray-700 font-mono" />
          </div>
          <div class="flex items-center gap-1.5 text-xs">
            <input type="checkbox" id="ie-fav-offline" checked />
            <label for="ie-fav-offline">Make available for offline browsing</label>
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
      const name = (modalBox.querySelector('#ie-fav-name-input') as HTMLInputElement)?.value.trim() || pageData.title;
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
            Manage, organize, or remove bookmarks from your Internet Explorer collection:
          </p>
          <div id="ie-org-list" class="retro-inset max-h-48 overflow-y-auto bg-white p-1 space-y-0.5">
            <!-- Dynamic bookmarks -->
          </div>
          <div class="flex justify-end pt-2 border-t border-[#808080]">
            <button id="ie-org-close-btn" class="retro-btn !py-1 !px-4 text-xs font-bold">Close</button>
          </div>
        </div>
      `
    );

    renderOrganizeList();
    modalBox.querySelector('#ie-org-close-btn')?.addEventListener('click', closeModal);
  });

  // 8. Internet Options Dialog
  container.querySelector('#ie-menu-options')?.addEventListener('click', () => {
    closeAllDropdowns();
    showModal(
      'Internet Options',
      `
        <div class="space-y-3">
          <!-- Property Sheet Tabs -->
          <div class="flex border-b border-[#808080] text-xs font-bold gap-1">
            <div class="px-3 py-1 bg-white border-t-2 border-l-2 border-r-2 border-[#808080] -mb-[1px]">General</div>
            <div class="px-3 py-1 bg-[#c0c0c0] text-gray-600">Security</div>
            <div class="px-3 py-1 bg-[#c0c0c0] text-gray-600">Advanced</div>
          </div>

          <!-- General Tab Content -->
          <div class="border border-[#808080] p-3 bg-white space-y-3 text-xs">
            <div class="space-y-1.5">
              <span class="font-bold text-[#000080]">Home Page:</span>
              <p class="text-[11px] text-gray-600">You can change what page to use as your default home page.</p>
              <div class="flex gap-2">
                <span class="font-bold text-gray-700">Address:</span>
                <input type="text" id="ie-opt-home-input" value="${homePage}" class="retro-inset flex-1 px-2 py-0.5 bg-white text-xs font-mono" />
              </div>
              <div class="flex gap-1 justify-end pt-1">
                <button id="ie-opt-home-current" class="retro-btn !py-0.5 !px-2 text-[11px]">Use Current</button>
                <button id="ie-opt-home-default" class="retro-btn !py-0.5 !px-2 text-[11px]">Use Default</button>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-2 space-y-1">
              <span class="font-bold text-[#000080]">Temporary Internet Files:</span>
              <p class="text-[11px] text-gray-600">Pages you view on the Internet are stored in a special folder for quick viewing.</p>
              <button id="ie-opt-clear-cache" class="retro-btn !py-0.5 !px-3 text-xs">Delete Files...</button>
            </div>

            <div class="border-t border-gray-200 pt-2 space-y-1">
              <span class="font-bold text-[#000080]">History:</span>
              <p class="text-[11px] text-gray-600">The History list keeps track of recently visited webpages.</p>
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
      if (input) input.value = 'http://piush.com/';
    });
    modalBox.querySelector('#ie-opt-clear-cache')?.addEventListener('click', () => {
      audio.playChord();
      alert('All temporary Internet files and offline cached web graphics deleted.');
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
            <h3 class="font-bold text-[#000080] text-sm">Welcome to Cyberspace Browsing!</h3>
            <p>
              The Microsoft Internet Explorer connects your Windows 95 personal computer directly to the World Wide Web, the global network of hyperlinked documents.
            </p>
            <h4 class="font-bold text-gray-800">Quick Navigation Commands:</h4>
            <ul class="list-disc pl-5 space-y-1 text-gray-700">
              <li><strong>Hyperlinks:</strong> Click any underlined blue text to navigate directly to that document.</li>
              <li><strong>Back / Forward:</strong> Use the toolbar buttons or <code>Alt+Left</code> / <code>Alt+Right</code> to traverse your browsing history.</li>
              <li><strong>Favorites:</strong> Bookmark useful websites via <code>Favorites -> Add to Favorites</code> for one-click access later.</li>
              <li><strong>Search Engines:</strong> Click the Search toolbar button to access the Yahoo! web directory or AltaVista crawler.</li>
              <li><strong>View Source:</strong> Inspect the underlying HTML markup of any webpage via <code>View -> Source</code>.</li>
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
          <!-- Top Hero Graphic -->
          <div class="flex items-center gap-3 bg-gradient-to-r from-[#000080] to-[#008080] p-3 text-white border border-[#808080]">
            <div class="text-3xl">🌐</div>
            <div>
              <div class="font-bold text-base tracking-wide">The Microsoft Internet Explorer</div>
              <div class="text-[11px] text-cyan-200 font-mono">Version 3.02 (4.70.1158)</div>
            </div>
          </div>

          <div class="space-y-1 text-xs">
            <div><strong>Product ID:</strong> 52174-OEM-0019951-84920</div>
            <div><strong>Cipher Strength:</strong> 128-bit High Encryption</div>
            <div><strong>Update Versions:</strong> SP2 (Authentic 1995-1997 Edition)</div>
          </div>

          <div class="border-t border-[#808080] pt-2 text-[11px] text-gray-700 space-y-1">
            <p>Copyright © 1995-1997 Microsoft Corporation. All rights reserved.</p>
            <p class="text-gray-500 italic">
              Based on NCSA Mosaic. NCSA Mosaic was developed by the National Center for Supercomputing Applications at the University of Illinois at Urbana-Champaign.
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

  // Keyboard Shortcuts for Internet Explorer
  const handleKeydown = (e: KeyboardEvent) => {
    if (!win.element || !win.element.classList.contains('active-window')) {
      const isWithin = win.element?.contains(document.activeElement);
      if (!isWithin) return;
    }

    if (e.key === 'F5') {
      e.preventDefault();
      navigateTo(currentUrl, false);
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
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      container.querySelector('#ie-menu-find')?.dispatchEvent(new MouseEvent('click'));
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

  // Initial Load
  renderFavoritesMenu();
  updateUrlHistoryDropdown();
  navigateTo(homePage, true);
}
