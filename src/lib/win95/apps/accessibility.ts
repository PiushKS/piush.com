// Piush 95 - Accessibility Collection
// Accessibility Options, Magnifier, On-Screen Keyboard, High Contrast

import { audio } from '../audio';
import type { Win95Window } from '../windowManager';

/**
 * 1. Accessibility Options
 */
export function renderAccessibilityOptions(container: HTMLElement, win: Win95Window) {
  win.setTitle('Accessibility Properties');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-3">
      <!-- Tabs -->
      <div class="flex gap-1 border-b border-black">
        <button class="retro-btn !py-0.5 !px-3 font-bold !bg-[#c0c0c0]">Keyboard</button>
        <button class="retro-btn !py-0.5 !px-3 !bg-[#a0a0a0]">Sound</button>
        <button class="retro-btn !py-0.5 !px-3 !bg-[#a0a0a0]">Display</button>
      </div>

      <!-- Keyboard tab contents -->
      <div class="space-y-3 text-xs">
        <div class="p-2 border border-black/40 space-y-1">
          <div class="font-bold">StickyKeys</div>
          <p class="text-[11px] text-gray-700">Use StickyKeys if you want to use SHIFT, CTRL, or ALT by pressing one key at a time.</p>
          <label class="flex items-center gap-2 pt-1 font-bold">
            <input type="checkbox" id="acc-sticky" />
            <span>Use StickyKeys</span>
          </label>
        </div>

        <div class="p-2 border border-black/40 space-y-1">
          <div class="font-bold">FilterKeys</div>
          <p class="text-[11px] text-gray-700">Use FilterKeys if you want Windows to ignore brief or repeated keystrokes.</p>
          <label class="flex items-center gap-2 pt-1 font-bold">
            <input type="checkbox" id="acc-filter" />
            <span>Use FilterKeys</span>
          </label>
        </div>

        <div class="p-2 border border-black/40 space-y-1">
          <div class="font-bold">ToggleKeys</div>
          <p class="text-[11px] text-gray-700">Plays tones when pressing CAPS LOCK, NUM LOCK, and SCROLL LOCK.</p>
          <label class="flex items-center gap-2 pt-1 font-bold">
            <input type="checkbox" id="acc-toggle" checked />
            <span>Use ToggleKeys</span>
          </label>
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-white">
        <button id="acc-ok" class="retro-btn !py-0.5 !px-4 font-bold text-xs">OK</button>
        <button id="acc-cancel" class="retro-btn !py-0.5 !px-3 text-xs">Cancel</button>
      </div>
    </div>
  `;

  container.querySelector('#acc-ok')?.addEventListener('click', () => {
    audio.playDing();
    win.close();
  });
  container.querySelector('#acc-cancel')?.addEventListener('click', () => win.close());
}

/**
 * 2. Magnifier
 */
export function renderMagnifier(container: HTMLElement, win: Win95Window) {
  win.setTitle('Magnifier 95 - 2x Zoom');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-2 space-y-2">
      <div class="flex items-center justify-between text-xs px-1">
        <span>Magnification level:</span>
        <select id="mag-level" class="retro-inset px-2 py-0.5 bg-white text-xs">
          <option value="2">2x</option>
          <option value="4">4x</option>
          <option value="8">8x</option>
        </select>
      </div>

      <div class="retro-inset p-2 bg-black flex-1 flex flex-col items-center justify-center border-2 border-white relative overflow-hidden">
        <canvas id="mag-canvas" width="280" height="180" class="block bg-black"></canvas>
        <div class="absolute bottom-1 right-2 text-[10px] text-green-400">Target: Active Desktop</div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('#mag-canvas') as HTMLCanvasElement;
  const ctx = canvas?.getContext('2d');
  const levelSelect = container.querySelector('#mag-level') as HTMLSelectElement;

  function draw() {
    if (!ctx || !canvas) return;
    ctx.fillStyle = '#001a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 1;
    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    const zoom = levelSelect ? levelSelect.value : '2';
    ctx.fillText(`[ ${zoom}x ZOOM LENS ]`, canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText('Tracking Mouse Coordinates', canvas.width / 2, canvas.height / 2 + 15);
  }

  levelSelect?.addEventListener('change', () => {
    win.setTitle(`Magnifier 95 - ${levelSelect.value}x Zoom`);
    draw();
    audio.playClick();
  });

  draw();
}

/**
 * 3. On-Screen Keyboard
 */
export function renderOnScreenKeyboard(container: HTMLElement, win: Win95Window) {
  win.setTitle('On-Screen Keyboard');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-2 space-y-2">
      <!-- Output Scratchpad -->
      <div class="space-y-1">
        <div class="flex justify-between items-center text-[10px]">
          <span class="font-bold">Text Buffer:</span>
          <button id="osk-copy-btn" class="retro-btn !py-0 !px-2 text-[10px]">Copy Text</button>
        </div>
        <input type="text" id="osk-output" class="retro-inset w-full px-2 py-1 bg-white text-black font-mono text-xs" placeholder="Click keys below to type..." />
      </div>

      <!-- Keyboard Keys Grid -->
      <div class="flex-1 flex flex-col justify-center gap-1 p-1 bg-[#d0d0d0] border border-black/40">
        <!-- Row 1 -->
        <div class="flex gap-1 justify-center">
          ${['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='].map(k => `
            <button class="osk-k retro-btn !p-1 size-6 sm:size-7 text-[11px] font-bold" data-k="${k}">${k}</button>
          `).join('')}
          <button class="osk-k retro-btn !p-1 w-12 text-[10px] font-bold" data-k="BS">Bksp</button>
        </div>
        <!-- Row 2 -->
        <div class="flex gap-1 justify-center">
          <button class="osk-k retro-btn !p-1 w-10 text-[10px] font-bold" data-k="TAB">Tab</button>
          ${['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(k => `
            <button class="osk-k retro-btn !p-1 size-6 sm:size-7 text-[11px] font-bold" data-k="${k}">${k}</button>
          `).join('')}
        </div>
        <!-- Row 3 -->
        <div class="flex gap-1 justify-center">
          <button class="osk-k retro-btn !p-1 w-12 text-[10px] font-bold" data-k="CAPS">Caps</button>
          ${['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map(k => `
            <button class="osk-k retro-btn !p-1 size-6 sm:size-7 text-[11px] font-bold" data-k="${k}">${k}</button>
          `).join('')}
          <button class="osk-k retro-btn !p-1 w-12 text-[10px] font-bold" data-k="ENTER">Enter</button>
        </div>
        <!-- Row 4 -->
        <div class="flex gap-1 justify-center">
          <button class="osk-k retro-btn !p-1 w-14 text-[10px] font-bold" data-k="SHIFT">Shift</button>
          ${['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.'].map(k => `
            <button class="osk-k retro-btn !p-1 size-6 sm:size-7 text-[11px] font-bold" data-k="${k}">${k}</button>
          `).join('')}
          <button class="osk-k retro-btn !p-1 w-14 text-[10px] font-bold" data-k="SPACE">Space</button>
        </div>
      </div>
    </div>
  `;

  const out = container.querySelector('#osk-output') as HTMLInputElement;
  const copyBtn = container.querySelector('#osk-copy-btn');
  let isCaps = false;

  container.querySelectorAll('.osk-k').forEach((btn) => {
    btn.addEventListener('click', () => {
      const k = btn.getAttribute('data-k');
      audio.playClick();
      if (!k) return;

      if (k === 'BS') {
        out.value = out.value.slice(0, -1);
      } else if (k === 'SPACE') {
        out.value += ' ';
      } else if (k === 'ENTER') {
        out.value += '\n';
      } else if (k === 'TAB') {
        out.value += '  ';
      } else if (k === 'CAPS') {
        isCaps = !isCaps;
      } else if (k === 'SHIFT') {
        isCaps = !isCaps;
      } else {
        out.value += isCaps ? k.toUpperCase() : k.toLowerCase();
      }
    });
  });

  copyBtn?.addEventListener('click', () => {
    navigator.clipboard?.writeText(out.value);
    audio.playDing();
    alert('Copied to clipboard!');
  });
}

/**
 * 4. High Contrast Scheme Toggle
 */
export function toggleHighContrast() {
  const isHc = document.body.classList.toggle('win95-high-contrast');
  audio.playChord();
  if (isHc) {
    document.body.style.filter = 'contrast(180%) invert(10%)';
  } else {
    document.body.style.filter = 'none';
  }
}
