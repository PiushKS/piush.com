// Piush 95 - System Tools Collection
// MS-DOS Prompt, Windows Explorer, Control Panel, System Information,
// Disk Properties, ScanDisk, Disk Defragmenter, Task Manager

import { audio } from '../audio';
import { vfs } from '../fs';
import { windowManager, type Win95Window } from '../windowManager';

/**
 * 1. MS-DOS Prompt - Authentic Command Interpreter
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
  const history: string[] = [];
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

    const globalLauncher = (window as unknown as { launchWin95App?: (id: string) => void }).launchWin95App;

    switch (cmd) {
      case 'HELP':
        print(`
COMMANDS:
  DIR [path]        List files and directories in current path
  CD <path>         Change current directory (e.g. CD WINDOWS, CD ..)
  TYPE <file>       Display the contents of a text file
  MD / MKDIR <dir>  Create a new directory
  DEL <file>        Delete a file from VFS
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
  NOTEPAD, WORDPAD, CALC, PAINT, SOL, MINESWEEPER, PINBALL, SNAKE, CHESS, EXPLORER

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

      case 'MD':
      case 'MKDIR': {
        if (!arg) {
          print('Required parameter missing');
          break;
        }
        const targetPath = arg.startsWith('C:\\') ? arg : `${currentPath}${arg}`;
        vfs.createFolder(targetPath);
        print(`Directory created: ${targetPath}`);
        audio.playClick();
        break;
      }

      case 'DEL': {
        if (!arg) {
          print('Required parameter missing');
          break;
        }
        const targetPath = arg.startsWith('C:\\') ? arg : `${currentPath}${arg}`;
        const ok = vfs.deleteItem(targetPath);
        if (ok) {
          print(`File deleted: ${targetPath}`);
          audio.playClick();
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

      case 'NOTEPAD':
        if (globalLauncher) globalLauncher('notepad');
        break;
      case 'WORDPAD':
        if (globalLauncher) globalLauncher('wordpad');
        break;
      case 'CALC':
        if (globalLauncher) globalLauncher('calc');
        break;
      case 'PAINT':
        if (globalLauncher) globalLauncher('paint');
        break;
      case 'MINESWEEPER':
      case 'WINMINE':
        if (globalLauncher) globalLauncher('minesweeper');
        break;
      case 'SOL':
      case 'SOLITAIRE':
        if (globalLauncher) globalLauncher('solitaire');
        break;
      case 'PINBALL':
        if (globalLauncher) globalLauncher('pinball');
        break;
      case 'SNAKE':
        if (globalLauncher) globalLauncher('snake');
        break;
      case 'CHESS':
        if (globalLauncher) globalLauncher('chess');
        break;
      case 'EXPLORER':
        if (globalLauncher) globalLauncher('explorer');
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

  container.addEventListener('click', () => {
    input?.focus();
  });
}

/**
 * 2. Windows Explorer - Full Dual-Pane File Manager
 */
