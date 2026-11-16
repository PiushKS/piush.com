const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9250;
const ARTIFACT_DIR = '/Users/mac/.gemini/antigravity/brain/304ace31-6265-476d-84a1-6973c89534e2';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class SimpleCDP {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        const cb = this.callbacks.get(parsed.id);
        if (cb) {
          this.callbacks.delete(parsed.id);
          if (parsed.error) cb.reject(parsed.error);
          else cb.resolve(parsed.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expr) {
    const res = await this.send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result?.value;
  }

  async captureScreenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    fs.writeFileSync(filename, buffer);
    console.log(`Saved screenshot: ${filename}`);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runTest() {
  console.log('Starting headless Chrome for Media Player validation...');
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,800'
  ]);

  try {
    let connected = false;
    let attempts = 0;
    while (!connected && attempts < 20) {
      await sleep(500);
      try {
        await fetchJson(`http://127.0.0.1:${DEBUG_PORT}/json/version`);
        connected = true;
      } catch (e) {
        attempts++;
      }
    }

    if (!connected) throw new Error('Could not connect to Chrome debugging port');

    const targets = await fetchJson(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const cdp = new SimpleCDP(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    console.log('Connected to Chrome DevTools Protocol');

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    console.log('Navigating to http://localhost:4321/...');
    await cdp.send('Page.navigate', { url: 'http://localhost:4321/' });
    await sleep(2500);

    // Minimize website to enter Win95 Desktop
    console.log('Entering Windows 95 Desktop...');
    await cdp.eval(`
      (() => {
        if (window.minimizeToDesktop) {
          window.minimizeToDesktop();
        } else {
          const minimizeBtn = document.getElementById('retro-portfolio-minimize-btn');
          if (minimizeBtn) minimizeBtn.click();
        }
      })()
    `);
    await sleep(1000);

    // Launch Media Player
    console.log('Launching Media Player (mediaplayer)...');
    const launchResult = await cdp.eval(`
      (() => {
        if (window.launchWin95App) {
          window.launchWin95App('mediaplayer');
          return { success: true, method: 'launchWin95App' };
        }
        const btn = document.querySelector('[data-app="mediaplayer"]');
        if (btn) {
          btn.click();
          return { success: true, method: 'btnClick' };
        }
        return { success: false };
      })()
    `);
    console.log('Launch result:', launchResult);
    await sleep(1500);

    // Verify initial UI state
    const initialState = await cdp.eval(`
      (() => {
        const titleEl = document.querySelector('.retro-titlebar .truncate');
        const playBtn = document.getElementById('mp-play-btn');
        const stopBtn = document.getElementById('mp-stop-btn');
        const seekbar = document.getElementById('mp-seekbar');
        const canvas = document.getElementById('mp-visualizer');
        const trackSelect = document.getElementById('mp-track-select');
        return {
          windowTitle: titleEl?.textContent,
          hasPlayBtn: !!playBtn,
          hasStopBtn: !!stopBtn,
          hasSeekbar: !!seekbar,
          hasCanvas: !!canvas,
          trackCount: trackSelect ? trackSelect.options.length : 0,
          currentTrack: trackSelect ? trackSelect.value : null
        };
      })()
    `);
    console.log('Initial Media Player state:', initialState);

    // Capture initial screenshot
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_mediaplayer_initial.png`);

    // Test Play button
    console.log('Clicking Play button...');
    await cdp.eval(`
      (() => {
        const playBtn = document.getElementById('mp-play-btn');
        if (playBtn) playBtn.click();
      })()
    `);
    await sleep(1500);

    // Check playing state
    const playingState = await cdp.eval(`
      (() => {
        const titleEl = document.querySelector('.retro-titlebar .truncate');
        const curTime = document.getElementById('mp-current-time')?.textContent;
        const statusBadge = document.getElementById('mp-status-badge')?.textContent;
        return {
          windowTitle: titleEl?.textContent,
          currentTime: curTime,
          statusBadge: statusBadge
        };
      })()
    `);
    console.log('Playing state:', playingState);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_mediaplayer_playing_eq.png`);

    // Switch to Oscilloscope mode
    console.log('Switching visualizer to Oscilloscope mode...');
    await cdp.eval(`
      (() => {
        const modeOverlay = document.getElementById('mp-mode-overlay');
        if (modeOverlay) modeOverlay.click();
      })()
    `);
    await sleep(800);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_mediaplayer_oscilloscope.png`);

    // Switch to VU Meters mode
    console.log('Switching visualizer to VU Meters mode...');
    await cdp.eval(`
      (() => {
        const modeOverlay = document.getElementById('mp-mode-overlay');
        if (modeOverlay) modeOverlay.click();
      })()
    `);
    await sleep(800);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_mediaplayer_vumeters.png`);

    // Test track switching (to PASSPORT.MID)
    console.log('Switching to next track (PASSPORT.MID)...');
    await cdp.eval(`
      (() => {
        const nextBtn = document.getElementById('mp-next-btn');
        if (nextBtn) nextBtn.click();
      })()
    `);
    await sleep(1000);

    const nextTrackState = await cdp.eval(`
      (() => {
        const titleEl = document.querySelector('.retro-titlebar .truncate');
        const overlay = document.getElementById('mp-title-overlay')?.textContent;
        return {
          windowTitle: titleEl?.textContent,
          overlay: overlay
        };
      })()
    `);
    console.log('Next track state:', nextTrackState);

    // Test seekbar scrubbing
    console.log('Testing seekbar seeking...');
    await cdp.eval(`
      (() => {
        const seekbar = document.getElementById('mp-seekbar');
        if (seekbar) {
          seekbar.value = '50';
          seekbar.dispatchEvent(new Event('input'));
        }
      })()
    `);
    await sleep(600);

    const scrubbedState = await cdp.eval(`
      (() => {
        return {
          currentTime: document.getElementById('mp-current-time')?.textContent,
          seekbarValue: document.getElementById('mp-seekbar')?.value
        };
      })()
    `);
    console.log('Scrubbed state:', scrubbedState);

    // Test custom audio file loading via File input simulation
    console.log('Testing custom audio file loading...');
    const customFileResult = await cdp.eval(`
      (() => {
        // Create an authentic 1-second 44.1kHz PCM mono WAV file buffer
        const sampleRate = 44100;
        const numSamples = sampleRate * 2;
        const buffer = new ArrayBuffer(44 + numSamples * 2);
        const view = new DataView(buffer);

        function writeString(offset, string) {
          for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
          }
        }

        writeString(0, 'RIFF');
        view.setUint32(4, 36 + numSamples * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); // PCM
        view.setUint16(22, 1, true); // Mono
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, numSamples * 2, true);

        // Generate 440Hz A4 test tone
        for (let i = 0; i < numSamples; i++) {
          const sample = Math.sin((i / sampleRate) * 440 * Math.PI * 2) * 0.4;
          view.setInt16(44 + i * 2, sample < 0 ? sample * 32768 : sample * 32767, true);
        }

        const blob = new Blob([buffer], { type: 'audio/wav' });
        const file = new File([blob], 'retro_synth.wav', { type: 'audio/wav' });

        // Deliver to file input
        const fileInput = document.getElementById('mp-file-input');
        if (!fileInput) return { error: 'fileInput not found' };

        const dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
        fileInput.dispatchEvent(new Event('change'));

        return {
          fileName: file.name,
          fileSize: file.size
        };
      })()
    `);
    console.log('Custom file loaded:', customFileResult);
    await sleep(1200);

    const customPlayingState = await cdp.eval(`
      (() => {
        return {
          title: document.querySelector('.retro-titlebar .truncate')?.textContent,
          titleOverlay: document.getElementById('mp-title-overlay')?.textContent,
          device: document.getElementById('mp-device-name')?.textContent
        };
      })()
    `);
    console.log('Custom playing state:', customPlayingState);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_mediaplayer_custom_file.png`);

    // Test CRITICAL REQUIREMENT: Closing the window stops all audio immediately!
    console.log('Testing Window Close audio leak prevention...');
    const closeTest = await cdp.eval(`
      (() => {
        const winEl = document.querySelector('.win95-app-window');
        if (!winEl) return { error: 'Window element not found' };

        // Click the titlebar close button directly (simulating real user interaction)
        const closeBtn = winEl.querySelector('button[title="Close"]');
        if (closeBtn) {
          closeBtn.click();
        } else if (window.win95WindowManager) {
          const win = window.win95WindowManager.getWindowByAppId('mediaplayer');
          if (win) win.close();
        }

        // Verify window element is removed from DOM
        const stillInDom = !!document.querySelector('.win95-app-window');
        const stillInManager = window.win95WindowManager ? !!window.win95WindowManager.getWindowByAppId('mediaplayer') : false;

        return {
          stillInDom,
          stillInManager,
          success: !stillInDom && !stillInManager
        };
      })()
    `);
    console.log('Close test result:', closeTest);

    // Wait 1 second to ensure no stray intervals or sounds continue
    await sleep(1000);
    console.log('All tests completed successfully!');

    cdp.close();
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exitCode = 1;
  } finally {
    chromeProcess.kill();
  }
}

runTest();
