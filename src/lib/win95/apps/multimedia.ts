// Piush 95 - Multimedia Collection
// Media Player, CD Player, Sound Recorder, Volume Control, Image Viewer, MIDI Player

import { audio } from '../audio';
import { vfs } from '../fs';
import type { Win95Window } from '../windowManager';

/**
 * 1. Media Player - Full Multi-Track Audio/Video Simulator
 */
export function renderMediaPlayer(container: HTMLElement, win: Win95Window) {
  win.setTitle('Media Player - [CANYON.MID] (Stopped)');

  interface Track {
    name: string;
    file: string;
    duration: number; // in seconds
    type: 'midi' | 'wave' | 'chiptune';
    notes: Array<{ f: number; d: number }>;
  }

  const tracks: Track[] = [
    {
      name: 'CANYON.MID (Windows 95 Overture)',
      file: 'C:\\WINDOWS\\MEDIA\\CANYON.MID',
      duration: 120,
      type: 'midi',
      notes: [
        { f: 523.25, d: 0.2 }, { f: 587.33, d: 0.2 }, { f: 659.25, d: 0.2 }, { f: 783.99, d: 0.4 },
        { f: 659.25, d: 0.2 }, { f: 783.99, d: 0.4 }, { f: 1046.5, d: 0.6 },
        { f: 880.00, d: 0.2 }, { f: 783.99, d: 0.2 }, { f: 659.25, d: 0.4 }, { f: 523.25, d: 0.6 },
      ],
    },
    {
      name: 'PASSPORT.MID (World Grooves)',
      file: 'C:\\WINDOWS\\MEDIA\\PASSPORT.MID',
      duration: 95,
      type: 'midi',
      notes: [
        { f: 440.0, d: 0.25 }, { f: 554.37, d: 0.25 }, { f: 659.25, d: 0.25 }, { f: 880.0, d: 0.5 },
        { f: 740.0, d: 0.25 }, { f: 659.25, d: 0.25 }, { f: 554.37, d: 0.5 },
      ],
    },
    {
      name: 'CHIPTUNE.MID (Retro 8-Bit Arcade)',
      file: 'C:\\WINDOWS\\MEDIA\\CHIPTUNE.MID',
      duration: 80,
      type: 'chiptune',
      notes: [
        { f: 261.63, d: 0.15 }, { f: 329.63, d: 0.15 }, { f: 392.00, d: 0.15 }, { f: 523.25, d: 0.3 },
        { f: 392.00, d: 0.15 }, { f: 523.25, d: 0.45 },
      ],
    },
    {
      name: 'WELCOME.WAV (Windows Orchestral Fanfare)',
      file: 'C:\\WINDOWS\\MEDIA\\WELCOME.WAV',
      duration: 12,
      type: 'wave',
      notes: [
        { f: 392.00, d: 0.2 }, { f: 523.25, d: 0.2 }, { f: 659.25, d: 0.2 }, { f: 783.99, d: 0.5 },
        { f: 1046.5, d: 0.8 },
      ],
    },
  ];

  let currentTrackIdx = 0;
  let isPlaying = false;
  let currentTime = 0;
  let noteIdx = 0;
  let animId = 0;
  let audioTimer: number | null = null;
  let customAudioBlobUrl: string | null = null;
  let customAudioElement: HTMLAudioElement | null = null;

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
        <canvas id="mp-visualizer" width="380" height="180" class="block w-full h-full max-h-[220px]"></canvas>
        <div id="mp-title-overlay" class="absolute top-2 left-2 text-green-400 text-xs font-bold drop-shadow-[0_1px_2px_black]">
          ▶ Track: CANYON.MID (Windows 95 Classic)
        </div>
        <div id="mp-mode-overlay" class="absolute top-2 right-2 text-cyan-300 text-[10px] font-mono">
          [MIDI SEQUENCER 16-VOICE]
        </div>
      </div>

      <!-- Controls & Seekbar -->
      <div class="p-2 space-y-2 bg-[#c0c0c0] border-t border-white">
        <!-- Progress slider -->
        <div class="flex items-center gap-2">
          <span id="mp-current-time" class="text-[11px] text-gray-800 w-12 font-bold">00:00</span>
          <input type="range" id="mp-seekbar" min="0" max="100" value="0" class="flex-1 cursor-pointer" />
          <span id="mp-total-time" class="text-[11px] text-gray-800 w-12 text-right font-bold">02:00</span>
        </div>

        <!-- Player Buttons -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <button id="mp-play-btn" class="retro-btn !p-1.5 size-7 flex items-center justify-center text-xs font-bold" title="Play">▶</button>
            <button id="mp-pause-btn" class="retro-btn !p-1.5 size-7 flex items-center justify-center text-xs font-bold" title="Pause">❚❚</button>
            <button id="mp-stop-btn" class="retro-btn !p-1.5 size-7 flex items-center justify-center text-xs font-bold" title="Stop">◼</button>
            <div class="w-px h-5 bg-black/40 mx-1"></div>
            <button id="mp-prev-btn" class="retro-btn !p-1.5 size-7 flex items-center justify-center text-xs font-bold" title="Previous Track">|◀</button>
            <button id="mp-next-btn" class="retro-btn !p-1.5 size-7 flex items-center justify-center text-xs font-bold" title="Next Track">▶|</button>
          </div>

          <!-- Track selection & Open file -->
          <div class="flex items-center gap-1.5">
            <select id="mp-track-select" class="retro-select !py-0.5 !px-1 text-[11px] font-mono max-w-[170px]">
              ${tracks.map((t, idx) => `<option value="${idx}">${t.name}</option>`).join('')}
            </select>
            <label class="retro-btn !py-0.5 !px-2 text-xs cursor-pointer flex items-center gap-1">
              <span>📂 Open...</span>
              <input type="file" id="mp-file-input" accept="audio/*" class="hidden" />
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
  const prevBtn = container.querySelector('#mp-prev-btn');
  const nextBtn = container.querySelector('#mp-next-btn');
  const seekbar = container.querySelector('#mp-seekbar') as HTMLInputElement;
  const curTimeEl = container.querySelector('#mp-current-time') as HTMLElement;
  const totalTimeEl = container.querySelector('#mp-total-time') as HTMLElement;
  const fileInput = container.querySelector('#mp-file-input') as HTMLInputElement;
  const overlay = container.querySelector('#mp-title-overlay') as HTMLElement;
  const modeOverlay = container.querySelector('#mp-mode-overlay') as HTMLElement;
  const trackSelect = container.querySelector('#mp-track-select') as HTMLSelectElement;

  function formatTime(sec: number): string {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(Math.floor(sec % 60)).padStart(2, '0');
    return `${m}:${s}`;
  }

  function updateTrackInfo() {
    const t = tracks[currentTrackIdx];
    if (overlay) overlay.textContent = `▶ Track: ${t.name}`;
    if (modeOverlay) modeOverlay.textContent = `[${t.type.toUpperCase()} AUDIO]`;
    if (totalTimeEl) totalTimeEl.textContent = formatTime(t.duration);
    win.setTitle(`Media Player - [${t.name}] (${isPlaying ? 'Playing' : 'Stopped'})`);
  }

  function playSynthNote() {
    if (!isPlaying) return;
    const t = tracks[currentTrackIdx];
    if (t.notes.length > 0) {
      const note = t.notes[noteIdx % t.notes.length];
      const waveType = t.type === 'chiptune' ? 'square' : t.type === 'wave' ? 'sawtooth' : 'triangle';
      audio.playTone(note.f, note.d, waveType, 0.12);
      noteIdx++;
    }
  }

  function renderVisualizer() {
    if (!ctx || !canvas) return;
    ctx.fillStyle = '#080814';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isPlaying) {
      // 32-bar graphic equalizer with peak hold
      const bars = 32;
      const barW = canvas.width / bars;
      const time = Date.now() / 150;
      for (let i = 0; i < bars; i++) {
        const h = Math.abs(Math.sin(time + i * 0.35)) * (canvas.height * 0.75);
        const grad = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - h);
        grad.addColorStop(0, '#00ff44');
        grad.addColorStop(0.7, '#ffff00');
        grad.addColorStop(1, '#ff0033');
        ctx.fillStyle = grad;
        ctx.fillRect(i * barW + 1, canvas.height - h, barW - 2, h);

        // Peak indicator
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(i * barW + 1, canvas.height - h - 3, barW - 2, 2);
      }
    } else {
      ctx.fillStyle = '#444455';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('[ Media Player Stopped ]', canvas.width / 2, canvas.height / 2);
    }
  }

  function startPlayback() {
    isPlaying = true;
    win.setTitle(`Media Player - [${tracks[currentTrackIdx].name}] (Playing)`);
    audio.playClick();

    if (customAudioElement) {
      customAudioElement.play().catch(() => {});
    } else {
      if (audioTimer) clearInterval(audioTimer);
      audioTimer = window.setInterval(() => {
        if (!isPlaying) return;
        playSynthNote();
        currentTime += 1;
        const dur = tracks[currentTrackIdx].duration;
        if (currentTime > dur) {
          currentTime = 0;
          noteIdx = 0;
        }
        if (seekbar) seekbar.value = String((currentTime / dur) * 100);
        if (curTimeEl) curTimeEl.textContent = formatTime(currentTime);
      }, 350);
    }
  }

  function stopPlayback() {
    isPlaying = false;
    currentTime = 0;
    noteIdx = 0;
    if (audioTimer) {
      clearInterval(audioTimer);
      audioTimer = null;
    }
    if (customAudioElement) {
      customAudioElement.pause();
      customAudioElement.currentTime = 0;
    }
    if (seekbar) seekbar.value = '0';
    if (curTimeEl) curTimeEl.textContent = '00:00';
    updateTrackInfo();
    audio.playClick();
  }

  function pausePlayback() {
    isPlaying = false;
    if (audioTimer) {
      clearInterval(audioTimer);
      audioTimer = null;
    }
    if (customAudioElement) {
      customAudioElement.pause();
    }
    win.setTitle(`Media Player - [${tracks[currentTrackIdx].name}] (Paused)`);
    audio.playClick();
  }

  function tick() {
    renderVisualizer();
    animId = requestAnimationFrame(tick);
  }

  playBtn?.addEventListener('click', startPlayback);
  pauseBtn?.addEventListener('click', pausePlayback);
  stopBtn?.addEventListener('click', stopPlayback);

  prevBtn?.addEventListener('click', () => {
    stopPlayback();
    currentTrackIdx = (currentTrackIdx - 1 + tracks.length) % tracks.length;
    if (trackSelect) trackSelect.value = String(currentTrackIdx);
    updateTrackInfo();
    startPlayback();
  });

  nextBtn?.addEventListener('click', () => {
    stopPlayback();
    currentTrackIdx = (currentTrackIdx + 1) % tracks.length;
    if (trackSelect) trackSelect.value = String(currentTrackIdx);
    updateTrackInfo();
    startPlayback();
  });

  trackSelect?.addEventListener('change', () => {
    stopPlayback();
    currentTrackIdx = parseInt(trackSelect.value, 10);
    updateTrackInfo();
    startPlayback();
  });

  seekbar?.addEventListener('input', () => {
    const pct = parseFloat(seekbar.value);
    const dur = tracks[currentTrackIdx].duration;
    currentTime = (pct / 100) * dur;
    if (curTimeEl) curTimeEl.textContent = formatTime(currentTime);
    if (customAudioElement && !isNaN(customAudioElement.duration)) {
      customAudioElement.currentTime = (pct / 100) * customAudioElement.duration;
    }
  });

  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (file) {
      stopPlayback();
      customAudioBlobUrl = URL.createObjectURL(file);
      customAudioElement = new Audio(customAudioBlobUrl);
      if (overlay) overlay.textContent = `▶ File: ${file.name}`;
      if (modeOverlay) modeOverlay.textContent = '[CUSTOM AUDIO FILE]';
      win.setTitle(`Media Player - [${file.name}] (Playing)`);

      customAudioElement.addEventListener('loadedmetadata', () => {
        if (totalTimeEl) totalTimeEl.textContent = formatTime(customAudioElement?.duration || 0);
      });
      customAudioElement.addEventListener('timeupdate', () => {
        if (curTimeEl && customAudioElement) {
          curTimeEl.textContent = formatTime(customAudioElement.currentTime);
          if (seekbar && customAudioElement.duration) {
            seekbar.value = String((customAudioElement.currentTime / customAudioElement.duration) * 100);
          }
        }
      });
      customAudioElement.addEventListener('ended', stopPlayback);
      isPlaying = true;
      customAudioElement.play().catch(() => {});
      audio.playChord();
    }
  });

  // Menubar interactions
  container.querySelector('#mp-menu-file')?.addEventListener('click', () => {
    audio.playClick();
    fileInput?.click();
  });

  container.querySelector('#mp-menu-help')?.addEventListener('click', () => {
    audio.playClick();
    alert('Windows 95 Media Player\n\nSupports standard MIDI synthesizer sequences, waveform audio files, and local audio streaming with 32-bar visualizer.');
  });

  updateTrackInfo();
  tick();

  win.element.addEventListener('DOMNodeRemovedFromDocument', () => {
    cancelAnimationFrame(animId);
    if (audioTimer) clearInterval(audioTimer);
    if (customAudioElement) {
      customAudioElement.pause();
      customAudioElement = null;
    }
    if (customAudioBlobUrl) {
      URL.revokeObjectURL(customAudioBlobUrl);
    }
  });
}

