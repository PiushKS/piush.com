// Piush 95 - System Tools Collection
// MS-DOS Prompt, Windows Explorer, Control Panel, System Information,
// Disk Properties, ScanDisk, Disk Defragmenter, Backup & Restore, Task Manager, Resource Monitor

import { audio } from '../audio';
import { vfs } from '../fs';
import { windowManager, type Win95Window } from '../windowManager';

/**
 * 1. MS-DOS Prompt (Interactive Shell)
 */
export function renderDosPrompt(container: HTMLElement, win: Win95Window) {
  win.setTitle('MS-DOS Prompt - 80x25');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-black text-[#00ff00] font-mono text-xs select-text overflow-hidden p-2">
      <div id="dos-output" class="flex-1 overflow-auto whitespace-pre-wrap leading-tight space-y-1">Microsoft(R) Windows 95
   (C)Copyright Microsoft Corp 1981-1995.

Piush 95 Command Interpreter v7.00
Type HELP for a list of available commands.
</div>
      <div class="flex items-center gap-1 pt-1 border-t border-gray-800 text-white">
        <span id="dos-prompt-path">C:\\&gt;</span>
        <input type="text" id="dos-input" class="flex-1 bg-transparent border-none outline-none text-[#00ff00] font-mono text-xs caret-white" autofocus autocomplete="off" spellcheck="false" />
      </div>
    </div>
  `;

  const output = container.querySelector('#dos-output') as HTMLElement;
  const input = container.querySelector('#dos-input') as HTMLInputElement;
  const promptPath = container.querySelector('#dos-prompt-path') as HTMLElement;

  let currentPath = 'C:\\';
  let history: string[] = [];
  let historyIdx = -1;

  function print(text: string) {
    if (output) {
      output.textContent += '\n' + text;
      output.scrollTop = output.scrollHeight;
    }
  }

  function handleCommand(rawCmd: string) {
    const trimmed = rawCmd.trim();
    if (!trimmed) {
      print(`${currentPath}>`);
      return;
    }

    history.push(trimmed);
    historyIdx = history.length;
    print(`${currentPath}> ${trimmed}`);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toUpperCase();
    const arg = parts.slice(1).join(' ');

    switch (cmd) {
      case 'HELP':
        print(`
COMMANDS:
  DIR [path]        List files and directories in current path
  CD <path>         Change current directory (e.g. CD WINDOWS, CD ..)
  TYPE <file>       Display the contents of a text file
  MD / MKDIR <dir>  Create a new directory
  DEL <file>        Delete a file
  COPY <src> <dst>  Copy a file
  CLS               Clear the terminal screen
  VER               Display Windows 95 version information
  MEM               Display memory usage information
  DATE              Display current system date
  TIME              Display current system time
  TREE              Graphically display directory structure
  FORMAT C:         Format drive C: (Dangerous!)
  EXIT              Close the MS-DOS prompt

APPLICATIONS:
  NOTEPAD, CALC, PAINT, SOL, MINESWEEPER, PINBALL, SNAKE, CHESS

PORTFOLIO SHORTCUTS:
  ABOUT, PROJECTS, SKILLS, CONTACT, QUIZ, RESUME
`);
        break;

      case 'VER':
        print('Windows 95 [Version 4.00.950]');
        break;

      case 'CLS':
        if (output) output.textContent = '';
        break;

      case 'DIR': {
        const targetPath = arg ? (arg.startsWith('C:\\') ? arg : `${currentPath}${arg}`) : currentPath;
        const items = vfs.list(targetPath);
        print(` Volume in drive C is PIUSH_OS\n Directory of ${targetPath}\n`);
        let fileCount = 0;
        let dirCount = 0;
        let totalBytes = 0;

        print('.              <DIR>');
        print('..             <DIR>');
        dirCount += 2;

        items.forEach((item) => {
          if (item.type === 'directory') {
            print(`${item.name.padEnd(14, ' ')} <DIR>`);
            dirCount++;
          } else {
            const size = (item.size || 0);
            totalBytes += size;
            fileCount++;
            print(`${item.name.padEnd(14, ' ')}       ${String(size).padStart(8, ' ')} bytes`);
          }
        });
        print(`\n       ${fileCount} file(s)     ${totalBytes.toLocaleString()} bytes\n       ${dirCount} dir(s)      ${(524288000 - totalBytes).toLocaleString()} bytes free`);
        break;
      }

      case 'CD':
      case 'CHDIR': {
        if (!arg || arg === '.') break;
        if (arg === '..') {
          const parts = currentPath.split('\\').filter(Boolean);
          if (parts.length > 1) {
            parts.pop();
            currentPath = parts.join('\\') + '\\';
          } else {
            currentPath = 'C:\\';
          }
        } else if (arg === '\\') {
          currentPath = 'C:\\';
        } else {
          const testPath = arg.startsWith('C:\\') ? (arg.endsWith('\\') ? arg : `${arg}\\`) : `${currentPath}${arg}\\`;
          const exists = vfs.exists(testPath.replace(/\\$/, ''));
          if (exists) {
            currentPath = testPath;
          } else {
            print('Invalid directory');
          }
        }
        if (promptPath) promptPath.textContent = `${currentPath}>`;
        break;
      }

      case 'TYPE': {
        if (!arg) {
          print('Required parameter missing');
          break;
        }
        const filePath = arg.startsWith('C:\\') ? arg : `${currentPath}${arg}`;
        const content = vfs.readFile(filePath);
        if (content !== null) {
          print(content);
        } else {
          print('File not found');
        }
        break;
      }

      case 'MEM':
        print(`
Memory Type        Total       Used       Free
----------------  --------   --------   --------
Conventional        640K        48K       592K
Upper                 0K         0K         0K
Reserved            384K       384K         0K
Extended (XMS)   64,512K     8,192K    56,320K
----------------  --------   --------   --------
Total memory     65,536K     8,624K    56,912K

Total under 1 MB    640K        48K       592K
Largest executable program size       591K (605,440 bytes)
Largest free upper memory block         0K (0 bytes)
MS-DOS is resident in the high memory area.
`);
        break;

      case 'DATE':
        print(`Current date is ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: '2-digit', day: '2-digit', year: 'numeric' })}`);
        break;

      case 'TIME':
        print(`Current time is ${new Date().toLocaleTimeString('en-US', { hour12: false })}.00`);
        break;

      case 'TREE':
        print(`