export function renderExplorer(container: HTMLElement, win: Win95Window, initialPath = 'C:\\') {
  win.setTitle(`Exploring - ${initialPath}`);

  let currentPath = initialPath;
  let viewMode: 'icons' | 'details' = 'icons';

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <!-- Menubar -->
      <div class="flex gap-4 px-2 py-0.5 text-xs bg-[#c0c0c0] border-b border-black">
        <span class="hover:underline cursor-pointer" id="exp-menu-file">File</span>
        <span class="hover:underline cursor-pointer" id="exp-menu-edit">Edit</span>
        <span class="hover:underline cursor-pointer" id="exp-menu-view">View</span>
        <span class="hover:underline cursor-pointer" id="exp-menu-tools">Tools</span>
        <span class="hover:underline cursor-pointer" id="exp-menu-help">Help</span>
      </div>

      <!-- Address Toolbar -->
      <div class="flex items-center gap-2 px-2 py-1 bg-[#c0c0c0] border-b border-black text-xs">
        <span class="text-gray-700 font-bold">Address:</span>
        <input type="text" id="exp-address" value="${initialPath}" class="retro-inset flex-1 px-1.5 py-0.5 bg-white text-black font-mono text-xs" />
        <button id="exp-up-btn" class="retro-btn !py-0.5 !px-2 font-bold text-xs" title="Up One Level">⬆ Up</button>
        <button id="exp-view-toggle" class="retro-btn !py-0.5 !px-2 text-xs" title="Toggle Icons / Details">View Mode</button>
        <button id="exp-new-folder" class="retro-btn !py-0.5 !px-2 text-xs font-bold text-blue-900" title="Create New Folder">+ Folder</button>
      </div>

      <!-- Main Dual Pane View -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Left: Tree View -->
        <div class="w-44 sm:w-56 bg-white retro-inset m-1 p-2 overflow-auto text-xs space-y-1">
          <div class="font-bold flex items-center gap-1 cursor-pointer hover:bg-gray-100" id="tree-desktop">
            <span>🖥️</span> <span>Desktop</span>
          </div>
          <div class="pl-3 space-y-1">
            <div class="font-bold flex items-center gap-1 cursor-pointer hover:bg-gray-100" id="tree-c">
              <span>🖴</span> <span>(C:) PIUSH_OS</span>
            </div>
            <div class="pl-4 space-y-1">
              <div class="flex items-center gap-1 cursor-pointer hover:bg-[#000080] hover:text-white p-0.5 exp-tree-folder" data-path="C:\\PIUSH">
                <span>📁</span> <span>PIUSH</span>
              </div>
              <div class="flex items-center gap-1 cursor-pointer hover:bg-[#000080] hover:text-white p-0.5 exp-tree-folder" data-path="C:\\My Documents">
                <span>📁</span> <span>My Documents</span>
              </div>
              <div class="flex items-center gap-1 cursor-pointer hover:bg-[#000080] hover:text-white p-0.5 exp-tree-folder" data-path="C:\\WINDOWS">
                <span>📁</span> <span>WINDOWS</span>
              </div>
              <div class="flex items-center gap-1 cursor-pointer hover:bg-[#000080] hover:text-white p-0.5 exp-tree-folder" data-path="C:\\Program Files">
                <span>📁</span> <span>Program Files</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Files View -->
        <div class="flex-1 bg-white retro-inset m-1 ml-0 p-2 overflow-auto">
          <div id="exp-files-container"></div>
        </div>
      </div>

      <!-- Statusbar -->
      <div class="px-2 py-0.5 text-[11px] bg-[#c0c0c0] border-t border-white flex justify-between">
        <span id="exp-status">0 object(s)</span>
        <span id="exp-disk-free">524 MB free disk space</span>
      </div>
    </div>
  `;

  const addressInput = container.querySelector('#exp-address') as HTMLInputElement;
  const filesContainer = container.querySelector('#exp-files-container') as HTMLElement;
  const statusEl = container.querySelector('#exp-status') as HTMLElement;
  const upBtn = container.querySelector('#exp-up-btn');
  const viewToggle = container.querySelector('#exp-view-toggle');
  const newFolderBtn = container.querySelector('#exp-new-folder');

  function openFileInApp(fileName: string, fullPath: string) {
    audio.playClick();
    const globalLauncher = (window as unknown as { launchWin95App?: (id: string) => void }).launchWin95App;
    if (!globalLauncher) return;

    if (fileName.endsWith('.txt') || fileName.endsWith('.bat') || fileName.endsWith('.ini') || fileName.endsWith('.sys')) {
      globalLauncher('notepad');
    } else if (fileName.endsWith('.rtf') || fileName.endsWith('.doc')) {
      globalLauncher('wordpad');
    } else if (fileName.endsWith('.bmp') || fileName.endsWith('.png') || fileName.endsWith('.jpg')) {
      globalLauncher('paint');
    } else if (fileName.endsWith('.wav') || fileName.endsWith('.mid')) {
      globalLauncher('mediaplayer');
    } else {
      const content = vfs.readFile(fullPath);
      alert(`File: ${fileName}\n\n${content || '(Empty file)'}`);
    }
  }

  function renderFiles() {
    if (addressInput) addressInput.value = currentPath;
    win.setTitle(`Exploring - ${currentPath}`);

    const items = vfs.list(currentPath);
    filesContainer.innerHTML = '';

    if (items.length === 0) {
      filesContainer.innerHTML = '<div class="text-gray-500 italic p-4 text-xs">This folder is empty.</div>';
    } else if (viewMode === 'icons') {
      filesContainer.className = 'grid grid-cols-2 sm:grid-cols-4 gap-2';
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
            const fullPath = `${currentPath.replace(/\\$/, '')}\\${item.name}`;
            openFileInApp(item.name, fullPath);
          }
        };

        filesContainer.appendChild(itemEl);
      });
    } else {
      // Details view mode
      filesContainer.className = 'space-y-0.5';
      const table = document.createElement('table');
      table.className = 'w-full text-left text-xs border-collapse';
      table.innerHTML = `
        <thead>
          <tr class="border-b border-black font-bold text-gray-700 text-[11px]">
            <th class="p-1">Name</th>
            <th class="p-1">Type</th>
            <th class="p-1">Size</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          ${items.map(item => `
            <tr class="hover:bg-[#000080] hover:text-white cursor-pointer exp-detail-row" data-name="${item.name}" data-isdir="${item.type === 'directory'}">
              <td class="p-1 flex items-center gap-1.5 truncate">
                <span>${item.type === 'directory' ? '📁' : '📄'}</span>
                <span>${item.name}</span>
              </td>
              <td class="p-1 text-gray-500 text-[10px]">${item.type === 'directory' ? 'Folder' : 'Document'}</td>
              <td class="p-1 text-gray-500 text-[10px]">${item.type === 'directory' ? '-' : `${item.size || 0} B`}</td>
            </tr>
          `).join('')}
        </tbody>
      `;

      table.querySelectorAll('.exp-detail-row').forEach(row => {
        row.addEventListener('dblclick', () => {
          const name = row.getAttribute('data-name');
          const isDir = row.getAttribute('data-isdir') === 'true';
          if (!name) return;
          if (isDir) {
            currentPath = `${currentPath.replace(/\\$/, '')}\\${name}\\`;
            audio.playClick();
            renderFiles();
          } else {
            const fullPath = `${currentPath.replace(/\\$/, '')}\\${name}`;
            openFileInApp(name, fullPath);
          }
        });
      });

      filesContainer.appendChild(table);
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

  viewToggle?.addEventListener('click', () => {
    viewMode = viewMode === 'icons' ? 'details' : 'icons';
    audio.playClick();
    renderFiles();
  });

  newFolderBtn?.addEventListener('click', () => {
    const name = prompt('Enter new folder name:', 'New Folder');
    if (name) {
      vfs.createFolder(`${currentPath.replace(/\\$/, '')}\\${name}`);
      audio.playClick();
      renderFiles();
    }
  });

  addressInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      currentPath = addressInput.value.trim();
      renderFiles();
    }
  });

  container.querySelectorAll('.exp-tree-folder').forEach((el) => {
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
 * 3. Control Panel - Settings, Sounds, Display, Programs & Date/Time
 */
export function renderControlPanel(container: HTMLElement, win: Win95Window) {
  win.setTitle('Control Panel');

  const applets = [
    { id: 'cp-display', name: 'Display', icon: '🖥️', desc: 'Wallpaper & Themes' },
    { id: 'cp-sounds', name: 'Sounds', icon: '🔊', desc: 'Audio Schemes' },
    { id: 'cp-datetime', name: 'Date/Time', icon: '📅', desc: 'Clock & Calendar' },
    { id: 'cp-programs', name: 'Add/Remove', icon: '📦', desc: 'Installed Software' },
    { id: 'cp-system', name: 'System', icon: '💻', desc: 'System Properties' },
    { id: 'cp-mouse', name: 'Mouse', icon: '🖱️', desc: 'Pointer Settings' },
  ];

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <div class="p-2 border-b border-black text-xs text-gray-700">
        Use the settings below to customize the appearance and functionality of your computer.
      </div>

      <div class="flex-1 bg-white retro-inset m-2 p-3 overflow-auto">
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          ${applets.map(a => `
            <div id="${a.id}" class="flex flex-col items-center p-2.5 hover:bg-[#000080] hover:text-white cursor-pointer rounded text-center group">
              <span class="text-3xl">${a.icon}</span>
              <span class="text-xs font-bold mt-1">${a.name}</span>
              <span class="text-[10px] text-gray-500 group-hover:text-gray-300">${a.desc}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Display Applet
  container.querySelector('#cp-display')?.addEventListener('click', () => {
    audio.playClick();
    renderDisplayProperties(container, win);
  });

  // Sounds Applet
  container.querySelector('#cp-sounds')?.addEventListener('click', () => {
    audio.playClick();
    renderSoundsProperties(container, win);
  });

  // Date & Time Applet
  container.querySelector('#cp-datetime')?.addEventListener('click', () => {
    audio.playClick();
    renderDateTimeProperties(container, win);
  });

  // Add / Remove Programs
  container.querySelector('#cp-programs')?.addEventListener('click', () => {
    audio.playClick();
    renderAddRemovePrograms(container, win);
  });

  // System Applet
  container.querySelector('#cp-system')?.addEventListener('click', () => {
    audio.playClick();
    const aboutDlg = document.getElementById('retro-about-dialog');
    if (aboutDlg) {
      aboutDlg.style.display = 'flex';
      aboutDlg.classList.remove('hidden');
      aboutDlg.classList.add('is-open');
    }
  });

  // Mouse Applet
  container.querySelector('#cp-mouse')?.addEventListener('click', () => {
    audio.playClick();
    alert('Mouse Properties:\n\nDouble-Click Speed: Optimal\nPrimary Button: Left\nPointer Trail: Standard 60 FPS');
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
      </div>

      <!-- Monitor Preview -->
      <div class="flex flex-col items-center justify-center p-3 bg-[#808080] border-2 border-black rounded">
        <div id="disp-preview-screen" class="w-48 h-32 bg-[#008080] border-4 border-gray-900 rounded flex items-center justify-center text-white text-[10px] shadow-inner font-bold">
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
 * Sounds Properties Dialog
 */
function renderSoundsProperties(container: HTMLElement, win: Win95Window) {
  win.setTitle('Sound Properties');

  const events = [
    { name: 'Windows Start (Startup)', play: () => audio.playStart() },
    { name: 'Asterisk (Info Tone)', play: () => audio.playAsterisk() },
    { name: 'Chord (Window Open)', play: () => audio.playChord() },
    { name: 'Ding (Alert)', play: () => audio.playDing() },
    { name: 'Exclamation (Warning)', play: () => audio.playExclamation() },
    { name: 'Critical Stop (Error)', play: () => audio.playError() },
    { name: 'Tada (Game Victory)', play: () => audio.playTada() },
  ];

  let selectedIdx = 0;

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-3">
      <div class="text-xs">
        <label class="font-bold">Sound Scheme:</label>
        <select class="retro-select w-full mt-1 px-2 py-0.5 text-xs font-mono">
          <option selected>Windows Default (16-Bit Polyphony)</option>
        </select>
      </div>

      <div class="flex-1 flex flex-col space-y-1">
        <label class="text-xs font-bold">Events:</label>
        <div class="retro-inset bg-white p-2 flex-1 overflow-auto text-xs space-y-1" id="snd-events-list">
          ${events.map((e, idx) => `
            <div class="p-1 cursor-pointer flex items-center justify-between snd-item ${idx === 0 ? 'bg-[#000080] text-white font-bold' : 'hover:bg-gray-100'}" data-idx="${idx}">
              <span>🔊 ${e.name}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Preview controls -->
      <div class="flex items-center justify-between pt-1 border-t border-white">
        <button id="snd-preview-btn" class="retro-btn !py-0.5 !px-4 font-bold text-xs">▶ Play Preview</button>
        <button id="snd-close-btn" class="retro-btn !py-0.5 !px-3 text-xs">Close</button>
      </div>
    </div>
  `;

  container.querySelectorAll('.snd-item').forEach(item => {
    item.addEventListener('click', (e) => {
      container.querySelectorAll('.snd-item').forEach(i => i.classList.remove('bg-[#000080]', 'text-white', 'font-bold'));
      item.classList.add('bg-[#000080]', 'text-white', 'font-bold');
      selectedIdx = parseInt(item.getAttribute('data-idx') || '0', 10);
      audio.playClick();
    });
  });

  container.querySelector('#snd-preview-btn')?.addEventListener('click', () => {
    events[selectedIdx].play();
  });

  container.querySelector('#snd-close-btn')?.addEventListener('click', () => {
    renderControlPanel(container, win);
  });
}

/**
 * Add / Remove Programs Dialog
 */
function renderAddRemovePrograms(container: HTMLElement, win: Win95Window) {
  win.setTitle('Add/Remove Programs Properties');

  const installed = [
    { name: 'Microsoft WordPad 95', size: '1.4 MB' },
    { name: 'Microsoft Notepad 95', size: '320 KB' },
    { name: 'Microsoft Paint 95', size: '1.8 MB' },
    { name: 'Windows Minesweeper', size: '420 KB' },
    { name: 'Windows Solitaire Suite', size: '890 KB' },
    { name: '3D Pinball Space Cadet', size: '3.2 MB' },
    { name: 'Windows Media Player', size: '2.1 MB' },
    { name: '550 Developer Quiz Database', size: '4.8 MB' },
  ];

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-3">
      <p class="text-xs">The following software can be removed automatically by Windows:</p>

      <div class="retro-inset bg-white p-2 flex-1 overflow-auto text-xs space-y-1">
        ${installed.map(p => `
          <div class="flex items-center justify-between p-1.5 hover:bg-[#000080] hover:text-white cursor-pointer border-b border-gray-100">
            <span class="font-bold">📦 ${p.name}</span>
            <span class="text-[10px] text-gray-500">${p.size}</span>
          </div>
        `).join('')}
      </div>

      <div class="flex justify-end gap-2 pt-1 border-t border-white">
        <button id="prog-uninstall" class="retro-btn !py-0.5 !px-3 font-bold text-xs text-red-700">Add/Remove...</button>
        <button id="prog-close" class="retro-btn !py-0.5 !px-3 text-xs">Close</button>
      </div>
    </div>
  `;

  container.querySelector('#prog-uninstall')?.addEventListener('click', () => {
    audio.playDing();
    alert('This system component is integral to Piush 95 OS and cannot be uninstalled.');
  });

  container.querySelector('#prog-close')?.addEventListener('click', () => {
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
          <div class="flex items-center gap-2 p-1 bg-[#000080] text-white cursor-pointer">
            <span>🖴</span> <span>PIUSH_OS (C:)</span>
          </div>
          <div class="flex items-center gap-2 p-1 hover:bg-gray-100 cursor-pointer mt-1">
            <span>💾</span> <span>3.5 Inch Floppy (A:)</span>
          </div>
        </div>
      </div>

      <div class="space-y-1">
        <label class="text-xs font-bold">Type of test:</label>
        <div class="p-2 border border-black/40 space-y-1 text-xs">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="sd-type" checked />
            <span>Standard (checks files and folders for errors)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="sd-type" />
            <span>Thorough (performs surface scan for bad sectors)</span>
          </label>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="space-y-1">
        <div class="flex justify-between text-xs">
          <span id="sd-status-label">Ready to scan...</span>
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
  const statusLabel = container.querySelector('#sd-status-label') as HTMLElement;

  let scanning = false;
  let val = 0;

  startBtn?.addEventListener('click', () => {
    if (scanning) return;
    scanning = true;
    val = 0;
    audio.playClick();
    if (statusLabel) statusLabel.textContent = 'Scanning cluster allocation table...';

    const iv = setInterval(() => {
      val += 5;
      if (prog) prog.style.width = `${val}%`;
      if (pct) pct.textContent = `${val}%`;

      if (val >= 100) {
        clearInterval(iv);
        scanning = false;
        audio.playTada();
        vfs.writeFile('C:\\SCANDISK.LOG', `ScanDisk verified 1,024 clusters on drive C: at ${new Date().toISOString()}.\n0 bad sectors detected. All files healthy.`);
        alert('ScanDisk did not find any errors on drive C:.\n1,024 cluster sectors verified OK.');
        if (statusLabel) statusLabel.textContent = 'Scan complete. No errors found.';
      }
    }, 100);
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
  const pauseBtn = container.querySelector('#df-pause-btn');
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
  let intervalId: number | null = null;

  startBtn?.addEventListener('click', () => {
    if (running) return;
    running = true;
    audio.playClick();

    intervalId = window.setInterval(() => {
      if (cur < 90) {
        const b = blocks[cur] as HTMLElement;
        b.style.backgroundColor = '#00ff00';
        audio.playTick();
        setTimeout(() => {
          b.style.backgroundColor = '#000080';
        }, 70);
        cur++;
        const pct = Math.floor((cur / 90) * 100);
        if (pctEl) pctEl.textContent = `${pct}% Complete`;
      } else {
        if (intervalId) clearInterval(intervalId);
        running = false;
        audio.playTada();
        alert('Defragmentation complete! All files optimized.');
      }
    }, 60);
  });

  pauseBtn?.addEventListener('click', () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      running = false;
      audio.playClick();
    }
  });

  win.element.addEventListener('DOMNodeRemovedFromDocument', () => {
    if (intervalId) clearInterval(intervalId);
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
        <span class="text-[10px] text-green-600 font-bold">[Running]</span>
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

/**
 * Authentic Microsoft System Information Utility
 */
export function renderSystemInfo(container: HTMLElement, win: Win95Window) {
  win.setTitle('System Information');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-3">
      <!-- Menubar -->
      <div class="flex gap-3 px-2 py-0.5 text-xs bg-[#c0c0c0] border-b border-black/40 -mt-1 -mx-1">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Help</span>
      </div>

      <!-- Main Split Pane -->
      <div class="flex-1 flex gap-2 overflow-hidden">
        <!-- Tree View -->
        <div class="w-44 retro-inset p-2 bg-white text-xs overflow-auto space-y-1">
          <div class="font-bold text-[#000080] cursor-pointer">📁 System Information</div>
          <div class="pl-3 text-black cursor-pointer hover:bg-[#000080] hover:text-white">├─ ℹ️ System Summary</div>
          <div class="pl-3 text-black cursor-pointer hover:bg-[#000080] hover:text-white">├─ 🖴 Hardware Resources</div>
          <div class="pl-3 text-black cursor-pointer hover:bg-[#000080] hover:text-white">├─ 🧩 Components</div>
          <div class="pl-3 text-black cursor-pointer hover:bg-[#000080] hover:text-white">└─ ⚙️ Software Env</div>
        </div>

        <!-- Details Table -->
        <div class="flex-1 retro-inset p-2 bg-white text-xs overflow-auto font-mono">
          <table class="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr class="border-b border-black/30 font-bold text-gray-700">
                <th class="py-1 pr-3">Item</th>
                <th class="py-1">Value</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr><td class="py-1 font-bold">Operating System</td><td>Piush 95 (Desktop Edition)</td></tr>
              <tr><td class="py-1 font-bold">Version</td><td>4.00.950 B (Release 2026.11)</td></tr>
              <tr><td class="py-1 font-bold">System Manufacturer</td><td>Piush KS Engineering Labs</td></tr>
              <tr><td class="py-1 font-bold">Processor Architecture</td><td>Apple Silicon / x86_64 Unified</td></tr>
              <tr><td class="py-1 font-bold">Static Engine Core</td><td>Astro 5.18.2 Static Edge</td></tr>
              <tr><td class="py-1 font-bold">Total Physical Memory</td><td>65,536 KB RAM Available</td></tr>
              <tr><td class="py-1 font-bold">Available System Resources</td><td class="text-emerald-700 font-bold">98% Free (Optimal)</td></tr>
              <tr><td class="py-1 font-bold">Pre-rendered Pages</td><td>73 Verified Routes</td></tr>
              <tr><td class="py-1 font-bold">Quiz Challenges</td><td>550 Question Master DB</td></tr>
              <tr><td class="py-1 font-bold">Audio Synthesizer</td><td>Web Audio Pure Oscillator Synth</td></tr>
              <tr><td class="py-1 font-bold">File System</td><td>VFS In-Memory & LocalStorage</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-2 pt-1 border-t border-white">
        <button type="button" class="retro-btn !py-0.5 !px-5 !text-xs font-bold" id="sysinfo-close-btn">Close</button>
      </div>
    </div>
  `;

  container.querySelector('#sysinfo-close-btn')?.addEventListener('click', () => {
    win.close();
  });
}
