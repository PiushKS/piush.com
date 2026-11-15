// Piush 95 - Multimedia Collection
// Media Player, CD Player, Sound Recorder, Volume Control, Image Viewer, MIDI Player

import { audio } from '../audio';
import { vfs } from '../fs';
import type { Win95Window } from '../windowManager';

/**
 * 1. Media Player
 */
export function renderMediaPlayer(container: HTMLElement, win: Win95Window) {
  win.setTitle('Media Player - (Stopped)');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <!-- Menubar -->
      <div class="flex gap-4 px-2 py-0.5 text-xs bg-[#c0c0c0] border-b border-black">
        <span class="hover:underline cursor-pointer" id="mp-menu-file">File</span>
        <span class="hover:underline cursor-pointer" id="mp-menu-edit">Edit</span>
        <span class="hover:underline cursor-pointer" id="mp-menu-device">Device</span>
        <span class="hover:underline cursor-pointer" id="mp-menu-scale">Scale</span>
        <span class="hover:underline cursor-pointer" id="mp-menu-help">Help</span>
      </div>

      <!-- Video / Visualization Surface -->
      <div class="flex-1 bg-black p-2 flex items-center justify-center relative min-h-[160px] overflow-hidden">
        <canvas id="mp-visualizer" width="360" height="180" class="block w-full h-full max-h-[220px]"></canvas>
        <div id="mp-title-overlay" class="absolute top-2 left-2 text-green-400 text-xs font-bold drop-shadow-[0_1px_2px_black]">
          ▶ Track: CANYON.MID (Windows 95 Classic)
        </div>
      </div>

      <!-- Controls & Seekbar -->
      <div class="p-2 space-y-2 bg-[#c0c0c0] border-t border-white">
        <!-- Progress slider -->
        <div class="flex items-center gap-2">
          <span id="mp-current-time" class="text-[11px] text-gray-800 w-12">00:00</span>
          <input type="range" id="mp-seekbar" min="0" max="100" value="0" class="flex-1 cursor-pointer" />
          <span id="mp-total-time" class="text-[11px] text-gray-800 w-12 text-right">02:30</span>
        </div>

        <!-- Player Buttons -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <button id="mp-play-btn" class="retro-btn !p-1.5 size-7 flex items-center justify-center" title="Play">▶</button>
            <button id="mp-pause-btn" class="retro-btn !p-1.5 size-7 flex items-center justify-center" title="Pause">❚❚</button>
            <button id="mp-stop-btn" class="retro-btn !p-1.5 size-7 flex items-center justify-center" title="Stop">◼</button>
            <div class="w-px h-5 bg-black/40 mx-1"></div>
            <button id="mp-prev-btn" class="retro-btn !p-1.5 size-7 flex items-center justify-center" title="Previous">|◀</button>
            <button id="mp-next-btn" class="retro-btn !p-1.5 size-7 flex items-center justify-center" title="Next">▶|</button>
          </div>

          <!-- Open file -->
          <div class="flex items-center gap-1.5">
            <label class="retro-btn !py-0.5 !px-2 text-xs cursor-pointer flex items-center gap-1">
              <span>📂 Open File...</span>
              <input type="file" id="mp-file-input" accept="audio/*,video/*" class="hidden" />
            </label>
          </div>
        </div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('#mp-visualizer') as HTMLCanvasElement;
  const ctx = canvas?.getContext('2d');
  const playBtn = container.querySelector('#mp-play-btn');
  const pauseBtn = container.querySelector('#mp-pause-btn');
  const stopBtn = container.querySelector('#mp-stop-btn');
  const seekbar = container.querySelector('#mp-seekbar') as HTMLInputElement;
  const curTimeEl = container.querySelector('#mp-current-time') as HTMLElement;
  const fileInput = container.querySelector('#mp-file-input') as HTMLInputElement;
  const overlay = container.querySelector('#mp-title-overlay') as HTMLElement;

  let isPlaying = false;
  let progress = 0;
  let animId = 0;

  function renderVisualizer() {
    if (!ctx || !canvas) return;
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isPlaying) {
      // Oscilloscope wave bars
      const bars = 24;
      const barW = canvas.width / bars;
      for (let i = 0; i < bars; i++) {
        const height = Math.abs(Math.sin((Date.now() / 200) + (i * 0.4))) * (canvas.height * 0.7);
        ctx.fillStyle = i % 2 === 0 ? '#00ff66' : '#00ccff';
        ctx.fillRect(i * barW + 2, canvas.height - height, barW - 4, height);
      }
    } else {
      ctx.fillStyle = '#444455';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('[ Media Player Stopped ]', canvas.width / 2, canvas.height / 2);
    }
  }

  function tick() {
    if (isPlaying) {
      progress += 0.2;
      if (progress > 100) progress = 0;
      if (seekbar) seekbar.value = String(progress);
      const totalSec = 150;
      const curSec = Math.floor((progress / 100) * totalSec);
      const m = String(Math.floor(curSec / 60)).padStart(2, '0');
      const s = String(curSec % 60).padStart(2, '0');
      if (curTimeEl) curTimeEl.textContent = `${m}:${s}`;
    }
    renderVisualizer();
    animId = requestAnimationFrame(tick);
  }

  playBtn?.addEventListener('click', () => {
    isPlaying = true;
    win.setTitle('Media Player - Playing (CANYON.MID)');
    audio.playClick();
  });

  pauseBtn?.addEventListener('click', () => {
    isPlaying = false;
    win.setTitle('Media Player - (Paused)');
    audio.playClick();
  });

  stopBtn?.addEventListener('click', () => {
    isPlaying = false;
    progress = 0;
    if (seekbar) seekbar.value = '0';
    if (curTimeEl) curTimeEl.textContent = '00:00';
    win.setTitle('Media Player - (Stopped)');
    audio.playClick();
  });

  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (file) {
      if (overlay) overlay.textContent = `▶ File: ${file.name}`;
      win.setTitle(`Media Player - ${file.name}`);
      isPlaying = true;
      audio.playChord();
    }
  });

  tick();

  win.element.addEventListener('DOMNodeRemovedFromDocument', () => {
    cancelAnimationFrame(animId);
  });
}