Directory PATH listing for Volume PIUSH_OS
C:\\
├── PIUSH
│   ├── ABOUT.TXT
│   ├── PROJECTS.TXT
│   ├── SKILLS.TXT
│   └── CONTACT.TXT
├── WINDOWS
│   ├── SYSTEM
│   ├── DESKTOP
│   └── START MENU
└── My Documents
    ├── Notes
    └── Pictures
`);
        break;

      case 'FORMAT':
        if (arg.toUpperCase().startsWith('C:')) {
          print('\nWARNING: ALL DATA ON FIXED DISK\nDRIVE C: WILL BE LOST!\nProceed with Format (Y/N)?');
          audio.playError();
        } else {
          print('Invalid drive specification');
        }
        break;

      case 'ABOUT': {
        const about = vfs.readFile('C:\\PIUSH\\ABOUT.TXT');
        print(about || 'Piush KS - Mobile & Cloud Engineer');
        break;
      }

      case 'PROJECTS': {
        const proj = vfs.readFile('C:\\PIUSH\\PROJECTS.TXT');
        print(proj || 'Production Applications & Systems');
        break;
      }

      case 'SKILLS': {
        const skills = vfs.readFile('C:\\PIUSH\\SKILLS.TXT');
        print(skills || 'Swift, Kotlin, TypeScript, Cloud, Systems');
        break;
      }

      case 'CONTACT': {
        const contact = vfs.readFile('C:\\PIUSH\\CONTACT.TXT');
        print(contact || 'Email: contact@piush.com');
        break;
      }

      case 'QUIZ':
        window.location.href = '/quiz/';
        break;

      case 'EXIT':
        win.close();
        break;

      default:
        print(`Bad command or file name: "${cmd}"`);
        break;
    }
  }

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      handleCommand(val);
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0 && historyIdx > 0) {
        historyIdx--;
        input.value = history[historyIdx];
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIdx < history.length - 1) {
        historyIdx++;
        input.value = history[historyIdx];
      } else {
        historyIdx = history.length;
        input.value = '';
      }
      e.preventDefault();
    }
  });

  // Focus input when clicking anywhere in terminal
  container.addEventListener('click', () => {
    input?.focus();
  });
}

/**
 * 2. Windows Explorer
 */
export function renderExplorer(container: HTMLElement, win: Win95Window, initialPath = 'C:\\') {
  win.setTitle(`Exploring - ${initialPath}`);
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <!-- Menubar -->
      <div class="flex gap-4 px-2 py-0.5 text-xs bg-[#c0c0c0] border-b border-black">
        <span class="hover:underline cursor-pointer">File</span>
        <span class="hover:underline cursor-pointer">Edit</span>
        <span class="hover:underline cursor-pointer">View</span>
        <span class="hover:underline cursor-pointer">Tools</span>
        <span class="hover:underline cursor-pointer">Help</span>
      </div>

      <!-- Address Toolbar -->
      <div class="flex items-center gap-2 px-2 py-1 bg-[#c0c0c0] border-b border-black text-xs">
        <span class="text-gray-700">Address:</span>
        <input type="text" id="exp-address" value="${initialPath}" class="retro-inset flex-1 px-1.5 py-0.5 bg-white text-black font-mono text-xs" />
        <button id="exp-up-btn" class="retro-btn !py-0.5 !px-2 font-bold text-xs" title="Up One Level">⬆ Up</button>
      </div>

      <!-- Main Dual Pane View -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Left: Tree View -->
        <div class="w-44 sm:w-56 bg-white retro-inset m-1 p-2 overflow-auto text-xs space-y-1">
          <div class="font-bold flex items-center gap-1 cursor-pointer" id="tree-desktop">
            <span>🖥️</span> <span>Desktop</span>
          </div>
          <div class="pl-3 space-y-1">
            <div class="font-bold flex items-center gap-1 cursor-pointer" id="tree-c">
              <span>🖴</span> <span>(C:) PIUSH_OS</span>
            </div>
            <div class="pl-4 space-y-1">
              <div class="flex items-center gap-1 cursor-pointer hover:bg-[#000080] hover:text-white p-0.5" data-path="C:\\PIUSH">
                <span>📁</span> <span>PIUSH</span>
              </div>
              <div class="flex items-center gap-1 cursor-pointer hover:bg-[#000080] hover:text-white p-0.5" data-path="C:\\My Documents">
                <span>📁</span> <span>My Documents</span>
              </div>
              <div class="flex items-center gap-1 cursor-pointer hover:bg-[#000080] hover:text-white p-0.5" data-path="C:\\WINDOWS">
                <span>📁</span> <span>WINDOWS</span>
              </div>
              <div class="flex items-center gap-1 cursor-pointer hover:bg-[#000080] hover:text-white p-0.5" data-path="C:\\Program Files">
                <span>📁</span> <span>Program Files</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Files Grid -->
        <div class="flex-1 bg-white retro-inset m-1 ml-0 p-2 overflow-auto">
          <div id="exp-files-grid" class="grid grid-cols-2 sm:grid-cols-4 gap-2"></div>
        </div>
      </div>

      <!-- Statusbar -->
      <div class="px-2 py-0.5 text-[11px] bg-[#c0c0c0] border-t border-white flex justify-between">
        <span id="exp-status">0 object(s)</span>
        <span id="exp-disk-free">524 MB free disk space</span>
      </div>
    </div>
  `;

  let currentPath = initialPath;
  const addressInput = container.querySelector('#exp-address') as HTMLInputElement;
  const filesGrid = container.querySelector('#exp-files-grid') as HTMLElement;
  const statusEl = container.querySelector('#exp-status') as HTMLElement;
  const upBtn = container.querySelector('#exp-up-btn');

  function renderFiles() {
    if (addressInput) addressInput.value = currentPath;
    win.setTitle(`Exploring - ${currentPath}`);

    const items = vfs.list(currentPath);
    filesGrid.innerHTML = '';

    if (items.length === 0) {
      filesGrid.innerHTML = '<div class="col-span-4 text-gray-500 italic p-4 text-xs">This folder is empty.</div>';
    } else {
      items.forEach((item) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'flex flex-col items-center p-2 hover:bg-[#000080] hover:text-white cursor-pointer rounded text-center select-none group';
        const isDir = item.type === 'directory';
        const icon = isDir ? '📁' : (item.name.endsWith('.txt') || item.name.endsWith('.bat') ? '📄' : (item.name.endsWith('.png') || item.name.endsWith('.bmp') ? '🖼️' : '💾'));

        itemEl.innerHTML = `
          <span class="text-3xl">${icon}</span>
          <span class="text-[11px] font-mono mt-1 break-all line-clamp-2">${item.name}</span>
          <span class="text-[9px] text-gray-500 group-hover:text-gray-300">${isDir ? 'Folder' : `${item.size || 0} B`}</span>
        `;

        itemEl.ondblclick = () => {
          if (isDir) {
            currentPath = `${currentPath.replace(/\\$/, '')}\\${item.name}\\`;
            audio.playClick();
            renderFiles();
          } else {
            // Open file
            audio.playClick();
            const fullPath = `${currentPath.replace(/\\$/, '')}\\${item.name}`;
            const content = vfs.readFile(fullPath);
            alert(`File: ${item.name}\n\n${content}`);
          }
        };

        filesGrid.appendChild(itemEl);
      });
    }

    if (statusEl) statusEl.textContent = `${items.length} object(s)`;
  }

  upBtn?.addEventListener('click', () => {
    const parts = currentPath.split('\\').filter(Boolean);
    if (parts.length > 1) {
      parts.pop();
      currentPath = parts.join('\\') + '\\';
      audio.playClick();
      renderFiles();
    }
  });

  // Tree clicks
  container.querySelectorAll('[data-path]').forEach((el) => {
    el.addEventListener('click', () => {
      const p = el.getAttribute('data-path');
      if (p) {
        currentPath = p + '\\';
        audio.playClick();
        renderFiles();
      }
    });
  });

  renderFiles();
}