/**
 * 2. CD Player - Authentic Audio Disc Player with 12 Tracks
 */
export function renderCDPlayer(container: HTMLElement, win: Win95Window) {
  win.setTitle('CD Player - [01] 00:00');

  const cdTracks = [
    { title: '01. Boot Sequence (Intro)', dur: 184, notes: [440, 554, 659, 880] },
    { title: '02. Silicon Dreams', dur: 236, notes: [523, 659, 783, 1046] },
    { title: '03. 56K Modem Handshake', dur: 195, notes: [600, 1200, 1800, 2100] },
    { title: '04. Canyon.mid Remaster', dur: 270, notes: [587, 659, 783, 880] },
    { title: '05. Cyberpunk 1995', dur: 312, notes: [330, 392, 493, 659] },
    { title: '06. Memory Leaks Anthem', dur: 245, notes: [261, 329, 392, 523] },
    { title: '07. Cloud Architecture Funk', dur: 288, notes: [349, 440, 523, 698] },
    { title: '08. Swift & Kotlin Groove', dur: 215, notes: [392, 493, 587, 783] },
    { title: '09. Dial-Up Euphoria', dur: 260, notes: [440, 554, 659, 880] },
    { title: '10. 550 Quiz Master', dur: 190, notes: [523, 659, 783, 987] },
    { title: '11. Defrag Rhythm', dur: 240, notes: [330, 440, 554, 659] },
    { title: '12. Shutdown Wave (Outro)', dur: 210, notes: [392, 523, 659, 783] },
  ];

  let currentTrack = 0;
  let isPlaying = false;
  let trackSeconds = 0;
  let totalSeconds = 0;
  let intervalId: number | null = null;
  let rotation = 0;
  let timeMode: 'elapsed' | 'remaining' | 'disc' = 'elapsed';

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <!-- Menubar -->
      <div class="flex gap-4 px-2 py-0.5 text-xs bg-[#c0c0c0] border-b border-black">
        <span class="hover:underline cursor-pointer" id="cd-menu-disc">Disc</span>
        <span class="hover:underline cursor-pointer" id="cd-menu-view">View</span>
        <span class="hover:underline cursor-pointer" id="cd-menu-options">Options</span>
        <span class="hover:underline cursor-pointer" id="cd-menu-help">Help</span>
      </div>

      <!-- Main Display -->
      <div class="p-3 bg-[#c0c0c0] space-y-2 flex-1">
        <!-- LED Inset Box -->
        <div class="retro-inset p-3 bg-black text-green-400 flex items-center justify-between border-2 border-white shadow-inner">
          <div class="flex items-center gap-3">
            <!-- Animated CD Disc -->
            <div id="cd-spinner" class="size-14 rounded-full border-4 border-gray-600 bg-gradient-to-tr from-gray-700 via-gray-300 to-gray-800 flex items-center justify-center text-black text-xs font-bold shadow-lg transition-transform duration-100">
              <div class="size-5 rounded-full bg-black/70 border-2 border-white flex items-center justify-center text-[8px] text-white">
                ●
              </div>
            </div>
            <div>
              <div class="text-[10px] text-gray-400 uppercase tracking-wide">Artist: Piush KS</div>
              <div class="text-xs font-bold text-yellow-300 truncate max-w-[200px]" id="cd-track-title">01. Boot Sequence (Intro)</div>
              <div class="text-xl font-bold tracking-widest mt-0.5 text-green-400 cursor-pointer" id="cd-time-display" title="Click to toggle Elapsed / Remaining / Disc time">
                <span id="cd-track-num">[01]</span> <span id="cd-timer">00:00</span>
              </div>
            </div>
          </div>
          <div class="text-right text-[10px] text-gray-400">
            <div>TOTAL: 12 TRACKS</div>
            <div>TIME: 47:44</div>
            <div id="cd-mode-indicator" class="text-yellow-400 text-[9px] mt-1 font-bold">[TRACK ELAPSED]</div>
          </div>
        </div>

        <!-- Track Selector & Volume -->
        <div class="flex items-center gap-2 pt-1">
          <label class="text-xs font-bold">Track:</label>
          <select id="cd-track-select" class="retro-select flex-1 px-2 py-0.5 text-xs font-mono">
            ${cdTracks.map((t, i) => `<option value="${i}">${t.title}</option>`).join('')}
          </select>
        </div>

        <!-- CD Controls -->
        <div class="flex items-center justify-center gap-1.5 pt-2">
          <button id="cd-play-btn" class="retro-btn !px-3 !py-1 font-bold text-xs" title="Play">▶ Play</button>
          <button id="cd-pause-btn" class="retro-btn !px-3 !py-1 font-bold text-xs" title="Pause">❚❚ Pause</button>
          <button id="cd-stop-btn" class="retro-btn !px-3 !py-1 font-bold text-xs" title="Stop">◼ Stop</button>
          <div class="w-px h-5 bg-black/40 mx-1"></div>
          <button id="cd-prev-btn" class="retro-btn !px-2.5 !py-1 font-bold text-xs" title="Previous Track">|◀</button>
          <button id="cd-next-btn" class="retro-btn !px-2.5 !py-1 font-bold text-xs" title="Next Track">▶|</button>
          <button id="cd-eject-btn" class="retro-btn !px-2.5 !py-1 font-bold text-xs text-red-700" title="Eject Tray">⏏ Eject</button>
        </div>

        <!-- Status & Volume Bar -->
        <div class="flex items-center justify-between pt-2 border-t border-white text-xs">
          <span class="text-[11px] text-gray-700 font-bold" id="cd-status-text">Status: Drive Ready</span>
          <div class="flex items-center gap-2">
            <span class="text-[10px]">Volume:</span>
            <input type="range" id="cd-volume-slider" min="0" max="100" value="80" class="w-20 cursor-pointer" />
          </div>
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
  const trackTitleEl = container.querySelector('#cd-track-title') as HTMLElement;
  const timerEl = container.querySelector('#cd-timer') as HTMLElement;
  const spinner = container.querySelector('#cd-spinner') as HTMLElement;
  const modeInd = container.querySelector('#cd-mode-indicator') as HTMLElement;
  const statusEl = container.querySelector('#cd-status-text') as HTMLElement;
  const timeDisplay = container.querySelector('#cd-time-display');

  function updateDisplay() {
    const cur = cdTracks[currentTrack];
    const trackStr = String(currentTrack + 1).padStart(2, '0');
    if (trackNumEl) trackNumEl.textContent = `[${trackStr}]`;
    if (trackTitleEl) trackTitleEl.textContent = cur.title;

    let displaySec = trackSeconds;
    if (timeMode === 'remaining') {
      displaySec = Math.max(0, cur.dur - trackSeconds);
    } else if (timeMode === 'disc') {
      const totalDiscDur = cdTracks.reduce((acc, t) => acc + t.dur, 0);
      displaySec = Math.max(0, totalDiscDur - totalSeconds);
    }

    const m = String(Math.floor(displaySec / 60)).padStart(2, '0');
    const s = String(displaySec % 60).padStart(2, '0');
    const prefix = timeMode !== 'elapsed' ? '-' : '';
    if (timerEl) timerEl.textContent = `${prefix}${m}:${s}`;
    win.setTitle(`CD Player - [${trackStr}] ${prefix}${m}:${s}`);

    if (isPlaying && spinner) {
      rotation = (rotation + 18) % 360;
      spinner.style.transform = `rotate(${rotation}deg)`;
    }
  }

  function startPlay() {
    isPlaying = true;
    if (statusEl) statusEl.textContent = 'Status: Playing Audio Track';
    audio.playClick();

    if (!intervalId) {
      intervalId = window.setInterval(() => {
        if (!isPlaying) return;
        trackSeconds++;
        totalSeconds++;

        // Play periodic note chords to simulate CD music
        const cur = cdTracks[currentTrack];
        const note = cur.notes[trackSeconds % cur.notes.length];
        audio.playTone(note, 0.25, 'triangle', 0.1);

        if (trackSeconds >= cur.dur) {
          trackSeconds = 0;
          currentTrack = (currentTrack + 1) % cdTracks.length;
          if (trackSelect) trackSelect.value = String(currentTrack);
        }
        updateDisplay();
      }, 1000);
    }
  }

  function stopPlay() {
    isPlaying = false;
    trackSeconds = 0;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (statusEl) statusEl.textContent = 'Status: Stopped';
    updateDisplay();
    audio.playClick();
  }

  function pausePlay() {
    isPlaying = false;
    if (statusEl) statusEl.textContent = 'Status: Paused';
    updateDisplay();
    audio.playClick();
  }

  playBtn?.addEventListener('click', startPlay);
  pauseBtn?.addEventListener('click', pausePlay);
  stopBtn?.addEventListener('click', stopPlay);

  prevBtn?.addEventListener('click', () => {
    trackSeconds = 0;
    currentTrack = (currentTrack - 1 + cdTracks.length) % cdTracks.length;
    if (trackSelect) trackSelect.value = String(currentTrack);
    updateDisplay();
    if (isPlaying) startPlay();
  });

  nextBtn?.addEventListener('click', () => {
    trackSeconds = 0;
    currentTrack = (currentTrack + 1) % cdTracks.length;
    if (trackSelect) trackSelect.value = String(currentTrack);
    updateDisplay();
    if (isPlaying) startPlay();
  });

  trackSelect?.addEventListener('change', () => {
    trackSeconds = 0;
    currentTrack = parseInt(trackSelect.value, 10);
    updateDisplay();
    if (isPlaying) startPlay();
  });

  timeDisplay?.addEventListener('click', () => {
    audio.playClick();
    if (timeMode === 'elapsed') {
      timeMode = 'remaining';
      if (modeInd) modeInd.textContent = '[TRACK REMAINING]';
    } else if (timeMode === 'remaining') {
      timeMode = 'disc';
      if (modeInd) modeInd.textContent = '[DISC REMAINING]';
    } else {
      timeMode = 'elapsed';
      if (modeInd) modeInd.textContent = '[TRACK ELAPSED]';
    }
    updateDisplay();
  });

  ejectBtn?.addEventListener('click', () => {
    stopPlay();
    audio.playDing();
    alert('CD-ROM Drive (D:) tray ejected.\nDisc "Greatest Code 1995" unmounted.');
  });

  container.querySelector('#cd-menu-help')?.addEventListener('click', () => {
    audio.playClick();
    alert('Windows 95 CD Player\n\nPlays standard Red Book audio compact discs with full track sequencing, time modes, and volume control.');
  });

  updateDisplay();

  win.element.addEventListener('DOMNodeRemovedFromDocument', () => {
    if (intervalId) clearInterval(intervalId);
  });
}