/**
 * 2. CD Player
 */
export function renderCDPlayer(container: HTMLElement, win: Win95Window) {
  win.setTitle('CD Player - [01] 00:00');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <!-- Title & Track Display -->
      <div class="p-3 bg-[#c0c0c0] space-y-2">
        <div class="retro-inset p-3 bg-black text-green-400 flex items-center justify-between border-2 border-white">
          <div class="flex items-center gap-3">
            <!-- Animated CD Icon -->
            <div id="cd-spinner" class="size-12 rounded-full border-4 border-gray-600 bg-gradient-to-tr from-gray-700 via-gray-400 to-gray-800 flex items-center justify-center text-black text-xs font-bold shadow-inner">
              💿
            </div>
            <div>
              <div class="text-[10px] text-gray-400 uppercase">Artist: Piush KS</div>
              <div class="text-xs font-bold text-yellow-300">Album: Greatest Code 1995</div>
              <div class="text-base font-bold tracking-widest mt-0.5"><span id="cd-track-num">[01]</span> <span id="cd-timer">00:00</span></div>
            </div>
          </div>
          <div class="text-right text-[10px] text-gray-400">
            <div>TOTAL: 12 TRACKS</div>
            <div>TIME: 54:12</div>
          </div>
        </div>

        <!-- Track List Selector -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-bold">Track:</label>
          <select id="cd-track-select" class="retro-inset flex-1 px-2 py-0.5 bg-white text-black text-xs font-mono">
            <option value="1">01. Boot Sequence (Intro)</option>
            <option value="2">02. Silicon Dreams</option>
            <option value="3">03. 56K Modem Handshake</option>
            <option value="4">04. Canyon.mid Remaster</option>
            <option value="5">05. Cyberpunk 1995</option>
            <option value="6">06. Memory Leaks Anthem</option>
            <option value="7">07. Cloud Architecture Funk</option>
            <option value="8">08. Swift & Kotlin Groove</option>
            <option value="9">09. Dial-Up Euphoria</option>
            <option value="10">10. 550 Quiz Master</option>
            <option value="11">11. Defrag Rhythm</option>
            <option value="12">12. Shutdown Wave (Outro)</option>
          </select>
        </div>

        <!-- CD Controls -->
        <div class="flex items-center justify-center gap-1.5 pt-1">
          <button id="cd-play-btn" class="retro-btn !px-3 !py-1 font-bold text-xs">▶ Play</button>
          <button id="cd-pause-btn" class="retro-btn !px-3 !py-1 font-bold text-xs">❚❚ Pause</button>
          <button id="cd-stop-btn" class="retro-btn !px-3 !py-1 font-bold text-xs">◼ Stop</button>
          <button id="cd-prev-btn" class="retro-btn !px-2.5 !py-1 font-bold text-xs">|◀</button>
          <button id="cd-next-btn" class="retro-btn !px-2.5 !py-1 font-bold text-xs">▶|</button>
          <button id="cd-eject-btn" class="retro-btn !px-2.5 !py-1 font-bold text-xs">⏏ Eject</button>
        </div>
      </div>
    </div>
  `;

  const playBtn = container.querySelector('#cd-play-btn');
  const pauseBtn = container.querySelector('#cd-pause-btn');
  const stopBtn = container.querySelector('#cd-stop-btn');
  const prevBtn = container.querySelector('#cd-prev-btn');
  const nextBtn = container.querySelector('#cd-next-btn');
  const ejectBtn = container.querySelector('#cd-eject-btn');
  const trackSelect = container.querySelector('#cd-track-select') as HTMLSelectElement;
  const trackNumEl = container.querySelector('#cd-track-num') as HTMLElement;
  const timerEl = container.querySelector('#cd-timer') as HTMLElement;
  const spinner = container.querySelector('#cd-spinner') as HTMLElement;

  let isPlaying = false;
  let seconds = 0;
  let intervalId = 0;
  let rotation = 0;

  function updateDisplay() {
    const curTrack = trackSelect ? trackSelect.value.padStart(2, '0') : '01';
    if (trackNumEl) trackNumEl.textContent = `[${curTrack}]`;
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    if (timerEl) timerEl.textContent = `${m}:${s}`;
    win.setTitle(`CD Player - [${curTrack}] ${m}:${s}`);

    if (isPlaying && spinner) {
      rotation = (rotation + 15) % 360;
      spinner.style.transform = `rotate(${rotation}deg)`;
    }
  }

  playBtn?.addEventListener('click', () => {
    isPlaying = true;
    audio.playClick();
  });

  pauseBtn?.addEventListener('click', () => {
    isPlaying = false;
    audio.playClick();
  });

  stopBtn?.addEventListener('click', () => {
    isPlaying = false;
    seconds = 0;
    updateDisplay();
    audio.playClick();
  });

  prevBtn?.addEventListener('click', () => {
    if (trackSelect && trackSelect.selectedIndex > 0) {
      trackSelect.selectedIndex--;
      seconds = 0;
      updateDisplay();
      audio.playClick();
    }
  });

  nextBtn?.addEventListener('click', () => {
    if (trackSelect && trackSelect.selectedIndex < trackSelect.options.length - 1) {
      trackSelect.selectedIndex++;
      seconds = 0;
      updateDisplay();
      audio.playClick();
    }
  });

  ejectBtn?.addEventListener('click', () => {
    isPlaying = false;
    seconds = 0;
    updateDisplay();
    audio.playDing();
    alert('CD Drive tray opened.');
  });

  trackSelect?.addEventListener('change', () => {
    seconds = 0;
    updateDisplay();
  });

  intervalId = window.setInterval(() => {
    if (isPlaying) {
      seconds++;
      updateDisplay();
    }
  }, 1000);

  win.element.addEventListener('DOMNodeRemovedFromDocument', () => {
    clearInterval(intervalId);
  });
}

/**
 * 3. Sound Recorder
 */
export function renderSoundRecorder(container: HTMLElement, win: Win95Window) {
  win.setTitle('Sound Recorder - Sound');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <!-- Menubar -->
      <div class="flex gap-4 px-2 py-0.5 text-xs bg-[#c0c0c0] border-b border-black">
        <span class="hover:underline cursor-pointer" id="sr-menu-file">File</span>
        <span class="hover:underline cursor-pointer" id="sr-menu-edit">Edit</span>
        <span class="hover:underline cursor-pointer" id="sr-menu-effects">Effects</span>
        <span class="hover:underline cursor-pointer" id="sr-menu-help">Help</span>
      </div>

      <!-- Waveform Visualizer Display -->
      <div class="p-3 bg-[#c0c0c0] space-y-3">
        <div class="retro-inset p-2 bg-black flex items-center justify-center border-2 border-white">
          <canvas id="sr-waveform" width="300" height="70" class="block bg-[#001100]"></canvas>
        </div>

        <!-- Position & Length -->
        <div class="flex items-center justify-between text-xs px-1">
          <span>Position: <strong id="sr-pos">0.00 sec.</strong></span>
          <span>Length: <strong id="sr-len">0.00 sec.</strong></span>
        </div>

        <!-- Control Buttons -->
        <div class="flex items-center justify-center gap-1.5 pt-1">
          <button id="sr-seek-start" class="retro-btn !p-1 size-7 flex items-center justify-center text-xs" title="Seek to Start">|◀</button>
          <button id="sr-seek-end" class="retro-btn !p-1 size-7 flex items-center justify-center text-xs" title="Seek to End">▶|</button>
          <button id="sr-play-btn" class="retro-btn !p-1 size-7 flex items-center justify-center text-xs" title="Play">▶</button>
          <button id="sr-stop-btn" class="retro-btn !p-1 size-7 flex items-center justify-center text-xs" title="Stop">◼</button>
          <button id="sr-rec-btn" class="retro-btn !p-1 size-7 flex items-center justify-center text-xs text-red-600 font-bold" title="Record">●</button>
        </div>

        <!-- Effects Panel -->
        <div class="flex items-center justify-center gap-2 pt-1 border-t border-black/30">
          <button id="sr-fx-faster" class="retro-btn !py-0.5 !px-2 text-[10px]">Speed +100%</button>
          <button id="sr-fx-slower" class="retro-btn !py-0.5 !px-2 text-[10px]">Slow -50%</button>
          <button id="sr-fx-reverse" class="retro-btn !py-0.5 !px-2 text-[10px]">Reverse</button>
          <button id="sr-save-btn" class="retro-btn !py-0.5 !px-2 text-[10px] font-bold">Save WAV</button>
        </div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('#sr-waveform') as HTMLCanvasElement;
  const ctx = canvas?.getContext('2d');
  const posEl = container.querySelector('#sr-pos') as HTMLElement;
  const lenEl = container.querySelector('#sr-len') as HTMLElement;
  const recBtn = container.querySelector('#sr-rec-btn');
  const playBtn = container.querySelector('#sr-play-btn');
  const stopBtn = container.querySelector('#sr-stop-btn');
  const saveBtn = container.querySelector('#sr-save-btn');

  let isRecording = false;
  let isPlaying = false;
  let position = 0;
  let length = 0;
  let animId = 0;

  function drawWaveform() {
    if (!ctx || !canvas) return;
    ctx.fillStyle = '#001a00';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#00ff44';
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    const midY = canvas.height / 2;
    ctx.moveTo(0, midY);

    for (let x = 0; x < canvas.width; x++) {
      if (isRecording || isPlaying) {
        const amp = Math.sin((x * 0.1) + (Date.now() * 0.01)) * (canvas.height * 0.35);
        ctx.lineTo(x, midY + amp);
      } else {
        ctx.lineTo(x, midY);
      }
    }
    ctx.stroke();

    // Position marker
    if (length > 0) {
      const markerX = (position / length) * canvas.width;
      ctx.strokeStyle = '#ffff00';
      ctx.beginPath();
      ctx.moveTo(markerX, 0);
      ctx.lineTo(markerX, canvas.height);
      ctx.stroke();
    }
  }

  function loop() {
    if (isRecording) {
      position += 0.05;
      length = Math.max(length, position);
      if (posEl) posEl.textContent = `${position.toFixed(2)} sec.`;
      if (lenEl) lenEl.textContent = `${length.toFixed(2)} sec.`;
    } else if (isPlaying) {
      position += 0.05;
      if (position >= length) {
        isPlaying = false;
        position = 0;
      }
      if (posEl) posEl.textContent = `${position.toFixed(2)} sec.`;
    }
    drawWaveform();
    animId = requestAnimationFrame(loop);
  }

  recBtn?.addEventListener('click', () => {
    isRecording = true;
    isPlaying = false;
    audio.playDing();
  });

  playBtn?.addEventListener('click', () => {
    if (length <= 0) return;
    isPlaying = true;
    isRecording = false;
    position = 0;
    audio.playChord();
  });

  stopBtn?.addEventListener('click', () => {
    isRecording = false;
    isPlaying = false;
    audio.playClick();
  });

  saveBtn?.addEventListener('click', () => {
    audio.playTada();
    vfs.writeFile('C:\\My Documents\\recording.wav', 'RIFF...[WAV DATA]...');
    alert('Saved as "C:\\My Documents\\recording.wav" in Virtual Filesystem!');
  });

  loop();

  win.element.addEventListener('DOMNodeRemovedFromDocument', () => {
    cancelAnimationFrame(animId);
  });
}

/**
 * 4. Volume Control Mixer
 */
export function renderVolumeControl(container: HTMLElement, win: Win95Window) {
  win.setTitle('Volume Control');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <div class="flex gap-4 px-2 py-0.5 text-xs bg-[#c0c0c0] border-b border-black">
        <span class="hover:underline cursor-pointer">Options</span>
        <span class="hover:underline cursor-pointer">Help</span>
      </div>

      <div class="p-3 flex gap-3 overflow-x-auto">
        ${[
          { name: 'Volume Control', bal: 50, vol: 80 },
          { name: 'Wave', bal: 50, vol: 75 },
          { name: 'Synthesizer', bal: 50, vol: 70 },
          { name: 'CD Audio', bal: 50, vol: 85 },
          { name: 'Line In', bal: 50, vol: 60 },
        ].map((ch, idx) => `
          <div class="flex flex-col items-center bg-[#d0d0d0] border border-black/40 p-2 min-w-[75px]">
            <span class="text-[10px] font-bold text-center h-6 leading-tight">${ch.name}</span>
            <div class="text-[9px] text-gray-600 mt-1">Balance</div>
            <input type="range" min="0" max="100" value="${ch.bal}" class="w-14 cursor-pointer" />
            <div class="text-[9px] text-gray-600 mt-2">Volume</div>
            <input type="range" orient="vertical" min="0" max="100" value="${ch.vol}" class="h-28 cursor-pointer mt-1 [writing-mode:bt-lr] [-webkit-appearance:slider-vertical]" />
            <label class="flex items-center gap-1 mt-2 text-[9px]">
              <input type="checkbox" id="mute-${idx}" />
              <span>Mute</span>
            </label>
          </div>
        `).join('')}
      </div>

      <div class="p-2 border-t border-white flex justify-between items-center bg-[#c0c0c0]">
        <button id="vol-test-btn" class="retro-btn !py-0.5 !px-3 text-xs font-bold">🔊 Test Sound</button>
        <span class="text-[10px] text-gray-600">Sound Blaster 16 Compatible</span>
      </div>
    </div>
  `;

  const testBtn = container.querySelector('#vol-test-btn');
  testBtn?.addEventListener('click', () => {
    audio.playChord();
  });
}