/**
 * 3. Control Panel
 */
export function renderControlPanel(container: HTMLElement, win: Win95Window) {
  win.setTitle('Control Panel');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <div class="p-2 border-b border-black text-xs text-gray-700">
        Use the settings below to customize the appearance and functionality of your computer.
      </div>

      <div class="flex-1 bg-white retro-inset m-2 p-3 overflow-auto">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <!-- Display Applet -->
          <div id="cp-display" class="flex flex-col items-center p-2 hover:bg-[#000080] hover:text-white cursor-pointer rounded text-center group">
            <span class="text-3xl">🖥️</span>
            <span class="text-xs font-bold mt-1">Display</span>
            <span class="text-[10px] text-gray-500 group-hover:text-gray-300">Wallpaper & Screensaver</span>
          </div>

          <!-- Sounds Applet -->
          <div id="cp-sounds" class="flex flex-col items-center p-2 hover:bg-[#000080] hover:text-white cursor-pointer rounded text-center group">
            <span class="text-3xl">🔊</span>
            <span class="text-xs font-bold mt-1">Sounds</span>
            <span class="text-[10px] text-gray-500 group-hover:text-gray-300">Audio Schemes</span>
          </div>

          <!-- System Applet -->
          <div id="cp-system" class="flex flex-col items-center p-2 hover:bg-[#000080] hover:text-white cursor-pointer rounded text-center group">
            <span class="text-3xl">💻</span>
            <span class="text-xs font-bold mt-1">System</span>
            <span class="text-[10px] text-gray-500 group-hover:text-gray-300">System Properties</span>
          </div>

          <!-- Date & Time Applet -->
          <div id="cp-datetime" class="flex flex-col items-center p-2 hover:bg-[#000080] hover:text-white cursor-pointer rounded text-center group">
            <span class="text-3xl">📅</span>
            <span class="text-xs font-bold mt-1">Date/Time</span>
            <span class="text-[10px] text-gray-500 group-hover:text-gray-300">Clock & Calendar</span>
          </div>

          <!-- Mouse Applet -->
          <div id="cp-mouse" class="flex flex-col items-center p-2 hover:bg-[#000080] hover:text-white cursor-pointer rounded text-center group">
            <span class="text-3xl">🖱️</span>
            <span class="text-xs font-bold mt-1">Mouse</span>
            <span class="text-[10px] text-gray-500 group-hover:text-gray-300">Pointer Settings</span>
          </div>

          <!-- Add/Remove Programs -->
          <div id="cp-programs" class="flex flex-col items-center p-2 hover:bg-[#000080] hover:text-white cursor-pointer rounded text-center group">
            <span class="text-3xl">📦</span>
            <span class="text-xs font-bold mt-1">Add/Remove</span>
            <span class="text-[10px] text-gray-500 group-hover:text-gray-300">Software Inventory</span>
          </div>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#cp-display')?.addEventListener('click', () => {
    audio.playClick();
    renderDisplayProperties(container, win);
  });

  container.querySelector('#cp-sounds')?.addEventListener('click', () => {
    audio.playClick();
    alert('Windows 95 Sound Scheme: Standard 16-Bit Polyphony.\nAudio synthesis enabled using pure Web Audio API.');
  });

  container.querySelector('#cp-system')?.addEventListener('click', () => {
    audio.playClick();
    const aboutDlg = document.getElementById('retro-about-dialog');
    if (aboutDlg) {
      aboutDlg.style.display = 'flex';
      aboutDlg.classList.remove('hidden');
      aboutDlg.classList.add('is-open');
    }
  });

  container.querySelector('#cp-datetime')?.addEventListener('click', () => {
    audio.playClick();
    renderDateTimeProperties(container, win);
  });
}

