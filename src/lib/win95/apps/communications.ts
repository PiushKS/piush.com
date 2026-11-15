// Piush 95 - Communications Collection
// HyperTerminal, Dial-Up Networking, Network Neighborhood, Guestbook

import { audio } from '../audio';
import { vfs } from '../fs';
import type { Win95Window } from '../windowManager';

/**
 * 1. HyperTerminal - Piush.com BBS
 */
export function renderHyperTerminal(container: HTMLElement, win: Win95Window) {
  win.setTitle('HyperTerminal - PiushNet BBS (Connected)');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-black text-[#00ffcc] font-mono text-xs select-text overflow-hidden p-2">
      <div id="ht-screen" class="flex-1 overflow-auto whitespace-pre leading-tight">===============================================================
* * *  P I U S H . C O M   B B S   ( N O D E   1 )  * * *
===============================================================
Baud Rate: 57,600 bps | Protocol: ANSI / VT100
Sysop: Piush KS (Senior Mobile & Cloud Engineer)

MAIN MENU:
  [1] About Piush KS & Engineering Bio
  [2] Featured Production Applications
  [3] System Architecture & Cloud Tech
  [4] Contact Sysop
  [5] Download Resume (RESUME.TXT)
  [6] Disconnect / Hang Up

Select an option (1-6): </div>
      <div class="flex items-center gap-1 pt-1 border-t border-gray-800 text-white">
        <span>&gt;</span>
        <input type="text" id="ht-input" class="flex-1 bg-transparent border-none outline-none text-[#00ffcc] font-mono text-xs caret-white" autofocus autocomplete="off" />
      </div>
    </div>
  `;

  const screen = container.querySelector('#ht-screen') as HTMLElement;
  const input = container.querySelector('#ht-input') as HTMLInputElement;

  function print(t: string) {
    if (screen) {
      screen.textContent += '\n' + t;
      screen.scrollTop = screen.scrollHeight;
    }
  }

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value.trim();
      input.value = '';
      print(`> ${val}`);
      audio.playClick();

      switch (val) {
        case '1':
          print(`
---------------------------------------------------------------
SYSOP BIO:
Piush KS is a Senior Mobile & Cloud Architect with 8+ years
designing resilient systems for 10M+ users globally.
Specialized in Swift/iOS, Kotlin/Android, Cloud & Distributed Systems.
---------------------------------------------------------------
Select an option (1-6): `);
          break;
        case '2':
          print(`
---------------------------------------------------------------
FEATURED WORK:
- High-concurrency enterprise mobile applications
- 550+ Validated Interactive Engineering Quiz Database
- Web desktop with pure audio synthesis & client-side VFS
---------------------------------------------------------------
Select an option (1-6): `);
          break;
        case '3':
          print(`
---------------------------------------------------------------
CORE STACK:
- Mobile: Swift, SwiftUI, Combine, Kotlin, Jetpack Compose
- Cloud: AWS, GCP, Node.js, Distributed Microservices
- Systems: Linux, Git, High-Throughput Pipelines
---------------------------------------------------------------
Select an option (1-6): `);
          break;
        case '4':
          print(`
---------------------------------------------------------------
CONTACT:
Email: contact@piush.com
LinkedIn: linkedin.com/in/piushks
GitHub: github.com/piushks
---------------------------------------------------------------
Select an option (1-6): `);
          break;
        case '5':
          print(`
---------------------------------------------------------------
Downloading C:\\PIUSH\\ABOUT.TXT to local session...
Transfer complete: 100% OK.
---------------------------------------------------------------
Select an option (1-6): `);
          audio.playDing();
          break;
        case '6':
          print('\nNO CARRIER\nConnection terminated by remote host.');
          audio.playError();
          setTimeout(() => win.close(), 1000);
          break;
        default:
          print('Invalid menu selection. Type 1, 2, 3, 4, 5, or 6: ');
          break;
      }
    }
  });

  container.addEventListener('click', () => {
    input?.focus();
  });
}

/**
 * 2. Dial-Up Networking
 */
export function renderDialUpNetworking(container: HTMLElement, win: Win95Window) {
  win.setTitle('Connect To - PiushNet 56K');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-3">
      <div class="flex items-center gap-3">
        <span class="text-4xl">📠</span>
        <div>
          <div class="text-xs font-bold">PiushNet Internet Connection</div>
          <div class="text-[11px] text-gray-700">USRobotics Sportster 56K Faxmodem</div>
        </div>
      </div>

      <div class="space-y-2 text-xs">
        <div class="flex items-center justify-between">
          <label class="font-bold">User name:</label>
          <input type="text" value="guest_engineer" class="retro-inset px-2 py-0.5 w-44 bg-white text-xs" />
        </div>
        <div class="flex items-center justify-between">
          <label class="font-bold">Password:</label>
          <input type="password" value="••••••••" class="retro-inset px-2 py-0.5 w-44 bg-white text-xs" />
        </div>
        <div class="flex items-center justify-between">
          <label class="font-bold">Phone number:</label>
          <input type="text" value="555-0195" class="retro-inset px-2 py-0.5 w-44 bg-white text-xs" />
        </div>
      </div>

      <!-- Status Box -->
      <div class="retro-inset p-2 bg-white text-xs">
        <div class="font-bold text-gray-800">Status:</div>
        <div id="dun-status" class="text-blue-900 mt-1">Ready to dial...</div>
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-white">
        <button id="dun-connect-btn" class="retro-btn !py-0.5 !px-4 font-bold text-xs">Connect</button>
        <button id="dun-cancel-btn" class="retro-btn !py-0.5 !px-3 text-xs">Cancel</button>
      </div>
    </div>
  `;

  const connectBtn = container.querySelector('#dun-connect-btn');
  const cancelBtn = container.querySelector('#dun-cancel-btn');
  const statusEl = container.querySelector('#dun-status') as HTMLElement;

  let dialing = false;

  connectBtn?.addEventListener('click', () => {
    if (dialing) return;
    dialing = true;
    audio.playDialUpHandshake();

    const stages = [
      'Dialing 555-0195...',
      'Sending DTMF tones...',
      'Waiting for carrier tone...',
      'Modem handshake: V.90 56,000 bps negotiated...',
      'Verifying username and password...',
      'Logging on to network...',
      'Connected at 57,600 bps! IP: 192.168.1.95',
    ];

    let step = 0;
    const iv = setInterval(() => {
      if (statusEl) statusEl.textContent = stages[step];
      step++;
      if (step >= stages.length) {
        clearInterval(iv);
        dialing = false;
        audio.playTada();
        alert('Connected to PiushNet 56K Internet!');
      }
    }, 1200);
  });

  cancelBtn?.addEventListener('click', () => {
    win.close();
  });
}

/**
 * 3. Network Neighborhood
 */
export function renderNetworkNeighborhood(container: HTMLElement, win: Win95Window) {
  win.setTitle('Network Neighborhood');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <div class="p-2 border-b border-black text-xs text-gray-700">
        Entire Network - Workgroup: <strong>WORKGROUP</strong>
      </div>

      <div class="flex-1 bg-white retro-inset m-2 p-3 overflow-auto">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <a href="https://github.com/piushks" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center p-2 hover:bg-[#000080] hover:text-white cursor-pointer rounded text-center text-black no-underline group">
            <span class="text-3xl">🖥️</span>
            <span class="text-xs font-bold mt-1">\\\\GITHUB</span>
            <span class="text-[10px] text-gray-500 group-hover:text-gray-300">Open Repositories</span>
          </a>

          <a href="https://linkedin.com/in/piushks/" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center p-2 hover:bg-[#000080] hover:text-white cursor-pointer rounded text-center text-black no-underline group">
            <span class="text-3xl">🖥️</span>
            <span class="text-xs font-bold mt-1">\\\\LINKEDIN</span>
            <span class="text-[10px] text-gray-500 group-hover:text-gray-300">Career & Experience</span>
          </a>

          <a href="https://x.com/piushks" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center p-2 hover:bg-[#000080] hover:text-white cursor-pointer rounded text-center text-black no-underline group">
            <span class="text-3xl">🖥️</span>
            <span class="text-xs font-bold mt-1">\\\\TWITTER</span>
            <span class="text-[10px] text-gray-500 group-hover:text-gray-300">@piushks Feed</span>
          </a>

          <a href="https://youtube.com/@PiushKS" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center p-2 hover:bg-[#000080] hover:text-white cursor-pointer rounded text-center text-black no-underline group">
            <span class="text-3xl">🖥️</span>
            <span class="text-xs font-bold mt-1">\\\\YOUTUBE</span>
            <span class="text-[10px] text-gray-500 group-hover:text-gray-300">Tech & Video</span>
          </a>
        </div>
      </div>
    </div>
  `;
}

/**
 * 4. Guestbook
 */
export function renderGuestbook(container: HTMLElement, win: Win95Window) {
  win.setTitle('Piush 95 Guestbook');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-2">
      <!-- Form -->
      <div class="space-y-1">
        <div class="flex items-center gap-2 text-xs">
          <label class="font-bold w-14">Name:</label>
          <input type="text" id="gb-name" placeholder="Your Name" class="retro-inset flex-1 px-2 py-0.5 bg-white text-xs" />
        </div>
        <div class="flex items-center gap-2 text-xs">
          <label class="font-bold w-14">Message:</label>
          <input type="text" id="gb-msg" placeholder="Greetings from cyberspace!" class="retro-inset flex-1 px-2 py-0.5 bg-white text-xs" />
          <button id="gb-sign-btn" class="retro-btn !py-0.5 !px-3 font-bold text-xs">Sign Book</button>
        </div>
      </div>

      <!-- Entries List -->
      <div class="flex-1 flex flex-col space-y-1">
        <label class="text-xs font-bold">Visitor Signatures:</label>
        <div id="gb-entries" class="retro-inset flex-1 p-2 bg-white text-xs overflow-auto select-text space-y-2"></div>
      </div>
    </div>
  `;

  const nameInput = container.querySelector('#gb-name') as HTMLInputElement;
  const msgInput = container.querySelector('#gb-msg') as HTMLInputElement;
  const signBtn = container.querySelector('#gb-sign-btn');
  const entriesEl = container.querySelector('#gb-entries') as HTMLElement;

  interface GbEntry { name: string; msg: string; date: string; }
  const defaultEntries: GbEntry[] = [
    { name: 'Bill G.', msg: 'Where do you want to go today? Great Windows 95 desktop!', date: 'Aug 24, 1995' },
    { name: 'Tech Recruiter', msg: 'Super impressive engineering portfolio! Let us connect.', date: 'Nov 12, 2026' },
  ];

  let entries: GbEntry[] = JSON.parse(localStorage.getItem('win95_guestbook') || JSON.stringify(defaultEntries));

  function renderEntries() {
    entriesEl.innerHTML = entries.map(e => `
      <div class="border-b border-gray-200 pb-1">
        <div class="flex justify-between items-center text-[10px] text-gray-500">
          <strong class="text-blue-900 text-xs">${e.name}</strong>
          <span>${e.date}</span>
        </div>
        <p class="text-gray-800 text-xs mt-0.5">${e.msg}</p>
      </div>
    `).join('');
  }

  signBtn?.addEventListener('click', () => {
    const name = nameInput.value.trim() || 'Anonymous Netizen';
    const msg = msgInput.value.trim();
    if (!msg) return;

    entries.unshift({
      name,
      msg,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });

    localStorage.setItem('win95_guestbook', JSON.stringify(entries));
    msgInput.value = '';
    audio.playTada();
    renderEntries();
  });

  renderEntries();
}

/**
 * Authentic Internet Explorer Browser Simulator
 */
export function renderInternetExplorer(container: HTMLElement, win: Win95Window) {
  win.setTitle('The Microsoft Internet Explorer – piush.com');

  const pages: Record<string, string> = {
    'http://piush.com/': `
      <div class="space-y-4">
        <div class="border-b-2 border-[#000080] pb-2">
          <h1 class="text-xl font-bold text-[#000080]">Welcome to Piush KS Cyber-Home</h1>
          <p class="text-xs text-gray-600 font-mono">Senior Mobile & Cloud Engineer | Production Web & Native Systems</p>
        </div>
        <p class="text-xs leading-relaxed">
          Welcome to the world wide web headquarters of Piush KS. Building resilient native Android, iOS, and distributed cloud backends for over 8 years.
        </p>
        <div class="retro-inset p-3 bg-gray-100 text-xs space-y-1.5">
          <div class="font-bold text-[#000080]">Featured Sites & Destinations:</div>
          <div>👉 <a href="#" class="ie-link text-blue-800 underline font-bold" data-url="http://piush.com/work/">Browse Production Projects Portfolio</a></div>
          <div>👉 <a href="#" class="ie-link text-blue-800 underline font-bold" data-url="http://piush.com/blog/">Read Technical Deep Dives & Articles</a></div>
          <div>👉 <a href="#" class="ie-link text-blue-800 underline font-bold" data-url="http://piush.com/quiz/">Take the 550-Question Developer Quiz</a></div>
          <div>👉 <a href="#" class="ie-link text-blue-800 underline font-bold" data-url="http://piush.com/about/">About the Engineer & Specs</a></div>
        </div>
      </div>
    `,
    'http://piush.com/work/': `
      <div class="space-y-3">
        <h2 class="text-lg font-bold text-[#000080]">Engineering Projects Portfolio</h2>
        <p class="text-xs text-gray-700">Selected production applications, SDKs, and mobile ecosystems.</p>
        <ul class="text-xs list-disc pl-5 space-y-1 text-gray-800">
          <li><strong>Production Mobile Apps:</strong> 10M+ Global active users across Android & iOS.</li>
          <li><strong>Real-time Offline Sync:</strong> Conflict-free replication engine for edge devices.</li>
          <li><strong>Custom Design Token Engine:</strong> Micro-animations maintaining constant 60 FPS.</li>
          <li><strong>Enterprise Microservices:</strong> High-throughput Go and Node.js distributed backends.</li>
        </ul>
      </div>
    `,
    'http://piush.com/blog/': `
      <div class="space-y-3">
        <h2 class="text-lg font-bold text-[#000080]">Engineering Articles & Dispatches</h2>
        <ul class="text-xs list-disc pl-5 space-y-1 text-gray-800">
          <li>React Native vs. Flutter in 2025: Architectural Trade-offs</li>
          <li>Deep Dive into the Flutter Rendering Pipeline</li>
          <li>Mastering OKLCH CSS Color Spaces</li>
          <li>Micro-Animations That Don't Ruin 60 FPS</li>
          <li>Offline-First Mobile Sync and Conflict Resolution</li>
        </ul>
      </div>
    `,
    'http://piush.com/about/': `
      <div class="space-y-3">
        <h2 class="text-lg font-bold text-[#000080]">About Piush KS</h2>
        <p class="text-xs leading-relaxed">
          Senior Engineer & Solopreneur crafting fast, resilient mobile applications and distributed architectures.
        </p>
        <div class="retro-inset p-2.5 bg-gray-50 text-[11px] font-mono space-y-1">
          <div>Experience: 8+ Years Production</div>
          <div>Stack: Kotlin, Swift, Flutter, React, TypeScript, Astro, Node.js, AWS</div>
          <div>Global Reach: 10M+ User Impact</div>
        </div>
      </div>
    `,
    'http://piush.com/quiz/': `
      <div class="space-y-3">
        <h2 class="text-lg font-bold text-[#000080]">550-Question Developer Quiz Engine</h2>
        <p class="text-xs">Comprehensive full-stack engineering challenge across 23 technical categories.</p>
        <p class="text-xs font-bold text-emerald-800">100% verified question database with detailed rationales.</p>
      </div>
    `
  };

  let currentUrl = 'http://piush.com/';
  const history: string[] = ['http://piush.com/'];
  let historyIdx = 0;

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <!-- Menubar -->
      <div class="flex gap-3 px-2 py-0.5 text-xs bg-[#c0c0c0] border-b border-black/40">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Go</span>
        <span>Favorites</span>
        <span>Help</span>
      </div>

      <!-- Toolbar -->
      <div class="flex items-center gap-1 p-1 bg-[#c0c0c0] border-b border-white border-b-black/40 text-xs">
        <button id="ie-back" class="retro-btn !py-0.5 !px-2 flex items-center gap-1 font-bold">⬅️ Back</button>
        <button id="ie-forward" class="retro-btn !py-0.5 !px-2 flex items-center gap-1">➡️ Fwd</button>
        <button id="ie-stop" class="retro-btn !py-0.5 !px-2 flex items-center gap-1">🛑 Stop</button>
        <button id="ie-refresh" class="retro-btn !py-0.5 !px-2 flex items-center gap-1">🔄 Refresh</button>
        <button id="ie-home" class="retro-btn !py-0.5 !px-2 flex items-center gap-1">🏠 Home</button>
        <div class="ml-auto w-6 h-6 bg-[#000080] border border-black flex items-center justify-center text-white text-xs font-bold animate-spin" id="ie-spinner">
          e
        </div>
      </div>

      <!-- Address Bar -->
      <div class="flex items-center gap-2 px-2 py-1 bg-[#c0c0c0] border-b border-black/40 text-xs">
        <span class="font-bold text-gray-700">Address:</span>
        <input type="text" id="ie-address-input" value="${currentUrl}" class="retro-inset flex-1 px-2 py-0.5 bg-white text-black text-xs font-mono" />
        <button id="ie-go-btn" class="retro-btn !py-0.5 !px-3 font-bold text-xs">Go</button>
      </div>

      <!-- Web Content Viewport -->
      <div id="ie-viewport" class="retro-inset flex-1 p-4 bg-white text-black overflow-auto select-text font-serif">
        ${pages[currentUrl] || '<p>Page not found</p>'}
      </div>

      <!-- Status Bar -->
      <div class="flex items-center justify-between px-2 py-0.5 text-[11px] bg-[#c0c0c0] border-t border-white border-t-black/40">
        <span id="ie-status">Done</span>
        <span class="text-gray-600 font-bold">Internet Zone</span>
      </div>
    </div>
  `;

  const addressInput = container.querySelector('#ie-address-input') as HTMLInputElement;
  const viewport = container.querySelector('#ie-viewport') as HTMLElement;
  const statusEl = container.querySelector('#ie-status') as HTMLElement;
  const spinner = container.querySelector('#ie-spinner') as HTMLElement;
  const backBtn = container.querySelector('#ie-back') as HTMLButtonElement;
  const forwardBtn = container.querySelector('#ie-forward') as HTMLButtonElement;

  function loadPage(url: string, pushHist = true) {
    audio.playClick();
    if (spinner) spinner.style.display = 'flex';
    if (statusEl) statusEl.textContent = `Connecting to ${url}...`;

    setTimeout(() => {
      currentUrl = url;
      if (addressInput) addressInput.value = url;
      if (viewport) {
        viewport.innerHTML = pages[url] || `
          <div class="space-y-3">
            <h2 class="text-lg font-bold text-red-700">HTTP 404 – Not Found</h2>
            <p class="text-xs">The requested URL <code>${url}</code> was not found on this simulated server.</p>
          </div>
        `;
        wireLinks();
      }
      if (spinner) spinner.style.display = 'flex';
      if (statusEl) statusEl.textContent = 'Done';

      if (pushHist) {
        history.splice(historyIdx + 1);
        history.push(url);
        historyIdx = history.length - 1;
      }
      win.setTitle(`The Microsoft Internet Explorer – ${url.replace('http://', '')}`);
    }, 200);
  }

  function wireLinks() {
    viewport.querySelectorAll('.ie-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const dest = (link as HTMLElement).getAttribute('data-url');
        if (dest) loadPage(dest);
      });
    });
  }

  wireLinks();

  container.querySelector('#ie-go-btn')?.addEventListener('click', () => {
    loadPage(addressInput.value.trim());
  });

  addressInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loadPage(addressInput.value.trim());
  });

  backBtn?.addEventListener('click', () => {
    if (historyIdx > 0) {
      historyIdx--;
      loadPage(history[historyIdx], false);
    }
  });

  forwardBtn?.addEventListener('click', () => {
    if (historyIdx < history.length - 1) {
      historyIdx++;
      loadPage(history[historyIdx], false);
    }
  });

  container.querySelector('#ie-refresh')?.addEventListener('click', () => {
    loadPage(currentUrl, false);
  });

  container.querySelector('#ie-home')?.addEventListener('click', () => {
    loadPage('http://piush.com/');
  });
}


