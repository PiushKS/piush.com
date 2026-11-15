// Piush 95 - Productivity Collection
// Calendar, Clock & Alarms, Sticky Notes, To-Do List, File Search, Help, Run Dialog

import { audio } from '../audio';
import { vfs } from '../fs';
import { windowManager, type Win95Window } from '../windowManager';

/**
 * 1. Calendar
 */
export function renderCalendar(container: HTMLElement, win: Win95Window) {
  win.setTitle('Calendar 95');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-2">
      <div class="flex items-center justify-between">
        <button id="cal-prev" class="retro-btn !py-0.5 !px-2 text-xs font-bold">◀ Prev</button>
        <span id="cal-month-year" class="text-xs font-bold text-blue-900">...</span>
        <button id="cal-next" class="retro-btn !py-0.5 !px-2 text-xs font-bold">Next ▶</button>
      </div>

      <div class="retro-inset p-2 bg-white flex-1 flex flex-col">
        <div class="grid grid-cols-7 text-center font-bold text-xs border-b border-black pb-1">
          <span class="text-red-600">Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
        </div>
        <div id="cal-days" class="grid grid-cols-7 gap-1 text-center text-xs flex-1 pt-2"></div>
      </div>

      <div class="retro-inset p-2 bg-[#ffffcc] text-xs">
        <span class="font-bold">Daily Notes:</span>
        <input type="text" id="cal-note-input" placeholder="Type a reminder for selected day..." class="w-full mt-1 px-1 py-0.5 border border-black bg-white text-xs font-mono" />
      </div>
    </div>
  `;

  let date = new Date();
  const monthYearEl = container.querySelector('#cal-month-year') as HTMLElement;
  const daysEl = container.querySelector('#cal-days') as HTMLElement;
  const prevBtn = container.querySelector('#cal-prev');
  const nextBtn = container.querySelector('#cal-next');

  function render() {
    const year = date.getFullYear();
    const month = date.getMonth();

    if (monthYearEl) {
      monthYearEl.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    daysEl.innerHTML = '';

    // Blank cells
    for (let i = 0; i < firstDay; i++) {
      daysEl.innerHTML += '<div></div>';
    }

    const today = new Date();
    for (let d = 1; d <= totalDays; d++) {
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
      const cell = document.createElement('div');
      cell.className = `p-1 cursor-pointer hover:bg-blue-100 flex flex-col items-center justify-center rounded ${
        isToday ? 'bg-[#000080] text-white font-bold' : ''
      }`;
      cell.textContent = String(d);
      cell.onclick = () => {
        audio.playClick();
        const noteInput = container.querySelector('#cal-note-input') as HTMLInputElement;
        if (noteInput) noteInput.value = `Note for ${month + 1}/${d}/${year}: System check passed.`;
      };
      daysEl.appendChild(cell);
    }
  }

  prevBtn?.addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1);
    render();
    audio.playClick();
  });

  nextBtn?.addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1);
    render();
    audio.playClick();
  });

  render();
}

/**
 * 2. Clock & Alarms
 */
export function renderClockAlarms(container: HTMLElement, win: Win95Window) {
  win.setTitle('Clock & Stopwatch 95');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-3">
      <!-- Digital Clock Display -->
      <div class="retro-inset p-3 bg-black text-center border-2 border-white">
        <div id="clk-digital" class="text-3xl font-bold text-green-400 tracking-wider">00:00:00</div>
        <div id="clk-date" class="text-xs text-green-300 mt-1">Windows 95 Standard Time</div>
      </div>

      <!-- Stopwatch Section -->
      <div class="retro-inset p-2 bg-[#d0d0d0] space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold">Stopwatch:</span>
          <span id="sw-display" class="font-bold text-base text-blue-900">00:00.0</span>
        </div>
        <div class="flex justify-center gap-2">
          <button id="sw-start" class="retro-btn !py-0.5 !px-3 font-bold text-xs">Start</button>
          <button id="sw-stop" class="retro-btn !py-0.5 !px-3 text-xs">Stop</button>
          <button id="sw-reset" class="retro-btn !py-0.5 !px-3 text-xs">Reset</button>
        </div>
      </div>
    </div>
  `;

  const digi = container.querySelector('#clk-digital') as HTMLElement;
  const dateEl = container.querySelector('#clk-date') as HTMLElement;
  const swDisplay = container.querySelector('#sw-display') as HTMLElement;
  const swStart = container.querySelector('#sw-start');
  const swStop = container.querySelector('#sw-stop');
  const swReset = container.querySelector('#sw-reset');

  let swInterval = 0;
  let swElapsed = 0;

  function updateClock() {
    const now = new Date();
    if (digi) digi.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  }

  const clkInterval = setInterval(updateClock, 1000);
  updateClock();

  swStart?.addEventListener('click', () => {
    if (swInterval) return;
    audio.playClick();
    const start = Date.now() - swElapsed;
    swInterval = window.setInterval(() => {
      swElapsed = Date.now() - start;
      const sec = Math.floor(swElapsed / 1000);
      const ms = Math.floor((swElapsed % 1000) / 100);
      const m = String(Math.floor(sec / 60)).padStart(2, '0');
      const s = String(sec % 60).padStart(2, '0');
      if (swDisplay) swDisplay.textContent = `${m}:${s}.${ms}`;
    }, 100);
  });

  swStop?.addEventListener('click', () => {
    audio.playClick();
    clearInterval(swInterval);
    swInterval = 0;
  });

  swReset?.addEventListener('click', () => {
    audio.playClick();
    clearInterval(swInterval);
    swInterval = 0;
    swElapsed = 0;
    if (swDisplay) swDisplay.textContent = '00:00.0';
  });

  win.element.addEventListener('DOMNodeRemovedFromDocument', () => {
    clearInterval(clkInterval);
    clearInterval(swInterval);
  });
}

