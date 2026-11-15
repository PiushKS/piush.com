// Piush 95 Sound & Audio Synthesis Engine
// Pure Web Audio API synthesis - zero external audio assets required, guaranteed offline compatibility

class Win95AudioEngine {
  private ctx: AudioContext | null = null;
  private masterVolume = 0.8;
  private soundEffectsEnabled = true;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.soundEffectsEnabled = localStorage.getItem('retro_sound_enabled') !== 'false';
        const vol = localStorage.getItem('win95_master_volume');
        if (vol) this.masterVolume = parseFloat(vol);
      } catch (_) {}
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          this.ctx = new AudioCtxClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch (_) {
      return null;
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEffectsEnabled = enabled;
    try {
      localStorage.setItem('retro_sound_enabled', String(enabled));
    } catch (_) {}
  }

  public isSoundEnabled(): boolean {
    return this.soundEffectsEnabled;
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('win95_master_volume', String(this.masterVolume));
    } catch (_) {}
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  public playClick() {
    if (!this.soundEffectsEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.12 * this.masterVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.035);
    } catch (_) {}
  }

  public playMinimize() {
    if (!this.soundEffectsEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12 * this.masterVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch (_) {}
  }

  public playRestore() {
    if (!this.soundEffectsEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12 * this.masterVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch (_) {}
  }

  public playChord() {
    // Windows 95 Chord (Open / Info sound)
    if (!this.soundEffectsEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = ctx.currentTime;
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.03);
        gain.gain.setValueAtTime(0.08 * this.masterVolume, now + idx * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.03);
        osc.stop(now + idx * 0.03 + 0.35);
      });
    } catch (_) {}
  }

  public playDing() {
    // Windows 95 Ding (Alert sound)
    if (!this.soundEffectsEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, now); // C6
      gain.gain.setValueAtTime(0.25 * this.masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (_) {}
  }

  public playTada() {
    // Windows 95 Tada (Win / Success sound)
    if (!this.soundEffectsEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [
        { f: 587.33, d: 0.12 }, // D5
        { f: 880.0, d: 0.12 },  // A5
        { f: 783.99, d: 0.12 }, // G5
        { f: 880.0, d: 0.12 },  // A5
        { f: 1174.66, d: 0.4 }, // D6
      ];
      let t = ctx.currentTime;
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t);
        gain.gain.setValueAtTime(0.18 * this.masterVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + n.d);
        t += n.d * 0.85;
      });
    } catch (_) {}
  }

  public playError() {
    if (!this.soundEffectsEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.setValueAtTime(110, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2 * this.masterVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (_) {}
  }

  public playDTMF(digit: string) {
    if (!this.soundEffectsEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const dtmfFreqs: Record<string, [number, number]> = {
      '1': [697, 1209],
      '2': [697, 1336],
      '3': [697, 1477],
      '4': [770, 1209],
      '5': [770, 1336],
      '6': [770, 1477],
      '7': [852, 1209],
      '8': [852, 1336],
      '9': [852, 1477],
      '*': [941, 1209],
      '0': [941, 1336],
      '#': [941, 1477],
    };

    const freqs = dtmfFreqs[digit];
    if (!freqs) return;

    try {
      const now = ctx.currentTime;
      [freqs[0], freqs[1]].forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.12 * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      });
    } catch (_) {}
  }

  public async playDialUpHandshake(onProgress?: (msg: string) => void): Promise<void> {
    if (!this.soundEffectsEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Simulate 56k Modem Handshake Sequence
    const stages = [
      { msg: 'Dialing 555-0195...', duration: 600, tone: 440 },
      { msg: 'Ringing remote server...', duration: 800, tone: 480 },
      { msg: 'Answering tone detected...', duration: 700, tone: 2100 },
      { msg: 'Negotiating V.90 baud rate protocol...', duration: 900, tone: 1800 },
      { msg: 'Synchronizing carrier signal...', duration: 800, tone: 1200 },
      { msg: 'Authenticating credentials on network...', duration: 600, tone: 600 },
      { msg: 'Connected at 57,600 bps! IP Assigned.', duration: 500, tone: 880 },
    ];

    let t = ctx.currentTime;
    for (const stage of stages) {
      if (onProgress) onProgress(stage.msg);
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(stage.tone, t);
        gain.gain.setValueAtTime(0.07 * this.masterVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + stage.duration / 1000);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + stage.duration / 1000);
      } catch (_) {}
      await new Promise((r) => setTimeout(r, stage.duration));
      t = ctx.currentTime;
    }
  }
}

export const audio = new Win95AudioEngine();
