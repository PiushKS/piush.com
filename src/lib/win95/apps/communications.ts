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

