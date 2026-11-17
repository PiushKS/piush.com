const fs = require('fs');
const path = require('path');

const headerPath = path.join(__dirname, '..', 'src', 'components', 'sections', 'Header.astro');
let content = fs.readFileSync(headerPath, 'utf8');

// 1. Replace Titlebar Section (Lines ~37 to ~62)
const oldTitlebarPart = `  <!-- Retro Window Titlebar (Matching Reference Mockups) -->
  <div class="retro-titlebar">
    <div class="flex items-center gap-2 overflow-visible min-w-0 flex-1 relative">
      <!-- Titlebar Window Menu Trigger Button -->
      <button
        type="button"
        id="retro-system-menu-btn"
        class="flex items-center gap-1.5 px-1 py-0.5 rounded-none text-white hover:bg-[#003d8f] focus:outline-none focus:ring-1 focus:ring-white cursor-pointer select-none max-w-full"
        aria-label="Window Menu and Website Options"
        aria-haspopup="true"
        aria-expanded="false"
        title="Window Menu (Website Options)"
      >
        <!-- Retro Computer Icon -->
        <img
          src="/images/win95-icons/computer-16.png?v=1995"
          alt="PC"
          width="16"
          height="16"
          class="size-4 shrink-0 [image-rendering:pixelated]"
        />
        <span class="truncate font-mono font-bold text-xs sm:text-sm tracking-wide text-white">
          Piush KS – Mobile & Cloud Engineer
        </span>
        <span class="text-[9px] text-white/80 shrink-0">▼</span>
      </button>`;

const newTitlebarPart = `  <!-- Retro Window Titlebar (Matching Windows 95 Standard Shell) -->
  <div class="retro-titlebar" id="retro-main-titlebar">
    <div class="flex items-center gap-2 overflow-visible min-w-0 flex-1 relative">
      <!-- Top-Left System Window Menu Trigger Button (16x16 icon) -->
      <button
        type="button"
        id="retro-system-menu-btn"
        class="p-0.5 rounded-none text-white hover:bg-[#003d8f] focus:outline-none focus:ring-1 focus:ring-white cursor-pointer select-none shrink-0"
        aria-label="System Window Menu"
        aria-haspopup="true"
        aria-expanded="false"
        title="System Menu (Click for options, double-click to close)"
      >
        <img
          src="/images/win95-icons/computer-16.png?v=1995"
          alt="System Menu"
          width="16"
          height="16"
          class="size-4 shrink-0 [image-rendering:pixelated]"
        />
      </button>

      <!-- Clean Titlebar Text (Without Modern Dropdown Arrows) -->
      <span class="win95-title-text truncate font-bold text-xs sm:text-sm tracking-wide text-white select-none">
        Piush KS – Mobile & Cloud Engineer
      </span>`;

if (content.includes(oldTitlebarPart)) {
  content = content.replace(oldTitlebarPart, newTitlebarPart);
  console.log('Titlebar replaced successfully!');
} else {
  console.error('Could not find oldTitlebarPart in Header.astro');
}