/**
 * 3. Sticky Notes
 */
export function renderStickyNotes(container: HTMLElement, win: Win95Window) {
  win.setTitle('Sticky Note 95');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#ffff88] text-black font-mono select-text p-2">
      <div class="flex justify-between items-center pb-1 border-b border-black/20 text-[10px] select-none">
        <span class="font-bold">📝 STICKY NOTE</span>
        <button id="note-save" class="retro-btn !py-0 !px-1.5 text-[10px]">Save to VFS</button>
      </div>
      <textarea id="note-body" class="flex-1 bg-transparent border-none outline-none resize-none p-1 text-xs font-mono leading-relaxed mt-1" placeholder="Type your note here...">Remember to review:
- Cloud microservice latencies
- iOS Swift concurrency migration
- 550 quiz challenges passed
</textarea>
    </div>
  `;

  const body = container.querySelector('#note-body') as HTMLTextAreaElement;
  const saveBtn = container.querySelector('#note-save');

  saveBtn?.addEventListener('click', () => {
    vfs.writeFile('C:\\My Documents\\Notes\\sticky.txt', body.value);
    audio.playDing();
    alert('Note saved to "C:\\My Documents\\Notes\\sticky.txt"!');
  });
}

/**
 * 4. To-Do List
 */
export function renderTodoList(container: HTMLElement, win: Win95Window) {
  win.setTitle('Task List 95');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-2">
      <div class="flex gap-2">
        <input type="text" id="todo-input" placeholder="New task..." class="retro-inset flex-1 px-2 py-0.5 bg-white text-xs" />
        <button id="todo-add-btn" class="retro-btn !py-0.5 !px-3 font-bold text-xs">Add</button>
      </div>

      <div class="retro-inset bg-white p-2 flex-1 overflow-auto">
        <div id="todo-items" class="space-y-1 text-xs"></div>
      </div>
    </div>
  `;

  const input = container.querySelector('#todo-input') as HTMLInputElement;
  const addBtn = container.querySelector('#todo-add-btn');
  const itemsContainer = container.querySelector('#todo-items') as HTMLElement;

  interface Todo { text: string; done: boolean; }
  let todos: Todo[] = JSON.parse(localStorage.getItem('win95_todos') || JSON.stringify([
    { text: 'Deploy resilient cloud architecture', done: true },
    { text: 'Ship interactive Windows 95 desktop experience', done: true },
    { text: 'Verify 550 developer quiz questions', done: true },
    { text: 'Build real playable retro games suite', done: false },
  ]));

  function render() {
    itemsContainer.innerHTML = '';
    todos.forEach((t, i) => {
      const item = document.createElement('div');
      item.className = 'flex items-center justify-between p-1 hover:bg-gray-100 border-b border-gray-200';
      item.innerHTML = `
        <label class="flex items-center gap-2 cursor-pointer flex-1">
          <input type="checkbox" ${t.done ? 'checked' : ''} data-idx="${i}" />
          <span class="${t.done ? 'line-through text-gray-500' : 'text-black'}">${t.text}</span>
        </label>
        <button class="text-red-600 hover:text-red-900 font-bold px-1" data-del="${i}">✕</button>
      `;
      itemsContainer.appendChild(item);
    });

    localStorage.setItem('win95_todos', JSON.stringify(todos));
  }

  addBtn?.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    todos.push({ text, done: false });
    input.value = '';
    audio.playClick();
    render();
  });

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addBtn?.dispatchEvent(new MouseEvent('click'));
  });

  itemsContainer?.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    const idx = target.getAttribute('data-idx');
    if (idx !== null) {
      todos[parseInt(idx, 10)].done = target.checked;
      audio.playClick();
      render();
    }
  });

  itemsContainer?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const delIdx = target.getAttribute('data-del');
    if (delIdx !== null) {
      todos.splice(parseInt(delIdx, 10), 1);
      audio.playClick();
      render();
    }
  });

  render();
}

