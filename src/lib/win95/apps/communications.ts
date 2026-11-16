// Piush 95 - Communications Collection
// HyperTerminal, Dial-Up Networking, Network Neighborhood, Guestbook, Internet Explorer

import { audio } from '../audio';
import { vfs } from '../fs';
import type { Win95Window } from '../windowManager';

/**
 * 1. HyperTerminal - PiushNet BBS Dial-In Terminal
 */
export function renderHyperTerminal(container: HTMLElement, win: Win95Window) {
  win.setTitle('HyperTerminal - PiushNet BBS (Connected 57,600)');

  container.innerHTML = `
    <div class="flex flex-col h-full bg-black text-[#00ffcc] font-mono text-xs select-text overflow-hidden p-2">
      <!-- Menubar -->
      <div class="flex gap-4 px-1 py-0.5 text-xs bg-[#c0c0c0] text-black border-b border-black -mx-2 -mt-2 mb-2 select-none">
        <span class="hover:underline cursor-pointer" id="ht-menu-file">File</span>
        <span class="hover:underline cursor-pointer" id="ht-menu-edit">Edit</span>
        <span class="hover:underline cursor-pointer" id="ht-menu-transfer">Transfer</span>
        <span class="hover:underline cursor-pointer" id="ht-menu-help">Help</span>
      </div>

      <div id="ht-screen" class="flex-1 overflow-auto whitespace-pre leading-tight select-text">===============================================================
* * *  P I U S H . C O M   B B S   ( N O D E   1 )  * * *
===============================================================
Baud Rate: 57,600 bps | Protocol: ANSI / VT100
Sysop: Piush KS (Senior Mobile & Cloud Architect)
Location: CyberSpace Node 01 | Port: 23

MAIN MENU:
  [1] About Piush KS & Engineering Bio
  [2] Featured Production Applications
  [3] System Architecture & Cloud Tech
  [4] Leave a Message on BBS (Sign Guestbook)
  [5] Download Resume via ZMODEM (RESUME.TXT)
  [6] Ping Host & Network Diagnostics
  [7] Disconnect / Hang Up

Select an option (1-7): </div>
      <div class="flex items-center gap-1 pt-1 border-t border-gray-800 text-white select-none">
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
Select an option (1-7): `);
          break;
        case '2':
          print(`
---------------------------------------------------------------
FEATURED WORK:
- High-concurrency enterprise mobile applications
- 550+ Validated Interactive Engineering Quiz Database
- Web desktop with pure audio synthesis & client-side VFS
- 73 Pre-rendered Edge static routes
---------------------------------------------------------------
Select an option (1-7): `);
          break;
        case '3':
          print(`
---------------------------------------------------------------
CORE STACK:
- Mobile: Swift, SwiftUI, Combine, Kotlin, Jetpack Compose, Flutter
- Cloud: AWS, GCP, Node.js, Distributed Microservices, Docker
- Systems: Linux, Git, High-Throughput Pipelines
---------------------------------------------------------------
Select an option (1-7): `);
          break;
        case '4': {
          const author = prompt('Enter your name / handle:', 'Netizen');
          const msg = prompt('Enter message for Piush KS BBS:');
          if (msg) {
            try {
              const gb = JSON.parse(localStorage.getItem('win95_guestbook') || '[]');
              gb.unshift({ name: author || 'BBS Caller', msg, date: new Date().toLocaleDateString('en-US') });
              localStorage.setItem('win95_guestbook', JSON.stringify(gb));
              print(`\n[OK] Message logged to guestbook: "${msg}" by ${author}`);
            } catch (_) {}
          }
          print('Select an option (1-7): ');
          break;
        }
        case '5':
          print(`
---------------------------------------------------------------
[ZMODEM] Initiating download of RESUME.TXT...
Receiving: [████████████████████] 100% (1,420 bytes)
File saved to C:\\My Documents\\RESUME.TXT in Virtual Filesystem.
CRC-32 Checksum Verified: 0x95E1A0F4 [OK]
---------------------------------------------------------------
Select an option (1-7): `);
          vfs.writeFile('C:\\My Documents\\RESUME.TXT', 'Piush KS - Senior Mobile & Cloud Architect\nContact: hi@piush.com\nSpecializations: Swift, Kotlin, Cloud, Systems');
          audio.playTada();
          break;
        case '6':
          print(`
---------------------------------------------------------------
Pinging piush.com [192.168.1.95] with 32 bytes of data:
Reply from 192.168.1.95: bytes=32 time=24ms TTL=128
Reply from 192.168.1.95: bytes=32 time=21ms TTL=128
Reply from 192.168.1.95: bytes=32 time=25ms TTL=128
Ping statistics for 192.168.1.95:
    Packets: Sent = 3, Received = 3, Lost = 0 (0% loss)
---------------------------------------------------------------
Select an option (1-7): `);
          break;
        case '7':
          print('\nNO CARRIER\nConnection terminated by remote host.');
          audio.playError();
          setTimeout(() => win.close(), 1000);
          break;
        default:
          print('Invalid menu selection. Type 1, 2, 3, 4, 5, 6, or 7: ');
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

  const connections = [
    { name: 'PiushNet 56K (Default)', phone: '555-0195', baud: '57,600 bps' },
    { name: 'Compuserve Information Service', phone: '555-0188', baud: '33,600 bps' },
    { name: 'AOL Dial-Up Online', phone: '555-0100', baud: '28,800 bps' },
  ];

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-3">
      <div class="flex items-center gap-3">
        <span class="text-4xl">📠</span>
        <div>
          <div class="text-xs font-bold" id="dun-profile-title">PiushNet Internet Connection</div>
          <div class="text-[11px] text-gray-700">USRobotics Sportster 56K Faxmodem</div>
        </div>
      </div>

      <div class="space-y-2 text-xs">
        <div class="flex items-center justify-between">
          <label class="font-bold">Connection:</label>
          <select id="dun-conn-select" class="retro-select px-1.5 py-0.5 w-44 text-xs font-mono">
            ${connections.map((c, i) => `<option value="${i}">${c.name}</option>`).join('')}
          </select>
        </div>
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
          <input type="text" id="dun-phone" value="555-0195" class="retro-inset px-2 py-0.5 w-44 bg-white text-xs" />
        </div>
      </div>

      <!-- Status Box -->
      <div class="retro-inset p-2 bg-white text-xs">
        <div class="font-bold text-gray-800">Modem Status:</div>
        <div id="dun-status" class="text-blue-900 mt-1 font-bold">Ready to dial...</div>
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
  const connSelect = container.querySelector('#dun-conn-select') as HTMLSelectElement;
  const phoneInput = container.querySelector('#dun-phone') as HTMLInputElement;

  let dialing = false;

  connSelect?.addEventListener('change', () => {
    const sel = connections[parseInt(connSelect.value, 10)];
    if (phoneInput) phoneInput.value = sel.phone;
    audio.playClick();
  });

  connectBtn?.addEventListener('click', () => {
    if (dialing) return;
    dialing = true;
    audio.playDialUpHandshake((msg) => {
      if (statusEl) statusEl.textContent = msg;
    });

    setTimeout(() => {
      dialing = false;
      audio.playTada();
      if (statusEl) statusEl.textContent = 'Connected at 57,600 bps! IP: 192.168.1.95';
      const openIE = confirm('Connected to Internet successfully!\n\nWould you like to launch The Microsoft Internet Explorer?');
      if (openIE) {
        win.close();
        const globalLauncher = (window as unknown as { launchWin95App?: (id: string) => void }).launchWin95App;
        if (globalLauncher) globalLauncher('ie');
      }
    }, 4500);
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
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
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

          <div id="net-localpc" class="flex flex-col items-center p-2 hover:bg-[#000080] hover:text-white cursor-pointer rounded text-center text-black no-underline group">
            <span class="text-3xl">💻</span>
            <span class="text-xs font-bold mt-1">\\\\PIUSH_PC</span>
            <span class="text-[10px] text-gray-500 group-hover:text-gray-300">Local Hard Drive C:</span>
          </div>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#net-localpc')?.addEventListener('click', () => {
    audio.playClick();
    const launcher = (window as unknown as { launchWin95App?: (id: string) => void }).launchWin95App;
    if (launcher) launcher('explorer');
  });
}