// 2. Replace System Menu Dropdown (Lines ~64 to ~162)
const oldSysDropdownPart = `      <!-- System Window Menu Dropdown (Top-Left) -->
      <div id="retro-system-menu-dropdown" class="retro-menu-dropdown hidden" role="menu" style="left: 0; top: calc(100% + 4px);">
        <button type="button" class="retro-menu-item" data-action="minimize-desktop" role="menuitem">
          <span class="flex items-center gap-1.5">
            <span class="text-sm">🗕</span>
            <span>Minimize to Desktop</span>
          </span>
          <span class="retro-menu-shortcut">Win+M</span>
        </button>
        <button type="button" class="retro-menu-item" data-action="toggle-fullscreen" role="menuitem">
          <span class="flex items-center gap-1.5">
            <span class="text-sm">⛶</span>
            <span id="sys-fs-label">Maximize / Fullscreen</span>
          </span>
          <span class="retro-menu-shortcut">F11</span>
        </button>
        <button type="button" class="retro-menu-item" data-action="scroll-top" role="menuitem">
          <span class="flex items-center gap-1.5">
            <span>⬆</span>
            <span>Scroll to Top</span>
          </span>
          <span class="retro-menu-shortcut">Home</span>
        </button>
        <button type="button" class="retro-menu-item" data-action="scroll-bottom" role="menuitem">
          <span class="flex items-center gap-1.5">
            <span>⬇</span>
            <span>Scroll to Bottom</span>
          </span>
          <span class="retro-menu-shortcut">End</span>
        </button>
        <button type="button" class="retro-menu-item" data-action="reload-page" role="menuitem">
          <span class="flex items-center gap-1.5">
            <span>🔄</span>
            <span>Reload Window</span>
          </span>
          <span class="retro-menu-shortcut">Ctrl+R</span>
        </button>
        <button type="button" class="retro-menu-item" data-action="restart-boot" role="menuitem">
          <span class="flex items-center gap-1.5">
            <span>⚡</span>
            <span>Restart OS (Boot Animation)</span>
          </span>
          <span class="retro-menu-shortcut">Boot</span>
        </button>

        <div class="retro-menu-separator"></div>

        <button type="button" class="retro-menu-item" data-action="toggle-sound" role="menuitem">
          <span class="flex items-center gap-1.5">
            <span>🔊</span>
            <span id="sys-sound-label">[✓] Retro Sound FX</span>
          </span>
        </button>
        <button type="button" class="retro-menu-item" data-action="toggle-crt" role="menuitem">
          <span class="flex items-center gap-1.5">
            <span>📺</span>
            <span id="sys-crt-label">[ ] CRT Scanlines</span>
          </span>
        </button>
        <button type="button" class="retro-menu-item" data-action="toggle-mono" role="menuitem">
          <span class="flex items-center gap-1.5">
            <span>🔤</span>
            <span id="sys-mono-label">[ ] Monospace Mode</span>
          </span>
        </button>

        <div class="retro-menu-separator"></div>

        <button type="button" class="retro-menu-item" data-action="copy-url" role="menuitem">
          <span class="flex items-center gap-1.5">
            <span>📋</span>
            <span>Copy Page URL</span>
          </span>
          <span class="retro-menu-shortcut">Ctrl+C</span>
        </button>
        <button type="button" class="retro-menu-item" data-action="print-page" role="menuitem">
          <span class="flex items-center gap-1.5">
            <span>🖨️</span>
            <span>Print / Save PDF</span>
          </span>
          <span class="retro-menu-shortcut">Ctrl+P</span>
        </button>
        <a href="https://github.com/piushks/piush.com" target="_blank" rel="noopener noreferrer" class="retro-menu-item" role="menuitem">
          <span class="flex items-center gap-1.5">
            <span>⭐</span>
            <span>View Source on GitHub</span>
          </span>
          <span class="retro-menu-shortcut">↗</span>
        </a>

        <div class="retro-menu-separator"></div>

        <button type="button" class="retro-menu-item" data-action="open-about" role="menuitem">
          <span class="flex items-center gap-1.5">
            <span>ℹ️</span>
            <span>About Piush.com...</span>
          </span>
        </button>
      </div>`;