/**
 * 3. Sound Recorder - Wave Audio Recording & Effects Engine
 */
export function renderSoundRecorder(container: HTMLElement, win: Win95Window) {
  win.setTitle('Sound Recorder - Sound');

  let isRecording = false;
  let isPlaying = false;
  let position = 0;
  let length = 0;
  let animId = 0;
  let audioBuffer: number[] = [];
  let playbackIdx = 0;
  let speedMultiplier = 1.0;

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
      <div class="p-3 bg-[#c0c0c0] space-y-2 flex-1">
        <div class="retro-inset p-2 bg-black flex items-center justify-center border-2 border-white relative shadow-inner">
          <canvas id="sr-waveform" width="340" height="80" class="block bg-[#001100]"></canvas>
          <div class="absolute top-1 left-2 text-[10px] text-green-400 font-bold" id="sr-mode-indicator">
            [STANDBY]
          </div>
        </div>

        <!-- Position & Length -->
        <div class="flex items-center justify-between text-xs px-1">
          <span>Position: <strong id="sr-pos">0.00 sec.</strong></span>
          <span>Length: <strong id="sr-len">0.00 sec.</strong></span>
        </div>

        <!-- Control Buttons -->
        <div class="flex items-center justify-center gap-1.5 pt-1">
          <button id="sr-seek-start" class="retro-btn !p-1 size-8 flex items-center justify-center text-xs font-bold" title="Seek to Start">|◀</button>
          <button id="sr-seek-end" class="retro-btn !p-1 size-8 flex items-center justify-center text-xs font-bold" title="Seek to End">▶|</button>
          <button id="sr-play-btn" class="retro-btn !p-1 size-8 flex items-center justify-center text-xs font-bold" title="Play">▶</button>
          <button id="sr-stop-btn" class="retro-btn !p-1 size-8 flex items-center justify-center text-xs font-bold" title="Stop">◼</button>
          <button id="sr-rec-btn" class="retro-btn !p-1 size-8 flex items-center justify-center text-xs text-red-600 font-bold shadow" title="Record Audio">●</button>
        </div>

        <!-- Effects Toolbar -->
        <div class="flex items-center justify-center gap-1.5 pt-1.5 border-t border-black/30">
          <button id="sr-fx-faster" class="retro-btn !py-0.5 !px-2 text-[11px] font-bold">Speed +100%</button>
          <button id="sr-fx-slower" class="retro-btn !py-0.5 !px-2 text-[11px] font-bold">Slow -50%</button>
          <button id="sr-fx-reverse" class="retro-btn !py-0.5 !px-2 text-[11px] font-bold">Reverse</button>
          <button id="sr-save-btn" class="retro-btn !py-0.5 !px-2 text-[11px] font-bold text-blue-900">Save WAV</button>
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
  const seekStartBtn = container.querySelector('#sr-seek-start');
  const seekEndBtn = container.querySelector('#sr-seek-end');
  const saveBtn = container.querySelector('#sr-save-btn');
  const modeInd = container.querySelector('#sr-mode-indicator') as HTMLElement;

  function drawWaveform() {
    if (!ctx || !canvas) return;
    ctx.fillStyle = '#001a00';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Green oscilloscope grid
    ctx.strokeStyle = '#003300';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 16) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    const midY = canvas.height / 2;
    ctx.strokeStyle = '#00ff44';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, midY);

    if (isRecording) {
      for (let x = 0; x < canvas.width; x++) {
        const amp = (Math.sin((x * 0.15) + (Date.now() * 0.02)) + (Math.random() * 0.4 - 0.2)) * (canvas.height * 0.35);
        ctx.lineTo(x, midY + amp);
      }
    } else if (audioBuffer.length > 0) {
      const step = Math.max(1, Math.floor(audioBuffer.length / canvas.width));
      for (let x = 0; x < canvas.width; x++) {
        const val = audioBuffer[x * step] || 0;
        ctx.lineTo(x, midY + val * (canvas.height * 0.4));
      }
    } else {
      ctx.lineTo(canvas.width, midY);
    }
    ctx.stroke();

    // Position marker line
    if (length > 0) {
      const markerX = (position / length) * canvas.width;
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 2;
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
      // Populate synthesized audio buffer
      const sample = Math.sin(position * 20) + (Math.random() * 0.4 - 0.2);
      audioBuffer.push(sample);
      if (posEl) posEl.textContent = `${position.toFixed(2)} sec.`;
      if (lenEl) lenEl.textContent = `${length.toFixed(2)} sec.`;
    } else if (isPlaying) {
      position += 0.05 * speedMultiplier;
      playbackIdx += Math.floor(10 * speedMultiplier);
      if (position >= length) {
        isPlaying = false;
        position = length;
        if (modeInd) modeInd.textContent = '[STOPPED]';
      }
      if (posEl) posEl.textContent = `${position.toFixed(2)} sec.`;
    }
    drawWaveform();
    animId = requestAnimationFrame(loop);
  }

  recBtn?.addEventListener('click', () => {
    isRecording = true;
    isPlaying = false;
    audioBuffer = [];
    position = 0;
    length = 0;
    if (modeInd) modeInd.textContent = '[RECORDING MICROPHONE...]';
    audio.playDing();
  });

  playBtn?.addEventListener('click', () => {
    if (length <= 0) return;
    isPlaying = true;
    isRecording = false;
    if (position >= length) position = 0;
    if (modeInd) modeInd.textContent = '[PLAYING AUDIO]';
    audio.playChord();
  });

  stopBtn?.addEventListener('click', () => {
    isRecording = false;
    isPlaying = false;
    if (modeInd) modeInd.textContent = '[STOPPED]';
    audio.playClick();
  });

  seekStartBtn?.addEventListener('click', () => {
    position = 0;
    if (posEl) posEl.textContent = '0.00 sec.';
    audio.playClick();
  });

  seekEndBtn?.addEventListener('click', () => {
    position = length;
    if (posEl) posEl.textContent = `${length.toFixed(2)} sec.`;
    audio.playClick();
  });

  container.querySelector('#sr-fx-faster')?.addEventListener('click', () => {
    speedMultiplier *= 1.5;
    length /= 1.5;
    audio.playClick();
    if (lenEl) lenEl.textContent = `${length.toFixed(2)} sec.`;
  });

  container.querySelector('#sr-fx-slower')?.addEventListener('click', () => {
    speedMultiplier *= 0.75;
    length /= 0.75;
    audio.playClick();
    if (lenEl) lenEl.textContent = `${length.toFixed(2)} sec.`;
  });

  container.querySelector('#sr-fx-reverse')?.addEventListener('click', () => {
    audioBuffer.reverse();
    audio.playClick();
    alert('Waveform reversed successfully!');
  });

  saveBtn?.addEventListener('click', () => {
    audio.playTada();
    const fakeWav = `RIFFWAVEfmt 16-Bit Mono 22050Hz data[${audioBuffer.length} samples]`;
    vfs.writeFile('C:\\My Documents\\recording.wav', fakeWav, 'audio/wav');
    alert('Saved as "C:\\My Documents\\recording.wav" in Virtual Filesystem!');
  });

  container.querySelector('#sr-menu-help')?.addEventListener('click', () => {
    audio.playClick();
    alert('Windows 95 Sound Recorder\n\nRecord, mix, and edit audio waveforms with speed manipulation, audio reversal, and VFS file persistence.');
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

  const channels = [
    { name: 'Volume Control', bal: 50, vol: Math.round(audio.getMasterVolume() * 100), isMaster: true },
    { name: 'Wave Audio', bal: 50, vol: 85 },
    { name: 'Synthesizer', bal: 50, vol: 80 },
    { name: 'CD Audio', bal: 50, vol: 75 },
    { name: 'Line In', bal: 50, vol: 60 },
    { name: 'Microphone', bal: 50, vol: 70 },
  ];

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <!-- Menubar -->
      <div class="flex gap-4 px-2 py-0.5 text-xs bg-[#c0c0c0] border-b border-black">
        <span class="hover:underline cursor-pointer" id="vol-menu-opt">Options</span>
        <span class="hover:underline cursor-pointer" id="vol-menu-help">Help</span>
      </div>

      <!-- Channel Sliders -->
      <div class="p-3 flex gap-2 overflow-x-auto flex-1 items-start">
        ${channels.map((ch, idx) => `
          <div class="flex flex-col items-center bg-[#d0d0d0] border border-black/40 p-2 min-w-[76px] shadow-sm">
            <span class="text-[10px] font-bold text-center h-6 leading-tight">${ch.name}</span>
            <div class="text-[9px] text-gray-600 mt-1">Balance</div>
            <input type="range" min="0" max="100" value="${ch.bal}" class="w-14 cursor-pointer" />
            <div class="text-[9px] text-gray-600 mt-2">Volume</div>
            <input type="range" orient="vertical" min="0" max="100" value="${ch.vol}" class="h-28 cursor-pointer mt-1 [writing-mode:bt-lr] [-webkit-appearance:slider-vertical] vol-fader" data-idx="${idx}" />
            <label class="flex items-center gap-1 mt-2 text-[9px] cursor-pointer">
              <input type="checkbox" id="vol-mute-${idx}" class="vol-mute-box" data-idx="${idx}" />
              <span>Mute</span>
            </label>
          </div>
        `).join('')}
      </div>

      <!-- Bottom Audio Status -->
      <div class="p-2 border-t border-white flex justify-between items-center bg-[#c0c0c0] text-xs">
        <button id="vol-test-btn" class="retro-btn !py-0.5 !px-3 font-bold">🔊 Test Sound</button>
        <span class="text-[10px] text-gray-600 font-bold">Sound Blaster 16 Compatible (Web Audio Synthesizer)</span>
      </div>
    </div>
  `;

  // Wire faders
  container.querySelectorAll('.vol-fader').forEach((slider) => {
    slider.addEventListener('input', (e) => {
      const idx = parseInt((e.target as HTMLElement).getAttribute('data-idx') || '0', 10);
      const val = parseInt((e.target as HTMLInputElement).value, 10);
      if (channels[idx].isMaster) {
        audio.setMasterVolume(val / 100);
      }
    });
  });

  // Wire mute
  container.querySelectorAll('.vol-mute-box').forEach((chk) => {
    chk.addEventListener('change', (e) => {
      const idx = parseInt((e.target as HTMLElement).getAttribute('data-idx') || '0', 10);
      const isMuted = (e.target as HTMLInputElement).checked;
      if (channels[idx].isMaster) {
        audio.setSoundEnabled(!isMuted);
      }
      audio.playClick();
    });
  });

  container.querySelector('#vol-test-btn')?.addEventListener('click', () => {
    audio.playChord();
  });

  container.querySelector('#vol-menu-help')?.addEventListener('click', () => {
    audio.playClick();
    alert('Windows 95 Volume Control\n\nControls system sound output levels, stereo channel balance, and sound card mixers.');
  });
}

/**
 * 5. Image Viewer
 */
export function renderImageViewer(container: HTMLElement, win: Win95Window, initialImagePath?: string) {
  win.setTitle('Image Viewer - [Untitled]');

  const sampleImages = [
    { name: 'Windows 95 Clouds', src: '/images/windows-95-clouds.jpg' },
    { name: 'Piush KS Profile', src: '/images/piush-avatar.jpg' },
    { name: 'My Computer', src: '/images/windows-95-computer.svg' },
    { name: 'Network MSN', src: '/images/windows-95-msn.svg' },
  ];

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <!-- Menubar -->
      <div class="flex gap-4 px-2 py-0.5 text-xs bg-[#c0c0c0] border-b border-black">
        <span class="hover:underline cursor-pointer" id="iv-menu-file">File</span>
        <span class="hover:underline cursor-pointer" id="iv-menu-edit">Edit</span>
        <span class="hover:underline cursor-pointer" id="iv-menu-view">View</span>
        <span class="hover:underline cursor-pointer" id="iv-menu-help">Help</span>
      </div>

      <!-- Toolbar -->
      <div class="flex items-center gap-1.5 p-1 bg-[#c0c0c0] border-b border-black text-xs flex-wrap">
        <label class="retro-btn !py-0.5 !px-2 cursor-pointer flex items-center gap-1">
          <span>📂 Open...</span>
          <input type="file" id="iv-file-input" accept="image/*" class="hidden" />
        </label>
        <select id="iv-sample-select" class="retro-select !py-0.5 !px-1 text-xs font-mono">
          <option value="">Sample Images...</option>
          ${sampleImages.map((s) => `<option value="${s.src}">${s.name}</option>`).join('')}
        </select>
        <div class="w-px h-4 bg-black/40 mx-0.5"></div>
        <button id="iv-zoom-in" class="retro-btn !py-0.5 !px-2 font-bold" title="Zoom In">🔍 Zoom +</button>
        <button id="iv-zoom-out" class="retro-btn !py-0.5 !px-2 font-bold" title="Zoom Out">🔍 Zoom -</button>
        <button id="iv-rotate" class="retro-btn !py-0.5 !px-2 font-bold" title="Rotate 90 Degrees">🔄 Rotate</button>
        <button id="iv-invert" class="retro-btn !py-0.5 !px-2" title="Invert Colors">Invert</button>
        <button id="iv-set-wallpaper" class="retro-btn !py-0.5 !px-2 font-bold text-blue-900 ml-auto">Set Wallpaper 🖼️</button>
      </div>

      <!-- Canvas / Image Display -->
      <div class="flex-1 bg-[#808080] p-4 flex items-center justify-center overflow-auto relative">
        <img id="iv-image" src="${initialImagePath || '/images/windows-95-computer.svg'}" alt="Preview" class="max-w-full max-h-full object-contain shadow-[4px_4px_0px_#000000] border-2 border-white transition-transform duration-100" />
      </div>

      <!-- Statusbar -->
      <div class="px-2 py-0.5 text-[11px] bg-[#c0c0c0] border-t border-white flex justify-between">
        <span id="iv-status">Ready</span>
        <span id="iv-zoom-level">Zoom: 100%</span>
      </div>
    </div>
  `;

  const img = container.querySelector('#iv-image') as HTMLImageElement;
  const fileInput = container.querySelector('#iv-file-input') as HTMLInputElement;
  const sampleSelect = container.querySelector('#iv-sample-select') as HTMLSelectElement;
  const zoomIn = container.querySelector('#iv-zoom-in');
  const zoomOut = container.querySelector('#iv-zoom-out');
  const rotateBtn = container.querySelector('#iv-rotate');
  const invertBtn = container.querySelector('#iv-invert');
  const wallpaperBtn = container.querySelector('#iv-set-wallpaper');
  const zoomLevelEl = container.querySelector('#iv-zoom-level') as HTMLElement;
  const statusEl = container.querySelector('#iv-status') as HTMLElement;

  let scale = 1;
  let rotation = 0;
  let isInverted = false;

  function updateTransform() {
    if (img) {
      img.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
      img.style.filter = isInverted ? 'invert(100%)' : 'none';
      if (zoomLevelEl) zoomLevelEl.textContent = `Zoom: ${Math.round(scale * 100)}%`;
    }
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

  invertBtn?.addEventListener('click', () => {
    isInverted = !isInverted;
    updateTransform();
    audio.playClick();
  });

  sampleSelect?.addEventListener('change', () => {
    if (sampleSelect.value && img) {
      img.src = sampleSelect.value;
      const opt = sampleSelect.options[sampleSelect.selectedIndex];
      win.setTitle(`Image Viewer - [${opt.text}]`);
      if (statusEl) statusEl.textContent = `Loaded ${opt.text}`;
      audio.playClick();
    }
  });

  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (img && e.target?.result) {
          img.src = e.target.result as string;
          win.setTitle(`Image Viewer - [${file.name}]`);
          if (statusEl) statusEl.textContent = `Loaded ${file.name} (${Math.round(file.size / 1024)} KB)`;
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
 * 6. MIDI Player - Web Audio Polyphonic Chiptune & General MIDI Synthesizer
 */
export function renderMIDIPlayer(container: HTMLElement, win: Win95Window) {
  win.setTitle('MIDI Player 95');

  const songs: Record<string, { title: string; bpm: number; notes: Array<{ note: number; d: number }> }> = {
    canyon: {
      title: 'Windows 95 Canyon Overture',
      bpm: 120,
      notes: [
        { note: 60, d: 0.3 }, { note: 62, d: 0.3 }, { note: 64, d: 0.3 }, { note: 67, d: 0.6 },
        { note: 64, d: 0.3 }, { note: 67, d: 0.6 }, { note: 72, d: 0.9 },
        { note: 69, d: 0.3 }, { note: 67, d: 0.3 }, { note: 64, d: 0.6 }, { note: 60, d: 0.9 },
      ],
    },
    ode: {
      title: 'Beethoven - Ode to Joy',
      bpm: 130,
      notes: [
        { note: 64, d: 0.4 }, { note: 64, d: 0.4 }, { note: 65, d: 0.4 }, { note: 67, d: 0.4 },
        { note: 67, d: 0.4 }, { note: 65, d: 0.4 }, { note: 64, d: 0.4 }, { note: 62, d: 0.4 },
        { note: 60, d: 0.4 }, { note: 60, d: 0.4 }, { note: 62, d: 0.4 }, { note: 64, d: 0.4 },
        { note: 64, d: 0.6 }, { note: 62, d: 0.2 }, { note: 62, d: 0.8 },
      ],
    },
    bach: {
      title: 'J.S. Bach - Invention in D Minor',
      bpm: 110,
      notes: [
        { note: 62, d: 0.25 }, { note: 65, d: 0.25 }, { note: 69, d: 0.25 }, { note: 74, d: 0.5 },
        { note: 73, d: 0.25 }, { note: 74, d: 0.25 }, { note: 69, d: 0.5 }, { note: 65, d: 0.5 },
      ],
    },
    retro8bit: {
      title: '8-Bit Arcade Victory Fanfare',
      bpm: 140,
      notes: [
        { note: 60, d: 0.15 }, { note: 60, d: 0.15 }, { note: 60, d: 0.15 }, { note: 60, d: 0.4 },
        { note: 56, d: 0.4 }, { note: 58, d: 0.4 }, { note: 60, d: 0.3 }, { note: 58, d: 0.15 }, { note: 60, d: 0.8 },
      ],
    },
  };

  // Convert MIDI note number to Hz: f = 440 * 2^((n - 69)/12)
  function midiToFreq(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  const pianoKeys = [
    { note: 60, name: 'C4', isBlack: false },
    { note: 61, name: 'C#4', isBlack: true },
    { note: 62, name: 'D4', isBlack: false },
    { note: 63, name: 'D#4', isBlack: true },
    { note: 64, name: 'E4', isBlack: false },
    { note: 65, name: 'F4', isBlack: false },
    { note: 66, name: 'F#4', isBlack: true },
    { note: 67, name: 'G4', isBlack: false },
    { note: 68, name: 'G#4', isBlack: true },
    { note: 69, name: 'A4', isBlack: false },
    { note: 70, name: 'A#4', isBlack: true },
    { note: 71, name: 'B4', isBlack: false },
    { note: 72, name: 'C5', isBlack: false },
    { note: 73, name: 'C#5', isBlack: true },
    { note: 74, name: 'D5', isBlack: false },
    { note: 75, name: 'D#5', isBlack: true },
    { note: 76, name: 'E5', isBlack: false },
    { note: 77, name: 'F5', isBlack: false },
    { note: 78, name: 'F#5', isBlack: true },
    { note: 79, name: 'G5', isBlack: false },
    { note: 80, name: 'G#5', isBlack: true },
    { note: 81, name: 'A5', isBlack: false },
    { note: 82, name: 'A#5', isBlack: true },
    { note: 83, name: 'B5', isBlack: false },
  ];

  let isPlayingSong = false;
  let songTimer: number | null = null;
  let currentInstrument: OscillatorType = 'triangle';

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <!-- Title & Header -->
      <div class="p-3 space-y-2 bg-[#c0c0c0] flex-1">
        <div class="retro-inset p-3 bg-black text-cyan-400 border-2 border-white shadow-inner">
          <div class="flex justify-between items-center text-xs">
            <span class="font-bold text-yellow-300">General MIDI Synthesizer 95</span>
            <span class="text-[10px] text-gray-400">16 Voices Polyphonic</span>
          </div>
          <div class="text-base font-bold mt-1 text-green-400" id="midi-title">Song: Windows 95 Canyon Overture</div>
          <div class="text-[10px] text-gray-400 mt-0.5" id="midi-voice-info">Voice: Acoustic Grand Piano | Web Audio Synth</div>
        </div>

        <!-- MIDI Controls -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-bold">Song:</label>
          <select id="midi-select" class="retro-select flex-1 px-2 py-0.5 text-xs font-mono">
            <option value="canyon">Canyon.mid (Windows 95 Overture)</option>
            <option value="ode">OdeToJoy.mid (Beethoven 9th)</option>
            <option value="bach">Invention.mid (J.S. Bach D Minor)</option>
            <option value="retro8bit">Arcade.mid (8-Bit Victory)</option>
          </select>
          <select id="midi-inst-select" class="retro-select px-2 py-0.5 text-xs font-mono">
            <option value="triangle">Acoustic Piano</option>
            <option value="square">8-Bit Square Lead</option>
            <option value="sine">FM Bell Synth</option>
            <option value="sawtooth">Retro Brass</option>
          </select>
        </div>

        <!-- Interactive Piano Keyboard Visualization -->
        <div class="pt-2">
          <div class="text-[10px] font-bold text-gray-700 mb-1">Interactive Keyboard (Click keys to play):</div>
          <div class="relative h-24 bg-gray-200 border-2 border-black flex justify-center p-1 select-none overflow-x-auto shadow-inner" id="midi-keyboard">
            ${pianoKeys.filter(k => !k.isBlack).map(k => `
              <div class="piano-white-key relative bg-white border border-black hover:bg-yellow-100 active:bg-yellow-200 w-7 h-full cursor-pointer flex items-end justify-center pb-1 text-[8px] text-gray-500 font-bold transition-colors" data-note="${k.note}">
                ${k.name}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-between pt-2 border-t border-white">
          <div class="flex gap-2">
            <button id="midi-play-btn" class="retro-btn !px-4 !py-1 font-bold text-xs">▶ Play MIDI</button>
            <button id="midi-stop-btn" class="retro-btn !px-4 !py-1 font-bold text-xs">◼ Stop</button>
          </div>
          <span class="text-[10px] text-gray-600 font-bold">Standard MIDI File Format 0/1</span>
        </div>
      </div>
    </div>
  `;

  const playBtn = container.querySelector('#midi-play-btn');
  const stopBtn = container.querySelector('#midi-stop-btn');
  const songSelect = container.querySelector('#midi-select') as HTMLSelectElement;
  const instSelect = container.querySelector('#midi-inst-select') as HTMLSelectElement;
  const titleEl = container.querySelector('#midi-title') as HTMLElement;
  const voiceInfoEl = container.querySelector('#midi-voice-info') as HTMLElement;

  function highlightKey(noteNum: number, duration: number) {
    const keyEl = container.querySelector(`[data-note="${noteNum}"]`) as HTMLElement;
    if (keyEl) {
      keyEl.classList.add('!bg-green-400');
      setTimeout(() => {
        keyEl.classList.remove('!bg-green-400');
      }, duration * 1000 * 0.9);
    }
  }

  function playKeyNote(noteNum: number, duration = 0.3) {
    const freq = midiToFreq(noteNum);
    audio.playTone(freq, duration, currentInstrument, 0.15);
    highlightKey(noteNum, duration);
  }

  // Piano click events
  container.querySelectorAll('[data-note]').forEach((k) => {
    k.addEventListener('click', () => {
      const n = parseInt(k.getAttribute('data-note') || '60', 10);
      playKeyNote(n, 0.4);
    });
  });

  instSelect?.addEventListener('change', () => {
    currentInstrument = instSelect.value as OscillatorType;
    if (voiceInfoEl) voiceInfoEl.textContent = `Voice: ${instSelect.options[instSelect.selectedIndex].text} | Web Audio Synth`;
    audio.playClick();
  });

  playBtn?.addEventListener('click', () => {
    if (isPlayingSong) return;
    isPlayingSong = true;
    audio.playClick();

    const curSong = songs[songSelect.value] || songs.canyon;
    if (titleEl) titleEl.textContent = `Song: ${curSong.title}`;
    win.setTitle(`MIDI Player - [${curSong.title}] (Playing)`);

    let idx = 0;
    const playNext = () => {
      if (!isPlayingSong) return;
      if (idx >= curSong.notes.length) {
        idx = 0; // Loop song
      }
      const item = curSong.notes[idx];
      playKeyNote(item.note, item.d);
      idx++;
      songTimer = window.setTimeout(playNext, item.d * 1000);
    };

    playNext();
  });

  stopBtn?.addEventListener('click', () => {
    isPlayingSong = false;
    if (songTimer) {
      clearTimeout(songTimer);
      songTimer = null;
    }
    win.setTitle('MIDI Player 95 - (Stopped)');
    audio.playClick();
  });

  win.element.addEventListener('DOMNodeRemovedFromDocument', () => {
    isPlayingSong = false;
    if (songTimer) clearTimeout(songTimer);
  });
}
