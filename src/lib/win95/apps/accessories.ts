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

export function renderWordPad(container: HTMLElement, win: Win95Window, initialFile?: string) {
  let currentPath = initialFile || 'C:\\My Documents\\Document.rtf';
  let isModified = false;
  let leftMarginPx = 32;
  let rightMarginPx = 32;

  const getBasename = (p: string) => p.split('\\').pop() || 'Document.rtf';
  win.setTitle(`${getBasename(currentPath)} – WordPad`);

  const initialContent = initialFile && vfs.readFile(initialFile)
    ? vfs.readFile(initialFile)!
    : `
      <h1 style="color: #000080; border-bottom: 2px solid #000080; padding-bottom: 4px; margin-bottom: 12px;">
        <strong>Piush KS – Senior Mobile & Cloud Engineer</strong>
      </h1>
      <p style="font-size: 13px; color: #333333; margin-bottom: 8px;">
        <strong>Technical Resume & Engineering Competencies (WordPad Edition)</strong>
      </p>
      <hr style="border: 0; border-top: 1px solid #808080; margin: 8px 0 16px 0;" />
      
      <h2 style="font-size: 14px; color: #000080; margin-top: 12px; margin-bottom: 6px;">
        <strong>1. Core Engineering Summary</strong>
      </h2>
      <p style="margin-bottom: 8px;">
        Senior Mobile & Cloud Engineer with <strong>8+ years</strong> of production experience crafting high-concurrency client architectures, cross-platform mobile ecosystems, and distributed cloud backends serving <strong>10M+ users</strong> globally.
      </p>
      
      <h2 style="font-size: 14px; color: #000080; margin-top: 14px; margin-bottom: 6px;">
        <strong>2. Production Technical Skills</strong>
      </h2>
      <ul style="margin-left: 20px; margin-bottom: 12px;">
        <li><strong>Mobile Engineering:</strong> Kotlin, Android Jetpack Compose, Swift, SwiftUI, Flutter, Dart, React Native.</li>
        <li><strong>Cloud & Distributed Systems:</strong> Node.js, TypeScript, Go, PostgreSQL, Redis, Docker, AWS (Lambda, ECS, S3).</li>
        <li><strong>Performance & Optimization:</strong> 60 FPS micro-animations, offline-first CRDT synchronization, zero-allocation render pipelines.</li>
      </ul>

      <h2 style="font-size: 14px; color: #000080; margin-top: 14px; margin-bottom: 6px;">
        <strong>3. WordPad Features in Windows 95</strong>
      </h2>
      <p style="margin-bottom: 8px;">
        This document can be styled, edited, saved to <code>C:\\My Documents\\</code>, and exported directly as <strong>RTF</strong>, <strong>HTML</strong>, or <strong>Plain Text</strong>!
      </p>
    `;

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] font-mono text-xs select-none relative">
      <!-- 1. Menubar -->
      <div class="flex items-center gap-1 px-1 py-0.5 bg-[#c0c0c0] border-b border-black/60 relative z-30">
        <!-- File -->
        <div class="relative">
          <button type="button" class="hover:bg-[#000080] hover:text-white px-2 py-0.5" id="wp-m-file-btn"><u>F</u>ile</button>
          <div id="wp-m-file" class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[170px] z-50 text-black">
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex justify-between" id="wpm-new">
              <span><u>N</u>ew...</span><span class="text-gray-600 text-[10px]">Ctrl+N</span>
            </button>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex justify-between" id="wpm-open">
              <span><u>O</u>pen...</span><span class="text-gray-600 text-[10px]">Ctrl+O</span>
            </button>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex justify-between" id="wpm-save">
              <span><u>S</u>ave</span><span class="text-gray-600 text-[10px]">Ctrl+S</span>
            </button>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white" id="wpm-saveas">Save <u>A</u>s...</button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex justify-between" id="wpm-print">
              <span><u>P</u>rint...</span><span class="text-gray-600 text-[10px]">Ctrl+P</span>
            </button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white" id="wpm-export-rtf">Export as RTF</button>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white" id="wpm-export-html">Export as HTML</button>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white" id="wpm-export-txt">Export as Plain Text</button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white" id="wpm-exit">E<u>x</u>it</button>
          </div>
        </div>

        <!-- Edit -->
        <div class="relative">
          <button type="button" class="hover:bg-[#000080] hover:text-white px-2 py-0.5" id="wp-m-edit-btn"><u>E</u>dit</button>
          <div id="wp-m-edit" class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[170px] z-50 text-black">
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex justify-between" id="wpm-undo">
              <span><u>U</u>ndo</span><span class="text-gray-600 text-[10px]">Ctrl+Z</span>
            </button>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex justify-between" id="wpm-redo">
              <span><u>R</u>edo</span><span class="text-gray-600 text-[10px]">Ctrl+Y</span>
            </button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex justify-between" id="wpm-cut">
              <span>Cu<u>t</u></span><span class="text-gray-600 text-[10px]">Ctrl+X</span>
            </button>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex justify-between" id="wpm-copy">
              <span><u>C</u>opy</span><span class="text-gray-600 text-[10px]">Ctrl+C</span>
            </button>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex justify-between" id="wpm-paste">
              <span><u>P</u>aste</span><span class="text-gray-600 text-[10px]">Ctrl+V</span>
            </button>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex justify-between" id="wpm-clear">
              <span>Clear</span><span class="text-gray-600 text-[10px]">Del</span>
            </button>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex justify-between" id="wpm-selall">
              <span>Select <u>A</u>ll</span><span class="text-gray-600 text-[10px]">Ctrl+A</span>
            </button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex justify-between" id="wpm-find">
              <span><u>F</u>ind...</span><span class="text-gray-600 text-[10px]">Ctrl+F</span>
            </button>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex justify-between" id="wpm-replace">
              <span>R<u>e</u>place...</span><span class="text-gray-600 text-[10px]">Ctrl+H</span>
            </button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex justify-between" id="wpm-timedate">
              <span>Time/<u>D</u>ate</span><span class="text-gray-600 text-[10px]">F5</span>
            </button>
          </div>
        </div>

        <!-- View -->
        <div class="relative">
          <button type="button" class="hover:bg-[#000080] hover:text-white px-2 py-0.5" id="wp-m-view-btn"><u>V</u>iew</button>
          <div id="wp-m-view" class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[160px] z-50 text-black">
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center justify-between" id="wpm-toggle-toolbar">
              <span><u>T</u>oolbar</span><span id="chk-toolbar" class="font-bold">✓</span>
            </button>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center justify-between" id="wpm-toggle-formatbar">
              <span><u>F</u>ormat Bar</span><span id="chk-formatbar" class="font-bold">✓</span>
            </button>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center justify-between" id="wpm-toggle-ruler">
              <span><u>R</u>uler</span><span id="chk-ruler" class="font-bold">✓</span>
            </button>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center justify-between" id="wpm-toggle-statusbar">
              <span><u>S</u>tatus Bar</span><span id="chk-statusbar" class="font-bold">✓</span>
            </button>
          </div>
        </div>

        <!-- Insert -->
        <div class="relative">
          <button type="button" class="hover:bg-[#000080] hover:text-white px-2 py-0.5" id="wp-m-insert-btn"><u>I</u>nsert</button>
          <div id="wp-m-insert" class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[180px] z-50 text-black">
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white" id="wpm-insert-datetime"><u>D</u>ate and Time...</button>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white" id="wpm-insert-hr"><u>H</u>orizontal Line</button>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white" id="wpm-insert-image"><u>P</u>icture Image...</button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white" id="wpm-insert-resume"><u>S</u>kills.doc Resume</button>
          </div>
        </div>

        <!-- Format -->
        <div class="relative">
          <button type="button" class="hover:bg-[#000080] hover:text-white px-2 py-0.5" id="wp-m-format-btn">F<u>o</u>rmat</button>
          <div id="wp-m-format" class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[160px] z-50 text-black">
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white" id="wpm-format-font"><u>F</u>ont...</button>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white" id="wpm-format-bullet"><u>B</u>ullet Style</button>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white" id="wpm-format-numbered"><u>N</u>umbered Style</button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white" id="wpm-format-clear">Clear Formatting</button>
          </div>
        </div>

        <!-- Help -->
        <div class="relative">
          <button type="button" class="hover:bg-[#000080] hover:text-white px-2 py-0.5" id="wp-m-help-btn"><u>H</u>elp</button>
          <div id="wp-m-help" class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[160px] z-50 text-black">
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white" id="wpm-help-topics">Help <u>T</u>opics</button>
            <div class="border-b border-[#808080] border-t border-white my-1"></div>
            <button type="button" class="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white" id="wpm-about"><u>A</u>bout WordPad</button>
          </div>
        </div>
      </div>

      <!-- 2. Standard Toolbar -->
      <div id="wp-toolbar-std" class="flex items-center gap-1 p-1 bg-[#c0c0c0] border-b border-[#808080]">
        <button type="button" class="retro-btn !p-1 w-6 h-6 flex items-center justify-center" id="wpt-new" title="New (Ctrl+N)">📄</button>
        <button type="button" class="retro-btn !p-1 w-6 h-6 flex items-center justify-center" id="wpt-open" title="Open (Ctrl+O)">📁</button>
        <button type="button" class="retro-btn !p-1 w-6 h-6 flex items-center justify-center" id="wpt-save" title="Save (Ctrl+S)">💾</button>
        <span class="w-[1px] h-4 bg-gray-600 mx-0.5"></span>
        <button type="button" class="retro-btn !p-1 w-6 h-6 flex items-center justify-center" id="wpt-print" title="Print (Ctrl+P)">🖨️</button>
        <button type="button" class="retro-btn !p-1 w-6 h-6 flex items-center justify-center" id="wpt-find" title="Find (Ctrl+F)">🔎</button>
        <span class="w-[1px] h-4 bg-gray-600 mx-0.5"></span>
        <button type="button" class="retro-btn !p-1 w-6 h-6 flex items-center justify-center font-bold" id="wpt-cut" title="Cut (Ctrl+X)">✂️</button>
        <button type="button" class="retro-btn !p-1 w-6 h-6 flex items-center justify-center font-bold" id="wpt-copy" title="Copy (Ctrl+C)">📋</button>
        <button type="button" class="retro-btn !p-1 w-6 h-6 flex items-center justify-center font-bold" id="wpt-paste" title="Paste (Ctrl+V)">📥</button>
        <span class="w-[1px] h-4 bg-gray-600 mx-0.5"></span>
        <button type="button" class="retro-btn !p-1 w-6 h-6 flex items-center justify-center font-bold" id="wpt-undo" title="Undo (Ctrl+Z)">↩️</button>
        <button type="button" class="retro-btn !p-1 w-6 h-6 flex items-center justify-center font-bold" id="wpt-redo" title="Redo (Ctrl+Y)">↪️</button>
        <button type="button" class="retro-btn !p-1 w-6 h-6 flex items-center justify-center" id="wpt-datetime" title="Insert Date/Time (F5)">📅</button>
      </div>

      <!-- 3. Format Bar -->
      <div id="wp-toolbar-fmt" class="flex flex-wrap items-center gap-1.5 p-1 bg-[#c0c0c0] border-b border-black text-xs">
        <select id="wp-font" class="retro-select !py-0.5 !px-1 text-xs">
          <option value="Arial, sans-serif" selected>Arial</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="'Courier New', monospace">Courier New</option>
          <option value="'MS Sans Serif', sans-serif">MS Sans Serif</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Verdana, sans-serif">Verdana</option>
          <option value="'Comic Sans MS', cursive">Comic Sans</option>
        </select>
        <select id="wp-size" class="retro-select !py-0.5 !px-1 text-xs">
          <option value="1">8pt</option>
          <option value="2">10pt</option>
          <option value="3" selected>12pt</option>
          <option value="4">14pt</option>
          <option value="5">18pt</option>
          <option value="6">24pt</option>
          <option value="7">36pt</option>
        </select>
        <span class="w-[1px] h-4 bg-gray-600 mx-0.5"></span>
        <button type="button" class="retro-btn !p-1 font-bold w-6 h-6 flex items-center justify-center" id="wp-bold" title="Bold (Ctrl+B)">B</button>
        <button type="button" class="retro-btn !p-1 italic w-6 h-6 flex items-center justify-center" id="wp-italic" title="Italic (Ctrl+I)">I</button>
        <button type="button" class="retro-btn !p-1 underline w-6 h-6 flex items-center justify-center" id="wp-underline" title="Underline (Ctrl+U)">U</button>
        <button type="button" class="retro-btn !p-1 line-through w-6 h-6 flex items-center justify-center" id="wp-strike" title="Strikethrough">S</button>
        
        <!-- Text Color Dropdown -->
        <div class="relative">
          <button type="button" class="retro-btn !p-1 w-7 h-6 flex items-center justify-center gap-0.5" id="wp-color-btn" title="Text Color">
            <span class="font-bold underline text-[#000080]">A</span>
            <span class="text-[8px]">▼</span>
          </button>
          <div id="wp-color-palette" class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] p-1.5 grid grid-cols-4 gap-1 z-50">
            <button type="button" class="size-4 border border-black" style="background-color: #000000;" data-color="#000000" title="Black"></button>
            <button type="button" class="size-4 border border-black" style="background-color: #800000;" data-color="#800000" title="Maroon"></button>
            <button type="button" class="size-4 border border-black" style="background-color: #008000;" data-color="#008000" title="Green"></button>
            <button type="button" class="size-4 border border-black" style="background-color: #808000;" data-color="#808000" title="Olive"></button>
            <button type="button" class="size-4 border border-black" style="background-color: #000080;" data-color="#000080" title="Navy"></button>
            <button type="button" class="size-4 border border-black" style="background-color: #800080;" data-color="#800080" title="Purple"></button>
            <button type="button" class="size-4 border border-black" style="background-color: #008080;" data-color="#008080" title="Teal"></button>
            <button type="button" class="size-4 border border-black" style="background-color: #808080;" data-color="#808080" title="Gray"></button>
            <button type="button" class="size-4 border border-black" style="background-color: #ff0000;" data-color="#ff0000" title="Red"></button>
            <button type="button" class="size-4 border border-black" style="background-color: #00ff00;" data-color="#00ff00" title="Lime"></button>
            <button type="button" class="size-4 border border-black" style="background-color: #ffff00;" data-color="#ffff00" title="Yellow"></button>
            <button type="button" class="size-4 border border-black" style="background-color: #0000ff;" data-color="#0000ff" title="Blue"></button>
            <button type="button" class="size-4 border border-black" style="background-color: #ff00ff;" data-color="#ff00ff" title="Fuchsia"></button>
            <button type="button" class="size-4 border border-black" style="background-color: #00ffff;" data-color="#00ffff" title="Aqua"></button>
            <button type="button" class="size-4 border border-black" style="background-color: #ffffff;" data-color="#ffffff" title="White"></button>
            <button type="button" class="size-4 border border-black" style="background-color: #c0c0c0;" data-color="#c0c0c0" title="Silver"></button>
          </div>
        </div>

        <span class="w-[1px] h-4 bg-gray-600 mx-0.5"></span>
        <button type="button" class="retro-btn !p-1 w-6 h-6 flex items-center justify-center" id="wp-left" title="Align Left">⇤</button>
        <button type="button" class="retro-btn !p-1 w-6 h-6 flex items-center justify-center" id="wp-center" title="Align Center">≡</button>
        <button type="button" class="retro-btn !p-1 w-6 h-6 flex items-center justify-center" id="wp-right" title="Align Right">⇥</button>
        <button type="button" class="retro-btn !p-1 w-6 h-6 flex items-center justify-center" id="wp-justify" title="Justify">☰</button>
        <span class="w-[1px] h-4 bg-gray-600 mx-0.5"></span>
        <button type="button" class="retro-btn !p-1 w-6 h-6 flex items-center justify-center font-bold" id="wp-list" title="Bullet List">•</button>
        <button type="button" class="retro-btn !p-1 w-6 h-6 flex items-center justify-center font-bold" id="wp-numlist" title="Numbered List">1.</button>
        <button type="button" class="retro-btn !p-1 w-6 h-6 flex items-center justify-center" id="wp-outdent" title="Decrease Indent">◄</button>
        <button type="button" class="retro-btn !p-1 w-6 h-6 flex items-center justify-center" id="wp-indent" title="Increase Indent">►</button>
      </div>

      <!-- 4. Windows 95 Measurement Ruler -->
      <div id="wp-ruler" class="h-6 bg-[#d4d0c8] border-b border-black flex items-center px-4 relative overflow-hidden select-none font-mono text-[9px] text-gray-700">
        <div class="w-full flex items-center justify-between border-t border-b border-gray-400 py-0.5 relative">
          <span class="absolute left-0 text-[10px] text-black">▲</span>
          <span class="w-16 text-center border-r border-gray-400">1</span>
          <span class="w-16 text-center border-r border-gray-400">2</span>
          <span class="w-16 text-center border-r border-gray-400">3</span>
          <span class="w-16 text-center border-r border-gray-400">4</span>
          <span class="w-16 text-center border-r border-gray-400">5</span>
          <span class="w-16 text-center border-r border-gray-400">6</span>
          <span class="w-16 text-center border-r border-gray-400">7</span>
          <span class="absolute right-0 text-[10px] text-black">▲</span>
        </div>
      </div>

      <!-- 5. Paper Page Container (Workspace Desk) -->
      <div class="flex-1 bg-[#808080] p-3 sm:p-5 overflow-auto flex justify-center shadow-[inset_2px_2px_4px_#404040]">
        <!-- 8.5" x 11" Simulated Page Sheet -->
        <div
          id="wp-page-sheet"
          class="w-full max-w-[620px] bg-white border border-black/40 shadow-[4px_4px_0px_#333333] p-8 min-h-[460px] text-black font-sans text-sm leading-relaxed outline-none"
          contenteditable="true"
          spellcheck="true"
          style="padding-left: ${leftMarginPx}px; padding-right: ${rightMarginPx}px;"
        >
          ${initialContent}
        </div>
      </div>

      <!-- 6. Status Bar -->
      <div id="wp-statusbar" class="flex justify-between items-center px-2 py-0.5 bg-[#c0c0c0] border-t border-white text-[10px] text-gray-800">
        <span id="wp-status-msg">For Help, press F1</span>
        <div class="flex items-center gap-3">
          <span id="wp-doc-path">${currentPath}</span>
          <span id="wp-word-count">Words: 0</span>
          <span id="wp-char-count">Chars: 0</span>
        </div>
      </div>

      <!-- Hidden Input for Image and File Upload -->
      <input type="file" id="wp-file-input" class="hidden" accept=".txt,.html,.htm,.rtf" />
      <input type="file" id="wp-image-input" class="hidden" accept="image/*" />

      <!-- Find & Replace Floating Dialog -->
      <div id="wp-find-dialog" class="hidden absolute top-16 left-1/2 -translate-x-1/2 bg-[#c0c0c0] border-2 border-white shadow-[4px_4px_0px_#000000] p-3 z-50 w-72 text-black text-xs space-y-2">
        <div class="font-bold flex justify-between items-center pb-1 border-b border-gray-400">
          <span id="wp-find-title">Find & Replace</span>
          <button type="button" class="retro-titlebar-btn !w-4 !h-4 text-[10px]" id="wp-find-close">&#10005;</button>
        </div>
        <div class="space-y-1">
          <label class="block font-bold">Find what:</label>
          <input type="text" id="wp-find-input" class="retro-inset w-full px-1.5 py-0.5 bg-white text-xs" />
        </div>
        <div class="space-y-1" id="wp-replace-row">
          <label class="block font-bold">Replace with:</label>
          <input type="text" id="wp-replace-input" class="retro-inset w-full px-1.5 py-0.5 bg-white text-xs" />
        </div>
        <label class="flex items-center gap-1.5 text-[11px] cursor-pointer">
          <input type="checkbox" id="wp-match-case" />
          <span>Match case</span>
        </label>
        <div class="flex justify-end gap-1.5 pt-1 border-t border-gray-400">
          <button type="button" class="retro-btn !py-0.5 !px-2 font-bold" id="wp-find-next-btn">Find Next</button>
          <button type="button" class="retro-btn !py-0.5 !px-2" id="wp-replace-btn">Replace</button>
          <button type="button" class="retro-btn !py-0.5 !px-2" id="wp-replace-all-btn">Replace All</button>
        </div>
      </div>

      <!-- Date/Time Chooser Dialog -->
      <div id="wp-dt-dialog" class="hidden absolute top-20 left-1/2 -translate-x-1/2 bg-[#c0c0c0] border-2 border-white shadow-[4px_4px_0px_#000000] p-3 z-50 w-64 text-black text-xs space-y-2">
        <div class="font-bold flex justify-between items-center pb-1 border-b border-gray-400">
          <span>Date and Time</span>
          <button type="button" class="retro-titlebar-btn !w-4 !h-4 text-[10px]" id="wp-dt-close">&#10005;</button>
        </div>
        <p class="text-[11px]">Available formats:</p>
        <select id="wp-dt-select" size="5" class="retro-inset w-full p-1 bg-white text-xs">
          <!-- Populated in JS -->
        </select>
        <div class="flex justify-end gap-1.5 pt-1 border-t border-gray-400">
          <button type="button" class="retro-btn !py-0.5 !px-4 font-bold" id="wp-dt-ok">OK</button>
          <button type="button" class="retro-btn !py-0.5 !px-3" id="wp-dt-cancel">Cancel</button>
        </div>
      </div>

      <!-- VFS Open File Dialog -->
      <div id="wp-vfs-open-dialog" class="hidden absolute top-16 left-1/2 -translate-x-1/2 bg-[#c0c0c0] border-2 border-white shadow-[4px_4px_0px_#000000] p-3 z-50 w-80 text-black text-xs space-y-2">
        <div class="font-bold flex justify-between items-center pb-1 border-b border-gray-400">
          <span>Open Document</span>
          <button type="button" class="retro-titlebar-btn !w-4 !h-4 text-[10px]" id="wp-vfs-close">&#10005;</button>
        </div>
        <p class="text-[11px] font-bold">Files in C:\\My Documents\\:</p>
        <div id="wp-vfs-file-list" class="retro-inset p-1 bg-white h-32 overflow-y-auto space-y-0.5 font-mono text-[11px]"></div>
        <div class="flex justify-between items-center pt-1 border-t border-gray-400">
          <button type="button" class="retro-btn !py-0.5 !px-2" id="wp-local-browse-btn">Upload Local PC File...</button>
          <button type="button" class="retro-btn !py-0.5 !px-4" id="wp-vfs-cancel-btn">Cancel</button>
        </div>
      </div>

      <!-- About WordPad Dialog -->
      <div id="wp-about-dialog" class="hidden absolute top-20 left-1/2 -translate-x-1/2 bg-[#c0c0c0] border-2 border-white shadow-[4px_4px_0px_#000000] p-4 z-50 w-80 text-black text-xs space-y-3">
        <div class="flex items-center gap-3">
          <img src="/images/win95-icons/wordpad.png?v=95" alt="WordPad" width="36" height="36" class="size-9 shrink-0 [image-rendering:pixelated]" />
          <div>
            <div class="font-bold text-sm text-[#000080]">Microsoft WordPad 95</div>
            <div class="text-[11px] text-gray-700 font-mono">Release 2026.11 (Desktop Edition)</div>
            <div class="text-[10px] text-gray-600 font-mono">Copyright © 1995-2026 Microsoft Corp. / Piush KS</div>
          </div>
        </div>
        <div class="retro-inset p-2 bg-white text-[11px] space-y-0.5">
          <div>Physical Memory: 65,536 KB Available</div>
          <div>Rich Text Engine: HTML / RTF Compatible</div>
          <div>Storage: VFS & LocalStorage Connected</div>
        </div>
        <div class="flex justify-end pt-1">
          <button type="button" class="retro-btn !py-0.5 !px-6 font-bold" id="wp-about-ok">OK</button>
        </div>
      </div>
    </div>
  `;

  const editor = container.querySelector('#wp-page-sheet') as HTMLElement;
  const statusMsg = container.querySelector('#wp-status-msg') as HTMLElement;
  const docPathEl = container.querySelector('#wp-doc-path') as HTMLElement;
  const wordCountEl = container.querySelector('#wp-word-count') as HTMLElement;
  const charCountEl = container.querySelector('#wp-char-count') as HTMLElement;
  const colorPalette = container.querySelector('#wp-color-palette') as HTMLElement;

  // Dropdown menus
  const menuButtons = [
    { btn: '#wp-m-file-btn', menu: '#wp-m-file' },
    { btn: '#wp-m-edit-btn', menu: '#wp-m-edit' },
    { btn: '#wp-m-view-btn', menu: '#wp-m-view' },
    { btn: '#wp-m-insert-btn', menu: '#wp-m-insert' },
    { btn: '#wp-m-format-btn', menu: '#wp-m-format' },
    { btn: '#wp-m-help-btn', menu: '#wp-m-help' },
  ];

  function closeAllMenus() {
    menuButtons.forEach(m => container.querySelector(m.menu)?.classList.add('hidden'));
    colorPalette?.classList.add('hidden');
  }

  menuButtons.forEach(m => {
    const btn = container.querySelector(m.btn);
    const menu = container.querySelector(m.menu);
    btn?.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.playClick();
      const isHidden = menu?.classList.contains('hidden');
      closeAllMenus();
      if (isHidden) menu?.classList.remove('hidden');
    });
  });

  container.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('#wp-color-btn') && !target.closest('#wp-color-palette')) {
      colorPalette?.classList.add('hidden');
    }
    if (!target.closest('#wp-m-file-btn') && !target.closest('#wp-m-edit-btn') && !target.closest('#wp-m-view-btn') && !target.closest('#wp-m-insert-btn') && !target.closest('#wp-m-format-btn') && !target.closest('#wp-m-help-btn')) {
      closeAllMenus();
    }
  });

  // Word & character stats
  function updateCounters() {
    const text = editor.innerText || '';
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    wordCountEl.textContent = `Words: ${words}`;
    charCountEl.textContent = `Chars: ${chars}`;
  }
  updateCounters();

  editor.addEventListener('input', () => {
    isModified = true;
    updateCounters();
    statusMsg.textContent = 'Modified';
  });

  // Formatting helper
  const exec = (cmd: string, val = '') => {
    audio.playClick();
    document.execCommand(cmd, false, val);
    editor.focus();
    isModified = true;
    statusMsg.textContent = 'Modified';
  };

  // Format Bar buttons
  container.querySelector('#wp-bold')?.addEventListener('click', () => exec('bold'));
  container.querySelector('#wp-italic')?.addEventListener('click', () => exec('italic'));
  container.querySelector('#wp-underline')?.addEventListener('click', () => exec('underline'));
  container.querySelector('#wp-strike')?.addEventListener('click', () => exec('strikeThrough'));
  container.querySelector('#wp-left')?.addEventListener('click', () => exec('justifyLeft'));
  container.querySelector('#wp-center')?.addEventListener('click', () => exec('justifyCenter'));
  container.querySelector('#wp-right')?.addEventListener('click', () => exec('justifyRight'));
  container.querySelector('#wp-justify')?.addEventListener('click', () => exec('justifyFull'));
  container.querySelector('#wp-list')?.addEventListener('click', () => exec('insertUnorderedList'));
  container.querySelector('#wp-numlist')?.addEventListener('click', () => exec('insertOrderedList'));
  container.querySelector('#wp-outdent')?.addEventListener('click', () => exec('outdent'));
  container.querySelector('#wp-indent')?.addEventListener('click', () => exec('indent'));

  const fontSelect = container.querySelector('#wp-font') as HTMLSelectElement;
  fontSelect?.addEventListener('change', () => exec('fontName', fontSelect.value));

  const sizeSelect = container.querySelector('#wp-size') as HTMLSelectElement;
  sizeSelect?.addEventListener('change', () => exec('fontSize', sizeSelect.value));

  // Color palette toggle & select
  container.querySelector('#wp-color-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    audio.playClick();
    colorPalette?.classList.toggle('hidden');
  });

  container.querySelectorAll('#wp-color-palette button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const color = (btn as HTMLElement).getAttribute('data-color') || '#000000';
      exec('foreColor', color);
      colorPalette?.classList.add('hidden');
    });
  });

  // Standard Toolbar shortcuts
  container.querySelector('#wpt-new')?.addEventListener('click', () => doNew());
  container.querySelector('#wpt-open')?.addEventListener('click', () => openVfsDialog());
  container.querySelector('#wpt-save')?.addEventListener('click', () => doSave());
  container.querySelector('#wpt-print')?.addEventListener('click', () => doPrint());
  container.querySelector('#wpt-find')?.addEventListener('click', () => openFindDialog(false));
  container.querySelector('#wpt-cut')?.addEventListener('click', () => exec('cut'));
  container.querySelector('#wpt-copy')?.addEventListener('click', () => exec('copy'));
  container.querySelector('#wpt-paste')?.addEventListener('click', () => exec('paste'));
  container.querySelector('#wpt-undo')?.addEventListener('click', () => exec('undo'));
  container.querySelector('#wpt-redo')?.addEventListener('click', () => exec('redo'));
  container.querySelector('#wpt-datetime')?.addEventListener('click', () => openDateTimeDialog());

  // Menubar File Actions
  function doNew() {
    closeAllMenus();
    if (isModified && !confirm('Save changes to current document?')) {
      // Proceed without saving
    } else if (isModified) {
      doSave();
    }
    editor.innerHTML = '<p><br></p>';
    currentPath = 'C:\\My Documents\\Untitled.rtf';
    win.setTitle(`${getBasename(currentPath)} – WordPad`);
    docPathEl.textContent = currentPath;
    isModified = false;
    statusMsg.textContent = 'New Document created';
    updateCounters();
    audio.playClick();
  }

  function doSave() {
    closeAllMenus();
    vfs.writeFile(currentPath, editor.innerHTML, 'text/html');
    isModified = false;
    statusMsg.textContent = `${currentPath} (Saved)`;
    audio.playChord();
  }

  function doSaveAs() {
    closeAllMenus();
    const newName = prompt('Enter document file name (e.g. Resume.rtf):', getBasename(currentPath));
    if (newName && newName.trim()) {
      const cleanName = newName.trim().endsWith('.rtf') || newName.trim().endsWith('.doc') || newName.trim().endsWith('.html') || newName.trim().endsWith('.txt')
        ? newName.trim()
        : newName.trim() + '.rtf';
      currentPath = `C:\\My Documents\\${cleanName}`;
      win.setTitle(`${cleanName} – WordPad`);
      docPathEl.textContent = currentPath;
      doSave();
    }
  }

  function doPrint() {
    closeAllMenus();
    audio.playClick();
    window.print();
  }

  container.querySelector('#wpm-new')?.addEventListener('click', doNew);
  container.querySelector('#wpm-open')?.addEventListener('click', () => openVfsDialog());
  container.querySelector('#wpm-save')?.addEventListener('click', doSave);
  container.querySelector('#wpm-saveas')?.addEventListener('click', doSaveAs);
  container.querySelector('#wpm-print')?.addEventListener('click', doPrint);
  container.querySelector('#wpm-exit')?.addEventListener('click', () => {
    closeAllMenus();
    if (isModified && confirm('Save changes before exiting?')) {
      doSave();
    }
    win.close();
  });

  // Export functions
  container.querySelector('#wpm-export-html')?.addEventListener('click', () => {
    closeAllMenus();
    audio.playClick();
    const blob = new Blob([editor.innerHTML], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getBasename(currentPath).replace(/\.[^/.]+$/, '') + '.html';
    a.click();
    URL.revokeObjectURL(url);
    statusMsg.textContent = 'Exported as HTML';
  });

  container.querySelector('#wpm-export-rtf')?.addEventListener('click', () => {
    closeAllMenus();
    audio.playClick();
    const text = editor.innerText || '';
    const rtf = `{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang1033{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}}\\viewkind4\\uc1\\pard\\f0\\fs24 ${text.replace(/\n/g, '\\par\n')}\\par}`;
    const blob = new Blob([rtf], { type: 'application/rtf;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getBasename(currentPath).replace(/\.[^/.]+$/, '') + '.rtf';
    a.click();
    URL.revokeObjectURL(url);
    statusMsg.textContent = 'Exported as RTF';
  });

  container.querySelector('#wpm-export-txt')?.addEventListener('click', () => {
    closeAllMenus();
    audio.playClick();
    const text = editor.innerText || '';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getBasename(currentPath).replace(/\.[^/.]+$/, '') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
    statusMsg.textContent = 'Exported as Plain Text';
  });

  // Edit Menu actions
  container.querySelector('#wpm-undo')?.addEventListener('click', () => { closeAllMenus(); exec('undo'); });
  container.querySelector('#wpm-redo')?.addEventListener('click', () => { closeAllMenus(); exec('redo'); });
  container.querySelector('#wpm-cut')?.addEventListener('click', () => { closeAllMenus(); exec('cut'); });
  container.querySelector('#wpm-copy')?.addEventListener('click', () => { closeAllMenus(); exec('copy'); });
  container.querySelector('#wpm-paste')?.addEventListener('click', () => { closeAllMenus(); exec('paste'); });
  container.querySelector('#wpm-clear')?.addEventListener('click', () => { closeAllMenus(); exec('delete'); });
  container.querySelector('#wpm-selall')?.addEventListener('click', () => { closeAllMenus(); exec('selectAll'); });
  container.querySelector('#wpm-find')?.addEventListener('click', () => { closeAllMenus(); openFindDialog(false); });
  container.querySelector('#wpm-replace')?.addEventListener('click', () => { closeAllMenus(); openFindDialog(true); });
  container.querySelector('#wpm-timedate')?.addEventListener('click', () => { closeAllMenus(); openDateTimeDialog(); });

  // View Menu toggles
  const toolbarStd = container.querySelector('#wp-toolbar-std') as HTMLElement;
  const toolbarFmt = container.querySelector('#wp-toolbar-fmt') as HTMLElement;
  const rulerEl = container.querySelector('#wp-ruler') as HTMLElement;
  const statusbarEl = container.querySelector('#wp-statusbar') as HTMLElement;

  container.querySelector('#wpm-toggle-toolbar')?.addEventListener('click', () => {
    closeAllMenus();
    toolbarStd?.classList.toggle('hidden');
    const chk = container.querySelector('#chk-toolbar');
    if (chk) chk.textContent = toolbarStd.classList.contains('hidden') ? '' : '✓';
  });
  container.querySelector('#wpm-toggle-formatbar')?.addEventListener('click', () => {
    closeAllMenus();
    toolbarFmt?.classList.toggle('hidden');
    const chk = container.querySelector('#chk-formatbar');
    if (chk) chk.textContent = toolbarFmt.classList.contains('hidden') ? '' : '✓';
  });
  container.querySelector('#wpm-toggle-ruler')?.addEventListener('click', () => {
    closeAllMenus();
    rulerEl?.classList.toggle('hidden');
    const chk = container.querySelector('#chk-ruler');
    if (chk) chk.textContent = rulerEl.classList.contains('hidden') ? '' : '✓';
  });
  container.querySelector('#wpm-toggle-statusbar')?.addEventListener('click', () => {
    closeAllMenus();
    statusbarEl?.classList.toggle('hidden');
    const chk = container.querySelector('#chk-statusbar');
    if (chk) chk.textContent = statusbarEl.classList.contains('hidden') ? '' : '✓';
  });

  // Insert Menu actions
  container.querySelector('#wpm-insert-datetime')?.addEventListener('click', () => { closeAllMenus(); openDateTimeDialog(); });
  container.querySelector('#wpm-insert-hr')?.addEventListener('click', () => {
    closeAllMenus();
    exec('insertHorizontalRule');
  });

  const imgInput = container.querySelector('#wp-image-input') as HTMLInputElement;
  container.querySelector('#wpm-insert-image')?.addEventListener('click', () => {
    closeAllMenus();
    imgInput?.click();
  });
  imgInput?.addEventListener('change', () => {
    const file = imgInput.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        exec('insertImage', src);
      };
      reader.readAsDataURL(file);
    }
  });

  container.querySelector('#wpm-insert-resume')?.addEventListener('click', () => {
    closeAllMenus();
    if (confirm('Replace current document with Piush KS Technical Resume (Skills.doc)?')) {
      editor.innerHTML = initialContent;
      currentPath = 'C:\\My Documents\\Skills.doc';
      win.setTitle(`${getBasename(currentPath)} – WordPad`);
      docPathEl.textContent = currentPath;
      updateCounters();
      statusMsg.textContent = 'Skills.doc loaded';
    }
  });

  // Format Menu actions
  container.querySelector('#wpm-format-font')?.addEventListener('click', () => {
    closeAllMenus();
    fontSelect.focus();
  });
  container.querySelector('#wpm-format-bullet')?.addEventListener('click', () => { closeAllMenus(); exec('insertUnorderedList'); });
  container.querySelector('#wpm-format-numbered')?.addEventListener('click', () => { closeAllMenus(); exec('insertOrderedList'); });
  container.querySelector('#wpm-format-clear')?.addEventListener('click', () => { closeAllMenus(); exec('removeFormat'); });

  // Help Menu actions
  container.querySelector('#wpm-help-topics')?.addEventListener('click', () => {
    closeAllMenus();
    alert('WordPad Help:\nUse the formatting toolbar to style text, bold, italic, colors, and lists.\nSave your files to VFS C:\\My Documents or export to RTF/HTML.');
  });
  const aboutDialog = container.querySelector('#wp-about-dialog') as HTMLElement;
  container.querySelector('#wpm-about')?.addEventListener('click', () => {
    closeAllMenus();
    audio.playClick();
    aboutDialog?.classList.remove('hidden');
  });
  container.querySelector('#wp-about-ok')?.addEventListener('click', () => {
    aboutDialog?.classList.add('hidden');
    audio.playClick();
  });

  // Find & Replace Modal
  const findDialog = container.querySelector('#wp-find-dialog') as HTMLElement;
  const findTitle = container.querySelector('#wp-find-title') as HTMLElement;
  const findInput = container.querySelector('#wp-find-input') as HTMLInputElement;
  const replaceInput = container.querySelector('#wp-replace-input') as HTMLInputElement;
  const replaceRow = container.querySelector('#wp-replace-row') as HTMLElement;
  const replaceBtn = container.querySelector('#wp-replace-btn') as HTMLElement;
  const replaceAllBtn = container.querySelector('#wp-replace-all-btn') as HTMLElement;
  const matchCaseBox = container.querySelector('#wp-match-case') as HTMLInputElement;

  function openFindDialog(isReplace = false) {
    audio.playClick();
    findDialog.classList.remove('hidden');
    findTitle.textContent = isReplace ? 'Replace' : 'Find';
    replaceRow.style.display = isReplace ? 'block' : 'none';
    replaceBtn.style.display = isReplace ? 'inline-block' : 'none';
    replaceAllBtn.style.display = isReplace ? 'inline-block' : 'none';
    findInput.focus();
  }

  container.querySelector('#wp-find-close')?.addEventListener('click', () => {
    findDialog.classList.add('hidden');
    audio.playClick();
  });

  container.querySelector('#wp-find-next-btn')?.addEventListener('click', () => {
    audio.playClick();
    const query = findInput.value;
    if (!query) return;
    const matchCase = matchCaseBox.checked;
    const winSel = window.getSelection();
    if (!winSel) return;

    // Search using window.find
    const found = (window as unknown as { find: (q: string, caseSensitive: boolean) => boolean }).find(query, matchCase);
    if (!found) {
      audio.playChord();
      statusMsg.textContent = `Search string "${query}" not found`;
    } else {
      statusMsg.textContent = `Found: "${query}"`;
    }
  });

  container.querySelector('#wp-replace-btn')?.addEventListener('click', () => {
    audio.playClick();
    const query = findInput.value;
    const rep = replaceInput.value;
    if (!query) return;
    const sel = window.getSelection();
    if (sel && sel.toString().toLowerCase() === query.toLowerCase()) {
      exec('insertText', rep);
      statusMsg.textContent = '1 occurrence replaced';
    } else {
      (window as unknown as { find: (q: string, caseSensitive: boolean) => boolean }).find(query, matchCaseBox.checked);
      const sel2 = window.getSelection();
      if (sel2 && sel2.toString().toLowerCase() === query.toLowerCase()) {
        exec('insertText', rep);
        statusMsg.textContent = '1 occurrence replaced';
      }
    }
  });

  container.querySelector('#wp-replace-all-btn')?.addEventListener('click', () => {
    audio.playClick();
    const query = findInput.value;
    const rep = replaceInput.value;
    if (!query) return;
    const html = editor.innerHTML;
    const flags = matchCaseBox.checked ? 'g' : 'gi';
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    const count = (html.match(regex) || []).length;
    editor.innerHTML = html.replace(regex, rep);
    isModified = true;
    updateCounters();
    statusMsg.textContent = `Replaced ${count} occurrence(s)`;
    audio.playDing();
  });

  // Date and Time Dialog
  const dtDialog = container.querySelector('#wp-dt-dialog') as HTMLElement;
  const dtSelect = container.querySelector('#wp-dt-select') as HTMLSelectElement;

  function openDateTimeDialog() {
    audio.playClick();
    dtDialog.classList.remove('hidden');
    dtSelect.innerHTML = '';
    const now = new Date();
    const formats = [
      now.toLocaleDateString('en-US'),
      now.toLocaleDateString('en-GB'),
      now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
      now.toLocaleTimeString('en-US'),
      now.toLocaleTimeString('en-US', { hour12: false }),
    ];
    formats.forEach((f, i) => {
      const opt = document.createElement('option');
      opt.value = f;
      opt.textContent = f;
      if (i === 0) opt.selected = true;
      dtSelect.appendChild(opt);
    });
  }

  container.querySelector('#wp-dt-close')?.addEventListener('click', () => {
    dtDialog.classList.add('hidden');
    audio.playClick();
  });
  container.querySelector('#wp-dt-cancel')?.addEventListener('click', () => {
    dtDialog.classList.add('hidden');
    audio.playClick();
  });
  container.querySelector('#wp-dt-ok')?.addEventListener('click', () => {
    dtDialog.classList.add('hidden');
    if (dtSelect.value) {
      exec('insertText', dtSelect.value);
    }
  });

  // VFS Open Dialog
  const vfsDialog = container.querySelector('#wp-vfs-open-dialog') as HTMLElement;
  const vfsList = container.querySelector('#wp-vfs-file-list') as HTMLElement;

  function openVfsDialog() {
    closeAllMenus();
    audio.playClick();
    vfsDialog.classList.remove('hidden');
    vfsList.innerHTML = '';

    const items = vfs.listDirectory('C:\\My Documents');
    if (items.length === 0) {
      vfsList.innerHTML = '<div class="text-gray-500 p-2">Folder is empty</div>';
    } else {
      items.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'flex items-center gap-2 p-1 hover:bg-[#000080] hover:text-white cursor-pointer';
        row.innerHTML = `
          <span>${item.isFolder ? '📁' : '📄'}</span>
          <span class="flex-1 truncate">${item.name}</span>
          <span class="text-[10px] text-gray-500">${item.size} B</span>
        `;
        row.addEventListener('click', () => {
          vfsList.querySelectorAll('div').forEach(r => r.classList.remove('bg-[#000080]', 'text-white'));
          row.classList.add('bg-[#000080]', 'text-white');
        });
        row.addEventListener('dblclick', () => {
          audio.playClick();
          if (!item.isFolder) {
            const content = vfs.readFile(item.path);
            if (content !== null) {
              editor.innerHTML = content;
              currentPath = item.path;
              win.setTitle(`${item.name} – WordPad`);
              docPathEl.textContent = currentPath;
              isModified = false;
              updateCounters();
              statusMsg.textContent = `Opened ${item.name}`;
              vfsDialog.classList.add('hidden');
            }
          }
        });
        vfsList.appendChild(row);
      });
    }
  }

  container.querySelector('#wp-vfs-close')?.addEventListener('click', () => {
    vfsDialog.classList.add('hidden');
    audio.playClick();
  });
  container.querySelector('#wp-vfs-cancel-btn')?.addEventListener('click', () => {
    vfsDialog.classList.add('hidden');
    audio.playClick();
  });

  const fileInput = container.querySelector('#wp-file-input') as HTMLInputElement;
  container.querySelector('#wp-local-browse-btn')?.addEventListener('click', () => {
    vfsDialog.classList.add('hidden');
    fileInput?.click();
  });

  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        editor.innerHTML = file.name.endsWith('.html') || file.name.endsWith('.htm') ? text : `<pre>${text}</pre>`;
        currentPath = `C:\\My Documents\\${file.name}`;
        win.setTitle(`${file.name} – WordPad`);
        docPathEl.textContent = currentPath;
        isModified = false;
        updateCounters();
        statusMsg.textContent = `Imported ${file.name}`;
      };
      reader.readAsText(file);
    }
  });

  // Global keybindings inside WordPad
  editor.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        doSave();
      } else if (e.key === 'o' || e.key === 'O') {
        e.preventDefault();
        openVfsDialog();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        doNew();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        doPrint();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        openFindDialog(false);
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        openFindDialog(true);
      }
    } else if (e.key === 'F5') {
      e.preventDefault();
      openDateTimeDialog();
    } else if (e.key === 'Escape') {
      closeAllMenus();
      findDialog.classList.add('hidden');
      dtDialog.classList.add('hidden');
      vfsDialog.classList.add('hidden');
      aboutDialog.classList.add('hidden');
    }
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

