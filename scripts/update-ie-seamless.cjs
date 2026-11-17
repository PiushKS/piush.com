const fs = require('fs');
const path = require('path');

const ieFile = path.join(__dirname, '../src/lib/win95/apps/internetExplorer.ts');
let code = fs.readFileSync(ieFile, 'utf8');

// Replace the toolbar HTML emojis with authentic 16x16 pixel-art icons
const oldToolbarHtml = `      <!-- Windows 95 Standard 3D Toolbar -->
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
        <button id="ie-tb-ext" class="retro-btn !py-1 !px-2 flex items-center gap-1 text-[11px] font-bold text-blue-900" title="Open current URL in a new browser tab">
          <span>↗</span>
          <span class="hidden md:inline">New Tab</span>
        </button>

        <!-- Animated Spinning Windows 95 / IE Earth Globe -->
        <div class="ml-auto flex items-center pl-1">
          <div
            id="ie-globe-spinner"
            class="w-7 h-7 bg-[#000080] border-2 border-white shadow-[inset_1px_1px_0px_#000000,1px_1px_0px_#ffffff] flex items-center justify-center cursor-pointer relative overflow-hidden group"
            title="Microsoft Internet Explorer - Click to visit piush.com"
          >
            <!-- Earth Globe SVG with Longitude/Latitude lines -->
            <svg id="ie-globe-svg" class="w-5 h-5 text-white transition-transform duration-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10" stroke="#00ffff" fill="#000080" />
              <line x1="2" y1="12" x2="22" y2="12" stroke="#ffffff" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#ffffff" />
            </svg>
            <div id="ie-globe-orbit" class="hidden absolute inset-0 rounded-full border border-dashed border-[#ffff00] animate-spin"></div>
          </div>
        </div>
      </div>`;

const newToolbarHtml = `      <!-- Windows 95 Standard 3D Toolbar with Authentic Pixel-Art Icons -->
      <div class="flex items-center gap-1 p-1 bg-[#c0c0c0] border-b border-[#808080] text-xs relative z-20">
        <button id="ie-tb-back" class="retro-btn !py-1 !px-2 flex items-center gap-1.5 font-bold text-[11px]" title="Back (Alt+Left)">
          <img src="/images/win95-icons/back-16.png?v=1995.2" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
          <span class="hidden sm:inline">Back</span>
        </button>
        <button id="ie-tb-forward" class="retro-btn !py-1 !px-2 flex items-center gap-1.5 font-bold text-[11px]" title="Forward (Alt+Right)">
          <img src="/images/win95-icons/forward-16.png?v=1995.2" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
          <span class="hidden sm:inline">Forward</span>
        </button>
        <button id="ie-tb-stop" class="retro-btn !py-1 !px-2 flex items-center gap-1.5 text-[11px]" title="Stop (Esc)">
          <img src="/images/win95-icons/stop-16.png?v=1995.2" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
          <span class="hidden sm:inline">Stop</span>
        </button>
        <button id="ie-tb-refresh" class="retro-btn !py-1 !px-2 flex items-center gap-1.5 text-[11px]" title="Refresh (F5)">
          <img src="/images/win95-icons/refresh-16.png?v=1995.2" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
          <span class="hidden sm:inline">Refresh</span>
        </button>
        <button id="ie-tb-home" class="retro-btn !py-1 !px-2 flex items-center gap-1.5 text-[11px]" title="Home (Alt+Home)">
          <img src="/images/win95-icons/computer-16.png?v=1995.2" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
          <span class="hidden sm:inline">Home</span>
        </button>

        <div class="h-5 w-[1px] bg-[#808080] border-r border-white mx-0.5"></div>

        <button id="ie-tb-search" class="retro-btn !py-1 !px-2 flex items-center gap-1.5 text-[11px]" title="Search the Web">
          <img src="/images/win95-icons/find-16.png?v=1995.2" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
          <span class="hidden md:inline">Search</span>
        </button>
        <button id="ie-tb-favorites" class="retro-btn !py-1 !px-2 flex items-center gap-1.5 text-[11px]" title="Favorites">
          <img src="/images/win95-icons/favorites-16.png?v=1995.2" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
          <span class="hidden md:inline">Favorites</span>
        </button>
        <button id="ie-tb-print" class="retro-btn !py-1 !px-2 flex items-center gap-1.5 text-[11px]" title="Print">
          <img src="/images/win95-icons/print-16.png?v=1995.2" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
          <span class="hidden md:inline">Print</span>
        </button>
        <button id="ie-tb-font" class="retro-btn !py-1 !px-2 flex items-center gap-1.5 text-[11px] font-bold" title="Cycle Font Size">
          <img src="/images/win95-icons/font-16.png?v=1995.2" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
          <span class="hidden md:inline">Font</span>
        </button>
        <button id="ie-tb-ext" class="retro-btn !py-1 !px-2 flex items-center gap-1.5 text-[11px] font-bold text-blue-900" title="Open current URL in a new browser tab">
          <img src="/images/win95-icons/document-16.png?v=1995.2" alt="" width="16" height="16" class="size-4 shrink-0 [image-rendering:pixelated]" />
          <span class="hidden md:inline">New Tab ↗</span>
        </button>

        <!-- Animated Windows 95 / IE Earth Globe -->
        <div class="ml-auto flex items-center pl-1">
          <div
            id="ie-globe-spinner"
            class="w-7 h-7 bg-[#000080] border-2 border-white shadow-[inset_1px_1px_0px_#000000,1px_1px_0px_#ffffff] flex items-center justify-center cursor-pointer relative overflow-hidden group"
            title="Microsoft Internet Explorer - Click to visit piush.com"
          >
            <img id="ie-globe-img" src="/images/win95-icons/globe.png?v=1995.2" width="20" height="20" class="size-5 shrink-0 [image-rendering:pixelated] transition-transform duration-700" alt="Internet Explorer" />
            <div id="ie-globe-orbit" class="hidden absolute inset-0 rounded-full border border-dashed border-[#ffff00] animate-spin"></div>
          </div>
        </div>
      </div>`;

if (code.includes(oldToolbarHtml)) {
  code = code.replace(oldToolbarHtml, newToolbarHtml);
  console.log('Successfully replaced toolbar HTML with authentic pixel-art icons!');
} else {
  console.error('Could not find oldToolbarHtml');
}

fs.writeFileSync(ieFile, code, 'utf8');