/**
 * Display Properties Dialog
 */
function renderDisplayProperties(container: HTMLElement, win: Win95Window) {
  win.setTitle('Display Properties');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-3">
      <!-- Tabs -->
      <div class="flex gap-1 border-b border-black">
        <button class="retro-btn !py-0.5 !px-3 font-bold !bg-[#c0c0c0]">Background</button>
        <button class="retro-btn !py-0.5 !px-3 !bg-[#a0a0a0]">Screen Saver</button>
      </div>

      <!-- Monitor Preview -->
      <div class="flex flex-col items-center justify-center p-3 bg-[#808080] border-2 border-black rounded">
        <div id="disp-preview-screen" class="w-48 h-32 bg-[#008080] border-4 border-gray-900 rounded flex items-center justify-center text-white text-[10px] shadow-inner">
          Piush 95
        </div>
        <div class="w-16 h-3 bg-gray-700 mt-1"></div>
        <div class="w-24 h-2 bg-gray-900"></div>
      </div>

      <!-- Wallpaper Colors -->
      <div class="space-y-1">
        <label class="text-xs font-bold">Desktop Background Color:</label>
        <div class="flex gap-2">
          ${[
            { name: 'Teal (Classic)', hex: '#008080' },
            { name: 'Navy Blue', hex: '#000080' },
            { name: 'Pure Black', hex: '#000000' },
            { name: 'Retro Plum', hex: '#582458' },
            { name: 'Forest Green', hex: '#1b4d3e' },
          ].map(c => `
            <button class="size-7 border-2 border-black shadow" style="background-color: ${c.hex};" data-color="${c.hex}" title="${c.name}"></button>
          `).join('')}
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-2 pt-2 border-t border-white">
        <button id="disp-ok" class="retro-btn !py-0.5 !px-4 font-bold text-xs">OK</button>
        <button id="disp-cancel" class="retro-btn !py-0.5 !px-3 text-xs">Cancel</button>
      </div>
    </div>
  `;

  const preview = container.querySelector('#disp-preview-screen') as HTMLElement;

  container.querySelectorAll('[data-color]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const col = btn.getAttribute('data-color') || '#008080';
      if (preview) preview.style.backgroundColor = col;
      const desktop = document.getElementById('win95-desktop-screen');
      if (desktop) {
        desktop.style.backgroundColor = col;
        desktop.style.backgroundImage = 'none';
      }
      audio.playClick();
    });
  });

  container.querySelector('#disp-ok')?.addEventListener('click', () => {
    renderControlPanel(container, win);
  });
  container.querySelector('#disp-cancel')?.addEventListener('click', () => {
    renderControlPanel(container, win);
  });
}

/**
 * Date / Time Properties Dialog
 */
function renderDateTimeProperties(container: HTMLElement, win: Win95Window) {
  win.setTitle('Date/Time Properties');
  const now = new Date();
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-3">
      <div class="grid grid-cols-2 gap-4">
        <!-- Date Side -->
        <div class="space-y-1">
          <label class="text-xs font-bold">Date:</label>
          <div class="retro-inset p-2 bg-white text-xs">
            <div class="font-bold text-center border-b pb-1">${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
            <div class="grid grid-cols-7 gap-1 text-center text-[10px] pt-1">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              ${Array.from({ length: 31 }, (_, i) => `
                <span class="${i + 1 === now.getDate() ? 'bg-[#000080] text-white font-bold' : ''}">${i + 1}</span>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Time Side (Analog Clock Simulation) -->
        <div class="flex flex-col items-center justify-center space-y-2">
          <label class="text-xs font-bold">Current Time:</label>
          <div class="size-24 rounded-full border-2 border-black bg-white flex items-center justify-center relative shadow-inner">
            <span class="text-xs font-bold">${now.toLocaleTimeString('en-US', { hour12: true })}</span>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-white">
        <button id="dt-ok" class="retro-btn !py-0.5 !px-4 font-bold text-xs">OK</button>
      </div>
    </div>
  `;

  container.querySelector('#dt-ok')?.addEventListener('click', () => {
    renderControlPanel(container, win);
  });
}

/**
 * 4. ScanDisk
 */
export function renderScanDisk(container: HTMLElement, win: Win95Window) {
  win.setTitle('ScanDisk - (C:)');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-3">
      <div class="space-y-1">
        <label class="text-xs font-bold">Select the drive you want to check for errors:</label>
        <div class="retro-inset p-2 bg-white text-xs">
          <div class="flex items-center gap-2 p-1 bg-[#000080] text-white">
            <span>🖴</span> <span>3.5 Inch Floppy (A:)</span>
          </div>
          <div class="flex items-center gap-2 p-1 bg-[#000080] text-white mt-1">
            <span>🖴</span> <span>PIUSH_OS (C:)</span>
          </div>
        </div>
      </div>

      <div class="space-y-1">
        <label class="text-xs font-bold">Type of test:</label>
        <div class="p-2 border border-black/40 space-y-1 text-xs">
          <label class="flex items-center gap-2">
            <input type="radio" name="sd-type" checked />
            <span>Standard (checks files and folders for errors)</span>
          </label>
          <label class="flex items-center gap-2">
            <input type="radio" name="sd-type" />
            <span>Thorough (performs surface scan for bad sectors)</span>
          </label>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="space-y-1">
        <div class="flex justify-between text-xs">
          <span>Scanning surface...</span>
          <span id="sd-pct">0%</span>
        </div>
        <div class="retro-inset h-4 bg-white relative overflow-hidden">
          <div id="sd-prog" class="h-full bg-[#000080] transition-all duration-100" style="width: 0%;"></div>
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-white">
        <button id="sd-start-btn" class="retro-btn !py-0.5 !px-4 font-bold text-xs">Start</button>
        <button id="sd-close-btn" class="retro-btn !py-0.5 !px-3 text-xs">Close</button>
      </div>
    </div>
  `;

  const startBtn = container.querySelector('#sd-start-btn');
  const closeBtn = container.querySelector('#sd-close-btn');
  const prog = container.querySelector('#sd-prog') as HTMLElement;
  const pct = container.querySelector('#sd-pct') as HTMLElement;

  let scanning = false;
  let val = 0;

  startBtn?.addEventListener('click', () => {
    if (scanning) return;
    scanning = true;
    val = 0;
    audio.playClick();

    const iv = setInterval(() => {
      val += 5;
      if (prog) prog.style.width = `${val}%`;
      if (pct) pct.textContent = `${val}%`;

      if (val >= 100) {
        clearInterval(iv);
        scanning = false;
        audio.playTada();
        alert('ScanDisk did not find any errors on drive C:.\n1,024 cluster sectors verified OK.');
      }
    }, 120);
  });

  closeBtn?.addEventListener('click', () => {
    win.close();
  });
}