const newSysDropdownPart = `      <!-- System Window Menu Dropdown (Authentic Windows 95 Layout) -->
      <div id="retro-system-menu-dropdown" class="retro-menu-dropdown hidden" role="menu" style="left: 0; top: calc(100% + 4px);">
        <button type="button" class="retro-menu-item opacity-50 cursor-not-allowed" id="sys-menu-restore" data-action="toggle-fullscreen" role="menuitem" disabled>
          <span class="flex items-center gap-2">
            <span class="text-xs">⧉</span>
            <span>Restore</span>
          </span>
          <span class="retro-menu-shortcut">Alt+F5</span>
        </button>
        <button type="button" class="retro-menu-item opacity-50 cursor-not-allowed" id="sys-menu-move" role="menuitem" disabled>
          <span class="flex items-center gap-2">
            <span class="text-xs">✥</span>
            <span>Move</span>
          </span>
          <span class="retro-menu-shortcut">Alt+F7</span>
        </button>
        <button type="button" class="retro-menu-item opacity-50 cursor-not-allowed" id="sys-menu-size" role="menuitem" disabled>
          <span class="flex items-center gap-2">
            <span class="text-xs">↔</span>
            <span>Size</span>
          </span>
          <span class="retro-menu-shortcut">Alt+F8</span>
        </button>
        <button type="button" class="retro-menu-item" data-action="minimize-desktop" role="menuitem">
          <span class="flex items-center gap-2">
            <span class="text-xs font-bold">_</span>
            <span>Minimize</span>
          </span>
          <span class="retro-menu-shortcut">Win+M</span>
        </button>
        <button type="button" class="retro-menu-item" id="sys-menu-maximize" data-action="toggle-fullscreen" role="menuitem">
          <span class="flex items-center gap-2">
            <span class="text-xs font-bold">▫</span>
            <span id="sys-fs-label">Maximize</span>
          </span>
          <span class="retro-menu-shortcut">F11</span>
        </button>

        <div class="retro-menu-separator"></div>

        <button type="button" class="retro-menu-item font-bold" data-action="close-window" role="menuitem">
          <span class="flex items-center gap-2">
            <span class="text-xs font-bold">✕</span>
            <span>Close</span>
          </span>
          <span class="retro-menu-shortcut font-bold">Alt+F4</span>
        </button>

        <div class="retro-menu-separator"></div>

        <button type="button" class="retro-menu-item" data-action="open-about" role="menuitem">
          <span class="flex items-center gap-2">
            <img src="/images/win95-icons/control-panel-16.png?v=1995" alt="" width="16" height="16" class="size-3.5 shrink-0 [image-rendering:pixelated]" />
            <span>Properties (About)...</span>
          </span>
        </button>
        <button type="button" class="retro-menu-item" data-action="toggle-sound" role="menuitem">
          <span class="flex items-center gap-2">
            <img src="/images/win95-icons/volume-16.png?v=1995" alt="" width="16" height="16" class="size-3.5 shrink-0 [image-rendering:pixelated]" />
            <span id="sys-sound-label">[✓] Sound FX</span>
          </span>
        </button>
        <button type="button" class="retro-menu-item" data-action="toggle-crt" role="menuitem">
          <span class="flex items-center gap-2">
            <img src="/images/win95-icons/dos-16.png?v=1995" alt="" width="16" height="16" class="size-3.5 shrink-0 [image-rendering:pixelated]" />
            <span id="sys-crt-label">[ ] CRT Scanlines</span>
          </span>
        </button>
        <button type="button" class="retro-menu-item" data-action="restart-boot" role="menuitem">
          <span class="flex items-center gap-2">
            <img src="/images/win95-icons/computer-16.png?v=1995" alt="" width="16" height="16" class="size-3.5 shrink-0 [image-rendering:pixelated]" />
            <span>Restart OS</span>
          </span>
          <span class="retro-menu-shortcut">Boot</span>
        </button>
      </div>`;

if (content.includes(oldSysDropdownPart)) {
  content = content.replace(oldSysDropdownPart, newSysDropdownPart);
  console.log('System Menu Dropdown replaced successfully!');
} else {
  console.error('Could not find oldSysDropdownPart in Header.astro');
}

// 3. Replace Menubar Clock / Tray Section (Lines ~350 to ~370)
const oldClockPart = `    <!-- Right Controls: Retro Clock & Desktop Social Links -->
    <div class="hidden md:flex items-center gap-2">
      <div class="retro-inset px-2.5 py-0.5 bg-white text-xs font-mono font-bold text-black flex items-center gap-1.5 shadow-[inset_1px_1px_0px_#000000]">
        <span class="inline-block size-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
        <span id="retro-live-clock">--:--:--</span>
      </div>`;

