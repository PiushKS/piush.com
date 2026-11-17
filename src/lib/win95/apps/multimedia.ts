// Piush 95 - Multimedia Collection
// Media Player, CD Player, Sound Recorder, Volume Control, Image Viewer, MIDI Player

import { audio } from '../audio';
import { vfs } from '../fs';
import type { Win95Window } from '../windowManager';

/**
 * 1. Media Player - Full Multi-Track Audio/Video & MIDI Synthesis Engine
 */
export function renderMediaPlayer(container: HTMLElement, win: Win95Window) {
  win.setTitle('Media Player - [CANYON.MID] (Stopped)');

  interface SynthNote {
    f: number;
    d: number;
    type?: OscillatorType;
    vol?: number;
  }

  interface SynthStep {
    lead?: SynthNote;
    bass?: SynthNote;
    chords?: number[];
    perc?: 'kick' | 'snare' | 'hihat';
  }

  interface Track {
    id: string;
    name: string;
    file: string;
    duration: number; // in seconds
    type: 'midi' | 'wave' | 'chiptune' | 'custom';
    stepMs: number;
    description: string;
    sequence: SynthStep[];
  }

  // Built-in classic Windows 95 tracks with polyphonic arrangements
  const canyonSeq: SynthStep[] = [
    // Bar 1
    { lead: { f: 523.25, d: 0.18, type: 'sawtooth' }, bass: { f: 130.81, d: 0.2 }, chords: [261.63, 329.63, 392.00], perc: 'kick' },
    { lead: { f: 587.33, d: 0.18, type: 'sawtooth' }, bass: { f: 130.81, d: 0.15 }, perc: 'hihat' },
    { lead: { f: 659.25, d: 0.18, type: 'sawtooth' }, bass: { f: 196.00, d: 0.2 }, chords: [261.63, 329.63, 392.00], perc: 'snare' },
    { lead: { f: 783.99, d: 0.35, type: 'sawtooth' }, bass: { f: 130.81, d: 0.15 }, perc: 'hihat' },
    // Bar 2
    { lead: { f: 659.25, d: 0.18, type: 'sawtooth' }, bass: { f: 174.61, d: 0.2 }, chords: [349.23, 440.00, 523.25], perc: 'kick' },
    { lead: { f: 783.99, d: 0.35, type: 'sawtooth' }, bass: { f: 174.61, d: 0.15 }, perc: 'hihat' },
    { lead: { f: 1046.5, d: 0.45, type: 'sawtooth' }, bass: { f: 196.00, d: 0.2 }, chords: [392.00, 493.88, 587.33], perc: 'snare' },
    { bass: { f: 196.00, d: 0.15 }, perc: 'hihat' },
    // Bar 3
    { lead: { f: 880.00, d: 0.18, type: 'sawtooth' }, bass: { f: 220.00, d: 0.2 }, chords: [440.00, 523.25, 659.25], perc: 'kick' },
    { lead: { f: 783.99, d: 0.18, type: 'sawtooth' }, bass: { f: 220.00, d: 0.15 }, perc: 'hihat' },
    { lead: { f: 659.25, d: 0.35, type: 'sawtooth' }, bass: { f: 196.00, d: 0.2 }, chords: [392.00, 493.88, 587.33], perc: 'snare' },
    { lead: { f: 523.25, d: 0.50, type: 'sawtooth' }, bass: { f: 130.81, d: 0.2 }, chords: [261.63, 329.63, 392.00], perc: 'hihat' },
    // Bar 4
    { lead: { f: 587.33, d: 0.22, type: 'sawtooth' }, bass: { f: 146.83, d: 0.2 }, chords: [293.66, 369.99, 440.00], perc: 'kick' },
    { lead: { f: 659.25, d: 0.22, type: 'sawtooth' }, bass: { f: 146.83, d: 0.15 }, perc: 'hihat' },
    { lead: { f: 587.33, d: 0.30, type: 'sawtooth' }, bass: { f: 196.00, d: 0.2 }, chords: [392.00, 493.88, 587.33], perc: 'snare' },
    { lead: { f: 523.25, d: 0.60, type: 'sawtooth' }, bass: { f: 130.81, d: 0.3 }, chords: [261.63, 329.63, 392.00], perc: 'hihat' },
  ];

  const passportSeq: SynthStep[] = [
    { lead: { f: 440.00, d: 0.2, type: 'square' }, bass: { f: 110.00, d: 0.25 }, chords: [220.00, 277.18, 329.63], perc: 'kick' },
    { bass: { f: 110.00, d: 0.15 }, perc: 'hihat' },
    { lead: { f: 554.37, d: 0.2, type: 'square' }, bass: { f: 164.81, d: 0.2 }, chords: [220.00, 277.18, 329.63], perc: 'snare' },
    { lead: { f: 659.25, d: 0.2, type: 'square' }, bass: { f: 110.00, d: 0.15 }, perc: 'hihat' },
    { lead: { f: 880.00, d: 0.4, type: 'square' }, bass: { f: 146.83, d: 0.25 }, chords: [293.66, 369.99, 440.00], perc: 'kick' },
    { lead: { f: 740.00, d: 0.2, type: 'square' }, bass: { f: 146.83, d: 0.15 }, perc: 'hihat' },
    { lead: { f: 659.25, d: 0.2, type: 'square' }, bass: { f: 164.81, d: 0.2 }, chords: [329.63, 415.30, 493.88], perc: 'snare' },
    { lead: { f: 554.37, d: 0.4, type: 'square' }, bass: { f: 110.00, d: 0.25 }, chords: [220.00, 277.18, 329.63], perc: 'hihat' },
  ];

  const chiptuneSeq: SynthStep[] = [
    { lead: { f: 261.63, d: 0.12, type: 'square' }, bass: { f: 130.81, d: 0.18, type: 'triangle' }, perc: 'kick' },
    { lead: { f: 329.63, d: 0.12, type: 'square' }, bass: { f: 130.81, d: 0.12, type: 'triangle' }, perc: 'hihat' },
    { lead: { f: 392.00, d: 0.12, type: 'square' }, bass: { f: 196.00, d: 0.18, type: 'triangle' }, perc: 'snare' },
    { lead: { f: 523.25, d: 0.22, type: 'square' }, bass: { f: 130.81, d: 0.12, type: 'triangle' }, perc: 'hihat' },
    { lead: { f: 659.25, d: 0.12, type: 'square' }, bass: { f: 174.61, d: 0.18, type: 'triangle' }, perc: 'kick' },
    { lead: { f: 783.99, d: 0.12, type: 'square' }, bass: { f: 174.61, d: 0.12, type: 'triangle' }, perc: 'hihat' },
    { lead: { f: 1046.5, d: 0.25, type: 'square' }, bass: { f: 196.00, d: 0.18, type: 'triangle' }, perc: 'snare' },
    { lead: { f: 783.99, d: 0.12, type: 'square' }, bass: { f: 196.00, d: 0.12, type: 'triangle' }, perc: 'hihat' },
  ];

  const beethovenSeq: SynthStep[] = [
    { lead: { f: 659.25, d: 0.3, type: 'sine' }, bass: { f: 164.81, d: 0.35, type: 'triangle' }, chords: [329.63, 392.00, 523.25] },
    { lead: { f: 659.25, d: 0.3, type: 'sine' }, bass: { f: 164.81, d: 0.35, type: 'triangle' }, chords: [329.63, 392.00, 523.25] },
    { lead: { f: 698.46, d: 0.3, type: 'sine' }, bass: { f: 174.61, d: 0.35, type: 'triangle' }, chords: [349.23, 440.00, 523.25] },
    { lead: { f: 783.99, d: 0.3, type: 'sine' }, bass: { f: 196.00, d: 0.35, type: 'triangle' }, chords: [392.00, 493.88, 587.33] },
    { lead: { f: 783.99, d: 0.3, type: 'sine' }, bass: { f: 196.00, d: 0.35, type: 'triangle' }, chords: [392.00, 493.88, 587.33] },
    { lead: { f: 698.46, d: 0.3, type: 'sine' }, bass: { f: 174.61, d: 0.35, type: 'triangle' }, chords: [349.23, 440.00, 523.25] },
    { lead: { f: 659.25, d: 0.3, type: 'sine' }, bass: { f: 164.81, d: 0.35, type: 'triangle' }, chords: [329.63, 392.00, 523.25] },
    { lead: { f: 587.33, d: 0.3, type: 'sine' }, bass: { f: 146.83, d: 0.35, type: 'triangle' }, chords: [293.66, 369.99, 440.00] },
    { lead: { f: 523.25, d: 0.3, type: 'sine' }, bass: { f: 130.81, d: 0.35, type: 'triangle' }, chords: [261.63, 329.63, 392.00] },
    { lead: { f: 523.25, d: 0.3, type: 'sine' }, bass: { f: 130.81, d: 0.35, type: 'triangle' }, chords: [261.63, 329.63, 392.00] },
    { lead: { f: 587.33, d: 0.3, type: 'sine' }, bass: { f: 146.83, d: 0.35, type: 'triangle' }, chords: [293.66, 369.99, 440.00] },
    { lead: { f: 659.25, d: 0.3, type: 'sine' }, bass: { f: 164.81, d: 0.35, type: 'triangle' }, chords: [329.63, 392.00, 523.25] },
    { lead: { f: 659.25, d: 0.45, type: 'sine' }, bass: { f: 164.81, d: 0.45, type: 'triangle' }, chords: [329.63, 392.00, 523.25] },
    { lead: { f: 587.33, d: 0.15, type: 'sine' }, bass: { f: 146.83, d: 0.20, type: 'triangle' } },
    { lead: { f: 587.33, d: 0.60, type: 'sine' }, bass: { f: 146.83, d: 0.60, type: 'triangle' }, chords: [293.66, 369.99, 440.00] },
  ];

  const welcomeSeq: SynthStep[] = [
    { lead: { f: 311.13, d: 0.4, type: 'triangle' }, bass: { f: 77.78, d: 0.9, type: 'sine' }, chords: [155.56, 233.08, 311.13] },
    { lead: { f: 466.16, d: 0.4, type: 'triangle' }, chords: [233.08, 311.13, 388.91] },
    { lead: { f: 622.25, d: 0.6, type: 'sine' }, bass: { f: 155.56, d: 1.2, type: 'sine' }, chords: [311.13, 388.91, 466.16, 622.25] },
    { lead: { f: 932.33, d: 0.8, type: 'sine' }, chords: [466.16, 622.25, 777.82, 932.33] },
    { lead: { f: 1244.5, d: 1.5, type: 'sine' }, bass: { f: 77.78, d: 1.8, type: 'sine' }, chords: [311.13, 466.16, 622.25, 932.33, 1244.5] },
  ];

  const themicSeq: SynthStep[] = [
    { lead: { f: 440.00, d: 0.2, type: 'sawtooth' }, bass: { f: 110.00, d: 0.25 }, perc: 'kick' },
    { lead: { f: 523.25, d: 0.2, type: 'sawtooth' }, bass: { f: 110.00, d: 0.15 }, perc: 'hihat' },
    { lead: { f: 659.25, d: 0.2, type: 'sawtooth' }, bass: { f: 130.81, d: 0.25 }, chords: [261.63, 329.63, 440.00], perc: 'snare' },
    { lead: { f: 587.33, d: 0.2, type: 'sawtooth' }, bass: { f: 110.00, d: 0.15 }, perc: 'hihat' },
    { lead: { f: 523.25, d: 0.35, type: 'sawtooth' }, bass: { f: 87.31, d: 0.3 }, chords: [174.61, 261.63, 349.23], perc: 'kick' },
    { lead: { f: 440.00, d: 0.4, type: 'sawtooth' }, bass: { f: 110.00, d: 0.3 }, chords: [220.00, 261.63, 329.63], perc: 'snare' },
  ];

  const tracks: Track[] = [
    {
      id: 'canyon',
      name: 'CANYON.MID',
      file: 'C:\\WINDOWS\\MEDIA\\CANYON.MID',
      duration: 120,
      type: 'midi',
      stepMs: 250,
      description: 'Windows 95 Overture - George Stone',
      sequence: canyonSeq,
    },
    {
      id: 'passport',
      name: 'PASSPORT.MID',
      file: 'C:\\WINDOWS\\MEDIA\\PASSPORT.MID',
      duration: 95,
      type: 'midi',
      stepMs: 240,
      description: 'World Grooves Funk Jam',
      sequence: passportSeq,
    },
    {
      id: 'chiptune',
      name: 'CHIPTUNE.MID',
      file: 'C:\\WINDOWS\\MEDIA\\CHIPTUNE.MID',
      duration: 80,
      type: 'chiptune',
      stepMs: 180,
      description: 'Retro 8-Bit Arcade Soundtrack',
      sequence: chiptuneSeq,
    },
    {
      id: 'beethoven',
      name: 'BEETHOVEN.MID',
      file: 'C:\\WINDOWS\\MEDIA\\BEETHOVEN.MID',
      duration: 105,
      type: 'midi',
      stepMs: 380,
      description: 'Symphony No. 9 - Ode to Joy',
      sequence: beethovenSeq,
    },
    {
      id: 'themic',
      name: 'THEMIC.MID',
      file: 'C:\\WINDOWS\\MEDIA\\THEMIC.MID',
      duration: 75,
      type: 'midi',
      stepMs: 220,
      description: 'The Microsoft Network Groove',
      sequence: themicSeq,
    },
    {
      id: 'welcome',
      name: 'WELCOME.WAV',
      file: 'C:\\WINDOWS\\MEDIA\\WELCOME.WAV',
      duration: 12,
      type: 'wave',
      stepMs: 700,
      description: 'Windows 95 Orchestral Fanfare',
      sequence: welcomeSeq,
    },
  ];

  let currentTrackIdx = 0;
  let isPlaying = false;
  let isPaused = false;
  let currentTime = 0;
  let stepIndex = 0;
  let synthTimer: number | null = null;
  let animId: number | null = null;
  let isLooping = false;
  let volume = audio.getMasterVolume();
  let isMuted = false;
  let visMode: 'equalizer' | 'oscilloscope' | 'vumeter' = 'equalizer';

  // Custom audio playback
  let customAudioBlobUrl: string | null = null;
  let customAudioElement: HTMLAudioElement | null = null;
  let customFileName: string | null = null;
  let customDuration = 0;

  // Web Audio Nodes for synthesis & visualization
  let analyserNode: AnalyserNode | null = null;
  let masterGainNode: GainNode | null = null;
  let activeOscillators: OscillatorNode[] = [];

  // Setup Web Audio graph
  function setupWebAudio() {
    const ctx = audio.getAudioContext();
    if (!ctx) return;
    try {
      if (!analyserNode) {
        analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 64;
        analyserNode.smoothingTimeConstant = 0.8;
      }
      if (!masterGainNode) {
        masterGainNode = ctx.createGain();
        masterGainNode.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
        analyserNode.connect(masterGainNode);
        masterGainNode.connect(ctx.destination);
      }
    } catch (_) {}
  }

  // Peak hold data for equalizer
  const peakValues: number[] = new Array(32).fill(0);
  const peakDecay: number[] = new Array(32).fill(0);
  let vuLeft = 0;
  let vuRight = 0;

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none overflow-hidden">
      <!-- Menubar -->
      <div class="flex gap-4 px-2 py-0.5 text-xs bg-[#c0c0c0] border-b border-black shrink-0">
        <span class="hover:underline cursor-pointer" id="mp-menu-file">File</span>
        <span class="hover:underline cursor-pointer" id="mp-menu-edit">Edit</span>
        <span class="hover:underline cursor-pointer" id="mp-menu-device">Device</span>
        <span class="hover:underline cursor-pointer" id="mp-menu-scale">Scale</span>
        <span class="hover:underline cursor-pointer" id="mp-menu-help">Help</span>
      </div>

      <!-- Main Visual Display Area -->
      <div class="p-2 bg-[#c0c0c0] flex-1 flex flex-col min-h-0">
        <div class="relative flex-1 bg-[#05050d] border-2 border-black border-t-[#404040] border-l-[#404040] border-b-white border-r-white overflow-hidden flex items-center justify-center cursor-pointer group" id="mp-canvas-container" title="Click visualizer to cycle modes (Equalizer / Oscilloscope / VU Meters)">
          <canvas id="mp-visualizer" width="440" height="190" class="block w-full h-full"></canvas>

          <!-- Top Overlay: Track Name -->
          <div id="mp-title-overlay" class="absolute top-2 left-2 text-[#00ff66] text-xs font-bold drop-shadow-[0_1px_2px_black] truncate max-w-[70%]">
            ▶ Track: CANYON.MID (Windows 95 Overture)
          </div>

          <!-- Top-Right Overlay: Mode Switcher -->
          <button type="button" id="mp-mode-overlay" class="absolute top-2 right-2 text-cyan-300 text-[10px] font-mono bg-black/60 px-1.5 py-0.5 border border-cyan-500/40 hover:bg-cyan-900/40 cursor-pointer">
            [MODE: 32-EQ]
          </button>

          <!-- Bottom Time Overlay -->
          <div id="mp-time-overlay" class="absolute bottom-2 right-2 text-yellow-300 text-[11px] font-bold font-mono bg-black/70 px-1.5 py-0.5 border border-yellow-500/40">
            00:00 / 02:00
          </div>
        </div>

        <!-- Progress Timeline & Seekbar -->
        <div class="mt-2 px-1 flex items-center gap-2 shrink-0">
          <span id="mp-current-time" class="text-xs text-gray-900 w-12 font-bold font-mono">00:00</span>
          <input type="range" id="mp-seekbar" min="0" max="100" value="0" step="0.5" class="flex-1 cursor-pointer" title="Scrub Playback Position" />
          <span id="mp-total-time" class="text-xs text-gray-900 w-12 text-right font-bold font-mono">02:00</span>
        </div>

        <!-- Primary Transport Controls Bar -->
        <div class="mt-2 pt-2 border-t border-white flex flex-wrap items-center justify-between gap-1.5 shrink-0">
          <!-- Buttons Strip -->
          <div class="flex items-center gap-1">
            <button id="mp-play-btn" class="retro-btn !p-1 size-7 flex items-center justify-center text-xs font-bold" title="Play">▶</button>
            <button id="mp-pause-btn" class="retro-btn !p-1 size-7 flex items-center justify-center text-xs font-bold" title="Pause">❚❚</button>
            <button id="mp-stop-btn" class="retro-btn !p-1 size-7 flex items-center justify-center text-xs font-bold" title="Stop">◼</button>
            <div class="w-px h-5 bg-black/40 mx-0.5"></div>
            <button id="mp-prev-btn" class="retro-btn !p-1 size-7 flex items-center justify-center text-xs font-bold" title="Previous Track">|◀</button>
            <button id="mp-rewind-btn" class="retro-btn !p-1 size-7 flex items-center justify-center text-xs font-bold" title="Rewind 5s">◀◀</button>
            <button id="mp-forward-btn" class="retro-btn !p-1 size-7 flex items-center justify-center text-xs font-bold" title="Fast Forward 5s">▶▶</button>
            <button id="mp-next-btn" class="retro-btn !p-1 size-7 flex items-center justify-center text-xs font-bold" title="Next Track">▶|</button>
            <div class="w-px h-5 bg-black/40 mx-0.5"></div>
            <button id="mp-loop-btn" class="retro-btn !p-1 size-7 flex items-center justify-center text-xs" title="Repeat Track">🔁</button>
            <button id="mp-eject-btn" class="retro-btn !p-1 size-7 flex items-center justify-center text-xs text-red-700" title="Open Local Audio File">⏏</button>
          </div>

          <!-- Track Selection & Volume Strip -->
          <div class="flex items-center gap-2">
            <!-- Track Dropdown -->
            <select id="mp-track-select" class="retro-select !py-0.5 !px-1 text-xs font-mono max-w-[155px]" title="Select Audio Track">
              ${tracks.map((t, idx) => `<option value="${idx}">${t.name}</option>`).join('')}
            </select>

            <!-- Open File Button & Hidden Input -->
            <label class="retro-btn !py-0.5 !px-1.5 text-xs cursor-pointer flex items-center gap-1 shrink-0" title="Open MP3, WAV, MID, OGG from your computer">
              <span>📂 Open...</span>
              <input type="file" id="mp-file-input" accept="audio/*,.mid,.midi" class="hidden" />
            </label>

            <!-- Volume Slider & Mute -->
            <div class="flex items-center gap-1 border-l border-white/60 pl-1.5 shrink-0">
              <button id="mp-mute-btn" class="retro-btn !p-0.5 size-6 flex items-center justify-center text-xs" title="Mute / Unmute">🔊</button>
              <input type="range" id="mp-volume-slider" min="0" max="100" value="${Math.round(volume * 100)}" class="w-14 cursor-pointer" title="Volume" />
              <span id="mp-vol-label" class="text-[10px] w-6 text-gray-700 font-mono">${Math.round(volume * 100)}%</span>
            </div>
          </div>
        </div>

        <!-- Status Bar -->
        <div class="mt-2 pt-1 border-t border-black/30 flex items-center justify-between text-[11px] text-gray-800 shrink-0">
          <div class="flex items-center gap-2">
            <span id="mp-status-badge" class="font-bold text-gray-700">● Stopped</span>
            <span class="text-gray-500">|</span>
            <span id="mp-device-name">MIDI Sequencer (16 Voices)</span>
          </div>
          <div class="flex items-center gap-2">
            <span id="mp-format-info" class="text-[10px] text-gray-600">Stereo 44.1 kHz 16-Bit</span>
            <button id="mp-cycle-vis-btn" class="hover:underline text-blue-900 cursor-pointer text-[10px]" title="Change visualization mode">
              [Visualizer: Equalizer]
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Grab DOM elements
  const canvas = container.querySelector('#mp-visualizer') as HTMLCanvasElement;
  const ctx = canvas?.getContext('2d');
  const canvasContainer = container.querySelector('#mp-canvas-container');
  const playBtn = container.querySelector('#mp-play-btn');
  const pauseBtn = container.querySelector('#mp-pause-btn');
  const stopBtn = container.querySelector('#mp-stop-btn');
  const prevBtn = container.querySelector('#mp-prev-btn');
  const nextBtn = container.querySelector('#mp-next-btn');
  const rewindBtn = container.querySelector('#mp-rewind-btn');
  const forwardBtn = container.querySelector('#mp-forward-btn');
  const loopBtn = container.querySelector('#mp-loop-btn');
  const ejectBtn = container.querySelector('#mp-eject-btn');
  const seekbar = container.querySelector('#mp-seekbar') as HTMLInputElement;
  const curTimeEl = container.querySelector('#mp-current-time') as HTMLElement;
  const totalTimeEl = container.querySelector('#mp-total-time') as HTMLElement;
  const fileInput = container.querySelector('#mp-file-input') as HTMLInputElement;
  const titleOverlay = container.querySelector('#mp-title-overlay') as HTMLElement;
  const modeOverlay = container.querySelector('#mp-mode-overlay') as HTMLElement;
  const timeOverlay = container.querySelector('#mp-time-overlay') as HTMLElement;
  const trackSelect = container.querySelector('#mp-track-select') as HTMLSelectElement;
  const volumeSlider = container.querySelector('#mp-volume-slider') as HTMLInputElement;
  const muteBtn = container.querySelector('#mp-mute-btn');
  const volLabel = container.querySelector('#mp-vol-label') as HTMLElement;
  const statusBadge = container.querySelector('#mp-status-badge') as HTMLElement;
  const deviceNameEl = container.querySelector('#mp-device-name') as HTMLElement;
  const formatInfoEl = container.querySelector('#mp-format-info') as HTMLElement;
  const cycleVisBtn = container.querySelector('#mp-cycle-vis-btn');

  function formatTime(sec: number): string {
    const s = Math.max(0, Math.floor(sec));
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    const remS = String(s % 60).padStart(2, '0');
    return `${m}:${remS}`;
  }

  function getActiveTrackDuration(): number {
    if (customAudioElement && !isNaN(customAudioElement.duration) && customAudioElement.duration > 0) {
      return customAudioElement.duration;
    }
    return tracks[currentTrackIdx]?.duration || 120;
  }

  function getActiveTrackName(): string {
    if (customFileName) return customFileName;
    return tracks[currentTrackIdx]?.name || 'CANYON.MID';
  }

  function updateTrackDisplay() {
    const dur = getActiveTrackDuration();
    const name = getActiveTrackName();
    const curStr = formatTime(currentTime);
    const totStr = formatTime(dur);

    if (curTimeEl) curTimeEl.textContent = curStr;
    if (totalTimeEl) totalTimeEl.textContent = totStr;
    if (timeOverlay) timeOverlay.textContent = `${curStr} / ${totStr}`;

    if (customFileName) {
      if (titleOverlay) titleOverlay.textContent = `▶ File: ${customFileName}`;
      if (deviceNameEl) deviceNameEl.textContent = 'ActiveMovie Audio Stream';
      if (formatInfoEl) formatInfoEl.textContent = 'MP3/WAV 44.1 kHz DirectSound';
    } else {
      const cur = tracks[currentTrackIdx];
      if (titleOverlay) titleOverlay.textContent = `▶ Track: ${cur.name} (${cur.description})`;
      if (deviceNameEl) deviceNameEl.textContent = cur.type === 'chiptune' ? 'Sound Blaster OPL3 Chip' : 'MIDI Sequencer (General MIDI)';
      if (formatInfoEl) formatInfoEl.textContent = cur.type === 'wave' ? 'PCM WaveAudio 16-Bit' : '16-Voice MIDI Synthesizer';
    }

    const stateStr = isPlaying ? 'Playing' : isPaused ? 'Paused' : 'Stopped';
    win.setTitle(`Media Player - [${name}] (${stateStr})`);

    if (statusBadge) {
      if (isPlaying) {
        statusBadge.innerHTML = '<span class="text-green-700">● Playing</span>';
      } else if (isPaused) {
        statusBadge.innerHTML = '<span class="text-yellow-700">❚❚ Paused</span>';
      } else {
        statusBadge.innerHTML = '<span class="text-gray-600">◼ Stopped</span>';
      }
    }

    if (dur > 0 && seekbar) {
      seekbar.value = String((currentTime / dur) * 100);
    }
  }

  // Stop active oscillators
  function stopActiveOscillators() {
    for (const osc of activeOscillators) {
      try {
        osc.stop();
        osc.disconnect();
      } catch (_) {}
    }
    activeOscillators = [];
  }

  // Play a synthesized polyphonic step
  function playSynthStep(step: SynthStep) {
    if (!isPlaying || isPaused) return;
    setupWebAudio();
    const ctx = audio.getAudioContext();
    if (!ctx || !analyserNode || !masterGainNode) return;

    const now = ctx.currentTime;
    const volScale = isMuted ? 0 : volume;

    // 1. Lead Melody Note
    if (step.lead && step.lead.f > 0) {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = step.lead.type || 'sawtooth';
        osc.frequency.setValueAtTime(step.lead.f, now);

        const v = (step.lead.vol || 0.16) * volScale;
        gain.gain.setValueAtTime(v, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + step.lead.d);

        osc.connect(gain);
        gain.connect(analyserNode);

        osc.start(now);
        osc.stop(now + step.lead.d);
        activeOscillators.push(osc);
        osc.onended = () => {
          activeOscillators = activeOscillators.filter((o) => o !== osc);
        };
      } catch (_) {}
    }

    // 2. Bassline Note
    if (step.bass && step.bass.f > 0) {
      try {
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = step.bass.type || 'triangle';
        bassOsc.frequency.setValueAtTime(step.bass.f, now);

        const bv = (step.bass.vol || 0.22) * volScale;
        bassGain.gain.setValueAtTime(bv, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + step.bass.d);

        bassOsc.connect(bassGain);
        bassGain.connect(analyserNode);

        bassOsc.start(now);
        bassOsc.stop(now + step.bass.d);
        activeOscillators.push(bassOsc);
        bassOsc.onended = () => {
          activeOscillators = activeOscillators.filter((o) => o !== bassOsc);
        };
      } catch (_) {}
    }

    // 3. Harmony Chords
    if (step.chords && step.chords.length > 0) {
      step.chords.forEach((freq) => {
        try {
          const chordOsc = ctx.createOscillator();
          const chordGain = ctx.createGain();
          chordOsc.type = 'sine';
          chordOsc.frequency.setValueAtTime(freq, now);

          const cv = 0.06 * volScale;
          chordGain.gain.setValueAtTime(cv, now);
          chordGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          chordOsc.connect(chordGain);
          chordGain.connect(analyserNode!);

          chordOsc.start(now);
          chordOsc.stop(now + 0.35);
          activeOscillators.push(chordOsc);
          chordOsc.onended = () => {
            activeOscillators = activeOscillators.filter((o) => o !== chordOsc);
          };
        } catch (_) {}
      });
    }

    // 4. Rhythm Percussion (Simulated Snare / Kick / Hihat)
    if (step.perc) {
      try {
        if (step.perc === 'kick') {
          const kickOsc = ctx.createOscillator();
          const kickGain = ctx.createGain();
          kickOsc.type = 'sine';
          kickOsc.frequency.setValueAtTime(140, now);
          kickOsc.frequency.exponentialRampToValueAtTime(45, now + 0.09);

          kickGain.gain.setValueAtTime(0.25 * volScale, now);
          kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

          kickOsc.connect(kickGain);
          kickGain.connect(analyserNode);
          kickOsc.start(now);
          kickOsc.stop(now + 0.09);
        } else if (step.perc === 'snare' || step.perc === 'hihat') {
          const dur = step.perc === 'snare' ? 0.12 : 0.04;
          const bufSize = Math.floor(ctx.sampleRate * dur);
          const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
          const data = noiseBuf.getChannelData(0);
          for (let i = 0; i < bufSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.03));
          }

          const noise = ctx.createBufferSource();
          noise.buffer = noiseBuf;

          const filter = ctx.createBiquadFilter();
          filter.type = step.perc === 'snare' ? 'bandpass' : 'highpass';
          filter.frequency.setValueAtTime(step.perc === 'snare' ? 1200 : 7000, now);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime((step.perc === 'snare' ? 0.18 : 0.1) * volScale, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(analyserNode);

          noise.start(now);
          noise.stop(now + dur);
        }
      } catch (_) {}
    }
  }

  // Start Playback
  function startPlayback() {
    setupWebAudio();
    const ctx = audio.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    audio.playClick();

    if (isPaused) {
      isPaused = false;
      isPlaying = true;
    } else {
      isPlaying = true;
      isPaused = false;
    }

    if (customAudioElement) {
      customAudioElement.play().catch(() => {});
    } else {
      if (synthTimer) clearInterval(synthTimer);
      const curTrack = tracks[currentTrackIdx];
      const stepMs = curTrack.stepMs || 250;

      synthTimer = window.setInterval(() => {
        if (!isPlaying || isPaused) return;
        const curSeq = curTrack.sequence;
        if (curSeq.length > 0) {
          const step = curSeq[stepIndex % curSeq.length];
          playSynthStep(step);
          stepIndex++;
        }

        currentTime += stepMs / 1000;
        const dur = curTrack.duration;
        if (currentTime >= dur) {
          if (isLooping) {
            currentTime = 0;
            stepIndex = 0;
          } else {
            // Advance to next track
            nextTrack();
            return;
          }
        }
        updateTrackDisplay();
      }, stepMs);
    }

    updateTrackDisplay();
  }

  // Pause Playback
  function pausePlayback() {
    audio.playClick();
    if (!isPlaying) return;
    isPlaying = false;
    isPaused = true;

    if (synthTimer) {
      clearInterval(synthTimer);
      synthTimer = null;
    }
    stopActiveOscillators();

    if (customAudioElement) {
      customAudioElement.pause();
    }

    updateTrackDisplay();
  }

  // Stop Playback
  function stopPlayback() {
    isPlaying = false;
    isPaused = false;
    currentTime = 0;
    stepIndex = 0;

    if (synthTimer) {
      clearInterval(synthTimer);
      synthTimer = null;
    }
    stopActiveOscillators();

    if (customAudioElement) {
      customAudioElement.pause();
      try {
        customAudioElement.currentTime = 0;
      } catch (_) {}
    }

    if (seekbar) seekbar.value = '0';
    updateTrackDisplay();
  }

  function prevTrack() {
    stopPlayback();
    if (customFileName) {
      customFileName = null;
      if (customAudioElement) {
        customAudioElement.src = '';
        customAudioElement = null;
      }
    }
    currentTrackIdx = (currentTrackIdx - 1 + tracks.length) % tracks.length;
    if (trackSelect) trackSelect.value = String(currentTrackIdx);
    updateTrackDisplay();
    startPlayback();
  }

  function nextTrack() {
    stopPlayback();
    if (customFileName) {
      customFileName = null;
      if (customAudioElement) {
        customAudioElement.src = '';
        customAudioElement = null;
      }
    }
    currentTrackIdx = (currentTrackIdx + 1) % tracks.length;
    if (trackSelect) trackSelect.value = String(currentTrackIdx);
    updateTrackDisplay();
    startPlayback();
  }

  function rewind5s() {
    audio.playClick();
    seekTo(Math.max(0, currentTime - 5));
  }

  function forward5s() {
    audio.playClick();
    const dur = getActiveTrackDuration();
    seekTo(Math.min(dur, currentTime + 5));
  }

  function seekTo(targetSec: number) {
    currentTime = targetSec;
    const dur = getActiveTrackDuration();

    if (customAudioElement && !isNaN(customAudioElement.duration)) {
      try {
        customAudioElement.currentTime = targetSec;
      } catch (_) {}
    } else {
      const curTrack = tracks[currentTrackIdx];
      const stepMs = curTrack.stepMs || 250;
      stepIndex = Math.floor((targetSec * 1000) / stepMs);
    }

    if (seekbar && dur > 0) {
      seekbar.value = String((currentTime / dur) * 100);
    }
    updateTrackDisplay();
  }

  function setVolume(newVol: number) {
    volume = Math.max(0, Math.min(1, newVol));
    if (volLabel) volLabel.textContent = `${Math.round(volume * 100)}%`;
    if (masterGainNode) {
      const ctx = audio.getAudioContext();
      if (ctx) {
        masterGainNode.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
      }
    }
    if (customAudioElement) {
      customAudioElement.volume = isMuted ? 0 : volume;
    }
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (muteBtn) muteBtn.textContent = isMuted ? '🔇' : '🔊';
    setVolume(volume);
  }

  function cycleVisMode() {
    audio.playClick();
    if (visMode === 'equalizer') {
      visMode = 'oscilloscope';
      if (modeOverlay) modeOverlay.textContent = '[MODE: OSCILLOSCOPE]';
      if (cycleVisBtn) cycleVisBtn.textContent = '[Visualizer: Oscilloscope]';
    } else if (visMode === 'oscilloscope') {
      visMode = 'vumeter';
      if (modeOverlay) modeOverlay.textContent = '[MODE: VU METERS]';
      if (cycleVisBtn) cycleVisBtn.textContent = '[Visualizer: VU Meters]';
    } else {
      visMode = 'equalizer';
      if (modeOverlay) modeOverlay.textContent = '[MODE: 32-EQ]';
      if (cycleVisBtn) cycleVisBtn.textContent = '[Visualizer: Equalizer]';
    }
  }

  // Load Custom File
  function loadCustomFile(file: File) {
    stopPlayback();
    if (customAudioBlobUrl) {
      URL.revokeObjectURL(customAudioBlobUrl);
      customAudioBlobUrl = null;
    }

    customFileName = file.name;
    customAudioBlobUrl = URL.createObjectURL(file);
    customAudioElement = new Audio(customAudioBlobUrl);
    customAudioElement.volume = isMuted ? 0 : volume;

    customAudioElement.addEventListener('loadedmetadata', () => {
      customDuration = customAudioElement?.duration || 0;
      updateTrackDisplay();
    });

    customAudioElement.addEventListener('timeupdate', () => {
      if (customAudioElement) {
        currentTime = customAudioElement.currentTime;
        updateTrackDisplay();
      }
    });

    customAudioElement.addEventListener('ended', () => {
      if (isLooping) {
        currentTime = 0;
        customAudioElement?.play().catch(() => {});
      } else {
        stopPlayback();
      }
    });

    // Attempt connecting customAudioElement to Web Audio Analyser
    setupWebAudio();
    const ctx = audio.getAudioContext();
    if (ctx && analyserNode) {
      try {
        const source = ctx.createMediaElementSource(customAudioElement);
        source.connect(analyserNode);
      } catch (_) {
        // Ignored if already connected or browser policy restricts
      }
    }

    audio.playChord();
    updateTrackDisplay();
    startPlayback();
  }

  // Visualizer Animation Loop
  function renderVisualizer() {
    if (!ctx || !canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    // Dark screen background with subtle CRT tint
    ctx.fillStyle = '#060810';
    ctx.fillRect(0, 0, w, h);

    if (visMode === 'equalizer') {
      // 32-Band Stereo Graphic Equalizer
      const bars = 32;
      const barSpacing = 2;
      const barW = Math.floor((w - barSpacing * (bars + 1)) / bars);

      let freqData: Uint8Array | null = null;
      let hasRealAudio = false;
      if (analyserNode && isPlaying) {
        freqData = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteFrequencyData(freqData);
        for (let j = 0; j < freqData.length; j++) {
          if (freqData[j] > 4) {
            hasRealAudio = true;
            break;
          }
        }
      }

      const time = Date.now() / 140;
      for (let i = 0; i < bars; i++) {
        let val = 0;
        if (isPlaying) {
          if (hasRealAudio && freqData) {
            const dataIdx = Math.floor((i / bars) * freqData.length);
            val = Math.min(1, (freqData[dataIdx] / 255) * 1.25);
          } else {
            // Synthetic dynamic EQ waveform that pulses with rhythm and frequency curve
            const pulse = (Math.sin(time * 2.5) + 1) * 0.18;
            const wave = Math.abs(Math.sin(time * 1.5 + i * 0.35)) * 0.52 + Math.abs(Math.cos(time * 0.8 + i * 0.18)) * 0.32;
            const curve = Math.sin((i / (bars - 1)) * Math.PI) * 0.3 + 0.7;
            val = Math.min(0.96, (wave + pulse) * curve);
          }
        }

        const barH = Math.max(3, val * (h - 25));

        // Peak Hold logic
        if (val > (peakValues[i] || 0)) {
          peakValues[i] = val;
          peakDecay[i] = 16;
        } else {
          if (peakDecay[i] > 0) {
            peakDecay[i]--;
          } else {
            peakValues[i] = Math.max(0, (peakValues[i] || 0) - 0.035);
          }
        }

        const x = barSpacing + i * (barW + barSpacing);
        const y = h - barH;

        // Gradient: Green -> Yellow -> Red
        const grad = ctx.createLinearGradient(0, h, 0, h - (h - 25));
        grad.addColorStop(0, '#00ff44');
        grad.addColorStop(0.65, '#ffdd00');
        grad.addColorStop(0.95, '#ff2233');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barW, barH);

        // Segmented LED lines (classic hardware hi-fi look)
        ctx.fillStyle = '#060810';
        for (let segY = h; segY > y; segY -= 4) {
          ctx.fillRect(x, segY, barW, 1);
        }

        // Peak indicator bar
        const peakY = h - (peakValues[i] || 0) * (h - 25);
        if (peakY < h - 4) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, peakY, barW, 2);
        }
      }
    } else if (visMode === 'oscilloscope') {
      // CRT Phosphor Waveform
      // Background Grid
      ctx.strokeStyle = '#0d2215';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Center crosshair
      ctx.strokeStyle = '#1a4428';
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.stroke();

      let timeData: Uint8Array | null = null;
      let hasRealOsc = false;
      if (analyserNode && isPlaying) {
        timeData = new Uint8Array(analyserNode.fftSize);
        analyserNode.getByteTimeDomainData(timeData);
        for (let j = 0; j < timeData.length; j++) {
          if (Math.abs(timeData[j] - 128) > 3) {
            hasRealOsc = true;
            break;
          }
        }
      }

      // Draw glowing oscilloscope beam
      ctx.strokeStyle = '#39ff14';
      ctx.shadowColor = '#00ff66';
      ctx.shadowBlur = isPlaying ? 8 : 2;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const sliceW = w / (timeData ? timeData.length : 64);
      const time = Date.now() / 80;

      for (let i = 0; i < (timeData ? timeData.length : 64); i++) {
        let v = 0.5;
        if (isPlaying) {
          if (hasRealOsc && timeData) {
            v = timeData[i] / 255.0;
          } else {
            v = 0.5 + Math.sin(time + i * 0.42) * 0.22 + Math.sin(time * 2.1 + i * 0.85) * 0.11;
          }
        } else {
          v = 0.5 + Math.sin(i * 0.1) * 0.01; // gentle flat line
        }

        const x = i * sliceW;
        const y = v * h;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    } else if (visMode === 'vumeter') {
      // Stereo Analog Needle VU Meters (Left & Right)
      const meterW = Math.floor((w - 20) / 2);
      const meterH = h - 20;

      const time = Date.now() / 150;
      let leftAmp = 0;
      let rightAmp = 0;

      if (isPlaying) {
        if (analyserNode) {
          const data = new Uint8Array(analyserNode.frequencyBinCount);
          analyserNode.getByteFrequencyData(data);
          let sumL = 0;
          let sumR = 0;
          for (let i = 0; i < data.length / 2; i++) sumL += data[i];
          for (let i = Math.floor(data.length / 2); i < data.length; i++) sumR += data[i];
          leftAmp = (sumL / (data.length / 2)) / 255;
          rightAmp = (sumR / (data.length / 2)) / 255;
        } else {
          leftAmp = Math.abs(Math.sin(time * 1.2)) * 0.75;
          rightAmp = Math.abs(Math.sin(time * 1.4 + 0.4)) * 0.8;
        }
      }

      vuLeft = vuLeft * 0.7 + leftAmp * 0.3;
      vuRight = vuRight * 0.7 + rightAmp * 0.3;

      const drawVUMeter = (x: number, y: number, mw: number, mh: number, val: number, label: string) => {
        // Meter background dial face
        ctx.fillStyle = '#1c1f24';
        ctx.strokeStyle = '#606470';
        ctx.lineWidth = 2;
        ctx.fillRect(x, y, mw, mh);
        ctx.strokeRect(x, y, mw, mh);

        // Arc scale
        const cx = x + mw / 2;
        const cy = y + mh * 0.95;
        const radius = mh * 0.75;

        ctx.strokeStyle = '#808898';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, Math.PI * 1.2, Math.PI * 1.8);
        ctx.stroke();

        // Red danger zone
        ctx.strokeStyle = '#ff3344';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, Math.PI * 1.65, Math.PI * 1.8);
        ctx.stroke();

        // Label
        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`VU - ${label}`, cx, y + mh * 0.72);

        // Tick marks & dB text
        ctx.fillStyle = '#9098a8';
        ctx.font = '9px monospace';
        ctx.fillText('-20', cx - radius * 0.7, y + mh * 0.48);
        ctx.fillText('0 dB', cx, y + mh * 0.28);
        ctx.fillStyle = '#ff4455';
        ctx.fillText('+3', cx + radius * 0.7, y + mh * 0.48);

        // Needle angle
        const minAngle = Math.PI * 1.2;
        const maxAngle = Math.PI * 1.8;
        const angle = minAngle + Math.max(0, Math.min(1, val)) * (maxAngle - minAngle);

        const nx = cx + Math.cos(angle) * (radius * 0.92);
        const ny = cy + Math.sin(angle) * (radius * 0.92);

        // Needle line
        ctx.strokeStyle = val > 0.85 ? '#ff2233' : '#ffdd44';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 3;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Needle pivot
        ctx.fillStyle = '#silver';
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();

        // Peak warning LED
        ctx.fillStyle = val > 0.82 ? '#ff1122' : '#33080c';
        ctx.beginPath();
        ctx.arc(x + mw - 12, y + 12, 4, 0, Math.PI * 2);
        ctx.fill();
      };

      drawVUMeter(8, 10, meterW, meterH, vuLeft, 'CH 1 (LEFT)');
      drawVUMeter(12 + meterW, 10, meterW, meterH, vuRight, 'CH 2 (RIGHT)');
    }

    if (!isPlaying && !isPaused) {
      // Stopped screen message overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#8899aa';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('[ Media Player Stopped ]', w / 2, h / 2 - 6);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#556677';
      ctx.fillText('Click Play ▶ or Open File 📂 to start', w / 2, h / 2 + 12);
    }

    animId = requestAnimationFrame(renderVisualizer);
  }

  // Connect Button Event Listeners
  playBtn?.addEventListener('click', startPlayback);
  pauseBtn?.addEventListener('click', pausePlayback);
  stopBtn?.addEventListener('click', stopPlayback);
  prevBtn?.addEventListener('click', prevTrack);
  nextBtn?.addEventListener('click', nextTrack);
  rewindBtn?.addEventListener('click', rewind5s);
  forwardBtn?.addEventListener('click', forward5s);

  loopBtn?.addEventListener('click', () => {
    isLooping = !isLooping;
    audio.playClick();
    if (loopBtn) {
      loopBtn.classList.toggle('!bg-blue-900', isLooping);
      loopBtn.classList.toggle('text-white', isLooping);
      loopBtn.title = isLooping ? 'Repeat: ON (Click to toggle)' : 'Repeat: OFF (Click to toggle)';
    }
  });

  ejectBtn?.addEventListener('click', () => {
    audio.playClick();
    fileInput?.click();
  });

  trackSelect?.addEventListener('change', () => {
    stopPlayback();
    if (customFileName) {
      customFileName = null;
      if (customAudioElement) {
        customAudioElement.src = '';
        customAudioElement = null;
      }
    }
    currentTrackIdx = parseInt(trackSelect.value, 10);
    updateTrackDisplay();
    startPlayback();
  });

  seekbar?.addEventListener('input', () => {
    const pct = parseFloat(seekbar.value);
    const dur = getActiveTrackDuration();
    seekTo((pct / 100) * dur);
  });

  volumeSlider?.addEventListener('input', () => {
    setVolume(parseInt(volumeSlider.value, 10) / 100);
  });

  muteBtn?.addEventListener('click', toggleMute);
  modeOverlay?.addEventListener('click', (e) => {
    e.stopPropagation();
    cycleVisMode();
  });
  cycleVisBtn?.addEventListener('click', cycleVisMode);
  canvasContainer?.addEventListener('click', cycleVisMode);

  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (file) {
      loadCustomFile(file);
    }
  });

  // Drag and drop audio files directly into Media Player!
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  container.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('audio/') || file.name.match(/\.(mid|midi|mp3|wav|ogg|m4a|weba|flac)$/i)) {
        loadCustomFile(file);
      }
    }
  });

  // Menubar interactions
  container.querySelector('#mp-menu-file')?.addEventListener('click', () => {
    audio.playClick();
    fileInput?.click();
  });

  container.querySelector('#mp-menu-edit')?.addEventListener('click', () => {
    audio.playClick();
    cycleVisMode();
  });

  container.querySelector('#mp-menu-device')?.addEventListener('click', () => {
    audio.playClick();
    const ctx = audio.getAudioContext();
    const sr = ctx ? `${ctx.sampleRate} Hz` : '44100 Hz';
    alert(`Windows 95 Multimedia Audio Subsystem\n\nDevice: Web Audio Synthesis & Stream Engine\nSample Rate: ${sr}\nBit Depth: 16-Bit Stereo\nMIDI Hardware: Sound Blaster 16 Compatible\nActive Drivers: MMSystem.dll, WaveOut.drv`);
  });

  container.querySelector('#mp-menu-scale')?.addEventListener('click', () => {
    audio.playClick();
    alert('Scale Mode: Time (Minutes : Seconds)\nTimeline resolution: 100ms precision');
  });

  container.querySelector('#mp-menu-help')?.addEventListener('click', () => {
    audio.playClick();
    alert('Microsoft Windows 95 Media Player\nVersion 4.00.950\n\nPlays standard MIDI sequences, waveform audio files, and local audio streaming with 32-band real-time visualizer.');
  });

  // Lifecycle Cleanup on Window Close / Destroy
  const cleanupMediaPlayer = () => {
    isPlaying = false;
    isPaused = false;

    if (animId !== null) {
      cancelAnimationFrame(animId);
      animId = null;
    }

    if (synthTimer !== null) {
      clearInterval(synthTimer);
      synthTimer = null;
    }

    stopActiveOscillators();

    if (customAudioElement) {
      customAudioElement.pause();
      try {
        customAudioElement.currentTime = 0;
        customAudioElement.src = '';
      } catch (_) {}
      customAudioElement = null;
    }

    if (customAudioBlobUrl) {
      try {
        URL.revokeObjectURL(customAudioBlobUrl);
      } catch (_) {}
      customAudioBlobUrl = null;
    }

    if (masterGainNode) {
      try {
        masterGainNode.gain.setValueAtTime(0, audio.getAudioContext()?.currentTime || 0);
        masterGainNode.disconnect();
      } catch (_) {}
      masterGainNode = null;
    }

    if (analyserNode) {
      try {
        analyserNode.disconnect();
      } catch (_) {}
      analyserNode = null;
    }
  };

  // Register with Window lifecycle
  win.onClose(cleanupMediaPlayer);
  win.element.addEventListener('win95:close', cleanupMediaPlayer);
  win.element.addEventListener('DOMNodeRemovedFromDocument', cleanupMediaPlayer);

  // Initialize
  updateTrackDisplay();
  animId = requestAnimationFrame(renderVisualizer);
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

  const cleanupCDPlayer = () => {
    stopPlay();
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  win.onClose(cleanupCDPlayer);
  win.element.addEventListener('win95:close', cleanupCDPlayer);
  win.element.addEventListener('DOMNodeRemovedFromDocument', cleanupCDPlayer);
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

  const cleanupSoundRecorder = () => {
    isRecording = false;
    isPlaying = false;
    cancelAnimationFrame(animId);
  };

  win.onClose(cleanupSoundRecorder);
  win.element.addEventListener('win95:close', cleanupSoundRecorder);
  win.element.addEventListener('DOMNodeRemovedFromDocument', cleanupSoundRecorder);
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
    { name: 'My Computer', src: '/images/win95-icons/computer.png?v=1995.2' },
    { name: 'Network MSN', src: '/images/win95-icons/msn.png?v=1995.2' },
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
        <img id="iv-image" src="${initialImagePath || '/images/win95-icons/computer.png?v=1995.2'}" alt="Preview" class="max-w-full max-h-full object-contain shadow-[4px_4px_0px_#000000] border-2 border-white transition-transform duration-100" />
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

  const cleanupMIDIPlayer = () => {
    isPlayingSong = false;
    if (songTimer) {
      clearTimeout(songTimer);
      songTimer = null;
    }
  };

  win.onClose(cleanupMIDIPlayer);
  win.element.addEventListener('win95:close', cleanupMIDIPlayer);
  win.element.addEventListener('DOMNodeRemovedFromDocument', cleanupMIDIPlayer);
}