/**
 * 5. Image Viewer
 */
export function renderImageViewer(container: HTMLElement, win: Win95Window, initialImagePath?: string) {
  win.setTitle('Image Viewer - [Untitled]');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <!-- Toolbar -->
      <div class="flex items-center gap-2 p-1 bg-[#c0c0c0] border-b border-black text-xs">
        <label class="retro-btn !py-0.5 !px-2 cursor-pointer flex items-center gap-1">
          <span>📂 Open...</span>
          <input type="file" id="iv-file-input" accept="image/*" class="hidden" />
        </label>
        <button id="iv-zoom-in" class="retro-btn !py-0.5 !px-2">Zoom +</button>
        <button id="iv-zoom-out" class="retro-btn !py-0.5 !px-2">Zoom -</button>
        <button id="iv-rotate" class="retro-btn !py-0.5 !px-2">Rotate 90°</button>
        <button id="iv-set-wallpaper" class="retro-btn !py-0.5 !px-2 font-bold text-blue-900">Set as Wallpaper</button>
      </div>

      <!-- Canvas / Image Display -->
      <div class="flex-1 bg-[#808080] p-4 flex items-center justify-center overflow-auto relative">
        <img id="iv-image" src="${initialImagePath || '/images/windows-95-computer.svg'}" alt="Preview" class="max-w-full max-h-full object-contain shadow-[4px_4px_0px_#000000] border-2 border-white transition-transform duration-100" />
      </div>
    </div>
  `;

  const img = container.querySelector('#iv-image') as HTMLImageElement;
  const fileInput = container.querySelector('#iv-file-input') as HTMLInputElement;
  const zoomIn = container.querySelector('#iv-zoom-in');
  const zoomOut = container.querySelector('#iv-zoom-out');
  const rotateBtn = container.querySelector('#iv-rotate');
  const wallpaperBtn = container.querySelector('#iv-set-wallpaper');

  let scale = 1;
  let rotation = 0;

  function updateTransform() {
    if (img) img.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
  }

  zoomIn?.addEventListener('click', () => {
    scale = Math.min(3, scale + 0.25);
    updateTransform();
    audio.playClick();
  });

  zoomOut?.addEventListener('click', () => {
    scale = Math.max(0.25, scale - 0.25);
    updateTransform();
    audio.playClick();
  });

  rotateBtn?.addEventListener('click', () => {
    rotation = (rotation + 90) % 360;
    updateTransform();
    audio.playClick();
  });

  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (img && e.target?.result) {
          img.src = e.target.result as string;
          win.setTitle(`Image Viewer - [${file.name}]`);
          audio.playClick();
        }
      };
      reader.readAsDataURL(file);
    }
  });

  wallpaperBtn?.addEventListener('click', () => {
    if (img?.src) {
      const desktop = document.getElementById('win95-desktop-screen');
      if (desktop) {
        desktop.style.backgroundImage = `url(${img.src})`;
        desktop.style.backgroundSize = 'cover';
        desktop.style.backgroundPosition = 'center';
      }
      audio.playTada();
      alert('Desktop Wallpaper Updated!');
    }
  });
}

/**
 * 6. MIDI Player
 */
export function renderMIDIPlayer(container: HTMLElement, win: Win95Window) {
  win.setTitle('MIDI Player 95');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <div class="p-3 space-y-3">
        <div class="retro-inset p-3 bg-black text-cyan-400 border-2 border-white">
          <div class="text-xs font-bold text-yellow-300">General MIDI Synthesizer</div>
          <div class="text-base font-bold mt-1" id="midi-title">Song: Windows 95 Canyon Overture</div>
          <div class="text-[10px] text-gray-400 mt-0.5">Polyphony: 16 Voices | Web Audio Synth</div>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-xs font-bold">Select MIDI:</label>
          <select id="midi-select" class="retro-inset flex-1 px-2 py-0.5 bg-white text-black text-xs font-mono">
            <option value="canyon">Canyon.mid (Iconic Retro Chords)</option>
            <option value="passport">Passport.mid (World Grooves)</option>
            <option value="retro8bit">8-Bit Arcade Victory</option>
            <option value="bach">Bach Invention in D Minor</option>
          </select>
        </div>

        <div class="flex items-center justify-center gap-2 pt-2">
          <button id="midi-play-btn" class="retro-btn !px-4 !py-1 font-bold text-xs">▶ Play MIDI</button>
          <button id="midi-stop-btn" class="retro-btn !px-4 !py-1 font-bold text-xs">◼ Stop</button>
        </div>
      </div>
    </div>
  `;

  const playBtn = container.querySelector('#midi-play-btn');
  const stopBtn = container.querySelector('#midi-stop-btn');
  const select = container.querySelector('#midi-select') as HTMLSelectElement;

  playBtn?.addEventListener('click', () => {
    audio.playChord();
    setTimeout(() => audio.playTada(), 600);
  });

  stopBtn?.addEventListener('click', () => {
    audio.playClick();
  });
}