const newClockPart = `    <!-- Right Controls: Authentic Windows 95 System Notification Tray (SysTray) & Links -->
    <div class="hidden md:flex items-center gap-2">
      <!-- Windows 95 Notification Tray -->
      <div
        id="retro-home-tray"
        class="retro-inset px-2 py-0.5 bg-[#c0c0c0] text-xs font-mono font-bold text-black flex items-center gap-1.5 cursor-pointer hover:bg-[#d0d0d0] select-none"
        title="Double-click to open Date/Time Properties"
      >
        <!-- Tray Volume Icon -->
        <button
          type="button"
          id="retro-tray-volume-btn"
          class="flex items-center justify-center p-0.5 hover:bg-black/10 focus:outline-none"
          title="Sound Effects (Click to toggle)"
        >
          <img
            src="/images/win95-icons/volume-16.png?v=1995"
            alt="Volume"
            width="16"
            height="16"
            class="size-3.5 shrink-0 [image-rendering:pixelated]"
          />
        </button>

        <!-- Tray Clock Time (Authentic Windows 95 12-hour AM/PM) -->
        <span id="retro-live-clock" class="text-[11px] font-sans font-bold text-black min-w-[55px] text-right">--:-- --</span>
      </div>`;

if (content.includes(oldClockPart)) {
  content = content.replace(oldClockPart, newClockPart);
  console.log('Clock replaced successfully!');
} else {
  console.error('Could not find oldClockPart in Header.astro');
}

// 4. Insert Windows 95 Toolbar right after </nav>
const toolbarHtml = `
  <!-- Windows 95 Main Application Toolbar -->
  <div class="win95-home-toolbar bg-[#c0c0c0] border-b border-[#808080] shadow-[inset_0_1px_0_#ffffff] px-1 py-1 flex items-center gap-0.5 overflow-x-auto select-none text-xs">
    <!-- Back Button -->
    <button type="button" class="win95-tool-btn" id="tb-home-back" title="Back (Alt+Left Arrow)">
      <img src="/images/win95-icons/back-16.png?v=1995" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
      <span class="hidden sm:inline">Back</span>
    </button>
    <!-- Forward Button -->
    <button type="button" class="win95-tool-btn" id="tb-home-fwd" title="Forward (Alt+Right Arrow)">
      <img src="/images/win95-icons/forward-16.png?v=1995" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
      <span class="hidden sm:inline">Forward</span>
    </button>
    <!-- Up / Home (Folder Up) -->
    <button type="button" class="win95-tool-btn" id="tb-home-up" title="Up to Top (Home)">
      <img src="/images/win95-icons/folder-open-16.png?v=1995" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
      <span class="hidden sm:inline">Up</span>
    </button>

    <div class="win95-tool-separator"></div>

    <!-- Cut / Copy Page URL -->
    <button type="button" class="win95-tool-btn" id="tb-home-copy" title="Copy URL to Clipboard">
      <img src="/images/win95-icons/copy-16.png?v=1995" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
      <span class="hidden md:inline">Copy URL</span>
    </button>
    <!-- Print -->
    <button type="button" class="win95-tool-btn" id="tb-home-print" title="Print Page (Ctrl+P)">
      <img src="/images/win95-icons/print-16.png?v=1995" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
      <span class="hidden md:inline">Print</span>
    </button>
    <!-- Reload / Refresh -->
    <button type="button" class="win95-tool-btn" id="tb-home-refresh" title="Refresh Page (F5)">
      <img src="/images/win95-icons/refresh-16.png?v=1995" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
      <span class="hidden sm:inline">Refresh</span>
    </button>

    <div class="win95-tool-separator"></div>

    <!-- Sound FX Toggle -->
    <button type="button" class="win95-tool-btn" id="tb-home-sound" title="Toggle Retro Sound Effects">
      <img src="/images/win95-icons/volume-16.png?v=1995" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
      <span class="hidden lg:inline" id="tb-sound-text">Sound</span>
    </button>
    <!-- CRT Monitor Toggle -->
    <button type="button" class="win95-tool-btn" id="tb-home-crt" title="Toggle CRT Scanline Monitor Filter">
      <img src="/images/win95-icons/dos-16.png?v=1995" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
      <span class="hidden lg:inline" id="tb-crt-text">CRT</span>
    </button>
    <!-- System Properties (About) -->
    <button type="button" class="win95-tool-btn" id="tb-home-props" title="System Properties – About Piush.com">
      <img src="/images/win95-icons/control-panel-16.png?v=1995" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
      <span class="hidden sm:inline">Properties</span>
    </button>

    <!-- Address Bar Band on Desktop -->
    <div class="hidden xl:flex items-center gap-1.5 ml-auto pl-2 flex-1 max-w-sm">
      <span class="text-black font-sans text-xs font-bold shrink-0">Address</span>
      <div class="retro-inset bg-white px-2 py-0.5 flex-1 flex items-center justify-between text-xs font-mono text-black truncate shadow-[inset_1px_1px_0px_#000000]">
        <span class="truncate">https://piush.com/</span>
        <span class="text-[9px] text-gray-500 pl-1 shrink-0">▼</span>
      </div>
    </div>
  </div>
`;