/**
 * 5. Disk Defragmenter
 */
export function renderDefrag(container: HTMLElement, win: Win95Window) {
  win.setTitle('Defragmenting Drive C');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-2">
      <div class="flex justify-between items-center text-xs">
        <span>Drive C: <strong>100%</strong> of drive defragmented</span>
        <span id="df-pct" class="font-bold text-blue-900">0% Complete</span>
      </div>

      <!-- Cluster Grid (16 x 10 = 160 clusters) -->
      <div class="retro-inset p-1 bg-white">
        <div id="df-grid" class="grid grid-cols-16 gap-0.5 bg-black p-0.5" style="grid-template-columns: repeat(16, minmax(0, 1fr));">
          ${Array.from({ length: 160 }, (_, i) => `
            <div class="df-block size-3.5 sm:size-4 bg-[#ffffff] border border-black/20" data-idx="${i}"></div>
          `).join('')}
        </div>
      </div>

      <!-- Legend -->
      <div class="grid grid-cols-2 gap-2 text-[10px] pt-1">
        <div class="flex items-center gap-1.5"><span class="size-3 bg-[#000080] inline-block"></span> <span>Allocated (Contiguous)</span></div>
        <div class="flex items-center gap-1.5"><span class="size-3 bg-[#ff0000] inline-block"></span> <span>Fragmented Data</span></div>
        <div class="flex items-center gap-1.5"><span class="size-3 bg-[#ffffff] border inline-block"></span> <span>Free Space</span></div>
        <div class="flex items-center gap-1.5"><span class="size-3 bg-[#00ff00] inline-block"></span> <span>Writing / Reading</span></div>
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-white">
        <button id="df-start-btn" class="retro-btn !py-0.5 !px-4 font-bold text-xs">Start Defrag</button>
        <button id="df-pause-btn" class="retro-btn !py-0.5 !px-3 text-xs">Pause</button>
      </div>
    </div>
  `;

  const blocks = container.querySelectorAll('.df-block');
  const startBtn = container.querySelector('#df-start-btn');
  const pctEl = container.querySelector('#df-pct') as HTMLElement;

  // Initialize random fragmented map
  blocks.forEach((b, idx) => {
    if (idx < 90) {
      (b as HTMLElement).style.backgroundColor = Math.random() < 0.35 ? '#ff0000' : '#000080';
    } else {
      (b as HTMLElement).style.backgroundColor = '#ffffff';
    }
  });

  let running = false;
  let cur = 0;

  startBtn?.addEventListener('click', () => {
    if (running) return;
    running = true;
    audio.playClick();

    const iv = setInterval(() => {
      if (cur < 90) {
        const b = blocks[cur] as HTMLElement;
        b.style.backgroundColor = '#00ff00';
        setTimeout(() => {
          b.style.backgroundColor = '#000080';
        }, 80);
        cur++;
        const pct = Math.floor((cur / 90) * 100);
        if (pctEl) pctEl.textContent = `${pct}% Complete`;
      } else {
        clearInterval(iv);
        running = false;
        audio.playTada();
        alert('Defragmentation complete! All files optimized.');
      }
    }, 60);
  });
}

/**
 * 6. Task Manager / Resource Monitor
 */
export function renderTaskManager(container: HTMLElement, win: Win95Window) {
  win.setTitle('Close Program / Task Manager');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-3">
      <p class="text-xs">Select an application and choose an action:</p>

      <div class="retro-inset bg-white p-2 flex-1 overflow-auto">
        <div id="tm-list" class="space-y-1 text-xs"></div>
      </div>

      <div class="flex justify-between items-center pt-2 border-t border-white">
        <span class="text-[11px] text-gray-700">CPU Usage: <strong id="tm-cpu" class="text-green-700">4%</strong></span>
        <div class="flex gap-2">
          <button id="tm-end-task" class="retro-btn !py-0.5 !px-3 font-bold text-xs">End Task</button>
          <button id="tm-switch-to" class="retro-btn !py-0.5 !px-3 text-xs">Switch To</button>
          <button id="tm-cancel" class="retro-btn !py-0.5 !px-3 text-xs">Cancel</button>
        </div>
      </div>
    </div>
  `;

  const list = container.querySelector('#tm-list') as HTMLElement;
  const endBtn = container.querySelector('#tm-end-task');
  const switchBtn = container.querySelector('#tm-switch-to');
  const cancelBtn = container.querySelector('#tm-cancel');
  let selectedId: string | null = null;

  function renderList() {
    list.innerHTML = '';
    const wins = windowManager.getAllWindows();
    wins.forEach((w) => {
      const item = document.createElement('div');
      item.className = `flex items-center justify-between p-1 cursor-pointer select-none ${selectedId === w.id ? 'bg-[#000080] text-white' : 'hover:bg-gray-200'}`;
      item.innerHTML = `
        <div class="flex items-center gap-1.5 truncate">
          <span>${w.icon}</span>
          <span class="truncate">${w.title}</span>
        </div>
        <span class="text-[10px] text-green-600">[Running]</span>
      `;
      item.onclick = () => {
        selectedId = w.id;
        renderList();
      };
      list.appendChild(item);
    });
  }

  endBtn?.addEventListener('click', () => {
    if (selectedId) {
      const target = windowManager.getWindow(selectedId);
      if (target) target.close();
      selectedId = null;
      renderList();
    }
  });

  switchBtn?.addEventListener('click', () => {
    if (selectedId) {
      const target = windowManager.getWindow(selectedId);
      if (target) {
        if (target.isMinimized) target.restore();
        target.focus();
      }
    }
  });

  cancelBtn?.addEventListener('click', () => {
    win.close();
  });

  renderList();
}
