// Piush 95 Accessories Applications
// Notepad, WordPad, Paint, Calculator, Character Map, Clipboard Viewer, Address Book, Phone Dialer

import { vfs } from '../fs';
import { audio } from '../audio';
import type { Win95Window } from '../windowManager';

export function renderNotepad(container: HTMLElement, win: Win95Window, initialFile?: string) {
  let currentPath = initialFile || 'C:\\My Documents\\Untitled.txt';
  let isDirty = false;

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0]">
      <!-- Authentic Menubar with Dropdowns -->
      <div class="flex items-center gap-1 px-1 py-0.5 text-xs bg-[#c0c0c0] border-b border-black/60 select-none relative font-mono text-black">
        <!-- File Menu -->
        <div class="relative">
          <button type="button" class="hover:bg-[#000080] hover:text-white px-2 py-0.5" id="np-file-btn"><u>F</u>ile</button>
          <div id="np-file-menu" class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[170px] z-50 text-black text-xs">
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="npm-new">
              <span>New</span><span class="text-gray-600 text-[10px]">Ctrl+N</span>
            </button>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="npm-open">
              <span>Open...</span><span class="text-gray-600 text-[10px]">Ctrl+O</span>
            </button>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="npm-save">
              <span>Save</span><span class="text-gray-600 text-[10px]">Ctrl+S</span>
            </button>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="npm-saveas">Save As...</button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="npm-print">Print...</button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="npm-exit">Exit</button>
          </div>
        </div>

        <!-- Edit Menu -->
        <div class="relative">
          <button type="button" class="hover:bg-[#000080] hover:text-white px-2 py-0.5" id="np-edit-btn"><u>E</u>dit</button>
          <div id="np-edit-menu" class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[170px] z-50 text-black text-xs">
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="npm-undo">
              <span>Undo</span><span class="text-gray-600 text-[10px]">Ctrl+Z</span>
            </button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="npm-cut">
              <span>Cut</span><span class="text-gray-600 text-[10px]">Ctrl+X</span>
            </button>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="npm-copy">
              <span>Copy</span><span class="text-gray-600 text-[10px]">Ctrl+C</span>
            </button>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="npm-paste">
              <span>Paste</span><span class="text-gray-600 text-[10px]">Ctrl+V</span>
            </button>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="npm-del">
              <span>Delete</span><span class="text-gray-600 text-[10px]">Del</span>
            </button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="npm-selall">
              <span>Select All</span><span class="text-gray-600 text-[10px]">Ctrl+A</span>
            </button>
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="npm-timedate">
              <span>Time/Date</span><span class="text-gray-600 text-[10px]">F5</span>
            </button>
          </div>
        </div>

        <!-- Search Menu -->
        <div class="relative">
          <button type="button" class="hover:bg-[#000080] hover:text-white px-2 py-0.5" id="np-search-btn"><u>S</u>earch</button>
          <div id="np-search-menu" class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[150px] z-50 text-black text-xs">
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="npm-find">
              <span>Find...</span><span class="text-gray-600 text-[10px]">Ctrl+F</span>
            </button>
          </div>
        </div>

        <!-- Help Menu -->
        <div class="relative">
          <button type="button" class="hover:bg-[#000080] hover:text-white px-2 py-0.5" id="np-help-btn"><u>H</u>elp</button>
          <div id="np-help-menu" class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[150px] z-50 text-black text-xs">
            <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="npm-about">About Notepad</button>
          </div>
        </div>
      </div>

      <!-- Quick Action Bar -->
      <div class="flex items-center gap-1.5 px-2 py-1 bg-[#d4d0c8] border-b border-[#808080] text-[11px] font-mono text-black">
        <button type="button" class="retro-btn !py-0.5 !px-2 text-xs" id="np-new">New</button>
        <button type="button" class="retro-btn !py-0.5 !px-2 text-xs" id="np-open">Open</button>
        <button type="button" class="retro-btn !py-0.5 !px-2 text-xs font-bold text-[#000080]" id="np-save">Save</button>
        <button type="button" class="retro-btn !py-0.5 !px-2 text-xs" id="np-export">Export</button>
        <label class="flex items-center gap-1 ml-auto text-[11px]">
          <input type="checkbox" id="np-wrap" checked class="retro-checkbox" />
          <span>Word Wrap</span>
        </label>
      </div>

      <!-- Textarea Editor -->
      <div class="flex-1 relative bg-white border-t border-black">
        <textarea
          id="np-text"
          class="w-full h-full p-2.5 font-mono text-xs text-black bg-white resize-none outline-none border-none leading-relaxed"
          placeholder="Type text here..."
          spellcheck="false"
        ></textarea>
      </div>

      <!-- Status Bar -->
      <div class="flex items-center justify-between px-2 py-0.5 bg-[#c0c0c0] border-t border-white text-[10px] text-gray-700 font-mono">
        <span id="np-path-status">${currentPath}</span>
        <span id="np-pos-status">Ln 1, Col 1</span>
      </div>
    </div>
  `;

  const textarea = container.querySelector('#np-text') as HTMLTextAreaElement;
  const pathStatus = container.querySelector('#np-path-status') as HTMLElement;
  const posStatus = container.querySelector('#np-pos-status') as HTMLElement;
  const wrapCheck = container.querySelector('#np-wrap') as HTMLInputElement;

  // Dropdown menus
  const fileBtn = container.querySelector('#np-file-btn');
  const fileMenu = container.querySelector('#np-file-menu');
  const editBtn = container.querySelector('#np-edit-btn');
  const editMenu = container.querySelector('#np-edit-menu');
  const searchBtn = container.querySelector('#np-search-btn');
  const searchMenu = container.querySelector('#np-search-menu');
  const helpBtn = container.querySelector('#np-help-btn');
  const helpMenu = container.querySelector('#np-help-menu');

  const closeAllMenus = () => {
    fileMenu?.classList.add('hidden');
    editMenu?.classList.add('hidden');
    searchMenu?.classList.add('hidden');
    helpMenu?.classList.add('hidden');
  };

  fileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAllMenus();
    fileMenu?.classList.toggle('hidden');
  });

  editBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAllMenus();
    editMenu?.classList.toggle('hidden');
  });

  searchBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAllMenus();
    searchMenu?.classList.toggle('hidden');
  });

  helpBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAllMenus();
    helpMenu?.classList.toggle('hidden');
  });

  container.addEventListener('click', closeAllMenus);

  // Load initial content if path exists
  if (initialFile) {
    const content = vfs.readFile(initialFile);
    if (content !== null) {
      textarea.value = content;
      win.setTitle(`Notepad – ${initialFile.split('\\').pop()}`);
    }
  }

  // Update line and col
  const updatePos = () => {
    const val = textarea.value.substring(0, textarea.selectionStart);
    const lines = val.split('\n');
    const ln = lines.length;
    const col = lines[lines.length - 1].length + 1;
    posStatus.textContent = `Ln ${ln}, Col ${col}`;
  };

  textarea.addEventListener('input', () => {
    isDirty = true;
    updatePos();
  });
  textarea.addEventListener('keyup', updatePos);
  textarea.addEventListener('click', updatePos);

  wrapCheck.addEventListener('change', () => {
    textarea.style.whiteSpace = wrapCheck.checked ? 'pre-wrap' : 'pre';
  });

  // Save handler
  const save = () => {
    audio.playClick();
    vfs.writeFile(currentPath, textarea.value);
    isDirty = false;
    pathStatus.textContent = `${currentPath} (Saved)`;
    win.setTitle(`Notepad – ${currentPath.split('\\').pop()}`);
    audio.playChord();
  };

  const saveAs = () => {
    audio.playClick();
    const newPath = prompt('Save file as (virtual path):', currentPath);
    if (newPath) {
      currentPath = newPath;
      save();
    }
  };

  const newDoc = () => {
    audio.playClick();
    if (isDirty && !confirm('Discard unsaved changes?')) return;
    textarea.value = '';
    currentPath = 'C:\\My Documents\\Untitled.txt';
    pathStatus.textContent = currentPath;
    win.setTitle('Notepad – Untitled.txt');
    isDirty = false;
  };

  const openDoc = () => {
    audio.playClick();
    const target = prompt('Enter virtual path to open:', currentPath);
    if (target) {
      const data = vfs.readFile(target);
      if (data !== null) {
        textarea.value = data;
        currentPath = target;
        pathStatus.textContent = currentPath;
        win.setTitle(`Notepad – ${currentPath.split('\\').pop()}`);
        isDirty = false;
      } else {
        alert(`File not found: ${target}`);
      }
    }
  };

  const insertTimeDate = () => {
    audio.playClick();
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' }) + ' ' + now.toLocaleDateString('en-US');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.value = textarea.value.substring(0, start) + timeStr + textarea.value.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + timeStr.length;
    textarea.focus();
    isDirty = true;
    updatePos();
  };

  // Wire buttons & menu actions
  container.querySelector('#np-save')?.addEventListener('click', save);
  container.querySelector('#npm-save')?.addEventListener('click', save);
  container.querySelector('#npm-saveas')?.addEventListener('click', saveAs);
  container.querySelector('#np-new')?.addEventListener('click', newDoc);
  container.querySelector('#npm-new')?.addEventListener('click', newDoc);
  container.querySelector('#np-open')?.addEventListener('click', openDoc);
  container.querySelector('#npm-open')?.addEventListener('click', openDoc);

  container.querySelector('#npm-print')?.addEventListener('click', () => {
    audio.playClick();
    window.print();
  });
  container.querySelector('#npm-exit')?.addEventListener('click', () => {
    audio.playClick();
    win.close();
  });

  container.querySelector('#npm-timedate')?.addEventListener('click', insertTimeDate);
  container.querySelector('#npm-selall')?.addEventListener('click', () => {
    audio.playClick();
    textarea.select();
  });
  container.querySelector('#npm-undo')?.addEventListener('click', () => {
    audio.playClick();
    document.execCommand('undo');
  });
  container.querySelector('#npm-cut')?.addEventListener('click', () => {
    audio.playClick();
    document.execCommand('cut');
  });
  container.querySelector('#npm-copy')?.addEventListener('click', () => {
    audio.playClick();
    document.execCommand('copy');
  });
  container.querySelector('#npm-paste')?.addEventListener('click', () => {
    audio.playClick();
    navigator.clipboard?.readText().then(t => {
      if (t) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + t + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + t.length;
        updatePos();
      }
    }).catch(() => document.execCommand('paste'));
  });
  container.querySelector('#npm-del')?.addEventListener('click', () => {
    audio.playClick();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start !== end) {
      textarea.value = textarea.value.substring(0, start) + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start;
      updatePos();
    }
  });

  container.querySelector('#npm-find')?.addEventListener('click', () => {
    audio.playClick();
    const q = prompt('Find what:');
    if (q) {
      const idx = textarea.value.indexOf(q, textarea.selectionStart);
      if (idx !== -1) {
        textarea.setSelectionRange(idx, idx + q.length);
        textarea.focus();
      } else {
        alert(`Cannot find "${q}"`);
      }
    }
  });

  container.querySelector('#npm-about')?.addEventListener('click', () => {
    audio.playClick();
    alert('Notepad for Windows 95\nRelease 2026.11\n(C) 1995-2026 Piush KS.');
  });

  // Export to browser download
  container.querySelector('#np-export')?.addEventListener('click', () => {
    audio.playClick();
    const blob = new Blob([textarea.value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentPath.split('\\').pop() || 'document.txt';
    a.click();
    URL.revokeObjectURL(url);
  });
}

export function renderWordPad(container: HTMLElement, win: Win95Window) {
  win.setTitle('WordPad – Document.rtf');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0]">
      <!-- Toolbar -->
      <div class="flex flex-wrap items-center gap-1.5 p-1 bg-[#c0c0c0] border-b border-black text-xs select-none">
        <select id="wp-font" class="retro-select !py-0.5 !px-1 text-xs">
          <option value="ui-monospace, monospace">Courier New</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="Times New Roman, serif">Times New Roman</option>
          <option value="Comic Sans MS, cursive">Comic Sans</option>
        </select>
        <select id="wp-size" class="retro-select !py-0.5 !px-1 text-xs">
          <option value="2">10pt</option>
          <option value="3" selected>12pt</option>
          <option value="4">14pt</option>
          <option value="5">18pt</option>
          <option value="6">24pt</option>
        </select>
        <button type="button" class="retro-btn !p-1 font-bold w-6" id="wp-bold" title="Bold">B</button>
        <button type="button" class="retro-btn !p-1 italic w-6" id="wp-italic" title="Italic">I</button>
        <button type="button" class="retro-btn !p-1 underline w-6" id="wp-underline" title="Underline">U</button>
        <span class="w-[1px] h-4 bg-gray-600 mx-0.5"></span>
        <button type="button" class="retro-btn !p-1 w-6" id="wp-left" title="Align Left">⇤</button>
        <button type="button" class="retro-btn !p-1 w-6" id="wp-center" title="Align Center">≡</button>
        <button type="button" class="retro-btn !p-1 w-6" id="wp-right" title="Align Right">⇥</button>
        <button type="button" class="retro-btn !p-1 w-6" id="wp-list" title="Bullet List">•</button>
        <span class="w-[1px] h-4 bg-gray-600 mx-0.5"></span>
        <button type="button" class="retro-btn !py-0.5 !px-2 font-bold text-[#000080]" id="wp-save">Save VFS</button>
        <button type="button" class="retro-btn !py-0.5 !px-2" id="wp-export">Export HTML</button>
      </div>

      <!-- Rich Text Surface -->
      <div class="flex-1 bg-white p-4 overflow-auto border-t border-black">
        <div
          id="wp-editor"
          contenteditable="true"
          class="w-full min-h-full outline-none font-mono text-sm text-black leading-relaxed"
          style="min-height: 250px;"
        >
          <h1><strong>Project Specification – Piush 95</strong></h1>
          <p>Welcome to <em>WordPad</em> on Windows 95!</p>
          <p>This editor provides <u>rich formatting</u>, text alignment, and virtual storage.</p>
          <ul>
            <li>Real-time rich text styling</li>
            <li>HTML and RTF export capabilities</li>
            <li>Saved directly into <code>C:\\My Documents\\</code></li>
          </ul>
        </div>
      </div>

      <!-- Status Footer -->
      <div class="flex justify-between items-center px-2 py-0.5 bg-[#c0c0c0] border-t border-white text-[10px] text-gray-700">
        <span id="wp-status">C:\\My Documents\\Document.rtf</span>
        <span id="wp-word-count">Words: 34</span>
      </div>
    </div>
  `;

  const editor = container.querySelector('#wp-editor') as HTMLElement;
  const statusEl = container.querySelector('#wp-status') as HTMLElement;
  const wordCountEl = container.querySelector('#wp-word-count') as HTMLElement;

  const updateWords = () => {
    const text = editor.innerText || '';
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    wordCountEl.textContent = `Words: ${words}`;
  };

  editor.addEventListener('input', updateWords);

  // Formatting actions
  const format = (cmd: string, val = '') => {
    audio.playClick();
    document.execCommand(cmd, false, val);
    editor.focus();
  };

  container.querySelector('#wp-bold')?.addEventListener('click', () => format('bold'));
  container.querySelector('#wp-italic')?.addEventListener('click', () => format('italic'));
  container.querySelector('#wp-underline')?.addEventListener('click', () => format('underline'));
  container.querySelector('#wp-left')?.addEventListener('click', () => format('justifyLeft'));
  container.querySelector('#wp-center')?.addEventListener('click', () => format('justifyCenter'));
  container.querySelector('#wp-right')?.addEventListener('click', () => format('justifyRight'));
  container.querySelector('#wp-list')?.addEventListener('click', () => format('insertUnorderedList'));

  const fontSelect = container.querySelector('#wp-font') as HTMLSelectElement;
  fontSelect?.addEventListener('change', () => format('fontName', fontSelect.value));

  const sizeSelect = container.querySelector('#wp-size') as HTMLSelectElement;
  sizeSelect?.addEventListener('change', () => format('fontSize', sizeSelect.value));

  // Save to VFS
  container.querySelector('#wp-save')?.addEventListener('click', () => {
    audio.playClick();
    const path = 'C:\\My Documents\\Document.rtf';
    vfs.writeFile(path, editor.innerHTML, 'text/html');
    statusEl.textContent = `${path} (Saved)`;
    audio.playChord();
  });

  // Export
  container.querySelector('#wp-export')?.addEventListener('click', () => {
    audio.playClick();
    const blob = new Blob([editor.innerHTML], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Document.html';
    a.click();
    URL.revokeObjectURL(url);
  });
}