if (!content.includes('win95-home-toolbar')) {
  content = content.replace('</nav>', `</nav>\n${toolbarHtml}`);
  console.log('Toolbar inserted successfully!');
}

// 5. Insert Date/Time Properties Dialog right before </header>
const datetimeDialogHtml = `
  <!-- Windows 95 Date/Time Properties Dialog -->
  <div
    id="retro-datetime-dialog"
    class="retro-dialog-overlay hidden"
    role="dialog"
    aria-modal="true"
    aria-labelledby="retro-datetime-title"
  >
    <div class="retro-dialog-window !max-w-md w-full" onclick="event.stopPropagation()">
      <!-- Dialog Titlebar -->
      <div class="retro-titlebar !h-8 !min-h-[32px] !px-2">
        <div class="flex items-center gap-2 overflow-hidden">
          <img
            src="/images/win95-icons/clock-16.png?v=1995"
            alt="Clock"
            width="16"
            height="16"
            class="shrink-0 size-4 [image-rendering:pixelated]"
          />
          <span id="retro-datetime-title" class="font-mono font-bold text-xs text-white truncate">
            Date/Time Properties
          </span>
        </div>
        <button
          type="button"
          class="retro-titlebar-btn !w-[22px] !h-[22px] text-[11px]"
          id="retro-datetime-close-btn"
          aria-label="Close dialog"
          title="Close"
        >
          &#10005;
        </button>
      </div>

      <!-- Tabbed Body -->
      <div class="px-3 pt-2.5 pb-3 bg-[#c0c0c0] text-black text-xs font-sans">
        <div class="flex">
          <div class="retro-dialog-tab">Date & Time</div>
        </div>

        <div class="retro-dialog-panel space-y-3 p-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Left: Calendar Date -->
            <div class="space-y-1.5 border border-[#808080] p-2 bg-[#f4f4f4] shadow-[inset_1px_1px_0_#ffffff]">
              <div class="font-bold text-[#000080] text-xs border-b border-gray-300 pb-1 flex justify-between items-center">
                <span id="dt-month-year">November 2026</span>
                <span class="text-[10px] text-gray-500 font-mono">Date</span>
              </div>
              <!-- Calendar Grid -->
              <div class="grid grid-cols-7 gap-0.5 text-center text-[10px] font-mono pt-1" id="dt-calendar-grid">
                <!-- Day names & numbers inserted dynamically -->
              </div>
            </div>

            <!-- Right: Analog & Digital Clock -->
            <div class="space-y-2 border border-[#808080] p-2 bg-[#f4f4f4] shadow-[inset_1px_1px_0_#ffffff] flex flex-col items-center justify-center">
              <div class="w-full font-bold text-[#000080] text-xs border-b border-gray-300 pb-1 text-left">
                Time
              </div>
              <!-- Round Analog Clock SVG -->
              <div class="relative size-24 flex items-center justify-center bg-white rounded-full border-2 border-black shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] my-1">
                <svg id="dt-analog-clock" viewBox="0 0 100 100" class="size-22">
                  <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#808080" stroke-width="2" />
                  <!-- Clock hour ticks -->
                  <line x1="50" y1="8" x2="50" y2="14" stroke="#000000" stroke-width="3" />
                  <line x1="50" y1="86" x2="50" y2="92" stroke="#000000" stroke-width="3" />
                  <line x1="8" y1="50" x2="14" y2="50" stroke="#000000" stroke-width="3" />
                  <line x1="86" y1="50" x2="92" y2="50" stroke="#000000" stroke-width="3" />
                  <!-- Clock Hands -->
                  <line id="dt-clock-hour" x1="50" y1="50" x2="50" y2="26" stroke="#000000" stroke-width="4" stroke-linecap="round" />
                  <line id="dt-clock-min" x1="50" y1="50" x2="50" y2="18" stroke="#000080" stroke-width="2.5" stroke-linecap="round" />
                  <line id="dt-clock-sec" x1="50" y1="55" x2="50" y2="14" stroke="#cc0000" stroke-width="1.5" stroke-linecap="round" />
                  <circle cx="50" cy="50" r="3" fill="#000000" />
                </svg>
              </div>
              <!-- Digital Readout Box -->
              <div class="retro-inset px-3 py-1 bg-white font-mono font-bold text-xs text-black shadow-[inset_1px_1px_0px_#000000]" id="dt-digital-time">
                --:--:--
              </div>
            </div>
          </div>

          <!-- Timezone line -->
          <div class="border border-[#808080] p-1.5 bg-[#e8ecef] text-[11px] text-gray-700 font-sans flex items-center gap-1.5">
            <span class="text-sm">🌐</span>
            <span id="dt-timezone-str">Local System Time</span>
          </div>

          <!-- Bottom Dialog Buttons -->
          <div class="flex justify-end gap-2 pt-2 border-t border-[#808080]">
            <button type="button" id="dt-dialog-ok" class="retro-btn !py-1 !px-4 text-xs font-bold font-sans">
              OK
            </button>
            <button type="button" id="dt-dialog-cancel" class="retro-btn !py-1 !px-4 text-xs font-sans">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

if (!content.includes('retro-datetime-dialog')) {
  content = content.replace('  <!-- System Properties Dialog -->', `${datetimeDialogHtml}\n  <!-- System Properties Dialog -->`);
  console.log('Date/Time dialog inserted successfully!');
}

// 6. Update scripts inside Header.astro
const newScriptLogic = `
    // Wire Toolbar buttons
    document.getElementById('tb-home-back')?.addEventListener('click', () => {
      playRetroClick();
      window.history.back();
    });
    document.getElementById('tb-home-fwd')?.addEventListener('click', () => {
      playRetroClick();
      window.history.forward();
    });
    document.getElementById('tb-home-up')?.addEventListener('click', () => {
      playRetroClick();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.getElementById('tb-home-copy')?.addEventListener('click', () => {
      playRetroClick();
      navigator.clipboard.writeText(window.location.href).then(() => {
        showRetroToast('Page URL Copied to Clipboard!');
      }).catch(() => {
        showRetroToast(window.location.href);
      });
    });
    document.getElementById('tb-home-print')?.addEventListener('click', () => {
      playRetroClick();
      window.print();
    });
    document.getElementById('tb-home-refresh')?.addEventListener('click', () => {
      playRetroClick();
      window.location.reload();
    });
    document.getElementById('tb-home-sound')?.addEventListener('click', () => {
      const next = !isSoundEnabled();
      localStorage.setItem('retro_sound_enabled', String(next));
      if (next) playRetroChime();
      syncPreferenceLabels();
      showRetroToast(next ? 'Sound FX: Enabled' : 'Sound FX: Muted');
    });
    document.getElementById('tb-home-crt')?.addEventListener('click', () => {
      playRetroClick();
      const current = localStorage.getItem('retro_crt_enabled') === 'true';
      localStorage.setItem('retro_crt_enabled', String(!current));
      syncPreferenceLabels();
      showRetroToast(!current ? 'CRT Scanlines: ON' : 'CRT Scanlines: OFF');
    });
    document.getElementById('tb-home-props')?.addEventListener('click', () => {
      playRetroClick();
      openAboutDialog();
    });

    // Wire Tray Volume button
    document.getElementById('retro-tray-volume-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const next = !isSoundEnabled();
      localStorage.setItem('retro_sound_enabled', String(next));
      if (next) playRetroChime();
      syncPreferenceLabels();
      showRetroToast(next ? 'Sound FX: Enabled' : 'Sound FX: Muted');
    });

    // Wire Date/Time Properties Dialog
    const dtDialog = document.getElementById('retro-datetime-dialog');
    const dtCloseBtn = document.getElementById('retro-datetime-close-btn');
    const dtOkBtn = document.getElementById('dt-dialog-ok');
    const dtCancelBtn = document.getElementById('dt-dialog-cancel');
    const homeTray = document.getElementById('retro-home-tray');

    function openDateTimeDialog() {
      playRetroClick();
      closeAllMenus();
      if (dtDialog) {
        dtDialog.classList.remove('hidden');
        renderCalendar();
        updateDateTimeClock();
      }
    }

    function closeDateTimeDialog() {
      playRetroClick();
      if (dtDialog) {
        dtDialog.classList.add('hidden');
      }
    }

    homeTray?.addEventListener('click', openDateTimeDialog);
    dtCloseBtn?.addEventListener('click', closeDateTimeDialog);
    dtOkBtn?.addEventListener('click', closeDateTimeDialog);
    dtCancelBtn?.addEventListener('click', closeDateTimeDialog);
    dtDialog?.addEventListener('click', (e) => {
      if (e.target === dtDialog) closeDateTimeDialog();
    });

    // Render Windows 95 Calendar
    function renderCalendar() {
      const grid = document.getElementById('dt-calendar-grid');
      const monthYear = document.getElementById('dt-month-year');
      if (!grid || !monthYear) return;

      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const today = now.getDate();

      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      monthYear.textContent = \`\${monthNames[month]} \${year}\`;

      const firstDay = new Date(year, month, 1).getDay();
      const totalDays = new Date(year, month + 1, 0).getDate();

      let html = '<div class="font-bold text-[#808080]">S</div><div class="font-bold text-[#808080]">M</div><div class="font-bold text-[#808080]">T</div><div class="font-bold text-[#808080]">W</div><div class="font-bold text-[#808080]">T</div><div class="font-bold text-[#808080]">F</div><div class="font-bold text-[#808080]">S</div>';

      for (let i = 0; i < firstDay; i++) {
        html += '<div class="py-0.5 text-gray-300"></div>';
      }

      for (let day = 1; day <= totalDays; day++) {
        const isToday = day === today;
        html += \`<div class="py-0.5 \${isToday ? 'bg-[#000080] text-white font-bold' : 'text-black'\}">\${day}</div>\`;
      }

      grid.innerHTML = html;

      const tzEl = document.getElementById('dt-timezone-str');
      if (tzEl) {
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          tzEl.textContent = \`Time Zone: \${tz} (\${now.toLocaleDateString('en-US', { weekday: 'long' })})\`;
        } catch (_) {}
      }
    }

    function updateDateTimeClock() {
      const now = new Date();
      const sec = now.getSeconds();
      const min = now.getMinutes();
      const hr = now.getHours();

      // Analog clock hands
      const secHand = document.getElementById('dt-clock-sec');
      const minHand = document.getElementById('dt-clock-min');
      const hourHand = document.getElementById('dt-clock-hour');

      if (secHand) {
        const secDeg = sec * 6;
        secHand.setAttribute('transform', \`rotate(\${secDeg} 50 50)\`);
      }
      if (minHand) {
        const minDeg = (min + sec / 60) * 6;
        minHand.setAttribute('transform', \`rotate(\${minDeg} 50 50)\`);
      }
      if (hourHand) {
        const hrDeg = ((hr % 12) + min / 60) * 30;
        hourHand.setAttribute('transform', \`rotate(\${hrDeg} 50 50)\`);
      }

      const digEl = document.getElementById('dt-digital-time');
      if (digEl) {
        digEl.textContent = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
    }

    // Double-click icon to close window (Windows 95 standard)
    let lastIconClick = 0;
    sysBtn?.addEventListener('click', (e) => {
      const now = Date.now();
      if (now - lastIconClick < 350) {
        // Double-click detected
        e.preventDefault();
        e.stopPropagation();
        closeAllMenus();
        (window as unknown as { minimizeToDesktop?: () => void }).minimizeToDesktop?.();
        return;
      }
      lastIconClick = now;
    });

    // Double-click titlebar to maximize / restore
    document.getElementById('retro-main-titlebar')?.addEventListener('dblclick', (e) => {
      if ((e.target as HTMLElement).closest('.retro-titlebar-btn') || (e.target as HTMLElement).closest('#retro-system-menu-btn')) {
        return;
      }
      toggleFullscreen();
    });

    // Alt+Space to toggle System Menu
    window.addEventListener('keydown', (e) => {
      if (e.altKey && e.code === 'Space') {
        e.preventDefault();
        toggleSysMenu(e);
      }
    });
`;

// Replace updateLiveClock function
const oldUpdateLiveClock = `    // 8. Live Retro Clock in Menubar Right Tray
    function updateLiveClock() {
      const clockEl = document.getElementById('retro-live-clock');
      if (clockEl) {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' });
      }
    }
    updateLiveClock();
    const clockInterval = setInterval(updateLiveClock, 1000);
    document.addEventListener('astro:before-swap', () => clearInterval(clockInterval), { once: true });`;

const newUpdateLiveClock = `    ${newScriptLogic}

    // 8. Live Windows 95 Clock in Menubar Right Tray
    function updateLiveClock() {
      const clockEl = document.getElementById('retro-live-clock');
      const trayEl = document.getElementById('retro-home-tray');
      if (clockEl) {
        const now = new Date();
        // Authentic Windows 95 12-hour AM/PM format without seconds
        clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' });
        if (trayEl) {
          trayEl.title = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }
      }
      if (dtDialog && !dtDialog.classList.contains('hidden')) {
        updateDateTimeClock();
      }
    }
    updateLiveClock();
    const clockInterval = setInterval(updateLiveClock, 1000);
    document.addEventListener('astro:before-swap', () => clearInterval(clockInterval), { once: true });`;

if (content.includes(oldUpdateLiveClock)) {
  content = content.replace(oldUpdateLiveClock, newUpdateLiveClock);
  console.log('Clock script updated successfully!');
} else {
  console.error('Could not find oldUpdateLiveClock in Header.astro');
}

// Add close-window action handler in switch (action)
const oldSwitchClose = `          case 'minimize-desktop':
            playRetroClick();
            (window as unknown as { minimizeToDesktop?: () => void }).minimizeToDesktop?.();
            break;`;

const newSwitchClose = `          case 'close-window':
            playRetroClick();
            (window as unknown as { minimizeToDesktop?: () => void }).minimizeToDesktop?.();
            break;
          case 'minimize-desktop':
            playRetroClick();
            (window as unknown as { minimizeToDesktop?: () => void }).minimizeToDesktop?.();
            break;`;

if (content.includes(oldSwitchClose)) {
  content = content.replace(oldSwitchClose, newSwitchClose);
  console.log('Close-window action wired!');
}

fs.writeFileSync(headerPath, content, 'utf8');
console.log('Header.astro completely updated!');