/**
 * 5. File Search (Find Files or Folders)
 */
export function renderFileSearch(container: HTMLElement, win: Win95Window) {
  win.setTitle('Find: All Files');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-3">
      <!-- Search Fields -->
      <div class="space-y-2 text-xs">
        <div class="flex items-center gap-2">
          <label class="font-bold w-16">Named:</label>
          <input type="text" id="find-name" value="*.txt" class="retro-inset flex-1 px-2 py-0.5 bg-white text-xs" />
        </div>
        <div class="flex items-center gap-2">
          <label class="font-bold w-16">Look in:</label>
          <input type="text" value="C:\\" class="retro-inset flex-1 px-2 py-0.5 bg-white text-xs" readonly />
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex justify-end gap-2 border-b border-black pb-2">
        <button id="find-now-btn" class="retro-btn !py-0.5 !px-4 font-bold text-xs">Find Now</button>
        <button id="find-new-btn" class="retro-btn !py-0.5 !px-3 text-xs">New Search</button>
      </div>

      <!-- Results Grid -->
      <div class="flex-1 flex flex-col space-y-1">
        <div class="text-xs font-bold">Search Results:</div>
        <div class="retro-inset flex-1 bg-white p-2 overflow-auto">
          <div id="find-results" class="space-y-1 text-xs"></div>
        </div>
      </div>
    </div>
  `;

  const nameInput = container.querySelector('#find-name') as HTMLInputElement;
  const findBtn = container.querySelector('#find-now-btn');
  const resultsEl = container.querySelector('#find-results') as HTMLElement;

  findBtn?.addEventListener('click', () => {
    const q = nameInput.value.trim().replace(/\*/g, '');
    audio.playClick();

    const matches = vfs.search(q);
    if (matches.length === 0) {
      resultsEl.innerHTML = '<span class="text-gray-400 italic">No files matching criteria found.</span>';
    } else {
      resultsEl.innerHTML = matches.map(m => `
        <div class="flex items-center justify-between p-1 hover:bg-[#000080] hover:text-white cursor-pointer border-b border-gray-100">
          <div class="flex items-center gap-1.5 truncate">
            <span>📄</span>
            <span class="font-bold">${m.name}</span>
          </div>
          <span class="text-[10px] text-gray-500">${m.path} (${m.size || 0} B)</span>
        </div>
      `).join('');
    }
  });
}

/**
 * 6. Windows 95 Help System
 */
export function renderHelpSystem(container: HTMLElement, win: Win95Window) {
  win.setTitle('Windows 95 Help Topics');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <!-- Tabs -->
      <div class="flex gap-1 p-2 bg-[#c0c0c0] border-b border-black">
        <button class="retro-btn !py-0.5 !px-3 font-bold !bg-[#c0c0c0]">Contents</button>
        <button class="retro-btn !py-0.5 !px-3 !bg-[#a0a0a0]">Index</button>
        <button class="retro-btn !py-0.5 !px-3 !bg-[#a0a0a0]">Find</button>
      </div>

      <div class="flex-1 flex overflow-hidden">
        <!-- Topics list -->
        <div class="w-48 bg-white retro-inset m-2 p-2 overflow-auto text-xs space-y-1">
          <div class="font-bold border-b pb-1">Help Topics:</div>
          <div class="help-topic hover:bg-[#000080] hover:text-white p-1 cursor-pointer font-bold" data-topic="welcome">📖 Welcome to Piush 95</div>
          <div class="help-topic hover:bg-[#000080] hover:text-white p-1 cursor-pointer" data-topic="multitasking">🗖 Running Multiple Apps</div>
          <div class="help-topic hover:bg-[#000080] hover:text-white p-1 cursor-pointer" data-topic="vfs">💾 Virtual Filesystem</div>
          <div class="help-topic hover:bg-[#000080] hover:text-white p-1 cursor-pointer" data-topic="audio">🔊 Web Audio Synthesis</div>
          <div class="help-topic hover:bg-[#000080] hover:text-white p-1 cursor-pointer" data-topic="games">🎮 Playable Retro Games</div>
          <div class="help-topic hover:bg-[#000080] hover:text-white p-1 cursor-pointer" data-topic="quiz">⚡ 550 Developer Quiz</div>
          <div class="help-topic hover:bg-[#000080] hover:text-white p-1 cursor-pointer" data-topic="portfolio">🚀 Portfolio Engineering</div>
        </div>

        <!-- Topic body -->
        <div class="flex-1 bg-white retro-inset m-2 ml-0 p-3 overflow-auto text-xs select-text leading-relaxed">
          <div id="help-content">
            <h2 class="text-sm font-bold text-blue-900 border-b pb-1 mb-2">Welcome to Piush 95</h2>
            <p>Piush 95 is a fully functional Windows 95 software ecosystem implemented right in the browser.</p>
            <p class="mt-2">Every program in the Start Menu is interactive: Notepad, Paint, Calculator, Minesweeper, Solitaire, Pinball, Media Player, and the MS-DOS prompt!</p>
          </div>
        </div>
      </div>
    </div>
  `;

  const articles: { [key: string]: { title: string; body: string } } = {
    welcome: {
      title: 'Welcome to Piush 95',
      body: 'Piush 95 is a fully functional Windows 95 software ecosystem implemented right in the browser.\n\nEvery program in the Start Menu is interactive: Notepad, Paint, Calculator, Minesweeper, Solitaire, Pinball, Media Player, and the MS-DOS prompt!',
    },
    multitasking: {
      title: 'Running Multiple Applications',
      body: 'You can open multiple windows simultaneously. Drag windows by their titlebars, resize them, maximize to fill the screen, or minimize them down to the Windows 95 taskbar at the bottom.',
    },
    vfs: {
      title: 'Virtual Filesystem (VFS)',
      body: 'Piush 95 contains a complete client-side Virtual Filesystem mapped to drives C: and A:. Files saved in Notepad, Paint, or Sound Recorder persist in localStorage and are accessible via Windows Explorer and MS-DOS.',
    },
    audio: {
      title: 'Web Audio Synthesis',
      body: 'All system sound effects (Click, Chord, Ding, Tada, Error, DTMF phone dialing, and the authentic 56K modem handshake) are synthesized on-the-fly using the Web Audio API with zero external audio assets.',
    },
    games: {
      title: 'Playable Retro Games',
      body: 'Enjoy full implementations of Minesweeper, Solitaire, FreeCell, Hearts, 3D Pinball Space Cadet, Snake, Chess, Brick Breaker, Space Defender, Tic-Tac-Toe, Memory Match, Reversi, 2048, and Falling Blocks!',
    },
    quiz: {
      title: '550 Developer Quiz Questions',
      body: 'Piush.com features 550 verified, categorized technical questions covering Swift, Kotlin, React, Python, Cloud Architecture, System Design, and more.',
    },
    portfolio: {
      title: 'Portfolio Engineering Bio',
      body: 'Crafted by Piush KS, Senior Mobile & Cloud Architect with 8+ years experience building mission-critical apps for 10M+ users globally.',
    },
  };

  const contentEl = container.querySelector('#help-content') as HTMLElement;
  container.querySelectorAll('.help-topic').forEach((el) => {
    el.addEventListener('click', () => {
      const topic = el.getAttribute('data-topic');
      if (topic && articles[topic]) {
        audio.playClick();
        contentEl.innerHTML = `
          <h2 class="text-sm font-bold text-blue-900 border-b pb-1 mb-2">${articles[topic].title}</h2>
          <p class="whitespace-pre-wrap">${articles[topic].body}</p>
        `;
      }
    });
  });
}