export function renderPaint(container: HTMLElement, win: Win95Window) {
  win.setTitle('Paint – Untitled.bmp');

  const WIN95_PALETTE = [
    '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
    '#808040', '#004040', '#0080ff', '#004080', '#8000ff', '#804000',
    '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
    '#ffff80', '#00ff80', '#80ffff', '#7f7fff', '#ff0080', '#ff8040',
  ];

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0]">
      <!-- Top Action Bar -->
      <div class="flex items-center gap-1.5 p-1 bg-[#c0c0c0] border-b border-black text-xs select-none">
        <button type="button" class="retro-btn !py-0.5 !px-2 font-bold" id="paint-clear">Clear</button>
        <button type="button" class="retro-btn !py-0.5 !px-2 font-bold text-[#000080]" id="paint-save">Save VFS</button>
        <button type="button" class="retro-btn !py-0.5 !px-2 font-bold" id="paint-export">Export PNG</button>
        <button type="button" class="retro-btn !py-0.5 !px-2 font-bold text-emerald-800" id="paint-wallpaper" title="Set as desktop wallpaper">Set Wallpaper 🖼️</button>
        <span class="w-[1px] h-4 bg-gray-600 mx-1"></span>
        <span class="text-[11px] font-bold">Brush:</span>
        <select id="paint-size" class="retro-select !py-0.5 !px-1 text-xs">
          <option value="1">1px Thin</option>
          <option value="3" selected>3px Normal</option>
          <option value="6">6px Thick</option>
          <option value="12">12px Marker</option>
        </select>
      </div>

      <div class="flex flex-1 overflow-hidden">
        <!-- Left Toolbox -->
        <div class="w-14 bg-[#c0c0c0] border-r border-black p-1 grid grid-cols-2 gap-1 content-start select-none">
          <button type="button" class="retro-btn !p-1 text-xs font-bold is-active" data-tool="pencil" title="Pencil">✏️</button>
          <button type="button" class="retro-btn !p-1 text-xs font-bold" data-tool="brush" title="Brush">🖌️</button>
          <button type="button" class="retro-btn !p-1 text-xs font-bold" data-tool="eraser" title="Eraser">🧹</button>
          <button type="button" class="retro-btn !p-1 text-xs font-bold" data-tool="fill" title="Fill Bucket">🪣</button>
          <button type="button" class="retro-btn !p-1 text-xs font-bold" data-tool="line" title="Line">╱</button>
          <button type="button" class="retro-btn !p-1 text-xs font-bold" data-tool="rect" title="Rectangle">▭</button>
          <button type="button" class="retro-btn !p-1 text-xs font-bold" data-tool="circle" title="Ellipse">◯</button>
        </div>

        <!-- Canvas Area -->
        <div class="flex-1 bg-[#808080] p-2 overflow-auto flex items-center justify-center">
          <canvas id="paint-canvas" width="480" height="320" class="bg-white border-2 border-black shadow-[2px_2px_0px_#000000] cursor-crosshair"></canvas>
        </div>
      </div>

      <!-- Bottom Palette -->
      <div class="flex items-center gap-2 p-1.5 bg-[#c0c0c0] border-t border-white text-xs select-none">
        <div class="flex items-center gap-1">
          <div class="size-6 border-2 border-black" id="paint-current-color" style="background-color: #000000;"></div>
          <span class="text-[10px] font-bold">Color</span>
        </div>
        <div class="grid grid-rows-2 grid-flow-col gap-0.5">
          ${WIN95_PALETTE.map((c) => `<div class="size-3.5 border border-black cursor-pointer paint-swatch" style="background-color: ${c};" data-color="${c}"></div>`).join('')}
        </div>
        <span class="ml-auto text-[10px] text-gray-700 font-mono" id="paint-coords">480 x 320 px</span>
      </div>
    </div>
  `;

  const canvas = container.querySelector('#paint-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let currentTool = 'pencil';
  let currentColor = '#000000';
  let currentSize = 3;
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let snapshot: ImageData | null = null;

  // Tool buttons
  container.querySelectorAll('[data-tool]').forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      container.querySelectorAll('[data-tool]').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentTool = (btn as HTMLElement).getAttribute('data-tool') || 'pencil';
    });
  });

  // Swatches
  const colorDisplay = container.querySelector('#paint-current-color') as HTMLElement;
  container.querySelectorAll('.paint-swatch').forEach((swatch) => {
    swatch.addEventListener('click', () => {
      audio.playClick();
      currentColor = (swatch as HTMLElement).getAttribute('data-color') || '#000000';
      colorDisplay.style.backgroundColor = currentColor;
    });
  });

  const sizeSelect = container.querySelector('#paint-size') as HTMLSelectElement;
  sizeSelect?.addEventListener('change', () => {
    currentSize = parseInt(sizeSelect.value, 10);
  });

  // Drawing event handlers
  const getCoords = (e: MouseEvent | TouchEvent) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.round(clientX - rect.left),
      y: Math.round(clientY - rect.top),
    };
  };

  const startDraw = (e: MouseEvent | TouchEvent) => {
    isDrawing = true;
    const { x, y } = getCoords(e);
    lastX = x;
    lastY = y;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (currentTool === 'fill') {
      floodFill(x, y, currentColor);
      isDrawing = false;
    } else if (currentTool === 'pencil' || currentTool === 'brush' || currentTool === 'eraser') {
      ctx.beginPath();
      ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
      ctx.lineWidth = currentTool === 'eraser' ? currentSize * 2 : currentSize;
      ctx.lineCap = 'round';
      ctx.moveTo(x, y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const draw = (e: MouseEvent | TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCoords(e);

    if (currentTool === 'pencil' || currentTool === 'brush' || currentTool === 'eraser') {
      ctx.beginPath();
      ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
      ctx.lineWidth = currentTool === 'eraser' ? currentSize * 2 : currentSize;
      ctx.lineCap = 'round';
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      lastX = x;
      lastY = y;
    } else if (snapshot) {
      ctx.putImageData(snapshot, 0, 0);
      ctx.strokeStyle = currentColor;
      ctx.fillStyle = currentColor;
      ctx.lineWidth = currentSize;

      if (currentTool === 'line') {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (currentTool === 'rect') {
        ctx.strokeRect(lastX, lastY, x - lastX, y - lastY);
      } else if (currentTool === 'circle') {
        ctx.beginPath();
        const rx = Math.abs(x - lastX) / 2;
        const ry = Math.abs(y - lastY) / 2;
        ctx.ellipse(lastX + (x - lastX) / 2, lastY + (y - lastY) / 2, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  };

  const stopDraw = () => {
    isDrawing = false;
  };

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  window.addEventListener('mouseup', stopDraw);

  canvas.addEventListener('touchstart', startDraw, { passive: true });
  canvas.addEventListener('touchmove', draw, { passive: true });
  canvas.addEventListener('touchend', stopDraw);

  // Clear
  container.querySelector('#paint-clear')?.addEventListener('click', () => {
    audio.playClick();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  // Save to VFS
  container.querySelector('#paint-save')?.addEventListener('click', () => {
    audio.playClick();
    const dataUrl = canvas.toDataURL('image/png');
    vfs.writeFile('C:\\My Documents\\Pictures\\Drawing.png', dataUrl, 'image/png');
    win.setTitle('Paint – Drawing.png');
    audio.playChord();
  });

  // Export PNG
  container.querySelector('#paint-export')?.addEventListener('click', () => {
    audio.playClick();
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'Drawing.png';
    a.click();
  });

  // Set as Wallpaper
  container.querySelector('#paint-wallpaper')?.addEventListener('click', () => {
    audio.playChord();
    const dataUrl = canvas.toDataURL('image/png');
    const desktop = document.getElementById('win95-desktop-screen');
    if (desktop) {
      desktop.style.backgroundImage = `url("${dataUrl}")`;
      desktop.style.backgroundRepeat = 'repeat';
      desktop.style.backgroundPosition = 'center';
      try {
        localStorage.setItem('win95_desktop_wallpaper', 'custom');
        localStorage.setItem('win95_custom_wallpaper_data', dataUrl);
      } catch (_) {}
    }
    alert('Your painting has been set as the Windows 95 Desktop Wallpaper!');
  });

  // Basic flood fill
  function floodFill(startX: number, startY: number, fillHex: string) {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const targetIdx = (startY * canvas.width + startX) * 4;
    const targetR = data[targetIdx];
    const targetG = data[targetIdx + 1];
    const targetB = data[targetIdx + 2];

    const tempEl = document.createElement('div');
    tempEl.style.color = fillHex;
    document.body.appendChild(tempEl);
    const rgbStr = getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);
    const rgbMatch = rgbStr.match(/\d+/g);
    if (!rgbMatch) return;
    const [fillR, fillG, fillB] = rgbMatch.map(Number);

    if (targetR === fillR && targetG === fillG && targetB === fillB) return;

    const stack: [number, number][] = [[startX, startY]];
    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!;
      const idx = (cy * canvas.width + cx) * 4;
      if (cx < 0 || cx >= canvas.width || cy < 0 || cy >= canvas.height) continue;

      if (data[idx] === targetR && data[idx + 1] === targetG && data[idx + 2] === targetB) {
        data[idx] = fillR;
        data[idx + 1] = fillG;
        data[idx + 2] = fillB;
        data[idx + 3] = 255;
        stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }
}

export function renderCalculator(container: HTMLElement, win: Win95Window) {
  win.setTitle('Calculator');

  let displayVal = '0';
  let prevVal: number | null = null;
  let op: string | null = null;
  let shouldResetDisplay = false;
  let memory = 0;
  let isScientific = false;

  const renderUI = () => {
    container.innerHTML = `
      <div class="flex flex-col h-full bg-[#c0c0c0] p-2 select-none font-mono text-xs">
        <!-- Mode Switcher -->
        <div class="flex items-center justify-between pb-1.5 border-b border-black/40 mb-2">
          <label class="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name="calc-mode" value="std" ${!isScientific ? 'checked' : ''} id="calc-mode-std" />
            <span class="font-bold text-[11px]">Standard</span>
          </label>
          <label class="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name="calc-mode" value="sci" ${isScientific ? 'checked' : ''} id="calc-mode-sci" />
            <span class="font-bold text-[11px]">Scientific</span>
          </label>
          <span class="text-[10px] text-gray-700 font-bold ml-auto">${memory !== 0 ? 'M' : ''}</span>
        </div>

        <!-- LCD Screen -->
        <div class="bg-white border-2 border-black shadow-[inset_1px_1px_0px_#000000] p-2 text-right text-lg font-bold truncate mb-2">
          <span id="calc-display">${displayVal}</span>
        </div>

        <!-- Keypad Grid -->
        <div class="grid ${isScientific ? 'grid-cols-6' : 'grid-cols-4'} gap-1 flex-1">
          ${isScientific ? `
            <button type="button" class="retro-btn !py-1 text-xs" data-key="sin">sin</button>
            <button type="button" class="retro-btn !py-1 text-xs" data-key="cos">cos</button>
            <button type="button" class="retro-btn !py-1 text-xs" data-key="tan">tan</button>
            <button type="button" class="retro-btn !py-1 text-xs" data-key="pi">π</button>
            <button type="button" class="retro-btn !py-1 text-xs" data-key="sqrt">√</button>
            <button type="button" class="retro-btn !py-1 text-xs font-bold text-red-700" data-key="c">C</button>

            <button type="button" class="retro-btn !py-1 text-xs" data-key="log">log</button>
            <button type="button" class="retro-btn !py-1 text-xs" data-key="ln">ln</button>
            <button type="button" class="retro-btn !py-1 text-xs" data-key="fact">n!</button>
            <button type="button" class="retro-btn !py-1 text-xs" data-key="pow">x^y</button>
            <button type="button" class="retro-btn !py-1 text-xs font-bold" data-key="mc">MC</button>
            <button type="button" class="retro-btn !py-1 text-xs font-bold" data-key="mr">MR</button>
          ` : `
            <button type="button" class="retro-btn !py-1 text-xs font-bold" data-key="mc">MC</button>
            <button type="button" class="retro-btn !py-1 text-xs font-bold" data-key="mr">MR</button>
            <button type="button" class="retro-btn !py-1 text-xs font-bold" data-key="ms">MS</button>
            <button type="button" class="retro-btn !py-1 text-xs font-bold text-red-700" data-key="c">C</button>
          `}

          <button type="button" class="retro-btn !py-1.5 text-sm font-bold" data-key="7">7</button>
          <button type="button" class="retro-btn !py-1.5 text-sm font-bold" data-key="8">8</button>
          <button type="button" class="retro-btn !py-1.5 text-sm font-bold" data-key="9">9</button>
          <button type="button" class="retro-btn !py-1.5 text-sm font-bold text-[#000080]" data-key="/">/</button>
          ${isScientific ? '<button type="button" class="retro-btn !py-1.5 text-xs font-bold" data-key="m+">M+</button><button type="button" class="retro-btn !py-1.5 text-xs font-bold" data-key="m-">M-</button>' : ''}

          <button type="button" class="retro-btn !py-1.5 text-sm font-bold" data-key="4">4</button>
          <button type="button" class="retro-btn !py-1.5 text-sm font-bold" data-key="5">5</button>
          <button type="button" class="retro-btn !py-1.5 text-sm font-bold" data-key="6">6</button>
          <button type="button" class="retro-btn !py-1.5 text-sm font-bold text-[#000080]" data-key="*">*</button>
          ${isScientific ? '<button type="button" class="retro-btn !py-1.5 text-xs" data-key="inv">1/x</button><button type="button" class="retro-btn !py-1.5 text-xs" data-key="pct">%</button>' : ''}

          <button type="button" class="retro-btn !py-1.5 text-sm font-bold" data-key="1">1</button>
          <button type="button" class="retro-btn !py-1.5 text-sm font-bold" data-key="2">2</button>
          <button type="button" class="retro-btn !py-1.5 text-sm font-bold" data-key="3">3</button>
          <button type="button" class="retro-btn !py-1.5 text-sm font-bold text-[#000080]" data-key="-">-</button>
          ${isScientific ? '<button type="button" class="retro-btn !py-1.5 text-xs" data-key="neg">±</button><button type="button" class="retro-btn !py-1.5 text-xs" data-key="exp">EXP</button>' : ''}

          <button type="button" class="retro-btn !py-1.5 text-sm font-bold" data-key="0">0</button>
          <button type="button" class="retro-btn !py-1.5 text-sm font-bold" data-key=".">.</button>
          <button type="button" class="retro-btn !py-1.5 text-sm font-bold text-emerald-800" data-key="=">=</button>
          <button type="button" class="retro-btn !py-1.5 text-sm font-bold text-[#000080]" data-key="+">+</button>
        </div>
      </div>
    `;

    // Re-attach handlers
    container.querySelectorAll('[data-key]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const k = (btn as HTMLElement).getAttribute('data-key')!;
        handleKey(k);
      });
    });

    container.querySelector('#calc-mode-std')?.addEventListener('change', () => {
      isScientific = false;
      renderUI();
    });
    container.querySelector('#calc-mode-sci')?.addEventListener('change', () => {
      isScientific = true;
      renderUI();
    });
  };

  const handleKey = (k: string) => {
    audio.playClick();
    if (!isNaN(parseInt(k, 10))) {
      if (displayVal === '0' || shouldResetDisplay) {
        displayVal = k;
        shouldResetDisplay = false;
      } else {
        displayVal += k;
      }
    } else if (k === '.') {
      if (!displayVal.includes('.')) displayVal += '.';
    } else if (k === 'c') {
      displayVal = '0';
      prevVal = null;
      op = null;
      shouldResetDisplay = false;
    } else if (k === 'pi') {
      displayVal = String(Math.PI);
      shouldResetDisplay = true;
    } else if (k === 'sqrt') {
      const cur = parseFloat(displayVal);
      displayVal = cur < 0 ? 'Error' : String(Math.sqrt(cur));
      shouldResetDisplay = true;
    } else if (k === 'sin') {
      displayVal = String(Math.sin(parseFloat(displayVal)));
      shouldResetDisplay = true;
    } else if (k === 'cos') {
      displayVal = String(Math.cos(parseFloat(displayVal)));
      shouldResetDisplay = true;
    } else if (k === 'tan') {
      displayVal = String(Math.tan(parseFloat(displayVal)));
      shouldResetDisplay = true;
    } else if (k === 'log') {
      displayVal = String(Math.log10(parseFloat(displayVal)));
      shouldResetDisplay = true;
    } else if (k === 'ln') {
      displayVal = String(Math.log(parseFloat(displayVal)));
      shouldResetDisplay = true;
    } else if (k === 'fact') {
      let n = Math.floor(parseFloat(displayVal));
      if (n < 0) displayVal = 'Error';
      else {
        let res = 1;
        for (let i = 2; i <= n; i++) res *= i;
        displayVal = String(res);
      }
      shouldResetDisplay = true;
    } else if (k === 'inv') {
      const cur = parseFloat(displayVal);
      displayVal = cur === 0 ? 'Error' : String(1 / cur);
      shouldResetDisplay = true;
    } else if (k === 'neg') {
      displayVal = String(-parseFloat(displayVal));
    } else if (k === 'mc') {
      memory = 0;
      renderUI();
    } else if (k === 'mr') {
      displayVal = String(memory);
      shouldResetDisplay = true;
    } else if (k === 'ms') {
      memory = parseFloat(displayVal);
      renderUI();
    } else if (k === 'm+') {
      memory += parseFloat(displayVal);
      renderUI();
    } else if (k === 'm-') {
      memory -= parseFloat(displayVal);
      renderUI();
    } else if (['+', '-', '*', '/', 'pow'].includes(k)) {
      prevVal = parseFloat(displayVal);
      op = k;
      shouldResetDisplay = true;
    } else if (k === '=') {
      if (prevVal !== null && op) {
        const cur = parseFloat(displayVal);
        let res = 0;
        if (op === '+') res = prevVal + cur;
        else if (op === '-') res = prevVal - cur;
        else if (op === '*') res = prevVal * cur;
        else if (op === '/') res = cur === 0 ? NaN : prevVal / cur;
        else if (op === 'pow') res = Math.pow(prevVal, cur);

        displayVal = isNaN(res) ? 'Error' : String(res);
        prevVal = null;
        op = null;
        shouldResetDisplay = true;
      }
    }

    const disp = container.querySelector('#calc-display');
    if (disp) disp.textContent = displayVal;
  };

  renderUI();
}

export function renderCharacterMap(container: HTMLElement, win: Win95Window) {
  win.setTitle('Character Map');

  // Popular Unicode sets
  const chars: string[] = [];
  // Latin & Symbols
  for (let i = 33; i <= 255; i++) chars.push(String.fromCharCode(i));
  // Greek & Arrows
  for (let i = 913; i <= 969; i++) chars.push(String.fromCharCode(i));
  for (let i = 8592; i <= 8601; i++) chars.push(String.fromCharCode(i));

  let selectedChar = 'A';

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] p-2 select-none font-mono text-xs">
      <div class="flex items-center gap-2 mb-2">
        <label class="font-bold text-xs">Font:</label>
        <select class="retro-select !py-0.5 !px-2 text-xs flex-1">
          <option>Courier New (Standard)</option>
          <option>Arial / Helvetica</option>
          <option>Times New Roman</option>
          <option>Symbol</option>
        </select>
      </div>

      <!-- Character Grid -->
      <div class="flex-1 bg-white border-2 border-black shadow-[inset_1px_1px_0px_#000000] p-1.5 overflow-auto grid grid-cols-12 sm:grid-cols-16 gap-0.5" id="charmap-grid">
        ${chars.map((c) => `<button type="button" class="w-6 h-6 flex items-center justify-center text-sm hover:bg-[#000080] hover:text-white border border-transparent focus:border-black" data-char="${c}">${c}</button>`).join('')}
      </div>

      <!-- Bottom Inspector & Copy -->
      <div class="flex items-center gap-3 pt-2 mt-1 border-t border-white">
        <div class="size-10 bg-white border-2 border-black flex items-center justify-center text-2xl font-bold" id="charmap-preview">
          ${selectedChar}
        </div>
        <div class="flex flex-col text-[11px]">
          <span id="charmap-code">Unicode: U+0041</span>
          <span class="text-gray-600">Click character to copy</span>
        </div>
        <div class="flex items-center gap-2 ml-auto">
          <input type="text" id="charmap-selected" value="${selectedChar}" class="retro-input !py-0.5 !px-2 w-24 text-center font-bold" readonly />
          <button type="button" class="retro-btn !py-1 !px-3 font-bold" id="charmap-copy">Copy</button>
        </div>
      </div>
    </div>
  `;

  const preview = container.querySelector('#charmap-preview') as HTMLElement;
  const codeEl = container.querySelector('#charmap-code') as HTMLElement;
  const selectedInput = container.querySelector('#charmap-selected') as HTMLInputElement;

  container.querySelectorAll('[data-char]').forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      selectedChar = (btn as HTMLElement).getAttribute('data-char') || '';
      preview.textContent = selectedChar;
      const code = selectedChar.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
      codeEl.textContent = `Unicode: U+${code}`;
      selectedInput.value = selectedChar;
    });
  });

  container.querySelector('#charmap-copy')?.addEventListener('click', () => {
    audio.playClick();
    navigator.clipboard.writeText(selectedChar);
    alert(`Copied "${selectedChar}" to clipboard!`);
  });
}