/**
 * 4. Guestbook - Visitor Signatures with Persistence
 */
export function renderGuestbook(container: HTMLElement, win: Win95Window) {
  win.setTitle('Piush 95 Guestbook');

  interface GbEntry {
    name: string;
    msg: string;
    date: string;
  }

  const defaultEntries: GbEntry[] = [
    { name: 'Bill G.', msg: 'Where do you want to go today? Great Windows 95 desktop experience!', date: 'Aug 24, 1995' },
    { name: 'Tech Recruiter', msg: 'Super impressive engineering portfolio! Let us connect regarding senior architect roles.', date: 'Nov 12, 2026' },
    { name: 'Fellow Engineer', msg: 'The sound synthesis and VFS implementation are unreal. 10/10 craft!', date: 'Nov 14, 2026' },
  ];

  let entries: GbEntry[] = [];
  try {
    const saved = localStorage.getItem('win95_guestbook');
    entries = saved ? JSON.parse(saved) : defaultEntries;
  } catch (_) {
    entries = defaultEntries;
  }

  function save() {
    try {
      localStorage.setItem('win95_guestbook', JSON.stringify(entries));
      const text = entries.map(e => `[${e.date}] ${e.name}: ${e.msg}`).join('\n\n');
      vfs.writeFile('C:\\My Documents\\guestbook.txt', text);
    } catch (_) {}
  }

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-2">
      <!-- Form -->
      <div class="space-y-1">
        <div class="flex items-center gap-2 text-xs">
          <label class="font-bold w-14">Name:</label>
          <input type="text" id="gb-name" placeholder="Your Name or Handle" class="retro-inset flex-1 px-2 py-0.5 bg-white text-xs" />
        </div>
        <div class="flex items-center gap-2 text-xs">
          <label class="font-bold w-14">Message:</label>
          <input type="text" id="gb-msg" placeholder="Greetings from cyberspace!" class="retro-inset flex-1 px-2 py-0.5 bg-white text-xs" />
          <button id="gb-sign-btn" class="retro-btn !py-0.5 !px-3 font-bold text-xs">Sign Book</button>
        </div>
      </div>

      <!-- Entries List -->
      <div class="flex-1 flex flex-col space-y-1">
        <div class="flex justify-between items-center text-xs">
          <label class="font-bold">Visitor Signatures:</label>
          <span class="text-gray-600 font-bold" id="gb-count">${entries.length} signatures</span>
        </div>
        <div id="gb-entries" class="retro-inset flex-1 p-2 bg-white text-xs overflow-auto select-text space-y-2"></div>
      </div>
    </div>
  `;

  const nameInput = container.querySelector('#gb-name') as HTMLInputElement;
  const msgInput = container.querySelector('#gb-msg') as HTMLInputElement;
  const signBtn = container.querySelector('#gb-sign-btn');
  const entriesEl = container.querySelector('#gb-entries') as HTMLElement;
  const countEl = container.querySelector('#gb-count') as HTMLElement;

  function renderEntries() {
    if (!entriesEl) return;
    if (countEl) countEl.textContent = `${entries.length} signatures`;
    entriesEl.innerHTML = entries.map(e => `
      <div class="border-b border-gray-200 pb-1.5">
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

    save();
    msgInput.value = '';
    audio.playTada();
    renderEntries();
  });

  msgInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') signBtn?.dispatchEvent(new MouseEvent('click'));
  });

  renderEntries();
}

/**
 * 5. The Microsoft Internet Explorer - Authentic Browser Simulator
 */
export { renderInternetExplorer } from './internetExplorer';