/**
 * 7. Run Dialog
 */
export function renderRunDialog(container: HTMLElement, win: Win95Window) {
  win.setTitle('Run');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-3">
      <div class="flex items-start gap-3">
        <span class="text-3xl">🏃</span>
        <p class="text-xs leading-tight">
          Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.
        </p>
      </div>

      <div class="flex items-center gap-2 text-xs">
        <label class="font-bold">Open:</label>
        <input type="text" id="run-cmd" value="cmd" class="retro-inset flex-1 px-2 py-0.5 bg-white text-xs font-mono" autofocus />
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-white">
        <button id="run-ok-btn" class="retro-btn !py-0.5 !px-4 font-bold text-xs">OK</button>
        <button id="run-cancel-btn" class="retro-btn !py-0.5 !px-3 text-xs">Cancel</button>
      </div>
    </div>
  `;

  const cmdInput = container.querySelector('#run-cmd') as HTMLInputElement;
  const okBtn = container.querySelector('#run-ok-btn');
  const cancelBtn = container.querySelector('#run-cancel-btn');

  function execute() {
    const cmd = cmdInput.value.trim().toLowerCase();
    win.close();
    audio.playClick();

    // Trigger launcher from global scope or windowManager
    const globalLauncher = (window as unknown as { launchWin95App?: (id: string) => void }).launchWin95App;
    if (globalLauncher) {
      if (cmd === 'cmd' || cmd === 'dos' || cmd === 'command') globalLauncher('dos');
      else if (cmd === 'notepad') globalLauncher('notepad');
      else if (cmd === 'calc') globalLauncher('calc');
      else if (cmd === 'paint' || cmd === 'pbrush') globalLauncher('paint');
      else if (cmd === 'pinball') globalLauncher('pinball');
      else if (cmd === 'minesweeper' || cmd === 'winmine') globalLauncher('minesweeper');
      else if (cmd === 'sol' || cmd === 'solitaire') globalLauncher('solitaire');
      else if (cmd === 'snake') globalLauncher('snake');
      else if (cmd === 'chess') globalLauncher('chess');
      else if (cmd === 'explorer') globalLauncher('explorer');
      else if (cmd.startsWith('http')) window.open(cmd, '_blank');
      else alert(`Cannot find file "${cmd}" (or one of its components). Make sure the path and filename are correct.`);
    }
  }

  okBtn?.addEventListener('click', execute);
  cancelBtn?.addEventListener('click', () => win.close());
  cmdInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') execute();
  });
}