export function renderClipboardViewer(container: HTMLElement, win: Win95Window) {
  win.setTitle('Clipboard Viewer');

  const getClipboardData = () => {
    try {
      const hist = localStorage.getItem('win95_clipboard_history');
      return hist ? JSON.parse(hist) : ['Welcome to Windows 95!', 'https://piush.com', 'Senior Mobile & Cloud Architect'];
    } catch (_) {
      return ['Welcome to Windows 95!'];
    }
  };

  const renderList = () => {
    const items: string[] = getClipboardData();
    container.innerHTML = `
      <div class="flex flex-col h-full bg-[#c0c0c0] p-2 font-mono text-xs select-none">
        <div class="flex items-center justify-between pb-1.5 border-b border-black mb-2">
          <span class="font-bold text-xs">Clipboard Items (${items.length})</span>
          <div class="flex gap-1.5">
            <button type="button" class="retro-btn !py-0.5 !px-2 text-xs" id="clip-paste-now">Paste External</button>
            <button type="button" class="retro-btn !py-0.5 !px-2 text-xs font-bold text-red-700" id="clip-clear">Clear</button>
          </div>
        </div>

        <div class="flex-1 bg-white border-2 border-black p-2 overflow-auto space-y-1.5">
          ${items.map((item, idx) => `
            <div class="p-2 border border-gray-300 hover:bg-[#000080] hover:text-white cursor-pointer select-text clip-entry flex justify-between items-center" data-idx="${idx}">
              <span class="truncate flex-1">${item}</span>
              <button type="button" class="retro-btn !py-0.5 !px-1.5 text-[10px] ml-2 text-black" data-copy="${idx}">Copy</button>
            </div>
          `).join('')}
        </div>

        <div class="pt-1.5 text-[10px] text-gray-600">
          Click an item to copy back into your active system clipboard.
        </div>
      </div>
    `;

    container.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        audio.playClick();
        const idx = parseInt((btn as HTMLElement).getAttribute('data-copy') || '0', 10);
        navigator.clipboard.writeText(items[idx]);
        audio.playChord();
      });
    });

    container.querySelector('#clip-clear')?.addEventListener('click', () => {
      audio.playClick();
      localStorage.setItem('win95_clipboard_history', JSON.stringify([]));
      renderList();
    });

    container.querySelector('#clip-paste-now')?.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          items.unshift(text);
          localStorage.setItem('win95_clipboard_history', JSON.stringify(items.slice(0, 10)));
          renderList();
        }
      } catch (_) {
        alert('Clipboard permission denied by browser.');
      }
    });
  };

  renderList();
}

export function renderAddressBook(container: HTMLElement, win: Win95Window) {
  win.setTitle('Address Book');

  const DEFAULT_CONTACTS = [
    { name: 'Piush Kumar Singh', role: 'Senior Mobile & Cloud Architect', email: 'hi@piush.com', phone: '+1-555-PIUSH', company: 'Piush.com' },
    { name: 'Engineering Recruiter', role: 'Talent Acquisition', email: 'careers@enterprise.io', phone: '+1-555-0102', company: 'Global Tech' },
    { name: 'GitHub System Node', role: 'Repositories & OSS', email: 'git@piushks.dev', phone: '+1-555-REPO', company: 'github.com/piushks' },
  ];

  let contacts = [...DEFAULT_CONTACTS];
  try {
    const saved = localStorage.getItem('win95_contacts');
    if (saved) contacts = JSON.parse(saved);
  } catch (_) {}

  const renderUI = () => {
    container.innerHTML = `
      <div class="flex flex-col h-full bg-[#c0c0c0] p-2 font-mono text-xs select-none">
        <!-- Top Toolbar -->
        <div class="flex items-center gap-2 pb-1.5 border-b border-black mb-2">
          <button type="button" class="retro-btn !py-0.5 !px-2.5 font-bold" id="ab-add">New Contact</button>
          <button type="button" class="retro-btn !py-0.5 !px-2.5" id="ab-export">Export CSV</button>
          <input type="text" id="ab-search" placeholder="Search contacts..." class="retro-input !py-0.5 !px-2 flex-1 text-xs" />
        </div>

        <!-- Contact List -->
        <div class="flex-1 bg-white border-2 border-black overflow-auto" id="ab-table-container">
          <table class="w-full text-left border-collapse text-xs">
            <thead class="bg-[#d4d0c8] border-b border-black sticky top-0">
              <tr>
                <th class="p-1.5 border-r border-gray-400">Name</th>
                <th class="p-1.5 border-r border-gray-400">Role / Company</th>
                <th class="p-1.5 border-r border-gray-400">Email</th>
                <th class="p-1.5">Action</th>
              </tr>
            </thead>
            <tbody id="ab-tbody">
              ${contacts.map((c, i) => `
                <tr class="hover:bg-[#000080] hover:text-white border-b border-gray-200">
                  <td class="p-1.5 font-bold">${c.name}</td>
                  <td class="p-1.5">${c.role} (${c.company})</td>
                  <td class="p-1.5">${c.email}</td>
                  <td class="p-1.5">
                    <button type="button" class="retro-btn !py-0 !px-1.5 text-[10px] text-red-700" data-del="${i}">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="pt-1.5 text-[10px] text-gray-700 flex justify-between">
          <span>${contacts.length} Contacts Listed</span>
          <span>Double-click to compose mail</span>
        </div>
      </div>
    `;

    // Add contact
    container.querySelector('#ab-add')?.addEventListener('click', () => {
      audio.playClick();
      const name = prompt('Contact Name:');
      if (!name) return;
      const email = prompt('Email Address:') || '';
      const role = prompt('Title / Role:') || 'Engineer';
      contacts.push({ name, email, role, phone: '+1-555-0100', company: 'Independent' });
      localStorage.setItem('win95_contacts', JSON.stringify(contacts));
      renderUI();
    });

    // Delete contact
    container.querySelectorAll('[data-del]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        audio.playClick();
        const idx = parseInt((btn as HTMLElement).getAttribute('data-del') || '0', 10);
        contacts.splice(idx, 1);
        localStorage.setItem('win95_contacts', JSON.stringify(contacts));
        renderUI();
      });
    });

    // Export CSV
    container.querySelector('#ab-export')?.addEventListener('click', () => {
      audio.playClick();
      const csv = 'Name,Role,Company,Email,Phone\n' + contacts.map((c) => `"${c.name}","${c.role}","${c.company}","${c.email}","${c.phone}"`).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'Contacts.csv';
      a.click();
    });

    // Search filter
    const searchInput = container.querySelector('#ab-search') as HTMLInputElement;
    searchInput?.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      container.querySelectorAll('#ab-tbody tr').forEach((row) => {
        row.classList.toggle('hidden', !row.textContent?.toLowerCase().includes(q));
      });
    });
  };

  renderUI();
}

export function renderPhoneDialer(container: HTMLElement, win: Win95Window) {
  win.setTitle('Phone Dialer');
  let currentNum = '';

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] p-3 font-mono text-xs select-none items-center">
      <!-- LCD Screen -->
      <div class="w-full bg-white border-2 border-black shadow-[inset_1px_1px_0px_#000000] p-2 text-center text-lg font-bold mb-3 tracking-widest text-[#000080]">
        <span id="dialer-display">--</span>
      </div>

      <!-- 12-Key DTMF Pad -->
      <div class="grid grid-cols-3 gap-2 w-52 mb-3">
        ${['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((d) => `
          <button type="button" class="retro-btn !py-2.5 text-base font-bold dialer-key" data-digit="${d}">${d}</button>
        `).join('')}
      </div>

      <!-- Action Row -->
      <div class="flex gap-2 w-52">
        <button type="button" class="retro-btn !py-1 font-bold text-red-700 flex-1" id="dialer-clear">Clear</button>
        <button type="button" class="retro-btn !py-1 font-bold text-emerald-800 flex-1" id="dialer-call">Dial 📞</button>
      </div>

      <div class="mt-2 text-[10px] text-gray-600 text-center">
        Synthesizes real DTMF dual-tones via Web Audio API.
      </div>
    </div>
  `;

  const disp = container.querySelector('#dialer-display') as HTMLElement;

  container.querySelectorAll('.dialer-key').forEach((btn) => {
    btn.addEventListener('click', () => {
      const d = (btn as HTMLElement).getAttribute('data-digit')!;
      audio.playDTMF(d);
      currentNum += d;
      disp.textContent = currentNum;
    });
  });

  container.querySelector('#dialer-clear')?.addEventListener('click', () => {
    audio.playClick();
    currentNum = '';
    disp.textContent = '--';
  });

  container.querySelector('#dialer-call')?.addEventListener('click', () => {
    if (!currentNum) return;
    audio.playChord();
    alert(`Dialing ${currentNum}... Connected via virtual line!`);
  });
}

